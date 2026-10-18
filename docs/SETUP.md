# Setup Guide

Use this guide to run the Student Management System after cloning the repository.

## 1. Install prerequisites

Install the following before continuing:

- Node.js 20 LTS or later from [nodejs.org](https://nodejs.org/)
- MongoDB Community Server, or access to a MongoDB Atlas cluster
- Git

Confirm Node.js and npm are available:

```powershell
node --version
npm --version
```

## 2. Clone the repository

```powershell
git clone <YOUR_REPOSITORY_URL>
cd student-management-system
```

Replace `<YOUR_REPOSITORY_URL>` with the repository's clone URL.

## 3. Install dependencies

Run these commands from the project root:

```powershell
npm install
npm run install:all
```

The first command installs the root development tools; the second installs the backend and frontend packages.

## 4. Configure the backend

Create a private environment file from the template:

```powershell
Copy-Item backend/.env.example backend/.env
```

Open `backend/.env` and set the following values for local MongoDB:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student_management
JWT_SECRET=use-a-new-random-secret-with-at-least-24-characters
JWT_EXPIRES_IN=2h
CLIENT_ORIGIN=http://localhost:5173
```

`backend/.env` is ignored by Git. Keep its contents private, especially database credentials and `JWT_SECRET`.

### Using MongoDB Atlas instead

Replace `MONGODB_URI` with your Atlas connection string, including the database name. Ensure your Atlas database user has access and your current IP address is allowed in Atlas Network Access.

## 5. Start MongoDB

If you are using a local MongoDB installation, start its Windows service before launching the app. The default local address is `mongodb://localhost:27017`.

With Atlas, no local MongoDB service is needed.

## 6. Run the application

From the project root, start both services:

```powershell
npm run dev
```

Open `http://localhost:5173` in a browser. The API runs on `http://localhost:5000` and its Swagger documentation is available at `http://localhost:5000/api-docs`.

Create an account, sign in, and add a student record to confirm persistence works.

## Useful commands

```powershell
npm run test:backend
npm run build
npm run seed --prefix backend
```

The seed command requires a reachable database and an existing user. See `backend/scripts/seed.js` for its options.

## Troubleshooting

- **`ECONNREFUSED 127.0.0.1:27017`**: MongoDB is not running locally. Start the MongoDB Windows service, or use a valid Atlas URI.
- **Backend says `MONGODB_URI is not configured`**: create `backend/.env` from `backend/.env.example` and set the URI.
- **Backend says to set a strong `JWT_SECRET`**: replace the placeholder in `backend/.env` with a unique string at least 24 characters long.
- **Port already in use**: stop the other application using port 5000 or 5173, or change `PORT` in `backend/.env`.
- **Atlas connection error**: verify the URI, database-user permissions, and Atlas Network Access IP allowlist.
