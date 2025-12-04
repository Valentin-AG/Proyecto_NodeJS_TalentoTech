import * as userService from '../services/userServices.js';
import jwt from 'jsonwebtoken';

// Obtener todos los usuarios (solo admin)
export const getAllUsers = async (req, res) => {
    try {
        const users = await userService.findAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Obtener usuario por ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userService.findUserById(id);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Crear usuario (registro)
export const createUser = async (req, res) => {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Actualizar usuario
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await userService.updateUser(id, req.body);

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Eliminar usuario
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await userService.deleteUser(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({ message: "Usuario eliminado correctamente", user: deletedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Login de usuario
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
        }

        const user = await userService.verifyCredentials(email, password);

        const tokenPayload = {
            id: user.id,
            email: user.email,
            rol: user.rol
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login exitoso',
            token: token,
            user: user
        });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}