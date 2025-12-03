import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import productsRouter from './routes/productsRouter.js';

const app = express();

app.use(express.json()); //middleware para parsear el body de las solicitudes como JSON
app.use(cors()); //middleware para permitir solicitudes desde cualquier origen

app.use(['/products', '/productos'], productsRouter); //redirige a las rutas de productos, asi se escriba products o productos

app.use((req,res) => {
    res.status(404).json({error:"ruta no encontrada"}) //middleware para rutas no encontradas
})

const PORT = process.env.PORT || 3001 //puerto del servidor si no lee las variables de entorno, usa el 3001
app.listen(PORT,()=>console.log(`http://localhost:${PORT}`));

