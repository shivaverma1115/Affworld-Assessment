import express  from "express";
import { forgetPassword, getUser, loginUser, loginWithGoogle, registerUser } from "./user.controller";

const userRotuer = express.Router();

userRotuer.post('/register',registerUser);
userRotuer.post('/login',loginUser);
userRotuer.post('/login-with-google',loginWithGoogle);
userRotuer.post('/get-user',getUser);
userRotuer.post('/forget-password',forgetPassword);

export default userRotuer;