import { useState } from "react";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function StudentLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [redirect, setRedirect] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //const res = await axios.post("http://localhost:5000/api/auth/login", {
      const res = await axios.post(`${BASE}/api/auth/login`, {
        ...form,
        role: "student" // تأكد من إرسال role كـ student
      });

      // Store token and role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // Redirect based on role
      if (res.data.role === "student") 
        //toast.success("Student login successful!");
      setRedirect("/student/dashboard");
    } catch (err) {
      toast.error("Email or password incorrect");
    }
  };

  if (redirect) return <Navigate to={redirect} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <span className="text-2xl">🎓</span>
            <span>InternMatch</span>
          </div>
          <div className="flex gap-6">
            <Link 
              to="/student/login" 
              className="text-gray-700 hover:text-purple-600 transition font-medium"
            >
              Student Portal
            </Link>
            <Link 
              to="/company/login" 
              className="text-gray-700 hover:text-purple-600 transition font-medium"
            >
              Industry Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Student Login
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Access your student dashboard and internship applications
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    onChange={handleChange}
                    required
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition duration-300"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    onChange={handleChange}
                    required
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition duration-300"
                  />
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-purple-600 hover:text-purple-800 transition"
                  >
                    Forgot your password?
                  </Link>
                </div>

                {/* Sign In Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Sign In →
                </motion.button>

                {/* Register Link */}
                <div className="text-center pt-6 border-t border-gray-100">
                  <p className="text-gray-600">
                    Don't have an account?
                  </p>
                  <Link 
                    to="/student/register" 
                    className="inline-block mt-3 text-purple-600 hover:text-purple-800 font-semibold text-lg transition"
                  >
                    Register as Student
                  </Link>
                </div>
              </form>
            </motion.div>

            {/* Illustration/Info Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-full max-w-md"
            >
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-10 rounded-2xl border border-purple-100">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                    <span className="text-3xl">🎓</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Why Join InternMatch?
                  </h3>
                </div>
                
                <ul className="space-y-4">
                  {[
                    { icon: "🤖", text: "AI-powered matching with top companies" },
                    { icon: "📄", text: "Auto-fill resume from your profile" },
                    { icon: "🎓", text: "Seamless ABC ID integration" },
                    { icon: "⚡", text: "Fast application processing" },
                    { icon: "📊", text: "Track all applications in one dashboard" }
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index + 0.6 }}
                      className="flex items-start gap-3"
                    >
                      <span className="text-xl mt-1">{item.icon}</span>
                      <span className="text-gray-700">{item.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Built with VSCode */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 text-center text-gray-500 text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .327 8.74L3.899 12 .327 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/>
                </svg>
                <span>Built with VSCode</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              <span className="text-white font-bold">InternMatch</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">Contact</a>
            </div>
            <p className="text-sm text-gray-500">
              © 2024 InternMatch Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}