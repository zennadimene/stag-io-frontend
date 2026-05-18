// src/components/student/SavedInternships.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';


import { 
  Bookmark,
  BookmarkCheck,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Trash2,
  Eye,
  AlertCircle,
  Star
} from 'lucide-react';

const SavedInternships = () => {
  const navigate = useNavigate();
  const [savedInternships, setSavedInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.user_type !== 'student') {
      navigate('/login');
      return;
    }
    
    fetchSavedInternships();
    fetchRecommendations();
  }, [navigate]);

 const fetchSavedInternships = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log('🔍 Fetching saved internships...');
    
    const response = await axios.get('http://localhost:5000/api/student/saved-internships', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('📦 Full response:', response);
    console.log('📦 Response data:', response.data);
    
    if (response.data.success) {
      console.log('✅ Saved internships data:', response.data.savedInternships);
      console.log('📊 Length:', response.data.savedInternships.length);


       // ✅ أضف هذا السطر لترى كل internship_type
      response.data.savedInternships.forEach(item => {
        console.log(`ID: ${item.id}, Title: ${item.internship_title}, Type: ${item.internship_type}`);
      });

      
      setSavedInternships(response.data.savedInternships);


    } else {
      console.log('❌ Success false:', response.data);
    }
  } catch (error) {
    console.error('❌ Error fetching saved internships:', error);
    console.error('Error details:', error.response?.data);
    toast.error('Error fetching saved internships');
  } finally {
    setLoading(false);
  }
};


