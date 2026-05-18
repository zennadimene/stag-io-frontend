// src/components/student/Agreements.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Printer,
  Eye,
  FileSignature,
  Building,
  Calendar,
  DollarSign
} from 'lucide-react';

const Agreements = () => {
  const navigate = useNavigate();
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.user_type !== 'student') {
      navigate('/login');
      return;
    }
    
    fetchAgreements();
  }, [navigate]);

  const fetchAgreements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://stag-io-backend.onrender.com/api/student/agreements', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setAgreements(response.data.agreements);
      }
    } catch (error) {
      toast.error('Error fetching agreements');
    } finally {
      setLoading(false);
    }
  };


const viewAgreement = (agreementId) => {
  navigate(`/student/agreements/${agreementId}/view`);
};

// تحميل PDF (لديك بالفعل `downloadAgreement`)
// ✅ هذه الدالة موجودة بالفعل

// توقيع الاتفاقية (هذه تحتاج إضافتها)
// ✅ دالة التوقيع - توجه المستخدم إلى صفحة التوقيع
const signAgreement = (agreementId) => {
  // ✅ بدلاً من التوقيع مباشرة، ننقل المستخدم لصفحة التوقيع
  navigate(`/student/agreements/${agreementId}/sign`);
};
/*const signAgreement = async (agreementId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `http://localhost:5000/api/student/agreements/${agreementId}/sign`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (response.data.success) {
      toast.success('✅ Agreement signed successfully!');
      fetchAgreements(); // تحديث القائمة
    }
  } catch (error) {
    console.error('Error signing agreement:', error);
    toast.error(error.response?.data?.message || 'Error signing agreement');
  }
};*/



 const downloadAgreement = async (agreementId) => {
  try {
    const token = localStorage.getItem('token');
    
    // ✅ هذا الرابط ينتج CONVENTION DE STAGE (مع social_security و academic_supervisor)
    const response = await axios.get(
      `http://stag-io-backend.onrender.com/api/student/agreements/${agreementId}/download`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      }
    );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      // ✅ تغيير اسم الملف ليعكس Convention de Stage
      link.setAttribute('download', `convention_stage_${agreementId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Convention de Stage downloaded successfully!');
    } catch (error) {
      console.error('Error downloading agreement:', error);
      toast.error('Error downloading Convention de Stage. Please try again.');
    }
  };

  

 const getStatusBadge = (status) => {
  const statusConfig = {
    'draft': { color: 'bg-gray-100 text-gray-800', icon: <FileText size={16} />, label: 'Draft' },
    'pending': { color: 'bg-yellow-100 text-yellow-800', icon: <Clock size={16} />, label: 'Pending Signature' },
    'pending_signature': { color: 'bg-yellow-100 text-yellow-800', icon: <Clock size={16} />, label: 'Pending Signature' },
    'pending_university': { color: 'bg-blue-100 text-blue-800', icon: <AlertCircle size={16} />, label: 'Awaiting University' },
    'pending_company': { color: 'bg-purple-100 text-purple-800', icon: <Building size={16} />, label: 'Awaiting Company' },
    'signed': { color: 'bg-green-100 text-green-800', icon: <CheckCircle size={16} />, label: 'Signed' },
    'active': { color: 'bg-green-100 text-green-800', icon: <CheckCircle size={16} />, label: 'Active' },
    'completed': { color: 'bg-blue-100 text-blue-800', icon: <CheckCircle size={16} />, label: 'Completed' },
    'cancelled': { color: 'bg-red-100 text-red-800', icon: <AlertCircle size={16} />, label: 'Cancelled' }
  };
  
  // ✅ تحويل status من قاعدة البيانات إلى المفتاح الصحيح
  let configKey = status;
  if (status === 'pending') {
    configKey = 'pending_signature';
  }
  
  const config = statusConfig[configKey] || statusConfig.draft;
  
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

const filteredAgreements = agreements.filter(agreement => {
    switch(filter) {
        case 'all':
            return true;
            
        case 'pending_signature':
            // يحتاج توقيع الطالب (لم يوقع بعد)
            return agreement.student_signed === 0;
            
        case 'signed':
            // وقع الطالب والشركة (الجامعة لم توقع بعد)
            return agreement.student_signed === 1 && agreement.company_signed === 1 && agreement.university_signed === 0;
            
        case 'active':
            // ✅ جميع الأطراف وقعوا (الطالب + الشركة + الجامعة)
            return agreement.student_signed === 1 && 
                   agreement.company_signed === 1 && 
                   agreement.university_signed === 1;
            
        case 'completed':
            // اتفاقية مكتملة (انتهت فترة التدريب)
            return agreement.status === 'completed';
            
        default:
            return true;
    }
});

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-lg text-gray-600">Loading agreements...</div>
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
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Internship Agreements</h1>
                <p className="text-gray-600 mt-2">Manage and track your internship agreements</p>
              </div>
              <button
                onClick={() => navigate('/student/dashboard')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>

         {/* Stats */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
  {/* Total Agreements */}
  <div className="bg-white rounded-xl shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">Total Agreements</p>
        <p className="text-3xl font-bold text-gray-900">
          {agreements.length}  {/* ✅ كل الاتفاقيات */}
        </p>
      </div>
      <FileText className="text-blue-600" size={32} />
    </div>
  </div>
  
  {/* Active */}
  <div className="bg-white rounded-xl shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">Active</p>
        <p className="text-3xl font-bold text-gray-900">
          {agreements.filter(a => a.status === 'active').length}
        </p>
      </div>
      <CheckCircle className="text-green-600" size={32} />
    </div>
  </div>
  
 {/* Pending Signature */}
<div className="bg-white rounded-xl shadow p-6">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-gray-500 text-sm">Pending Signature</p>
      <p className="text-3xl font-bold text-gray-900">
        {agreements.filter(a => 
          a.status === 'pending' || 
          a.status === 'pending_signature' ||
          (a.status === 'signed' && (!a.company_signed || !a.university_signed))
        ).length}
      </p>
    </div>
    <Clock className="text-yellow-600" size={32} />
  </div>
</div>
  
  {/* Completed */}
  <div className="bg-white rounded-xl shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">Completed</p>
        <p className="text-3xl font-bold text-gray-900">
          {agreements.filter(a => a.status === 'completed').length}
        </p>
      </div>
      <FileSignature className="text-purple-600" size={32} />
    </div>
  </div>
</div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                All Agreements
              </button>
              <button
  onClick={() => setFilter('pending_signature')}
  className={`px-4 py-2 rounded-lg font-medium ${filter === 'pending_signature' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
>
  Needs Signature
</button>
  <button
      onClick={() => setFilter('signed')}
      className={`px-4 py-2 rounded-lg font-medium ${filter === 'signed' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
    >
      Signed
    </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg font-medium ${filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Agreements List */}
          <div className="space-y-6">
            {agreements.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-12 text-center">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No agreements yet</h3>
                <p className="text-gray-500 mb-6">
                  Your internship agreements will appear here once your applications are accepted.
                </p>
                <button
                  onClick={() => navigate('/internships')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Browse Internships
                </button>
              </div>
            ) : (
              filteredAgreements.map((agreement) => (
                <motion.div
                  key={agreement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {agreement.internship_title}
                        </h3>
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Building size={16} />
                            <span>{agreement.company_name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar size={16} />
                            <span>{formatDate(agreement.start_date)} - {formatDate(agreement.end_date)}</span>
                          </div>
                          {agreement.stipend && (
                            <div className="flex items-center gap-2 text-green-600 font-medium">
                              <DollarSign size={16} />
                              <span>{agreement.stipend} DZD/month</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 lg:mt-0">
                        {getStatusBadge(agreement.status)}
                      </div>
                    </div>

                    {/* Agreement Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Duration</p>
                        <p className="font-semibold">{agreement.duration} months</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Supervisor</p>
                        <p className="font-semibold">{agreement.supervisor_name || 'Not assigned'}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">University Coordinator</p>
                        <p className="font-semibold">{agreement.coordinator_name || 'Not assigned'}</p>
                      </div>
                    </div>

                    {/* Signatures Status */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Signatures Status</h4>
                      <div className="flex flex-wrap gap-4">
                        <div className={`flex items-center gap-2 ${agreement.student_signed ? 'text-green-600' : 'text-gray-400'}`}>
                          <CheckCircle size={16} />
                          <span>Your Signature</span>
                        </div>
                        <div className={`flex items-center gap-2 ${agreement.company_signed ? 'text-green-600' : 'text-gray-400'}`}>
                          <CheckCircle size={16} />
                          <span>Company Signature</span>
                        </div>
                        <div className={`flex items-center gap-2 ${agreement.university_signed ? 'text-green-600' : 'text-gray-400'}`}>
                          <CheckCircle size={16} />
                          <span>University Signature</span>
                        </div>
                      </div>
                    </div>

                 {/* Actions */}
<div className="flex flex-wrap gap-3 pt-6 border-t">
  {/* Preview Agreement */}
  <button
    onClick={() => viewAgreement(agreement.id)}
    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
  >
    <Eye size={16} />
    Preview Agreement
  </button>
  
  {/* Download PDF */}
  <button
    onClick={() => downloadAgreement(agreement.id)}
    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
  >
    <Download size={16} />
    Download PDF
  </button>
  
  {/* ✅ Sign Agreement - يفتح صفحة التوقيع */}
  {(agreement.status === 'pending' || agreement.status === 'pending_signature') && !agreement.student_signed && (
    <button
      onClick={() => signAgreement(agreement.id)}  // ✅ هذه الدالة تنقل لصفحة التوقيع
      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
    >
      <FileSignature size={16} />
      Sign Agreement
    </button>
  )}
  
  {agreement.status === 'active' && (
    <button
      onClick={() => navigate(`/student/reports/${agreement.internship_id}`)}
      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
    >
      <FileText size={16} />
      Submit Report
    </button>
  )}
  
  {agreement.status === 'completed' && (
    <button
      onClick={() => navigate(`/student/rate-company/${agreement.company_id}/${agreement.internship_id}/${agreement.id}`)}
      className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
    >
      ⭐ Rate Company
    </button>
  )}
</div>
                      
                    
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Help Section */}
          <div className="mt-12 bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Need Help with Your Agreement?</h3>
            <ul className="text-blue-800 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-blue-600 mt-1" />
                <span>Contact your university coordinator for any questions about the agreement terms</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-blue-600 mt-1" />
                <span>Make sure all parties have signed before starting your internship</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-blue-600 mt-1" />
                <span>Keep a copy of the signed agreement for your records</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Agreements;