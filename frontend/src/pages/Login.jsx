import { useState } from "react";
import api from "../utils/axiosConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthCard, AuthInput, AuthButton, AuthError, AuthLink } from "../components/AuthComponents";
import PageTransition from "../components/PageTransition";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState(() => {
    // Try to load saved email if it exists
    const savedEmail = localStorage.getItem('rememberedEmail');
    return { 
      email: savedEmail || "", 
      password: "" 
    };
  });
  const [error, setError] = useState("");
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      const { token, user } = res.data;

      // Normalize role to lowercase so client routing/guards match server values
      const normalizedRole = String(user.role || '').toLowerCase();
      const clientUser = { ...user, role: normalizedRole };

      // Handle "Remember Me"
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', form.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Save auth data (store normalized user role)
      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(clientUser));
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(clientUser));
      }

      // Role-based navigation with clear paths (keys are lowercase)
      const dashboardPaths = {
        student: "/student-dashboard",
        parent: "/parent-dashboard",
        tutor: "/tutor-dashboard"
      };

      const path = dashboardPaths[normalizedRole] || "/unauthorized";
      navigate(path, { replace: true });

    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <AuthCard 
        title="Welcome back" 
        subtitle="Log in to access your dashboard"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {successMessage && (
            <div className="rounded-md bg-green-50 p-4 mb-4">
              <div className="text-sm font-medium text-green-800">
                {successMessage}
              </div>
            </div>
          )}
          
          <AuthError message={error} />

          <AuthInput
            type="email"
            label="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Enter your email"
            required
          />

          <AuthInput
            type="password"
            label="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Enter your password"
            required
          />

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
              Remember me
            </label>
          </div>

          <AuthButton isLoading={isLoading} loadingText="Logging in...">
            Log In
          </AuthButton>

          <div className="text-center">
            <AuthLink to="/register">
              Don't have an account? Create one
            </AuthLink>
          </div>
        </form>
      </AuthCard>
    </PageTransition>
  );
}
