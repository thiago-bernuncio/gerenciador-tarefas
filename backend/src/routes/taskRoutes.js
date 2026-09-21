import { Router } from "express";
import { createTask, listTasks } from "../controllers/taskController.js";

const taskRoutes = Router()

taskRoutes.get('/', listTasks)

taskRoutes.post('/', createTask)

export default taskRoutes