Voting App

A simple and secure voting application built using Node.js, Express, MongoDB, and JWT Authentication.
Users can register, login, vote for candidates, and prevent multiple votes.

🚀 Features
👤 User


User Signup (password hashed with bcrypt)


User Login (JWT authentication)


Prevent a user from voting multiple times


👑 Admin


Add new candidates


View all candidates


View vote counts


🗳️ Voting


Authenticated users can vote for ONE candidate


Prevent repeat voting


Stores voter + candidate relationship



🏗️ Project Structure
voting-app/
│
├── routes/
│   ├── userRoutes.js
│   └── candidateRoutes.js
│
├── models/
│   ├── user.js
│   └── candidate.js
│
├── middleware/
│   └── auth.js
│
├── db.js
├── server.js
├── .env
└── package.json


⚙️ Tech Stack


Node.js


Express.js


MongoDB


Mongoose


JWT (jsonwebtoken)


bcrypt


dotenv



 Installation & Setup
1.️  Clone the repo
git clone https://github.com/fahad-sh145-b/voting.git
cd blog--api


2. Install dependencies
npm install

️3. Create .env file
PORT=4000
MONGODB_URL_LOCAL=mongodb://127.0.0.1:27017/voting
JWT_SECRET=54321

  
 ️4. Start the server
npm start

or
nodemon server.js

If successful, you should see:
connected to the mongodb server
i am still alive


📌 API Endpoints

👤 USER ROUTES
1. Signup
POST /user/signup

Body:
{
  "username": "fahad",
  "password": "12345"
}


2. Login
POST /user/login

Body:
{
  "username": "fahad",
  "password": "12345"
}

Response:
{
  "token": "your-jwt-token"
}


👑 CANDIDATE ROUTES
1. Add Candidate
POST /candidate/add

Body:
{
  "name": "John Doe",
  "party": "XYZ"
}


2. Vote for a candidate
POST /candidate/vote/:candidateId

Headers:
Authorization: Bearer <token>


3. Get all candidates
GET /candidate/all


4. Get candidate results
GET /candidate/results


🛡️ Authentication Flow


User signs up → password hashed via Mongoose pre-save hook


User logs in → JWT token generated


Protected routes require token


User can vote only once



🗃️ Database Schema
User Schema


username


password (hashed)


hasVoted (boolean)


votedFor (candidate ID)


Candidate Schema


name


party


voteCount



🧪 Testing With Postman


Register a new user


Login → copy token


Add candidate


Vote for candidate


Check results



📦 Production Tips


Use .gitignore to remove node_modules from GitHub


Use MongoDB Atlas for online hosting


Add rate limiters for security



📜 License
MIT License © 2025
