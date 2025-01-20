import express, { Application, Request, Response } from "express";
import cors from "cors";

const app: Application = express();
//cors
app.use(cors());
// parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    return res.json({ msg: 'This is the base URL' });
});

export default app;
