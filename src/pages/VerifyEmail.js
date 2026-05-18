// pages/VerifyEmail.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import API_URL from '../config/api';

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        //const response = await axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);
        const response = await axios.get(`${API_URL}/auth/verify-email/${token}`);
        if (response.data.success) {
          setStatus("success");
          setMessage(response.data.message || "Email verified successfully!");
          toast.success("Email verified successfully!");
          
          // التوجيه التلقائي بعد 3 ثواني
          setTimeout(() => navigate("/login"), 3000);
        }
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Invalid or expired verification link");
        toast.error("Verification failed");
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full"
      >
        {status === "loading" && (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Loader2 className="h-16 w-16 animate-spin text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Verifying Your Email
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your email address...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Email Verified! ✅
            </h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Redirecting to login page in 3 seconds...
            </p>
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
            >
              Go to Login Now
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <Link
                to="/register"
                className="block w-full px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
              >
                Register Again
              </Link>
              <Link
                to="/login"
                className="block w-full px-6 py-3 border border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}