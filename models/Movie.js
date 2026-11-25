'use strict';

class Movie {
    constructor(id, title, genre, releaseYear) {
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.releaseYear = releaseYear;
    }

    static fromRow(row) {
        return new Movie(row.id, row.title, row.genre, row.release_year);
    }
}

module.exports = Movie;