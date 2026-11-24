'use strict';

const express = require('express');
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/auth/register', async (req, res) => {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 12);

        const [result] = await pool.execute(
            'INSERT INTO users (email, password_hash) VALUES (?, ?)', [normalizedEmail, passwordHash]
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: result.insertId,
                email: normalizedEmail
            }
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Email is already registered' });
        }

        console.error('Could not register user:', error.message);
        res.status(500).json({ error: 'Could not register user' });
    }
});


router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
        const [users] = await pool.execute(
            'SELECT id, email, password_hash FROM users WHERE email = ?', [normalizedEmail]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = users[0];
        const passwordMatches = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatches) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not configured');
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Could not log in:', error.message);
        res.status(500).json({ error: 'Could not log in' });
    }
});

module.exports = router;