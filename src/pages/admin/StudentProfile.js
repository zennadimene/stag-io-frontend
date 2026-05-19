import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.user_type !== 'admin') {
      navigate('/login');
      return;
    }
    
    fetchStudent();
    fetchApplications();
    fetchAgreements();
  }, [id, navigate]);

  const fetchStudent = async () => {
    try {
      const token = localStorage.getItem('token');
      //const response = await axios.get(`http://localhost:5000/api/admin/students/${id}`, {
      const response = await axios.get(`${BASE}/api/admin/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setStudent(response.data.student);
      }
    } catch (error) {
      console.error('Error fetching student:', error);
      toast.error('Error loading student profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      //const response = await axios.get(`http://localhost:5000/api/admin/students/${id}/applications`, {
      const response = await axios.get(`${BASE}/api/admin/students/${id}/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setApplications(response.data.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetchAgreements = async () => {
    try {
      const token = localStorage.getItem('token');
      //const response = await axios.get(`http://localhost:5000/api/admin/students/${id}/agreements`, {
      const response = await axios.get(`${BASE}/api/admin/students/${id}/agreements`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setAgreements(response.data.agreements);
      }
    } catch (error) {
      console.error('Error fetching agreements:', error);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Student not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* زر الرجوع */}
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
        >
          ← Back to Dashboard
        </button>

        {/* معلومات الطالب */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {student.first_name} {student.last_name}
              </h1>
              <p className="text-gray-600 mt-1">{student.email}</p>
            </div>
            <div className="flex gap-2">
              {student.is_suspended ? (
                <span className="px-4 py-2 bg-red-100 text-red-700 rounded-lg">Suspended</span>
              ) : (
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg">Active</span>
              )}
            </div>
          </div>

          {/* التبويبات */}
          <div className="border-b border-gray-200 mt-6">
            <nav className="flex gap-4">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-4 font-medium text-sm border-b-2 ${
                  activeTab === 'profile'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`py-2 px-4 font-medium text-sm border-b-2 ${
                  activeTab === 'applications'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500'
                }`}
              >
                Applications ({applications.length})
              </button>
              <button
                onClick={() => setActiveTab('agreements')}
                className={`py-2 px-4 font-medium text-sm border-b-2 ${
                  activeTab === 'agreements'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500'
                }`}
              >
                Agreements ({agreements.length})
              </button>
            </nav>
          </div>

          {/* محتوى التبويبات */}
          <div className="mt-6">
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">First Name</label>
                    <p className="font-medium">{student.first_name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Last Name</label>
                    <p className="font-medium">{student.last_name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="font-medium">{student.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <p className="font-medium">{student.phone || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">University</label>
                    <p className="font-medium">{student.university}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Specialization</label>
                    <p className="font-medium">{student.specialization}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Year of Study</label>
                    <p className="font-medium">{student.year_of_study}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Wilaya</label>
                    <p className="font-medium">{student.wilaya || 'Not set'}</p>
                  </div>
                  
                  {/* ✅ SOCIAL SECURITY NUMBER - أضف هذا */}
                  <div>
                    <label className="text-sm text-gray-500">Social Security Number</label>
                    <p className="font-medium font-mono">
                      {student.social_security || 'Not provided'}
                    </p>
                  </div>
                  
                  {/* ✅ ACADEMIC SUPERVISOR - أضف هذا */}
                  <div>
                    <label className="text-sm text-gray-500">Academic Supervisor</label>
                    <p className="font-medium">
                      {student.academic_supervisor || 'Not assigned'}
                    </p>
                  </div>
                </div>
                
                {/* المهارات */}
                <div>
                  <label className="text-sm text-gray-500">Technical Skills</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {student.skills?.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500">Soft Skills</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {student.soft_skills?.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ✅ أضف قسم الخبرات هنا ✅ */}
{student.experiences && student.experiences.length > 0 && (
  <div className="mb-6">
    <label className="text-sm text-gray-500">Professional Experience</label>
    <div className="space-y-3 mt-2">
      {student.experiences.map((exp, idx) => (
        <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-gray-900">{exp.title}</h4>
              <p className="text-sm text-gray-700">{exp.company}</p>
              {exp.location && <p className="text-xs text-gray-500 mt-1">📍 {exp.location}</p>}
              <p className="text-xs text-gray-500 mt-1">{exp.start_date} - {exp.current ? 'Present' : exp.end_date}</p>
              {exp.description && <p className="text-sm text-gray-600 mt-2">{exp.description}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
                
                <div>
                  <label className="text-sm text-gray-500">Bio</label>
                  <p className="mt-1 text-gray-700">{student.bio || 'No bio provided'}</p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500">Links</label>
                  <div className="space-y-1 mt-1">
                    {student.github_link && (
                      <a href={student.github_link} target="_blank" rel="noopener noreferrer" 
                         className="block text-indigo-600 hover:underline">
                        GitHub: {student.github_link}
                      </a>
                    )}
                    {student.linkedin_link && (
                      <a href={student.linkedin_link} target="_blank" rel="noopener noreferrer"
                         className="block text-indigo-600 hover:underline">
                        LinkedIn: {student.linkedin_link}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="space-y-3">
                {applications.map(app => (
                  <div key={app.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{app.internship_title}</h3>
                        <p className="text-sm text-gray-600">{app.company_name}</p>
                        <p className="text-xs text-gray-500">Applied: {new Date(app.applied_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'agreements' && (
              <div className="space-y-3">
                {agreements.map(ag => (
                  <div key={ag.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold">{ag.internship_title}</h3>
                    <p className="text-sm text-gray-600">{ag.company_name}</p>
                    <p className="text-xs text-gray-500">Created: {new Date(ag.created_at).toLocaleDateString()}</p>
                    <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${
                      ag.status === 'signed' ? 'bg-green-100 text-green-700' :
                      ag.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'
                    }`}>
                      {ag.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;