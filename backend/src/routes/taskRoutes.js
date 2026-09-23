import { Router } from "express";
import { createTask, getTaskById, listTasks, updateTask, deleteTask } from "../controllers/taskController.js";

const taskRoutes = Router()

taskRoutes.get('/', listTasks)

taskRoutes.get('/:id', getTaskById)

taskRoutes.post('/', createTask)

taskRoutes.patch('/:id', updateTask)

taskRoutes.delete('/:id', deleteTask)

export default taskRoutes