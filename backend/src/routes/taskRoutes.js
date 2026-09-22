import { Router } from "express";
import { createTask, getTaskById, listTasks } from "../controllers/taskController.js";

const taskRoutes = Router()

taskRoutes.get('/', listTasks)

taskRoutes.get('/:id', getTaskById)

taskRoutes.post('/', createTask)

export default taskRoutes