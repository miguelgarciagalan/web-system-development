// src/components/TaskDot.jsx

const TaskDot = ({ count, status = 'todo' }) => {
  return (
    <span className={`task-dot status-${status}`} title={`${count} tareas`}>
      {count}
    </span>
  );
};

export default TaskDot;
