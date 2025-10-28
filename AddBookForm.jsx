import { useState } from "react";
import { addBook } from "../api"; // ✅ use named import

function AddBookForm({ onAdd }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    price: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await addBook(form); // ✅ call addBook directly
      if (onAdd) onAdd(res.data);
      setForm({ title: "", author: "", genre: "", price: "" });
    } catch (err) {
      alert("Error adding book");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded mb-3">
      <div className="row g-2">
        <div className="col">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="form-control"
            required
          />
        </div>
        <div className="col">
          <input
            name="author"
            value={form.author}
            onChange={handleChange}
            placeholder="Author"
            className="form-control"
            required
          />
        </div>
        <div className="col">
          <input
            name="genre"
            value={form.genre}
            onChange={handleChange}
            placeholder="Genre"
            className="form-control"
            required
          />
        </div>
        <div className="col">
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="form-control"
            type="number"
            required
          />
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </div>
      </div>
    </form>
  );
}

export default AddBookForm;
