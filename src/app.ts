import express from "express";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to my Ecommerce API!!!");
});

export default app;
