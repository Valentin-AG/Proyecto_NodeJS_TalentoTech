import { Router } from "express";
import { getAllUsers, getUserById, createUser, updateUser, login } from "../controllers/userController.js";
import { verifyToken, checkAdmin } from "../middleware/auth.js";

const router = Router();

// Ruta de login (pública)
router.post('/login', login);

// Rutas CRUD de usuarios
router.get('/', verifyToken, checkAdmin, getAllUsers); // Solo admin puede ver todos los usuarios
router.get('/:id', verifyToken, getUserById); // Cualquier usuario autenticado puede ver un usuario específico
router.post('/', createUser); // Registro público
router.put('/:id', verifyToken, updateUser); // Actualizar usuario (requiere autenticación)

export default router;