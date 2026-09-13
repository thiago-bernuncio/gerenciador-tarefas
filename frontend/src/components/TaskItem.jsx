
const PRIORITY_LABELS = {
        low: 'Baixa',
        medium: 'Média',
        high: 'Alta',
    }

const TaskItem = ({task, onToggle, onEdit, onDelete}) => {

    const taskPriority = task.priority ?? 'medium'

    function formatDateTime(date) {
        return new Date(date).toLocaleString('pt-BR')
    }

    function formatDueDate(date) {
        return new Date(`${date}T00:00:00`,).toLocaleDateString('pt-BR')
    }


  return (
    <li
        className={`task-item ${
            task.completed ? 'task-item--completed' : ''
        }`}
    >
        <label className="task-check">
            <input 
            type="checkbox" 
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            aria-label={`${
                task.completed ? 'Reabrir' : 'Conluir'
            } tarefa ${task.title}`}
            />

            <span className="task-information">
                <strong>{task.title}</strong>

                <span className="task-metadata">
                    <span className={`task-priority task-priority--${taskPriority}`}>
                        {PRIORITY_LABELS[taskPriority]}
                    </span>

                    <span className="task-due-date">
                        {task.dueDate ? `Prazo: ${formatDueDate(task.dueDate)}` : 'Sem prazo'}
                    </span>
                </span>

                <span>
                    {task.completed ? 'Tarefa concluída' : 'Tarefa pendente'}
                </span>

                <time dateTime={task.createdAt}>
                        Criada em {formatDateTime(task.createdAt)}
                </time>

                {task.updatedAt && (
                    <time dateTime={task.updatedAt}>
                        Atualizada em {' '}
                        {formatDateTime(task.updatedAt)}
                    </time>
                )}
            </span>
        </label>

        <div className="task-actions">
            <span
                className={`task-status ${
                    task.completed ? 'task-status--completed' : ''
                }`}
            >
                {task.completed ? 'Conluída' : 'Pendente'}
            </span>

            <button
                className="edit-button"
                type="button"
                onClick={() => onEdit(task)}
                aria-label={`Editar tarefa ${task.title}`}
            >
                Editar
            </button>

            <button
                className="delete-button"
                type="button"
                onClick={() => onDelete(task.id)}
                aria-label={`Excluir tarefa ${task.title}`}
            >
                Excluir
            </button>
        </div>
    </li>
  )
}

export default TaskItem