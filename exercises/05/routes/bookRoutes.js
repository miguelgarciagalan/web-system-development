import { Router } from 'express';
import {
  getBooks,
  getBookById,
  createBook,
  deleteBook
} from '../controllers/bookController.js';

const bookRouter = Router();

bookRouter.get('/', getBooks);       // GET /books
bookRouter.post('/', createBook);    // POST /books
bookRouter.get('/:id', getBookById); // GET /books/:id
bookRouter.delete('/:id', deleteBook); // DELETE /books/:id

export default bookRouter;
