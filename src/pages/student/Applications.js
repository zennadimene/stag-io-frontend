import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast'; 

const Applications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showFeedback, setShowFeedback] = useState(null);
  const [acceptingOffer, setAcceptingOffer] = useState(null);
  const [withdrawingId, setWithdrawingId] = useState(null); // ✅ جديد
  useEffect(() => {
    console.log('🔍 Current applications in state:', applications.length);
    console.log('🔍 Applications data:', applications);
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.user_type !== 'student') {
      navigate('/login');
      return;
    }
    
    fetchApplications();
  }, [navigate]);

 const fetchApplications = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5000/api/student/applications', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      setApplications(response.data.applications);
      
      // 🔍 كود التصحيح - أضف هذا
      console.log('📊 ALL APPLICATIONS:', response.data.applications);
      
    }
  } catch (error) {
    toast.error('Error fetching applications'); 
  } finally {
    setLoading(false);
  }
};

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `http://localhost:5000/api/student/applications/${applicationId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        toast.success('Application withdrawn successfully');
        setApplications(applications.filter(app => app.id !== applicationId));
      }
    } catch (error) {
      console.error('Error withdrawing application:', error);
      toast.error('Error withdrawing application');
    }
  };

  const handleAcceptOffer = async (applicationId) => {
    if (!window.confirm('Are you sure you want to accept this offer?')) {
      return;
    }
    
    try {
      setAcceptingOffer(applicationId);
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/student/applications/${applicationId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success('Offer accepted successfully! Check your email for the agreement.');
        fetchApplications();
      }
    } catch (error) {
      console.error('Error accepting offer:', error);
       toast.error('Error accepting offer. Please try again.');
    } finally {
      setAcceptingOffer(null);
    }
  };


   // ============================================
  // 📥 دالة تحميل الاتفاقية - أضفها هنا
  // ============================================
  const downloadAgreement = async (agreementId) => {
    try {
      const token = localStorage.getItem('token');
      console.log('📥 Downloading agreement:', agreementId);
      
      const response = await axios.get(
        `http://localhost:5000/api/student/agreements/${agreementId}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      // إنشاء رابط لتحميل الملف
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `agreement_${agreementId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // تنظيف الرابط
      window.URL.revokeObjectURL(url);
      
      toast.success('✅ Agreement downloaded successfully!');
    } catch (error) {
      console.error('❌ Error downloading:', error);
      
      // رسالة خطأ مفيدة
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else if (error.response?.status === 404) {
        toast.error('Agreement file not found.');
      } else {
        toast.error('Error downloading agreement. Please try again.');
      }
    }
  };

  const handleContactCompany = (companyEmail, companyName) => {
    window.location.href = `mailto:${companyEmail}?subject=Question about Internship Application&body=Dear ${companyName},%0D%0A%0D%0AI am writing regarding my internship application...`;
  };

  const handleImproveProfile = () => {
    navigate('/student/profile/edit');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <div className="text-xl text-gray-600">Loading your applications...</div>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
            <p className="text-gray-600 mt-2">Track and manage your internship applications</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <div className="flex flex-wrap gap-3">
              {/* All */}
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'all' 
                    ? 'bg-gray-800 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📋 All ({applications.length})
              </button>

              {/* Pending */}
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'pending' 
                    ? 'bg-yellow-600 text-white shadow-md' 
                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                }`}
              >
                ⏳ Pending ({applications.filter(a => a.status === 'pending').length})
              </button>

              {/* Reviewed */}
              <button
                onClick={() => setFilter('reviewed')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'reviewed' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                🔍 Reviewed ({applications.filter(a => a.status === 'reviewed').length})
              </button>

              {/* Interview */}
              <button
                onClick={() => setFilter('interview')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'interview' 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                🎯 Interview ({applications.filter(a => a.status === 'interview').length})
              </button>

              {/* Accepted */}
              <button
                onClick={() => setFilter('accepted')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'accepted' 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                ✅ Accepted ({applications.filter(a => a.status === 'accepted').length})
              </button>

              {/* Rejected */}
              <button
                onClick={() => setFilter('rejected')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'rejected' 
                    ? 'bg-red-600 text-white shadow-md' 
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                ❌ Rejected ({applications.filter(a => a.status === 'rejected').length})
              </button>
            </div>
          </div>

          {/* Applications List */}
          <div className="space-y-6">
            {filteredApplications.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications found</h3>
                  <p className="text-gray-500 mb-6">
                    {filter === 'all' 
                      ? "You haven't applied to any internships yet." 
                      : `No ${filter} applications found.`}
                  </p>
                  <button
                    onClick={() => navigate('/internships')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Browse Internships
                  </button>
                </div>
              </div>
            ) : (
              filteredApplications.map((application, index) => (
                <motion.div
                  key={`app-${application.id}-${application.applied_date}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {application.internship_title}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {application.company_name} • {application.company_location}
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(application.status)}`}>
                          {getStatusText(application.status)}
                        </span>
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">Applied Date</p>
                        <p className="font-semibold">
                          {new Date(application.applied_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="font-semibold capitalize">{application.internship_type}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-semibold">{application.duration} months</p>
                      </div>
                    </div>

                    {/* ========== 🎯 INTERVIEW DETAILS ========== */}
{application.status === 'interview' && (
  <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5 mb-6">
    <div className="flex items-start gap-4">
      <div className="bg-purple-600 text-white p-3 rounded-full">
        <span className="text-2xl">🎯</span>
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-purple-900 text-lg mb-2">Interview Scheduled</h4>
        
        {/* عرض الرسالة إذا كانت البيانات ناقصة */}
        {!application.interview_date ? (
          <p className="text-purple-700 mb-3">
            Your interview has been scheduled. The company will provide details soon.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-purple-700 font-medium">Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(application.interview_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-purple-700 font-medium">Time</p>
                <p className="font-semibold text-gray-900">{application.interview_time}</p>
              </div>
              <div>
                <p className="text-sm text-purple-700 font-medium">Mode</p>
                <p className="font-semibold text-gray-900 capitalize">{application.interview_mode}</p>
              </div>
            </div>
            
           {/* JOIN MEETING BUTTONS */}
<div className="mt-4 flex flex-wrap gap-3">
  {/* زر Zoom - شرط أكثر مرونة */}
  {(application.interview_mode?.toLowerCase() === 'zoom' || 
    (application.meeting_link && application.meeting_link.includes('zoom'))) && 
    application.meeting_link && (
    <button
      onClick={() => window.open(application.meeting_link, '_blank')}
      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 inline-flex items-center gap-2"
    >
      <span>🎥</span>
      Join Zoom Meeting
    </button>
  )}
                {/* زر Google Meet */}
  {(application.interview_mode?.toLowerCase() === 'google_meet' || 
    application.interview_mode?.toLowerCase() === 'google meet' ||
    (application.meeting_link && application.meeting_link.includes('meet.google'))) && 
    application.meeting_link && (
    <button
      onClick={() => window.open(application.meeting_link, '_blank')}
      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 inline-flex items-center gap-2"
    >
      <span>🔗</span>
      Join Google Meet
    </button>
  )}
              
               {/* ADD TO CALENDAR BUTTON - نفس الكود */}
  {application.interview_date && application.interview_time && (
    <button
      onClick={() => {
        const startDate = new Date(application.interview_date);
        const [hours, minutes] = application.interview_time?.split(':') || ['10', '00'];
        startDate.setHours(parseInt(hours), parseInt(minutes));
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
        
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Interview: ${encodeURIComponent(application.internship_title)}&dates=${startDate.toISOString().replace(/-|:|\.\d+/g, '')}/${endDate.toISOString().replace(/-|:|\.\d+/g, '')}&details=Interview with ${encodeURIComponent(application.company_name)}&location=${encodeURIComponent(application.interview_mode || 'Online')}`;
        
        window.open(googleCalendarUrl, '_blank');
      }}
      className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 inline-flex items-center gap-2"
    >
      <span>📅</span>
      Add to Calendar
    </button>
  )}
</div>
              
          </>
        )}
      </div>
    </div>
  </div>
)}

                    {/* ========== 💬 FEEDBACK SECTION ========== */}
                    {application.feedback && (
                      <div className="mb-6">
                        <button
                          onClick={() => setShowFeedback(showFeedback === application.id ? null : application.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2"
                        >
                          <span>💬</span>
                          {showFeedback === application.id ? 'Hide feedback' : 'View feedback'}
                        </button>
                        
                        {showFeedback === application.id && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 bg-gray-50 border-l-4 border-blue-500 p-4 rounded-r-lg"
                          >
                            <p className="text-sm font-medium text-gray-700 mb-1">Company Feedback:</p>
                            <p className="text-gray-800">{application.feedback}</p>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* ========== ACTION BUTTONS ========== */}
                    <div className="flex flex-wrap gap-3 pt-6 border-t">
                      {/* View Internship - Always */}
                      <button
                        onClick={() => navigate(`/internships/${application.internship_id}`)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-medium"
                      >
                        <span>👁️</span>
                        View Internship
                      </button>

                    {/* ===== 🗑️ WITHDRAW BUTTON - أضف هذا الزر هنا ===== */}
{(application.status === 'pending' || application.status === 'reviewed') && (
  <button
    onClick={() => handleWithdraw(application.id)}
    disabled={withdrawingId === application.id}
    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center gap-2 font-medium transition-colors disabled:opacity-50 border border-red-200"
  >
    {withdrawingId === application.id ? (
      <>
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
        Withdrawing...
      </>
    ) : (
      <>
        <span>🗑️</span>
        Withdraw Application
      </>
    )}
  </button>
)}

                      {/* ===== 🎯 INTERVIEW ACTIONS ===== */}
                      {/* ===== 🎯 INTERVIEW ACTIONS ===== */}
{application.status === 'interview' && (
  <>
    {/* ✅ تصحيح: in_person بدلاً من in-person */}
    {application.interview_mode?.toLowerCase().includes('person') && (
      <button
        onClick={() => {
          const location = encodeURIComponent(application.company_location);
          window.open(`https://www.google.com/maps/search/?api=1&query=${location}`, '_blank');
        }}
        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-2 font-medium"
      >
        <span>📍</span>
        Get Directions
      </button>
    )}
    
    {/* ✅ إضافة fallback للـ email */}
    <button
      onClick={() => handleContactCompany(
        application.company_email || 'careers@company.com',
        application.company_name
      )}
      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 flex items-center gap-2 font-medium"
    >
      <span>📧</span>
      Contact Company
    </button>
  </>
)}

                      {/* ===== ✅ ACCEPTED ACTIONS ===== */}
                     {/* ===== ✅ ACCEPTED ACTIONS ===== */}
{application.status === 'accepted' && (
  <>
    <button
  onClick={() => {
    if (application.agreement_id) {
      navigate(`/student/agreements/${application.agreement_id}/view`);
    } else {
      alert('No agreement found for this application');
    }
  }}
  disabled={!application.agreement_id}
  className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium ${
    application.agreement_id 
      ? 'bg-green-600 text-white hover:bg-green-700' 
      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
  }`}
>
  <span>📄</span> View Agreement
</button>
    
  {/* ✅ DOWNLOAD AGREEMENT - مع دالة downloadAgreement */}
<button
  onClick={() => {
    if (application.agreement_id) {
      downloadAgreement(application.agreement_id);
    } else {
      alert('No agreement available for download');
    }
  }}
  disabled={!application.agreement_id}
  className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium ${
    application.agreement_id 
      ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
  }`}
>
  <span>⬇️</span> Download Agreement
</button>
    
    <button
      onClick={() => handleAcceptOffer(application.id)}
      disabled={acceptingOffer === application.id}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium disabled:opacity-50"
    >
      {acceptingOffer === application.id ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Accepting...
        </>
      ) : (
        <>
          <span>✅</span>
          Accept Offer
        </>
      )}
    </button>
    
    <button
  onClick={() => {
    console.log('Contacting:', {
      email: application.company_email,
      name: application.company_name
    });
    handleContactCompany(application.company_email, application.company_name);
  }}
  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-2 font-medium"
>
  <span>📞</span> Contact Company
</button>
    
    {/* ✅ SHARE SUCCESS - جديد */}
    <button
      onClick={() => {
        const text = `🎉 I got accepted for ${application.internship_title} at ${application.company_name}! #internship #success`;
        navigator.clipboard.writeText(text);
        toast.success('🎉 Copied to clipboard! Share your success on social media!');
      }}
      className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 flex items-center gap-2 font-medium"
    >
      <span>🎉</span>
      Share Success
    </button>
  </>
)}

                      {/* ===== ⏳ PENDING/REVIEWED ACTIONS ===== */}
                      {/* ===== ❌ REJECTED ACTIONS ===== */}
{application.status === 'rejected' && (
  <>
    <button
      onClick={() => navigate('/internships')}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
    >
      <span>🔍</span>
      Find New Internships
    </button>
    
    {/* ✅ SIMILAR INTERNSHIPS - جديد */}
    <button
      onClick={() => {
        const keywords = application.internship_title?.split(' ').slice(0, 2).join(' ') || '';
        navigate(`/internships?search=${encodeURIComponent(keywords)}`);
      }}
      className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 flex items-center gap-2 font-medium"
    >
      <span>🔎</span>
      Similar Internships
    </button>
    
     {/* ✅ VIEW FEEDBACK BUTTON - هذا الزر كان ناقص! */}
    {application.feedback && (
      <button
        onClick={() => setShowFeedback(showFeedback === application.id ? null : application.id)}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 font-medium"
      >
        <span>💬</span>
        {showFeedback === application.id ? 'Hide Feedback' : 'View Feedback'}
      </button>
    )}
    
    <button
      onClick={handleImproveProfile}
      className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 flex items-center gap-2 font-medium"
    >
      <span>📝</span>
      Improve My Profile
    </button>
  </>
)}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Applications;