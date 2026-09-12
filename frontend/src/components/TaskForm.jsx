

function TaskForm({
    isEditing,
    title,
    priority,
    dueDate,
    onTitleChange,
    onPriorityChange,
    onDueDateChange,
    onSubmit,
    onCancel,
}) {

    const PRIORITY_OPTIONS = [
        {value: 'low', label: 'Baixa'},
        {value: 'medium', label: 'Média'},
        {value: 'high', label: 'Alta'}
    ]

    return (
        <section className="task-form-card">
            <h2>
                {isEditing
                ? 'Editar tarefa'
                : 'Criar nova tarefa'}
            </h2>

            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="task-title">
                        Título
                    </label>

                    <input 
                        id="task-title"
                        type="text"
                        placeholder="Ex.: Estudar React"
                        value={title}
                        onChange={(event) => onTitleChange(event.target.value)}
                        maxLength={60}
                        autoFocus
                        required
                    />
                    <span className="character-counter">
                        {title.length}/60 caracteres
                    </span>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="task-priority">
                            Prioridade
                        </label>

                        <select
                            id="task-priority"
                            value={priority}
                            onChange={(event) => onPriorityChange(event.target.value)}
                        >
                            {PRIORITY_OPTIONS.map((option) => (
                                <option 
                                 key={option.value}
                                 value={option.value}   
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="task-due-date">
                            Prazo
                        </label>

                        <input 
                            id="task-due-date"
                            type="date"
                            value={dueDate}
                            onChange={(event) => onDueDateChange(event.target.value)}
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        className="secondary-button"
                        type="button"
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>

                    <button className="primary-button" type="submit">
                        {isEditing ? 'Salvar alterações' : 'Salvar tarefa'}
                    </button>
                </div>
            </form>
        </section>
    )
}

export default TaskForm