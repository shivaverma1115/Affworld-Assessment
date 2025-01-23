import express, { Application, Request, Response } from "express";
import cors from "cors";
import userRotuer from "./app/module/user/user.route";
import taskRotuer from "./app/module/task/task.route";

require('dotenv').config();

const app: Application = express();
//cors

const allowedOrigins = [process.env.FRONTENED_URL, 'http://localhost:3000'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req: Request, res: Response) => {
    return res.json({ msg: 'This is the base URL.' });
});

app.use('/user', userRotuer);
app.use('/tasks', taskRotuer);

export default app;
