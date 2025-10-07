// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // redirect to login if not authenticated
    alert("Please log in first to access this page."); // show alert
    return <Navigate to="/login" replace />;
  }

  return children;
}
