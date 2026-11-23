CREATE DATABASE IF NOT EXISTS filmrecension CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE filmrecension;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(120) NOT NULL,
    genre VARCHAR(50),
    release_year INT
);

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

CREATE TABLE watchlist (
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    PRIMARY KEY (user_id, movie_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE
);

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