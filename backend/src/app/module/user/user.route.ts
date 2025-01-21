import express  from "express";
import { forgetPassword, loginUser, registerUser } from "./user.controller";

const userRotuer = express.Router();

userRotuer.post('/register',registerUser);
userRotuer.post('/login',loginUser);
userRotuer.post('/forget-password',forgetPassword);

export default userRotuer;