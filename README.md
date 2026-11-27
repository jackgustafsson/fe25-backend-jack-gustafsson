# FilmRecension

FilmRecension is a REST API for a movie catalog and personal movie watchlists. Users can register and log in, browse movies, write and update reviews, and manage their own watchlist.

The API is built with Node.js, Express, and MySQL. It uses JWT authentication to protect routes that require a logged-in user.

## Features
* User registration and login
* Password hashing with bcrypt
* JWT-based authentication
* Browse all movies and view individual movies
* Create and update movie reviews
* Add and remove movies from a personal watchlist
* MySQL database with parameterized queries
* User ownership checks for reviews and watchlists

## Technologies
* Node.js
* Express
* MySQL
* mysql2
* bcrypt
* jsonwebtoken
* dotenv

## Installation
**1. Clone the repository**

Open your terminal (Terminal on macOS/Linux or Command Prompt/PowerShell on Windows) and run:
```
git clone <repository-url>
cd FilmRecension
```
**2. Install Node.js and npm**

Make sure Node.js and npm are installed on your system.

Windows:
1. Download Node.js from https://nodejs.org/.
2. Choose the LTS version.
3. Run the installer and follow the installation instructions.
4. Open Command Prompt or PowerShell and verify the installation:
```
node -v
npm -v
```
macOS:
1. Download Node.js from https://nodejs.org/.
2. Choose the LTS version and download the macOS installer.
3. Open the downloaded .pkg file and follow the installation instructions.
4. Open Terminal and verify the installation:
```
node -v
npm -v
```
Alternatively, Node.js can be installed using Homebrew:
```
brew install node
```
Linux (Ubuntu/Debian):

1. Open Terminal.
2. Update the package list:
```
sudo apt update
```
3. Install Node.js and npm:
```
sudo apt install nodejs npm
```
4. Verify the installation:
```
node -v
npm -v
```
For other Linux distributions, use the appropriate package manager or download Node.js from https://nodejs.org/.

**3. Install dependencies**

Navigate to the FilmRecension project directory and run:
```
npm install
```
This installs the dependencies listed in package.json.

**3. Configure enviroment variables**

Create an .env file in the project root by copying .env.example.

Add your own MySQL connection details and a secure JWT secret.
```
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=filmrecension
PORT=3000
JWT_SECRET=your_secure_jwt_secret
```
Do not commit your .env file or share real passwords and secrets.

## Database Setup
**1. Create the database and tables**

Open MySQL and execute the SQL script:
```
database/setup.sql
```
The script creates the database tables required by the API:
* users
* movies
* reviews
* watchlist

The users table stores user accounts and hashed passwords. The movies table stores movie information. The reviews table stores user reviews, and the watchlist table stores the relationship between users and their saved movies.

**2. Configure the database connection**

Make sure the database name, username, password, and host in your .env file match your local MySQL configuration.

## Start the Server

Start the API from the project root:
```
node server.js
```
The server runs on the port specified in .env, or port 3000 by default.

The API base URL is:
```
http://localhost:3000/api
```

## API Routes

**Authentication**

| Method | Endpoint | Description |
| -------- | -------- | ----------- |
| POST   | /api/auth/register   | Register a new user |
| POST   | /api/auth/login    | Log in and receive a JWT |

**Movies**

| Method | Endpoint | Description |
| -------- | -------- | ----------- |
| GET   | /api/movies   | Get all movies |
| GET   | /api/movies/:id    | Get a movie by ID |

**Reviews**

| Method | Endpoint | Description |
| -------- | -------- | ----------- |
| GET   | /api/movies/:movieId/reviews   | Get reviews for a movie |
| POST   | /api/movies/:movieId/reviews    | Create a review for a movie |
| PATCH   | /api/reviews/:id    | Update your own review |

**Watchlist**

| Method | Endpoint | Description |
| -------- | -------- | ----------- |
| GET   | /api/watchlist   | Get the logged-in user's watchlist |
| POST   | /api/watchlist/:movieId    | Add a movie to the watchlist |
| PATCH   | /api/watchlist/:movieId    | Remove a movie from the watchlist |

## Authentication

Routes that require authentication use a JWT token.

1. Register an account using /api/auth/register.
2. Log in using /api/auth/login.
3. Copy the token from the login response.
4. Include the token in the Authorization header for protected routes.

Use the following header:
```
Authorization: Bearer <your_jwt_token>
```
Users can only update their own reviews and manage their own watchlists.

## Example Requests

**Register**
```
POST /api/auth/register
Content-Type: application/json
```
```
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```
**Login**
```
POST /api/auth/login
Content-Type: application/json
```
```
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```
**Create a review**
```
POST /api/movies/1/reviews
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```
```
{
  "rating": 9,
  "comment": "A really good movie!"
}
```
**Add a movie to the watchlist**
```
{
POST /api/watchlist/1
Authorization: Bearer <your_jwt_token>
```
## Error handling

The API uses standard HTTP status codes, including:

* 200 OK – Request successful
* 201 Created – Resource created
* 400 Bad Request – Invalid input
* 401 Unauthorized – Missing, invalid, or expired token
* 403 Forbidden – User is not allowed to perform the action
* 404 Not Found – Resource not found
* 409 Conflict – Resource already exists
* 500 Internal Server Error – Unexpected server error

## Project structure
```
FilmRecension/
├── config/
│   └── db.js
├── middleware/
│   └── auth.js
├── models/
│   ├── Movie.js
│   └── Review.js
├── routes/
│   ├── authRoutes.js
│   ├── movieRoutes.js
│   ├── reviewRoutes.js
│   └── watchlistRoutes.js
├── database/
│   └── setup.sql
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

## Security

* Passwords are hashed using bcrypt.
* JWT tokens are used to authenticate users.
* SQL queries use parameterized statements.
* Protected routes verify the user's identity.
* Users can only modify resources they own.
* Environment variables are used for database credentials and JWT secrets.


