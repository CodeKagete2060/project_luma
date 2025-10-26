import axios from "axios";
import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      alert(res.data.message);
      // Clear form after success
      setForm({ name: "", email: "", password: "", role: "student" });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{color: 'red'}}>{error}</p>}
      
      <input 
        placeholder="Name" 
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} 
      />
      
      <input 
        placeholder="Email" 
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} 
      />
      
      <input 
        placeholder="Password" 
        type="password" 
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })} 
      />
      
      <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="student">Student</option>
        <option value="parent">Parent</option>
        <option value="tutor">Tutor</option>
      </select>
      
      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}