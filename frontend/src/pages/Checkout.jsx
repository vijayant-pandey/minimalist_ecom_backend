// import { useState, useEffect } from "react";
// import API from "../utils/api";
// import { useNavigate } from "react-router-dom";

// export default function Checkout() {
//   const [cart, setCart] = useState({ products: [] });
//   const [total, setTotal] = useState(0);
//   const navigate = useNavigate();

//   const fetchCart = async () => {
//     const res = await API.get("/cart");
//     setCart(res.data);
//     setTotal(res.data.products.reduce((acc, item) => acc + item.productId.price * item.quantity, 0));
//   };

//   useEffect(() => { fetchCart(); }, []);

//   const handlePlaceOrder = async () => {
//     await API.post("/orders");
//     alert("Order placed successfully!");
//     navigate("/success");
//   };

//   return (
//     <div style={{ padding: "1rem" }}>
//       <h1>Checkout</h1>
//       {cart.products.map((item) => (
//         <div key={item.productId._id} style={{ border: "1px solid #ddd", margin: "0.5rem", padding: "0.5rem" }}>
//           <p>{item.productId.title} - ₹{item.productId.price}/item </p>
//           <p>Quantity: {item.quantity}</p>
//         </div>
//       ))}
//       <h3>Total: ₹{total}</h3>
//       <button onClick={handlePlaceOrder}>Place Order</button>
//     </div>
//   );
// }



// src/pages/Checkout.jsx
import { useState, useEffect } from "react";
import API from "../utils/api";

export default function Checkout() {
  const [cart, setCart] = useState({ products: [] });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch cart items from backend
  const fetchCart = async () => {
    try {
      const res = await API.get("/cart"); // your backend endpoint for cart
      if (res.data && res.data.products) {
        setCart(res.data);
        setTotal(
          res.data.products.reduce(
            (acc, item) => acc + (item.productId?.price || 0) * item.quantity,
            0
          )
        );
      } else {
        setCart({ products: [] });
        setTotal(0);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCart({ products: [] });
      setTotal(0);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Handle Stripe Pay Now button
  const handlePayNow = async () => {
    if (cart.products.length === 0) {
      alert("Cart is empty");
      return;
    }

    setLoading(true);
    try {
      // Post request to backend to create checkout session
      const res = await API.post("/payments/create-checkout-session");

      if (res.data.url) {
        // Redirect to Stripe Hosted Checkout
        window.location.href = res.data.url;
      } else {
        alert("Failed to start payment");
        setLoading(false);
      }
    } catch (err) {
      console.error("Payment error:", err.response?.data || err);
      alert(
        err.response?.data?.message || "Failed to start payment. Try again."
      );
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Checkout</h1>

      {cart.products.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cart.products.map((item) => (
            <div
              key={item.productId?._id || Math.random()}
              style={{
                border: "1px solid #ddd",
                margin: "0.5rem 0",
                padding: "0.5rem",
              }}
            >
              <p>
                {item.productId?.title || "Unknown Product"} - ₹
                {item.productId?.price || 0}/item
              </p>
              <p>Quantity: {item.quantity}</p>
              <p>
                Subtotal: ₹
                {(item.productId?.price || 0) * item.quantity}
              </p>
            </div>
          ))}

          <h3>Total: ₹{total}</h3>

          <button
            onClick={handlePayNow}
            disabled={loading}
            style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}
          >
            {loading ? "Redirecting to Payment..." : "Pay Now"}
          </button>
        </>
      )}
    </div>
  );
}
