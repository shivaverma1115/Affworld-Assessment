"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        trim: true,
    },
});
exports.Task = (0, mongoose_1.model)('task', taskSchema);
