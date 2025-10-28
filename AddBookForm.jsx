// src/components/AddBookForm.jsx
import React, { useState } from "react";
import { Box, Button, Card, CardContent, Grid, TextField, Typography } from "@mui/material";
import API from "../api";
import { toast } from "react-toastify";

const initial = {
  title: "",
  author: "",
  genre: "",
  price: "",
  stock: "",
  publishedYear: ""
};

export default function AddBookForm({ onAdded }) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.title.trim() || !form.author.trim() || !form.genre.trim()) {
      toast.error("Title, Author and Genre are required");
      return false;
    }
    if (form.price === "" || isNaN(Number(form.price)) || Number(form.price) < 0) {
      toast.error("Price must be a non-negative number");
      return false;
    }
    if (form.stock !== "" && (isNaN(Number(form.stock)) || Number(form.stock) < 0)) {
      toast.error("Stock must be a non-negative number");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        author: form.author,
        genre: form.genre,
        price: Number(form.price),
        stock: form.stock === "" ? 0 : Number(form.stock),
        publishedYear: form.publishedYear ? Number(form.publishedYear) : undefined
      };
      await API.post("/books", payload);
      toast.success("Book added");
      setForm(initial);
      onAdded?.();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 900, margin: "16px auto" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom> Add New Book </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><TextField name="title" label="Title" value={form.title} onChange={handleChange} fullWidth required /></Grid>
            <Grid item xs={12} sm={6}><TextField name="author" label="Author" value={form.author} onChange={handleChange} fullWidth required /></Grid>
            <Grid item xs={12} sm={4}><TextField name="genre" label="Genre" value={form.genre} onChange={handleChange} fullWidth required /></Grid>
            <Grid item xs={12} sm={4}><TextField name="price" label="Price" value={form.price} onChange={handleChange} fullWidth required type="number" /></Grid>
            <Grid item xs={12} sm={4}><TextField name="stock" label="Stock" value={form.stock} onChange={handleChange} fullWidth type="number" /></Grid>
            <Grid item xs={12} sm={4}><TextField name="publishedYear" label="Published Year" value={form.publishedYear} onChange={handleChange} fullWidth type="number" /></Grid>
            <Grid item xs={12} sx={{ display: "flex", gap: 2 }}>
              <Button variant="contained" color="primary" type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Book"}
              </Button>
              <Button variant="outlined" color="inherit" onClick={() => setForm(initial)}>Reset</Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}
