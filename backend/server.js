import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';

import connectMongoDB from './db/connectMongoDB.js'; // Using .js extension because of ES module
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import notificationRoutes from './routes/notification.routes.js';


const app = express();

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const PORT = process.env.PORT;

app.use(express.json());  // Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true }));  // Middleware to parse URL-encoded request bodies
app.use(cookieParser()); // Middleware to parse cookies

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/notifications", notificationRoutes)

app.listen(PORT || 5000, () => {
    connectMongoDB();
    console.log(`Server is running on http://localhost:${PORT || 5000}`);
});