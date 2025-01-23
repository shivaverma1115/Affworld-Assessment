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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.addTask = exports.getTask = void 0;
const task_model_1 = require("./task.model");
require("dotenv").config();
const getTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params);
        const { _id } = req.params;
        const tasks = yield task_model_1.Task.find({ userId: _id }).sort({ _id: -1 });
        return res.status(200).send({ message: "task fetch successful", tasks });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ message: "An error occurred", error });
    }
});
exports.getTask = getTask;
const addTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { taskInfo, user } = req.body;
        if (!taskInfo || !user)
            return res.status(404).send({ message: "task and user info both are required" });
        const newTask = yield task_model_1.Task.create({
            userId: user._id,
            name: taskInfo.name,
            description: taskInfo.description,
            status: taskInfo.status
        });
        return res.status(200).send({
            message: "add task successful",
            task: newTask
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ message: "An error occurred", error });
    }
});
exports.addTask = addTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params);
        const { taskId } = req.params;
        if (!taskId)
            return res.status(404).send({ message: "task _id is required" });
        const isDelete = yield task_model_1.Task.findByIdAndDelete({ _id: taskId });
        return res.status(200).send({
            message: "task delete successful",
            delete: isDelete
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ message: "An error occurred", error });
    }
});
exports.deleteTask = deleteTask;
