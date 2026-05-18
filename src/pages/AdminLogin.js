import { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [redirect, setRedirect] = useState(null);
  const [secretCode, setSecretCode] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  const handleSecretSubmit = (e) => {
    e.preventDefault();
    
    // Secret codes for admin access
    const validSecretCodes = [
      "ADMIN2024", 
      "STAGIO2024", 
      "INTERNMATCH", 
      "ADMIN123",
      "stagio",
      "admin",
      "ADMIN"
    ];

    const normalizedCode = secretCode.trim().toUpperCase();
    
    if (validSecretCodes.includes(normalizedCode) || validSecretCodes.includes(secretCode.toLowerCase())) {
      setShowForm(true);
      setError("");
      toast.success("Secret code verified!");
    } else {
      const errorMsg = "Invalid secret code. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
       setError(errorMsg);
      toast.error(errorMsg);  
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://stag-io-backend.onrender.com/api/auth/login", {
        ...form,
        role: "admin"
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("admin_email", form.email); // Store admin email for reference

      if (res.data.role === "admin") {
        setRedirect("/admin/dashboard");
      } else {
        const errorMsg = "Access denied. Admin privileges required.";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg = err.response?.data?.message || "Invalid email or password. Please check your credentials.";
      setError(errorMsg);
      toast.error(errorMsg);  
    } finally {
      setLoading(false);
    }
  };

  if (redirect) return <Navigate to={redirect} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700/50"
      >
        {!showForm ? (
          <>
            {/* Secret Access Screen */}
            <div className="text-center">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-red-900 to-red-700 flex items-center justify-center shadow-lg"
              >
                <span className="text-5xl">🔒</span>
              </motion.div>
              
              <h1 className="text-3xl font-bold text-white mb-4">Restricted Access</h1>
              <p className="text-gray-400 mb-8">
                This page is exclusively for administrators. Please enter the secret code to proceed.
              </p>

              <form onSubmit={handleSecretSubmit} className="space-y-6">
                <div>
                  <input
                    type="password"
                    placeholder="Enter secret code"
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value)}
                    className="w-full p-4 bg-gray-700/80 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-900/50 transition duration-300"
                    autoFocus
                  />
                </div>

                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-700 to-red-800 text-white py-4 rounded-xl font-bold text-lg hover:from-red-800 hover:to-red-900 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Verify Access
                </motion.button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <p className="text-gray-500 text-sm">
                  <span className="text-red-400">⚠️</span> Unauthorized access attempts are logged
                </p>
                <p className="text-gray-600 text-xs mt-2">
                  For technical support, contact: admin-support@stag.io
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Admin Login Form */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg"
              >
                <span className="text-4xl">👨‍💼</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-white mb-2"
              >
                Administrator Login
              </motion.h1>
              <p className="text-gray-400">Admin Dashboard - Stag.io Platform</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-8">
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
                  className="w-full p-4 bg-gray-700/80 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-900/50 transition duration-300"
                  disabled={loading}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full p-4 bg-gray-700/80 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-900/50 transition duration-300"
                  disabled={loading}
                />
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-900/30 border border-red-700/50 rounded-lg p-3"
                >
                  <p className="text-red-300 text-sm text-center">
                    ⚠️ {error}
                  </p>
                </motion.div>
              )}

              <motion.button
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 ${
                  loading 
                    ? 'bg-blue-800/50 text-blue-300 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  "Sign In as Admin"
                )}
              </motion.button>
            </form>

            <div className="text-center mt-8 pt-8 border-t border-gray-700">
              <p className="text-gray-500 text-sm">
                <span className="text-blue-400">🔐</span> Restricted to authorized administrators only
              </p>
              <button
                onClick={() => {
                  setShowForm(false);
                  setSecretCode("");
                  setError("");
                }}
                className="mt-4 text-gray-400 hover:text-gray-300 text-sm transition duration-300"
              >
                ← Back to access gate
              </button>
            </div>

            {/* Security Info */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700/50"
            >
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="text-green-400">✓</span>
                <span>Secure connection • Encrypted session • Activity logged</span>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Background Security Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}