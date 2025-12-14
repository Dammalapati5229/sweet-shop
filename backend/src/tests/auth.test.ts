import request from "supertest";
import app from "../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.user.deleteMany();
});

describe("Auth API", () => {
  it("should login user and return token", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        email: "test@login.com",
        password: "123456",
      });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@login.com",
        password: "123456",
      });

    console.log("LOGIN RESPONSE:", res.status, res.body);

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
