// COUNTER NOT UPDATING ON REMOVING ANY ITEM
// import { useState, useEffect } from "react";
// import API from "../utils/api";
// import { useNavigate } from "react-router-dom";

// export default function Cart() {
//   const [cart, setCart] = useState({ products: [] });
//   const navigate = useNavigate();

//   const fetchCart = async () => {
//     const res = await API.get("/cart");
//     setCart(res.data);
//   };

//   useEffect(() => { fetchCart(); }, []);

//   const handleUpdate = async (productId, quantity) => {
//     await API.put("/cart", { productId, quantity });
//     fetchCart();
//   };

//   const handleRemove = async (productId) => {
//     await API.delete("/cart", { data: { productId } });
//     fetchCart();
//   };

//   const handleCheckout = () => navigate("/checkout");

//   // Calculate total cart value
//   const totalValue = cart.products.reduce(
//     (sum, item) => sum + item.quantity * item.productId.price,
//     0
//   );

//   return (
//     <div style={{ padding: "1rem" }}>
//       <h1>Your Cart</h1>
//       {cart.products.length === 0 ? (
//         <p>Cart is empty</p>
//       ) : (
//         <>
//           {cart.products.map((item) => (
//             <div
//               key={item.productId._id}
//               style={{ border: "1px solid #ddd", margin: "0.5rem", padding: "0.5rem" }}
//             >
//               <p>
//                 {item.productId.title} - ₹{item.productId.price} each
//               </p>
//               <p>
//                 Quantity:{" "}
//                 <input
//                   type="number"
//                   value={item.quantity}
//                   min="1"
//                   onChange={(e) =>
//                     handleUpdate(item.productId._id, parseInt(e.target.value))
//                   }
//                   style={{ width: "50px", marginLeft: "0.5rem" }}
//                 />
//               </p>
//               <p>Subtotal: ₹{item.quantity * item.productId.price}</p>
//               <button onClick={() => handleRemove(item.productId._id)}>Remove</button>
//             </div>
//           ))}

//           <h3>Total: ₹{totalValue}</h3>
//           <button onClick={handleCheckout}>Checkout</button>
//         </>
//       )}
//     </div>
//   );
// }

// Final WOrking - Perfectly
import { useState, useEffect } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState({ products: [] });
  const navigate = useNavigate();

  const fetchCart = async () => {
    const res = await API.get("/cart");
    setCart(res.data);
  };

  useEffect(() => { fetchCart(); }, []);

  const handleUpdate = async (productId, quantity) => {
    await API.put("/cart", { productId, quantity });
    fetchCart();
    // dispatch event for navbar counter update
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleRemove = async (productId) => {
    await API.delete("/cart", { data: { productId } });
    fetchCart();
    // dispatch event for navbar counter update
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleCheckout = () => navigate("/checkout");

  const totalValue = cart.products.reduce(
    (sum, item) => sum + item.quantity * item.productId.price,
    0
  );

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Your Cart</h1>
      {cart.products.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {cart.products.map((item) => (
            <div
              key={item.productId._id}
              style={{ border: "1px solid #ddd", margin: "0.5rem", padding: "0.5rem" }}
            >
              <p>
                {item.productId.title} - ₹{item.productId.price} each
              </p>
              <p>
                Quantity:{" "}
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) =>
                    handleUpdate(item.productId._id, parseInt(e.target.value))
                  }
                  style={{ width: "50px", marginLeft: "0.5rem" }}
                />
              </p>
              <p>Subtotal: ₹{item.quantity * item.productId.price}</p>
              <button onClick={() => handleRemove(item.productId._id)}>Remove</button>
            </div>
          ))}

          <h3>Total: ₹{totalValue}</h3>
          <button onClick={handleCheckout}>Checkout</button>
        </>
      )}
    </div>
  );
}
