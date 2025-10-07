// import { useState, useEffect } from "react";
// import API from "../utils/api";

// export default function Orders() {
//   const [orders, setOrders] = useState([]);

//   // Fetch user orders from backend
//   const fetchOrders = async () => {
//     try {
//       const res = await API.get("/orders"); // GET /orders for logged-in user
//       setOrders(res.data);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to fetch orders.");
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   return (
//     <div style={{ padding: "1rem" }}>
//       <h1>My Orders</h1>
//       {orders.length === 0 ? (
//         <p>No orders found.</p>
//       ) : (
//         orders.map((order) => (
//           <div
//             key={order._id}
//             style={{ border: "1px solid #ddd", padding: "0.5rem", marginBottom: "1rem" }}
//           >
//             <p><strong>Order ID:</strong> {order._id}</p>
//             <p><strong>Status:</strong> {order.status}</p>
//             <div>
//               {order.products.map((item) => (
//                 <div key={item.productId._id} style={{ marginLeft: "1rem" }}>
//                   <p>
//                     {item.productId.title} - ₹{item.productId.price}/item × {item.quantity} = ₹{item.quantity * item.productId.price}
//                   </p>
//                 </div>
//               ))}
//             </div>
//             <p><strong>Total:</strong> ₹{order.order.totalAmount}</p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }


// frontend/src/pages/Orders.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  if (loading) return <div style={{ padding: "1rem" }}>Loading orders...</div>;
  if (error) return <div style={{ padding: "1rem", color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} style={{ border: "1px solid #ddd", padding: "0.5rem", marginBottom: "1rem" }}>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Placed:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}</p>

            <div style={{ marginLeft: "1rem" }}>
              {order.products.map((item) => {
                const prod = item.productId || {};
                return (
                  <div key={prod._id || Math.random()} style={{ marginBottom: "0.25rem" }}>
                    <small>{prod.title || "Product name missing"} — ₹{prod.price}/item × {item.quantity} = ₹{(prod.price || 0) * (item.quantity || 0)}</small>
                  </div>
                );
              })}
            </div>

            <p><strong>Total:</strong> ₹{order.totalAmount}</p>
            <div>
              <Link to={`/orders/${order._id}`}>View Details</Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
