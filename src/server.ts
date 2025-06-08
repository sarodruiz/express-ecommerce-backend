import express from 'express';
import connectDB from './config/database';

const PORT = process.env.PORT ?? 3000;

const app = express();
app.use(express.json());
connectDB();

app.get('/', (req, res) => {
  res.send('Welcome to my Ecommerce API!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
