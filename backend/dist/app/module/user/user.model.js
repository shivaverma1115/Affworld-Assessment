"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
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
});
exports.User = (0, mongoose_1.model)('user', userSchema);
