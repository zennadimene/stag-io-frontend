import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Clock, Briefcase, Users, FileText } from 'lucide-react';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CompanyActivity = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllActivities();
  }, []);

  const fetchAllActivities = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      //const applicationsRes = await axios.get('http://localhost:5000/api/company/applications', {
      const applicationsRes = await axios.get(`${BASE}/api/company/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      //const internshipsRes = await axios.get('http://localhost:5000/api/company/internships', {
      const internshipsRes = await axios.get(`${BASE}/api/company/internships`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let agreements = [];
      try {
       // const agreementsRes = await axios.get('http://localhost:5000/api/company/agreements', {
        const agreementsRes = await axios.get(`${BASE}/api/company/agreements`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (agreementsRes.data.success) {
          agreements = agreementsRes.data.agreements;
        }
      } catch (error) {
        console.log('No agreements yet');
      }
      
      const allActivities = [];
      
      if (applicationsRes.data.success && applicationsRes.data.applications) {
        applicationsRes.data.applications.forEach(app => {
          allActivities.push({
            id: `app-${app.id}`,
            type: 'application',
            icon: '📨',
            color: 'blue',
            title: `New application from ${app.student_name || 'student'}`,
            description: `For: ${app.internship_title || 'Internship'}`,
            time: getTimeAgo(app.created_at),
            rawTime: new Date(app.created_at),
            link: `/company/applications`
          });
        });
      }
      
      if (internshipsRes.data.success && internshipsRes.data.internships) {
        internshipsRes.data.internships.forEach(internship => {
          allActivities.push({
            id: `intern-${internship.id}`,
            type: 'internship',
            icon: '✅',
            color: 'green',
            title: `Internship posted: ${internship.title}`,
            description: `${internship.type || ''} • ${internship.location || ''}`,
            time: getTimeAgo(internship.created_at),
            rawTime: new Date(internship.created_at),
            link: `/company/internships`
          });
        });
      }
      
      agreements.forEach(agreement => {
        allActivities.push({
          id: `agree-${agreement.id}`,
          type: 'agreement',
          icon: '📄',
          color: 'purple',
          title: `Agreement ${agreement.status}`,
          description: `${agreement.student_name} - ${agreement.internship_title}`,
          time: getTimeAgo(agreement.created_at),
          rawTime: new Date(agreement.created_at),
          link: `/company/agreements`
        });
      });
      
      allActivities.sort((a, b) => b.rawTime - a.rawTime);
      setActivities(allActivities);
      
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Error loading activities');
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'recently';
    
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'application': return <Users size={16} />;
      case 'internship': return <Briefcase size={16} />;
      case 'agreement': return <FileText size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/company/dashboard')}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Dashboard
            </button>
            
            <h1 className="text-3xl font-bold text-gray-900">All Activity</h1>
            <p className="text-gray-600 mt-2">Complete history of your company activities</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Activities</p>
                  <p className="text-3xl font-bold text-gray-900">{activities.length}</p>
                </div>
                <Clock className="text-blue-600" size={32} />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Applications</p>
                  <p className="text-3xl font-bold text-green-600">
                    {activities.filter(a => a.type === 'application').length}
                  </p>
                </div>
                <Users className="text-green-600" size={32} />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Internships</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {activities.filter(a => a.type === 'internship').length}
                  </p>
                </div>
                <Briefcase className="text-purple-600" size={32} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Agreements</p>
                  <p className="text-3xl font-bold text-amber-600">
                    {activities.filter(a => a.type === 'agreement').length}
                  </p>
                </div>
                <FileText className="text-amber-600" size={32} />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
              }`}
            >
              All ({activities.length})
            </button>
            <button
              onClick={() => setFilter('application')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'application' 
                  ? 'bg-green-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
              }`}
            >
              Applications ({activities.filter(a => a.type === 'application').length})
            </button>
            <button
              onClick={() => setFilter('internship')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'internship' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
              }`}
            >
              Internships ({activities.filter(a => a.type === 'internship').length})
            </button>
            <button
              onClick={() => setFilter('agreement')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'agreement' 
                  ? 'bg-amber-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
              }`}
            >
              Agreements ({activities.filter(a => a.type === 'agreement').length})
            </button>
          </div>

          {/* Activities List */}
          {filteredActivities.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No activities yet</h3>
              <p className="text-gray-500">Activities will appear here when students interact with your internships.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden border-l-4 ${
                    activity.color === 'blue' ? 'border-blue-500' :
                    activity.color === 'green' ? 'border-green-500' :
                    activity.color === 'purple' ? 'border-purple-500' :
                    'border-gray-500'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`text-3xl`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {activity.title}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {activity.time}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-400 flex items-center gap-1">
                            {getTypeIcon(activity.type)}
                            {activity.type}
                          </span>
                          <button
                            onClick={() => navigate(activity.link)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View Details →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyActivity;