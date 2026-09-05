
import './App.css'

function App() {

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

          <button type="button">
            Nova tarefa
          </button>
        </section>

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
