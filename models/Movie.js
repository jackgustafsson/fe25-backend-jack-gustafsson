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

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            genre: this.genre,
            release_year: this.releaseYear
        };
    }
}

module.exports = Movie;