// src/components/BookList.jsx
import React, { useEffect, useState } from "react";
import { Paper, Table, TableHead, TableRow, TableBody, TableCell, IconButton, Toolbar, Typography, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import API from "../api";
import EditBookModal from "./EditBookModal";
import DeleteConfirm from "./DeleteConfirm";
import { toast } from "react-toastify";

export default function BookList({ refreshSignal }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [delTarget, setDelTarget] = useState(null);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await API.get("/books");
      setBooks(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, [refreshSignal]);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/books/${id}`);
      toast.success("Book deleted");
      fetchBooks();
      setDelTarget(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  return (
    <Paper sx={{ margin: "16px auto", maxWidth: 1100, p: 2 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Books</Typography>
        <Box>
          <Typography variant="caption">{loading ? "Loading..." : `${books.length} books`}</Typography>
        </Box>
      </Toolbar>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell><TableCell>Author</TableCell><TableCell>Genre</TableCell>
            <TableCell>Price</TableCell><TableCell>Stock</TableCell><TableCell>Published</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {books.map((b) => (
            <TableRow key={b._id}>
              <TableCell>{b.title}</TableCell>
              <TableCell>{b.author}</TableCell>
              <TableCell>{b.genre}</TableCell>
              <TableCell>{b.price}</TableCell>
              <TableCell>{b.stock}</TableCell>
              <TableCell>{b.publishedYear}</TableCell>
              <TableCell>
                <IconButton onClick={() => setEditBook(b)} size="small"><EditIcon /></IconButton>
                <IconButton color="error" onClick={() => setDelTarget(b)} size="small"><DeleteIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EditBookModal open={!!editBook} book={editBook} onClose={() => setEditBook(null)} onUpdated={fetchBooks} />
      <DeleteConfirm open={!!delTarget} name={delTarget?.title} onClose={() => setDelTarget(null)} onConfirm={() => handleDelete(delTarget._id)} />
    </Paper>
  );
}
