import { Router } from "express";
import { createTask, getTaskById, listTasks, updateTask } from "../controllers/taskController.js";

const taskRoutes = Router()

taskRoutes.get('/', listTasks)

taskRoutes.get('/:id', getTaskById)

taskRoutes.post('/', createTask)

taskRoutes.patch('/:id', updateTask)

export default taskRoutes