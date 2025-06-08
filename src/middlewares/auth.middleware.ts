import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AuthRequests extends Request {
  user?: any;
}

const authMiddleware = (req: AuthRequests, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return 
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};

export default authMiddleware;
