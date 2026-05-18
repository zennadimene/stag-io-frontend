import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
const StudentProfile = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.user_type !== 'company') {
      navigate('/login');
      return;
    }
    
    fetchStudentProfile();
  }, [studentId, navigate]);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `http://stag-io-backend.onrender.com/api/company/student/${studentId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setStudent(response.data.student);
        setApplications(response.data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching student profile:', error);
      toast.error('Error loading student profile');
    } finally {
      setLoading(false);
    }
  };

  const handleContactStudent = () => {
    window.location.href = `mailto:${student.email}?subject=Internship Application&body=Dear ${student.first_name},%0D%0A%0D%0AI am contacting you regarding your internship application...`;
  };



  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'reviewed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'interview': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'accepted': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'rejected': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return '⏳';
      case 'reviewed': return '📋';
      case 'interview': return '🎯';
      case 'accepted': return '✅';
      case 'rejected': return '❌';
      default: return '📌';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 bg-white rounded-full"></div>
            </div>
          </div>
          <p className="mt-6 text-xl font-medium text-gray-700">Loading student profile...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the details</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white p-12 rounded-3xl shadow-2xl max-w-md"
        >
          <div className="text-7xl mb-6 animate-bounce">👤</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Student Not Found</h2>
          <p className="text-gray-500 mb-8">The student profile you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            ← Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => navigate(-1)}
          className="group flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition-all duration-300 font-medium bg-white px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md"
        >
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Applications
        </motion.button>

        {/* Main Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20"
        >
          {/* Cover Photo with Gradient */}
          <div className="relative h-64 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            {student.cover_image_url && (
              <img 
                src={`http://stag-io-backend.onrender.com${student.cover_image_url}`}
                alt="Cover"
                className="w-full h-full object-cover opacity-60"
              />
            )}
            
            {/* Decorative Elements */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          {/* Profile Header - Overlapping */}
          <div className="relative px-8 pb-8">
            {/* Profile Image */}
            <div className="flex flex-col md:flex-row md:items-end -mt-24 mb-8">
              <div className="relative group mb-6 md:mb-0 md:mr-8">
                <div className="w-36 h-36 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-white transform transition-transform group-hover:scale-105 duration-300">
                  {student.profile_image_url ? (
                    <img 
                      src={`http://stag-io-backend.onrender.com${student.profile_image_url}`}
                      alt={`${student.first_name} ${student.last_name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                      <svg className="w-16 h-16 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white"></div>
              </div>

              {/* Student Name and Basic Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      {student.first_name} {student.last_name}
                    </h1>
                    <div className="flex items-center gap-3 text-gray-600 mb-4">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-lg">{student.email}</span>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="flex gap-4 mt-4 md:mt-0">
                    <div className="bg-indigo-50 rounded-xl px-5 py-3 text-center">
                      <div className="text-2xl font-bold text-indigo-600">{applications.length}</div>
                      <div className="text-xs text-gray-600">Applications</div>
                    </div>
                  </div>
                </div>

                {/* Info Chips */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-xl border border-indigo-100">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-gray-700 font-medium">{student.university || 'University not specified'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-xl border border-purple-100">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="text-gray-700 font-medium">
                      {student.specialization || 'Specialization not specified'} • Year {student.year_of_study || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2 rounded-xl border border-emerald-100">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700 font-medium">{student.wilaya || 'Location not specified'}</span>
                  </div>
                </div>

                {/* ========== ✅ أضف Student Details هنا ========== */}
<div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
  <h3 className="text-md font-semibold text-gray-900 mb-3">Additional Information</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="text-sm text-gray-500">Social Security Number</label>
      <p className="font-medium text-gray-900">{student.social_security || 'Not provided'}</p>
    </div>
    <div>
      <label className="text-sm text-gray-500">Academic Supervisor</label>
      <p className="font-medium text-gray-900">{student.academic_supervisor || 'Not assigned'}</p>
    </div>
  </div>
</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-3 font-medium text-sm transition-all relative ${
                  activeTab === 'profile'
                    ? 'text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile Overview
                {activeTab === 'profile' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`px-6 py-3 font-medium text-sm transition-all relative ${
                  activeTab === 'applications'
                    ? 'text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Applications ({applications.length})
                {activeTab === 'applications' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                  />
                )}
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'profile' ? (
              <>
                {/* Action Buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-4 mb-10"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleContactStudent}
                    className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-medium shadow-md"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Student
                  </motion.button>

                  {student.phone && (
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={`tel:${student.phone}`}
                      className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-medium shadow-md"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call Student
                    </motion.a>
                  )}

                  
                </motion.div>

                {/* Bio Section */}
                {student.bio && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-10 p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100"
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      About Me
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg">{student.bio}</p>
                  </motion.div>
                )}

                {/* Skills Section */}
                {student.skills && student.skills.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-10"
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Skills & Technologies
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {student.skills.map((skill, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all hover:scale-105"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ✅ Professional Experience Section - أضف هذا ✅ */}
{student.experiences && student.experiences.length > 0 && (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.25 }}
    className="mb-10"
  >
    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      Professional Experience
    </h2>
    <div className="space-y-4">
      {student.experiences.map((exp, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">{exp.title}</h3>
              <p className="text-gray-700 font-medium mt-1">{exp.company}</p>
              {exp.location && (
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {exp.location}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                📅 {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
              </p>
              {exp.description && (
                <p className="text-gray-600 text-sm mt-3 leading-relaxed">{exp.description}</p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
)}

                {/* Contact & Social Links */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                >
                  {/* Contact Info */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-gray-700 bg-white/50 p-3 rounded-xl">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <a href={`mailto:${student.email}`} className="text-indigo-600 hover:underline font-medium">
                          {student.email}
                        </a>
                      </div>
                      {student.phone && (
                        <div className="flex items-center gap-3 text-gray-700 bg-white/50 p-3 rounded-xl">
                          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <a href={`tel:${student.phone}`} className="text-gray-700 hover:text-indigo-600 font-medium">
                            {student.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Online Profiles
                    </h3>
                    <div className="space-y-4">
                      {student.github_url && (
                        <div className="flex items-center gap-3 bg-white/50 p-3 rounded-xl">
                          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          <a href={student.github_url} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-medium">
                            GitHub Profile
                          </a>
                        </div>
                      )}
                      {student.portfolio_url && (
                        <div className="flex items-center gap-3 bg-white/50 p-3 rounded-xl">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                          <a href={student.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-medium">
                            Portfolio Website
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </>
            ) : (
              /* Applications Tab */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {applications.length > 0 ? (
                  applications.map((app, index) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg mb-2">{app.internship_title}</h3>
                          <p className="text-sm text-gray-500 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Applied: {new Date(app.applied_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            <span className="font-medium">Company:</span> {app.company_name || 'N/A'}
                          </p>
                        </div>
                        <div className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 ${getStatusColor(app.status)}`}>
                          <span>{getStatusIcon(app.status)}</span>
                          <span className="capitalize">{app.status}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-16 bg-gradient-to-r from-gray-50 to-white rounded-2xl">
                    <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-xl text-gray-600">No applications found for this student</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentProfile;