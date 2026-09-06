import {useState} from 'react'
import './App.css'

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [title, setTitle] = useState('')

  function handleCloseForm(){
    setIsFormOpen(false)
    setTitle('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    console.log({
      title: title,
    })

    setTitle('')
    setIsFormOpen(false)
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
            <p>0 tarefas cadastradas</p>
          </div>

          <button type="button" onClick={() => setIsFormOpen(true)}>
            Nova tarefa
          </button>
        </section>

        {isFormOpen && (
          <section className="task-form-card">
            <h2>Criar nova tarefa</h2>

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
                  Salvar tarefa
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="empty-state">
          <h2>Nenhuma tarefa cadastrada</h2>
          <p>Crie sua primeira tarefa para começar.</p>
          <span className="empty-tip">
            Use o botão "Nova tarefa" para começar.
          </span>
        </section>
      </main>
    </div>
  )
}

export default App
