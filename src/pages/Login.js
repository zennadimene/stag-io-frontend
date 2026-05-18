import { useState } from "react";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const [form, setForm] = useState({ 
    email: "", 
    password: "", 
    role: "student" 
  });
  const [redirect, setRedirect] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // مسح الأخطاء عند تغيير المدخلات
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // التحقق من المدخلات
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email,
        password: form.password,
        role: form.role
      });

      // حفظ بيانات المستخدم
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userEmail", res.data.email);
      localStorage.setItem("userName", res.data.name || res.data.email);

      // التحويل بناءً على الـ Role
      if (res.data.role === "student") {
        setRedirect("/student/dashboard");
      } else if (res.data.role === "company") {
        setRedirect("/company/dashboard");
      } else if (res.data.role === "admin") {
        setRedirect("/admin/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || 
        "Invalid credentials. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  if (redirect) return <Navigate to={redirect} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center">
        
        {/* الجانب الأيسر - المعلومات */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:block"
        >
          <div className="text-center md:text-left">
            <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
              <span>←</span>
              <span>Back to Home</span>
            </Link>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Welcome Back to <span className="text-blue-600">Stag.io</span>
            </h1>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Access your personalized portal. Students find internships, 
              companies find talent. Login with your credentials to continue.
            </p>
            
            {/* الميزات */}
            <div className="space-y-4 mt-10">
              {[
                { icon: "🎓", title: "For Students", desc: "Find internships matching your skills" },
                { icon: "🏢", title: "For Companies", desc: "Post offers and find qualified candidates" }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* الجانب الأيمن - نموذج Login */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-10 rounded-3xl shadow-2xl"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Login to Stag.io</h2>
            <p className="text-gray-600">Access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* اختيار الـ Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                I am logging in as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "student", label: "Student", icon: "👨‍🎓", color: "border-blue-500 text-blue-600 hover:bg-blue-50" },
                  { value: "company", label: "Company", icon: "🏢", color: "border-green-500 text-green-600 hover:bg-green-50" }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChange({ target: { name: "role", value: option.value } })}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      form.role === option.value 
                        ? `${option.color.split(' hover:')[0]} bg-gradient-to-br from-white to-gray-50 shadow-md` 
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className="font-medium text-sm">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {form.role === "student" ? "University Email" : "Company Email"}
              </label>
              <input
                name="email"
                type="email"
                placeholder={
                  form.role === "student" ? "student@university.edu" : "contact@company.com"
                }
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300"
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
                value={form.password}
                onChange={handleChange}
                required
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300"
              />
            </div>

            {/* رسالة الخطأ */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl"
              >
                {error}
              </motion.div>
            )}

            {/* زر Login */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 ${
                loading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : form.role === "student" 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700' 
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                `Sign in as ${form.role.charAt(0).toUpperCase() + form.role.slice(1)}`
              )}
            </motion.button>
          </form>

          {/* روابط إضافية */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-gray-600">Don't have an account? </span>
                {form.role === "student" && (
                  <Link to="/student/register" className="text-blue-600 hover:text-blue-800 font-semibold">
                    Register as Student
                  </Link>
                )}
                {form.role === "company" && (
                  <Link to="/company/register" className="text-green-600 hover:text-green-800 font-semibold">
                    Register Company
                  </Link>
                )}
              </div>
              
              <div className="text-center">
                <Link to="/forgot-password" className="text-gray-600 hover:text-gray-800 text-sm">
                  Forgot your password?
                </Link>
              </div>

              {/* رابط Admin مخفي في الأسفل */}
              <div className="pt-4 mt-4 border-t border-gray-100">
                <div className="text-center">
                  <Link 
                    to="/admin-access" 
                    className="text-xs text-gray-400 hover:text-gray-600 transition"
                  >
                    Administrative Access
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}