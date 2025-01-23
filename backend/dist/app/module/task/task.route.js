"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_controller_1 = require("./task.controller");
const taskRotuer = express_1.default.Router();
taskRotuer.get('/:_id', task_controller_1.getTask);
taskRotuer.post('/add', task_controller_1.addTask);
taskRotuer.delete('/:taskId', task_controller_1.deleteTask);
exports.default = taskRotuer;
