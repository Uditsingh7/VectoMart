import { Request, Response } from 'express';
import User from '../models/user.model';
import { generateToken } from '../utils/jwtAuth';
import bcrypt from "bcrypt";

export const signUpUser = async (req: Request, res: Response) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        // create user  instance and save it to the database
        const user = await User.create({
            username: username,
            password: hashedPassword,
            role: role
        });
        // send back a response with status code
        const token = generateToken({ id: user.id, username, role });
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                },
            },
        });


    }
    catch (error: any) {
        console.error("Error registering user:", error);      
        return res.status(500).json({
            success: false,
            message: error.errors[0].message || "Failed to Registered",

        });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        //check user creds and send token in the response
        const user = await User.findOne({
            where: {
                username: username
            }
        })
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Incorrect username or password"
            })
        }
        const isPasswordValid = await bcrypt.compare(password, user?.password ?? '');
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Incorrect username or password" })
        }
        const token = generateToken({ id: user?.id ?? 0, username, role: user?.role ?? '' })
        return res.status(201).json({
            success: true,
            message: 'User logged In successfully',
            data: {
                token,
                user: {
                    id: user?.id ?? 0,
                    username: user?.username ?? '',
                    role: user?.role ?? '',
                },
            },
        });
    }
    catch (error) {

    }
}



