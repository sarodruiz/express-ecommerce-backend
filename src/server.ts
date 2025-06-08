import express from 'express';
import connectDB from './config/database';
import authRoutes from './routes/auth.routes';

const PORT = process.env.PORT ?? 3000;

const app = express();
app.use(express.json());
connectDB();

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to my Ecommerce API!');
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
