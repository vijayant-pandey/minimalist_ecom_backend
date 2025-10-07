// frontend/src/pages/AdminOrders.jsx
import { useEffect, useState } from "react";
import API from "../utils/api";

const ALLOWED = ["pending", "paid", "shipped", "delivered"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleChangeStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      // refresh list
      fetchOrders();
      alert("Order status updated");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Admin — All Orders</h1>
      {loading ? <p>Loading...</p> : null}
      {orders.map((order) => (
        <div key={order._id} style={{ border: "1px solid #ddd", padding: "0.5rem", marginBottom: "1rem" }}>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>User:</strong> {order.userId?.name || "—"} ({order.userId?.email || "—"})</p>
          <p><strong>Placed:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}</p>
          <p><strong>Status:</strong>
            <select
              value={order.status}
              onChange={(e) => handleChangeStatus(order._id, e.target.value)}
              style={{ marginLeft: "0.5rem" }}
            >
              {ALLOWED.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </p>

          <div style={{ marginLeft: "1rem" }}>
            {order.products.map((item) => {
              const prod = item.productId || {};
              return (
                <div key={prod._id || Math.random()} style={{ marginBottom: "0.25rem" }}>
                  <small>{prod.title || "Product missing"} — ₹{prod.price}/item × {item.quantity} = ₹{(prod.price || 0) * (item.quantity || 0)}</small>
                </div>
              );
            })}
          </div>

          <p><strong>Total:</strong> ₹{order.totalAmount}</p>
        </div>
      ))}
    </div>
  );
}
