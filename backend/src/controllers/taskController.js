import {randomUUID} from 'node:crypto'
import {tasks} from '../data/tasks.js'
import { error } from 'node:console'

export function listTasks(request, response) {
    return response.status(200).json({
        data: tasks,
        total: tasks.length,
    })
}

export function getTaskById(request, response) {
    const {id} = request.params

    const task = tasks.find(
        (currentTask) => currentTask.id === id
    )

    if(!task) {
        return response.status(404).json({
            error: 'Tarefa não encontrada',
            taskIs: id,
        })
    }

    return response.status(200).json({
        data: task
    })
}

export function createTask(request, response){
    const {
        title,
        priority = 'medium',
        dueDate = null,
    } = request.body

    const normalizedTitle = 
        typeof title === 'string'
            ? title.trim()
            : ''
    
    if(!normalizedTitle) {
        return response.status(400).json({
            error: 'O título é obrigatório'
        })
    }

    if(normalizedTitle.length > 60) {
        return response.status(400).json({
            error: 'O título deve ter no máximo 60 caracteres'
        })
    }

    const validPriorities = [
        'low',
        'medium',
        'high',
    ]

    const newTask = {
        id: randomUUID(),
        title: normalizedTitle,
        priority,
        dueDate: dueDate || null,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: null,
    }

    tasks.push(newTask)

    return response.status(201).json({
        data: newTask
    })
}