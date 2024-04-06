import { Request, Response, NextFunction } from "express";
import User from '../models/user.model'


export const requiredRole = (role: 'Admin' | 'User') => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = (req.user as User)?.role;
        if (!userRole || userRole !== role) {
            return res.status(403).json({ message: `Forbidden - Insufficient Permissons` })
        }
        next();
    }
}

export const authorizeUser = (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as User).id;
    const reqUserId = parseInt(req.params.userId);
    if (userId !== reqUserId) {
        return res.status(401).json({ message: `Unauthorized - Invalid User ID` });
    }
    next();
}

export const authorizeUserForPlacingOrder = (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as User).id
    const reqUserId = parseInt(req.body?.userId ?? '0'); // Added '0' as a fallback value
    if (userId !== reqUserId) {
        return res.status(401).json({ message: `Unauthorized - Invalid User ID` });
    }
    next();
}