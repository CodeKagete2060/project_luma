import api from "../utils/axiosConfig";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthCard, AuthInput, AuthSelect, AuthButton, AuthError, AuthLink } from "../components/AuthComponents";
import PageTransition from "../components/PageTransition";

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: searchParams.get('role') || "student",
    grade: ""
  });

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam) {
      setForm(prev => ({ ...prev, role: roleParam }));
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate grade for students
    if (form.role === "student" && !form.grade) {
      setError("Please select your grade.");
      return;
    }

    setIsLoading(true);

    const payload = { ...form };
    if (payload.role !== "student") {
      delete payload.grade;
    }

    try {
      const res = await api.post("/auth/register", payload);
      // Successful registration - redirect to login
      navigate("/login", {
        state: { message: res.data.msg || res.data.message || "Registration successful! Please log in." }
      });
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: "student", label: "Student" },
    { value: "parent", label: "Parent" },
    { value: "tutor", label: "Tutor" }
  ];

  const gradeOptions = [
    { value: "", label: "Select your grade" },
    { value: "1st", label: "1st Grade" },
    { value: "2nd", label: "2nd Grade" },
    { value: "3rd", label: "3rd Grade" },
    { value: "4th", label: "4th Grade" },
    { value: "5th", label: "5th Grade" },
    { value: "6th", label: "6th Grade" },
    { value: "7th", label: "7th Grade" },
    { value: "8th", label: "8th Grade" },
    { value: "9th", label: "9th Grade" },
    { value: "10th", label: "10th Grade" },
    { value: "11th", label: "11th Grade" },
    { value: "12th", label: "12th Grade" }
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

          {form.role === "student" && (
            <AuthSelect
              label="Grade"
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
              options={gradeOptions}
              required
            />
          )}

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
