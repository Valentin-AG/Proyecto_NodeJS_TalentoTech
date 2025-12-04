import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();

import productsRouter from './routes/productsRouter.js';

const app = express();

app.use(express.json());
app.use(cors());


app.use(['/products', '/productos'], productsRouter);

app.use((req,res) => {
    res.status(404).json({error:"ruta no encontrada"})
});

// DEBUG: Verifica si está leyendo las variables
console.log('PORT from .env:', process.env.PORT);
console.log('FIREBASE_API_KEY exists:', !!process.env.FIREBASE_API_KEY);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));