import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast'; 

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const EditProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    profile_image: null, 
    profile_image_url: '',
    first_name: '',
    last_name: '',
    birth_date: '',
    university: '',
    specialization: '',
    year_of_study: '',
    wilaya: '',
    skills: [],
    soft_skills: [],
    github_url: '',
    portfolio_url: '',
    phone: '',
    bio: '',
    social_security: '',
  academic_supervisor: ''
  });

  const [profileImagePreview, setProfileImagePreview] = useState('');


  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  
  

  // ============================================
// EXPERIENCE STATE - أضف هذا هنا
// ============================================
const [experiences, setExperiences] = useState([]);
const [newExperience, setNewExperience] = useState({
  title: '',
  company: '',
  location: '',
  start_date: '',
  end_date: '',
  current: false,
  description: ''
});
const [showExperienceForm, setShowExperienceForm] = useState(false);
const [editingExperience, setEditingExperience] = useState(null);
const [loadingExperiences, setLoadingExperiences] = useState(false);


  const [availableSkills] = useState([
    'JavaScript', 'React', 'Node.js', 'Python', 'Java',
    'HTML/CSS', 'SQL', 'MongoDB', 'Django', 'Flask',
    'Git', 'Docker', 'AWS', 'PHP', 'C++', 'Vue.js',
    'Angular', 'TypeScript', 'Express.js', 'MySQL',
    'PostgreSQL', 'Firebase', 'React Native', 'Flutter'
  ]);
  
  // الولايات مرتبة أبجدياً
  const [wilayas] = useState([
    'Adrar',
    'Ain Defla',
    'Ain Temouchent',
    'Algiers',
    'Annaba',
    'Batna',
    'Bechar',
    'Bejaia',
    'Biskra',
    'Blida',
    'Bordj Bou Arreridj',
    'Bouira',
    'Boumerdes',
    'Chlef',
    'Constantine',
    'Djelfa',
    'El Bayadh',
    'El Oued',
    'El Tarf',
    'Ghardaia',
    'Guelma',
    'Illizi',
    'Jijel',
    'Khenchela',
    'Laghouat',
    'M\'Sila',
    'Mascara',
    'Medea',
    'Mila',
    'Mostaganem',
    'Naama',
    'Oran',
    'Ouargla',
    'Oum El Bouaghi',
    'Relizane',
    'Saida',
    'Setif',
    'Sidi Bel Abbes',
    'Skikda',
    'Souk Ahras',
    'Tamanrasset',
    'Tebessa',
    'Tiaret',
    'Tindouf',
    'Tipaza',
    'Tissemsilt',
    'Tizi Ouzou',
    'Tlemcen'
  ].sort()); // .sort() يضمن الترتيب الأبجدي

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.user_type !== 'student') {
      navigate('/login');
      return;
    }
    
    fetchProfile();
    fetchExperiences();
  }, [navigate]);


// دالة لعرض التاريخ بصيغة dd/mm/yyyy
const formatDisplayDate = (dateString) => {
  if (!dateString) return '';
  
  // إذا كان التاريخ بصيغة YYYY-MM-DD من الحقل
  if (typeof dateString === 'string' && dateString.includes('-')) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }
  
  // إذا كان التاريخ بصيغة ISO من الـ Backend
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

// دالة لتحويل التاريخ من ISO إلى YYYY-MM-DD (لحقل input)
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


const fetchProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    //const response = await axios.get('http://localhost:5000/api/auth/me', {
    const response = await axios.get(`${BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      const profileData = response.data.profile;

      
 console.log('📥 Profile data from server:', profileData);

      // ✅ تحويل تاريخ الميلاد إلى الصيغة الصحيحة
      const formattedBirthDate = formatDateForInput(profileData.birth_date);
      
      console.log('📅 Formatted birth date for input:', formattedBirthDate);

      // ✅ تأكد من أن soft_skills مصفوفة
      let softSkills = profileData.soft_skills || [];
      if (typeof softSkills === 'string') {
        try {
          softSkills = JSON.parse(softSkills);
        } catch (e) {
          softSkills = softSkills.split(',').map(s => s.trim()).filter(s => s);
        }
      }
      if (!Array.isArray(softSkills)) {
        softSkills = [];
      }
      
      // ✅ تأكد من أن skills مصفوفة
      let skills = profileData.skills || [];
      if (typeof skills === 'string') {
        try {
          skills = JSON.parse(skills);
        } catch (e) {
          skills = skills.split(',').map(s => s.trim()).filter(s => s);
        }
      }
      if (!Array.isArray(skills)) {
        skills = [];
      }


      setProfile({
         profile_image: null,
        profile_image_url: profileData.profile_image_url || '',
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        birth_date: formattedBirthDate, 
        university: profileData.university || '',
        specialization: profileData.specialization || '',
        year_of_study: profileData.year_of_study || '',
        wilaya: profileData.wilaya || '',
        skills: skills,                    // ✅ استخدم skills المحولة
        soft_skills: softSkills,            // ✅ استخدم softSkills المحولة
        github_url: profileData.github_url || '',
        portfolio_url: profileData.portfolio_url || '',
        phone: profileData.phone || '',
        bio: profileData.bio || '',
        social_security: profileData.social_security || '',
        academic_supervisor: profileData.academic_supervisor || ''
      });
      
     
      
      // ✅ مهم: استخدم الرابط الكامل للمعاينة
      if (profileData.profile_image_url) {
        //setProfileImagePreview(`http://localhost:5000${profileData.profile_image_url}?t=${Date.now()}`);
        setProfileImagePreview(`${BASE}${profileData.profile_image_url}?t=${Date.now()}`);
      }
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    toast.error('Error loading profile. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

 

  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // التحقق من نوع الملف
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }
    
    // التحقق من حجم الملف (أقل من 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    setProfile(prev => ({
      ...prev,
      profile_image: file
    }));

    // إنشاء معاينة للصورة
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }
};



  const addSkill = (skill) => {
    if (skill && !profile.skills.includes(skill)) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };


  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (newSkill.trim()) {
        addSkill(newSkill.trim());
      }
    }
  };



  // ✅ Soft Skills handlers - ضعها هنا
const [newSoftSkill, setNewSoftSkill] = useState('');

const addSoftSkill = (skill) => {
  if (skill && !profile.soft_skills.includes(skill)) {
    setProfile(prev => ({
      ...prev,
      soft_skills: [...prev.soft_skills, skill]
    }));
    setNewSoftSkill('');
  }
};

const removeSoftSkill = (skillToRemove) => {
  setProfile(prev => ({
    ...prev,
    soft_skills: prev.soft_skills.filter(skill => skill !== skillToRemove)
  }));
};

const handleSoftSkillKeyPress = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    if (newSoftSkill.trim()) {
      addSoftSkill(newSoftSkill.trim());
    }
  }
};


// ============================================
// EXPERIENCE FUNCTIONS (باستخدام JSON)
// ============================================
const fetchExperiences = async () => {
  try {
    const token = localStorage.getItem('token');
    //const response = await axios.get('http://localhost:5000/api/student/experiences', {
    const response = await axios.get(`${BASE}/api/student/experiences`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      setExperiences(response.data.experiences);
    }
  } catch (error) {
    console.error('Error fetching experiences:', error);
  }
};

