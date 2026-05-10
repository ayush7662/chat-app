import mongoose from "mongoose";

export const connectDB = async () => {
    try {

        const options = {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
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

        await mongoose.connect(process.env.MONGODB_URI, options);

    } catch (error) {
        console.log('Database connection failed:', error.message);
        console.log('Please make sure MongoDB is running on your system');
        console.log('You can start MongoDB by running: mongod');

        process.exit(1);
    }
};