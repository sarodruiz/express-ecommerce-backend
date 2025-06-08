import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
    user?: any;
}

const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log(req.user);
    if (!req.user || req.user.role !== "admin") {
        res.status(403).json({ message: "Access denied. Admins only." });
        return;
    }
    next();
};

export default adminMiddleware;
