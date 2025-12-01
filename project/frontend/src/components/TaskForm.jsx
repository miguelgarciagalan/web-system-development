// src/components/TaskForm.jsx
import { useState } from 'react';

const formatDateLocalInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const TaskForm = ({ date, onCreate, onAfterSubmit = () => {} }) => {
  const [title, setTitle] = useState('');
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [description, setDescription] = useState('');
  const [important, setImportant] = useState(false);
  const [status, setStatus] = useState('todo');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('El titulo es obligatorio');
      return;
    }

    const start = timeStart || '';
    const end = timeEnd || '';
    if (start && end && end < start) {
      setError('La hora fin no puede ser anterior a la de inicio');
      return;
    }

    const autoEnd =
      !end && start
        ? (() => {
            const [h, m] = start.split(':').map(Number);
            const endDate = new Date();
            endDate.setHours(h);
            endDate.setMinutes(m + 30);
            const hh = String(endDate.getHours()).padStart(2, '0');
            const mm = String(endDate.getMinutes()).padStart(2, '0');
            return `${hh}:${mm}`;
          })()
        : end || null;

    try {
      setSubmitting(true);

      await onCreate({
        title: title.trim(),
        description: description.trim(),
        date: formatDateLocalInput(date), // YYYY-MM-DD
        startTime: start || null,
        endTime: autoEnd,
        status,
        important,
      });

      // Limpiar formulario
      setTitle('');
      setTimeStart('');
      setTimeEnd('');
      setDescription('');
      setImportant(false);
      setStatus('todo');
      onAfterSubmit();
    } catch (err) {
      console.error(err);
      setError('Error creando la tarea');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h3>Nueva tarea</h3>

      <label className="form-label">
        Titulo *
        <input
          className="form-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej. Estudiar modulo 4"
        />
      </label>

      <div className="form-row">
        <label className="form-label">
          Inicio
          <input
            className="form-input"
            type="time"
            value={timeStart}
            onChange={(e) => setTimeStart(e.target.value)}
            placeholder="hh:mm"
            step="300"
          />
        </label>

        <label className="form-label">
          Fin
          <input
            className="form-input"
            type="time"
            value={timeEnd}
            onChange={(e) => setTimeEnd(e.target.value)}
            placeholder="hh:mm"
            step="300"
          />
        </label>
      </div>

      <label className="form-label">
        Descripcion
        <textarea
          className="form-textarea"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalles opcionales"
        />
      </label>

      <div className="form-row">
        <label className="form-label">
          Estado
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="todo">TODO</option>
            <option value="in-progress">IN PROGRESS</option>
            <option value="done">DONE</option>
          </select>
        </label>

        <label className="form-checkbox">
          <input
            type="checkbox"
            checked={important}
            onChange={(e) => setImportant(e.target.checked)}
          />
          Importante
        </label>
      </div>

      {error && <p className="error-text">{error}</p>}

      <button className="form-submit" type="submit" disabled={submitting}>
        {submitting ? 'Creando...' : 'Crear tarea'}
      </button>
    </form>
  );
};

export default TaskForm;
