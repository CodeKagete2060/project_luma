import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import ProtectedRoute from "./components/protectedRoute";
import ErrorPage from "./components/ErrorPage";

import StudentDashboard from "./pages/StudentDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import TutorDashboard from "./pages/TutorDashboard";

export default function App() {
  // Quick debug log to confirm React render in browser console
  if (typeof window !== 'undefined') console.log('App component rendering')
  return (
    <Routes>
  {/* Redirect root to login */}
  <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute roles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent-dashboard"
        element={
          <ProtectedRoute roles={["parent"]}>
            <ParentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tutor-dashboard"
        element={
          <ProtectedRoute roles={["tutor"]}>
            <TutorDashboard />
          </ProtectedRoute>
        }
      />

      <Route 
        path="/unauthorized" 
        element={
          <ErrorPage
            code="403"
            title="Access Denied"
            message="Sorry, you don't have permission to access this page."
            actionText="Back to Login"
            actionPath="/login"
          />
        } 
      />

      {/* Catch-all route */}
      <Route 
        path="*" 
        element={<ErrorPage />} 
      />
    </Routes>
  );
}
