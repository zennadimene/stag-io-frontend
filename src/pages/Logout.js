import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ 1. مسح جميع أنواع التخزين
    // localStorage (للمستخدمين الذين اختاروا "تذكرني")
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    
    // ✅ 2. مسح sessionStorage (للأدمن والمستخدمين بدون "تذكرني")
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("role");
    
    // ✅ 3. التوجيه إلى صفحة login
    navigate("/login");
  }, [navigate]);

  // ✅ هذا العنصر سيظهر للحظة ثم يختفي
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center"
    >
      <div className="text-center text-white">
        <div className="w-20 h-20 mx-auto mb-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-2xl font-bold">Logging out...</h2>
        <p className="text-white/80 mt-2">Please wait</p>
      </div>
    </motion.div>
  );
}