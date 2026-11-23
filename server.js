'use strict';

const express = require('express');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to FilmRecension API' });
});

app.get('/api/movies', async (req, res) => {
    try {
        const [movies] = await pool.query('SELECT id, title, genre, release_year FROM movies');
        res.status(200).json(movies);
    } catch (error) {
        console.error('Could not fetch movies:', error.message);
        res.status(500).json({ error: 'Could not fetch movies' });
    }
});

app.listen(PORT, () => {
    console.log(`FilmRecension API running on port ${PORT}`);
});
