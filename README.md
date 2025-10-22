# Project LUMA

## Project Overview
Project LUMA is a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Development Progress

### Day 1: Setup & Foundation ✅
- Initialized project structure
  - Created React client application
  - Set up Express server directory
- Installed core dependencies:
  - **Server**: express, mongoose, cors, dotenv, bcryptjs, jsonwebtoken
  - **Client**: axios, react-router-dom, @tanstack/react-query
- Set up MongoDB Atlas connection
- Basic Express server configuration

## Project Structure
```
project_luma/
├── client_frontend/           # React frontend application
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
│
└── server/                    # Express backend server
    └── package.json
```

## Technologies Used
- **Frontend**
  - React.js
  - React Router DOM
  - Axios
  - TanStack React Query
- **Backend**
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JSON Web Token for authentication
  - bcryptjs for password hashing

## Getting Started

### Prerequisites
- Node.js
- npm
- MongoDB Atlas account

### Installation
1. Clone the repository
```bash
git clone https://github.com/CodeKagete2060/Project_LUMA.git
cd project_luma
```

2. Install server dependencies
```bash
cd server
npm install
```

3. Install client dependencies
```bash
cd ../client_frontend
npm install
```

4. Create a `.env` file in the server directory and add your MongoDB connection string:
```
MONGODB_URI=your_mongodb_connection_string
```

## Development Status
- [x] Day 1: Project Setup and Foundation
- [ ] Day 2: TBD
- [ ] Day 3: TBD

## Contributing
This is a development project by CodeKagete2060.

---
*This README will be updated daily as the project progresses.*