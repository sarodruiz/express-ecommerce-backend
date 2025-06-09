import request from "supertest";
import app from "../src/app";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Auth API", () => {
  const userData = { email: "test@example.com", password: "securepassword" };

  it("Should register user successfully", async () => {
    const response = await request(app).post("/api/auth/register").send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("token");
  });

  it("Should login successfully with valid credentials", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send(userData);

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty("data");
    expect(loginResponse.body.data).toHaveProperty("token");
  });

  it("Should fail to login with invalid credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "wrongpassword" });

    expect(response.status).toBe(401);
  });
});
