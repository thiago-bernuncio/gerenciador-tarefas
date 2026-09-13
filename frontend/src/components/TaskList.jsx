import TaskItem from "./TaskItem"

const TaskList = ({
    tasks,
    totaslTasksCount,
    onToggle,
    onEdit,
    onDelete
}) => {

    if(totaslTasksCount === 0) {
        return (
            <section className="empty-state" aria-live="polite">
                <h2>Nenhuma tarefa cadastrada</h2>
                <p>Crie sua primeira tarefa para começar.</p>
            </section>
        )
    }

    if(tasks.length === 0){
        return(
            <section className="empty-state" aria-live="polite">
                <h2>Nenhuma tarefa encontrada</h2>
                <p>Tente alterar a busca ou os filtros.</p>
            </section>
        )
    }

  return (
    <section className="task-list">
        <ul>
            {tasks.map((task) => (
                <TaskItem 
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    </section>
  )
}

export default TaskList