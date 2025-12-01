// index.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import bookRouter from './routes/bookRoutes.js';
import { requestLogger } from './middlewares/requestLoggerMiddleware.js';
import { unknownEndpoint } from './middlewares/unknownEndpointMiddleware.js';

const app = express();

// Necesario para __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares de aplicación
app.use(express.json());         // json-parser del módulo
app.use(requestLogger);          // middleware propio de log

// Servir HTML estático en "/"
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath)); // / -> public/index.html

// Rutas de la API de libros
app.use('/books', bookRouter);

// Middleware para endpoints desconocidos (404)
app.use(unknownEndpoint);

// Arrancar servidor en PORT o 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
