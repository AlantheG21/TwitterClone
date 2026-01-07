import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js'; // Using .js extension because of ES module
import connectMongoDB from './db/connectMongoDB.js';

const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());

app.use("/api/auth", authRoutes)

app.listen(PORT || 5000, () => {
    connectMongoDB();
    console.log(`Server is running on http://localhost:${PORT || 5000}`);
});