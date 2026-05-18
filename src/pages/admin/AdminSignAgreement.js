import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import SignatureCanvas from 'react-signature-canvas';

const AdminSignAgreement = () => {
  const navigate = useNavigate();
  const { agreementId } = useParams();
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);
  
  // Signature state
  const [signature, setSignature] = useState(null);
  const [signatureType, setSignatureType] = useState('draw');
  const [typedName, setTypedName] = useState('');
  const sigCanvas = useRef(null);

  useEffect(() => {
    fetchAgreement();
  }, [agreementId]);

  const fetchAgreement = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://stag-io-backend.onrender.com/api/admin/agreements/${agreementId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setAgreement(response.data.agreement);
        setSigned(response.data.agreement.university_signed || false);
      }
    } catch (error) {
      console.error('Error fetching agreement:', error);
      toast.error('Error loading agreement');
    } finally {
      setLoading(false);
    }
  };

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setSignature(null);
    }
    setTypedName('');
  };

  const saveSignature = () => {
    console.log('📝 Admin saveSignature called');
    console.log('signatureType:', signatureType);
    
    if (signatureType === 'draw' && sigCanvas.current) {
      if (sigCanvas.current.isEmpty()) {
        toast.error('Please draw your signature first');
        return false;
      }
      const signatureData = sigCanvas.current.toDataURL();
      console.log('Signature saved, length:', signatureData.length);
      setSignature(signatureData);
      toast.success('University signature saved!');
      return true;
    } else if (signatureType === 'type' && typedName.trim()) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 400;
      canvas.height = 100;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '30px "Dancing Script", cursive';
      ctx.fillStyle = '#000000';
      ctx.fillText(typedName, 20, 60);
      const signatureData = canvas.toDataURL();
      setSignature(signatureData);
      toast.success('University signature saved!');
      return true;
    } else {
      toast.error('Please enter your name or draw your signature');
      return false;
    }
  };

  const handleSignAgreement = async () => {
    console.log('🔵 Admin handleSignAgreement called');
    console.log('signature exists?', signature ? 'YES' : 'NO');
    
    if (!signature) {
      toast.error('Please add your university signature first');
      return;
    }
    
    try {
      setSigning(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `http://stag-io-backend.onrender.com/api/admin/agreements/${agreementId}/sign`,
        { 
          signature: signature,
          signature_type: signatureType,
          typed_name: typedName
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setSigned(true);
        toast.success('✅ Agreement signed by university successfully!');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Error signing agreement:', error);
      toast.error(error.response?.data?.message || 'Error signing agreement');
    } finally {
      setSigning(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate('/admin/agreements')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-4"
          >
            ← Back to Agreements
          </button>
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-500">Agreement not found</p>
          </div>
        </div>
      </div>
    );
  }

  if (signed) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-8 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Agreement Already Signed!</h1>
            <p className="text-gray-600 mb-6">
              The university has already signed this agreement.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate('/admin/agreements')}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-4"
        >
          ← Back to Agreements
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white">University Sign Agreement</h1>
            <p className="text-purple-100 mt-2">Please review and sign the internship agreement as university</p>
          </div>

          <div className="p-8">
            {/* Agreement Summary */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{agreement.internship_title}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-gray-600">🏢 {agreement.company_name}</div>
                <div className="text-gray-600">👤 {agreement.student_name}</div>
                <div className="text-gray-600">📅 {agreement.duration} months</div>
                <div className="text-green-600 font-medium">💰 {agreement.stipend} DZD/month</div>
              </div>
            </div>

            {/* Signatures Status */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Signatures Status</h3>
              <div className="flex flex-wrap gap-6">
                <div className={`flex items-center gap-2 ${agreement.student_signed ? 'text-green-600' : 'text-gray-400'}`}>
                  ✅ Student: {agreement.student_signed ? 'Signed' : 'Pending'}
                </div>
                <div className={`flex items-center gap-2 ${agreement.company_signed ? 'text-green-600' : 'text-gray-400'}`}>
                  ✅ Company: {agreement.company_signed ? 'Signed' : 'Pending'}
                </div>
                <div className="flex items-center gap-2 text-purple-600">
                  🎓 University: Ready to Sign
                </div>
              </div>
            </div>

            {/* Signature Section */}
            <div className="border-t pt-8">
              <h3 className="font-semibold text-gray-900 mb-4">University Digital Signature</h3>
              
              {/* Signature Type Buttons */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setSignatureType('draw')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    signatureType === 'draw' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ✍️ Draw Signature
                </button>
                <button
                  onClick={() => setSignatureType('type')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    signatureType === 'type' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ⌨️ Type Signature
                </button>
              </div>

              {/* Draw Signature Canvas */}
              {signatureType === 'draw' && (
                <div className="mb-6">
                  <div className="border-2 border-gray-300 rounded-lg p-2 bg-white">
                    <SignatureCanvas
                      ref={sigCanvas}
                      canvasProps={{
                        width: 500,
                        height: 150,
                        className: 'w-full border rounded bg-white'
                      }}
                      backgroundColor="white"
                      penColor="purple"
                    />
                  </div>
                  <button
                    onClick={clearSignature}
                    className="mt-2 text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear Signature
                  </button>
                </div>
              )}

              {/* Type Signature Input */}
              {signatureType === 'type' && (
                <div className="mb-6">
                  <input
                    type="text"
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    placeholder="Type university representative name as signature"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    By typing your name, you confirm that the internship meets academic requirements.
                  </p>
                </div>
              )}

              {/* Save Signature Button */}
              {!signature && (
                <button
                  onClick={saveSignature}
                  className="w-full mb-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                >
                  💾 Save University Signature
                </button>
              )}

              {/* Signature Preview */}
              {signature && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">University Signature Preview:</p>
                  <img 
                    src={signature} 
                    alt="University Signature" 
                    className="max-h-20 object-contain border rounded p-2 bg-white"
                  />
                  <button
                    onClick={clearSignature}
                    className="mt-2 text-sm text-red-500 hover:text-red-700"
                  >
                    Remove Signature
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleSignAgreement}
                  disabled={signing || !signature}
                  className="flex-1 bg-purple-600 text-white py-4 rounded-xl hover:bg-purple-700 font-medium disabled:opacity-50"
                >
                  {signing ? 'Signing...' : '🎓 Sign as University'}
                </button>
                <button
                  onClick={() => navigate('/admin/agreements')}
                  className="flex-1 bg-gray-200 text-gray-800 py-4 rounded-xl hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSignAgreement;