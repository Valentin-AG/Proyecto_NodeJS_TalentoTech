import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import productsRouter from './routes/productsRouter.js';
import userRoutes from './routes/userRoutes.js'; ;

const app = express();

app.use(express.json());
app.use(cors());

app.use(['/users', '/usuarios'], userRoutes);
app.use(['/products', '/productos'], productsRouter);

// Middleware para rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en: http://localhost:${PORT}`));