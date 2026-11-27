'use strict';

const mysql = require('mysql2/promise');
require('dotenv').config();

// Creates a connection pool that handles connections to the MySQL database.
// The database details are retrieved from the .env file to avoid writing sensitive information directly into the code.
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true, // Waits for a free connection if all are busy.
    connectionLimit: 10 // Limits the number of simultaneous database connections.
});

module.exports = pool;