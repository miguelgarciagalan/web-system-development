// src/pages/CalendarPage.jsx
import { useEffect, useState } from 'react';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../services/taskService.js';
import CalendarView from '../components/CalendarView.jsx';
import DayTasksPanel from '../components/DayTasksPanel.jsx';
import '../styles/Calendar.css';

// Formatea una Date a YYYY-MM-DD usando la hora LOCAL (sin UTC)
const formatDateLocal = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [importantOnly, setImportantOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [daySort, setDaySort] = useState('time');
  const [viewMode, setViewMode] = useState('calendar'); // calendar | list (kanban)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openCreate, setOpenCreate] = useState(false);

  // Cargar tareas del backend
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await fetchTasks();
        setTasks(data);
      } catch (err) {
        console.error(err);
        setError('Error loading tasks');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
  };

  const handleDoubleClickDay = (date) => {
    setSelectedDate(date);
    // abrir modal de crear tarea (se controla en DayTasksPanel por props)
    setOpenCreate(true);
  };

  // Crear tarea para el dia seleccionado
  const handleCreateTask = async (taskDataFromForm) => {
    const created = await createTask(taskDataFromForm);
    setTasks((prev) => [...prev, created]);
  };

  // Actualizar tarea
  const handleUpdateTask = async (id, updates) => {
    const updated = await updateTask(id, updates);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  // Borrar tarea
  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const matchesSearch = (task, query) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      (task.title || '').toLowerCase().includes(q) ||
      (task.description || '').toLowerCase().includes(q)
    );
  };

  const filteredTasks = tasks.filter((t) => {
    const statusOk = statusFilter === 'all' || t.status === statusFilter;
    const importantOk = !importantOnly || t.important;
    const searchOk = matchesSearch(t, searchQuery);
    return statusOk && importantOk && searchOk;
  });

  // Filtrar tareas del dia seleccionado usando fecha LOCAL
  const selectedDateStr = formatDateLocal(selectedDate); // YYYY-MM-DD

  const tasksForSelectedDate = filteredTasks.filter((t) => t.date === selectedDateStr);

  const parseDateTime = (task) => {
    const [year, month, day] = task.date.split('-').map(Number);
    const [hours, minutes] = (task.startTime || '23:59').split(':').map(Number);
    return new Date(year, month - 1, day, hours || 0, minutes || 0);
  };

  const todayStr = formatDateLocal(new Date());
  const upcomingTasks = filteredTasks
    .filter((t) => t.date && t.date >= todayStr)
    .sort((a, b) => parseDateTime(a) - parseDateTime(b))
    .slice(0, 5);

  const sortedGlobalTasks = [...filteredTasks].sort((a, b) => parseDateTime(a) - parseDateTime(b));

  const handleClearFilters = () => {
    setStatusFilter('all');
    setImportantOnly(false);
    setSearchQuery('');
    setDaySort('time');
  };

  const statusOrder = ['todo', 'in-progress', 'done'];
  const statusLabels = {
    todo: 'To Do',
    'in-progress': 'En progreso',
    done: 'Hecho',
  };

  const groupedTasks = statusOrder.reduce((acc, status) => {
    acc[status] = filteredTasks
      .filter((t) => t.status === status)
      .sort((a, b) => parseDateTime(a) - parseDateTime(b));
    return acc;
  }, {});

  const handleDropStatus = async (taskId, newStatus) => {
    await handleUpdateTask(taskId, { status: newStatus });
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/task-id');
    if (taskId) {
      handleDropStatus(taskId, newStatus);
    }
  };

  return (
    <div className="calendar-page">
      <h1 className="calendar-title">StudyCalendar</h1>

      {loading && <p>Loading tasks...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="top-bar">
        <div className="view-toggle">
          <button
            type="button"
            className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => setViewMode('calendar')}
          >
            Calendario
          </button>
          <button
            type="button"
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            Lista
          </button>
        </div>
      </div>

      <div className="calendar-layout">
        {viewMode === 'calendar' ? (
          <CalendarView
            currentMonth={currentMonth}
            tasks={filteredTasks}
            selectedDate={selectedDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onSelectDate={handleSelectDate}
            onDoubleClickDay={handleDoubleClickDay}
          />
        ) : (
          <div className="kanban-board">
            {statusOrder.map((status) => (
              <div
                key={status}
                className="kanban-column"
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, status)}
              >
                <div className="kanban-column-header">
                  <span>{statusLabels[status]}</span>
                  <span className="badge">{groupedTasks[status]?.length || 0}</span>
                </div>
                <div className="kanban-column-body">
                  {groupedTasks[status]?.length === 0 ? (
                    <p className="no-tasks">Sin tareas</p>
                  ) : (
                    groupedTasks[status].map((task) => (
                      <div
                        key={task.id}
                        className="kanban-card"
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('text/task-id', task.id)}
                      >
                        <div className="kanban-card-title">
                          {task.title}
                          {task.important && (
                            <span className="task-badge important" style={{ marginLeft: '0.35rem' }}>
                              IMP
                            </span>
                          )}
                        </div>
                        {task.description && (
                          <p className="kanban-card-desc">{task.description}</p>
                        )}
                        <div className="kanban-card-meta">
                          <span>{task.date}</span>
                          {task.startTime && <span>{task.startTime}</span>}
                        </div>
                        <div className="kanban-card-actions">
                          <button
                            className="task-btn task-btn-edit"
                            type="button"
                            onClick={() => handleUpdateTask(task.id, {})}
                            disabled
                          >
                            Mover con drag
                          </button>
                          <button
                            className="task-btn task-btn-delete"
                            type="button"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            Borrar
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <DayTasksPanel
          date={selectedDate}
          tasks={tasksForSelectedDate}
          daySort={daySort}
          onDaySortChange={setDaySort}
          statusFilter={statusFilter}
          importantOnly={importantOnly}
          searchQuery={searchQuery}
          onStatusFilterChange={setStatusFilter}
          onImportantOnlyChange={setImportantOnly}
          onSearchQueryChange={setSearchQuery}
          onClearFilters={handleClearFilters}
          openCreate={openCreate}
          setOpenCreate={setOpenCreate}
          upcomingTasks={upcomingTasks}
          onCreateTask={handleCreateTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>
    </div>
  );
};

export default CalendarPage;
