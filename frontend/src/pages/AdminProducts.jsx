import { useState, useEffect } from "react";
import API from "../utils/api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", price: "", image: "", category: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data.products);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/products/${editingId}`, form);
        setEditingId(null);
      } else {
        await API.post("/products", form);
      }
      setForm({ title: "", description: "", price: "", image: "", category: "" });
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const handleEdit = product => {
    setEditingId(product._id);
    setForm({ title: product.title, description: product.description, price: product.price, image: product.image, category: product.category });
  };

  const handleDelete = async id => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await API.delete(`/products/${id}`);
      fetchProducts();
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Admin Products</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <button type="submit">{editingId ? "Update" : "Add"} Product</button>
      </form>

      <ul>
        {products.map(p => (
          <li key={p._id}>
            {p.title} - ₹{p.price}
            <button onClick={() => handleEdit(p)}>Edit</button>
            <button onClick={() => handleDelete(p._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
