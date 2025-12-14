import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../utils/prisma";

class AuthService {
  // ---------------- REGISTER ----------------
  static async register(data: { email: string; password: string }) {
    const { email, password } = data;

    if (!email || !password) {
      return { status: 400, message: "Email and password are required" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { status: 400, message: "Email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return {
      status: 201,
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  // ---------------- LOGIN ----------------
  static async login(data: { email: string; password: string }) {
    const { email, password } = data;

    if (!email || !password) {
      return { status: 400, message: "Email and password are required" };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { status: 400, message: "Invalid credentials" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { status: 400, message: "Invalid credentials" };
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return {
      status: 200,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}

export default AuthService;
