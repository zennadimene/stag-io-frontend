// pages/AdminAccess.js
import { useState } from "react";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function AdminAccess() {
  const [form, setForm] = useState({ 
    email: "", 
    password: "" 
  });
  const [redirect, setRedirect] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // إرسال بدون role - Backend سيتعرف على Admin تلقائياً
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email,
        password: form.password
      });

      // تحقق أن المستخدم هو Admin
      if (res.data.role !== "admin") {
        throw new Error("Access denied. Admin only.");
      }

      // حفظ البيانات
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userEmail", res.data.email);
      localStorage.setItem("userName", res.data.name || res.data.email);

      setRedirect("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid credentials");
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (redirect) return <Navigate to={redirect} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800/50 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700/50"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-900/50 to-red-700/50 flex items-center justify-center border border-red-800/50">
            <span className="text-4xl">🔒</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Administrative Access</h1>
          <p className="text-gray-400">
            Restricted to authorized administrators only
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Admin Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="admin@stag.io"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-900/50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter admin password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-900/50"
            />
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-700 to-red-800 text-white py-4 rounded-xl font-bold text-lg hover:from-red-800 hover:to-red-900 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Login as Admin"}
          </button>
        </form>

        <div className="text-center mt-8">
          <Link 
            to="/login" 
            className="text-gray-500 hover:text-gray-300 text-sm transition"
          >
            ← Return to regular login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}