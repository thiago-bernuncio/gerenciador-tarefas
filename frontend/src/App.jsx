import {useState} from 'react'
import { useEffect } from 'react'

// Componentes
import TaskForm from './components/TaskForm'

import './App.css'

const STORAGE_KEY = 'task-manager:tasks'

const PRIORITY_LABELS = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
}

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  
  const [title, setTitle] = useState('')

  const [tasks, setTasks] = useState(() => {

    const storadTasks = localStorage.getItem(STORAGE_KEY)

    if(!storadTasks) {
      return []
    }

    try {

      return JSON.parse(storadTasks)

    } catch(error) {

      console.error(
        'Não foi possível carregar as tarefas:',
        error
      )

      return []

    }
  })

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tasks)
    )
  }, [tasks])

  const [editingTaskId, setEditingTaskId] = useState(null)

  const pendingTasksCount = tasks.filter((task) => !task.completed).length

  const completedTasksCount = tasks.filter((task) => task.completed,).length

  const [priority, setPriority] = useState('medium')

  const [dueDate, setDueDate] = useState('')

  const [searchTerm, setSerchTerm] = useState('')

  const [statusFilter, setStatusFilter] = useState('all')

  const [priorityFilter, setPriorityFilter] = useState('all')

  const highPriorityPendingCount = tasks.filter(
    (task) => 
      !task.completed &&
      task.priority === 'high',
  ).length

  const hasActiveFilters = searchTerm.trim() !== '' || statusFilter !== 'all' || priorityFilter !== 'all'

  const filteredTasks = tasks.filter((task) => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const matchesSearch = task.title.toLowerCase().includes(normalizedSearch)

    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'pending' && !task.completed) ||
      (statusFilter === "completed" && task.completed)

    const taskPriority = task.priority ?? 'medium'

    const matchesPriority = priorityFilter === 'all' ||
      taskPriority === priorityFilter

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    )

  })




  function handleOpenCreateForm() {
    setEditingTaskId(null)
    setTitle('')
    setPriority('medium')
    setDueDate('')
    setIsFormOpen(true)
  }

  function handleOpenEditForm(task) {
    setEditingTaskId(task.id)
    setTitle(task.title)
    setPriority(task.priority ?? 'medium')
    setDueDate(task.dueDate ?? '')
    setIsFormOpen(true)
  }

  function handleCloseForm(){
    setIsFormOpen(false)
    setEditingTaskId(null)
    setTitle('')
    setPriority('medium')
    setDueDate('')
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
              priority,
              dueDate,
              updatedAT: new Date().toDateString(),
            }
            : task,
       )
      )
    } else {
      const newTask = {
        id: crypto.randomUUID(),
        title: normalizedTitle,
        priority,
        dueDate,
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

  function handleClearCompleteTaks() {
    const shoudClear = window.confirm(
      'Deseja remover todas as tarefas concluídas?'
    )

    if(!shoudClear) {
      return
    }

    setTasks((currentTasks) => 
      currentTasks.filter((task) => !task.completed)
    )


  }

  function handleClearFilters() {
    setSerchTerm('')
    setStatusFilter('all')
    setPriorityFilter('all')
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

            <span className='high-priority-count'>
              {highPriorityPendingCount}{' '}
              {highPriorityPendingCount < 2 
                ? 'Prioridade alta pendente'
                : 'Prioridades altas pendentes'  
              }
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
          <TaskForm 
            isEditing={Boolean(editingTaskId)}
            title={title}
            priority={priority}
            dueDate={dueDate}
            onTitleChange={setTitle}
            onPriorityChange={setPriority}
            onDueDateChange={setDueDate}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
          />
        )}    

        {tasks.length > 0 && (
          <section
            className='task-filters'
            aria-label='Filtros de tarefas'
          >
            <div className='filter-group search-filter'>
              <label htmlFor="task-search">
                Buscar
              </label>

              <input
                id='task-search'
                type='search'
                placeholder='Digite o título da tarefa'
                value={searchTerm}
                onChange={(event) => setSerchTerm(event.target.value)}
              />
            </div>

            <div className='filter-group'>
              <label htmlFor="status-filter">
                Status
              </label>

              <select
                id='status-filter'
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">Todos</option>
                <option value="pending">Pendentes</option>
                <option value="completed">Concluídas</option>
              </select>
            </div>

            <div className='filter-group'>
              <label htmlFor="priority-filter">
                Prioridade
              </label>

              <select
                id='priority-filter'
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
              >
                <option value="all">Todas</option>
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>

            <p className='filter-results'>
              {filteredTasks.length} de {tasks.length}{' '}
              tarefas exibidas
            </p>

            {hasActiveFilters && (
              <button
                className='clear-filters-button'
                type='button'
                onClick={handleClearFilters}
              >
                Limpar filtros
              </button>
            )}

          </section>
        )}

        {tasks.length === 0 ? (
          <section className="empty-state">
            <h2>Nenhma tarefa cadastrada</h2>
            <p>Crie sua primeira tarefa para começar.</p>
          </section>
        ) : filteredTasks.length === 0 ? (
          <section className='empty-state'>
            <h2>Nenhuma tarefa encontrada</h2>
            <p>Tente alterar a busca ou os filtros.</p>
          </section>
        ) : (
          <section className="task-list">
            <ul>
              {filteredTasks.map((task) => (
                <li className={`task-item ${task.completed ? 'task-item--completed' : ''}`} key={task.id}>
                  <label className="task-check">
                    <input
                     type="checkbox"
                     checked={task.completed}
                     onChange={() => handleToggleTask(task.id)}
                     />

                     <span className="task-information">
                      <strong>{task.title}</strong>

                      <div className='task-metadata'>
                        <span
                          className={`task-priority task-priority--${task.priority ?? 'medium'}`}
                        >
                          {PRIORITY_LABELS[task.priority ?? 'medium']}
                        </span>

                        <span className='task-due-date'>
                          {task.dueDate
                            ? `Prazo: ${new Date(
                              `${task.dueDate}T00:00:00`,
                            ).toLocaleDateString('pt-BR')}`
                            : ' Sem prazo'}
                        </span>
                      </div>

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
              {completedTasksCount > 0 && (
            <button 
              className='clear-completed-button'
              type='button'
              onClick={handleClearCompleteTaks}
            >
              Limpar concluídas
            </button>
          )}
            </ul>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
