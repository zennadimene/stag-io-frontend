import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CompanyDetails = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchCompanyDetails();
    fetchCompanyInternships();
    fetchCompanyApplications();
  }, [companyId]);

  const fetchCompanyDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://stag-io-backend.onrender.com/api/admin/companies/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCompany(response.data.company);
      }
    } catch (error) {
      console.error('Error fetching company:', error);
      toast.error('Error loading company details');
    }
  };

  const fetchCompanyInternships = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://stag-io-backend.onrender.com/api/admin/companies/${companyId}/internships`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setInternships(response.data.internships);
      }
    } catch (error) {
      console.error('Error fetching internships:', error);
    }
  };

  const fetchCompanyApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://stag-io-backend.onrender.com/api/admin/companies/${companyId}/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setApplications(response.data.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Company not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* زر الرجوع */}
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
        >
          ← Back to Dashboard
        </button>

        {/* معلومات الشركة */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            {/* الجهة اليسرى - Logo + اسم الشركة + البريد */}
            <div className="flex items-center gap-4">
              {company.logo_url ? (
                <img 
                  src={`http://stag-io-backend.onrender.com${company.logo_url}`}
                  alt={company.company_name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-3xl font-bold text-indigo-600">
                    {company.company_name?.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{company.company_name}</h1>
                <p className="text-gray-600 mt-1">{company.email}</p>
              </div>
            </div>
            
            {/* الجهة اليمنى - Badge الحالة */}
            <div>
              <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                company.is_suspended === 1 
                  ? 'bg-red-100 text-red-700' 
                  : company.is_verified === 1 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
              }`}>
                {company.is_suspended === 1 ? 'Suspended' : company.is_verified === 1 ? 'Active' : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* التبويبات ومحتواها */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* أزرار التبويبات */}
          <div className="border-b border-gray-200">
            <nav className="flex gap-4">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-4 font-medium text-sm border-b-2 ${
                  activeTab === 'profile'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500'
                }`}
              >
                Company Profile
              </button>
              <button
                onClick={() => setActiveTab('internships')}
                className={`py-2 px-4 font-medium text-sm border-b-2 ${
                  activeTab === 'internships'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500'
                }`}
              >
                Internships ({internships.length})
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
            </nav>
          </div>

          {/* محتوى التبويبات */}
          <div className="mt-6">
            {/* تبويب الملف الشخصي */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Company Name</label>
                    <p className="font-medium">{company.company_name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="font-medium">{company.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <p className="font-medium">{company.phone || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Website</label>
                    <p className="font-medium">{company.website || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Trade Register</label>
                    <p className="font-medium">{company.trade_register}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Activity Sector</label>
                    <p className="font-medium">{company.activity_sector || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Company Size</label>
                    <p className="font-medium">{company.company_size || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Wilaya</label>
                    <p className="font-medium">{company.wilaya || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Address</label>
                    <p className="font-medium">{company.address || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Contact Person</label>
                    <p className="font-medium">{company.contact_person || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Registered Date</label>
                    <p className="font-medium">{new Date(company.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* وصف الشركة */}
                {company.description && (
                  <div className="mt-4 pt-4 border-t">
                    <label className="text-sm text-gray-500">Description</label>
                    <p className="mt-1 text-gray-700">{company.description}</p>
                  </div>
                )}
              </div>
            )}

            {/* تبويب العروض (Internships) */}
            {activeTab === 'internships' && (
              <div className="space-y-3">
                {internships.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No internships posted yet</p>
                  </div>
                ) : (
                  internships.map(internship => (
                    <div key={internship.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{internship.title}</h3>
                          <p className="text-sm text-gray-600">{internship.location} • {internship.duration} months</p>
                          <p className="text-xs text-gray-500">Posted: {new Date(internship.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            internship.status === 'active' ? 'bg-green-100 text-green-700' :
                            internship.status === 'closed' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {internship.status}
                          </span>
                          <span className="text-sm font-semibold text-indigo-600">
                            {internship.applications_count || 0} applications
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* تبويب التطبيقات (Applications) */}
            {activeTab === 'applications' && (
              <div className="space-y-3">
                {applications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No applications received yet</p>
                  </div>
                ) : (
                  applications.map(app => (
                    <div key={app.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{app.internship_title}</h3>
                          <p className="text-sm text-gray-600">Student: {app.student_name}</p>
                          <p className="text-xs text-gray-500">Applied: {new Date(app.applied_at).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;