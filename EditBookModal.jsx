// src/components/EditBookModal.jsx
import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid } from "@mui/material";
import API from "../api";
import { toast } from "react-toastify";

export default function EditBookModal({ open, book, onClose, onUpdated }) {
  const [form, setForm] = useState(book || {});
  const [saving, setSaving] = useState(false);

  useEffect(()=> { setForm(book || {}); }, [book]);

  if (!book) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (form.title?.trim() === "" || form.author?.trim() === "" || form.genre?.trim() === "") {
      toast.error("Title, Author and Genre are required");
      return false;
    }
    if (form.price != null && (isNaN(Number(form.price)) || Number(form.price) < 0)) {
      toast.error("Price must be a non-negative number");
      return false;
    }
    if (form.stock != null && (isNaN(Number(form.stock)) || Number(form.stock) < 0)) {
      toast.error("Stock must be a non-negative number");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        author: form.author,
        genre: form.genre,
        price: Number(form.price),
        stock: Number(form.stock),
        publishedYear: form.publishedYear ? Number(form.publishedYear) : undefined
      };
      const res = await API.put(`/books/${book._id}`, payload);
      toast.success("Book updated");
      onUpdated?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update book");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Book</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.2 }}>
          <Grid item xs={12} sm={6}><TextField label="Title" name="title" value={form.title || ""} onChange={handleChange} fullWidth required /></Grid>
          <Grid item xs={12} sm={6}><TextField label="Author" name="author" value={form.author || ""} onChange={handleChange} fullWidth required /></Grid>
          <Grid item xs={12} sm={6}><TextField label="Genre" name="genre" value={form.genre || ""} onChange={handleChange} fullWidth required /></Grid>
          <Grid item xs={12} sm={6}><TextField label="Price" name="price" value={form.price ?? ""} onChange={handleChange} fullWidth type="number" /></Grid>
          <Grid item xs={12} sm={6}><TextField label="Stock" name="stock" value={form.stock ?? ""} onChange={handleChange} fullWidth type="number" /></Grid>
          <Grid item xs={12} sm={6}><TextField label="Published Year" name="publishedYear" value={form.publishedYear ?? ""} onChange={handleChange} fullWidth type="number" /></Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
      </DialogActions>
    </Dialog>
  );
}
