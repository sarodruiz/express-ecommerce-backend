import express from 'express';
import { createOrder, getOrdersByUser, updateOrderStatus } from '../controllers/order.controller';
import authMiddleware from '../middlewares/auth.middleware';
import adminMiddleware from '../middlewares/admin.middleware';

const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getOrdersByUser);
router.put("/:id", authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
