
'use strict';

const express = require('express');
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// GET /watchlist
// Retrieves the logged-in user's watchlist and associated movie information.
// JOIN is used to combine information from the watchlist and movies tables.
router.get('/watchlist', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const [movies] = await pool.execute(
            `SELECT movies.id, movies.title, movies.genre, movies.release_year, watchlist.added_at
             FROM watchlist JOIN movies ON watchlist.movie_id = movies.id
             WHERE watchlist.user_id = ? ORDER BY watchlist.added_at DESC`, [userId]
        );

        res.status(200).json(movies);

    } catch (error) {
        console.error('Could not fetch watchlist:', error.message);
        res.status(500).json({ error: 'Could not fetch watchlist' });
    }
});

// POST /watchlist/:movieId
// Adds a movie to the logged in user's watchlist.
// Checks that the movie ID is valid and that the movie exists in the database.
router.post('/watchlist/:movieId', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const movieId = Number(req.params.movieId);

    if (!Number.isInteger(movieId) || movieId <= 0) {
        return res.status(400).json({ error: 'Invalid movie ID' });
    }

    try {
        const [movies] = await pool.execute('SELECT id FROM movies WHERE id = ?', [movieId]);

        if (movies.length === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        await pool.execute('INSERT INTO watchlist (user_id, movie_id) VALUES (?, ?)', [userId, movieId]);

        res.status(201).json({
            message: 'Movie added to watchlist',
            movieId: movieId
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Movie is already in your watchlist' });
        }

        console.error('Could not add movie to watchlist:', error.message);
        res.status(500).json({ error: 'Could not add movie to watchlist' });
    }
});

// DELETE /watchlist/:movieId
// Removes a movie from the logged in user's watchlist.
// Checks that the movie is in the user's list before confirming the deletion.
router.delete('/watchlist/:movieId', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const movieId = Number(req.params.movieId);

    if (!Number.isInteger(movieId) || movieId <= 0) {
        return res.status(400).json({ error: 'Invalid movie ID' });
    }

    try {
        const [result] = await pool.execute(
            'DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?', [userId, movieId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Movie not found in your watchlist' });
        }

        res.status(200).json({
            message: 'Movie removed from watchlist',
            movieId: movieId
        });

    } catch (error) {
        console.error('Could not remove movie from watchlist:', error.message);
        res.status(500).json({ error: 'Could not remove movie from watchlist' });
    }
});


module.exports = router;
