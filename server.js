import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));


let books = [
  { id: 1, title: 'Harry Potter', author: 'J.K. Rowling', price: 499 },
  { id: 2, title: 'Romeo and Juliet', author: 'William Shakespeare', price: 299 }
];


app.get('/books', (req, res) => {
  res.status(200).json(books);
});


app.get('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  res.status(200).json(book);
});


app.post('/books', (req, res) => {
  const { title, author, price } = req.body;

  if (!title || !author || price === undefined || price === '') {
    return res.status(400).json({ message: 'Title, author, and price are required' });
  }

  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice) || parsedPrice < 0) {
    return res.status(400).json({ message: 'Price must be a valid positive number' });
  }

  const newBook = {
    id: books.length > 0 ? books[books.length - 1].id + 1 : 1,
    title: title.trim(),
    author: author.trim(),
    price: parsedPrice
  };

  books.push(newBook);
  res.status(201).json({ message: 'Book added successfully', book: newBook });
});


app.put('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const { title, author, price } = req.body;

  if (title !== undefined && title.trim() !== '') book.title = title.trim();
  if (author !== undefined && author.trim() !== '') book.author = author.trim();
  if (price !== undefined && price !== '') {
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ message: 'Price must be a valid positive number' });
    }
    book.price = parsedPrice;
  }

  res.status(200).json({ message: 'Book updated successfully', book });
});

app.delete('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex(b => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const deletedBook = books.splice(bookIndex, 1);
  res.status(200).json({ message: 'Book deleted successfully', book: deletedBook[0] });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
