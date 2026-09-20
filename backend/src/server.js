import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

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

const port = process.env.PORT || 3333

app.listen(port, () => {
    console.log(`Servidor executando na porta ${port}`)
})