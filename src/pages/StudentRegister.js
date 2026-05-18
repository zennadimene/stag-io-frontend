import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function StudentRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    university: "",
    major: "",
    year: ""
  });
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear email error when user types
    if (e.target.name === "email") {
      setEmailError("");
    }
  };

   const validateEmail = (email) => {
    // Algerian university email regex: firstname.lastname@univ-[university].dz
    const algerianUniversityRegex = /^[a-zA-Z]+\.[a-zA-Z]+@univ-[a-zA-Z]+[0-9]*\.dz$/;
    return algerianUniversityRegex.test(email);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!"); 
      return;
    }

     // Validate email format
    if (!validateEmail(form.email)) {
      setEmailError("Please use your university email. Format: prenom.nom@univ-university.dz (Example: imene.zennad@univ-constantine2.dz)");
       setEmailError(errorMsg);
      toast.error(errorMsg);  // ✅ تحويل setEmailError إلى toast
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setRedirect(true);
       toast.success("Student registered successfully! Please login.");
    }, 1500);
  };

  if (redirect) {
    return <Navigate to="/student/login" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="md:flex">
            {/* Left Side - Form */}
            <div className="md:w-1/2 p-10">
              <div className="mb-8">
                <Link to="/" className="text-purple-600 hover:text-purple-800 flex items-center gap-2">
                  ← Back to Home
                </Link>
                <h2 className="text-3xl font-bold text-gray-900 mt-4">Student Registration</h2>
                <p className="text-gray-600">Create your student account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="prenom.nom@univ-nameuniversity.dz"
                      value={form.email}
                      onChange={handleChange}
                      required
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
      emailError ? "border-red-500" : "border-gray-300"
    }`}
  />
  {emailError && (
    <p className="text-red-500 text-sm mt-1">{emailError}</p>
  )}
   <p className="text-xs text-gray-500 mt-1">
    Use your university email: prenom.nom@univ-[university].dz
  </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
                    <input
                      type="text"
                      name="university"
                      placeholder="Your university"
                      value={form.university}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Major</label>
                    <input
                      type="text"
                      name="major"
                      placeholder="Computer Science"
                      value={form.major}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year of Study</label>
                  <select
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Create password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? "Creating Account..." : "Create Student Account"}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link to="/student/login" className="text-purple-600 hover:text-purple-800 font-semibold">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Side - Info */}
            <div className="md:w-1/2 bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-10 flex flex-col justify-center">
              <div>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-3xl">🎓</span>
                </div>
                <h3 className="text-2xl font-bold text-center mb-6">Why Register as Student?</h3>
                
                <ul className="space-y-4">
                  {[
                    "AI-powered internship matching",
                    "Resume auto-fill technology",
                    "Access to 2,500+ companies",
                    "Academic credit integration",
                    "Real-time application tracking",
                    "Secure and private profile"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <span className="text-xl">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>


                <div className="mt-10 p-4 bg-white/10 rounded-lg">
                  <p className="text-sm text-center">
                     <span className="font-semibold">Note:</span> Use your university email:{" "}
        <span className="font-mono">prenom.nom@univ-[university].dz</span>
        <br />
        <span className="text-xs opacity-75">Example: imene.zennad@univ-constantine2.dz</span>
      </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}