import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';

const jwtSecret = "qp-assessment"

interface JwtPayload {
    id: Number,
    username: String,
    role: String
}

export const generateToken = ({ id, username, role }: JwtPayload): string => {
    return jwt.sign({ id, username, role }, jwtSecret, { expiresIn: '1h' });
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token is not provided"
        })
    }
    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    message: "Token has expired"
                })
            }
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    message: "Token is not valid"
                })
            }
            return res.status(500).json({
                message: "Interval server error"
            })
        }
        req.user = user as JwtPayload;
        next();
    })
}