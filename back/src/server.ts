import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import connectDB from './config/db';
import productRoutes from './api/routes/productRoutes';
import statsRoutes from './api/routes/statsRoutes';
import userRoutes from './api/routes/userRoutes';
import referralRoutes from './api/routes/referralRoutes';

dotenv.config({ path: '../.env' }); 

connectDB();

const app = express();

app.use(cors());
app.use(express.json()); 

app.use('/api/products', productRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/users', userRoutes);

app.use('/ref', referralRoutes);

app.get('/api', (req, res) => {
    res.send('API is running!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));