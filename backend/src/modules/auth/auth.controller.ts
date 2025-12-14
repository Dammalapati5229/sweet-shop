import { Request, Response } from "express";
import AuthService from "./auth.service";

export async function register(req: Request, res: Response) {
  const response = await AuthService.register(req.body);
  return res.status(response.status).json(response);
}

export async function login(req: Request, res: Response) {
  const response = await AuthService.login(req.body);
  return res.status(response.status).json(response);
}
