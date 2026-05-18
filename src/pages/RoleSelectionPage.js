import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AnimatedSection from "../components/AnimatedSection";

export default function RoleSelectionPage() {
  const navigate = useNavigate();

  const roles = [
    {
      type: "student",
      title: "Student",
      icon: "👨‍🎓",
      description: "Find internships that match your skills and start your career journey",
      color: "from-purple-600 to-indigo-600",
      features: ["Digital CV Builder", "Skill-Based Matching", "Track Applications"]
    },
    {
      type: "company",
      title: "Company",
      icon: "🏢",
      description: "Post internship offers and find qualified candidates for your company",
      color: "from-gray-900 to-gray-800",
      features: ["Offer Management", "Candidate Tracking", "Find Talents"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <Navbar />
      
      <div className="pt-32 pb-16 px-6 max-w-6xl mx-auto">
        <AnimatedSection>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Join Stag.io Platform
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose your account type to get started with your registration
            </p>
          </motion.div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {roles.map((role, index) => (
            <AnimatedSection key={role.type} delay={0.2 * (index + 1)}>
              <motion.div
                whileHover={{ 
                  scale: 1.03,
                  y: -10
                }}
                className={`p-8 rounded-3xl bg-gradient-to-br ${role.color} text-white shadow-2xl cursor-pointer h-full`}
                onClick={() => navigate(`/${role.type}/register`)}
              >
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                      <span className="text-3xl">{role.icon}</span>
                    </div>
                    <h2 className="text-3xl font-bold">{role.title}</h2>
                  </div>
                  
                  {/* Description */}
                  <p className="text-white/90 text-lg mb-8 leading-relaxed">
                    {role.description}
                  </p>
                  
                  {/* Features */}
                  <ul className="space-y-4 mb-10">
                    {role.features.map((feature, i) => (
                      <motion.li 
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <span className="text-xl">✓</span>
                        <span className="text-white/80 text-lg">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  {/* Button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block w-full"
                  >
                    <button className="w-full py-4 bg-white text-gray-900 font-bold rounded-xl text-lg shadow-lg hover:shadow-xl transition-all">
                      Register as {role.title}
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* Already have account? */}
        <AnimatedSection delay={0.6}>
          <div className="mt-16 text-center">
            <p className="text-gray-600 text-lg mb-4">
              Already have an account?
            </p>
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-bold text-lg transition"
            >
              <span>Login to your account</span>
              <span className="text-xl">→</span>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}