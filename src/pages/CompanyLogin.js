import { useState } from "react";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function CompanyLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [redirect, setRedirect] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //const res = await axios.post("http://localhost:5000/api/auth/login", {
      const res = await axios.post("http://stag-io-backend.onrender.com/api/auth/login", {
        ...form,
        role: "company"
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "company") 
        //toast.success("Company login successful!");
        setRedirect("/company/dashboard");
    } catch (err) {
      toast.error("Email or password incorrect");
    }
  };

  if (redirect) return <Navigate to={redirect} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 text-xl font-bold text-gray-900">
            <span className="text-2xl">🏢</span>
            <span>InternMatch</span>
          </div>
          <div className="flex gap-8">
            <Link 
              to="/student/login" 
              className="text-gray-700 hover:text-gray-900 transition font-medium text-lg"
            >
              Student Portal
            </Link>
            <Link 
              to="/company/login" 
              className="text-gray-900 font-medium text-lg border-b-2 border-gray-900"
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
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Industry Login
            </h1>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
              Access your company dashboard and manage internships
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-16">
            {/* Login Form - LEFT SIDE */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-lg"
            >
              <div className="bg-white p-12 rounded-3xl shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-10">
                  {/* Company Email */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-4">
                      Company Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      placeholder="Enter company email"
                      onChange={handleChange}
                      required
                      className="w-full p-5 text-lg border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-gray-900 focus:ring-4 focus:ring-gray-200 transition duration-300 hover:border-gray-400"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-4">
                      Password
                    </label>
                    <input
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      onChange={handleChange}
                      required
                      className="w-full p-5 text-lg border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-gray-900 focus:ring-4 focus:ring-gray-200 transition duration-300 hover:border-gray-400"
                    />
                  </div>

                  {/* Forgot Password */}
                  <div className="text-right">
                    <Link 
                      to="/forgot-password" 
                      className="text-gray-600 hover:text-gray-900 font-medium text-lg transition"
                    >
                      Forgot your password?
                    </Link>
                  </div>

                  {/* Sign In Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-gray-800"
                  >
                    Sign In
                  </motion.button>

                  {/* Register Link */}
                  <div className="text-center pt-8 border-t border-gray-200">
                    <p className="text-gray-600 text-lg mb-4">
                      Don't have an account?
                    </p>
                    <Link 
                      to="/company/register" 
                      className="inline-block text-gray-900 hover:text-gray-700 font-bold text-xl transition border-b-2 border-gray-900 hover:border-gray-700 pb-1"
                    >
                      Register Company
                    </Link>
                  </div>
                </form>
              </div>
            </motion.div>

            {/* Right Side - Info Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-full max-w-md"
            >
              <div className="text-center">
                {/* V2 Badge */}
                <div className="mb-10">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white px-6 py-3 rounded-full">
                    <span className="text-2xl">⚡</span>
                    <span className="font-bold text-xl">Built with V2</span>
                  </div>
                </div>

                {/* Illustration */}
                <div className="mb-10">
                  <div className="w-48 h-48 mx-auto mb-8 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-7xl">🏢</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Industry Portal Features
                  </h3>
                </div>
                
                {/* Features List */}
                <ul className="space-y-6 text-left">
                  {[
                    { icon: "📊", text: "Advanced Analytics Dashboard", color: "text-gray-800" },
                    { icon: "🤖", text: "AI-powered Candidate Matching", color: "text-gray-800" },
                    { icon: "⚡", text: "Bulk Operations & Fast Processing", color: "text-gray-800" },
                    { icon: "🔒", text: "Secure & GDPR Compliant", color: "text-gray-800" },
                    { icon: "📱", text: "Mobile Responsive Design", color: "text-gray-800" }
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index + 0.6 }}
                      className="flex items-center gap-4"
                    >
                      <span className={`text-2xl ${item.color}`}>{item.icon}</span>
                      <span className="text-gray-700 text-lg">{item.text}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Demo Link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="mt-12 pt-8 border-t border-gray-200"
                >
                  <p className="text-gray-600 mb-4 text-lg">
                    Live Demo Available
                  </p>
                  <a 
                    href="https://internmatch-variablex.vercel.app/industry/login" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-700 font-medium text-lg transition"
                  >
                    <span>View Live Demo</span>
                    <span className="text-xl">→</span>
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏢</span>
              <div>
                <h3 className="text-white font-bold text-2xl">InternMatch</h3>
                <p className="text-gray-400 text-sm">Industry Portal v2.0</p>
              </div>
            </div>

            {/* Links */}
            <div className="flex gap-10">
              <div>
                <h4 className="font-semibold text-white mb-3">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition">Home</a></li>
                  <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Support</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition">API Docs</a></li>
                  <li><a href="#" className="hover:text-white transition">Status</a></li>
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-white mb-3">Contact</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span>✉️</span>
                  <span>support@internmatch.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📞</span>
                  <span>+1 (555) 123-4567</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-sm">
              © 2024 InternMatch Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}