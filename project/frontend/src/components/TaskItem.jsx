// src/components/TaskItem.jsx
const TaskItem = ({ task, onDelete, onEdit }) => {

  const timeLabel =
    task.startTime && task.endTime
      ? `${task.startTime} - ${task.endTime}`
      : task.startTime
      ? task.startTime
      : '';

  const handleDeleteClick = async () => {
    const ok = window.confirm('Eliminar esta tarea?');
    if (!ok) return;
    await onDelete(task.id);
  };

  return (
    <li className="task-item">
      <div className="task-main">
        <h3 className="task-title">
          {task.title}{' '}
          {task.important && <span className="task-badge important">IMP</span>}
        </h3>
        {task.description && <p className="task-desc">{task.description}</p>}
      </div>

      <div className="task-meta">
        {timeLabel && <span className="task-time">{timeLabel}</span>}
        <span className={`task-status status-${task.status}`}>
          {task.status.toUpperCase()}
        </span>

        <div className="task-actions">
          <button
            className="task-btn task-btn-edit"
            onClick={() => onEdit && onEdit(task)}
          >
            Editar
          </button>
          <button className="task-btn task-btn-delete" onClick={handleDeleteClick}>
            Borrar
          </button>
        </div>
      </div>
    </li>
  );
};

export default TaskItem;
