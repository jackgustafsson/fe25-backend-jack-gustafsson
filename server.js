'use strict';

// The main file that starts the FilmRecension API and connects Express with the project's routes.
// Handles incoming JSON data, registers the API's various route files, and listens on the specified port. 
// Also contains a 404 handler for routes that do not exist.

const express = require('express');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const movieRoutes = require('./routes/movieRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to FilmRecension API' });
});

app.use('/api', authRoutes);
app.use('/api', movieRoutes);
app.use('/api', reviewRoutes);
app.use('/api', watchlistRoutes);

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.listen(PORT, () => {
    console.log(`FilmRecension API running on port ${PORT}`);
});