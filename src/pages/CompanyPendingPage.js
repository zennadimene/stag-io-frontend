import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./../components/Navbar";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function CompanyPendingPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    // ✅ جلب البيانات من localStorage
    const email = localStorage.getItem('pendingCompanyEmail');
    const name = localStorage.getItem('pendingCompanyName');
    
    console.log('📦 Company data from localStorage:', { email, name });
    
    if (email) setCompanyEmail(email);
    if (name) setCompanyName(name);
  }, []);

  const checkStatus = async () => {
    if (!companyEmail) {
      toast.error("No pending account found. Please register first.");
      navigate("/company/register");
      return;
    }
    
    setChecking(true);
    
    try {
      const response = await axios.post("http://localhost:5000/api/auth/check-company-status", {
        email: companyEmail
      });
      
      if (response.data.success && response.data.is_verified) {
        localStorage.removeItem('pendingCompanyEmail');
        localStorage.removeItem('pendingCompanyName');
        toast.success("✅ Congratulations! Your company account has been approved. You can now login.");
        navigate("/login");
      } else {
        toast("⏳ Your account is still pending approval. Please check again later.");
      }
    } catch (error) {
      console.error("Error checking status:", error);
      toast.error("❌ Error checking approval status. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      
      <div className="pt-24 pb-16 px-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-12 text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">⏳</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Account Pending Approval
          </h1>
          
          {/* ✅ اسم الشركة ديناميكي */}
          <p className="text-gray-600 text-lg mb-8">
            Thank you for registering{' '}
            <span className="font-semibold text-blue-600">
              {companyName || "your company"}
            </span>
            ! Your account is currently under review by our team.
          </p>
          
          {/* ✅ صندوق البريد الإلكتروني */}
          {companyEmail && (
            <div className="bg-gray-100 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-gray-600">Registered email:</p>
              <p className="text-gray-800 font-mono">{companyEmail}</p>
            </div>
          )}
    
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-left">
            <h2 className="font-semibold text-blue-800 mb-3">📌 What happens next?</h2>
            <ul className="space-y-3 text-blue-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span>An administrator will review your application (usually within 24-48 hours)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span>You'll receive a notification once your account is approved</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span>After approval, you can log in and start posting internships</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              🔐 Go to Login
            </Link>
            
            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
            >
              🏠 Return to Home
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            Need help? <Link to="/contact" className="text-blue-600 hover:underline">Contact support</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}