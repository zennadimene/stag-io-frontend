import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Building2, 
  MapPin, 
  Clock, 
  DollarSign, 
  Code,
  Briefcase,
  CheckCircle,
  XCircle,
  ArrowLeft
} from 'lucide-react';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CompareInternships = () => {
  const navigate = useNavigate();
  const { internshipId } = useParams();
  const [mainInternship, setMainInternship] = useState(null);
  const [similarInternships, setSimilarInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComparisonData();
  }, [internshipId]);

  const fetchComparisonData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      //const mainRes = await axios.get(`http://localhost:5000/api/internships/${internshipId}`, {
      const mainRes = await axios.get(`${BASE}/api/internships/${internshipId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (mainRes.data.success) {
        setMainInternship(mainRes.data.internship);
        
        const similarRes = await axios.get(
          //`http://localhost:5000/api/internships/${internshipId}/similar`,
          `${BASE}/api/internships/${internshipId}/similar`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (similarRes.data.success) {
          setSimilarInternships(similarRes.data.similar);
        }
      }
    } catch (error) {
      toast.error('Error loading comparison data');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (id) => {
    navigate(`/internships/${id}?apply=true`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading comparison data...</p>
        </div>
      </div>
    );
  }

  if (!mainInternship) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Internship not found</h2>
          <p className="text-gray-600 mb-6">The internship you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // تحديد عدد الأعمدة
  const totalColumns = 1 + 1 + similarInternships.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Saved</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Compare Internships</h1>
            <p className="text-gray-600 text-lg">See how this internship compares to similar opportunities</p>
          </div>
        </div>

        {/* Comparison Table - Design محسن */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
        >
          {/* Scrollable wrapper للجداول الكبيرة */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              
              {/* Header Row */}
              <div className="grid border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white" style={{ gridTemplateColumns: `repeat(${totalColumns}, minmax(0, 1fr))` }}>
                <div className="p-5 font-bold text-gray-700 border-r border-gray-200 bg-gray-50/50">
                  <span className="text-lg">📊 Features</span>
                </div>
                <div className="p-5 bg-gradient-to-r from-blue-50 to-blue-100/50 border-r border-gray-200">
                  <h2 className="font-bold text-xl text-blue-800">{mainInternship.title}</h2>
                  <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                    Current Selection
                  </p>
                </div>
                {similarInternships.map((internship, index) => (
                  <div key={internship.id} className="p-5 bg-gradient-to-r from-green-50 to-emerald-50/50">
                    <h2 className="font-bold text-lg text-gray-800">{internship.title}</h2>
                    <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                      <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
                      Similar Opportunity
                    </p>
                  </div>
                ))}
              </div>

              {/* Company Row */}
              <div className="grid border-b border-gray-100 hover:bg-gray-50/50 transition-colors" style={{ gridTemplateColumns: `repeat(${totalColumns}, minmax(0, 1fr))` }}>
                <div className="p-4 font-semibold text-gray-700 border-r border-gray-100 bg-gray-50/30 flex items-center gap-2">
                  <Building2 size={18} className="text-blue-500" />
                  Company
                </div>
                <div className="p-4 border-r border-gray-100 font-medium text-gray-900">{mainInternship.company_name}</div>
                {similarInternships.map((internship, index) => (
                  <div key={index} className="p-4 text-gray-700">{internship.company_name}</div>
                ))}
              </div>

              {/* Location Row */}
              <div className="grid border-b border-gray-100 hover:bg-gray-50/50 transition-colors" style={{ gridTemplateColumns: `repeat(${totalColumns}, minmax(0, 1fr))` }}>
                <div className="p-4 font-semibold text-gray-700 border-r border-gray-100 bg-gray-50/30 flex items-center gap-2">
                  <MapPin size={18} className="text-red-500" />
                  Location
                </div>
                <div className="p-4 border-r border-gray-100">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    📍 {mainInternship.location}
                  </span>
                </div>
                {similarInternships.map((internship, index) => (
                  <div key={index} className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                      internship.location === mainInternship.location 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      📍 {internship.location}
                    </span>
                  </div>
                ))}
              </div>

              {/* Type Row */}
              <div className="grid border-b border-gray-100 hover:bg-gray-50/50 transition-colors" style={{ gridTemplateColumns: `repeat(${totalColumns}, minmax(0, 1fr))` }}>
                <div className="p-4 font-semibold text-gray-700 border-r border-gray-100 bg-gray-50/30 flex items-center gap-2">
                  <Briefcase size={18} className="text-purple-500" />
                  Type
                </div>
                <div className="p-4 border-r border-gray-100 capitalize">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {mainInternship.type}
                  </span>
                </div>
                {similarInternships.map((internship, index) => (
                  <div key={index} className="p-4 capitalize">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                      internship.type === mainInternship.type 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {internship.type}
                    </span>
                  </div>
                ))}
              </div>

              {/* Duration Row */}
              <div className="grid border-b border-gray-100 hover:bg-gray-50/50 transition-colors" style={{ gridTemplateColumns: `repeat(${totalColumns}, minmax(0, 1fr))` }}>
                <div className="p-4 font-semibold text-gray-700 border-r border-gray-100 bg-gray-50/30 flex items-center gap-2">
                  <Clock size={18} className="text-orange-500" />
                  Duration
                </div>
                <div className="p-4 border-r border-gray-100 font-medium">{mainInternship.duration} months</div>
                {similarInternships.map((internship, index) => (
                  <div key={index} className="p-4">
                    <span className={internship.duration === mainInternship.duration ? 'text-green-600 font-semibold' : 'text-gray-600'}>
                      {internship.duration} months
                      {internship.duration === mainInternship.duration && (
                        <CheckCircle size={14} className="inline ml-1 text-green-500" />
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {/* Stipend Row */}
              <div className="grid border-b border-gray-100 hover:bg-gray-50/50 transition-colors" style={{ gridTemplateColumns: `repeat(${totalColumns}, minmax(0, 1fr))` }}>
                <div className="p-4 font-semibold text-gray-700 border-r border-gray-100 bg-gray-50/30 flex items-center gap-2">
                  <DollarSign size={18} className="text-green-500" />
                  Stipend
                </div>
                <div className="p-4 border-r border-gray-100">
                  <span className="font-semibold text-green-600">
                    {mainInternship.stipend ? `$${mainInternship.stipend}/month` : 'Unpaid'}
                  </span>
                </div>
                {similarInternships.map((internship, index) => (
                  <div key={index} className="p-4">
                    <span className={internship.stipend > 0 ? 'text-green-600' : 'text-gray-500'}>
                      {internship.stipend ? `$${internship.stipend}/month` : 'Unpaid'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Skills Row */}
              <div className="grid border-b border-gray-100 hover:bg-gray-50/50 transition-colors" style={{ gridTemplateColumns: `repeat(${totalColumns}, minmax(0, 1fr))` }}>
                <div className="p-4 font-semibold text-gray-700 border-r border-gray-100 bg-gray-50/30 flex items-center gap-2">
                  <Code size={18} className="text-indigo-500" />
                  Key Skills
                </div>
                <div className="p-4 border-r border-gray-100">
                  <div className="flex flex-wrap gap-1.5">
                    {mainInternship.required_skills?.slice(0, 4).map((skill, i) => (
                      <span key={i} className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                {similarInternships.map((internship, index) => (
                  <div key={index} className="p-4">
                    <div className="flex flex-wrap gap-1.5">
                      {internship.required_skills?.slice(0, 4).map((skill, i) => (
                        <span key={i} className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                          mainInternship.required_skills?.includes(skill)
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {skill}
                          {mainInternship.required_skills?.includes(skill) && (
                            <CheckCircle size={10} className="inline ml-1 text-green-500" />
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons Row - تصميم محسن */}
              <div className="grid bg-gray-50/80 rounded-b-2xl" style={{ gridTemplateColumns: `repeat(${totalColumns}, minmax(0, 1fr))` }}>
                <div className="p-5 border-r border-gray-200">
                  <span className="font-semibold text-gray-700">Actions</span>
                </div>
                
                {/* زر التدريب الرئيسي */}
                <div className="p-5 border-r border-gray-200">
                  <button
                    onClick={() => handleApply(mainInternship.id)}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                  >
                    <span>📝</span>
                    Apply Now
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
                
                {/* أزرار التدريبات المشابهة */}
                {similarInternships.map((internship, index) => (
                  <div key={index} className="p-5">
                    <button
                      onClick={() => handleApply(internship.id)}
                      className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                    >
                      <span>📝</span>
                      Apply Now
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </motion.div>

        {/* No similar internships message - تصميم محسن */}
        {similarInternships.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-8 text-center"
          >
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-yellow-800 mb-2">No similar internships found</h3>
            <p className="text-yellow-700 mb-6">
              Try browsing more internships or check back later for new opportunities.
            </p>
            <button
              onClick={() => navigate('/internships')}
              className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 text-white rounded-xl hover:from-yellow-700 hover:to-amber-700 transition-all duration-300 font-medium shadow-md"
            >
              Browse Internships →
            </button>
          </motion.div>
        )}

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <span className="text-xl">💡</span>
            Comparison Tips
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-700">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600" />
              <span>Green highlights show matching features</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 bg-indigo-100 rounded"></span>
              <span>Skills in green match your current selection</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 bg-green-100 rounded-full"></span>
              <span>Similar opportunities have their own Apply buttons</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CompareInternships;