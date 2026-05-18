// pages/student/Activity.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Clock, 
  Filter, 
  ArrowLeft,
  Calendar,
  Briefcase,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const Activity = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    applications: 0,
    notifications: 0,
    agreements: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.user_type !== 'student') {
      navigate('/login');
      return;
    }
    
    fetchAllActivities();
  }, [navigate]);

  const fetchAllActivities = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const applicationsRes = await axios.get('http://localhost:5000/api/student/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const notificationsRes = await axios.get('http://localhost:5000/api/student/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const agreementsRes = await axios.get('http://localhost:5000/api/student/agreements', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const apps = applicationsRes.data.success ? applicationsRes.data.applications : [];
      const notifications = notificationsRes.data.success ? notificationsRes.data.notifications : [];
      const agreements = agreementsRes.data.success ? agreementsRes.data.agreements : [];
      
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

      const applicationActivities = apps.map((app, index) => ({
        id: `app-${app.id}-${app.applied_date}-${index}`,
        type: 'application',
        title: `Applied for ${app.internship_title || 'internship'}`,
        description: `${app.company_name} • ${app.internship_type || 'Internship'}`,
        time: getTimeAgo(app.applied_date),
        timestamp: new Date(app.applied_date).getTime(),
        status: app.status,
        icon: getActivityIcon(app.status),
        color: getActivityColor(app.status),
        link: `/student/applications/${app.id}`
      }));

      // ✅ تحديث: استخدام title بدلاً من type فقط
      const notificationActivities = notifications.map((notif, index) => ({
        id: `notif-${notif.id}-${notif.created_at}-${index}`,
        type: 'notification',
        title: notif.title || 'Notification',
        description: notif.message || '',
        time: getTimeAgo(notif.created_at),
        timestamp: new Date(notif.created_at).getTime(),
        icon: getNotificationIcon(notif.type, notif.title),  // ✅ تمرير title أيضاً
        color: getNotificationColor(notif.type, notif.title), // ✅ تمرير title أيضاً
        link: '/student/notifications'
      }));

      const agreementActivities = agreements.map((agreement, index) => ({
        id: `agree-${agreement.id}-${agreement.created_at}-${index}`,
        type: 'agreement',
        title: `Agreement for ${agreement.internship_title || 'internship'}`,
        description: `${agreement.company_name} • Status: ${agreement.status}`,
        time: getTimeAgo(agreement.generated_at || agreement.created_at),
        timestamp: new Date(agreement.generated_at || agreement.created_at).getTime(),
        icon: '📄',
        color: 'indigo',
        link: '/student/agreements'
      }));

      const allActivities = [
        ...applicationActivities,
        ...notificationActivities,
        ...agreementActivities
      ];

      allActivities.sort((a, b) => b.timestamp - a.timestamp);

      setStats({
        total: allActivities.length,
        applications: applicationActivities.length,
        notifications: notificationActivities.length,
        agreements: agreementActivities.length
      });

      setActivities(allActivities);

    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Error loading activities');
    } finally {
      setLoading(false);
    }
  };

  // ✅ تحديث دالة الأيقونات (تعتمد على title و type)
  const getActivityIcon = (status, title) => {
    if (title?.includes('Agreement Signed')) return '✍️';
    if (title?.includes('Company Signed')) return '🏢';
    if (title?.includes('Validated')) return '✅';
    if (title?.includes('Accepted')) return '🎉';
    
    switch(status) {
      case 'pending': return '⏳';
      case 'reviewed': return '🔍';
      case 'interview': return '🎯';
      case 'accepted': return '✅';
      case 'rejected': return '❌';
      default: return '📋';
    }
  };

  const getActivityColor = (status, title) => {
    if (title?.includes('Agreement Signed')) return 'indigo';
    if (title?.includes('Company Signed')) return 'blue';
    if (title?.includes('Validated')) return 'emerald';
    
    switch(status) {
      case 'pending': return 'yellow';
      case 'reviewed': return 'blue';
      case 'interview': return 'purple';
      case 'accepted': return 'green';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  };

  // ✅ تحديث دالة أيقونات الإشعارات
  const getNotificationIcon = (type, title) => {
    // استخدام title لتحديد الأيقونة
    if (title?.includes('Agreement Signed')) return '✍️';
    if (title?.includes('Company Signed Agreement')) return '🏢';
    if (title?.includes('Convention de Stage Generated')) return '📄';
    if (title?.includes('All Parties Signed')) return '🎉';
    if (title?.includes('Internship Validated')) return '✅';
    if (title?.includes('Application Accepted')) return '🎉';
    if (title?.includes('Congratulations! You are accepted')) return '🎉';
    
    switch(type) {
      case 'application': return '📨';
      case 'acceptance': return '✅';
      case 'interview': return '🎯';
      case 'agreement': return '📄';
      case 'system': return '✅';
      default: return '📢';
    }
  };

  // ✅ تحديث دالة ألوان الإشعارات
  const getNotificationColor = (type, title) => {
    if (title?.includes('Agreement Signed')) return 'indigo';
    if (title?.includes('Company Signed Agreement')) return 'blue';
    if (title?.includes('Internship Validated')) return 'emerald';
    if (title?.includes('Application Accepted')) return 'green';
    if (title?.includes('Convention de Stage Generated')) return 'indigo';
    
    switch(type) {
      case 'application': return 'blue';
      case 'acceptance': return 'green';
      case 'interview': return 'purple';
      case 'agreement': return 'indigo';
      case 'system': return 'emerald';
      default: return 'gray';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'application': return <Briefcase size={16} />;
      case 'notification': return <AlertCircle size={16} />;
      case 'agreement': return <CheckCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading activities...</p>
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
              onClick={() => navigate('/student/dashboard')}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Dashboard
            </button>
            
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Activity History</h1>
                <p className="text-gray-600 mt-2">
                  Track all your activities and updates
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow px-4 py-2">
                <span className="text-gray-600">Total: </span>
                <span className="font-bold text-xl text-blue-600">{stats.total}</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div 
              onClick={() => setFilter('all')}
              className={`bg-white rounded-xl shadow p-6 cursor-pointer transition-all ${
                filter === 'all' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">All Activities</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Clock className="text-blue-600" size={32} />
              </div>
            </div>
            
            <div 
              onClick={() => setFilter('application')}
              className={`bg-white rounded-xl shadow p-6 cursor-pointer transition-all ${
                filter === 'application' ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Applications</p>
                  <p className="text-3xl font-bold text-green-600">{stats.applications}</p>
                </div>
                <Briefcase className="text-green-600" size={32} />
              </div>
            </div>
            
            <div 
              onClick={() => setFilter('notification')}
              className={`bg-white rounded-xl shadow p-6 cursor-pointer transition-all ${
                filter === 'notification' ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Notifications</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.notifications}</p>
                </div>
                <AlertCircle className="text-purple-600" size={32} />
              </div>
            </div>
            
            <div 
              onClick={() => setFilter('agreement')}
              className={`bg-white rounded-xl shadow p-6 cursor-pointer transition-all ${
                filter === 'agreement' ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Agreements</p>
                  <p className="text-3xl font-bold text-indigo-600">{stats.agreements}</p>
                </div>
                <CheckCircle className="text-indigo-600" size={32} />
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-xl shadow p-4 mb-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilter('application')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'application' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                Applications ({stats.applications})
              </button>
              <button
                onClick={() => setFilter('notification')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'notification' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                Notifications ({stats.notifications})
              </button>
              <button
                onClick={() => setFilter('agreement')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'agreement' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                }`}
              >
                Agreements ({stats.agreements})
              </button>
            </div>
          </div>

          {/* Activities List */}
          <div className="space-y-4">
            {filteredActivities.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-12 text-center">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No activities found</h3>
                <p className="text-gray-500">
                  {filter === 'all' 
                    ? "You don't have any activities yet." 
                    : `No ${filter} activities found.`}
                </p>
              </div>
            ) : (
              filteredActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden border-l-4 ${
                    activity.color === 'yellow' ? 'border-yellow-500' :
                    activity.color === 'blue' ? 'border-blue-500' :
                    activity.color === 'purple' ? 'border-purple-500' :
                    activity.color === 'green' ? 'border-green-500' :
                    activity.color === 'red' ? 'border-red-500' :
                    activity.color === 'indigo' ? 'border-indigo-500' :
                    activity.color === 'emerald' ? 'border-emerald-500' :
                    'border-gray-500'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">
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
                          <span className="text-sm text-gray-400">
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
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Activity;