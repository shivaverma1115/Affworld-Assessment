import { Request, Response } from 'express'
import { Task } from './task.model';

require("dotenv").config();

export const getTask = async (req: Request, res: Response) => {
    try {
        console.log(req.params);
        const { _id } = req.params;
        const tasks = await Task.find({ userId: _id }).sort({ _id: -1 })
        return res.status(200).send({ message: "task fetch successful", tasks });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "An error occurred", error });
    }
};


export const addTask = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const { taskInfo, user } = req.body;
        if (!taskInfo || !user) return res.status(404).send({ message: "task and user info both are required" })
        const newTask = await Task.create({
            userId: user._id,
            name: taskInfo.name,
            description: taskInfo.description,
            status: taskInfo.status
        })
        return res.status(200).send({
            message: "add task successful",
            task: newTask
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "An error occurred", error });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        console.log(req.params);
        const { taskId } = req.params;
        if (!taskId) return res.status(404).send({ message: "task _id is required" })
        const isDelete = await Task.findByIdAndDelete({ _id: taskId });
        return res.status(200).send({
            message: "task delete successful",
            delete: isDelete
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "An error occurred", error });
    }
};