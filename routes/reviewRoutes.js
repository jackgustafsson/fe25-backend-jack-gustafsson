'use strict';

const express = require('express');
const pool = require('../config/db');
const Review = require('../models/Review');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// GET /movies/:movieId/reviews
// Retrieves all reviews for a specific movie.
// First checks that the movie ID is valid and that the movie exists in the database.
// The reviews are sorted so that the most recently created ones are displayed first.
router.get('/movies/:movieId/reviews', async (req, res) => {
    const movieId = Number(req.params.movieId);

    if (!Number.isInteger(movieId) || movieId <= 0) {
        return res.status(400).json({ error: 'Invalid movie ID' });
    }

    try {
        const [movies] = await pool.execute('SELECT id FROM movies WHERE id = ?', [movieId]);

        if (movies.length === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        const [reviews] = await pool.execute(
            `SELECT id, user_id, movie_id, rating, comment
             FROM reviews WHERE movie_id = ? ORDER BY id DESC`, [movieId]
        );

        res.status(200).json(reviews);

    } catch (error) {
        console.error('Could not fetch reviews:', error.message);
        res.status(500).json({ error: 'Could not fetch reviews' });
    }
});

// POST /movies/:movieId/reviews
// Creates a new review for a specific movie.
// Requires the user to be logged in and that the movie ID, rating, and comment are valid. 
// Uses the Review class to check the rating before saving the review to the database.
// Each user is only allowed to create one review per movie.
router.post('/movies/:movieId/reviews', authenticateToken, async (req, res) => {
    const movieId = Number(req.params.movieId);
    const userId = req.user.id;
    const { rating, comment } = req.body;

    if (!Number.isInteger(movieId) || movieId <= 0) {
        return res.status(400).json({ error: 'Invalid movie ID' });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
        return res.status(400).json({ error: 'Rating must be an integer between 1 and 10' });
    }

    if (typeof comment !== 'string' || comment.trim().length === 0) {
        return res.status(400).json({ error: 'Comment is required' });
    }

    if (comment.trim().length > 2000) {
        return res.status(400).json({ error: 'Comment must not exceed 2000 characters' });
    }

    try {
        const [movies] = await pool.execute('SELECT id FROM movies WHERE id = ?', [movieId]);

        if (movies.length === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        const review = new Review(null, userId, movieId, rating, comment.trim());

        if (!review.isValidRating()) {
            return res.status(400).json({ error: 'Invalid rating' });
        }

        const [result] = await pool.execute(
            `INSERT INTO reviews (user_id, movie_id, rating, comment) VALUES (?, ?, ?, ?)`,
            [review.userId, review.movieId, review.rating, review.comment]
        );

        res.status(201).json({
            message: 'Review created successfully',
            review: {
                id: result.insertId,
                user_id: review.userId,
                movie_id: review.movieId,
                rating: review.rating,
                comment: review.comment
            }
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'You have already reviewed this movie' });
        }

        console.error('Could not create review:', error.message);
        res.status(500).json({ error: 'Could not create review' });
    }
});

// PATCH /reviews/:id
// Updates an existing review.
// Requires the user to be logged in and that the review belongs to the user.
// The user can change the rating, comment, or both.
// Validates the input and checks ownership before saving the change.
// Returns the updated review as JSON.
router.patch('/reviews/:id', authenticateToken, async (req, res) => {
    const reviewId = Number(req.params.id);
    const userId = req.user.id;
    const hasRating = Object.hasOwn(req.body, 'rating');
    const hasComment = Object.hasOwn(req.body, 'comment');

    if (!Number.isInteger(reviewId) || reviewId <= 0) {
        return res.status(400).json({ error: 'Invalid review ID' });
    }

    if (!hasRating && !hasComment) {
        return res.status(400).json({ error: 'Rating or comment is required' });
    }

    if (hasRating) {
        const { rating } = req.body;

        if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
            return res.status(400).json({ error: 'Rating must be an integer between 1 and 10' });
        }
    }

    if (hasComment) {
        const { comment } = req.body;

        if (typeof comment !== 'string' || comment.trim().length === 0) {
            return res.status(400).json({ error: 'Comment cannot be empty' });
        }

        if (comment.trim().length > 2000) {
            return res.status(400).json({ error: 'Comment must not exceed 2000 characters' });
        }
    }

    try {
        const [reviews] = await pool.execute('SELECT id, user_id FROM reviews WHERE id = ?', [reviewId]);

        if (reviews.length === 0) {
            return res.status(404).json({ error: 'Review not found' });
        }

        const review = reviews[0];

        if (review.user_id !== userId) {
            return res.status(403).json({ error: 'You are not allowed to edit this review' });
        }

        if (hasRating && hasComment) {
            await pool.execute(
                `UPDATE reviews SET rating = ?, comment = ? WHERE id = ? AND user_id = ?`,
                [req.body.rating, req.body.comment.trim(), reviewId, userId]
            );
        } else if (hasRating) {
            await pool.execute(
                `UPDATE reviews SET rating = ? WHERE id = ? AND user_id = ?`,
                [req.body.rating, reviewId, userId]
            );
        } else {
            await pool.execute(
                `UPDATE reviews SET comment = ? WHERE id = ? AND user_id = ?`,
                [req.body.comment.trim(), reviewId, userId]
            );
        }

        const [updatedReviews] = await pool.execute(
            `SELECT id, user_id, movie_id, rating, comment
                 FROM reviews WHERE id = ?`, [reviewId]
        );

        res.status(200).json({
            message: 'Review updated successfully',
            review: updatedReviews[0]
        });

    } catch (error) {
        console.error('Could not update review:', error.message);

        res.status(500).json({ error: 'Could not update review' });
    }
});

module.exports = router;