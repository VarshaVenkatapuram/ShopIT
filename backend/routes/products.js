import express from 'express';
const router=express.Router();
import {getProducts,newProduct,getSingleProduct,updateProduct,deleteProduct,canUserReview,getAdminProducts,updateProductImages,deleteProductImages,getProductReviews} from '../controllers/productController.js';

import { upload } from '../middlewares/multer.js';


import {isAuthenticatedUser,authorizeRoles} from '../middlewares/auth.js';

router.get('/products',getProducts);
router.post('/admin/products',isAuthenticatedUser,authorizeRoles('admin'),newProduct);
router.get('/admin/products',isAuthenticatedUser,authorizeRoles('admin'),getAdminProducts);
router.get("/products/:id",getSingleProduct);
router.put("/admin/products/:id",isAuthenticatedUser,authorizeRoles('admin'),updateProduct);
router.delete("/admin/products/:id",isAuthenticatedUser,authorizeRoles('admin'),deleteProduct);
router.get("/can_review",isAuthenticatedUser,canUserReview);
router.put('/admin/products/:id/upload_images', upload.array('images'),isAuthenticatedUser,authorizeRoles('admin'), updateProductImages);

router.put('/admin/products/:id/delete_images', upload.array('images'), isAuthenticatedUser,authorizeRoles('admin'),deleteProductImages);
router.get('/admin/reviews/:id', isAuthenticatedUser, authorizeRoles('admin'), getProductReviews);







export default router;