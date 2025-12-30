
import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        // Set connection options to handle timeouts better
        const options = {
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        };

        mongoose.connection.on('connected', () => {
            console.log('Database Connected');
        });

        mongoose.connection.on('error', (err) => {
            console.log('Database connection error:', err.message);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Database Disconnected');
        });

        await mongoose.connect('mongodb://127.0.0.1:27017/chat-app', options);
        
    } catch (error) {
        console.log('Database connection failed:', error.message);
        console.log('Please make sure MongoDB is running on your system');
        console.log('You can start MongoDB by running: mongod');
        process.exit(1); // Exit the process if database connection fails
    }
};