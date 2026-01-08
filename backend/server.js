import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js'; // Using .js extension because of ES module
import connectMongoDB from './db/connectMongoDB.js';
import cookieParser from 'cookie-parser';

const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());  // Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true }));  // Middleware to parse URL-encoded request bodies
app.use(cookieParser()); // Middleware to parse cookies

app.use("/api/auth", authRoutes)

app.listen(PORT || 5000, () => {
    connectMongoDB();
    console.log(`Server is running on http://localhost:${PORT || 5000}`);
});