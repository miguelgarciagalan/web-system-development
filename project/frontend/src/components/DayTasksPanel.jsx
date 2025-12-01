// src/components/DayTasksPanel.jsx
import TaskItem from './TaskItem.jsx';
import TaskForm from './TaskForm.jsx';
import { useState } from 'react';

const formatDateNice = (date) => {
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const formatShort = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};

const DayTasksPanel = ({
  date,
  tasks,
  daySort,
  onDaySortChange,
  statusFilter,
  importantOnly,
  searchQuery,
  onStatusFilterChange,
  onImportantOnlyChange,
  onSearchQueryChange,
  onClearFilters,
  openCreate,
  setOpenCreate,
  upcomingTasks,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [showCreate, setShowCreate] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editState, setEditState] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    status: 'todo',
    important: false,
  });

  const sortedTasks = [...tasks].sort((a, b) => {
    if (daySort === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (daySort === 'status') {
      const order = { todo: 1, 'in-progress': 2, done: 3 };
      return order[a.status] - order[b.status];
    }
    // por defecto ordenar por hora de inicio
    const normalize = (task) => {
      if (!task.startTime) return '99:99';
      return task.startTime;
    };
    return normalize(a).localeCompare(normalize(b));
  });

  const openEditModal = (task) => {
    setEditingTask(task);
    setEditState({
      title: task.title || '',
      description: task.description || '',
      startTime: task.startTime || '',
      endTime: task.endTime || '',
      status: task.status,
      important: task.important,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingTask) return;
    await onUpdateTask(editingTask.id, {
      title: editState.title.trim(),
      description: editState.description.trim(),
      startTime: editState.startTime || null,
      endTime: editState.endTime || null,
      status: editState.status,
      important: editState.important,
    });
    setEditingTask(null);
  };

  return (
    <div className="day-tasks-panel">
      <div className="panel-header">
        <div>
          <p className="panel-date-label">Dia seleccionado</p>
          <h2 className="panel-date">{formatDateNice(date)}</h2>
        </div>
        <div className="panel-count">
          <span>{tasks.length}</span> tareas
        </div>
      </div>

      <div className="filters-bar">
        <input
          className="filter-input"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Buscar titulo o descripcion"
        />
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
        >
          <option value="all">Estado: todos</option>
          <option value="todo">TODO</option>
          <option value="in-progress">IN PROGRESS</option>
          <option value="done">DONE</option>
        </select>
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={importantOnly}
            onChange={(e) => onImportantOnlyChange(e.target.checked)}
          />
          Solo importantes
        </label>
        <div className="filters-actions">
          <select
            className="filter-select"
            value={daySort}
            onChange={(e) => onDaySortChange(e.target.value)}
          >
            <option value="time">Orden: hora</option>
            <option value="status">Orden: estado</option>
            <option value="title">Orden: titulo</option>
          </select>
          <button type="button" className="filter-clear-btn" onClick={onClearFilters}>
            Limpiar filtros
          </button>
        </div>
      </div>

      <div className="panel-actions">
        <button className="form-submit" type="button" onClick={() => setOpenCreate(true)}>
          Crear tarea
        </button>
      </div>

      {sortedTasks.length === 0 ? (
        <p className="no-tasks">No hay tareas para este dia (segun filtros)</p>
      ) : (
        <ul className="task-list">
          {sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={onDeleteTask}
              onEdit={(t) => openEditModal(t)}
            />
          ))}
        </ul>
      )}

      <div className="upcoming-section">
        <div className="upcoming-header">
          <h3>Proximas tareas</h3>
          <span className="badge">{upcomingTasks.length}</span>
        </div>
        {upcomingTasks.length === 0 ? (
          <p className="no-tasks">No hay proximas tareas</p>
        ) : (
          <ul className="upcoming-list">
            {upcomingTasks.map((task) => (
              <li key={task.id} className="upcoming-item">
                <div>
                  <p className="upcoming-title">
                    {task.title}
                    {task.important && (
                      <span className="task-badge important">IMP</span>
                    )}
                  </p>
                  <p className="upcoming-desc">
                    {formatShort(task.date)}
                    {task.startTime ? ` · ${task.startTime}` : ''}
                  </p>
                </div>
                <span className={`task-status status-${task.status}`}>
                  {task.status.toUpperCase()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {openCreate && (
        <div className="modal-overlay" onClick={() => setOpenCreate(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Crear tarea</h3>
            <TaskForm
              date={date}
              onCreate={onCreateTask}
              onAfterSubmit={() => setOpenCreate(false)}
            />
            <button className="task-btn task-btn-cancel" type="button" onClick={() => setOpenCreate(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {editingTask && (
        <div className="modal-overlay" onClick={() => setEditingTask(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Editar tarea</h3>
            <form className="task-form" onSubmit={handleEditSubmit}>
              <label className="form-label">
                Titulo *
                <input
                  className="form-input"
                  type="text"
                  value={editState.title}
                  onChange={(e) => setEditState({ ...editState, title: e.target.value })}
                  required
                />
              </label>
              <div className="form-row">
                <label className="form-label">
                  Inicio
                  <input
                    className="form-input"
                    type="time"
                    value={editState.startTime}
                    onChange={(e) => setEditState({ ...editState, startTime: e.target.value })}
                  />
                </label>
                <label className="form-label">
                  Fin
                  <input
                    className="form-input"
                    type="time"
                    value={editState.endTime}
                    onChange={(e) => setEditState({ ...editState, endTime: e.target.value })}
                  />
                </label>
              </div>
              <label className="form-label">
                Descripcion
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={editState.description}
                  onChange={(e) =>
                    setEditState({ ...editState, description: e.target.value })
                  }
                />
              </label>
              <div className="form-row">
                <label className="form-label">
                  Estado
                  <select
                    className="form-select"
                    value={editState.status}
                    onChange={(e) => setEditState({ ...editState, status: e.target.value })}
                  >
                    <option value="todo">TODO</option>
                    <option value="in-progress">IN PROGRESS</option>
                    <option value="done">DONE</option>
                  </select>
                </label>

                <label className="form-checkbox">
                  <input
                    type="checkbox"
                    checked={editState.important}
                    onChange={(e) => setEditState({ ...editState, important: e.target.checked })}
                  />
                  Importante
                </label>
              </div>
              <div className="task-actions" style={{ justifyContent: 'flex-end' }}>
                <button className="task-btn task-btn-save" type="submit">
                  Guardar
                </button>
                <button
                  className="task-btn task-btn-cancel"
                  type="button"
                  onClick={() => setEditingTask(null)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayTasksPanel;
