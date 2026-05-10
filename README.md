# 💬 Chat App (MERN + Socket.io)

A modern real-time chat application built with **React (Vite)** on the frontend and **Node.js + Express + Socket.io** on the backend.  
This project supports secure authentication, instant messaging, online user tracking, and media sharing with a clean and scalable architecture.

---

## Live URL: https://chat-app-indol-alpha.vercel.app/

## 🚀 Features

- 🔐 Secure Authentication (Login & Signup)
- 💬 Real-Time Messaging using Socket.io
- 🟢 Online / Offline User Status
- 🖼️ Image & Text Message Support
- 👤 User Profiles with Avatars
- ⚡ Fast Frontend using Vite
- 🌐 RESTful API with Express.js
- 🧠 MongoDB Database Integration
- 📱 Responsive UI Design
- 🔄 Live Updates without Refresh

---

## 🏗️ Tech Stack

### Frontend
- React.js (Vite)
- React Router DOM
- Context API
- Socket.io Client
- React Hot Toast
- Tailwind CSS

### Backend
- Node.js
- Express.js
- Socket.io
- MongoDB + Mongoose
- dotenv
- CORS

---

## 📁 Project Structure

chat-app/  
│  
├── client/                 # Frontend (React + Vite)  
│   ├── public/  
│   └── src/  
│       ├── assets/  
│       ├── components/  
│       ├── context/  
│       ├── pages/  
│       ├── App.jsx  
│       └── main.jsx  
│  
├── server/                 # Backend (Node + Express)  
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

---

## ⚙️ Backend Setup

### 1. Install dependencies
cd server  
npm install  

### 2. Create `.env` file
PORT=5002  
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  

### 3. Start backend server
nodemon server.js  

Backend runs on:
http://localhost:5002  

---

## 💻 Frontend Setup

### 1. Install dependencies
cd client  
npm install  

### 2. Start frontend
npm run dev  

Frontend runs on:
http://localhost:5173  

---

## 🔌 Socket.io Events

- connection → User connects  
- disconnect → User disconnects  
- getOnlineUsers → Sends online users list  

---

## 📡 API Routes

### Auth Routes
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/auth/check
- PUT /api/auth/update-profile

### Message Routes
- GET /api/messages/:userId
- POST /api/messages/send

---

## 👨‍💻 Author

Ayush Raj  

---

## 📌 Future Improvements

- Group chat feature  
- Typing indicator  
- Read receipts  
- Cloud image upload (Cloudinary)  
- Deployment (Vercel + Render)
