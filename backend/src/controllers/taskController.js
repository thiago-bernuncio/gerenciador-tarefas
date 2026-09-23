import {randomUUID} from 'node:crypto'
import {tasks} from '../data/tasks.js'
import { error } from 'node:console'
import { normalize } from 'node:path'
import { type } from 'node:os'

export function listTasks(request, response) {
    return response.status(200).json({
        data: tasks,
        total: tasks.length,
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

export function updateTask(request, response) {
    const {id} = request.params

    const {
        title,
        priority,
        dueDate,
        completed
    } = request.body

    const task = tasks.find(
        (currentTask) => currentTask.id === id
    )

    if(!task) {
        return response.status(404).json({
            error: 'Tarefa não encontrada',
            taskId: id,
        })
    }

    const hasValidField = 
        title !== undefined ||
        priority !== undefined ||
        dueDate !== undefined ||
        completed !== undefined

    if(!hasValidField) {
        return response.status(404).json({
            error: 'Informe ao menos um campo para atualizar'
        })
    }

    if(title !== undefined) {
        const normalizedTitle = typeof title === 'string'
            ? title.trim()
            : ''

        if(!normalizedTitle) {
            return response.status(400).json({
                error: 'O título é obrigatório.'
            })
        }

        if(normalizedTitle.length > 60) {
            return response.status(400).json({
                error: 'O título dete ter no máximo 60 caracteres'
            })
        }

        task.title = normalizedTitle
    }

    if(priority !== undefined) {
        const validPriorities = [
            'low',
            'medium',
            'high',
        ]

        if(!validPriorities.includes(priority)) {
            return response.status(400).json({
                error: 'Prioridade inválida'
            })
        }

        task.priority = priority
    }

    const datePattern = /^\d{4}-\d{2}-\d{2}$/

    if(
        dueDate !== undefined &&
        dueDate !== null &&
        dueDate !== '' &&
        !datePattern.test(dueDate)
    ) {
        return response.status(400).json({
            error: 'O prazo deve usar o formato AAAA-MM-DD'
        })
    }

    if(dueDate !== undefined) {
        if(
            dueDate !== null &&
            typeof dueDate !== 'string'
        ) {
            return response.status(400).json({
                error: 'Prazo inválido'
            })
        }

        task.duaDate = dueDate || null
    }

    if(completed !== undefined) {
        if(typeof completed !== 'boolean') {
            return response.status(400).json({
                error: 'O campo completed deve ser booleano'
            })
        }

        task.completed = completed
    }

    task.updatedAt = new Date().toISOString()

    return response.status(200).json({
        data: task
    })
}

export function deleteTask(request, response) {
    const {id} = request.params

    const taskIndex = tasks.findIndex(
        (task) => task.id === id
    )
    
    if(taskIndex === -1) {
        return response.status(404).json({
            error: 'Tarefa não encontrada',
            taskId: id,
        })
    }

    const [deletedTask] = tasks.splice(taskIndex, 1)

    return response.status(200).json({
        message: 'Tarefa excluída com sucesso',
        data: deletedTask,
        remaininTotal: tasks.length
    })

}