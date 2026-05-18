// frontend/src/pages/student/SmartRecommendations.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Filter, 
  Sliders, 
  RefreshCw,
  Info,
  TrendingUp,
  Award,
  MapPin,
  Briefcase
} from 'lucide-react';
import { getSmartRecommendations, trackInteraction } from '../../services/matchingService';
import RecommendationCard from '../../components/student/RecommendationCard';
import { toast } from 'react-hot-toast';

const SmartRecommendations = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState([]);
  const [filter, setFilter] = useState('all'); // all, excellent, good, fair
  const [sortBy, setSortBy] = useState('score'); // score, date, stipend
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    excellent: 0,
    good: 0,
    fair: 0
  });

  useEffect(() => {
    fetchRecommendations();
    fetchSavedInternships();
  }, []);

  const fetchRecommendations = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    
    try {
      const data = await getSmartRecommendations(20);
      if (data.success) {
        setRecommendations(data.recommendations);
        
        // Calculate statistics
        const stats = {
          total: data.recommendations.length,
          excellent: data.recommendations.filter(r => r.match_level === 'excellent').length,
          good: data.recommendations.filter(r => r.match_level === 'good').length,
          fair: data.recommendations.filter(r => r.match_level === 'fair').length
        };
        setStats(stats);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error fetching recommendations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchSavedInternships = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/student/saved-internships', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        const ids = data.savedInternships.map(item => item.internship_id);
        setSavedIds(ids);
      }
    } catch (error) {
      console.error('Error fetching saved:', error);
    }
  };

  const handleSave = async (internshipId) => {
    try {
      const token = localStorage.getItem('token');
      const method = savedIds.includes(internshipId) ? 'DELETE' : 'POST';
      
      await fetch(`http://localhost:5000/api/student/saved-internships/${internshipId}`, {
        method,
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await trackInteraction(internshipId, method === 'POST' ? 'save' : 'unsave');
      
      setSavedIds(prev => 
        method === 'POST' 
          ? [...prev, internshipId] 
          : prev.filter(id => id !== internshipId)
      );
      
      toast.success(method === 'POST' ? 'Saved successfully' : 'Removed from saved');
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Error occurred, please try again');
    }
  };

  const handleRefresh = () => {
    fetchRecommendations(true);
  };

  // Filter and sort recommendations
  const filteredAndSorted = recommendations
    .filter(rec => {
      if (filter === 'all') return true;
      return rec.match_level === filter;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.match_score - a.match_score;
      if (sortBy === 'date') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'stipend') return (b.stipend || 0) - (a.stipend || 0);
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={24} />
          </div>
          <p className="mt-6 text-xl font-medium text-gray-700">Analyzing your profile...</p>
          <p className="text-sm text-gray-500 mt-2">Finding the best internships that match your skills</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-lg">
                  <Sparkles className="text-white" size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Smart Recommendations</h1>
                  <p className="text-gray-600 mt-2">
                    Specially selected internships based on your skills and preferences
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition disabled:opacity-50"
              >
                <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div 
              onClick={() => setFilter('all')}
              className={`bg-white rounded-xl shadow p-6 cursor-pointer transition-all ${
                filter === 'all' ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">All Recommendations</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Sparkles className="text-indigo-600" size={32} />
              </div>
            </div>
            
            <div 
              onClick={() => setFilter('excellent')}
              className={`bg-white rounded-xl shadow p-6 cursor-pointer transition-all ${
                filter === 'excellent' ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Excellent Match</p>
                  <p className="text-3xl font-bold text-green-600">{stats.excellent}</p>
                </div>
                <Award className="text-green-600" size={32} />
              </div>
            </div>
            
            <div 
              onClick={() => setFilter('good')}
              className={`bg-white rounded-xl shadow p-6 cursor-pointer transition-all ${
                filter === 'good' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Good Match</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.good}</p>
                </div>
                <TrendingUp className="text-blue-600" size={32} />
              </div>
            </div>
            
            <div 
              onClick={() => setFilter('fair')}
              className={`bg-white rounded-xl shadow p-6 cursor-pointer transition-all ${
                filter === 'fair' ? 'ring-2 ring-yellow-500 bg-yellow-50' : 'hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Average Match</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.fair}</p>
                </div>
                <Info className="text-yellow-600" size={32} />
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-8">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Filter size={18} />
                <span className="font-medium">Sort by:</span>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="score">Match Score</option>
                <option value="date">Latest</option>
                <option value="stipend">Stipend (Highest)</option>
              </select>
              
              <div className="flex-1 text-right text-sm text-gray-500">
                {filteredAndSorted.length} out of {recommendations.length} recommendations
              </div>
            </div>
          </div>

          {/* Recommendations Grid */}
          {filteredAndSorted.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-12 text-center">
              <Sparkles className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No recommendations</h3>
              <p className="text-gray-500 mb-6">
                {filter !== 'all' 
                  ? 'No recommendations in this category' 
                  : 'Complete your profile and add skills to get personalized recommendations'}
              </p>
              {filter !== 'all' ? (
                <button
                  onClick={() => setFilter('all')}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium"
                >
                  Show All
                </button>
              ) : (
                <button
                  onClick={() => navigate('/student/profile/edit')}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium"
                >
                  Update My Profile
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSorted.map((internship) => (
                <RecommendationCard
                  key={internship.id}
                  internship={internship}
                  onSave={handleSave}
                  isSaved={savedIds.includes(internship.id)}
                />
              ))}
            </div>
          )}

          {/* Tips Section */}
          <div className="mt-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Info size={20} className="text-indigo-600" />
              How to improve recommendations?
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</div>
                <p className="text-gray-700">Add more technical skills to your profile</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</div>
                <p className="text-gray-700">Save internships you like to improve suggestions</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</div>
                <p className="text-gray-700">Rate recommendations (Yes/No) to help us improve accuracy</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SmartRecommendations;