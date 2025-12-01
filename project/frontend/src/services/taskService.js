// src/services/taskService.js
import api from './api.js';

// Obtener TODAS las tareas
export const fetchTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

// Crear una nueva tarea
export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

// Actualizar una tarea
export const updateTask = async (id, updates) => {
  const response = await api.put(`/tasks/${id}`, updates);
  return response.data;
};

// Borrar una tarea
export const deleteTask = async (id) => {
  await api.delete(`/tasks/${id}`);
};

