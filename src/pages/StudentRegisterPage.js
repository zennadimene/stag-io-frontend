import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { toast } from "react-hot-toast";


export default function StudentRegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    universityEmail: "",
    phone: "",
    birthDate: "",
    university: "",
    specialization: "",
    yearOfStudy: "",
    studentId: "",
    skills: [],
    githubLink: "",
    linkedinLink: "",
    password: "",
    confirmPassword: "",
    trainingType: "",
    preferredWilaya: "",
    startDate: ""
  });

  const [currentSkill, setCurrentSkill] = useState("");
  const [errors, setErrors] = useState({});
   const [loading, setLoading] = useState(false);


   const validateUniversityEmail = (email) => {
    // صيغة البريد الجامعي الجزائري: firstname.lastname@univ-university.dz
    const regex = /^[a-zA-Z]+\.[a-zA-Z]+@univ-[a-zA-Z0-9]+\.dz$/;
    return regex.test(email);
  };


  const universities = [
  // جامعات كبرى
  "University of Algiers 1 - Benyoucef Benkhedda",
  "University of Algiers 2 - Abou El Kacem Saâdallah",
  "University of Algiers 3 - Brahim Soltane Chaibout",
  "University of Science and Technology Houari Boumediene (USTHB)",
  "University of Oran 1 - Ahmed Ben Bella",
  "University of Oran 2 - Mohamed Ben Ahmed",
  "University of Constantine 1 - Mentouri Brothers",
  "University of Constantine 2 - Abdelhamid Mehri",
  "University of Constantine 3 - Salah Boubnider",
  "University of Annaba - Badji Mokhtar",
  "University of Tlemcen - Abou Bekr Belkaid",
  "University of Sétif 1 - Ferhat Abbas",
  "University of Sétif 2 - Mohamed Lamine Debaghine",
  "University of Blida 1 - Saad Dahlab",
  "University of Blida 2 - Lounici Ali",
  "University of Biskra - Mohamed Khider",
  "University of Béjaïa - Abderrahmane Mira",
  "University of Tizi Ouzou - Mouloud Mammeri",
  "University of Batna 1 - Hadj Lakhder",
  "University of Batna 2 - Mostefa Ben Boulaid",
  "University of Jijel - Mohamed Seddik Ben Yahia",
  "University of M'Sila - Mohamed Boudiaf",
  "University of Sidi Bel Abbès - Djillali Liabes",
  "University of Mostaganem - Abdelhamid Ibn Badis",
  "University of Chlef - Hassiba Ben Bouali",
  "University of Médéa - Yahia Fares",
  "University of Guelma - 8 Mai 1945",
  "University of Laghouat - Amar Telidji",
  "University of Ouargla - Kasdi Merbah",
  "University of Adrar - Ahmed Draia",
  "University of Tébessa - Larbi Tebessi",
  "University of Tiaret - Ibn Khaldoun",
  "University of Djelfa - Ziane Achour",
  "University of El Oued - Mohamed Lamine Debaghine",
  "University of Khenchela - Abbes Laghrour",
  "University of El Tarf - Chadli Bendjedid",
  "University of Souk Ahras - Mohamed Cherif Messaadia",
  "University of Mila - Abdelhafid Boussouf",
  "University of Bouira - Akli Mohand Oulhadj",
  "University of Boumerdès - M'hamed Bougara",
  "University of Tipaza - Tipaza University Center",
  "University of Tissemsilt - Ahmed Ben Yahia",
  "University of Relizane - Belhadj Bouchaib",
  "University of Saïda - Moulay Tahar",
  "University of Mascara - Mustapha Stambouli",
  "University of Naâma - Ahmed Zabana",
  "University of Béchar - Tahri Mohamed",
  "University of Tindouf - Tindouf University Center",
  "University of Ghardaïa - Ghardaïa University",
  "University of Illizi - Illizi University Center",
  "University of Timimoun - Timimoun University Center",
  "University of Touggourt - Touggourt University Center",
  "University of Djanet - Djanet University Center",
  "University of In Salah - In Salah University Center",
  "University of El Menia - El Menia University Center",
  "University of Bordj Bou Arréridj - El Bachir El Ibrahimi"
];

  const specializations = [
    "Computer Science",
    "Software Engineering",
    "Network Engineering",
    "Artificial Intelligence",
    "Data Science",
    "Cybersecurity",
    "Web Development"
  ];

  const yearsOfStudy = ["First Year", "Second Year", "Third Year", "Fourth Year", "Fifth Year"];
  const wilayas = [
  "Adrar",
  "Aïn Defla",
  "Aïn Témouchent",
  "Algiers",
  "Annaba",
  "Batna",
  "Béchar",
  "Béjaïa",
  "Béni Abbès",
  "Biskra",
  "Blida",
  "Bordj Badji Mokhtar",
  "Bordj Bou Arréridj",
  "Bouira",
  "Boumerdès",
  "Chlef",
  "Constantine",
  "Djanet",
  "Djelfa",
  "El Bayadh",
  "El M'Ghair",
  "El Menia",
  "El Oued",
  "El Tarf",
  "Ghardaïa",
  "Guelma",
  "Illizi",
  "In Guezzam",
  "In Salah",
  "Jijel",
  "Khenchela",
  "Laghouat",
  "M'Sila",
  "Mascara",
  "Médéa",
  "Mila",
  "Mostaganem",
  "Naâma",
  "Oran",
  "Ouargla",
  "Ouled Djellal",
  "Oum El Bouaghi",
  "Relizane",
  "Saïda",
  "Sétif",
  "Sidi Bel Abbès",
  "Skikda",
  "Souk Ahras",
  "Tamanrasset",
  "Tébessa",
  "Tiaret",
  "Tindouf",
  "Tipaza",
  "Tissemsilt",
  "Tizi Ouzou",
  "Tlemcen",
  "Touggourt"
];
  const trainingTypes = ["Full-time", "Part-time", "Remote", "Hybrid"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };


  const validateForm = () => {
  const newErrors = {};
  
  if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
  if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

  // ✅ تحقق واحد فقط للبريد (احتفظ بهذا)
  if (!formData.universityEmail.trim()) {
    newErrors.universityEmail = "University email is required";
  } else if (!validateUniversityEmail(formData.universityEmail)) {
    newErrors.universityEmail = "Email must be in format: firstname.lastname@univ-university.dz";
  }

  if (!formData.university) newErrors.university = "University is required";
  if (!formData.specialization) newErrors.specialization = "Specialization is required";
  if (!formData.yearOfStudy) newErrors.yearOfStudy = "Year of study is required";
  
  if (!formData.password) {
    newErrors.password = "Password is required";
  } else if (formData.password.length < 8) {
    newErrors.password = "Password must be at least 8 characters";
  }
  
  if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match";
  }
  
  return newErrors;
};


