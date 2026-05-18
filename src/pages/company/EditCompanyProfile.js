import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  FileText, 
  Briefcase, 
  Users, 
  Calendar,
  Save,
  X,
  Upload,
  Image,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  Github
} from 'lucide-react';

const EditCompanyProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    company_name: '',
    company_email: '',
    phone: '',
    website: '',
    trade_register: '',
    activity_sector: '',
    company_size: '',
    wilaya: '',
    address: '',
    contact_person: '',
    position: '',
    personal_email: '',
    description: '',
    founded_year: '',
    tax_id: '',
    logo_url: '',
    cover_image_url: '',
    social_media: {
      linkedin: '',
      facebook: '',
      twitter: '',
      instagram: '',
      github: ''
    }
  });

  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  // قائمة الولايات
  const wilayas = [
    'Adrar', 'Aïn Defla', 'Aïn Témouchent', 'Algiers', 'Annaba',
    'Batna', 'Béchar', 'Béjaïa', 'Biskra', 'Blida',
    'Bordj Bou Arréridj', 'Bouira', 'Boumerdès', 'Chlef', 'Constantine',
    'Djelfa', 'El Bayadh', 'El Oued', 'El Tarf', 'Ghardaïa',
    'Guelma', 'Illizi', 'Jijel', 'Khenchela', 'Laghouat',
    'M\'Sila', 'Mascara', 'Médéa', 'Mila', 'Mostaganem',
    'Naâma', 'Oran', 'Ouargla', 'Oum El Bouaghi', 'Relizane',
    'Saïda', 'Sétif', 'Sidi Bel Abbès', 'Skikda', 'Souk Ahras',
    'Tamanrasset', 'Tébessa', 'Tiaret', 'Tindouf', 'Tipaza',
    'Tissemsilt', 'Tizi Ouzou', 'Tlemcen'
  ];

  const companySizes = [
    '1-10 employees', '11-50 employees', '51-200 employees',
    '201-500 employees', '501-1000 employees', '1000+ employees'
  ];

  const activitySectors = [
    'Aerospace', 'Agriculture', 'Automotive', 'Banking & Finance',
    'Consulting', 'Construction', 'E-commerce', 'Education & Training',
    'Energy & Utilities', 'Entertainment', 'Healthcare',
    'Hospitality & Tourism', 'Information Technology', 'Insurance',
    'Legal Services', 'Logistics & Transportation', 'Manufacturing',
    'Marketing & Advertising', 'Media & Communications', 'Mining & Metals',
    'Nonprofit', 'Oil & Gas', 'Pharmaceutical', 'Real Estate',
    'Retail', 'Software Development', 'Telecommunications', 'Wholesale Trade'
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.user_type !== 'company') {
      navigate('/login');
      return;
    }
    
    fetchCompanyProfile();
  }, [navigate]);

  const fetchCompanyProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/company/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const profileData = response.data.profile;
        setProfile(profileData);
        
        let socialMedia = {
          linkedin: '',
          facebook: '',
          twitter: '',
          instagram: '',
          github: ''
        };
        
        if (profileData.social_media) {
          try {
            socialMedia = {
              ...socialMedia,
              ...(typeof profileData.social_media === 'string' 
                ? JSON.parse(profileData.social_media) 
                : profileData.social_media)
            };
          } catch (e) {
            console.error('Error parsing social media:', e);
          }
        }
        
        setFormData({
          company_name: profileData.company_name || '',
          company_email: profileData.company_email || '',
          phone: profileData.phone || '',
          website: profileData.website || '',
          trade_register: profileData.trade_register || '',
          activity_sector: profileData.activity_sector || '',
          company_size: profileData.company_size || '',
          wilaya: profileData.wilaya || '',
          address: profileData.address || '',
          contact_person: profileData.contact_person || '',
          position: profileData.position || '',
          personal_email: profileData.personal_email || '',
          description: profileData.description || '',
          founded_year: profileData.founded_year || '',
          tax_id: profileData.tax_id || '',
          logo_url: profileData.logo_url || '',
          cover_image_url: profileData.cover_image_url || '',
          social_media: socialMedia
        });

        if (profileData.logo_url) {
          setLogoPreview(`http://localhost:5000${profileData.logo_url}`);
        }
        if (profileData.cover_image_url) {
          setCoverPreview(`http://localhost:5000${profileData.cover_image_url}`);
        }
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
      toast.error('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      social_media: {
        ...prev.social_media,
        [platform]: value
      }
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      setLogoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Cover image size should be less than 5MB');
        return;
      }
      setCoverFile(file);
      const previewUrl = URL.createObjectURL(file);
      setCoverPreview(previewUrl);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setFormData(prev => ({ ...prev, logo_url: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    setFormData(prev => ({ ...prev, cover_image_url: '' }));
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.company_name?.trim()) {
      errors.company_name = 'Company name is required';
    }

    if (!formData.company_email?.trim()) {
      errors.company_email = 'Company email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.company_email)) {
      errors.company_email = 'Email is invalid';
    }

    if (!formData.trade_register?.trim()) {
      errors.trade_register = 'Trade register number is required';
    }

    if (!formData.contact_person?.trim()) {
      errors.contact_person = 'Contact person is required';
    }

    if (!formData.wilaya) {
      errors.wilaya = 'Wilaya is required';
    }

    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
      errors.website = 'Please enter a valid URL (include http:// or https://)';
    }

    if (formData.founded_year) {
      const year = parseInt(formData.founded_year);
      const currentYear = new Date().getFullYear();
      if (year < 1800 || year > currentYear) {
        errors.founded_year = `Year must be between 1800 and ${currentYear}`;
      }
    }

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach(error => {
        toast.error(error);
      });
      return false;
    }

    return true;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  setSaving(true);

  try {
    const token = localStorage.getItem('token');
    
    const formDataToSend = new FormData();
    
    // إضافة جميع الحقول النصية
    Object.keys(formData).forEach(key => {
      if (key === 'social_media') {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else if (key !== 'logo_url' && key !== 'cover_image_url') {
        formDataToSend.append(key, formData[key] || '');
      }
    });

    // ✅ معالجة رفع الصور الجديدة
    if (logoFile) {
      formDataToSend.append('logo', logoFile);
    }
    if (coverFile) {
      formDataToSend.append('cover_image', coverFile);
    }

    // ✅ ✅ ✅ أضف هذا الجزء الجديد لحذف الصور ✅ ✅ ✅
    // إذا تم حذف اللوجو (لا يوجد ملف جديد ولا معاينة)
    if (!logoFile && !logoPreview) {
      formDataToSend.append('logo_url', '');  // إرسال قيمة فارغة للحذف
    }
    
    // إذا تم حذف صورة الغلاف
    if (!coverFile && !coverPreview) {
      formDataToSend.append('cover_image_url', '');  // إرسال قيمة فارغة للحذف
    }

    const response = await axios.put(
      'http://localhost:5000/api/company/profile',
      formDataToSend,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    if (response.data.success) {
      toast.success('Company profile updated successfully!');
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...user,
        company_name: formData.company_name,
        email: formData.company_email
      }));

      setLogoFile(null);
      setCoverFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (coverInputRef.current) coverInputRef.current.value = '';

      setTimeout(() => {
        navigate('/company/dashboard');
      }, 2000);
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    toast.error(error.response?.data?.message || 'Error updating profile. Please try again.');
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-lg text-gray-600">Loading company profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Building2 className="text-blue-600" size={28} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Edit Company Profile</h1>
                  <p className="text-gray-600 mt-1">Update your company information and branding</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/company/dashboard')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* العمود الأيمن - الصور والشعار */}
              <div className="lg:col-span-1 space-y-8">
                {/* Company Logo */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Logo</h3>
                  <div className="flex flex-col items-center">
                    <div className="w-40 h-40 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden mb-4">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <Building2 className="text-gray-400" size={48} />
                      )}
                    </div>
                    <div className="flex gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        <Upload size={16} />
                        Upload
                      </button>
                      {logoPreview && (
                        <button
                          type="button"
                          onClick={removeLogo}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-2">Recommended: 200x200px, PNG or JPG</p>
                  </div>
                </div>

                {/* Cover Image */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cover Image</h3>
                  <div className="flex flex-col items-center">
                    <div className="w-full h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden mb-4">
                      {coverPreview ? (
                        <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                      ) : (
                        <Image className="text-gray-400" size={32} />
                      )}
                    </div>
                    <div className="flex gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        <Upload size={16} />
                        Upload
                      </button>
                      {coverPreview && (
                        <button
                          type="button"
                          onClick={removeCover}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-2">Recommended: 1200x300px</p>
                  </div>
                </div>
              </div>

              {/* العمود الأيسر - المعلومات */}
              <div className="lg:col-span-2 space-y-8">
                {/* Basic Information */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Building2 size={20} className="text-blue-600" />
                    Basic Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Company Name - ✅ تم إزالة errors */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., TechCorp Algeria"
                      />
                    </div>

                    {/* Company Email - ✅ تم إزالة errors */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="email"
                          name="company_email"
                          value={formData.company_email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="contact@company.com"
                        />
                      </div>
                    </div>

                    {/* Phone - ✅ تم إزالة errors */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="+213 XXX XX XX XX"
                        />
                      </div>
                    </div>

                    {/* Website - ✅ تم إزالة errors */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="https://www.company.com"
                        />
                      </div>
                    </div>

                    {/* Trade Register - ✅ تم إزالة errors */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trade Register <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="trade_register"
                          value={formData.trade_register}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="RC 00/00-0000000"
                        />
                      </div>
                    </div>

                    {/* Tax ID - ✅ تم إزالة errors */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax ID / NIF
                      </label>
                      <input
                        type="text"
                        name="tax_id"
                        value={formData.tax_id}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="000000000000000"
                      />
                    </div>

                    {/* Founded Year - ✅ تم إزالة errors */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Founded Year
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="number"
                          name="founded_year"
                          value={formData.founded_year}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="2020"
                          min="1800"
                          max={new Date().getFullYear()}
                        />
                      </div>
                    </div>

                    {/* Activity Sector */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Activity Sector
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <select
                          name="activity_sector"
                          value={formData.activity_sector}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                        >
                          <option value="">Select sector</option>
                          {activitySectors.map(sector => (
                            <option key={sector} value={sector}>{sector}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Company Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Size
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <select
                          name="company_size"
                          value={formData.company_size}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                        >
                          <option value="">Select size</option>
                          {companySizes.map(size => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <MapPin size={20} className="text-blue-600" />
                    Location
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Wilaya - ✅ تم إزالة errors */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Wilaya <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="wilaya"
                        value={formData.wilaya}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                      >
                        <option value="">Select wilaya</option>
                        {wilayas.map(wilaya => (
                          <option key={wilaya} value={wilaya}>{wilaya}</option>
                        ))}
                      </select>
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="123 Street, City, Algeria"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Person */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Users size={20} className="text-blue-600" />
                    Contact Person
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Person Name - ✅ تم إزالة errors */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="contact_person"
                        value={formData.contact_person}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Position */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="HR Manager"
                      />
                    </div>

                    {/* Personal Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Personal Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="email"
                          name="personal_email"
                          value={formData.personal_email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="hr@company.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Description */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FileText size={20} className="text-blue-600" />
                    Company Description
                  </h2>
                  
                  <div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="6"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us about your company, mission, values, and what you're looking for in interns..."
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {formData.description?.length || 0}/1000 characters
                    </p>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Globe size={20} className="text-blue-600" />
                    Social Media
                  </h2>
                  
                  <div className="space-y-4">
                    {/* LinkedIn */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Linkedin className="text-blue-600" size={20} />
                      </div>
                      <input
                        type="url"
                        value={formData.social_media.linkedin}
                        onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://linkedin.com/company/yourcompany"
                      />
                    </div>

                    {/* Facebook */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Facebook className="text-blue-600" size={20} />
                      </div>
                      <input
                        type="url"
                        value={formData.social_media.facebook}
                        onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://facebook.com/yourcompany"
                      />
                    </div>

                    {/* Twitter */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Twitter className="text-blue-600" size={20} />
                      </div>
                      <input
                        type="url"
                        value={formData.social_media.twitter}
                        onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://twitter.com/yourcompany"
                      />
                    </div>

                    {/* Instagram */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Instagram className="text-blue-600" size={20} />
                      </div>
                      <input
                        type="url"
                        value={formData.social_media.instagram}
                        onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://instagram.com/yourcompany"
                      />
                    </div>

                    {/* GitHub */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Github className="text-gray-600" size={20} />
                      </div>
                      <input
                        type="url"
                        value={formData.social_media.github}
                        onChange={(e) => handleSocialMediaChange('github', e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://github.com/yourcompany"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => navigate('/company/dashboard')}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 font-medium transition disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditCompanyProfile;