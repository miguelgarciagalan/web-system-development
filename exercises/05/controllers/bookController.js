// controllers/bookController.js
import {
  getAllBooks,
  findBookById,
  addBook,
  removeBook
} from '../data/books.js';

// GET /books
export function getBooks(req, res) {
  const books = getAllBooks();
  res.json(books);
}

// GET /books/:id
export function getBookById(req, res) {
  const id = req.params.id;
  const book = findBookById(id);

  if (!book) {
    return res.status(404).json({ error: 'book not found' });
  }

  res.json(book);
}

// POST /books
export function createBook(req, res) {
  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({
      error: 'title and author are required'
    });
  }

  const newBook = addBook({ title, author });
  res.status(201).json(newBook);
}

// DELETE /books/:id
export function deleteBook(req, res) {
  const id = req.params.id;
  removeBook(id);
  res.status(204).end();
}
