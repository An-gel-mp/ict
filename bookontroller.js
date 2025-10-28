import Book from "../models/Book.js";

// Get all books
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new book
export const addBook = async (req, res) => {
  try {
    const { title, author, genre, price, stock, publishedYear } = req.body;
    if (!title || !author || !genre || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const newBook = new Book({ title, author, genre, price, stock, publishedYear });
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a book
export const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a book
export const deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