const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validateForm();
  
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  
  setLoading(true);
  
  const loadingToast = toast.loading("Creating your account...");

  const studentData = {
    first_name: formData.firstName,
    last_name: formData.lastName,
    university_email: formData.universityEmail,
    password: formData.password,
    university: formData.university,
    specialization: formData.specialization,
    year_of_study: formData.yearOfStudy,
    phone: formData.phone || null,
    birth_date: formData.birthDate || null,
    student_id: formData.studentId || null,
    skills: formData.skills,
    github_link: formData.githubLink || null,
    linkedin_link: formData.linkedinLink || null,
    training_type: formData.trainingType || null,
    preferred_wilaya: formData.preferredWilaya || null,
    expected_start_date: formData.startDate || null
  };
  
  try {
    //const response = await axios.post("http://localhost:5000/api/auth/register/student", studentData);
    const response = await axios.post("https://stag-io-backend.onrender.com/api/auth/register/student", studentData);
    if (response.data.success) {
      // ✅ إغلاق رسالة التحميل
      toast.dismiss(loadingToast);
      
      // ✅✅✅ حفظ بيانات الطالب في localStorage ✅✅✅
      localStorage.setItem('pendingStudentEmail', formData.universityEmail);
      localStorage.setItem('pendingStudentFirstName', formData.firstName);
      localStorage.setItem('pendingStudentLastName', formData.lastName);
      localStorage.setItem('pendingStudentUniversity', formData.university);
      
      // ✅ رسالة نجاح جديدة (Pending)
      toast.success(
        "✅ Account created successfully! Your account is pending approval by the administration. You will be notified once verified.",
        { duration: 5000 }
      );
      
      // ✅ التوجيه إلى صفحة الانتظار (pending) مع البيانات
      setTimeout(() => {
        navigate("/student/pending", { 
          state: { 
            email: formData.universityEmail,
            firstName: formData.firstName,
            lastName: formData.lastName,
            university: formData.university,
            fromRegister: true
          } 
        });
      }, 2000);
    }
  } catch (error) {
    console.error("Registration error:", error);
    toast.dismiss(loadingToast);
    
    if (error.response?.data?.message) {
      toast.error("❌ " + error.response.data.message);
    } else if (error.response?.data?.error) {
      toast.error("❌ " + error.response.data.error);
    } else {
      toast.error("❌ Registration failed. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      
      <div className="pt-24 pb-16 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Student Registration
          </h1>
          <p className="text-gray-600 text-lg">
            Join our platform and start your professional journey
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Personal Information Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Personal Information
              </span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
              
             <div>
  <label className="block text-gray-700 mb-2 font-medium">University Email *</label>
  <input
    type="email"
    name="universityEmail"
    value={formData.universityEmail}
    onChange={handleChange}
    className={`w-full px-4 py-3 rounded-xl border ${errors.universityEmail ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
    placeholder="firstname.lastname@univ-university.dz"
  />
  {errors.universityEmail && <p className="text-red-500 text-sm mt-1">{errors.universityEmail}</p>}
  
  {/* ✅ الرسالة القديمة فقط إذا أردتها */}
  { <p className="text-gray-500 text-sm mt-1">Must be a valid university email for verification</p> }
</div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="+213 XX XX XX XX"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Birth Date</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Academic Information Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Academic Information
              </span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">University *</label>
                <select
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.university ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                >
                  <option value="">Select your university</option>
                  {universities.map((uni, index) => (
                    <option key={index} value={uni}>{uni}</option>
                  ))}
                </select>
                {errors.university && <p className="text-red-500 text-sm mt-1">{errors.university}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Specialization *</label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.specialization ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                >
                  <option value="">Select your specialization</option>
                  {specializations.map((spec, index) => (
                    <option key={index} value={spec}>{spec}</option>
                  ))}
                </select>
                {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Year of Study *</label>
                <select
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.yearOfStudy ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                >
                  <option value="">Select your year</option>
                  {yearsOfStudy.map((year, index) => (
                    <option key={index} value={year}>{year}</option>
                  ))}
                </select>
                {errors.yearOfStudy && <p className="text-red-500 text-sm mt-1">{errors.yearOfStudy}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="University registration number"
                />
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Skills & Preferences
              </span>
            </h2>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">Technical Skills</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Add a skill (e.g., React, Python)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
                >
                  Add
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-full"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">GitHub/Portfolio Link</label>
                <input
                  type="url"
                  name="githubLink"
                  value={formData.githubLink}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://github.com/username"
                />
                <p className="text-gray-500 text-sm mt-1">Important for technical profile</p>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">LinkedIn Profile (Optional)</label>
                <input
                  type="url"
                  name="linkedinLink"
                  value={formData.linkedinLink}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Account Information
              </span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder="Enter password"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                <p className="text-gray-500 text-sm mt-1">Minimum 8 characters</p>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder="Re-enter password"
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          {/* Training Preferences */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Training Preferences
              </span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Training Type</label>
                <select
                  name="trainingType"
                  value={formData.trainingType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select training type</option>
                  {trainingTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Preferred Wilaya</label>
                <select
                  name="preferredWilaya"
                  value={formData.preferredWilaya}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select wilaya</option>
                  {wilayas.map((wilaya, index) => (
                    <option key={index} value={wilaya}>{wilaya}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Expected Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Terms and Submit */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-start mb-6">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 mr-3"
              />
              <label htmlFor="terms" className="text-gray-700">
                I agree to the <Link to="/terms" className="text-purple-600 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-purple-600 hover:underline">Privacy Policy</Link>
              </label>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Create Account
            </motion.button>
            
            <p className="text-center mt-6 text-gray-600">
              Already have an account? <Link to="/login" className="text-purple-600 font-medium hover:underline">Login here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 