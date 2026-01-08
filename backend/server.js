import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import connectMongoDB from './db/connectMongoDB.js'; // Using .js extension because of ES module
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';


const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());  // Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true }));  // Middleware to parse URL-encoded request bodies
app.use(cookieParser()); // Middleware to parse cookies

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)

app.listen(PORT || 5000, () => {
    connectMongoDB();
    console.log(`Server is running on http://localhost:${PORT || 5000}`);
});