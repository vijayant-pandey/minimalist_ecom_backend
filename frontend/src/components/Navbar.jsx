// // import { Link , useNavigate} from "react-router-dom";
// // import { useContext } from "react";
// // import { AuthContext } from "./AuthContext";
// // import { useEffect, useState } from "react";
// // import API from "../utils/api";

// // // export default function Navbar() {
// // //   const { user, logout } = useContext(AuthContext);
// // export default function Navbar() {
// //   const navigate = useNavigate();
// //   const token = localStorage.getItem("token");
// //   const [cartCount, setCartCount] = useState(0);

// //   const fetchCartCount = async () => {
// //   const token = localStorage.getItem("token"); // always read latest token
// //   if (!token) return;
// //   try {
// //     const res = await API.get("/cart");
// //     const totalQty = res.data.products.reduce((sum, p) => sum + p.quantity, 0);
// //     setCartCount(totalQty);
// //   } catch (err) {
// //     console.error(err);
// //   }
// // };

// //   useEffect(() => {
// //   fetchCartCount(); // initial fetch
// //   window.addEventListener("cartUpdated", fetchCartCount);

// //   return () => window.removeEventListener("cartUpdated", fetchCartCount);
// // }, []);

// //   const handleLogout = () => {
// //     localStorage.removeItem("token");
// //     navigate("/login");
// //   };


// //   return (
// //     <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
// //       <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
// //       <Link to="/cart" style={{ marginRight: "1rem" }}>Cart  {cartCount > 0 && `(${cartCount})`}  </Link>

// //       {token && (
// //       <Link to="/orders" style={{ marginRight: "1rem" }}>Orders</Link>
// //       )}

// //       {!token ? (
// //         <>
// //           <Link to="/login" style={{ marginRight: "1rem" }}>Login</Link>
// //           <Link to="/register" style={{ marginRight: "1rem" }}>Register</Link>
// //         </>
// //       ) : (
// //         <button onClick={handleLogout}>Logout</button>
// //       )}
// //     </nav>
// //   );
// // }



// import { Link, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import API from "../utils/api";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const [cartCount, setCartCount] = useState(0);
//   const [user, setUser] = useState(null);


//   // 🔹 Fetch user details (to know if admin or user)
//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!token) return;
//       try {
//         const res = await API.get("/auth/me");
//         setUser(res.data);
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//       }
//     };
//     fetchProfile();
//   }, [token]);

//   // 🔹 Fetch cart count
//   const fetchCartCount = async () => {
//     const token = localStorage.getItem("token"); // always read latest token
//     if (!token) return;
//     try {
//       const res = await API.get("/cart");
//       const totalQty = res.data.products.reduce((sum, p) => sum + p.quantity, 0);
//       setCartCount(totalQty);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchCartCount();
//     window.addEventListener("cartUpdated", fetchCartCount);
//     return () => window.removeEventListener("cartUpdated", fetchCartCount);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//     navigate("/login");
//   };

//   return (
//     <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
//       <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
//       {/* <Link to="/products" style={{ marginRight: "1rem" }}>Products</Link> */}
//       <Link to="/cart" style={{ marginRight: "1rem" }}>
//         Cart {cartCount > 0 && `(${cartCount})`}
//       </Link>

//       {/* Role-based links */}
//       {user?.role === "admin" ? (
//         <>
//           <Link to="/admin/orders" style={{ marginRight: "1rem" }}>Admin Orders</Link>
//           <Link to="/admin/users" style={{ marginRight: "1rem" }}>Users</Link>
//         </>
//       ) : token ? (
//         <Link to="/orders" style={{ marginRight: "1rem" }}>My Orders</Link>
//       ) : null}

//       {/* Auth links */}
//       {!token ? (
//         <>
//           <Link to="/login" style={{ marginRight: "1rem" }}>Login</Link>
//           <Link to="/register" style={{ marginRight: "1rem" }}>Register</Link>
//         </>
//       ) : (
//         <button onClick={handleLogout}>Logout</button>
//       )}
//     </nav>
//   );
// }



import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../utils/api";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  // 🔹 Fetch user details to check role
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchProfile();
  }, [token]);

  // 🔹 Fetch cart count (only if logged in)
  const fetchCartCount = async () => {
    if (!token) return;
    try {
      const res = await API.get("/cart");
      const totalQty = res.data.products.reduce((sum, p) => sum + p.quantity, 0);
      setCartCount(totalQty);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCartCount();
    window.addEventListener("cartUpdated", fetchCartCount);
    return () => window.removeEventListener("cartUpdated", fetchCartCount);
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setCartCount(0);
    navigate("/login");
  };

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
      
      {token && (
        <Link to="/cart" style={{ marginRight: "1rem" }}>
          Cart {cartCount > 0 && `(${cartCount})`}
        </Link>
      )}

      {/* Role-based links */}
      {user?.role === "admin" ? (
        <>
          <Link to="/admin/orders" style={{ marginRight: "1rem" }}>Admin Orders</Link>
          <Link to="/admin/users" style={{ marginRight: "1rem" }}>Users</Link>
          <Link to="/admin/products" style={{ marginRight: "1rem" }}>Products</Link>
        </>
      ) : user ? (
        <Link to="/orders" style={{ marginRight: "1rem" }}>My Orders</Link>
      ) : null}

      {/* Auth links */}
      {!token ? (
        <>
          <Link to="/login" style={{ marginRight: "1rem" }}>Login</Link>
          <Link to="/register" style={{ marginRight: "1rem" }}>Register</Link>
        </>
      ) : (
        <button onClick={handleLogout}>Logout</button>
      )}
    </nav>
  );
}
