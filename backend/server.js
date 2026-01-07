import express from 'express';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Server is ready');
});

app.listen(PORT || 5000, () => {
  console.log(`Server is running on http://localhost:${PORT || 5000}`);
});