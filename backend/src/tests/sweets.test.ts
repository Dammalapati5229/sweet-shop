import bcrypt from "bcryptjs";
import request from "supertest";
import app from "../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let token: string;
let sweetId: number;

beforeAll(async () => {
  await prisma.sweet.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("123456", 10);

  await prisma.user.create({
    data: {
      email: "admin@test.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "admin@test.com",
      password: "123456",
    });

  token = res.body.token;

  expect(token).toBeDefined();
});

describe("Sweets API", () => {

  it("should add a sweet (admin only)", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Ladoo",
        category: "Indian",
        price: 50,
        quantity: 10,
      });

    expect(res.status).toBe(201);
    sweetId = res.body.sweet.id;
  });

  it("should get all sweets", async () => {
    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should purchase a sweet", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

});
