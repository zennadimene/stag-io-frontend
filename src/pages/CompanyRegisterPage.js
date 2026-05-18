import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function CompanyRegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    phone: "",
    website: "",
    tradeRegister: "",
    activitySector: "",
    companySize: "",
    wilaya: "",
    address: "",
    contactPerson: "",
    position: "",
    personalEmail: "",
    password: "",
    confirmPassword: "",
    description: "",
    logo: null
  });

  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);

 const activitySectors = [
    // 💻 Technology & Digital
    "Information Technology (IT)",
    "Software Development",
    "Artificial Intelligence & Data Science",
    "Cybersecurity",
    "Cloud Computing",
    "E-commerce",
    "Digital Marketing",
    "Telecommunications",
    
    // 🏭 Industry & Manufacturing
    "Manufacturing",
    "Automotive",
    "Electronics",
    "Pharmaceuticals",
    "Food Industry",
    "Textile Industry",
    "Construction & Building Materials",
    
    // 🏦 Finance & Business
    "Financial Services (Banking, Insurance)",
    "Accounting & Auditing",
    "Consulting",
    "Real Estate",
    "Logistics & Transportation",
    
    // 🏥 Healthcare & Education
    "Healthcare & Medical Services",
    "Education & Training",
    "Research & Development",
    
    // 🛍️ Services & Commerce
    "Retail & Wholesale",
    "Hospitality & Tourism",
    "Restaurants & Catering",
    "Events & Entertainment",
    "Advertising & PR",
    
    // 🌍 Energy & Environment
    "Renewable Energy (Solar, Wind)",
    "Oil & Gas",
    "Environmental Services",
    "Water & Waste Management",
    
    // 🎨 Creative & Media
    "Media & Broadcasting",
    "Graphic Design & Multimedia",
    "Publishing",
    
    // 🤝 Other
    "Non-Profit Organization",
    "Government Entity",
    "Startup",
    "Other"
];

  const companySizes = [
    "Small (1-50 employees)",
    "Medium (51-200 employees)",
    "Large (201-500 employees)",
    "Enterprise (500+ employees)"
  ];

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!formData.companyEmail.trim()) {
      newErrors.companyEmail = "Company email is required";
    } else if (!formData.companyEmail.includes("@")) {
      newErrors.companyEmail = "Please enter a valid email";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.tradeRegister.trim()) newErrors.tradeRegister = "Trade register number is required";
    if (!formData.activitySector) newErrors.activitySector = "Activity sector is required";
    if (!formData.wilaya) newErrors.wilaya = "Wilaya is required";
    if (!formData.contactPerson.trim()) newErrors.contactPerson = "Contact person is required";
    if (!formData.position.trim()) newErrors.position = "Position is required";
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
  
  // Prepare data as JSON object (not FormData)
  const companyData = {
    company_name: formData.companyName,
    company_email: formData.companyEmail,
    password: formData.password,
    contact_person: formData.contactPerson,
    phone: formData.phone,
    trade_register: formData.tradeRegister,
    activity_sector: formData.activitySector,
    wilaya: formData.wilaya,
    position: formData.position,
    website: formData.website || "",
    address: formData.address || "",
    company_size: formData.companySize || "",
    personal_email: formData.personalEmail || "",
    description: formData.description || ""
  };
  
  console.log("Sending company data:", companyData); // Debug log
  
  try {
    // Send as JSON, not FormData
    //const response = await axios.post("http://localhost:5000/api/auth/register/company", companyData, {
    const response = await axios.post("http://stag-io-backend.onrender.com/api/auth/register/company", companyData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
      if (response.data.success) {
      // 🔴 حفظ البريد الإلكتروني في localStorage
      localStorage.setItem('pendingCompanyEmail', formData.companyEmail);
      localStorage.setItem('pendingCompanyName', formData.companyName);
      
      toast.success("✅ Company registered successfully! Your account is pending approval.");
      navigate("/company/pending");
    }
  } catch (error) {
    console.error("Registration error:", error);
    
    if (error.response?.data?.message) {
      toast.error("❌ " + error.response.data.message);
    } else if (error.response?.data?.error) {
      toast.error("❌ " + error.response.data.error);
    } else {
      toast.error("❌ Registration failed. Please try again.");
    }
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="pt-24 pb-16 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Company Registration
          </h1>
          <p className="text-gray-600 text-lg">
            Join our platform and find talented candidates for your company
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Company Logo Upload */}
          <div className="mb-12 text-center">
            <div className="inline-block">
              <label className="cursor-pointer">
                <div className="w-40 h-40 mx-auto rounded-full border-4 border-dashed border-gray-300 hover:border-blue-500 transition flex items-center justify-center overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <div className="text-4xl mb-2">🏢</div>
                      <p className="text-gray-500">Click to upload company logo</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-gray-500 text-sm mt-2">Logo is important for professionalism</p>
            </div>
          </div>

          {/* Company Information Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Company Information
              </span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.companyName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Enter company name"
                />
                {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Company Email *</label>
                <input
                  type="email"
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.companyEmail ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="contact@company.com"
                />
                {errors.companyEmail && <p className="text-red-500 text-sm mt-1">{errors.companyEmail}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="+213 XX XX XX XX"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://www.company.com"
                />
              </div>
            </div>
          </div>

          {/* Legal Information Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Legal Information
              </span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Trade Register Number *</label>
                <input
                  type="text"
                  name="tradeRegister"
                  value={formData.tradeRegister}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.tradeRegister ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Trade register number"
                />
                {errors.tradeRegister && <p className="text-red-500 text-sm mt-1">{errors.tradeRegister}</p>}
                <p className="text-gray-500 text-sm mt-1">For official verification</p>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Activity Sector *</label>
                <select
                  name="activitySector"
                  value={formData.activitySector}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.activitySector ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="">Select activity sector</option>
                  {activitySectors.map((sector, index) => (
                    <option key={index} value={sector}>{sector}</option>
                  ))}
                </select>
                {errors.activitySector && <p className="text-red-500 text-sm mt-1">{errors.activitySector}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Company Size</label>
                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select company size</option>
                  {companySizes.map((size, index) => (
                    <option key={index} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Geographical Information */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Geographical Information
              </span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Wilaya *</label>
                <select
                  name="wilaya"
                  value={formData.wilaya}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.wilaya ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="">Select wilaya</option>
                  {wilayas.map((wilaya, index) => (
                    <option key={index} value={wilaya}>{wilaya}</option>
                  ))}
                </select>
                {errors.wilaya && <p className="text-red-500 text-sm mt-1">{errors.wilaya}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Full company address"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Contact Information
              </span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Contact Person *</label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.contactPerson ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Contact person name"
                />
                {errors.contactPerson && <p className="text-red-500 text-sm mt-1">{errors.contactPerson}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Position *</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.position ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="e.g., HR Manager"
                />
                {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Personal Email</label>
                <input
                  type="email"
                  name="personalEmail"
                  value={formData.personalEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="person@company.com"
                />
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
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
                  className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Enter password"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Re-enter password"
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Additional Information
              </span>
            </h2>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Company Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of your company and activities..."
              />
            </div>
          </div>

          {/* ✅✅✅ أضف هذا الكود هنا ✅✅✅ */}
<div className="mt-4">
  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
    <div className="flex items-start gap-3">
      <span className="text-amber-600 text-xl">⏳</span>
      <div>
        <p className="text-amber-800 font-medium text-sm">
          Your account will be reviewed by our team
        </p>
        <p className="text-amber-700 text-sm mt-1"> 
          This process usually takes 24-48 hours.
        </p>
      </div>
    </div>
  </div>
</div>

          {/* Terms and Submit */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-start mb-6">
              <input
                type="checkbox"
                id="companyTerms"
                required
                className="mt-1 mr-3"
              />
              <label htmlFor="companyTerms" className="text-gray-700">
                I agree to the <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </label>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Register Company
            </motion.button>
            
            <p className="text-center mt-6 text-gray-600">
              Already have an account? <Link to="/login" className="text-blue-600 font-medium hover:underline">Login here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}