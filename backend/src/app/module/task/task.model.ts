import { model, Schema } from "mongoose";
import { ITask } from "./task.interface";

const taskSchema = new Schema<ITask>({
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
})

export const Task = model('task', taskSchema)
