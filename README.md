# Student Management System

A full-stack student administration application built with React + Vite, Express, MongoDB/Mongoose, and JWT authentication. It includes student CRUD, search, dashboard summaries, API documentation, tests, and UML source diagrams.

## Features
- Register and log in with hashed passwords and JWT authentication.
- Protected dashboard and student-management pages.
- Create, view, edit, search, and delete student records.
- Server-side validation, duplicate roll-number checks, pagination, and consistent JSON errors.
- MongoDB persistence; the app does not silently switch to mock/local data if MongoDB is unavailable.
- OpenAPI specification and Swagger UI at `/api-docs`.
- UML diagrams and project report in `docs/`.

## Prerequisites
- [Node.js](https://nodejs.org/) 20 LTS or newer (includes npm).
- MongoDB Community Server running locally, or a MongoDB Atlas connection string.
- Git, to clone the repository.

Visual Studio Code and MongoDB Compass are optional but recommended.

## Setup
1. Clone the project and enter its folder:

   ```powershell
   git clone <YOUR_REPOSITORY_URL>
   cd student-management-system
   ```

2. Install the root and application dependencies:

   ```powershell
   npm install
   npm run install:all
   ```

3. Create your private backend environment file:

   ```powershell
   Copy-Item backend/.env.example backend/.env
   ```

4. Edit `backend/.env`. For a local MongoDB installation, use:

   ```env
   MONGODB_URI=mongodb://localhost:27017/student_management
   JWT_SECRET=replace-this-with-a-unique-secret-of-at-least-24-characters
   ```

   For MongoDB Atlas, replace the example `MONGODB_URI` with your own connection string. URL-encode credentials when necessary. Never commit `backend/.env`.

5. Ensure MongoDB is running, then start the frontend and backend:

   ```powershell
   npm run dev
   ```

6. Visit `http://localhost:5173`, register an account, and sign in.

For a fuller clone-to-run walkthrough, see [docs/SETUP.md](docs/SETUP.md).

### Windows PowerShell example
```powershell
Copy-Item backend/.env.example backend/.env
npm install
npm run install:all
npm run dev
```

If PowerShell blocks scripts, use Command Prompt or adjust your local execution policy only if you understand the implications. Do not commit `.env` to source control.

## Environment variables
See `backend/.env.example`:
- `PORT`: Express port (default 5000)
- `MONGODB_URI`: local MongoDB URI such as `mongodb://localhost:27017/student_management`, or an Atlas URI
- `JWT_SECRET`: long, random secret; replace the example
- `JWT_EXPIRES_IN`: token lifetime
- `CLIENT_ORIGIN`: frontend origin (default `http://localhost:5173`)

## Useful commands
- `npm run dev` — frontend and backend development servers
- `npm run build` — production frontend build
- `npm run test:backend` — backend tests (requires test dependencies; tests that use a database require a reachable test MongoDB URI)
- `npm run seed --prefix backend` — create sample student records for an existing user (see `backend/scripts/seed.js`)

## API and diagrams
- Swagger UI: `http://localhost:5000/api-docs`
- OpenAPI: `docs/openapi.yaml`
- UML sources: `docs/uml/`
- Project report: `docs/PROJECT_REPORT.md`
- Database design: `docs/DATABASE.md`

## MongoDB Compass
1. Open MongoDB Compass.
2. For local MongoDB, connect to `mongodb://localhost:27017`. For Atlas, use the same Atlas connection URI configured in `backend/.env` (keep it private).
3. Connect and select database `student_management`. The database/collections may not appear until the application successfully writes its first records.
4. Register a user and create a student record through the app, then refresh Compass and inspect the `users` and `students` collections.

If you see `ECONNREFUSED 127.0.0.1:27017`, the MongoDB server is not running or is listening on a different port. Start the MongoDB Windows service from Services, or start `mongod` using your configured data directory. Compass is a client and does not itself start the database server.

## Troubleshooting
- **MongoDB connection failure:** check `MONGODB_URI`, Atlas Network Access (your current IP), Database Access credentials/permissions, and backend terminal output. For Atlas, use the `mongodb+srv://` URI from Atlas and ensure the database name is included in the path.
- **Port already in use:** change `PORT` in `backend/.env` or close the process using the port.
- **CORS error:** set `CLIENT_ORIGIN` to the exact frontend origin, including scheme and port.
- **401 Unauthorized:** sign in again; the JWT is stored in session storage and expires.
- **No records in Compass:** confirm the database name in `MONGODB_URI`, create a record through the app, then refresh Compass.
- **Swagger unavailable:** ensure the backend is running and visit `http://localhost:5000/api-docs`.

## Verification status
This package contains implementation, test definitions, and setup instructions. Runtime tests, database persistence, screenshots, and production deployment must be verified in an environment with Node.js dependencies installed and MongoDB available. Do not treat unexecuted tests as passing. See `docs/TESTING.md`.
