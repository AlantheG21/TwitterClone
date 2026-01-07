import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js'; // Using .js extension because of ES module

const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes)

app.listen(PORT || 5000, () => {
  console.log(`Server is running on http://localhost:${PORT || 5000}`);
});