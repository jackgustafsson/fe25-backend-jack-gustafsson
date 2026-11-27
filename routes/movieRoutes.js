'use strict';

const express = require('express');
const pool = require('../config/db');
const Movie = require('../models/Movie');
const router = express.Router();

// GET /movies
// Retrieves all movies from the database and converts each database row into a Movie object using Movie.fromRow().
// Returns the movies as JSON.
router.get('/movies', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, title, genre, release_year FROM movies');
        const movies = rows.map(row => Movie.fromRow(row));
        res.status(200).json(movies);

    } catch (error) {
        console.error('Could not fetch movies:', error.message);
        res.status(500).json({ error: 'Could not fetch movies' });
    }
});

// GET /movies/:id
// Retrieves a specific movie based on its ID.
// Checks that the ID number is valid and that the movie exists in the database.
// If the movie is found, it is converted to a Movie object and returned as JSON.
router.get('/movies/:id', async (req, res) => {
    const movieId = Number(req.params.id);

    if (!Number.isInteger(movieId) || movieId <= 0) {
        return res.status(400).json({ error: 'Invalid movie ID' });
    }

    try {
        const [rows] = await pool.execute(
            `SELECT id, title, genre, release_year FROM movies WHERE id = ?`, [movieId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        const movie = Movie.fromRow(rows[0]);
        res.status(200).json(movie);

    } catch (error) {
        console.error('Could not fetch movie:', error.message);
        res.status(500).json({ error: 'Could not fetch movie' });
    }
});

module.exports = router;