# riya.io — Login Authentication Demo

A learning project exploring a simple authentication API built with **Node.js, Express, MongoDB, bcrypt, and JSON Web Tokens (JWT)**.

## Features

- Register users with passwords hashed using bcrypt
- Log in by checking a submitted password against the stored hash
- Issue a JWT that expires after one hour
- Validate required registration and login inputs
- Read the JWT signing secret and MongoDB connection string from environment variables

## Requirements

- Node.js and npm
- MongoDB running locally, or a MongoDB connection string
- A JWT secret stored outside source code

## Run locally

1. Clone the repository and enter the project directory:

   ```bash
   git clone https://github.com/Reah3267/riya.io.git
   cd riya.io
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set the environment variables in your terminal. Do not commit real secrets.

   **PowerShell:**

   ```powershell
   $env:JWT_SECRET = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   $env:MONGODB_URI = "mongodb://localhost:27017/login_app"
   ```

   **Bash (Linux/macOS):**

   ```bash
   export JWT_SECRET="$(openssl rand -hex 32)"
   export MONGODB_URI="mongodb://localhost:27017/login_app"
   ```

4. Start MongoDB, then start the API:

   ```bash
   npm start
   ```

   The server listens on port 3000 by default. Set `PORT` to override it.

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/register` | Register a username and password (minimum 8 characters) |
| POST | `/login` | Verify credentials and return a signed JWT |

Both endpoints expect a JSON request body. Example registration body:

```json
{
  "username": "demo-user",
  "password": "change-this-password"
}
```

A successful login returns a JSON object containing `token`. This demo does not yet include a protected route that verifies the token.

## Security and learning notes

- Never commit real JWT secrets, database credentials, or `.env` files.
- If a real JWT secret was ever used in a public repository, replace it in the deployment environment too.
- The API is a learning project, not production-ready authentication. Before production use, add HTTPS, rate limiting, stronger request/schema validation, token verification on protected routes, and appropriate session/token storage.
- The repository's `.gitignore` prevents new untracked dependencies from being added, but it does not remove `node_modules` files that are already tracked in Git history. Those need a separate cleanup commit.

## Tech stack

Node.js · Express · MongoDB/Mongoose · bcrypt · JSON Web Token
