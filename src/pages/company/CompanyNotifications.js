import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  Mail, 
  FileText, 
  Calendar,
  CheckCheck,
  Filter,
  Clock,
  Eye,
  FileSignature
} from 'lucide-react';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CompanyNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.user_type !== 'company') {
      navigate('/login');
      return;
    }
    
    fetchNotifications();
  }, [navigate]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      //const response = await axios.get('http://localhost:5000/api/company/notifications', {
      const response = await axios.get(`${BASE}/api/company/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setNotifications(response.data.notifications);
        window.dispatchEvent(new Event('company-notifications-updated'));
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Error loading notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
      //  `http://localhost:5000/api/company/notifications/${notificationId}/read`,
        `${BASE}/api/company/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: 1 } : n)
      );
      
      window.dispatchEvent(new Event('company-notifications-updated'));
    } catch (error) {
      console.error('Error marking as read:', error);
      toast.error('Error marking notification');
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        //'http://localhost:5000/api/company/notifications/read-all',
        `${BASE}/api/company/notifications/read-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      toast.success('All notifications marked as read');
      window.dispatchEvent(new Event('company-notifications-updated'));
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Error marking all notifications');
    }
  };

  const viewApplication = (applicationId) => {
  if (!applicationId) {
    toast.error('Application ID not found');
    return;
  }
  
  // التوجيه إلى صفحة تفاصيل التقديم
  navigate(`/company/applications/${applicationId}`);
};

  const signAgreementAsCompany = async (agreementId) => {
    if (!agreementId) {
      toast.error('Agreement ID not found');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
       // `http://localhost:5000/api/company/agreements/${agreementId}/sign`,
        `${BASE}/api/company/agreements/${agreementId}/sign`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success('✅ Agreement signed successfully!');
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error signing agreement:', error);
      toast.error(error.response?.data?.message || 'Error signing agreement');
    }
  };

  const getIcon = (type, title) => {
  // استخدام type أولاً
  switch(type) {
    case 'agreement_signed': return <FileSignature className="w-5 h-5 text-blue-500" />;
    case 'convention_generated': return <FileText className="w-5 h-5 text-indigo-500" />;
    case 'agreement_completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'validation': return <CheckCheck className="w-5 h-5 text-emerald-500" />;
    case 'application': return <Mail className="w-5 h-5 text-purple-500" />;
    case 'withdrawal': return <Clock className="w-5 h-5 text-yellow-500" />;
    default:
      // fallback على title
      if (title?.includes('Agreement Completed')) return <CheckCircle className="w-5 h-5 text-green-500" />;
      if (title?.includes('Agreement Signed')) return <FileSignature className="w-5 h-5 text-blue-500" />;
      if (title?.includes('Internship Validated')) return <CheckCheck className="w-5 h-5 text-emerald-500" />;
      if (title?.includes('New Application')) return <Mail className="w-5 h-5 text-purple-500" />;
      if (title?.includes('Application Withdrawn')) return <Clock className="w-5 h-5 text-yellow-500" />;
      return <Bell className="w-5 h-5 text-gray-500" />;
  }
};

 const getColor = (type, title, isRead) => {
  if (isRead) return 'bg-gray-50 border-gray-200';
  
  switch(type) {
    case 'agreement_signed': return 'bg-blue-50 border-blue-200';
    case 'convention_generated': return 'bg-indigo-50 border-indigo-200';
    case 'agreement_completed': return 'bg-green-50 border-green-200';
    case 'validation': return 'bg-emerald-50 border-emerald-200';
    case 'application': return 'bg-purple-50 border-purple-200';
    case 'withdrawal': return 'bg-yellow-50 border-yellow-200';
    default:
      if (title?.includes('Agreement Completed')) return 'bg-green-50 border-green-200';
      if (title?.includes('Agreement Signed')) return 'bg-blue-50 border-blue-200';
      if (title?.includes('Internship Validated')) return 'bg-emerald-50 border-emerald-200';
      if (title?.includes('New Application')) return 'bg-purple-50 border-purple-200';
      return 'bg-white border-gray-200';
  }
};

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filteredNotifications = notifications.filter(n => {
  if (filter === 'all') return true;
  if (filter === 'unread') return !n.is_read;
  if (filter === 'agreements') {
    return n.type === 'agreement_signed' || 
           n.type === 'convention_generated' || 
           n.type === 'agreement_completed';
  }
  if (filter === 'applications') {
    return n.type === 'application' || n.type === 'withdrawal';
  }
  if (filter === 'validations') return n.type === 'validation';
  return true;
});

