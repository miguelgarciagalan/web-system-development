// src/components/CalendarView.jsx
import TaskDot from './TaskDot.jsx';

const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getDaysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

// Convertir getDay() de JS (0=Domingo) a indice 0=Lunes
function getMondayFirstIndex(date) {
  const jsDay = date.getDay(); // 0 (Sun) ... 6 (Sat)
  return (jsDay + 6) % 7; // 0 (Mon) ... 6 (Sun)
}

// Formatea una Date a YYYY-MM-DD usando la hora LOCAL
function formatDateLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const CalendarView = ({
  currentMonth,
  tasks,
  selectedDate,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
  onDoubleClickDay,
}) => {
  const year = currentMonth.getFullYear();
  const monthIndex = currentMonth.getMonth(); // 0-11

  const daysInMonth = getDaysInMonth(year, monthIndex);
  const firstOfMonth = new Date(year, monthIndex, 1);
  const startIndex = getMondayFirstIndex(firstOfMonth); // huecos en blanco antes

  // Crear array de 42 celdas (6 filas x 7 columnas)
  const cells = [];
  for (let i = 0; i < startIndex; i++) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(year, monthIndex, day));
  }
  while (cells.length < 42) {
    cells.push(null);
  }

  const selectedStr = formatDateLocal(selectedDate);
  const todayStr = formatDateLocal(new Date());

  const tasksByDate = tasks.reduce((acc, task) => {
    if (!task.date) return acc;
    if (!acc[task.date]) {
      acc[task.date] = {
        count: 0,
        statusCount: { todo: 0, 'in-progress': 0, done: 0 },
        titles: [],
      };
    }
    acc[task.date].count += 1;
    acc[task.date].statusCount[task.status] =
      (acc[task.date].statusCount[task.status] || 0) + 1;
    if (acc[task.date].titles.length < 3) {
      acc[task.date].titles.push(task.title);
    }
    return acc;
  }, {});

  const monthLabel = currentMonth.toLocaleString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

  const moveSelected = (deltaDays) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + deltaDays);
    const newMonthIndex = newDate.getMonth();
    const newYear = newDate.getFullYear();
    if (newYear < year || (newYear === year && newMonthIndex < monthIndex)) {
      onPrevMonth();
    } else if (newYear > year || (newYear === year && newMonthIndex > monthIndex)) {
      onNextMonth();
    }
    onSelectDate(newDate);
  };

  const handleGridKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      moveSelected(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      moveSelected(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveSelected(-7);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveSelected(7);
    } else if (e.key === 'Home') {
      e.preventDefault();
      onSelectDate(new Date(year, monthIndex, 1));
    } else if (e.key === 'End') {
      e.preventDefault();
      onSelectDate(new Date(year, monthIndex, daysInMonth));
    }
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button
          type="button"
          onClick={onPrevMonth}
          className="nav-btn"
          aria-label="Mes anterior"
        >
          {'<'}
        </button>
        <h2>{monthLabel}</h2>
        <button
          type="button"
          onClick={onNextMonth}
          className="nav-btn"
          aria-label="Mes siguiente"
        >
          {'>'}
        </button>
      </div>

      <div className="weekday-row">
        {weekdayLabels.map((label) => (
          <div key={label} className="weekday-cell">
            {label}
          </div>
        ))}
      </div>

      <div
        className="days-grid"
        tabIndex={0}
        role="grid"
        aria-label="Calendario mensual"
        onKeyDown={handleGridKeyDown}
      >
        {cells.map((date, idx) => {
          if (!date) {
            return <div key={idx} className="day-cell empty"></div>;
          }

          const dateStr = formatDateLocal(date);

          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedStr;
          const info = tasksByDate[dateStr];
          const taskCount = info?.count || 0;
          const hasTasks = taskCount > 0;
          const heatLevel = Math.min(4, Math.max(1, Math.ceil(taskCount / 3)));
          const statusCounts = info?.statusCount || {};
          const statusPriority = ['in-progress', 'todo', 'done'];
          const dominantStatus =
            statusPriority.find((s) => statusCounts[s] > 0) || 'todo';
          const tooltipTitles = info?.titles || [];
          const tooltip =
            tooltipTitles.length > 0
              ? `${dateStr}: ${tooltipTitles.join(' | ')}${
                  taskCount > tooltipTitles.length ? ' ...' : ''
                }`
              : `${dateStr}: sin tareas`;

          const classNames = [
            'day-cell',
            isToday ? 'today' : '',
            isSelected ? 'selected' : '',
            hasTasks ? 'has-tasks' : '',
            hasTasks ? `heat-${heatLevel}` : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={idx}
              type="button"
              className={classNames}
              onClick={() => onSelectDate(date)}
              onDoubleClick={() => onDoubleClickDay && onDoubleClickDay(date)}
              title={tooltip}
              aria-label={`${dateStr}: ${taskCount} tareas`}
            >
              <span className="day-number">{date.getDate()}</span>
              {hasTasks && <TaskDot count={taskCount} status={dominantStatus} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
