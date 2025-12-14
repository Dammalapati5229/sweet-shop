import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET ALL SWEETS
export const getAllSweets = async (_req: Request, res: Response) => {
  try {
    const sweets = await prisma.sweet.findMany();
    res.status(200).json(sweets);
  } catch {
    res.status(500).json({ message: "Failed to fetch sweets" });
  }
};

//SEARCH SWEETS
export const searchSweets = async (req: Request, res: Response) => {
  try {
    const { name, category } = req.query;

    const sweets = await prisma.sweet.findMany({
      where: {
        name: name
          ? { contains: String(name), mode: "insensitive" }
          : undefined,
        category: category
          ? { contains: String(category), mode: "insensitive" }
          : undefined,
      },
    });

    res.json(sweets);
  } catch {
    res.status(500).json({ message: "Search failed" });
  }
};

//ADD SWEET
export const addSweet = async (req: Request, res: Response) => {
  try {
    const { name, category, price, stockKg } = req.body;

    const sweet = await prisma.sweet.create({
      data: {
        name,
        category,
        price: Number(price),
        stockKg: Number(stockKg),
      },
    });

    res.status(201).json(sweet);
  } catch {
    res.status(500).json({ message: "Failed to add sweet" });
  }
};

// UPDATE SWEET
export const updateSweet = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    console.log("USER:", (req as any).user);
    console.log("BODY:", req.body);

    const { name, category, price, stockKg } = req.body;

    const existing = await prisma.sweet.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    const updated = await prisma.sweet.update({
      where: { id },
      data: {
        name: name ?? existing.name,
        category: category ?? existing.category,
        price:
          price !== undefined && price !== ""
            ? Number(price)
            : existing.price,
        stockKg:
          stockKg !== undefined && stockKg !== ""
            ? Number(stockKg)
            : existing.stockKg,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("UPDATE FAILED:", error);
    res.status(500).json({ message: "Update failed" });
  }
};

// DELETE SWEET
export const deleteSweet = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.sweet.delete({ where: { id } });
    res.json({ message: "Sweet deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};

// RESTOCK SWEET
export const restockSweet = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { kg } = req.body;

    const sweet = await prisma.sweet.findUnique({ where: { id } });
    if (!sweet) return res.status(404).json({ message: "Sweet not found" });

    const updated = await prisma.sweet.update({
      where: { id },
      data: { stockKg: sweet.stockKg + Number(kg) },
    });

    res.json(updated);
  } catch {
    res.status(500).json({ message: "Restock failed" });
  }
};

// PURCHASE SWEET
export const purchaseSweet = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { kg } = req.body;

    const sweet = await prisma.sweet.findUnique({ where: { id } });
    if (!sweet) return res.status(404).json({ message: "Sweet not found" });

    if (sweet.stockKg < Number(kg)) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    const updated = await prisma.sweet.update({
      where: { id },
      data: { stockKg: sweet.stockKg - Number(kg) },
    });

    res.json(updated);
  } catch {
    res.status(500).json({ message: "Purchase failed" });
  }
};
