💬 Chat App (MERN + Socket.io)

A modern real-time chat application built with React (Vite) on the frontend and Node.js + Express + Socket.io on the backend.
This project supports secure authentication, instant messaging, online user tracking, and media sharing with a clean and scalable architecture.

🚀 Features
🔐 Secure Authentication (Login & Signup)
💬 Real-Time Messaging with Socket.io
🟢 Online / Offline User Status
🖼️ Image & Text Message Support
👤 User Profiles with Avatars
⚡ Lightning Fast Frontend using Vite
🌐 RESTful API with Express.js
🧠 MongoDB Database Integration
📱 Responsive UI Design
🔄 Live UI Updates without Refresh


🏗️ Tech Stack
Frontend
React.js (Vite)
React Router DOM
Context API
Socket.io Client
React Hot Toast
Tailwind CSS


Backend
Node.js
Express.js
Socket.io
MongoDB
Mongoose
dotenv
CORS

📁 Project Structure

chat-app/
│
├── client/                     # React Frontend
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── App.jsx
│       └── main.jsx
│
├── server/                     # Node.js Backend
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── messageRoutes.js
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── lib/
│   │   └── db.js
│   ├── server.js
│   └── .env
│
└── README.md


⚙️ Backend Setup

1️⃣ Navigate to Server Folder

cd server

2️⃣ Install Dependencies

npm install

3️⃣ Create .env File

PORT=5002
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

4️⃣ Start Development Server
nodemon server.js

Backend runs on:
http://localhost:5002

💻 Frontend Setup
1️⃣ Navigate to Client Folder

cd client

2️⃣ Install Dependencies

npm install

3️⃣ Start Frontend

npm run dev

Frontend runs on:

http://localhost:5173

🔌 Socket.io Events


| Event            | Description                       |
| ---------------- | --------------------------------- |
| `connection`     | Triggered when a user connects    |
| `disconnect`     | Triggered when a user disconnects |
| `getOnlineUsers` | Sends currently online users      |


