import {useState} from 'react'
import './App.css'

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  
  const [title, setTitle] = useState('')

  const [tasks, setTasks] = useState([])

  const [editingTaskId, setEditingTaskId] = useState(null)

  const pendingTasksCount = tasks.filter((task) => !task.completed).length

  const completedTasksCount = tasks.filter((task) => task.completed,).length

  function handleOpenCreateForm() {
    setEditingTaskId(null)
    setTitle('')
    setIsFormOpen(true)
  }

  function handleOpenEditForm(task) {
    setEditingTaskId(task.id)
    setTitle(task.title)
    setIsFormOpen(true)
  }

  function handleCloseForm(){
    setIsFormOpen(false)
    setEditingTaskId(null)
    setTitle('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    const normalizedTitle = title.trim()

    if(!normalizedTitle) {
      return
    }

    if(editingTaskId) {
      setTasks((currentTasks) => 
        currentTasks.map((task) => 
          task.id === editingTaskId
            ? {
              ...task,
              title: normalizedTitle,
              updatedAT: new Date().toDateString(),
            }
            : task,
       )
      )
    } else {
      const newTask = {
        id: crypto.randomUUID(),
        title: normalizedTitle,
        completed: false,
        createdAt: new Date().toISOString()
      }

      setTasks((currentTasks) => [
        ...currentTasks,
        newTask
      ])
    }
    handleCloseForm()
  }

  function handleToggleTask(taskId) {
    setTasks((currentTasks) => 
    currentTasks.map((task) => {
      if(task.id === taskId) {
        return {
          ...task,
          completed: !task.completed,
        }
      }
      return task
    }))
  }

  function handleDeleteTask(taskId) {
    const shoudDelete = window.confirm('Tem certeza de que deseja excluir esta tarefa?')

    if(!shoudDelete) {
      return
    }

    setTasks((currentTasks) => 
      currentTasks.filter((task) => task.id !== taskId)
    )

    if(editingTaskId === taskId) {
      handleCloseForm()
    }
  }



  return (
    <div className="app">
      <header className="app-header">
        <span className="app-label">Organização pessoal</span>
        <h1>Gerenciador de Tarefas</h1>
        <p>Organize suas atividades e acompanhe seu progresso.</p>
      </header>

      <main className="app-content">
        <section className="task-toolbar">
          <div>
            <h2>Minhas tarefas</h2>
            <p>
              {tasks.length}{' '}
              {tasks.length < 2
                ? 'tarefa cadastrada'
                : 'tarefas cadastradas'}
            </p>

            <p>
              {completedTasksCount}{' '}
              {completedTasksCount < 2 ? 'Tarefa concluída' : 'Tarefas concluídas'}
            </p>

            <span className="pending-count">
              {pendingTasksCount}{' '}
              {pendingTasksCount < 2
                ? 'tarefa pendente'
                : 'tarefas pendentes'}
            </span>

            {tasks.length > 0 && pendingTasksCount === 0 && (
              <p>Parabéns! Todas as tarefas foram concluídas.</p>
            )}
          </div>

          <button type="button" onClick={handleOpenCreateForm}>
            Nova tarefa
          </button>
        </section>

        {isFormOpen && (
          <section className="task-form-card">
            <h2>
              {editingTaskId ? 'Editar tarefa' : 'Criar nova tarefa'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className='form-group'>
                <label htmlFor="task-title">
                  Título
                </label>

                <input
                  id="task-title"
                  type="text"
                  placeholder="Ex.: Estudar React"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)} 
                  maxLength={60}
                  autoFocus
                  required              
                  /> 

                <span className="character-counter">
                  {title.length}/60 caracteres
                </span>
              </div>

              <div className="form-actions">
                <button 
                className="secondary-button"
                type="button"
                onClick={handleCloseForm}>
                  Cancelar
                </button>

                <button 
                className="primary-button" 
                type="submit">
                  {editingTaskId ? 'Salvar alterações' : 'Salvar tarefa'}
                </button>
              </div>
            </form>
          </section>
        )}

        {tasks.length === 0 ? (
          <section className="empty-state">
            <h2>Nenhma tarefa cadastrada</h2>
            <p>Crie sua primeira tarefa para começar.</p>
          </section>
        ) : (
          <section className="task-list">
            <ul>
              {tasks.map((task) => (
                <li className={`task-item ${task.completed ? 'task-item--completed' : ''}`} key={task.id}>
                  <label className="task-check">
                    <input
                     type="checkbox"
                     checked={task.completed}
                     onChange={() => handleToggleTask(task.id)}
                     />

                     <span className="task-information">
                      <strong>{task.title}</strong>

                      <span>
                        {task.completed ? 'Tarefa concluída' : 'Tarefa pendente'}
                      </span>

                      <time dateTime={task.createdAt}>
                        {new Date(task.createdAt).toLocaleString('pt-BR')}
                      </time>

                      {task.updatedAT && (
                        <time dateTime={task.updatedAT}>
                          Atualizado em {' '}{new Date(task.updatedAT).toLocaleString('pt-BR')}
                        </time>
                      )}
                     </span>
                  </label>

                  <div className="task-actions">
                    <span className={`task-status ${task.completed ? 'task-status--completed' : ''}`}>
                      {task.completed ? 'Concluída' : 'Pendente'}
                    </span>

                    <button className="edit-button" type='button' onClick={() => handleOpenEditForm(task)} aria-label={`Editar tarefa ${task.title}`}>
                      Editar
                    </button>

                    <button 
                      className="delete-button" 
                      type="button" 
                      onClick={() => handleDeleteTask(task.id)} 
                      aria-label={`Excluir tarefa ${task.title}`}
                      >
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
