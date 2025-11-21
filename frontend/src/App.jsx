import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/register";
import Landing from "./pages/Landing";
import ProtectedRoute from "./components/protectedRoute";
import ErrorPage from "./components/ErrorPage";

import StudentDashboard from "./pages/StudentDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import TutorDashboard from "./pages/TutorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
// Learning pages
import AssignmentAssistant from "./components/AssignmentAssistant";
import ResourcesHub from "./pages/learning/ResourcesHub";
import StartSession from "./pages/learning/StartSession";
import JoinSession from "./pages/learning/JoinSession";
import RecordedSessions from "./pages/learning/RecordedSessions";
import LiveSessionPage from "./pages/LiveSessionPage";
// Discussion pages
import Discussions from "./pages/Discussions";
import DiscussionDetail from "./pages/DiscussionDetail";
import NewDiscussion from "./pages/NewDiscussion";
import SmartSearch from "./pages/SmartSearch";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
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
        path="/admin-dashboard"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Discussion Board */}
      <Route path="/discussions" element={<ProtectedRoute roles={["student","tutor","parent","admin"]}><Discussions /></ProtectedRoute>} />
      <Route path="/discussions/new" element={<ProtectedRoute roles={["student","tutor","parent","admin"]}><NewDiscussion /></ProtectedRoute>} />
      <Route path="/discussions/:id" element={<ProtectedRoute roles={["student","tutor","parent","admin"]}><DiscussionDetail /></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute roles={["student","tutor","parent","admin"]}><SmartSearch /></ProtectedRoute>} />

      {/* Learning module */}
      <Route path="/learning/assistant" element={<ProtectedRoute roles={["student","tutor","parent"]}><AssignmentAssistant /></ProtectedRoute>} />
      <Route path="/learning/resources" element={<ProtectedRoute roles={["student","tutor","parent"]}><ResourcesHub /></ProtectedRoute>} />
      <Route path="/learning/sessions/start" element={<ProtectedRoute roles={["tutor"]}><StartSession /></ProtectedRoute>} />
      <Route path="/learning/sessions/join/:id" element={<ProtectedRoute roles={["student","tutor","parent"]}><JoinSession /></ProtectedRoute>} />
      <Route path="/learning/sessions" element={<ProtectedRoute roles={["student","tutor","parent"]}><RecordedSessions /></ProtectedRoute>} />

      {/* Live Sessions */}
      <Route path="/live-session/:sessionId" element={<ProtectedRoute roles={["parent","student"]}><LiveSessionPage /></ProtectedRoute>} />

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
