import express from 'express';
 const router=express.Router();

 import { authorizeRoles, isAuthenticatedUser } from '../middlewares/auth.js';
 import {newOrder,getOrderDetails,myOrders,allOrders,updateOrder,deleteOrder,createProductReview,getProductReviews, getSales} from "../controllers/orderController.js";

 router.route("/orders/new").post(isAuthenticatedUser,newOrder);
 router.route("/orders/:id").get(isAuthenticatedUser,getOrderDetails);
 router.route("/me/orders").get(isAuthenticatedUser,myOrders);
router.route("/admin/orders")
.get(isAuthenticatedUser,authorizeRoles('admin'),allOrders)
router.route("/admin/orders/:id")
.put(isAuthenticatedUser,authorizeRoles('admin'),updateOrder)
.delete(isAuthenticatedUser,authorizeRoles('admin'),deleteOrder)
;

router.route("/reviews")
.put(isAuthenticatedUser,createProductReview)
.get(isAuthenticatedUser,getProductReviews);

router
.route("/admin/get_sales")
.get(isAuthenticatedUser,authorizeRoles("admin"),getSales);

 export default router;