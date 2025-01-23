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
exports.isSend = exports.forgetPassword = exports.getUser = exports.loginWithGoogle = exports.loginUser = exports.registerUser = void 0;
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
    const token = jsonwebtoken_1.default.sign({ email }, secret, { expiresIn: '1d' });
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
        return res.send({ message: "register Successful", isRegister });
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
const loginWithGoogle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { email, name } = req.body;
        if (!email || !name)
            return res.status(400).send({ message: "Missing email or name" });
        let user = yield user_model_1.User.findOne({ email });
        if (!user) {
            user = new user_model_1.User({
                email,
                name,
                password: bcrypt_1.default.hashSync(email, 10),
            });
            yield user.save();
        }
        const token = generateToken(email);
        return res.status(200).send({ message: "Login successful", token });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ message: "An error occurred", error });
    }
});
exports.loginWithGoogle = loginWithGoogle;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        const emailId = yield extractEmailId(token);
        const user = yield user_model_1.User.findOne({ email: emailId });
        if (!user)
            return res.status(400).send({ message: 'user not found' });
        return res.status(200).send({
            message: "get user successful",
            data: user
        });
    }
    catch (e) {
        return res.send({ message: "custom error", e });
    }
});
exports.getUser = getUser;
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
            message: "new password has been send to your registered email",
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
