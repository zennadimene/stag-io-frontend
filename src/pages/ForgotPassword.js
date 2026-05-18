import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom"; // ✅ أضف useNavigate
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ForgotPassword() {
  const navigate = useNavigate(); // ✅ للتنقل بين الصفحات
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetLink, setResetLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email
      });
      
      if (response.data.success) {
        setResetLink(response.data.resetLink);
        setSubmitted(true);
        toast.success("✅ Password reset link generated!");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error.response?.data?.message || "Error sending reset link");
    } finally {
      setLoading(false);
    }
  };

  // ✅ دالة لفتح صفحة إعادة التعيين
  const openResetPage = () => {
    // استخراج token من الرابط
    const token = resetLink.split('/').pop();
    // التنقل إلى صفحة reset-password مع token
    navigate(`/reset-password/${token}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full"
      >
        {!submitted ? (
          <>
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">🔐</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Forgot Password?
              </h1>
              <p className="text-gray-600">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Sending...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </motion.button>

              <div className="text-center">
                <Link to="/login" className="text-purple-600 hover:text-purple-800 text-sm">
                  ← Back to Login
                </Link>
              </div>
            </form>
          </>
        ) : (
          // ✅ شاشة النجاح - بدون رابط ظاهر
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">✅</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Reset Link Ready!
            </h2>
            
            <p className="text-gray-600 mb-6">
              Password reset link generated for:<br />
              <span className="font-semibold text-purple-600">{email}</span>
            </p>

            {/* ✅ زر واحد كبير لفتح صفحة إعادة التعيين */}
            <button
              onClick={openResetPage}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl mb-4"
            >
              🔑 Continue to Reset Password
            </button>

            <p className="text-sm text-gray-500 mb-6">
              You will be redirected to the reset password page
            </p>

            <Link
              to="/login"
              className="inline-block text-purple-600 hover:text-purple-800"
            >
              ← Return to Login
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}