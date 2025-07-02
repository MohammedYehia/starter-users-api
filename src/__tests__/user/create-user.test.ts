import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { UserModel } from "../../models/user.model";
import bcrypt from "bcrypt";

describe("POST /api/users", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST!);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it("should create a new user with hashed password", async () => {
    const res = await request(app).post("/api/users").send({
      name: "Alice",
      email: "alice@example.com",
      password: "secure123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Alice");
    expect(res.body.email).toBe("alice@example.com");
    expect(res.body).not.toHaveProperty("password");
  });

  it("should return 400 if required fields are missing", async () => {
    const res = await request(app).post("/api/users").send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should fail if email is invalid", async () => {
    const res = await request(app).post("/api/users").send({
      name: "Alice",
      email: "invalid-email",
      password: "secure123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 for password < 6 chars", async () => {
    const res = await request(app).post("/api/users").send({
      name: "Test",
      email: "test@example.com",
      password: "123",
    });

    expect(res.statusCode).toBe(400);
  });

  it("should return 400 if email is already used", async () => {
    const user = {
      name: "Test",
      email: "duplicate@example.com",
      password: "secure123",
    };

    // First user
    await request(app).post("/api/users").send(user);
    // Duplicate
    const res = await request(app).post("/api/users").send(user);

    expect(res.statusCode).toBe(400);
  });

  it("should hash the password before storing it", async () => {
    const plainPassword = "mySecret";
    await request(app).post("/api/users").send({
      name: "Hash Test",
      email: "hash@example.com",
      password: plainPassword,
    });

    const userInDb = await UserModel.findOne({
      email: "hash@example.com",
    })
      .select("password")
      .lean();

    expect(userInDb).toBeTruthy();
    expect(userInDb?.password).not.toBe(plainPassword);

    const isValid = await bcrypt.compare(plainPassword, userInDb!.password);
    expect(isValid).toBe(true);
  });
});
