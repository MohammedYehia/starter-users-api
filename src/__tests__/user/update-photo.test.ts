import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import path from "path";
import { UserModel } from "../../models/user.model";

describe("PATCH /api/users/:id/photo", () => {
  let userId: string;
  const imagePath: string = path.join(__dirname, "../__fixtures__/avatar.png");

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST!);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    const user = await UserModel.create({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    userId = user.id.toString();
  });

  afterEach(async () => {
    await UserModel.deleteMany();
  });

  // beforeAll(() => {
  // 	jest.spyOn(console, "error").mockImplementation(() => {console.log("👀👀👀")});
  // });

  it("should update photoUrl after uploading image", async () => {
    const res = await request(app)
      .patch(`/api/users/${userId}/photo`)
      .attach("photo", imagePath);

    const userInDb = await UserModel.findById(userId).lean();

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("photoUrl");
    expect(res.body.photoUrl).toMatch(/\/uploads\/.+\.(jpg|jpeg|png|webp)/);
    expect(userInDb?.photoUrl).toContain("/uploads/");
  });

  it("should return 400 if no image is uploaded", async () => {
    const res = await request(app).patch(`/api/users/${userId}/photo`);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "No file uploaded");
  });

  it("should return 400 for invalid user id", async () => {
    const res = await request(app)
      .patch(`/api/users/invalid-id/photo`)
      .attach("photo", imagePath);

    expect(res.statusCode).toBe(400);
  });
});
