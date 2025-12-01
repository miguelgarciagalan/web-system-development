// routes/taskRoutes.js

import express from 'express';
import {
  handleGetAllTasks,
  handleGetTaskById,
  handleCreateTask,
  handleUpdateTask,
  handleDeleteTask,
} from '../controllers/taskController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Proteger todas las rutas de tasks
router.use(authMiddleware);

// /api/tasks
router.get('/', handleGetAllTasks);
router.get('/:id', handleGetTaskById);
router.post('/', handleCreateTask);
router.put('/:id', handleUpdateTask);
router.delete('/:id', handleDeleteTask);

export default router;
