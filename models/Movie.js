'use strict';

// The Movie class represents a movie and stores its properties.
// It is used to create movie objects based on information from the database.
class Movie {
    constructor(id, title, genre, releaseYear) {
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.releaseYear = releaseYear;
    }

    // Static method that converts a database row to a Movie object.
    // Also adapts the database's release_year to the JavaScript's releaseYear.
    static fromRow(row) {
        return new Movie(row.id, row.title, row.genre, row.release_year);
    }
}

module.exports = Movie;