import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "", role: "student" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //await axios.post("http://localhost:5000/api/auth/register", form);
      await axios.post("https://stag-io-backend.onrender.com/api/auth/register", form);
      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Error registering user");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md animate-fadeInUp"
      >
        {/* Title */}
        <h2 className="text-3xl font-extrabold text-gray-700 mb-8 text-center animate-fadeInDown">
          Create Your Account
        </h2>

        {/* Email */}
        <label className="block mb-2 text-gray-600 font-medium">Email</label>
        <input
          name="email"
          type="email"
          placeholder="example@domain.com"
          onChange={handleChange}
          className="w-full mb-4 p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition duration-300 hover:shadow-md"
        />

        {/* Password */}
        <label className="block mb-2 text-gray-600 font-medium">Password</label>
        <input
          name="password"
          type="password"
          placeholder="********"
          onChange={handleChange}
          className="w-full mb-4 p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition duration-300 hover:shadow-md"
        />

        {/* Role Select */}
        <label className="block mb-2 text-gray-600 font-medium">Role</label>
        <select
          name="role"
          onChange={handleChange}
          className="w-full mb-6 p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition duration-300 hover:shadow-md"
        >
          <option value="student">Student</option>
          <option value="company">Company</option>
        </select>

        {/* Register Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold shadow-lg hover:from-pink-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105"
        >
          Register
        </button>

        {/* Extra links */}
        <p className="text-center text-gray-500 mt-6 animate-fadeIn delay-200">
          Already have an account?{" "}
          <span
            className="text-purple-600 font-semibold hover:underline cursor-pointer"
            onClick={() => window.location.href = "/login"}
          >
            Login
          </span>
        </p>
      </form>

      {/* Animations */}
      <style>{`
        @keyframes fadeInDown { 0% { opacity:0; transform: translateY(-20px);} 100% { opacity:1; transform: translateY(0);} }
        .animate-fadeInDown { animation: fadeInDown 1s ease forwards; }

        @keyframes fadeInUp { 0% { opacity:0; transform: translateY(20px);} 100% { opacity:1; transform: translateY(0);} }
        .animate-fadeInUp { animation: fadeInUp 1s ease forwards; }

        @keyframes fadeIn { 0% { opacity:0;} 100% { opacity:1; } }
        .animate-fadeIn { animation: fadeIn 1s ease forwards; }
        .delay-200 { animation-delay: 0.2s; }
      `}</style>
    </div>
  );
}
