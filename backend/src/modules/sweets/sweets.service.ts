import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class SweetService {

  static async add(data: any) {
    const { name, category, price, quantity } = data;

    if (!name || !category || price == null || quantity == null) {
      return { status: 400, message: "All fields are required" };
    }

    const sweet = await prisma.sweet.create({
      data: { name, category, price, quantity },
    });

    return { status: 201, sweet };
  }

  static async getAll() {
    return prisma.sweet.findMany();
  }

  static async search(query: any) {
    const { name, category, minPrice, maxPrice } = query;

    return prisma.sweet.findMany({
      where: {
        name: name
          ? { contains: String(name), mode: "insensitive" }
          : undefined,
        category: category
          ? { equals: String(category), mode: "insensitive" }
          : undefined,
        price: {
          gte: minPrice ? Number(minPrice) : undefined,
          lte: maxPrice ? Number(maxPrice) : undefined,
        },
      },
    });
  }

  static async update(id: number, data: any) {
    try {
      const sweet = await prisma.sweet.update({
        where: { id },
        data,
      });
      return { status: 200, sweet };
    } catch {
      return { status: 404, message: "Sweet not found" };
    }
  }

  static async remove(id: number) {
    try {
      await prisma.sweet.delete({ where: { id } });
      return { status: 200, message: "Sweet deleted" };
    } catch {
      return { status: 404, message: "Sweet not found" };
    }
  }

  static async purchase(id: number) {
    const sweet = await prisma.sweet.findUnique({ where: { id } });

    if (!sweet) {
      return { status: 404, message: "Sweet not found" };
    }

    if (sweet.quantity <= 0) {
      return { status: 400, message: "Out of stock" };
    }

    const updated = await prisma.sweet.update({
      where: { id },
      data: { quantity: sweet.quantity - 1 },
    });

    return {
      status: 200,
      message: "Sweet purchased successfully",
      sweet: updated,
    };
  }

  static async restock(id: number, quantity: number) {
    if (!quantity || quantity <= 0) {
      return { status: 400, message: "Invalid quantity" };
    }

    const sweet = await prisma.sweet.findUnique({ where: { id } });

    if (!sweet) {
      return { status: 404, message: "Sweet not found" };
    }

    const updated = await prisma.sweet.update({
      where: { id },
      data: { quantity: sweet.quantity + quantity },
    });

    return {
      status: 200,
      message: "Sweet restocked successfully",
      sweet: updated,
    };
  }
}

export default SweetService;
