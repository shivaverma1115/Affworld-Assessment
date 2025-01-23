import express  from "express";
import { addTask, deleteTask, getTask} from "./task.controller";

const taskRotuer = express.Router();

taskRotuer.get('/:_id',getTask);
taskRotuer.post('/add',addTask);
taskRotuer.delete('/:taskId',deleteTask);

export default taskRotuer;