import { model, Schema } from "mongoose";
import { Iuser } from "./user.interface";

const userSchema = new Schema<Iuser>({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        trim: true,
    },
})

export const User = model('user', userSchema)
