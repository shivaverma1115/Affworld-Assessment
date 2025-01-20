import express  from "express";
import { loginUser, registerUser } from "./user.controller";

const userRotuer = express.Router();

userRotuer.post('/register',registerUser);
userRotuer.post('/login',loginUser);

export default userRotuer;