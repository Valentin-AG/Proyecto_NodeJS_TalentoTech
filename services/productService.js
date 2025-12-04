import {db} from '../firebase/config.js';
import {Product} from '../models/productModel.js';
import {collection, getDoc, getDocs, doc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';

const collectionName = 'products';

export const getAllProducts = async () => {
    try {
        const productsCol = collection(db, collectionName);
        const productSnapshot = await getDocs(productsCol);

        if (productSnapshot.empty) {
            return [];
        }
        
        const products = productSnapshot.docs.map(doc => {
            const data = doc.data();
            return new Product(
                doc.id,
                data.name,
                data.description,
                data.price,
                data.stock,
                data.category
            );
        });
        
        return products;
    } catch (error) {
        console.error('Error en getAllProducts:', error);
        throw error;
    }
}

export const getProductById = async (id) => {
    const productDoc = doc(db, collectionName, id);
    const productSnapshot = await getDoc(productDoc);

    if (!productSnapshot.exists()) {
        return null; 
    }

    const data = productSnapshot.data();
    return new Product(
        productSnapshot.id,
        data.name,
        data.description,
        data.price,
        data.stock,
        data.category
    );
}

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

    return new Product(
        newProductRef.id,
        productData.name,
        productData.description || '',
        Number(productData.price),
        Number(productData.stock || 0),
        productData.category || ''
    );
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
    const data = updatedSnapshot.data();
    
    return new Product(
        updatedSnapshot.id,
        data.name,
        data.description,
        data.price,
        data.stock,
        data.category
    );
}