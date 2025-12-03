import { error } from "console";
import * as productService from '../services/productService.js';



export const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
    }

}

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productService.getProductById(id);
        

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado', error: error.message});
        }

        res.status(200).json(product);


    }   catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
    }
}


export const createProduct = async (req, res) => {
    try {
        const newProduct = await productService.createProduct(req.body);
        res.status(201).json({message: 'Producto creado exitosamente', producto: newProduct});
    } catch (error) {
        res.status(400).json({ message: 'Error al crear el producto', error: error.message });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await productService.updateProduct(id, req.body);
        

        if (!updated) {
            return res.status(404).json({ message: 'Producto no encontrado', error: error.message});
        }

        res.status(200).json({message: 'Producto actualizado exitosamente', producto: updated});

    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el producto', error: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await productService.deleteProduct(id);
        
        if (!deleted) {
            return res.status(404).json({ message: 'Producto no encontrado', error: error.message});
        }

        res.status(200).json({ message: 'Producto eliminado exitosamente' });

    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
    }
}




