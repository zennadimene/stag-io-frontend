import { motion } from "framer-motion";//animation & mvmnt
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import AnimatedSection from "../components/AnimatedSection";

export default function HomePage() {
  return (
    <div className="font-sans overflow-hidden">
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-32 pb-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center px-6">
          <AnimatedSection>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight"
            >
              University-Enterprise Internship
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mt-2">
                Management Platform
              </span>
            </motion.h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="max-w-3xl mx-auto text-xl text-gray-600 mb-12 leading-relaxed">
              A centralized solution connecting students with companies through smart skill-based matching,
              automated document generation (Internship Agreements), and seamless integration with 
              university administration for validation and tracking.
            </p>
          </AnimatedSection>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
            {[
              { title: "50,000+", desc: "Students Registered", color: "from-purple-500 to-pink-500" },
              { title: "2,500+", desc: "Companies Partnered", color: "from-blue-500 to-cyan-400" },
              { title: "45,000+", desc: "Successful Matches", color: "from-green-500 to-emerald-400" },
              { title: "95%", desc: "Match Accuracy", color: "from-orange-500 to-yellow-400" },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={0.1 * i + 0.4}>
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    rotateX: 5,
                    rotateY: 5
                  }}
                  className={`bg-gradient-to-br ${item.color} rounded-2xl p-8 shadow-xl text-white`}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 * i + 0.6, type: "spring" }}
                    className="inline-block mb-4"
                  >
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  </motion.div>
                  <h3 className="text-3xl font-bold mb-2">{item.title}</h3>
                  <p className="text-sm mt-1 text-white/90">{item.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          {/* Floating elements */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-10 w-4 h-4 rounded-full bg-purple-400 opacity-20"
          />
          <motion.div
            animate={{ 
              y: [0, 10, 0],
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            className="absolute bottom-1/4 right-10 w-6 h-6 rounded-full bg-blue-400 opacity-20"
          />
        </div>
      </section>

      {/* CHOOSE PORTAL */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] bg-[length:40px_40px]"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <AnimatedSection>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Get Started
            </motion.h2>
          </AnimatedSection>
          
          <AnimatedSection delay={0.3}>
            <p className="text-gray-600 text-lg mb-16 max-w-2xl mx-auto">
              Join our platform as a student seeking internships or as a company looking for talent
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Student Portal Card */}
            <AnimatedSection delay={0.4}>
              <motion.div
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 25px 50px rgba(147, 51, 234, 0.2)",
                  y: -10
                }}
                className="p-12 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-500 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden group"
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <span className="text-2xl">👨‍🎓</span>
                    </div>
                    <h3 className="text-2xl font-bold">For Students</h3>
                  </div>
                  
                  <p className="mb-8 text-white/90 text-lg leading-relaxed">
                    Find perfect internships that match your skills and career goals
                  </p>
                  
                  <ul className="space-y-4 mb-10 text-left">
                    {[
                      { icon: "📄", text: "Digital CV Builder", desc: "Fill personal details and technical skills" },
                      { icon: "🔍", text: "Advanced Search", desc: "Filter by Wilaya, skills, internship type" },
                      { icon: "🎯", text: "Skill-Based Matching", desc: "Find offers matching your tech stack" }
                    ].map((item, i) => (
                      <motion.li 
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <div className="font-medium">{item.text}</div>
                          <div className="text-sm text-white/70">{item.desc}</div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    className="inline-block"
                  >
                    <Link
                      to="/student/register"
                      className="group relative inline-flex items-center gap-2 bg-white text-purple-600 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Register as Student
                      </motion.span>
                      <span className="text-xl">→</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatedSection>

            {/* Company Portal Card */}
            <AnimatedSection delay={0.5}>
              <motion.div
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 25px 50px rgba(31, 41, 55, 0.2)",
                  y: -10
                }}
                className="p-12 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden group"
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.5
                  }}
                />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <span className="text-2xl">🏢</span>
                    </div>
                    <h3 className="text-2xl font-bold">For Companies</h3>
                  </div>
                  
                  <p className="mb-8 text-white/90 text-lg leading-relaxed">
                    Find qualified candidates and manage internships efficiently
                  </p>
                  
                  <ul className="space-y-4 mb-10 text-left">
                    {[
                      { icon: "📝", text: "Offer Management", desc: "Create, modify, and delete internship offers" },
                      { icon: "👥", text: "Candidate Tracking", desc: "View and manage applicants" },
                      { icon: "✅", text: "Accept/Refuse", desc: "Trigger administrative procedure" }
                    ].map((item, i) => (
                      <motion.li 
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 + 0.2 }}
                        className="flex items-start gap-3"
                      >
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <div className="font-medium">{item.text}</div>
                          <div className="text-sm text-white/70">{item.desc}</div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    className="inline-block"
                  >
                    <Link
                      to="/company/register"
                      className="group relative inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      >
                        Register Company
                      </motion.span>
                      <span className="text-xl">→</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatedSection>
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
      </section>

{/* KEY FEATURES */}
<section className="py-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white relative overflow-hidden">
  {/* Animated background circles */}
  <motion.div
    animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    className="absolute -top-64 -right-64 w-96 h-96 rounded-full bg-white/5"
  />
  <motion.div
    animate={{ scale: [1, 1.1, 1], rotate: [360, 180, 0] }}
    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
    className="absolute -bottom-64 -left-64 w-96 h-96 rounded-full bg-white/5"
  />
  
  <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
    {/* Header */}
    <AnimatedSection>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold mb-4"
      >
        Why Choose Stag.io?
      </motion.h2>
    </AnimatedSection>
    
    <AnimatedSection delay={0.2}>
      <p className="text-xl text-white/90 mb-16 max-w-3xl mx-auto">
        A centralized platform connecting students, companies, and university administration
      </p>
    </AnimatedSection>

    {/* Features Grid */}
    <div className="grid md:grid-cols-3 gap-8">
      {[
        {
          icon: "⚡",
          title: "Smart Matching",
          desc: "Connect students with companies through skill-based filtering"
        },
        {
          icon: "📄",
          title: "Digital CV Builder",
          desc: "Create CV with technical skills (React, Java, Python)"
        },
        {
          icon: "📊",
          title: "Admin Dashboard",
          desc: "Track placed vs unplaced students with statistics"
        },
        {
          icon: "🔐",
          title: "Secure Authentication",
          desc: "JWT and university email verification"
        },
        {
          icon: "📋",
          title: "Automated Documents",
          desc: "Generate internship agreements automatically"
        },
        {
          icon: "📱",
          title: "Mobile Responsive",
          desc: "Access from any device"
        }
      ].map((feature, i) => (
        <AnimatedSection key={i} delay={0.1 * i}>
          <motion.div
            whileHover={{ scale: 1.05, rotateY: 10 }}
            className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20 h-full"
          >
            <motion.div
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="text-5xl mb-4"
            >
              {feature.icon}
            </motion.div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-white/80 text-sm">{feature.desc}</p>
          </motion.div>
        </AnimatedSection>
      ))}
    </div>
  </div>
</section>

      {/* FOOTER */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-gray-900 to-black text-gray-300 py-16 relative overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,#fff_1px,transparent_0)] bg-[length:50px_50px]"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-10 relative z-10">
          <AnimatedSection delay={0.1}>
            <div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 text-white font-bold text-2xl mb-4"
              >
                <span className="text-3xl">🎓</span>
                <span>Stag.io</span>
              </motion.div>
              <p className="text-gray-400">
  A centralized platform for internship management connecting students, companies, 
  and university administration through automated document generation and skill-based matching.
</p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div>
              <h4 className="font-semibold text-white text-lg mb-4">Platform</h4>
              <ul className="space-y-3">
                {["Student Portal", "Company Portal", "Login", "Register"].map((item, i) => (
                  <motion.li key={i} whileHover={{ x: 5 }}>
                    <Link to={
                      item === "Login" ? "/login" : 
                      item === "Register" ? "/register" : 
                      item === "Student Portal" ? "/student/register" : 
                      "/company/register"
                    } className="hover:text-white transition duration-300 flex items-center gap-2">
                      <span className="text-xs">›</span>
                      {item}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div>
              <h4 className="font-semibold text-white text-lg mb-4">Support</h4>
              <ul className="space-y-3">
                {["Help Center", "Privacy Policy", "Terms of Service", "FAQ"].map((item, i) => (
                  <motion.li key={i} whileHover={{ x: 5 }}>
                    <a href="#" className="hover:text-white transition duration-300 flex items-center gap-2">
                      <span className="text-xs">›</span>
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <div>
              <h4 className="font-semibold text-white text-lg mb-4">Contact Info</h4>
              <ul className="space-y-3">
               {[
  { icon: "🎓", text: "Internship Management Platform" },
  { icon: "✉️", text: "contact@stag.io" },
  { icon: "📍", text: "University Partner" },
  { icon: "⏰", text: "Support: Sun-Thu, 9AM-5PM" }
].map((item, i) => (
  <motion.li key={i} whileHover={{ x: 5 }} className="flex items-center gap-3">
    <span>{item.icon}</span>
    <span>{item.text}</span>
  </motion.li>
))}
              </ul>
            </div>
          </AnimatedSection>
        </div>

        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent max-w-4xl mx-auto mt-12 mb-8"
        />

        <p className="text-center text-sm text-gray-500 relative z-10">
          © 2026 🎓 Stag.io Platform. All rights reserved.
        </p>
      </motion.footer>

    </div>
  );
}