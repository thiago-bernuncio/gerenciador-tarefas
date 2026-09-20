import { Router } from "express";
import { listTasks } from "../controllers/taskController.js";

const taskRoutes = Router()

taskRoutes.get('/', listTasks)

export default taskRoutes