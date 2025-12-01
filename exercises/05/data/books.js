// data/books.js

let books = [
  { id: "1", title: "The Hobbit", author: "J.R.R. Tolkien" },
  { id: "2", title: "Dune", author: "Frank Herbert" }
];

function generateId() {
  const maxId = books.length > 0
    ? Math.max(...books.map(b => Number(b.id)))
    : 0;
  return String(maxId + 1);
}

export function getAllBooks() {
  return books;
}

export function findBookById(id) {
  return books.find(b => b.id === id);
}

export function addBook(book) {
  const newBook = {
    id: generateId(),
    title: book.title,
    author: book.author
  };
  books = books.concat(newBook);
  return newBook;
}

export function removeBook(id) {
  books = books.filter(b => b.id !== id);
}
