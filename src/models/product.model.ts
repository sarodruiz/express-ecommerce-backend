import mongoose, { model } from "mongoose";

const productSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    model: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true, enum: ["beer", "wine", "whisky", "vodka"] },
    volume: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", productSchema);

export default Product;
