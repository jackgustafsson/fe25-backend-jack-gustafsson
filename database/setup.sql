-- Creates the database if it doesn't already exist.
-- utf8mb4 is used to support different types of characters.
CREATE DATABASE IF NOT EXISTS filmrecension CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Selects the database in which the tables will be created.
USE filmrecension;

-- The users table stores registered users.
-- Passwords are stored as hashed values, not in clear text.
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

-- The movies table contains information about the movies.
CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(120) NOT NULL,
    genre VARCHAR(50),
    release_year INT
);

-- The reviews table links users to movies and their reviews.
-- Each user can only have one review per movie.
-- Ratings are limited to values ​​between 1 and 10.
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    CONSTRAINT chk_review_rating CHECK (rating BETWEEN 1 AND 10),
    CONSTRAINT unique_user_movie_review UNIQUE (user_id, movie_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE
);

-- The watchlist table connects users to movies they want to watch.
-- The composite primary key prevents the same movie from being added multiple times by the same user.
-- added_at automatically records when the movie is added.
CREATE TABLE watchlist (
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, movie_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE
);

-- Adding some example movies so that the API can be tested immediately after the database is created.
INSERT INTO
    movies (title, genre, release_year)
VALUES (
        'The Dark Knight',
        'Action',
        2008
    ),
    ('Inception', 'Sci-Fi', 2010),
    (
        'Interstellar',
        'Sci-Fi',
        2014
    );