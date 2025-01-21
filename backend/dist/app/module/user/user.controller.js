"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSend = exports.forgetPassword = exports.loginUser = exports.registerUser = void 0;
exports.generateToken = generateToken;
exports.extractEmailId = extractEmailId;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("./user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv").config();
const amtp_email = process.env.SMTP_EMAIL;
const smtp_name = process.env.SMTP_NAME;
const pass = process.env.SMTP_PASSWORD;
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: amtp_email,
        pass,
    }
});
function generateToken(email) {
    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new Error('JWT_SECRET environment variable is not set.');
    const token = jsonwebtoken_1.default.sign({ email }, secret, { expiresIn: '30d' });
    return token;
}
function extractEmailId(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET environment variable is not set.');
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            return decoded.email;
        }
        catch (err) {
            console.error('Invalid token:', err.message);
            return {
                isExpired: true,
                message: 'Token has expired. Please log in again.',
            };
        }
    });
}
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const isUser = yield user_model_1.User.findOne({ email: email });
        if (isUser)
            return res.send({ message: "user already exist, please login" });
        const isRegister = yield user_model_1.User.create({
            name,
            email,
            password: bcrypt_1.default.hashSync(password, 10),
        });
        if (!isRegister)
            return res.send({ message: "user not created" });
        return res.status(200).send({ message: "register Successful", isRegister });
    }
    catch (e) {
        return res.send({ message: "custom error", e });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const isUser = yield user_model_1.User.findOne({ email: email });
        if (!isUser)
            return res.send({ message: "user not Valid" });
        const isVerify = yield bcrypt_1.default.compare(password, isUser.password);
        if (!isVerify)
            return res.send({ message: "password not Match" });
        const token = generateToken(email);
        return res.status(200).send({ message: "login Successful", token });
    }
    catch (e) {
        return res.send({ message: "custom error", e });
    }
});
exports.loginUser = loginUser;
const forgetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const isUser = yield user_model_1.User.findOne({ email: email });
        if (!isUser)
            return res.send({ message: "email not Valid" });
        const randomPass = `RN-${Date.now()}`;
        const newPass = yield bcrypt_1.default.hash(randomPass, 10);
        const isSendPass = yield (0, exports.isSend)(email, randomPass);
        isUser.password = newPass;
        yield isUser.save();
        return res.status(200).send({
            message: "new password has been send to the registered email",
            isSendPass
        });
    }
    catch (e) {
        return res.send({ message: "custom error", e });
    }
});
exports.forgetPassword = forgetPassword;
const isSend = (email, randomPass) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mailOptions = {
            from: `"${smtp_name}" <${email}>`,
            to: email,
            subject: "Your New Password",
            text: randomPass,
        };
        yield transporter.sendMail(mailOptions);
        console.log('successfully sent to', email);
        return {
            message: `successfully sent to ${email}`
        };
    }
    catch (error) {
        console.error('Error sending email:', error);
        return {
            message: `Failed to send password to ${email}`,
            error: error
        };
    }
});
exports.isSend = isSend;