const fetchRecommendations = async () => {
  try {
    setLoadingRecs(true);
    const token = localStorage.getItem('token');
    
    const response = await axios.get('http://localhost:5000/api/student/saved-internships/recommendations', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('📊 Recommendations from API:', response.data);
    
    if (response.data.success) {
      setRecommendations(response.data.recommendations);
    }
  } catch (error) {
    console.error('Error fetching recommendations:', error);
  } finally {
    setLoadingRecs(false);
  }
};


  const removeSavedInternship = async (internshipId) => {
    try {
      setRemoving(internshipId);
      const token = localStorage.getItem('token');
      
      await axios.delete(
        `http://localhost:5000/api/student/saved-internships/${internshipId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setSavedInternships(savedInternships.filter(item => item.internship_id !== internshipId));
      toast.success('Internship removed from favorites');
    } catch (error) {
      console.error('Error removing saved internship:', error);
      toast.error('Error removing internship. Please try again.');
    } finally {
      setRemoving(null);
    }
  };

  const removeAllSaved = async () => {
    if (!window.confirm('Are you sure you want to remove all favorite internships?')) {
      return;
    }
    

    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5000/api/student/saved-internships', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSavedInternships([]);
      toast.success('All favorite internships have been removed.');
    } catch (error) {
      console.error('Error removing all saved internships:', error);
      toast.error('Error removing all favorite internships. Please try again.');
    }
  };

  const handleApply = (internshipId) => {
    navigate(`/internships/${internshipId}?apply=true`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-lg text-gray-600">Loading favorite internships...</div>
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
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-yellow-100 p-3 rounded-xl">
                    <Star className="text-yellow-600" size={28} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Favorite Internships</h1>
                    <p className="text-gray-600 mt-1">Internships you've favorited for later</p>
                  </div>
                </div>
              </div>
              
              {savedInternships.length > 0 && (
                <button
                  onClick={removeAllSaved}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={16} />
                  Remove All Favorites
                </button>
              )}
            </div>
          </div>

          

          {/* Stats */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  <div className="bg-white rounded-xl shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">Total Favorites</p>
        <p className="text-3xl font-bold text-gray-900">{savedInternships.length}</p>
      </div>
      <Star className="text-blue-600" size={32} />
    </div>
  </div>
  
  <div className="bg-white rounded-xl shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">Remote Positions</p>
        <p className="text-3xl font-bold text-gray-900">
          {savedInternships.filter(item => {
            // طباعة القيم للتصحيح
            console.log('Checking item:', item.id, 'type:', item.internship_type);
            
            // التحقق من القيمة
            const type = (item.internship_type || '').toLowerCase();
            return type === 'remote';
          }).length}
        </p>
      </div>
      <div className="text-green-600">🌐</div>
    </div>
  </div>
  
  <div className="bg-white rounded-xl shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">With Deadlines</p>
        <p className="text-3xl font-bold text-gray-900">
          {savedInternships.filter(item => item.deadline).length}
        </p>
      </div>
      <Clock className="text-red-600" size={32} />
    </div>
  </div>
</div>

          {/* Internships List */}
          <div className="space-y-6">
            {savedInternships.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-12 text-center">
                <Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorite internships yet</h3>
                <p className="text-gray-500 mb-6">
                  Save internships by clicking the bookmark icon while browsing opportunities.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/internships')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Browse Internships
                  </button>
                  <button
                    onClick={() => navigate('/student/dashboard')} 
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <AnimatePresence>
                {savedInternships.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-200"
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Star size={20} className="text-yellow-500 fill-yellow-500" />
                            <h3 className="text-xl font-bold text-gray-900">
                              {item.internship_title}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              item.internship_type === 'remote' ? 'bg-green-100 text-green-800' :
                              item.internship_type === 'part-time' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {item.internship_type}
                            </span>
                          </div>
                          <p className="text-gray-600 font-medium">{item.company_name}</p>
                        </div>
                        
                        <div className="mt-4 lg:mt-0 flex items-center gap-3">
                          <span className="text-sm text-gray-500">
                            Saved on {formatDate(item.saved_at)}
                          </span>
                          <button
                            onClick={() => removeSavedInternship(item.internship_id)}
                            disabled={removing === item.internship_id}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                          >
                            {removing === item.internship_id ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                            ) : (
                              <Trash2 size={20} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <MapPin className="text-gray-400" size={18} />
                          <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="font-semibold">{item.location}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Clock className="text-gray-400" size={18} />
                          <div>
                            <p className="text-sm text-gray-500">Duration</p>
                            <p className="font-semibold">{item.duration} months</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <DollarSign className="text-gray-400" size={18} />
                          <div>
                            <p className="text-sm text-gray-500">Stipend</p>
                            <p className="font-semibold">
                              {item.stipend ? `$${item.stipend}/month` : 'Unpaid'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Calendar className="text-gray-400" size={18} />
                          <div>
                            <p className="text-sm text-gray-500">Deadline</p>
                            <p className={`font-semibold ${
                              item.deadline && new Date(item.deadline) < new Date() 
                                ? 'text-red-600' 
                                : ''
                            }`}>
                              {item.deadline ? formatDate(item.deadline) : 'No deadline'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-6">
                        <p className="text-gray-700 line-clamp-2">{item.description}</p>
                      </div>

                      {/* Skills */}
                      <div className="mb-6">
                        <p className="text-sm text-gray-500 mb-2">Required Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {item.required_skills?.slice(0, 5).map((skill, index) => (
                            <span
                              key={index}
                              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-100"
                            >
                              {skill}
                            </span>
                          ))}
                          {item.required_skills?.length > 5 && (
                            <span className="text-gray-500 text-sm">
                              +{item.required_skills.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 pt-6 border-t">
                        <button
                          onClick={() => navigate(`/internships/${item.internship_id}`)}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          <Eye size={16} />
                          View Details
                        </button>
                        
                        <button
                          onClick={() => handleApply(item.internship_id)}
                          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 font-medium"
                        >
                          Apply Now
                        </button>
                        
                        <button
                          onClick={() => navigate(`/internships/${item.internship_id}/compare`)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                          <AlertCircle size={16} />
                          Compare
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Recommendations - البيانات الحقيقية من API */}
{savedInternships.length > 0 && (
  <div className="mt-12">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">Based on Your Interests</h2>
      <button
        onClick={() => navigate('/student/recommendations')}
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        View All →
      </button>
    </div>
    
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Discover similar opportunities
        </h3>
        <p className="text-gray-600">
          Based on your favorite internships, we think you might like these:
        </p>
      </div>
      
      {loadingRecs ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <div 
              key={rec.id} 
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={() => navigate(`/internships/${rec.id}`)}
            >
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-gray-900 line-clamp-1">{rec.title}</p>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  {rec.match_score}% match
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{rec.company}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {rec.required_skills.slice(0, 2).map((skill, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                    {skill}
                  </span>
                ))}
                {rec.required_skills.length > 2 && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    +{rec.required_skills.length - 2}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{rec.type}</span>
                <span>•</span>
                <span>{rec.location}</span>
                <span>•</span>
                <span>{rec.stipend?.toLocaleString()} DZD</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No recommendations available at this time.</p>
          <p className="text-sm mt-1">Save more internships to get personalized recommendations.</p>
        </div>
      )}
    </div>
  </div>
)}
        </motion.div>
      </div>
    </div>
  );
};

export default SavedInternships;