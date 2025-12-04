import express from 'express';
import * as productController from '../controllers/productController.js';
import { verifyToken, checkAdmin } from '../middleware/auth.js';

const router = express.Router();


router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);


router.post('/create', verifyToken, checkAdmin, productController.createProduct);
router.put('/:id', verifyToken, checkAdmin, productController.updateProduct);
router.delete('/:id', verifyToken, checkAdmin, productController.deleteProduct);

export default router;