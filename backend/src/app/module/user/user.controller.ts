import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from './user.model';
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer';

require("dotenv").config();

const amtp_email = process.env.SMTP_EMAIL;
const smtp_name = process.env.SMTP_NAME;
const pass = process.env.SMTP_PASSWORD;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: amtp_email,
        pass,
    }
} as any);

export function generateToken(email: string) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET environment variable is not set.');
    const token = jwt.sign({ email }, secret, { expiresIn: '1d' });
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
        const { name, email, password } = req.body;
        const isUser = await User.findOne({ email: email });
        if (isUser) return res.send({ message: "user already exist, please login" });
        const isRegister = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, 10),
        })
        if (!isRegister) return res.send({ message: "user not created" });

        return res.send({ message: "register Successful", isRegister });
    } catch (e) {
        return res.send({ message: "custom error", e });
    }
}


export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
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

export const loginWithGoogle = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const { email, name } = req.body;

        if (!email || !name) return res.status(400).send({ message: "Missing email or name" });

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                email,
                name,
                password: bcrypt.hashSync(email, 10),
            });
            await user.save();
        }

        const token = generateToken(email);
        return res.status(200).send({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "An error occurred", error });
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        const emailId = await extractEmailId(token);

        const user = await User.findOne({ email: emailId });
        if (!user) return res.status(400).send({ message: 'user not found' })

        return res.status(200).send({
            message: "get user successful",
            data: user
        });
    } catch (e) {
        return res.send({ message: "custom error", e });
    }
}


export const forgetPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const isUser = await User.findOne({ email: email });
        if (!isUser) return res.send({ message: "email not Valid" });

        const randomPass = `RN-${Date.now()}`;
        const newPass = await bcrypt.hash(randomPass, 10);
        const isSendPass = await isSend(email, randomPass);
        isUser.password = newPass;
        await isUser.save();

        return res.status(200).send({
            message: "new password has been send to your registered email",
            isSendPass
        });
    } catch (e) {
        return res.send({ message: "custom error", e });
    }
}


export const isSend = async (email: string, randomPass: string) => {
    try {
        const mailOptions = {
            from: `"${smtp_name}" <${email}>`,
            to: email,
            subject: "Your New Password",
            text: randomPass,
        };

        await transporter.sendMail(mailOptions);
        console.log('successfully sent to', email);
        return {
            message: `successfully sent to ${email}`
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            message: `Failed to send password to ${email}`,
            error: error
        };
    }
};
