import { Request, Response } from "express";
import Order from "../models/order.model";
import { AuthRequest } from "../types/express";
import Product from "../models/product.model";

export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const { products } = req.body;

        let totalPrice = 0;
        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                res.status(404).json({ message: `Product with ID ${item.product} not found` });
                return;
            }
            if (product.stock < item.quantity) {
                res.status(400).json({ message: `Insufficient stock for product ${product._id}` });
                return;
            }
            totalPrice += product.price * item.quantity;
            product.stock -= item.quantity;
            await product.save();
        }

        const newOrder = new Order({
            user: req.user.id,
            products,
            totalPrice
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error creating order" });
    }
}

export const getOrdersByUser = async (req: AuthRequest, res: Response) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate("products.product");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching order" });
    }
}

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        console.log("Updated order:", updatedOrder);
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error updating order status" });
    }
}
