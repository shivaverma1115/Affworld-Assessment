"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const userRotuer = express_1.default.Router();
userRotuer.post('/register', user_controller_1.registerUser);
userRotuer.post('/login', user_controller_1.loginUser);
userRotuer.post('/login-with-google', user_controller_1.loginWithGoogle);
userRotuer.post('/get-user', user_controller_1.getUser);
userRotuer.post('/forget-password', user_controller_1.forgetPassword);
exports.default = userRotuer;
