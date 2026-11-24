'use strict';

class Review {
    constructor(id, userId, movieId, rating, comment) {
        this.id = id;
        this.userId = userId;
        this.movieId = movieId;
        this.rating = rating;
        this.comment = comment;
    }

    isValidRating() {
        return Number.isInteger(this.rating) && this.rating >= 1 && this.rating <= 10;
    }
}

module.exports = Review;