const saveExperiences = async (newExperiences) => {
  try {
    const token = localStorage.getItem('token');
    await axios.post(
      //'http://localhost:5000/api/student/experiences',
      `${BASE}/api/student/experiences`,
      { experiences: newExperiences },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setExperiences(newExperiences);
    return true;
  } catch (error) {
    console.error('Error saving experiences:', error);
    toast.error('Error saving experiences');
    return false;
  }
};

const addExperience = async () => {
  if (!newExperience.title || !newExperience.company) {
    toast.error('Please fill in title and company');
    return;
  }
  
  let updatedExperiences = [...experiences];
  const newExp = {
    id: Date.now(),
    title: newExperience.title,
    company: newExperience.company,
    location: newExperience.location,
    start_date: newExperience.start_date,
    end_date: newExperience.end_date,
    is_current: newExperience.current,
    description: newExperience.description
  };
  
  if (editingExperience !== null) {
    // تحديث
    const index = updatedExperiences.findIndex(exp => exp.id === editingExperience);
    if (index !== -1) {
      updatedExperiences[index] = { ...newExp, id: editingExperience };
    }
  } else {
    // إضافة
    updatedExperiences.push(newExp);
  }
  
  const success = await saveExperiences(updatedExperiences);
  
  if (success) {
    setNewExperience({
      title: '',
      company: '',
      location: '',
      start_date: '',
      end_date: '',
      current: false,
      description: ''
    });
    setShowExperienceForm(false);
    setEditingExperience(null);
    toast.success(editingExperience !== null ? 'Experience updated successfully' : 'Experience added successfully');
  }
};

const removeExperience = async (experienceId) => {
  if (!window.confirm('Are you sure you want to delete this experience?')) return;
  
  const updatedExperiences = experiences.filter(exp => exp.id !== experienceId);
  const success = await saveExperiences(updatedExperiences);
  
  if (success) {
    toast.success('Experience removed');
  }
};

const editExperience = (exp) => {
  setNewExperience({
    title: exp.title,
    company: exp.company,
    location: exp.location || '',
    start_date: exp.start_date || '',
    end_date: exp.end_date || '',
    current: exp.is_current === true,
    description: exp.description || ''
  });
  setEditingExperience(exp.id);
  setShowExperienceForm(true);
};

const handleExperienceChange = (e) => {
  const { name, value, type, checked } = e.target;
  setNewExperience(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value
  }));
};

  // ✅ دالة رفع الصورة
  const handleImageUpload = async () => {
    if (!profile.profile_image) return true;
    
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('profile_image', profile.profile_image);
    
    try {
      const response = await axios.post(
        //'http://localhost:5000/api/student/profile/image',
        `${BASE}/api/student/profile/image`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.success) {
        console.log('✅ Image uploaded:', response.data.profile_image_url);
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({
          ...user,
          profile_image_url: response.data.profile_image_url
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Image upload error:', error);
      throw error;
    }
  };

 

const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);
  
  console.log('📤 birth_date قبل الإرسال:', profile.birth_date);

  try {
    const token = localStorage.getItem('token');
    let newImageUrl = profile.profile_image_url; // الاحتفاظ بالرابط القديم
    
    // ============================================
    // 1️⃣ رفع الصورة أولاً (إذا وجدت)
    // ============================================
    if (profile.profile_image) {
      console.log('📤 Uploading image...');
      const imageFormData = new FormData();
      imageFormData.append('profile_image', profile.profile_image);
      
      const imageResponse = await axios.post(
        //'http://localhost:5000/api/student/profile/image',
        `${BASE}/api/student/profile/image`,
        imageFormData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (imageResponse.data.success) {
        newImageUrl = imageResponse.data.profile_image_url; // ✅ الرابط الجديد
        console.log('✅ Image uploaded:', newImageUrl);
        
        // تحديث localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({
          ...user,
          profile_image_url: newImageUrl
        }));
        
        // ✅ تحديث الـ State بالرابط الجديد
        setProfile(prev => ({
          ...prev,
          profile_image_url: newImageUrl,
          profile_image: null // مسح الملف المؤقت
        }));
        
        // ✅ تحديث المعاينة بالرابط الكامل
        //setProfileImagePreview(`http://localhost:5000${newImageUrl}?t=${Date.now()}`);
        setProfileImagePreview(`${BASE}${newImageUrl}?t=${Date.now()}`);
      }
    }
    
   
    
    // ============================================
    // 3️⃣ تحديث البيانات النصية
    // ============================================
    const profileData = {
      first_name: profile.first_name,
      last_name: profile.last_name,
      birth_date: profile.birth_date, 
      university: profile.university,
      specialization: profile.specialization,
      year_of_study: profile.year_of_study,
      wilaya: profile.wilaya,
      phone: profile.phone,
      bio: profile.bio,
      github_url: profile.github_url,
      portfolio_url: profile.portfolio_url,
      skills: profile.skills,
      soft_skills: profile.soft_skills ,
      social_security: profile.social_security,
      academic_supervisor: profile.academic_supervisor
      // ✅ لا نرسل profile_image_url هنا - يتم رفعه منفصلاً
    };
    
    console.log('📤 Updating profile data:', profileData);
    
    const response = await axios.put(
      //'http://localhost:5000/api/student/profile',
      `${BASE}/api/student/profile`,
      profileData,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data.success) {
      // تحديث localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...user,
        first_name: profile.first_name,
        last_name: profile.last_name
      }));
      
      toast.success('Profile updated successfully!');
      navigate('/student/dashboard');
    }
    
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    toast.error(error.response?.data?.message || 'Error updating profile. Please try again.');
  } finally {
    setSaving(false);
  }
};

 



const handleDeleteProfileImage = async () => {
  console.log('🖱️ DELETE FUNCTION CALLED');
  
  if (!window.confirm('Are you sure you want to delete your profile picture?')) {
    console.log('❌ User cancelled');
    return;
  }
  
  console.log('✅ User confirmed, sending DELETE request...');
  
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.delete(
      //'http://localhost:5000/api/student/profile/image',
      `${BASE}/api/student/profile/image`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    console.log('📥 Response:', response.data);
    
    if (response.data.success) {
      // مسح المعاينة
      setProfileImagePreview('');
      
      // مسح الحالة
      setProfile(prev => ({ 
        ...prev, 
        profile_image: null, 
        profile_image_url: '' 
      }));
      
      // تحديث localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...user,
        profile_image_url: ''
      }));
      
      toast.success('Profile picture deleted successfully');
      
      // إعادة تحميل الصفحة بعد ثانية
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      toast.error(response.data.message || 'Failed to delete');
    }
    
  } catch (error) {
    console.error('❌ Error deleting profile picture:', error);
    console.error('Error response:', error.response?.data);
    
    if (error.response?.status === 404) {
      toast.error('API endpoint not found. Please check server.');
    } else if (error.response?.status === 401) {
      toast.error('Session expired. Please login again.');
    } else {
      toast.error(error.response?.data?.message || 'Error deleting profile picture');
    }
  }
};




  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Update Your Profile</h1>
          <p className="text-gray-600 mt-2">Complete your digital CV and personal information</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <form onSubmit={handleSubmit}>
            {/* Personal Information Section */}
            <div className="p-8 border-b">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
              

               {/* Profile Image Upload - أضف هذا القسم */}
  <div className="mb-8">
    <label className="block text-sm font-medium text-gray-700 mb-4">
      Profile Picture
    </label>
    <div className="flex items-center gap-8">
      {/* Image Preview */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
          {profileImagePreview ? (
            <img 
              src={profileImagePreview} 
              alt="Profile Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Upload Button - صغير على الصورة */}
        <label 
          htmlFor="profile-image"
          className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 cursor-pointer transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </label>
        <input
          id="profile-image"
          type="file"
          onChange={handleImageChange}
          className="hidden"
          accept="image/*"
        />
      </div>
      
      {/* Upload Info */}
      <div className="flex-1">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition">
          <label 
            htmlFor="profile-image-2"
            className="cursor-pointer block"
          >
            <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-gray-600">
              {profile.profile_image ? profile.profile_image.name : 'Click to upload profile picture'}
            </span>
            <span className="text-xs text-gray-500 block mt-1">
              JPG, PNG, GIF • Max 2MB
            </span>
          </label>
          <input
            id="profile-image-2"
            type="file"
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
        </div>
        
        {profileImagePreview && (
  <button
    type="button"
    onClick={handleDeleteProfileImage}  // ✅ استخدم الدالة التي تتصل بالخادم
    className="mt-2 text-sm text-red-600 hover:text-red-800"
  >
    Remove Image
  </button>
)}
      </div>
    </div>
  </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={profile.first_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={profile.last_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                    placeholder="Enter your last name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="05 xx xx xx xx"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wilaya *
                  </label>
                  <select
                    name="wilaya"
                    value={profile.wilaya}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  >
                    <option value="">Select your Wilaya</option>
                    {wilayas.map(wilaya => (
                      <option key={wilaya} value={wilaya}>{wilaya}</option>
                    ))}
                  </select>
                </div>
             

           {/* ✅ Date of Birth - الآن مثل Skills Section */}
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Date of Birth
      </label>

      <div className="flex gap-2">
        <input
          type="date"
          name="birth_date"
          value={profile.birth_date}
          onChange={handleChange}
          placeholder="dd/mm/yyyy"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
        <button
          type="button"
          onClick={() => document.querySelector('input[name="birth_date"]').showPicker?.()}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Calendar</span>
        </button>
      </div>
    </div>
  </div>
</div>
  


            {/* Academic Information Section */}
<div className="p-8 border-b">
  <h2 className="text-2xl font-bold text-gray-900 mb-6">Academic Information</h2>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* University */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        University *
      </label>
      <input
        type="text"
        name="university"
        value={profile.university}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        required
        placeholder="University of ..."
      />
    </div>

    {/* Specialization */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Specialization *
      </label>
      <input
        type="text"
        name="specialization"
        value={profile.specialization}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        required
        placeholder="Computer Science, Engineering, etc."
      />
    </div>

    {/* Year of Study */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Year of Study *
      </label>
      <select
        name="year_of_study"
        value={profile.year_of_study}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        required
      >
        <option value="">Select Year</option>
        <option value="1">First Year</option>
        <option value="2">Second Year</option>
        <option value="3">Third Year</option>
        <option value="4">Fourth Year</option>
        <option value="5">Fifth Year</option>
        <option value="graduate">Graduate</option>
      </select>
    </div>

    {/* ✅ Social Security Number */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Social Security Number
      </label>
      <input
        type="text"
        name="social_security"
        value={profile.social_security}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="Enter your social security number"
      />
      <p className="text-xs text-gray-500 mt-1">Format: 123456789012345 (15 digits)</p>
    </div>

    {/* ✅ Academic Supervisor */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Academic Supervisor
      </label>
      <input
        type="text"
        name="academic_supervisor"
        value={profile.academic_supervisor}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="e.g., Dr. Ahmed Benali"
      />
    </div>
  </div>  {/* ✅ هذا القوس يغلق grid */}

  
  {/* Bio Section */}
  <div className="mt-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Bio / About Me
    </label>
    <textarea
      name="bio"
      value={profile.bio}
      onChange={handleChange}
      rows="4"
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      placeholder="Tell us about yourself, your interests, career goals..."
      maxLength="500"
    />
    <div className="text-right text-sm text-gray-500 mt-1">
      {profile.bio?.length || 0}/500 characters
    </div>
  </div>
</div>  {/* ✅ هذا القوس يغلق Academic Information Section */}

            {/* Technical Skills Section */}
            <div className="p-8 border-b">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Skills</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Add your skills (Select from popular or type your own)
                </label>
                
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={handleSkillKeyPress}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Type a skill and press Enter"
                  />
                  <button
                    type="button"
                    onClick={() => newSkill.trim() && addSkill(newSkill.trim())}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                  >
                    Add Skill
                  </button>
                </div>

                {/* Popular Skills */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3">Popular skills (click to add):</p>
                  <div className="flex flex-wrap gap-2">
                    {availableSkills.sort().map(skill => ( // مرتبة أبجدياً أيضاً
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addSkill(skill)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm transition"
                      >
                        {skill} +
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Skills */}
                <div>
                  <p className="text-sm text-gray-600 mb-3">Your skills ({profile.skills.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.sort().map((skill, index) => ( // مرتبة أبجدياً
                      <div
                        key={index}
                        className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {profile.skills.length === 0 && (
                      <p className="text-gray-500 italic">No skills added yet. Add some skills to improve your profile!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>


            {/* Soft Skills Section */}
<div className="p-8 border-b">
  <h2 className="text-2xl font-bold text-gray-900 mb-6">Soft Skills</h2>
  
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-3">
      Add your soft skills (Communication, Teamwork, Leadership, etc.)
    </label>
    
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        value={newSoftSkill}
        onChange={(e) => setNewSoftSkill(e.target.value)}
        onKeyPress={handleSoftSkillKeyPress}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        placeholder="Type a soft skill and press Enter"
      />
      <button
        type="button"
        onClick={() => newSoftSkill.trim() && addSoftSkill(newSoftSkill.trim())}
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
      >
        Add Skill
      </button>
    </div>

    {/* Selected Soft Skills */}
    <div>
      <p className="text-sm text-gray-600 mb-3">Your soft skills ({profile.soft_skills.length}):</p>
      <div className="flex flex-wrap gap-2">
        {profile.soft_skills.sort().map((skill, index) => (
          <div
            key={index}
            className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSoftSkill(skill)}
              className="text-green-600 hover:text-green-800"
            >
              ✕
            </button>
          </div>
        ))}
        {profile.soft_skills.length === 0 && (
          <p className="text-gray-500 italic">No soft skills added yet.</p>
        )}
      </div>
    </div>
  </div>
</div>  {/* ✅ هذا القوس يغلق Soft Skills Section */}

{/* ✅ Experience Section - مستقلة */}
<div className="p-8 border-b">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-gray-900">Professional Experience</h2>
    <button
      type="button"
      onClick={() => {
        setShowExperienceForm(true);
        setEditingExperience(null);
        setNewExperience({
          title: '',
          company: '',
          location: '',
          start_date: '',
          end_date: '',
          current: false,
          description: ''
        });
      }}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      Add Experience
    </button>
  </div>

  {/* Experience Form Modal */}
  {showExperienceForm && (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {editingExperience !== null ? 'Edit Experience' : 'Add New Experience'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setShowExperienceForm(false);
                setEditingExperience(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
              <input
                type="text"
                name="title"
                value={newExperience.title}
                onChange={handleExperienceChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Frontend Developer Intern"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
              <input
                type="text"
                name="company"
                value={newExperience.company}
                onChange={handleExperienceChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Google, Microsoft, Startup Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={newExperience.location}
                onChange={handleExperienceChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Algiers, Remote"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="month"
                  name="start_date"
                  value={newExperience.start_date}
                  onChange={handleExperienceChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="month"
                  name="end_date"
                  value={newExperience.end_date}
                  onChange={handleExperienceChange}
                  disabled={newExperience.current}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="current"
                checked={newExperience.current}
                onChange={handleExperienceChange}
                id="current"
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="current" className="text-sm text-gray-700">
                I currently work here
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={newExperience.description}
                onChange={handleExperienceChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your responsibilities and achievements..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={addExperience}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                {editingExperience !== null ? 'Update Experience' : 'Add Experience'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExperienceForm(false);
                  setEditingExperience(null);
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}

  {/* Experience List */}
  {experiences.length > 0 ? (
    <div className="space-y-4">
      {experiences.map((exp) => (
        <div key={exp.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-lg">{exp.title}</h4>
              <p className="text-gray-700 font-medium">{exp.company}</p>
              {exp.location && (
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {exp.location}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                {exp.start_date ? new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''} - 
                {exp.is_current ? ' Present' : (exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '')}
              </p>
              {exp.description && (
                <p className="text-gray-600 text-sm mt-2">{exp.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => editExperience(exp)}
                className="text-blue-600 hover:text-blue-800 p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => removeExperience(exp.id)}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <p className="text-gray-500">No experience added yet</p>
      <p className="text-sm text-gray-400 mt-1">Click "Add Experience" to share your professional journey</p>
    </div>
  )}
</div>

            {/* External Links Section */}
            <div className="p-8 border-b">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">External Links</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub Profile
                    </div>
                  </label>
                  <input
                    type="url"
                    name="github_url"
                    value={profile.github_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="https://github.com/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      LinkedIn Profile
                    </div>
                  </label>
                  <input
                    type="url"
                    name="portfolio_url"
                    value={profile.portfolio_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="p-8 bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  <p>Your profile is visible to companies when you apply for internships.</p>
                  <p>Keep it updated for better opportunities!</p>
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => navigate('/student/dashboard')}
                    className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </span>
                    ) : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-3">Tips for a great profile:</h3>
          <ul className="text-blue-800 text-sm space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">✓</span>
              <span>Add specific technical skills relevant to your field</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">✓</span>
              <span>Link your GitHub and portfolio to showcase your projects</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">✓</span>
              <span>Write a concise bio highlighting your interests and goals</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;