import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast'; 


const CompanyApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0, pending: 0, reviewed: 0, interview: 0, accepted: 0, rejected: 0
  });
 const [selectedApp, setSelectedApp] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewData, setInterviewData] = useState({
    interview_date: '',
    interview_time: '',
    interview_mode: 'zoom',
    meeting_link: ''
  });

 useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.user_type !== 'company') {
      navigate('/login');
      return;
    }
    
    fetchApplications();
  }, [navigate]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://stag-io-backend.onrender.com/api/company/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setApplications(response.data.applications);
        calculateStats(response.data.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (apps) => {
    const newStats = {
      total: apps.length,
      pending: apps.filter(a => a.status === 'pending').length,
      reviewed: apps.filter(a => a.status === 'reviewed').length,
      interview: apps.filter(a => a.status === 'interview').length,
      accepted: apps.filter(a => a.status === 'accepted').length,
      rejected: apps.filter(a => a.status === 'rejected').length
    };
    setStats(newStats);
  };
const handleStatusChange = async (applicationId, newStatus) => {
  if (newStatus === 'accepted' || newStatus === 'rejected') {
    setSelectedApp(applications.find(a => a.id === applicationId));
    setSelectedStatus(newStatus);
    setShowFeedbackModal(true);
    return;
  }
  
  if (newStatus === 'interview') {
    setSelectedApp(applications.find(a => a.id === applicationId));
    setShowInterviewModal(true);
    return;
  }

  await updateStatus(applicationId, newStatus, '');
};


const updateStatus = async (applicationId, newStatus, feedback) => {
  try {
    setProcessingId(applicationId);
    const token = localStorage.getItem('token');
    
    console.log('📝 Updating status:', { applicationId, newStatus, feedback });
    
    // 1️⃣ تحديث الحالة في قاعدة البيانات
    const response = await axios.put(
      `http://stag-io-backend.onrender.com/api/company/applications/${applicationId}/status`,
      { status: newStatus, feedback },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log('✅ Status updated in DB:', response.data);
    
    // تحديث الحالة محلياً
    const updatedApps = applications.map(app => 
      app.id === applicationId 
        ? { ...app, status: newStatus, feedback } 
        : app
    );
    
    setApplications(updatedApps);
    calculateStats(updatedApps);
    
    // 2️⃣ إرسال الإشعارات إذا كان القبول
   /* if (newStatus === 'accepted') {
      const application = applications.find(a => a.id === applicationId);
      
      console.log('📨 Sending notifications for application:', application);
      
      // إشعار للطالب
      try {
        const studentResponse = await axios.post(
          'http://localhost:5000/api/notifications/send',
          {
            user_id: application.student_id,
            user_type: 'student',
            type: 'acceptance',
            title: '🎉 Congratulations! You are accepted!',
            message: `You have been accepted for the position: ${application.internship_title}. The administration will validate your application soon.`,
            application_id: applicationId,
            internship_title: application.internship_title
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('✅ Student notification sent:', studentResponse.data);
      } catch (studentError) {
        console.error('❌ Error sending student notification:', studentError.response?.data || studentError.message);
        // استمر رغم الخطأ
      }
      
      // إشعار للإدارة
      try {
        const adminResponse = await axios.post(
          'http://localhost:5000/api/notifications/send',
          {
            user_type: 'admin',
            type: 'company_accept',
            title: '📋 New Acceptance Pending Validation',
            message: `${application.student_name} has been accepted for ${application.internship_title}.`,
            application_id: applicationId,
            student_name: application.student_name,
            internship_title: application.internship_title
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('✅ Admin notification sent:', adminResponse.data);
      } catch (adminError) {
        console.error('❌ Error sending admin notification:', adminError.response?.data || adminError.message);
        // استمر رغم الخطأ
      }
      
      toast.success('✅ Application accepted!');
    } else {
      toast.success(`✅ Application ${newStatus} successfully`);
    }
    */
    setShowFeedbackModal(false);
    setSelectedApp(null);
    setFeedbackText('');
  } catch (error) {
    console.error('❌ Error in updateStatus:', error);
    console.error('❌ Error details:', error.response?.data || error.message);
    toast.error('❌ Error updating status: ' + (error.response?.data?.message || error.message)); 
  } finally {
    setProcessingId(null);
  }
};


const scheduleInterview = async () => {
  if (!interviewData.interview_date || !interviewData.interview_time) {
    toast.error('Please select date and time');
    return;
  }
  
  try {
    setProcessingId(selectedApp.id);
    const token = localStorage.getItem('token');
    
    // تنسيق البيانات للإرسال
    const payload = { 
      status: 'interview',
      interview_date: interviewData.interview_date,
      interview_time: interviewData.interview_time,
      interview_mode: interviewData.interview_mode,
      meeting_link: interviewData.meeting_link || ''
    };
    
    console.log('📤 Sending interview data:', payload);
    
    // إرسال الطلب للخادم
    const response = await axios.put(
      `http://stag-io-backend.onrender.com/api/company/applications/${selectedApp.id}/status`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log('📥 Server response:', response.data);
    
    if (response.data.success) {
      // ✅ 1. عرض رسالة النجاح
      toast.success('✅ Interview scheduled successfully!');
      
      // ✅ 2. تحديث القائمة محلياً في واجهة الشركة
      const updatedApps = applications.map(app => 
        app.id === selectedApp.id 
          ? { 
              ...app, 
              status: 'interview',
              interview_date: interviewData.interview_date,
              interview_time: interviewData.interview_time,
              interview_mode: interviewData.interview_mode,
              meeting_link: interviewData.meeting_link
            } 
          : app
      );
      
      setApplications(updatedApps);
      calculateStats(updatedApps);
      
      // ✅ 3. إرسال إشعار للطالب
      /*
      try {
        const studentName = selectedApp.student_name || 'Student';
        const companyName = 'Tech Solutions DZ'; // أو اسم الشركة من الجلسة
        
        // تنسيق التاريخ والوقت للعرض
        const formattedDate = new Date(interviewData.interview_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        const notificationResponse = await axios.post(
          'http://localhost:5000/api/notifications/send',
          {
            user_id: selectedApp.student_id,
            user_type: 'student',
            type: 'interview',
            title: '🎯 Interview Scheduled',
            message: `Your interview with ${companyName} for ${selectedApp.internship_title} has been scheduled on ${formattedDate} at ${interviewData.interview_time}.`,
            application_id: selectedApp.id,
            data: {
              interview_date: interviewData.interview_date,
              interview_time: interviewData.interview_time,
              interview_mode: interviewData.interview_mode,
              meeting_link: interviewData.meeting_link,
              company_name: companyName,
              internship_title: selectedApp.internship_title
            }
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        console.log('✅ Notification sent to student:', notificationResponse.data);
        //toast.success('📨 Notification sent to student');
      } catch (notifError) {
        console.error('❌ Error sending notification:', notifError);
        console.error('❌ Notification error details:', notifError.response?.data);
        // لا نوقف العملية إذا فشل الإشعار
      }
      */

      // ✅ 4. إغلاق النافذة وتنظيف البيانات
      setShowInterviewModal(false);
      setSelectedApp(null);
      setInterviewData({
        interview_date: '',
        interview_time: '',
        interview_mode: 'zoom',
        meeting_link: ''
      });
      
      // ✅ 5. تحديث البيانات من الخادم للتأكد
      fetchApplications();
    }
  } catch (error) {
    console.error('❌ Error scheduling interview:', error);
    console.error('❌ Error details:', error.response?.data);
    
    // عرض رسالة الخطأ المناسبة
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
    toast.error(`❌ Error scheduling interview: ${errorMessage}`);
  } finally {
    setProcessingId(null);
  }
};


  const handleViewStudentProfile = (studentId) => {
    navigate(`/company/student/${studentId}`);
  };

  const handleDownloadResume = (resumeUrl) => {
    if (resumeUrl) {
      window.open(`http://stag-io-backend.onrender.com${resumeUrl}`, '_blank');
    } else {
       toast.error('No resume available');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'interview': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return '⏳';
      case 'reviewed': return '🔍';
      case 'interview': return '🎯';
      case 'accepted': return '✅';
      case 'rejected': return '❌';
      default: return '📋';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Pending Review';
      case 'reviewed': return 'Under Review';
      case 'interview': return 'Interview Scheduled';
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading applications...</p>
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
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Applications Management</h1>
            <p className="text-gray-600 mt-2">Review and manage student applications</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow p-4 border-l-4 border-gray-800">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border-l-4 border-yellow-500">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-500">
              <p className="text-sm text-gray-500">Reviewed</p>
              <p className="text-2xl font-bold text-blue-600">{stats.reviewed}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border-l-4 border-purple-500">
              <p className="text-sm text-gray-500">Interview</p>
              <p className="text-2xl font-bold text-purple-600">{stats.interview}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
              <p className="text-sm text-gray-500">Accepted</p>
              <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border-l-4 border-red-500">
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'all' 
                    ? 'bg-gray-800 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📋 All ({stats.total})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'pending' 
                    ? 'bg-yellow-600 text-white shadow-md' 
                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                }`}
              >
                ⏳ Pending ({stats.pending})
              </button>
              <button
                onClick={() => setFilter('reviewed')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'reviewed' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                🔍 Reviewed ({stats.reviewed})
              </button>
              <button
                onClick={() => setFilter('interview')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'interview' 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                🎯 Interview ({stats.interview})
              </button>
              <button
                onClick={() => setFilter('accepted')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'accepted' 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                ✅ Accepted ({stats.accepted})
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'rejected' 
                    ? 'bg-red-600 text-white shadow-md' 
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                ❌ Rejected ({stats.rejected})
              </button>
            </div>
          </div>

          {/* Applications List */}
          <div className="space-y-6">
            {filteredApplications.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-12 text-center">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-500">
                  {filter === 'all' 
                    ? "You haven't received any applications yet." 
                    : `No ${filter} applications found.`}
                </p>
              </div>
            ) : (
              filteredApplications.map((application) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {application.student_name}
                        </h3>
                        <p className="text-gray-600">{application.student_email}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {application.university} • {application.specialization} • Year {application.year_of_study}
                        </p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)} {getStatusText(application.status)}
                        </span>
                      </div>
                    </div>

                    {/* Internship Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="font-semibold text-gray-900">Applied for: {application.internship_title}</p>
                      <p className="text-sm text-gray-600 mt-1">Location: {application.internship_location}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Applied: {new Date(application.applied_date).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Skills */}
                    {application.skills && application.skills.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {application.skills.map((skill, index) => (
                            <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Feedback Display */}
                    {application.feedback && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded-r-lg">
                        <p className="text-sm font-medium text-blue-800 mb-1">Your Feedback:</p>
                        <p className="text-gray-800">{application.feedback}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t">
                      {/* View Profile */}
                      <button
                        onClick={() => handleViewStudentProfile(application.student_id)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 font-medium"
                      >
                        👤 View Profile
                      </button>

                      

                      {/* Status Update Buttons */}
                      {application.status === 'pending' && (
                        <button
                          onClick={() => handleStatusChange(application.id, 'reviewed')}
                          disabled={processingId === application.id}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium disabled:opacity-50"
                        >
                          {processingId === application.id ? '...' : '🔍 Mark Reviewed'}
                        </button>
                      )}

                      {(application.status === 'pending' || application.status === 'reviewed') && (
                        <button
                          onClick={() => handleStatusChange(application.id, 'interview')}
                          disabled={processingId === application.id}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 font-medium disabled:opacity-50"
                        >
                          {processingId === application.id ? '...' : '🎯 Schedule Interview'}
                        </button>
                      )}

                      <button
                        onClick={() => handleStatusChange(application.id, 'accepted')}
                        disabled={processingId === application.id}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium disabled:opacity-50"
                      >
                        {processingId === application.id ? '...' : '✅ Accept'}
                      </button>

                      <button
                        onClick={() => handleStatusChange(application.id, 'rejected')}
                        disabled={processingId === application.id}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 font-medium disabled:opacity-50"
                      >
                        {processingId === application.id ? '...' : '❌ Reject'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

     {/* Feedback Modal - مرة واحدة فقط */}
      {showFeedbackModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {selectedStatus === 'accepted' ? '✅ Accept Application' : '❌ Reject Application'}
            </h3>
            
            <p className="text-gray-600 mb-4">
              {selectedStatus === 'accepted' 
                ? 'Add feedback for the student (optional):' 
                : 'Please provide feedback for the student:'}
            </p>
            
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Enter your feedback here..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => updateStatus(selectedApp.id, selectedStatus, feedbackText)}
                disabled={processingId === selectedApp.id || (selectedStatus === 'rejected' && !feedbackText)}
                className={`flex-1 py-3 rounded-lg font-medium text-white flex items-center justify-center gap-2 ${
                  selectedStatus === 'accepted' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                } disabled:opacity-50`}
              >
                {processingId === selectedApp.id ? 'Processing...' : (selectedStatus === 'accepted' ? 'Accept' : 'Reject')}
              </button>
              <button
                onClick={() => {
                  setShowFeedbackModal(false);
                  setSelectedApp(null);
                  setFeedbackText('');
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Interview Modal */}
      {showInterviewModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-purple-600">🎯</span>
              Schedule Interview
            </h3>
            
            <p className="text-gray-600 mb-6">
              Schedule an interview with <span className="font-semibold">{selectedApp.student_name}</span>
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  value={interviewData.interview_date}
                  onChange={(e) => setInterviewData({ ...interviewData, interview_date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                <input
                  type="time"
                  value={interviewData.interview_time}
                  onChange={(e) => setInterviewData({ ...interviewData, interview_time: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interview Mode *</label>
                <select
                  value={interviewData.interview_mode}
                  onChange={(e) => setInterviewData({ ...interviewData, interview_mode: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="zoom">Zoom</option>
                  <option value="google_meet">Google Meet</option>
                  <option value="in_person">In Person</option>
                  <option value="phone">Phone Call</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Link (Optional)</label>
                <input
                  type="url"
                  value={interviewData.meeting_link}
                  onChange={(e) => setInterviewData({ ...interviewData, meeting_link: e.target.value })}
                  placeholder="https://zoom.us/j/..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={scheduleInterview}
                disabled={processingId === selectedApp.id}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50"
              >
                {processingId === selectedApp.id ? 'Scheduling...' : 'Schedule Interview'}
              </button>
              <button
                onClick={() => {
                  setShowInterviewModal(false);
                  setSelectedApp(null);
                  setInterviewData({
                    interview_date: '',
                    interview_time: '',
                    interview_mode: 'zoom',
                    meeting_link: ''
                  });
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div> /* هذا يغلق div الرئيسي */
  );
};

export default CompanyApplications;