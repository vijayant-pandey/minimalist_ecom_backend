import { useState, useEffect, useContext } from "react";
import API from "../utils/api";
import { AuthContext } from "../components/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", price: "", category: "", image: "" });

  useEffect(() => {
    if (user?.role === "admin") fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data.products);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async () => {
    await API.post("/products", form);
    setForm({ title: "", description: "", price: "", category: "", image: "" });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await API.delete(`/products/${id}`);
    fetchProducts();
  };

  if (user?.role !== "admin") return <p>Access denied</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Admin Dashboard</h1>
      <h3>Create Product</h3>
      <input placeholder="Title" name="title" value={form.title} onChange={handleChange} />
      <input placeholder="Description" name="description" value={form.description} onChange={handleChange} />
      <input placeholder="Price" name="price" value={form.price} onChange={handleChange} />
      <input placeholder="Category" name="category" value={form.category} onChange={handleChange} />
      <input placeholder="Image URL" name="image" value={form.image} onChange={handleChange} />
      <button onClick={handleCreate}>Create</button>

      <h3>All Products</h3>
      {products.map((p) => (
        <div key={p._id} style={{ border: "1px solid #ddd", margin: "0.5rem", padding: "0.5rem" }}>
          <p>{p.title} - ₹{p.price}</p>
          <button onClick={() => handleDelete(p._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
