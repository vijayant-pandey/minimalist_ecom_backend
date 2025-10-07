// export default function ProductCard({ product }) {
//   return (
//     <div style={{ border: "1px solid #ddd", padding: "1rem", margin: "0.5rem", width: "200px" }}>
//       <img src={product.image || "https://via.placeholder.com/150"} alt={product.title} width="100%" />
//       <h3>{product.title}</h3>
//       <p>₹{product.price}</p>
//       <p>{product.category}</p>
//       <button>Add to Cart</button>
//     </div>
//   );
// }



import API from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleAddToCart = async () => {
  try {
    // call backend API to add this product to cart
    await API.post("/cart", { productId: product._id, quantity: 1 });
    alert("Added to cart!");

    //   optional: go to cart page
    //   navigate("/"); 

    // trigger a cart update event
    window.dispatchEvent(new Event("cartUpdated")); // updates Navbar counter
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Failed to add to cart. Make sure you are logged in.");
  }
};

  return (
    <div style={{ border: "1px solid #ddd", margin: "0.5rem", padding: "0.5rem", width: "220px" }}>
      <img src={product.image} alt={product.title} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <p>₹{product.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}
