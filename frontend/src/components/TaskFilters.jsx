import React from 'react'

export const TaskFilters = ({
    searchTerm, 
    statusFilter, 
    priorityFilter,
    filteredCount,
    totalCount,
    hasActiveFilters,
    onSeachChange,
    onStatusChange,
    onPriorityChange,
    onClear,
    }) => {

        const resultLabel = filteredCount === 1 ? 'tarefa exibida' : 'tarefas exibidas'

        return (
            <section 
                className='task-filters'
                aria-label='Filtros de tarefas'
            >
                <div className='filter-group search-filter'>
                    <label htmlFor='task-search'>
                        Buscar
                    </label>

                    <input
                        id='task-search'
                        type='search'
                        placeholder='Digite o título da tarefa'
                        value={searchTerm}
                        onChange={(event) => onSeachChange(event.target.value)}
                    />
                </div>

                <div className='filter-group'>
                    <label htmlFor='status-filter'>
                        Status
                    </label>
                    <select
                        id='status-filter'
                        value={statusFilter}
                        onChange={(event) => onStatusChange(event.target.value)}
                    >
                        <option value="all">Todos</option>
                        <option value="pending">Pendentes</option>
                        <option value="completed">Concluídas</option>
                    </select>
                </div>

                <div className='filter-group'>
                    <label htmlFor='priority-filter'>
                        Prioridade
                    </label>
                    <select
                        id='priority-filter'
                        value={priorityFilter}
                        onChange={(event) => onPriorityChange(event.target.value)}
                    >
                        <option value='all'>Todas</option>
                        <option value='low'>Baixa</option>
                        <option value='medium'>Média</option>
                        <option value='high'>Alta</option>
                    </select>
                </div>

                <div className='filter-footer'>
                    <p className='filter-results'>
                        {filteredCount} de {totalCount}{resultLabel}
                        
                    </p>

                    {hasActiveFilters && (
                        <button
                            className='clear-filters-button'
                            type='button'
                            onClick={onClear}
                        >
                            Limpar filtros
                        </button>
                    )}
                </div>
            </section>

    )
}
