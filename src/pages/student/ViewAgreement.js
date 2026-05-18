import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast'; 
import { Download, Eye, ArrowLeft, Building, Calendar, DollarSign, CheckCircle } from 'lucide-react';

const ViewAgreement = () => {
  const navigate = useNavigate();
  const { agreementId } = useParams();
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState('');

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserType(user.user_type || '');
    fetchAgreement();
  }, [agreementId]);

  const fetchAgreement = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      let url = '';
      if (user.user_type === 'student') {
        url = `http://stag-io-backend.onrender.com/api/student/agreements/${agreementId}`;
      } else if (user.user_type === 'company') {
        url = `http://stag-io-backend.onrender.com/api/company/agreements/${agreementId}`;
      } else {
        toast.error('Invalid user type');
        setLoading(false);
        return;
      }
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setAgreement(response.data.agreement);
      }
    } catch (error) {
      console.error('Error fetching agreement:', error);
      toast.error('Error loading agreement');
    } finally {
      setLoading(false);
    }
  };

  const downloadAgreement = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      let url = '';
      if (user.user_type === 'student') {
        url = `http://stag-io-backend.onrender.com/api/student/agreements/${agreementId}/download`;
      } else if (user.user_type === 'company') {
        url = `http://stag-io-backend.onrender.com/api/company/agreements/${agreementId}/download`;
      } else {
        toast.error('Invalid user type');
        return;
      }
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url_blob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url_blob;
      link.setAttribute('download', `agreement_${agreementId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Agreement downloaded successfully!');  
    } catch (error) {
      console.error('Error downloading:', error);
      toast.error('Error downloading agreement');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-500">Agreement not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {agreement.internship_title}
            </h1>

            {/* Agreement Details */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-semibold flex items-center gap-2">
                  <Building size={16} />
                  {agreement.company_name}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Student</p>
                <p className="font-semibold">{agreement.student_name || 'Student'}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">University</p>
                <p className="font-semibold">{agreement.university_name || 'Not specified'}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Generated</p>
                <p className="font-semibold">{formatDate(agreement.generated_at)}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-semibold">{agreement.duration || '3'} months</p>
              </div>
              
              {agreement.stipend && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Stipend</p>
                  <p className="font-semibold flex items-center gap-2 text-green-600">
                    <DollarSign size={16} />
                    {agreement.stipend} DZD/month
                  </p>
                </div>
              )}
            </div>

            {/* Signatures Status */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Signatures Status</h4>
              <div className="flex flex-wrap gap-4">
                <div className={`flex items-center gap-2 ${agreement.student_signed ? 'text-green-600' : 'text-gray-400'}`}>
                  {agreement.student_signed ? <CheckCircle size={16} /> : <div className="w-4 h-4 rounded-full border-2 border-gray-400"></div>}
                  <span>Student Signature {agreement.student_signed ? '✓' : '✗'}</span>
                </div>
                
                <div className={`flex items-center gap-2 ${agreement.company_signed ? 'text-green-600' : 'text-gray-400'}`}>
                  {agreement.company_signed ? <CheckCircle size={16} /> : <div className="w-4 h-4 rounded-full border-2 border-gray-400"></div>}
                  <span>Company Signature {agreement.company_signed ? '✓' : '✗'}</span>
                </div>
                
                <div className={`flex items-center gap-2 ${agreement.university_signed ? 'text-green-600' : 'text-gray-400'}`}>
                  {agreement.university_signed ? <CheckCircle size={16} /> : <div className="w-4 h-4 rounded-full border-2 border-gray-400"></div>}
                  <span>University Signature {agreement.university_signed ? '✓' : '✗'}</span>
                </div>
              </div>
            </div>

            {/* Digital Signatures Images */}
            <div className="border-t pt-6 mt-6">
              <h2 className="font-semibold text-gray-900 mb-4">Digital Signatures</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Student Signature */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    👨‍🎓 Student Signature
                  </h3>
                  {agreement.student_signed && agreement.signature_url ? (
                    <>
                      <img 
                        src={`http://stag-io-backend.onrender.com${agreement.signature_url}`} 
                        alt="Student Signature"
                        className="max-h-20 object-contain border rounded bg-white p-2"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Signed: {formatDate(agreement.signed_at)}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-400 text-sm">Not signed yet</p>
                  )}
                </div>

                {/* Company Signature */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    🏢 Company Signature
                  </h3>
                  {agreement.company_signed && agreement.company_signature_url ? (
                    <>
                      <img 
                        src={`http://stag-io-backend.onrender.com${agreement.company_signature_url}`} 
                        alt="Company Signature"
                        className="max-h-20 object-contain border rounded bg-white p-2"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Signed: {formatDate(agreement.company_signed_at)}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-400 text-sm">Not signed yet</p>
                  )}
                </div>

                {/* University Signature */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    🎓 University Signature
                  </h3>
                  {agreement.university_signed && agreement.university_signature_url ? (
                    <>
                      <img 
                        src={`http://stag-io-backend.onrender.com${agreement.university_signature_url}`} 
                        alt="University Signature"
                        className="max-h-20 object-contain border rounded bg-white p-2"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Signed: {formatDate(agreement.completed_at)}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-400 text-sm">Not signed yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Agreement Terms */}
            <div className="border-t pt-6 mt-6">
              <h2 className="font-semibold text-gray-900 mb-4">Agreement Terms</h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-gray-700">
                  This agreement is between <strong>{agreement.student_name || 'Student'}</strong> and 
                  <strong> {agreement.company_name}</strong> for the position of 
                  <strong> {agreement.internship_title}</strong>.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={downloadAgreement}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download size={20} />
                Download PDF
              </button>
              
              {userType === 'student' && !agreement.student_signed && (
                <button
                  onClick={() => navigate(`/student/agreements/${agreementId}/sign`)}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  ✍️ Sign Agreement
                </button>
              )}
              
              <button
                onClick={() => navigate(userType === 'student' ? '/student/agreements' : '/company/agreements')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                View All Agreements
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ViewAgreement;