import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";

// Définir le type exact du payload JWT
interface JwtUser {
  id: number;
  email: string;
}

export interface AuthRequest extends Request {
  user?: JwtUser;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = typeof authHeader === "string" ? authHeader.split(" ")[1] : undefined;

  if (!token) return res.status(401).json({ message: "Token manquant" });

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtUser;
    req.user = decoded; // ✅ Typage correct
    next();
  } catch (err) {
    res.status(403).json({ message: "Token invalide" });
  }
};
