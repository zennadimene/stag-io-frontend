import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 shadow-md backdrop-blur-md bg-opacity-95"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-gray-800">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="text-xl font-bold flex items-center gap-2"
        >
          <span className="text-2xl">🎓</span>
          <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Stag.io
          </span>
        </motion.div>
        <div className="flex gap-3">
          <motion.div whileHover={{ y: -2 }}>
            <Link 
              className="text-gray-700 hover:text-purple-600 transition px-4 py-2 rounded-lg hover:bg-purple-50" 
              to="/login"
            >
              Login
            </Link>

            <Link 
              to="/register" 
              className="text-gray-700 hover:text-purple-600 transition px-4 py-2 rounded-lg hover:bg-purple-50"
            >
              Register
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}