import {db} from '../firebase/config.js';
import {Product} from '../models/productModel.js';
import {collection, getDoc, getDocs, doc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';

const collectionName = 'products';

export const getAllProducts = async () => {
    const productsCol = collection(db, collectionName);
    const productSnapshot = await getDocs(productsCol);

    if (productSnapshot.empty) {
        return [];
    }
    
    return productSnapshot.docs.map(doc => new Product({id: doc.id, ...doc.data()}));
    // Mapea cada documento obtenido a una instancia de Product, incluyendo el ID del documento
 
}

export const getProductById = async (id) => {
    const productDoc = doc(db, collectionName, id);
    const productSnapshot = await getDoc(productDoc);

    if (!productSnapshot.exists()) {
        return null; 
    }

    return new Product({id: productSnapshot.id, ...productSnapshot.data()});
} // Retorna una instancia de Product si existe, sino null

export const createProduct = async (productData) => {
    if (!productData.name || !productData.price) {
        throw new Error('Nombre y precio son obligatorios');
    }
    const productCol = collection(db, collectionName);
    const newProductRef = await addDoc(productCol, {
        name: productData.name,
        price: Number(productData.price),
        description: productData.description || '',
        category: productData.category || '',
        stock: Number(productData.stock || 0)
    });

    return new Product({id: newProductRef.id, ...productData});

}

export const deleteProduct = async (id) => {
    const productDoc = doc(db, collectionName, id);
    const productSnapshot = await getDoc(productDoc);

    if (!productSnapshot.exists()) {
        return false; 
    }

    await deleteDoc(productDoc);
    return true;
}

export const updateProduct = async (id, updateData) => {

    const productDoc = doc(db, collectionName, id);
    const productSnapshot = await getDoc(productDoc);

    if (!productSnapshot.exists()) {
        return null; 
    }

    await updateDoc(productDoc, updateData);
    const updatedSnapshot = await getDoc(productDoc);
    return new Product({id: updatedSnapshot.id, ...updatedSnapshot.data()});

}