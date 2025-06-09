import express from "express";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import orderRouters from "./routes/order.routes";

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRouters);

app.get("/", (req, res) => {
  res.send("Welcome to my Ecommerce API!!!");
});

export default app;
