import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from './user.model';
import bcrypt from 'bcrypt'

export function generateToken(email: string) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET environment variable is not set.');
    const token = jwt.sign({ email }, secret, { expiresIn: '30d' });
    return token as string;
}

export async function extractEmailId(token: string) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is not set.');
    }
    try {
        const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
        return decoded.email;
    } catch (err: any) {
        console.error('Invalid token:', err.message);
        return {
            isExpired: true,
            message: 'Token has expired. Please log in again.',
        };
    }
}


export const registerUser = async (req: Request, res: Response) => {
    try {
        const userinfo = req.body;
        const { name, email, password } = userinfo;
        const isUser = await User.findOne({ email: email });
        if (isUser) return res.send({ message: "user already exist, please login" });
        const isRegister = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, 10),
        })
        if (!isRegister) return res.send({ message: "user not created" });

        return res.status(200).send({ message: "register Successful", isRegister });
    } catch (e) {
        return res.send({ message: "custom error", e });
    }
}


export const loginUser = async (req: Request, res: Response) => {
    try {
        const userinfo = req.body;
        const { email, password } = userinfo;
        const isUser = await User.findOne({ email: email });
        if (!isUser) return res.send({ message: "user not Valid" });

        const isVerify = await bcrypt.compare(password, isUser.password);
        if (!isVerify) return res.send({ message: "password not Match" });

        const token = generateToken(email);
        return res.status(200).send({ message: "login Successful", token });
    } catch (e) {
        return res.send({ message: "custom error", e });
    }
}