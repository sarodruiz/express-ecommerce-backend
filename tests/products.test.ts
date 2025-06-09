import request from "supertest";
import mongoose from "mongoose";
import Product from "../src/models/product.model";
import app from "../src/app";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;
const testProduct = {
    brand: "Johnnie Walker",
    model: "Blue Label",
    price: 450000,
    category: "whisky",
    volume: 750,
    image: "https://www.espaciovino.com.ar/media/default/0001/71/thumb_70661_default_big.jpeg",
    stock: 2
};

describe("Products API", () => {

    let userToken: string;
    let adminToken: string;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);

        const userRes = await request(app)
            .post("/api/auth/register")
            .send({
                email: "user@example.com",
                password: "userpassword",
                role: "user"
            });

        const adminRes = await request(app)
            .post("/api/auth/register")
            .send({
                email: "admin@example.com",
                password: "adminpassword",
                role: "admin"
            });

        userToken = userRes.body.data.token;
        adminToken = adminRes.body.data.token;
    });

    beforeEach(async () => {
        await Product.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it("Should create a product successfully as admin", async () => {
        const response = await request(app)
            .post("/api/products")
            .send(testProduct)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message", "Product created successfully");
        expect(response.body).toHaveProperty("product");
    });

    it("Should not create a product as user", async () => {
        const response = await request(app)
            .post("/api/products")
            .send(testProduct)
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty("message", "Access denied. Admins only.");
    });

    it("Should get all products", async () => {
        const response = await request(app).get("/api/products");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it("Should get a product by ID", async () => {
        const newProduct = new Product(testProduct);
        await newProduct.save();

        const response = await request(app).get(`/api/products/${newProduct._id}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("_id", newProduct._id.toString());
    });

    it("Should update a product successfully as admin", async () => {
        const newProduct = new Product(testProduct);
        await newProduct.save();

        const productUpdate = {
            price: 400000,
            stock: 5
        };

        const response = await request(app)
            .put(`/api/products/${newProduct._id}`)
            .send(productUpdate)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Product updated successfully");
        expect(response.body.product).toHaveProperty("price", 400000);
        expect(response.body.product).toHaveProperty("stock", 5);
    });

    it("Should not update a product as user", async () => {
        const newProduct = new Product(testProduct);
        await newProduct.save();

        const productUpdate = {
            price: 400000,
            stock: 5
        };

        const response = await request(app)
            .put(`/api/products/${newProduct._id}`)
            .send(productUpdate)
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty("message", "Access denied. Admins only.");
    });

    it("Should delete a product successfully as admin", async () => {
        const newProduct = new Product(testProduct);
        await newProduct.save();

        const response = await request(app)
            .delete(`/api/products/${newProduct._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Product deleted successfully");
    });

    it("Should not delete a product as user", async () => {
        const newProduct = new Product(testProduct);
        await newProduct.save();

        const response = await request(app)
            .delete(`/api/products/${newProduct._id}`)
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty("message", "Access denied. Admins only.");
    });
});
