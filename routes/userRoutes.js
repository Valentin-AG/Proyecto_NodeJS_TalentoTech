import { Router } from "express";
import { getAllUsers, getUserById, createUser, updateUser, login } from "../controllers/userController.js";
import { verifyToken, checkAdmin } from "../middleware/auth.js";

const router = Router();

router.post('/login', login);

router.get('/', verifyToken, checkAdmin, getAllUsers);
router.get('/:id', verifyToken, getUserById);
router.post('/', createUser);
router.put('/:id', verifyToken, updateUser);

export default router;