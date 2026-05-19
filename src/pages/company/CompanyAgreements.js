import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  FileText, 
  Download, 
  Eye, 
  ArrowLeft,
  Building,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  FileSignature
} from 'lucide-react';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CompanyAgreements = () => {
  const navigate = useNavigate();
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.user_type !== 'company') {
      navigate('/login');
      return;
    }
    
    fetchAgreements();
  }, [navigate]);

  const fetchAgreements = async () => {
    try {
      const token = localStorage.getItem('token');
      //const response = await axios.get('http://localhost:5000/api/company/agreements', {
      const response = await axios.get(`${BASE}/api/company/agreements`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setAgreements(response.data.agreements);
      }
    } catch (error) {
      console.error('Error fetching agreements:', error);
      toast.error('Error fetching agreements');
    } finally {
      setLoading(false);
    }
  };

  // حساب الأرقام الصحيحة للبطاقات والتبويبات
const awaitingCount = agreements.filter(a => !a.company_signed).length;
const signedCount = agreements.filter(a => a.company_signed === 1 && a.university_signed !== 1).length;
const completedCount = agreements.filter(a => 
  a.student_signed === 1 && a.company_signed === 1 && a.university_signed === 1
).length;

  const viewAgreement = (agreementId) => {
    navigate(`/company/agreements/${agreementId}/view`);
  };

 const downloadAgreement = async (agreementId) => {
  try {
    const token = localStorage.getItem('token');
    // ✅ استخدم نفس الرابط (لكن تأكد من أن الـ Backend للشركة ينتج CONVENTION DE STAGE)
    const response = await axios.get(
     // `http://localhost:5000/api/company/agreements/${agreementId}/download`,
      `${BASE}/api/company/agreements/${agreementId}/download`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      }
    );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `convention_stage_${agreementId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Convention de Stage downloaded successfully!');
    } catch (error) {
      console.error('Error downloading:', error);
      toast.error('Error downloading Convention de Stage');
    }
  };


  // استبدال دالة signAgreement الحالية بـ:
const signAgreement = (agreementId) => {
  navigate(`/company/agreements/${agreementId}/sign`);
};

  /*const signAgreement = async (agreementId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/company/agreements/${agreementId}/sign`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success('✅ Agreement signed successfully!');
        fetchAgreements();
      }
    } catch (error) {
      console.error('Error signing agreement:', error);
      toast.error(error.response?.data?.message || 'Error signing agreement');
    }
  };
