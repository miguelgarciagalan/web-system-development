import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../db/tasksDb.js';

const allowedStatus = ['todo', 'in-progress', 'done'];
const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
const isTime = (value) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);

const validateTaskPayload = (payload, { partial = false } = {}) => {
  const errors = [];
  const { title, date, status, startTime, endTime } = payload;

  if (!partial || title !== undefined) {
    if (!title || !String(title).trim()) errors.push('El titulo es obligatorio');
  }
  if (!partial || date !== undefined) {
    if (!date || !isDate(date)) errors.push('La fecha debe ser YYYY-MM-DD');
  }
  if (!partial || status !== undefined) {
    if (status && !allowedStatus.includes(status)) {
      errors.push('Estado invalido');
    }
  }
  if (startTime && !isTime(startTime)) errors.push('Hora inicio invalida');
  if (endTime && !isTime(endTime)) errors.push('Hora fin invalida');
  return errors;
};

export const handleGetAllTasks = async (req, res, next) => {
  try {
    const tasks = await getAllTasks(req.user.id);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

export const handleGetTaskById = async (req, res, next) => {
  try {
    const task = await getTaskById(req.params.id, req.user.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const handleCreateTask = async (req, res, next) => {
  try {
    const taskData = req.body;
    const errors = validateTaskPayload(taskData);
    if (errors.length) return res.status(400).json({ error: errors.join('. ') });
    const created = await createTask(req.user.id, taskData);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

export const handleUpdateTask = async (req, res, next) => {
  try {
    const errors = validateTaskPayload(req.body, { partial: true });
    if (errors.length) return res.status(400).json({ error: errors.join('. ') });
    const updated = await updateTask(req.params.id, req.user.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Task not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const handleDeleteTask = async (req, res, next) => {
  try {
    const ok = await deleteTask(req.params.id, req.user.id);
    if (!ok) return res.status(404).json({ error: 'Task not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
