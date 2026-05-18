import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  Mail,
  Phone,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  Eye,
  Star,
  MessageSquare,
  Video,
  Users,
  Award,
  Loader2,
  DollarSign,
  GraduationCap,
  Building2
} from 'lucide-react';

const CompanyInternshipApplications = () => {
  const navigate = useNavigate();
  const { internshipId } = useParams();
  
  const [internship, setInternship] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    interview: 0,
    accepted: 0,
    rejected: 0
  });

  // بيانات المقابلة
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
    
    fetchInternshipDetails();
    fetchApplications();
  }, [internshipId, navigate]);

  // جلب تفاصيل التدريب
  const fetchInternshipDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://stag-io-backend.onrender.com/api/company/internships/${internshipId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setInternship(response.data.internship);
      }
    } catch (error) {
      console.error('Error fetching internship:', error);
      toast.error('Error loading internship details');
    }
  };

  // جلب المتقدمين لهذا التدريب
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('🔍 Fetching applications for internship:', internshipId);
      
      const response = await axios.get(
        `http://stag-io-backend.onrender.com/api/company/applications?internship_id=${internshipId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('📦 Applications response:', response.data);
      
      if (response.data.success) {
        const apps = response.data.applications || [];
        setApplications(apps);
        calculateStats(apps);
      }
    } catch (error) {
      console.error('🔥 Error fetching applications:', error);
      toast.error('Error loading applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // حساب الإحصائيات
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
    if (newStatus === 'interview') {
      setSelectedApp(applications.find(a => a.id === applicationId));
      setShowInterviewModal(true);
      return;
    }
    
    if (newStatus === 'accepted' || newStatus === 'rejected') {
      setSelectedApp(applications.find(a => a.id === applicationId));
      setSelectedStatus(newStatus);
      setShowFeedbackModal(true);
      return;
    }

    await updateStatus(applicationId, newStatus, '');
  };

  const updateStatus = async (applicationId, newStatus, feedback, interviewData = null) => {
    try {
      setProcessingId(applicationId);
      const token = localStorage.getItem('token');
      
      console.log('📝 Updating status:', { applicationId, newStatus, feedback, interviewData });
      
      const payload = { status: newStatus, feedback };
      
      if (interviewData) {
        payload.interview_date = interviewData.interview_date;
        payload.interview_time = interviewData.interview_time;
        payload.interview_mode = interviewData.interview_mode;
        payload.meeting_link = interviewData.meeting_link;
      }
      
      const response = await axios.put(
        `http://stag-io-backend.onrender.com/api/company/applications/${applicationId}/status`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('✅ Status updated in DB:', response.data);
      
      const updatedApps = applications.map(app => 
        app.id === applicationId 
          ? { ...app, status: newStatus, feedback, ...interviewData } 
          : app
      );
      
      setApplications(updatedApps);
      calculateStats(updatedApps);
      
      if (newStatus === 'accepted') {
        const application = applications.find(a => a.id === applicationId);
        
       /* try {
          await axios.post(
            'http://localhost:5000/api/notifications/send',
            {
              user_id: application.student_id,
              user_type: 'student',
              type: 'acceptance',
              title: '🎉 Congratulations! You are accepted!',
              message: `You have been accepted for the position: ${application.internship_title}`,
              application_id: applicationId
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (studentError) {
          console.error('❌ Error sending student notification:', studentError);
        }*/
        
        try {
          await axios.post(
            'http://stag-io-backend.onrender.com/api/notifications/send',
            {
              user_type: 'admin',
              type: 'company_accept',
              title: '📋 New Acceptance Pending Validation',
              message: `${application.student_name} has been accepted for ${application.internship_title}`,
              application_id: applicationId
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (adminError) {
          console.error('❌ Error sending admin notification:', adminError);
        }
        
        toast.success('✅ Application accepted!');
      } else if (newStatus === 'rejected') {
        toast.success('❌ Application rejected');
      } else {
        toast.success(`✅ Application marked as ${newStatus}`);
      }
      
      setShowFeedbackModal(false);
      setShowInterviewModal(false);
      setSelectedApp(null);
      setFeedbackText('');
      setInterviewData({
        interview_date: '',
        interview_time: '',
        interview_mode: 'zoom',
        meeting_link: ''
      });
      
    } catch (error) {
      console.error('❌ Error in updateStatus:', error);
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
    
    await updateStatus(selectedApp.id, 'interview', '', interviewData);
  };

  const handleViewStudentProfile = (studentId) => {
    navigate(`/company/student/${studentId}`);
  };

 

  const handleContactStudent = (email, name) => {
    window.location.href = `mailto:${email}?subject=Internship Application&body=Dear ${name},%0D%0A%0D%0AI am writing regarding your application...`;
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
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = 
      app.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.student_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.university?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header with Back Button */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/company/internships')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Back to My Internships
            </button>
            
            <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-blue-600">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Briefcase className="text-blue-600" size={28} />
                    <h1 className="text-3xl font-bold text-gray-900">
                      {internship?.title || 'Internship Applications'}
                    </h1>
                  </div>
                  <div className="flex flex-wrap gap-4 text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin size={16} />
                      {internship?.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {internship?.duration} months
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase size={16} />
                      {internship?.type}
                    </span>
                    {internship?.stipend > 0 && (
                      <span className="flex items-center gap-1 text-green-600">
                        <DollarSign size={16} />
                        {internship.stipend} DZD/month
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Posted: {internship?.created_at ? new Date(internship.created_at).toLocaleDateString() : 'N/A'} • 
                    Positions Available: {internship?.positions_available || 1}
                  </p>
                </div>
                
                <div className="mt-4 md:mt-0 flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm text-gray-500">Total Applicants</span>
                    <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards - مثل الصورة */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Users className="text-blue-600" size={32} />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Active</p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.pending + stats.reviewed}
                  </p>
                </div>
                <CheckCircle className="text-green-600" size={32} />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Applications</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.total}</p>
                </div>
                <FileText className="text-purple-600" size={32} />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-600">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Pending Review</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="text-yellow-600" size={32} />
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, email, or university..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="md:w-64">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Applications</option>
                  <option value="pending">Pending Review</option>
                  <option value="reviewed">Under Review</option>
                  <option value="interview">Interview</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Applications List */}
          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No students have applied to this internship yet.'}
              </p>
              <button
                onClick={() => navigate('/company/internships')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                Back to Internships
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredApplications.map((application) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {application.student_name}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                            {getStatusIcon(application.status)} {getStatusText(application.status)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                          <p className="text-gray-600 flex items-center gap-2">
                            <Mail size={14} />
                            {application.student_email}
                          </p>
                          
                          <p className="text-gray-600 flex items-center gap-2">
                            <GraduationCap size={14} />
                            {application.university} • {application.specialization}
                          </p>
                          
                          <p className="text-gray-600 flex items-center gap-2">
                            <Calendar size={14} />
                            Year {application.year_of_study}
                          </p>
                          
                          <p className="text-gray-600 flex items-center gap-2">
                            <Clock size={14} />
                            Applied: {new Date(application.applied_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                        <button
                          onClick={() => handleViewStudentProfile(application.student_id)}
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm"
                          title="View Profile"
                        >
                          <Eye size={16} />
                          <span className="hidden sm:inline">Profile</span>
                        </button>
                        
                       
                        
                        <button
                          onClick={() => handleContactStudent(application.student_email, application.student_name)}
                          className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-2 text-sm"
                          title="Contact Student"
                        >
                          <Mail size={16} />
                          <span className="hidden sm:inline">Contact</span>
                        </button>
                      </div>
                    </div>

                    {/* Skills */}
                    {application.skills && application.skills.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {application.skills.map((skill, index) => (
                            <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-100">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Interview Details */}
                    {application.status === 'interview' && application.interview_date && (
                      <div className="mb-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Video className="text-purple-600 mt-1" size={20} />
                          <div>
                            <p className="font-medium text-purple-900">Interview Scheduled</p>
                            <p className="text-sm text-gray-600">
                              {new Date(application.interview_date).toLocaleDateString()} at {application.interview_time}
                            </p>
                            <p className="text-sm text-gray-600 capitalize">Mode: {application.interview_mode}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Feedback */}
                    {application.feedback && (
                      <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg">
                        <p className="text-sm font-medium text-blue-800 mb-1">Your Feedback:</p>
                        <p className="text-sm text-gray-700">{application.feedback}</p>
                      </div>
                    )}

                    {/* Status Action Buttons */}
                    <div className="pt-4 border-t flex flex-wrap gap-2">
                      {application.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(application.id, 'reviewed')}
                            disabled={processingId === application.id}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                          >
                            {processingId === application.id ? <Loader2 className="animate-spin" size={16} /> : '🔍 Mark Reviewed'}
                          </button>
                          
                          <button
                            onClick={() => handleStatusChange(application.id, 'interview')}
                            disabled={processingId === application.id}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                          >
                            {processingId === application.id ? <Loader2 className="animate-spin" size={16} /> : '🎯 Schedule Interview'}
                          </button>
                        </>
                      )}

                      {(application.status === 'pending' || application.status === 'reviewed') && (
                        <>
                          <button
                            onClick={() => handleStatusChange(application.id, 'accepted')}
                            disabled={processingId === application.id}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                          >
                            {processingId === application.id ? <Loader2 className="animate-spin" size={16} /> : '✅ Accept'}
                          </button>
                          
                          <button
                            onClick={() => handleStatusChange(application.id, 'rejected')}
                            disabled={processingId === application.id}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                          >
                            {processingId === application.id ? <Loader2 className="animate-spin" size={16} /> : '❌ Reject'}
                          </button>
                        </>
                      )}

                      {application.status === 'interview' && (
                        <span className="text-sm text-gray-500 italic flex items-center gap-2">
                          <Clock size={16} />
                          Awaiting student response
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Interview Modal */}
      {showInterviewModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Video className="text-purple-600" size={24} />
              Schedule Interview
            </h3>
            
            <p className="text-gray-600 mb-6">
              Schedule an interview with <span className="font-semibold">{selectedApp.student_name}</span>
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={interviewData.interview_date}
                  onChange={(e) => setInterviewData({ ...interviewData, interview_date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  value={interviewData.interview_time}
                  onChange={(e) => setInterviewData({ ...interviewData, interview_time: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interview Mode</label>
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

      {/* Feedback Modal */}
      {showFeedbackModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {selectedStatus === 'accepted' ? '✅ Accept Application' : '❌ Reject Application'}
            </h3>
            
            <p className="text-gray-600 mb-4">
              {selectedStatus === 'accepted'
                ? `Accept ${selectedApp.student_name}'s application. Add optional feedback:`
                : `Please provide feedback for ${selectedApp.student_name}:`}
            </p>
            
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder={selectedStatus === 'accepted' 
                ? 'Optional feedback...' 
                : 'Explain why you are rejecting this application...'}
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
    </div>
  );
};

export default CompanyInternshipApplications;