*/
 const getStatusBadge = (agreement) => {
  const { status, student_signed, company_signed, university_signed } = agreement;
  
  // ✅ إذا وقع الجميع
  if (student_signed && company_signed && university_signed) {
    return {
      color: 'bg-green-100 text-green-800',
      icon: <CheckCircle size={16} />,
      label: 'Completed'
    };
  }
  
  // ✅ إذا وقع الطالب والشركة فقط
  if (student_signed && company_signed && !university_signed) {
    return {
      color: 'bg-yellow-100 text-yellow-800',
      icon: <Clock size={16} />,
      label: 'Awaiting University'
    };
  }
  
  // ✅ إذا وقع الطالب فقط
  if (student_signed && !company_signed) {
    return {
      color: 'bg-blue-100 text-blue-800',
      icon: <Clock size={16} />,
      label: 'Awaiting Your Signature'
    };
  }
  
  // ✅ لم يوقع أحد
  return {
    color: 'bg-gray-100 text-gray-800',
    icon: <FileText size={16} />,
    label: 'Pending'
  };
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
  if (filter === 'all') return true;
  
  // Awaiting Signature: الشركة لم توقع
  if (filter === 'pending') {
    return !agreement.company_signed;
  }
  
  // ✅ Signed: الشركة وقعت، ولكن الجامعة لم توقع (استبعاد completed)
  if (filter === 'signed') {
    return agreement.company_signed === 1 && agreement.university_signed !== 1;
  }
  
  // ✅ Completed: جميع الأطراف وقعوا
  if (filter === 'completed') {
    return agreement.student_signed === 1 && 
           agreement.company_signed === 1 && 
           agreement.university_signed === 1;
  }
  
  return true;
});
/*
  const filteredAgreements = agreements.filter(agreement => {
    if (filter === 'all') return true;
    if (filter === 'pending') {
      return !agreement.company_signed;
    }
    if (filter === 'signed') {
      return agreement.company_signed;
    }
    if (filter === 'completed') {
      return agreement.status === 'completed';
    }
    return true;
  });*/

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Internship Agreements</h1>
                <p className="text-gray-600 mt-2">Manage and sign internship agreements</p>
              </div>
              <button
                onClick={() => navigate('/company/dashboard')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft size={20} />
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Agreements</p>
                  <p className="text-3xl font-bold text-gray-900">{agreements.length}</p>
                </div>
                <FileText className="text-blue-600" size={32} />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Awaiting Signature</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {agreements.filter(a => !a.company_signed).length}
                  </p>
                </div>
                <Clock className="text-yellow-600" size={32} />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Signed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {agreements.filter(a => a.company_signed === 1 && a.university_signed !== 1).length}
                  </p>
                </div>
                <CheckCircle className="text-green-600" size={32} />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Completed</p>
                  <p className="text-3xl font-bold text-purple-600">
                     {agreements.filter(a => a.student_signed === 1 && a.company_signed === 1 && a.university_signed === 1).length}
                  </p>
                </div>
                <FileSignature className="text-purple-600" size={32} />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow p-4 mb-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                All ({agreements.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-700'}`}
              >
                Awaiting Signature ({agreements.filter(a => !a.company_signed).length})
              </button>
              <button
                onClick={() => setFilter('signed')}
                className={`px-4 py-2 rounded-lg font-medium ${filter === 'signed' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'}`}
              >
                Signed ({signedCount})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium ${filter === 'completed' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'}`}
              >
                Completed ({completedCount})
              </button>
            </div>
          </div>

          {/* Agreements List */}
          {filteredAgreements.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-12 text-center">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No agreements found</h3>
              <p className="text-gray-500">You don't have any internship agreements yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredAgreements.map((agreement) => {
                const badge = getStatusBadge(agreement);
                
                return (
                  <motion.div
                    key={agreement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {agreement.internship_title}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            Student: {agreement.student_name}
                          </p>
                        </div>
                        <div className="mt-4 lg:mt-0">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
                            {badge.icon}
                            {badge.label}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500">University</p>
                          <p className="font-semibold">{agreement.university_name || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500">Generated</p>
                          <p className="font-semibold">{formatDate(agreement.generated_at)}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-semibold">{agreement.duration || '3'} months</p>
                        </div>
                      </div>

                     {/* Signatures Status */}
<div className="mb-6">
  <h4 className="font-semibold text-gray-900 mb-3">Signatures Status</h4>
  <div className="flex flex-wrap gap-4">
    <div className={`flex items-center gap-2 ${agreement.student_signed ? 'text-green-600' : 'text-gray-400'}`}>
      <CheckCircle size={16} />
      <span>Student Signature {agreement.student_signed ? '✓' : '✗'}</span>
    </div>
    <div className={`flex items-center gap-2 ${agreement.company_signed ? 'text-green-600' : 'text-gray-400'}`}>
      <CheckCircle size={16} />
      <span>Your Signature {agreement.company_signed ? '✓' : '✗'}</span>
    </div>
    {/* ✅ أضف هذا القسم - توقيع الجامعة */}
    <div className={`flex items-center gap-2 ${agreement.university_signed ? 'text-green-600' : 'text-gray-400'}`}>
      <CheckCircle size={16} />
      <span>University Signature {agreement.university_signed ? '✓' : '✗'}</span>
    </div>
  </div>
</div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 pt-6 border-t">
                        <button
                          onClick={() => viewAgreement(agreement.id)}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          <Eye size={16} />
                          Preview
                        </button>
                        
                        <button
                          onClick={() => downloadAgreement(agreement.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <Download size={16} />
                          Download PDF
                        </button>
                        
                        {!agreement.company_signed && (
                          <button
                            onClick={() => signAgreement(agreement.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            <FileSignature size={16} />
                            Sign Agreement
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyAgreements;