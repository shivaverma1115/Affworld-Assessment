"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_route_1 = __importDefault(require("./app/module/user/user.route"));
const task_route_1 = __importDefault(require("./app/module/task/task.route"));
const app = (0, express_1.default)();
//cors
app.use((0, cors_1.default)({ origin: '*' }));
// parse data
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/api", (req, res) => {
    return res.json({ msg: 'This is the base URL.' });
});
app.use('/user', user_route_1.default);
app.use('/tasks', task_route_1.default);
exports.default = app;
