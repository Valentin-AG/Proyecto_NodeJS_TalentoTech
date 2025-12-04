import bcrypt from 'bcryptjs';
import { collection, getDocs, addDoc, getDoc, query, where, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import { UserModel } from '../models/userModel.js';

const usersCollection = 'usuarios';

// Obtener todos los usuarios (sin password)
export const findAllUsers = async () => {
    const snapshot = await getDocs(collection(db, usersCollection));
    return snapshot.docs.map(doc => {
        const {password, ...userData} = doc.data();
        return new UserModel({id: doc.id, ...userData});
    });
}

// Obtener usuario por ID (sin password)
export const findUserById = async (id) => {
    const userDoc = doc(db, usersCollection, id);
    const snapshot = await getDoc(userDoc);

    if(!snapshot.exists()) return null;

    const {password, ...userData} = snapshot.data();
    return new UserModel({id: snapshot.id, ...userData});
}

// Crear un nuevo usuario
export const createUser = async (userData) => {
    const { nombre, email, password, rol, ubicacion, experiencia } = userData;

    if (!email || !password) {
        throw new Error("Email y contraseña son obligatorios");
    }

    // Verificar si el email ya existe
    const q = query(collection(db, usersCollection), where("email", "==", email));
    const existing = await getDocs(q);
    if (!existing.empty) {
        throw new Error("El correo electrónico ya está registrado");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        nombre: nombre || email.split('@')[0], // Si no se proporciona nombre, usar parte del email
        email,
        password: hashedPassword,
        rol: rol || "user",
        ubicacion: ubicacion || "Desconocida",
        experiencia: experiencia || "Sin experiencia"
    };

    const userRef = await addDoc(collection(db, usersCollection), newUser);

    const { password: _, ...safeUser } = newUser;
    return new UserModel({ id: userRef.id, ...safeUser });
}

// Actualizar usuario
export const updateUser = async (id, userData) => {
    const userRef = doc(db, usersCollection, id);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) return null;

    const oldUser = snapshot.data();

    let newPassword = oldUser.password;
    if (userData.password) {
        newPassword = await bcrypt.hash(userData.password, 10);
    }

    const updatedUser = {
        nombre: userData.nombre || oldUser.nombre,
        email: userData.email || oldUser.email,
        password: newPassword,
        rol: userData.rol || oldUser.rol,
        ubicacion: userData.ubicacion || oldUser.ubicacion,
        experiencia: userData.experiencia || oldUser.experiencia
    };

    await updateDoc(userRef, updatedUser);

    const { password, ...safeUser } = updatedUser;
    return new UserModel({ id, ...safeUser });
}

// Eliminar usuario
export const deleteUser = async (id) => {
    const userRef = doc(db, usersCollection, id);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) return null;

    const userData = snapshot.data();
    await deleteDoc(userRef);

    const { password, ...safeUser } = userData;
    return new UserModel({ id, ...safeUser });
}

// Verificar credenciales (para login)
export const verifyCredentials = async (email, password) => {
    const q = query(collection(db, usersCollection), where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        throw new Error("Usuario no encontrado");
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new Error("La contraseña es incorrecta");
    }

    const {password: _, ...safeUser} = user;
    return new UserModel({ id: userDoc.id, ...safeUser });
}