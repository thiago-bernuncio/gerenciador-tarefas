import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import { pool } from './config/database.js'

import taskRoutes from './routes/taskRoutes.js'



const app = express()

// middlewares
app.use(cors())
app.use(express.json())

app.use('/api/tasks', taskRoutes)

app.get('/health', (request, response) => {
    return response.status(200).json({
        status: 'ok',
        message: 'Servidor funcionando',
    })
})

app.get('/api', (request, response) => {
    return response.status(200).json({
        "name": "Gerenciador de Tarefas API",
        "version": "1.0.0"
    })
})

async function startServer() {
    try{
        await pool.query('SELECT 1')
        console.log('PostgreSQL conectado com sucesso')

        app.listen(env.port, () => {
            console.log(`Servidor executando na porta ${env.port}`,

            )
        })
    } catch (error) {
        console.error(
            'Falha ao conectar ao PostgreSQL:', error.message
        )
    }
}

startServer()
