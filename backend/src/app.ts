import express, { Application, Request, Response } from "express";
import cors from "cors";
import userRotuer from "./app/module/user/user.route";
import taskRotuer from "./app/module/task/task.route";

const app: Application = express();
//cors
app.use(cors());
// parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req: Request, res: Response) => {
    return res.json({ msg: 'This is the base URL.' });
});

app.use('/user', userRotuer);
app.use('/tasks', taskRotuer);

export default app;
