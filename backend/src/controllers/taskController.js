import {tasks} from '../data/tasks.js'
import {pool} from '../config/database.js'

export async function listTasks(request, response) {
    try {
        const result = await pool.query(`
            SELECT
                id,
                title,
                priority,
                TO_CHAR(due_date, 'YYYY-MM-DD') AS "dueDate",
                completed,
                created_at AS "createdAt",
                updated_at AS "updatedAt"
            FROM public.tasks
            ORDER BY created_at DESC
        `)

        return response.status(200).json({
            data: result.rows,
            total: result.rows.length,
        })
    } catch (error) {
        console.error(
            'Erro ao listar tarefas:',
            error.message,
        )

        return response.status(500).json({
            error: 'Não foi possivel listar as tarefas',
        })
    }
}

export async function createTask(request, response) {
    const {
        title,
        priority = 'medium',
        dueDate = null,
    } = request.body ?? {}

    const normalizedTitle = typeof title === 'string' ? title.trim() : ''

    if(!normalizedTitle) {
        return response.status(400).json({
            error: 'O título é obrigatório'
         })
    }

    if(normalizedTitle.length > 60) {
        return response.status(400).json({
            error: 'O título deve ter no máximo 60 caracteres',
        })
    }

    const validPriorities = [
        'low',
        'medium',
        'high',
    ]

    if(!validPriorities.includes(priority)) {
        return response.status(400).json({
            error: 'Prioridade inválida',
        })
    }

    const datePattern = /^\d{4}-\d{2}-\d{2}$/

    if(dueDate !== null && dueDate !== '' && (typeof dueDate !== 'string' || !datePattern.test(dueDate))) {
        return response.status(400).json({
            error: 'O prazo deve usar o formato AAAA-MM-DD',
        })
    }

    try {
        const result = await pool.query(
            `
                INSERT INTO public.tasks(
                title, 
                priority,
                due_date
                )
                VALUES ($1, $2, $3)
                RETURNING
                    id,
                    title,
                    priority,
                    TO_CHAR(
                        due_date,
                        'YYYY-MM-DD' 
                        ) AS "dueDate",
                         completed,
                         created_at AS "createdAt",
                         updated_at AS "updatedAt"
            `,
            [
                normalizedTitle,
                priority,
                dueDate || null,
            ],
        )

        return response.status(201).json({
            data: result.rows[0],
        })
    } catch(error) {
        console.error(
            'Erro ao criar tarefa:',
            error.message,
        )

        return response.status(500).json({
            error: 'Não foi possível criar a tarefa',
        })
    }
}

export async function getTaskById(
    request, response
) {
    const {id} = request.params

    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    if(!uuidPattern.test(id)) {
        return response.status(400).json({
            error: 'Identificador inválido',
            taskId: id,
        })
    }

    try {
        const result = await pool.query(
            `
                SELECT
                    id,
                    title,
                    priority,
                    TO_CHAR(
                        due_date,
                        'YYYY-MM-DD'
                    ) AS "dueDate",
                     completed,
                     created_at AS "createdAt",
                     updated_at AS "updatedAt"
                FROM public.tasks
                WHERE id = $1
            `,
            [id],
        )

        const task = result.rows[0]
        
        if(!task) {
            return response.status(404).json({
                error: 'Tarefa não encontrada',
                taskId: id,
            })
        }

        return response.status(200).json({
            data: task,
        })

    } catch (error) {
        console.error(
            'Erro ao buscar tarefa:',
            error.message,
        )

        return response.status(500).json({
            error: 'Não foi possível buscar a tarefa'
        })
    }
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
