import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createDefaultAdmin() {
  const adminEmail = "admin@sweetshop.com";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("✅ Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("✅ Default admin created");
}
