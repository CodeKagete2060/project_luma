# MERN Stack Application

## Setup Instructions

1. Clone this repository
2. Copy `.env.example` to `.env` and update the environment variables
3. Install dependencies:
   ```bash
   npm run install-all
   ```

## Development

To run both frontend and backend in development mode:
```bash
npm run dev
```

To run only the backend:
```bash
npm run server
```

To run only the frontend:
```bash
npm run client
```

## Project Structure

```
root/
 ├── client/           # React frontend
 │    ├── src/         # Source files
 │    ├── public/      # Static files
 │    └── package.json # Frontend dependencies
 ├── server/           # Express backend
 │    ├── src/         # Source files
 │    └── package.json # Backend dependencies
 ├── .env.example      # Example environment variables
 ├── package.json      # Root dependencies and scripts
 └── README.md         # This file
```