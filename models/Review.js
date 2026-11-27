'use strict';

// The Review class represents a review that a user has written about a movie.
class Review {
    constructor(id, userId, movieId, rating, comment) {
        this.id = id;
        this.userId = userId;
        this.movieId = movieId;
        this.rating = rating;
        this.comment = comment;
    }

    // Checks that the rating is an integer between 1 and 10.
    isValidRating() {
        return Number.isInteger(this.rating) && this.rating >= 1 && this.rating <= 10;
    }
}

module.exports = Review;