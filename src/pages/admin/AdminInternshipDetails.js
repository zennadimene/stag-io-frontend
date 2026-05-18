// src/pages/admin/AdminInternshipDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const AdminInternshipDetails = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchApplicationDetails();
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://stag-io-backend.onrender.com/api/admin/internships/${applicationId}/details`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setApplication(response.data.application);
      }
    } catch (error) {
      console.error('Error fetching details:', error);
      toast.error('❌ Failed to load internship details');
    } finally {
      setLoading(false);
    }
  };

const handleValidate = async () => {
    if (!window.confirm('Are you sure you want to validate this internship?')) return;
    
    setProcessing(true);
    try {
        const token = localStorage.getItem('token');
        
        // 1. مصادقة التدريب
        const response = await axios.put(
            `http://stag-io-backend.onrender.com/api/admin/applications/${applicationId}/validate`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data.success) {
            toast.success('✅ Internship validated successfully!');
            
            // 2. إنشاء الاتفاقية
            try {
                const agreementResponse = await axios.post(
                    `http://stag-io-backend.onrender.com/api/admin/agreements/generate-from-validation`,
                    { applicationId: applicationId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                if (agreementResponse.data.success) {
                    toast.success('✅ Agreement generated automatically!');
                }
            } catch (agreementError) {
                console.error('Error generating agreement:', agreementError);
            }
            
            // ✅ 3. تحديث الصفحة بعد العودة (حل بسيط)
            setTimeout(() => {
                navigate('/admin/dashboard');
                // تحديث الصفحة لإعادة تحميل الإشعارات
                setTimeout(() => window.location.reload(), 100);
            }, 2500);
        }
    } catch (error) {
        console.error('Error validating:', error);
        toast.error('❌ Error validating internship');
    } finally {
        setProcessing(false);
    }
};

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('❌ Please provide a rejection reason');
      return;
    }
    
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://stag-io-backend.onrender.com/api/admin/applications/${applicationId}/reject`,
        { reason: rejectReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success('❌ Internship rejected');
        setShowRejectModal(false);
        setTimeout(() => navigate('/admin/dashboard'), 2000);
      }
    } catch (error) {
      console.error('Error rejecting:', error);
      toast.error('❌ Error rejecting internship');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading internship details...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <svg className="w-20 h-20 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Internship Not Found</h2>
          <p className="text-gray-600 mb-6">The internship you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          
          <div className="flex gap-4">
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={processing}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject
            </button>
            
            <button
              onClick={handleValidate}
              disabled={processing}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Validate Internship
            </button>
          </div>
        </div>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student Info Column */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 sticky top-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Student Information
              </h2>
              
              <div className="space-y-6">
                {/* Profile Image */}
                <div className="flex justify-center">
                  {application.profile_image_url ? (
                    <img 
                      src={`http://stag-io-backend.onrender.com${application.profile_image_url}`}
                      alt={`${application.first_name} ${application.last_name}`}
                      className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border-4 border-indigo-100">
                      <span className="text-4xl font-bold text-indigo-600">
                        {application.first_name?.charAt(0)}{application.last_name?.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Student Details */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {application.first_name} {application.last_name}
                  </h3>
                  <p className="text-gray-600 mt-1">{application.student_email}</p>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div>
                    <label className="text-sm text-gray-500">University</label>
                    <p className="font-medium text-gray-900">{application.university || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Specialization</label>
                    <p className="font-medium text-gray-900">{application.specialization || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Year of Study</label>
                    <p className="font-medium text-gray-900">{application.year_of_study || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <p className="font-medium text-gray-900">{application.student_phone || 'Not specified'}</p>
                  </div>
                  {/* ✅ أضف هذين الحقلين هنا */}
  <div>
    <label className="text-sm text-gray-500">Social Security Number</label>
    <p className="font-medium font-mono text-gray-900">
      {application.social_security || 'Not provided'}
    </p>
  </div>
  <div>
    <label className="text-sm text-gray-500">Academic Supervisor</label>
    <p className="font-medium text-gray-900">
      {application.academic_supervisor || 'Not assigned'}
    </p>
  </div>
</div>
                

                {/* Skills */}
                {application.skills && application.skills.length > 0 && (
                  <div className="border-t pt-4">
                    <label className="text-sm text-gray-500 mb-2 block">Skills</label>
                    <div className="flex flex-wrap gap-2">
                      {application.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                {(application.github_link || application.linkedin_link) && (
                  <div className="border-t pt-4 flex justify-center gap-4">
                    {application.github_link && (
                      <a 
                        href={application.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-indigo-600"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                      </a>
                    )}
                    {application.linkedin_link && (
                      <a 
                        href={application.linkedin_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-indigo-600"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                )}

                
              </div>
            </motion.div>
          </div>

          {/* Main Details Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Internship Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Internship Details
              </h2>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500">Internship Title</label>
                  <p className="font-medium text-gray-900 text-lg">{application.internship_title}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Type</label>
                  <p className="font-medium text-gray-900">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      application.internship_type === 'remote' ? 'bg-green-100 text-green-700' :
                      application.internship_type === 'hybrid' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {application.internship_type}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Location</label>
                  <p className="font-medium text-gray-900">{application.location || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Duration</label>
                  <p className="font-medium text-gray-900">{application.duration || 'Not specified'} months</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Stipend</label>
                  <p className="font-medium text-gray-900">
                    {application.stipend ? `${application.stipend} DZD` : 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Stipend Type</label>
                  <p className="font-medium text-gray-900">{application.stipend_type || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Deadline</label>
                  <p className="font-medium text-gray-900">
                    {application.deadline ? new Date(application.deadline).toLocaleDateString() : 'No deadline'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Positions Available</label>
                  <p className="font-medium text-gray-900">{application.positions_available || 1}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6 pt-6 border-t">
                <label className="text-sm text-gray-500 mb-2 block">Description</label>
                <p className="text-gray-700">{application.internship_description || 'No description provided'}</p>
              </div>

              {/* Required Skills */}
              {application.required_skills && application.required_skills.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <label className="text-sm text-gray-500 mb-2 block">Required Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {application.required_skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {application.requirements && (
                <div className="mt-6 pt-6 border-t">
                  <label className="text-sm text-gray-500 mb-2 block">Requirements</label>
                  <p className="text-gray-700">{application.requirements}</p>
                </div>
              )}

              {/* Benefits */}
              {application.benefits && (
                <div className="mt-6 pt-6 border-t">
                  <label className="text-sm text-gray-500 mb-2 block">Benefits</label>
                  <p className="text-gray-700">{application.benefits}</p>
                </div>
              )}
            </motion.div>

            {/* Company Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Company Information
              </h2>

              <div className="flex items-start gap-6 mb-6">
                {application.logo_url ? (
                  <img 
                    src={`http://stag-io-backend.onrender.com${application.logo_url}`}
                    alt={application.company_name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <span className="text-2xl font-bold text-indigo-600">
                      {application.company_name?.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{application.company_name}</h3>
                  <p className="text-gray-600">{application.company_email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500">Contact Person</label>
                  <p className="font-medium text-gray-900">{application.contact_person}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Position</label>
                  <p className="font-medium text-gray-900">{application.contact_position || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <p className="font-medium text-gray-900">{application.company_phone || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Wilaya</label>
                  <p className="font-medium text-gray-900">{application.company_location || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Activity Sector</label>
                  <p className="font-medium text-gray-900">{application.activity_sector || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Company Size</label>
                  <p className="font-medium text-gray-900">{application.company_size || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Trade Register</label>
                  <p className="font-medium text-gray-900">{application.trade_register}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Rating</label>
                  <p className="font-medium text-gray-900">
                    {application.average_rating ? `${application.average_rating} / 5` : 'No ratings yet'}
                  </p>
                </div>
              </div>

              {/* Company Description */}
              {application.company_description && (
                <div className="mt-6 pt-6 border-t">
                  <label className="text-sm text-gray-500 mb-2 block">Company Description</label>
                  <p className="text-gray-700">{application.company_description}</p>
                </div>
              )}

              {/* Website */}
              {application.website && (
                <div className="mt-4">
                  <a 
                    href={application.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Visit Website
                  </a>
                </div>
              )}
            </motion.div>

            {/* Application Timeline Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Application Timeline
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Applied</p>
                    <p className="text-sm text-gray-500">{new Date(application.applied_at).toLocaleString()}</p>
                  </div>
                </div>

                {application.reviewed_at && (
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Reviewed</p>
                      <p className="text-sm text-gray-500">{new Date(application.reviewed_at).toLocaleString()}</p>
                      {application.company_feedback && (
                        <p className="text-sm text-gray-600 mt-1 italic">"{application.company_feedback}"</p>
                      )}
                    </div>
                  </div>
                )}

                {application.interview_date && (
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Interview Scheduled</p>
                      <p className="text-sm text-gray-500">
                        {new Date(application.interview_date).toLocaleDateString()} 
                        {application.interview_time && ` at ${application.interview_time}`}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Mode: {application.interview_mode}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full ${
                    application.is_validated ? 'bg-green-100' : 'bg-yellow-100'
                  } flex items-center justify-center flex-shrink-0`}>
                    <svg className={`w-4 h-4 ${
                      application.is_validated ? 'text-green-600' : 'text-yellow-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {application.is_validated ? 'Validated' : 'Awaiting Validation'}
                    </p>
                    {application.validated_at && (
                      <p className="text-sm text-gray-500">{new Date(application.validated_at).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Internship</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this internship:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-6"
              rows="4"
            />
            <div className="flex gap-4">
              <button
                onClick={handleReject}
                disabled={processing || !rejectReason.trim()}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Confirm Reject'}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminInternshipDetails;