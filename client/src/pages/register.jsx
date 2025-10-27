import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthCard, AuthInput, AuthSelect, AuthButton, AuthError, AuthLink } from "../components/AuthComponents";
import PageTransition from "../components/PageTransition";

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    role: "student" 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      // Successful registration - redirect to login
      navigate("/login", { 
        state: { message: res.data.message || "Registration successful! Please log in." }
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: "student", label: "Student" },
    { value: "parent", label: "Parent" },
    { value: "tutor", label: "Tutor" }
  ];

  return (
    <PageTransition>
      <AuthCard 
        title="Create your account" 
        subtitle="Join Luma and start your learning journey"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthError message={error} />
          
          <AuthInput
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Enter your full name"
            required
          />

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
            placeholder="Choose a strong password"
            required
          />

          <AuthSelect
            label="I am a"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            options={roleOptions}
          />

          <AuthButton isLoading={isLoading} loadingText="Creating account...">
            Create Account
          </AuthButton>

          <div className="text-center">
            <AuthLink to="/login">
              Already have an account? Log in
            </AuthLink>
          </div>
        </form>
      </AuthCard>
    </PageTransition>
  );
}