const agreementCount = notifications.filter(n => 
  n.type === 'agreement_signed' || 
  n.type === 'convention_generated' || 
  n.type === 'agreement_completed'
).length;

const applicationCount = notifications.filter(n => 
  n.type === 'application' || n.type === 'withdrawal'
).length;

const validationCount = notifications.filter(n => 
  n.type === 'validation'
).length;

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-1">Stay updated on your applications</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm"
              >
                <CheckCheck size={18} />
                <span className="text-sm font-medium">Mark all as read</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === 'all' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
            }`}
          >
            All ({notifications.length})
          </button>
          {unreadCount > 0 && (
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'unread' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
              }`}
            >
              Unread ({unreadCount})
            </button>
          )}
          <button
  onClick={() => setFilter('agreements')}
  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
    filter === 'agreements' 
      ? 'bg-blue-600 text-white shadow-md' 
      : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
  }`}
>
  Agreements ({agreementCount})
</button>

<button
  onClick={() => setFilter('applications')}
  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
    filter === 'applications' 
      ? 'bg-blue-600 text-white shadow-md' 
      : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
  }`}
>
  Applications ({applicationCount})
</button>

<button
  onClick={() => setFilter('validations')}
  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
    filter === 'validations' 
      ? 'bg-blue-600 text-white shadow-md' 
      : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
  }`}
>
  Validations ({validationCount})
</button>
        </div>

        {/* Notifications List */}
        <AnimatePresence>
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-12 text-center"
            >
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">You're all caught up!</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-xl border shadow-sm transition-all hover:shadow-md ${
                   getColor(notification.type, notification.title, notification.is_read)
                  } ${!notification.is_read ? 'border-l-4 border-l-blue-500' : ''}`}
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
  {getIcon(notification.type, notification.title)}
</div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className={`font-semibold ${
                              notification.is_read ? 'text-gray-600' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </h3>
                            <p className={`mt-1 text-sm ${
                              notification.is_read ? 'text-gray-500' : 'text-gray-700'
                            }`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Clock size={12} className="text-gray-400" />
                              <span className="text-xs text-gray-400">
                                {getTimeAgo(notification.created_at)}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!notification.is_read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                title="Mark as read"
                              >
                                <CheckCheck size={16} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
{notification.title === '📄 Agreement Signed by Student' && (
  <div className="mt-4 flex gap-3">
    {/* View Agreement - يفتح صفحة عرض الاتفاقية */}
    <button
      onClick={() => {
        const agreementId = notification.agreement_id;
        if (agreementId) {
          navigate(`/company/agreements/${agreementId}/view`);
        } else {
          toast.error('Could not find agreement');
        }
      }}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
    >
      <Eye size={14} />
      View Agreement
    </button>
    
    {/* ✅ Sign Agreement - ينتقل إلى صفحة توقيع الشركة */}
    <button
      onClick={() => {
        const agreementId = notification.agreement_id;
        if (agreementId) {
          navigate(`/company/agreements/${agreementId}/sign`);
        } else {
          toast.error('Could not find agreement');
        }
      }}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
    >
      <FileSignature size={14} />
      Sign Agreement
    </button>
  </div>
)}

{notification.title === '📬 New Application Received' && (
  <div className="mt-4">
    <button
      onClick={() => {
        const appId = notification.application_id;
        console.log('🔍 Application ID:', appId);
        if (appId) {
          navigate(`/company/applications/${appId}`);
        } else {
          toast.error('Could not find application');
        }
      }}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
    >
      <Eye size={14} />
      View Application
    </button>
  </div>
)}                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CompanyNotifications;