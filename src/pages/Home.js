import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { useInView } from "framer-motion";

// Component for scroll animation
function AnimatedSection({ children, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: delay }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="font-sans overflow-hidden">
      {/* NAVBAR */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-purple-700 to-indigo-600 shadow-lg backdrop-blur-md bg-opacity-90"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-white">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="text-xl font-bold flex items-center gap-2"
          >
            <span className="text-2xl">🎓</span>
            <span>Stag.io</span>
          </motion.div>
          <div className="flex gap-6">
            <motion.div whileHover={{ y: -2 }}>
              <Link className="hover:text-yellow-300 transition px-4 py-2 rounded-lg hover:bg-white/10" to="/login">
                Login
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Link className="hover:text-yellow-300 transition px-4 py-2 rounded-lg hover:bg-white/10" to="/student/register">
                Register
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* HERO */}
      <section className="pt-32 pb-24 bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto text-center px-6">
          <AnimatedSection>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight"
            >
              AI-Powered Internship
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400 mt-2">
                Allocating Platform
              </span>
            </motion.h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="max-w-3xl mx-auto text-xl text-white/90 mb-12 leading-relaxed">
              Connecting talented students with industry opportunities through intelligent matching, 
              resume auto-fill, and seamless integration with Academic Bank of Credits.
            </p>
          </AnimatedSection>

          {/* CTA BUTTONS */}
          <AnimatedSection delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/student/register"
                  className="bg-white text-purple-600 font-bold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Register as Student
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/company/register"
                  className="bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:bg-yellow-500 transition-all duration-300"
                >
                  Register Company
                </Link>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
            {[
              { title: "50,000+", desc: "Students Registered", color: "from-purple-500 to-pink-500" },
              { title: "2,500+", desc: "Companies Partnered", color: "from-blue-500 to-cyan-400" },
              { title: "45,000+", desc: "Successful Matches", color: "from-green-500 to-emerald-400" },
              { title: "94%", desc: "Match Accuracy", color: "from-orange-500 to-yellow-400" },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={0.1 * i + 0.4}>
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    rotateX: 5,
                    rotateY: 5
                  }}
                  className={`bg-gradient-to-br ${item.color} rounded-2xl p-8 shadow-2xl backdrop-blur-sm bg-opacity-20`}
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
            className="absolute top-1/4 left-10 w-4 h-4 rounded-full bg-purple-300 opacity-30"
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
            className="absolute bottom-1/4 right-10 w-6 h-6 rounded-full bg-blue-300 opacity-20"
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
                      { icon: "📄", text: "Digital CV Builder", desc: "Create professional resumes" },
                      { icon: "🎓", text: "University Integration", desc: "Academic credits sync" },
                      { icon: "🤖", text: "AI Matching", desc: "Smart internship recommendations" }
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
                      { icon: "🔍", text: "Candidate Matching", desc: "Find perfect matches" },
                      { icon: "📊", text: "Analytics Dashboard", desc: "Real-time insights" },
                      { icon: "⚡", text: "Bulk Operations", desc: "Efficient management" }
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

      {/* TECHNOLOGY */}
      <section className="py-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white relative overflow-hidden">
        {/* Animated background circles */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-64 -right-64 w-96 h-96 rounded-full bg-white/5"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-64 -left-64 w-96 h-96 rounded-full bg-white/5"
        />
        
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <AnimatedSection>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Powered by Advanced Technology
            </motion.h2>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2}>
            <p className="text-xl text-white/90 mb-16 max-w-3xl mx-auto">
              Our platform leverages cutting-edge AI and seamless integrations to provide 
              the best internship matching experience
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: "🤖", 
                title: "Smart Matching", 
                desc: "AI engine considers skills, preferences, and qualifications for perfect matches" 
              },
              { 
                icon: "🔒", 
                title: "Secure & Compliant", 
                desc: "Enterprise-grade security with full compliance to data protection regulations" 
              },
              { 
                icon: "📱", 
                title: "Mobile Responsive", 
                desc: "Access the platform seamlessly across all devices with our responsive design" 
              },
              { 
                icon: "📄", 
                title: "Resume Auto-fill", 
                desc: "Upload your resume and watch as our AI extracts and fills all relevant information" 
              },
              { 
                icon: "🎓", 
                title: "ABC ID Integration", 
                desc: "Seamlessly connect with Academic Bank of Credits to import academic achievements" 
              },
              { 
                icon: "📊", 
                title: "Real-time Analytics", 
                desc: "Track application status, match scores, and platform statistics in real-time" 
              },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={0.1 * i}>
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 10
                  }}
                  className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl mb-4 inline-block"
                  >
                    {item.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-white/80">{item.desc}</p>
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
                AI-powered platform for intelligent internship allocation and matching.
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
                      item === "Register" ? "/student/register" : 
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
                  { icon: "🎓", text: "Stag.io Platform" },
                  { icon: "✉️", text: "support@stag.io" },
                  { icon: "📞", text: "1800-XXX-XXXX" },
                  { icon: "⏰", text: "Available 24/7" }
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

      {/* Hidden Admin Access Link */}
      <div className="fixed bottom-4 right-4 z-50">
        <motion.div
          initial={{ opacity: 0.05 }}
          whileHover={{ opacity: 1 }}
          className="bg-black/20 backdrop-blur-sm p-3 rounded-full cursor-pointer border border-white/10"
        >
          <Link 
            to="/login" 
            className="flex items-center gap-2 text-xs text-white"
          >
            <span className="text-xs">🔐</span>
            <span className="hidden md:inline">Login</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}