// index.js (backend)

import express from 'express';
import cors from 'cors';

import { PORT } from './utils/config.js';
import indexRoutes from './routes/indexRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { unknownEndpoint } from './middlewares/unknownEndpointMiddleware.js';
import { errorHandler } from './middlewares/errorHandlerMiddleware.js';

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', indexRoutes);       // /api/health
app.use('/api/auth', authRoutes);   // auth
app.use('/api/tasks', taskRoutes);  // CRUD tareas (protegidas)

// Middleware para rutas no encontradas
app.use(unknownEndpoint);

// Middleware de manejo de errores
app.use(errorHandler);

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
