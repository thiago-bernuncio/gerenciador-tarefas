import {tasks} from '../data/tasks.js'

export function listTasks(request, response) {
    return response.status(200).json({
        data: tasks,
        total: tasks.length,
    })
}