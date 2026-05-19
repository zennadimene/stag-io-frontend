import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, 
  User, 
  Building, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Calendar as CalendarIcon,
  Video,
  MessageSquare,
  Download,
  Eye
} from 'lucide-react';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewMode, setInterviewMode] = useState('online');
  const [meetingLink, setMeetingLink] = useState('');
  const [showInterviewForm, setShowInterviewForm] = useState(false);

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        //`http://localhost:5000/api/company/applications/${id}`,
        `${BASE}/api/company/applications/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setApplication(response.data.application);
        setFeedback(response.data.application.feedback || '');
        setInterviewDate(response.data.application.interview_date || '');
        setInterviewTime(response.data.application.interview_time || '');
        setInterviewMode(response.data.application.interview_mode || 'online');
        setMeetingLink(response.data.application.meeting_link || '');
      }
    } catch (error) {
      console.error('Error fetching application:', error);
      toast.error('Error loading application details');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status, interviewData = {}) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      
      const payload = {
        status,
        feedback: feedback || null
      };
      
      if (status === 'interview') {
        payload.interview_date = interviewData.date || interviewDate;
        payload.interview_time = interviewData.time || interviewTime;
        payload.interview_mode = interviewData.mode || interviewMode;
        payload.meeting_link = interviewData.link || meetingLink;
      }
      
      const response = await axios.put(
      //  `http://localhost:5000/api/company/applications/${id}/status`,
        `${BASE}/api/company/applications/${id}/status`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success(`Application ${status === 'accepted' ? 'accepted' : status === 'rejected' ? 'rejected' : 'updated'} successfully!`);
        fetchApplicationDetails();
        setShowInterviewForm(false);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Error updating application');
    } finally {
      setUpdating(false);
    }
  };

  /*const downloadCV = async (cvUrl) => {
    if (!cvUrl) {
      toast.error('No CV available');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000${cvUrl}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CV_${application.student_name}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('CV downloaded successfully');
    } catch (error) {
      console.error('Error downloading CV:', error);
      toast.error('Error downloading CV');
    }
  };*/

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      reviewed: { color: 'bg-blue-100 text-blue-800', icon: Eye, label: 'Reviewed' },
      interview: { color: 'bg-purple-100 text-purple-800', icon: Video, label: 'Interview' },
      accepted: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Accepted' },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate('/company/applications')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft size={20} /> Back to Applications
          </button>
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-500">Application not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <button
          onClick={() => navigate('/company/applications')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft size={20} /> Back to Applications
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">Application Details</h1>
                <p className="text-blue-100 mt-1">Review candidate information</p>
              </div>
              {getStatusBadge(application.status)}
            </div>
          </div>

          <div className="p-8">
            {/* Student Information */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} className="text-blue-600" />
                Student Information
              </h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">{application.student_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{application.student_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">University</p>
                    <p className="font-medium text-gray-900">{application.university || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Specialization</p>
                    <p className="font-medium text-gray-900">{application.specialization || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Year of Study</p>
                    <p className="font-medium text-gray-900">{application.year_of_study || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{application.phone || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            {application.skills && application.skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {application.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            

            {/* Feedback & Actions */}
            <div className="border-t pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Review Application</h2>
              
              {/* Feedback Textarea */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback (optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add feedback for the student..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {application.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateStatus('reviewed')}
                      disabled={updating}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      Mark as Reviewed
                    </button>
                    <button
                      onClick={() => setShowInterviewForm(!showInterviewForm)}
                      disabled={updating}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                      Schedule Interview
                    </button>
                  </>
                )}

                {application.status === 'reviewed' && (
                  <button
                    onClick={() => setShowInterviewForm(!showInterviewForm)}
                    disabled={updating}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    Schedule Interview
                  </button>
                )}

                {application.status === 'interview' && (
                  <>
                    <button
                      onClick={() => updateStatus('accepted')}
                      disabled={updating}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus('rejected')}
                      disabled={updating}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </>
                )}

                {application.status === 'accepted' && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle size={20} />
                    <span>Application accepted</span>
                  </div>
                )}

                {application.status === 'rejected' && (
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle size={20} />
                    <span>Application rejected</span>
                  </div>
                )}
              </div>

              {/* Interview Form */}
              {showInterviewForm && (
                <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Schedule Interview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={interviewDate}
                        onChange={(e) => setInterviewDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input
                        type="time"
                        value={interviewTime}
                        onChange={(e) => setInterviewTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                      <select
                        value={interviewMode}
                        onChange={(e) => setInterviewMode(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="online">Online</option>
                        <option value="in-person">In Person</option>
                        <option value="phone">Phone</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link</label>
                      <input
                        type="url"
                        value={meetingLink}
                        onChange={(e) => setMeetingLink(e.target.value)}
                        placeholder="https://meet.google.com/..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateStatus('interview', { date: interviewDate, time: interviewTime, mode: interviewMode, link: meetingLink })}
                      disabled={!interviewDate || !interviewTime}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                      Send Interview Invitation
                    </button>
                    <button
                      onClick={() => setShowInterviewForm(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ApplicationDetails;