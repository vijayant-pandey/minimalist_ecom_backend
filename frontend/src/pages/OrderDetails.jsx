// frontend/src/pages/OrderDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line
  }, [id]);

  if (loading) return <div style={{ padding: "1rem" }}>Loading order...</div>;
  if (error) return <div style={{ padding: "1rem", color: "red" }}>{error}</div>;
  if (!order) return <div style={{ padding: "1rem" }}>Order not found.</div>;

  const createdAt = order.createdAt ? new Date(order.createdAt).toLocaleString() : "";

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Order Details</h1>
      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Placed:</strong> {createdAt}</p>

      <h3>Items</h3>
      <div>
        {order.products.map((item) => {
          const prod = item.productId || {};
          const qty = item.quantity || 0;
          const price = prod.price || 0;
          const subtotal = qty * price;
          return (
            <div key={prod._id || Math.random()} style={{ border: "1px solid #eee", padding: "0.5rem", marginBottom: "0.5rem" }}>
              <p style={{ margin: 0 }}>
                <strong>{prod.title || "Product name missing"}</strong> - ₹{price}/item
              </p>
              <p style={{ margin: 0 }}>Quantity: {qty}</p>
              <p style={{ margin: 0 }}>Subtotal: ₹{subtotal}</p>
            </div>
          );
        })}
      </div>

      <h3>Total: ₹{order.totalAmount}</h3>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => navigate(-1)} style={{ marginRight: "0.5rem" }}>Back</button>
        <Link to="/orders">Back to Orders</Link>
      </div>
    </div>
  );
}
