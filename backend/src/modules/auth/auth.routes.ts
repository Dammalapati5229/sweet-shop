import { Router } from "express";
import { register, login } from "./auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);

console.log("Auth routes loaded");

export default router;
