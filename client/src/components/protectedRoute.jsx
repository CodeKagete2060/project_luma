import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roles }) {
  // Check both storage types for auth data
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}");

  // No auth data found
  if (!token) {
    return <Navigate to="/login" state={{ message: "Please log in to access this page" }} />;
  }

  // Check role-based access
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
