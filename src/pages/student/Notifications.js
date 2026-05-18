import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast'; 

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.user_type !== 'student') {
      navigate('/login');
      return;
    }
    
    fetchNotifications();
  }, [navigate]);
// ✅ دالة جلب الإشعارات
const fetchNotifications = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://stag-io-backend.onrender.com/api/student/notifications', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      setNotifications(response.data.notifications);
      
      const unreadCount = response.data.notifications.filter(n => !n.is_read).length;
      console.log('📨 Total notifications:', response.data.notifications.length);
      console.log('📨 Unread notifications:', unreadCount);
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
    toast.error('Error fetching notifications');
  } finally {
    setLoading(false);
  }
};

// ✅ دالة تعليم إشعار كمقروء (مثل Company)
const markAsRead = async (notificationId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.put(
      `http://stag-io-backend.onrender.com/api/student/notifications/${notificationId}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (response.data.success) {
      // ✅ إعادة جلب الإشعارات (مثل Company)
      await fetchNotifications();
      toast.success('✅ Notification marked as read');
      window.dispatchEvent(new Event('notifications-updated'));
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    toast.error('❌ Error marking notification');
  }
};

// ✅ دالة تعليم جميع الإشعارات كمقروءة (مثل Company)
const markAllAsRead = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.put(
      'http://stag-io-backend.onrender.com/api/student/notifications/read-all',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (response.data.success) {
      // ✅ إعادة جلب الإشعارات (مثل Company)
      await fetchNotifications();
      toast.success(`✅ ${response.data.message || 'All notifications marked as read'}`);
      window.dispatchEvent(new Event('notifications-updated'));
    }
  } catch (error) {
    console.error('Error marking all as read:', error);
    toast.error('❌ Error marking all notifications');
  }
};

 // ============================================
// UTILITY FUNCTIONS
// ============================================
const getNotificationTypeFromMessage = (title, message, originalType) => {
  // ✅ قائمة الأنواع الصحيحة
  const validTypes = ['acceptance', 'validation', 'agreement', 'interview', 'application', 'rejection'];
  
  // إذا كان النوع الأصلي ضمن القائمة، استخدمه مباشرة
  if (validTypes.includes(originalType)) {
    return originalType;
  }
  
  // إذا لم يكن ضمن القائمة، حاول التخمين من المحتوى
  const titleLower = title?.toLowerCase() || '';
  const messageLower = message?.toLowerCase() || '';
  
  if (titleLower.includes('accepted') || messageLower.includes('accepted')) return 'acceptance';
  if (titleLower.includes('validated') || messageLower.includes('validated')) return 'validation';
  if (titleLower.includes('agreement') || messageLower.includes('agreement')) return 'agreement';
  if (titleLower.includes('interview') || messageLower.includes('interview')) return 'interview';
  if (titleLower.includes('rejected') || messageLower.includes('not selected')) return 'rejection';
  
  return 'application';
};

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'application': return '📄';
      case 'interview': return '🎯';
      case 'acceptance': return '✅';
      case 'rejection': return '❌';
      case 'agreement': return '📑';
      case 'validation': return '🟢';
      case 'new_internship': return '📢';
      default: return '📢';
    }
  };


  /*
const getNotificationStyle = (type, is_read) => {
  if (is_read) {
    return {
      bg: 'bg-gray-50',
      border: 'border-gray-300',
      icon: '📋',
      title: 'text-gray-500'
    };
  }
  
  switch(type) {
    case 'acceptance':
      return {
        bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
        border: 'border-green-500',
        icon: '🎉',
        title: 'text-green-800'
      };
    case 'rejection':
      return {
        bg: 'bg-gradient-to-r from-red-50 to-rose-50',
        border: 'border-red-500',
        icon: '❌',
        title: 'text-red-800'
      };
    case 'validation':
      return {
        bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
        border: 'border-blue-500',
        icon: '✅',
        title: 'text-blue-800'
      };
    case 'agreement':
      return {
        bg: 'bg-gradient-to-r from-purple-50 to-pink-50',
        border: 'border-purple-500',
        icon: '📄',
        title: 'text-purple-800'
      };
    case 'interview':
      return {
        bg: 'bg-gradient-to-r from-yellow-50 to-amber-50',
        border: 'border-yellow-500',
        icon: '🎯',
        title: 'text-yellow-800'
      };
    case 'agreement_completed':  // ✅ أضف هذا
      return {
        bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
        border: 'border-green-500',
        icon: '🎉',
        title: 'text-green-800'
      };
    case 'company_signed':  // ✅ أضف هذا
      return {
        bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
        border: 'border-blue-500',
        icon: '📄',
        title: 'text-blue-800'
      };
    case 'new_internship':
      return {
        bg: 'bg-gradient-to-r from-emerald-50 to-teal-50',
        border: 'border-emerald-500',
        icon: '📢',
        title: 'text-emerald-800'
      };
    default:
      return {
        bg: 'bg-gradient-to-r from-gray-50 to-slate-50',
        border: 'border-gray-400',
        icon: '📢',
        title: 'text-gray-700'
      };
  }
};*/
const getNotificationStyle = (notification) => {
  const is_read = notification.is_read;
  // ✅ استخدم الدالة الجديدة للحصول على النوع
  const type = notification.type || getTypeFromContent(notification.title, notification.message);
  
  if (is_read) {
    return {
      bg: 'bg-gray-50',
      border: 'border-gray-300',
      icon: '📋',
      title: 'text-gray-500'
    };
  }
  
  switch(type) {
    case 'acceptance':
      return {
        bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
        border: 'border-green-500',
        icon: '🎉',
        title: 'text-green-800'
      };
    case 'rejection':
      return {
        bg: 'bg-gradient-to-r from-red-50 to-rose-50',
        border: 'border-red-500',
        icon: '❌',
        title: 'text-red-800'
      };
    case 'validation':
      return {
        bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
        border: 'border-blue-500',
        icon: '✅',
        title: 'text-blue-800'
      };
    case 'agreement':
      return {
        bg: 'bg-gradient-to-r from-purple-50 to-pink-50',
        border: 'border-purple-500',
        icon: '📄',
        title: 'text-purple-800'
      };
    case 'interview':
      return {
        bg: 'bg-gradient-to-r from-yellow-50 to-amber-50',
        border: 'border-yellow-500',
        icon: '🎯',
        title: 'text-yellow-800'
      };
    case 'new_internship':
      return {
        bg: 'bg-gradient-to-r from-emerald-50 to-teal-50',
        border: 'border-emerald-500',
        icon: '📢',
        title: 'text-emerald-800'
      };
    default:
      return {
        bg: 'bg-gradient-to-r from-gray-50 to-slate-50',
        border: 'border-gray-400',
        icon: '📢',
        title: 'text-gray-700'
      };
  }
};

// ✅ استخراج النوع من title و message (لأن type قد يكون NULL)
const getTypeFromContent = (title, message) => {
  const titleLower = (title || '').toLowerCase();
  const messageLower = (message || '').toLowerCase();
  
  // Agreement related
  if (titleLower.includes('agreement') || messageLower.includes('agreement')) return 'agreement';
  if (titleLower.includes('signed') || messageLower.includes('signed')) return 'agreement';
  
  // Validation related
  if (titleLower.includes('validated') || messageLower.includes('validated')) return 'validation';
  
  // Acceptance related
  if (titleLower.includes('accepted') || messageLower.includes('accepted')) return 'acceptance';
  
  // Rejection related
  if (titleLower.includes('rejected') || messageLower.includes('rejected')) return 'rejection';
  
  // Interview related
  if (titleLower.includes('interview') || messageLower.includes('interview')) return 'interview';
  
  // New internship
  if (titleLower.includes('new internship') || messageLower.includes('new internship')) return 'new_internship';
  
  return 'application';
};

const filteredNotifications = notifications.filter(notification => {
  if (filter === 'all') return true;
  
  // استخراج النوع الفعلي من المحتوى
  const effectiveType = notification.type || getTypeFromContent(notification.title, notification.message);
  const title = notification.title || '';
  const message = notification.message || '';
  
  switch(filter) {
    case 'application':
      return effectiveType === 'application' || 
             effectiveType === 'acceptance' ||
             effectiveType === 'rejection' ||
             effectiveType === 'interview';
             
    case 'interview':
      return effectiveType === 'interview' ||
             title.includes('Interview') ||
             message.includes('interview');
             
    case 'acceptance':
      return effectiveType === 'acceptance' ||
             title.includes('Accepted') ||
             message.includes('accepted');
             
    case 'rejection':
      return effectiveType === 'rejection' ||
             title.includes('Rejected') ||
             message.includes('rejected');
             
    case 'agreement':
      return effectiveType === 'agreement' ||
             title.includes('Agreement') ||
             title.includes('Signed') ||
             message.includes('agreement');
             
    case 'validation':
      // ✅ التصحيح: استخدم notification.title و notification.message
      return effectiveType === 'validation' || 
             title.includes('Validated') || 
             message.includes('validated');

    case 'new_internship':
      return effectiveType === 'new_internship' || 
             title.includes('New Internship') || 
             message.includes('new internship');
             
    default:
      return true;
  }
});
/*
 const filteredNotifications = notifications.filter(notification => {
  if (filter === 'all') return true;
  
  const title = notification.title || '';
  const message = notification.message || '';
  const type = notification.type || '';
  
  switch(filter) {
    case 'application':
      // يشمل: تقديم طلب، قبول، رفض، مقابلة
      return type === 'application' || 
             title.includes('Application') || 
             title.includes('Accepted') ||
             title.includes('Rejected') ||
             title.includes('Interview') ||
             message.includes('application');
             
    case 'interview':
      return type === 'interview' || 
             title.includes('Interview') || 
             message.includes('interview');
             
    case 'acceptance':
      return type === 'acceptance' || 
             title.includes('Accepted') || 
             message.includes('accepted');
             
    case 'rejection':
      return type === 'rejection' || 
             title.includes('Rejected') || 
             message.includes('rejected') ||
             message.includes('not selected');
             
    case 'agreement':
      return type === 'agreement' || 
             title.includes('Agreement') || 
             title.includes('Signed') ||
             message.includes('agreement');
             
    case 'validation':
      return type === 'validation' || 
             title.includes('Validated') || 
             message.includes('validated');

    case 'new_internship':
      return type === 'new_internship' || 
             title.includes('New Internship') || 
             message.includes('new internship');
             
    default:
      return true;
  }
});*/

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading notifications...</p>
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-2">Stay updated on your applications</p>
            </div>
            
            {unreadCount > 0 && (
  <button
    onClick={markAllAsRead}
    className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
  >
    Mark all as read
  </button>
)}
          </div>

         {/* Filters - All in one line with wrap */}
<div className="bg-white rounded-xl shadow-lg p-4 mb-8">
  <div className="flex flex-wrap items-center gap-2">
    {/* All - Blue */}
    <button
      onClick={() => setFilter('all')}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
        filter === 'all' 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
      }`}
    >
      All {notifications.length > 0 && `(${notifications.length})`}
    </button>

    {/* Applications - Purple */}
    <button
      onClick={() => setFilter('application')}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
        filter === 'application' 
          ? 'bg-purple-600 text-white shadow-md' 
          : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
      }`}
    >
      Applications
    </button>

    {/* Interviews - Amber */}
    <button
      onClick={() => setFilter('interview')}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
        filter === 'interview' 
          ? 'bg-amber-600 text-white shadow-md' 
          : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
      }`}
    >
      🎯 Interviews
    </button>

    {/* Acceptances - Green */}
    <button
      onClick={() => setFilter('acceptance')}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
        filter === 'acceptance' 
          ? 'bg-green-600 text-white shadow-md' 
          : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
      }`}
    >
      ✅ Acceptances
    </button>

    {/* Rejections - Red */}
    <button
      onClick={() => setFilter('rejection')}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
        filter === 'rejection' 
          ? 'bg-red-600 text-white shadow-md' 
          : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
      }`}
    >
      ❌ Rejections
    </button>

    {/* Agreements - Indigo */}
    <button
      onClick={() => setFilter('agreement')}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
        filter === 'agreement' 
          ? 'bg-indigo-600 text-white shadow-md' 
          : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
      }`}
    >
      📄 Agreements
    </button>

    {/* Validations - Teal */}
    <button
      onClick={() => setFilter('validation')}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
        filter === 'validation' 
          ? 'bg-teal-600 text-white shadow-md' 
          : 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200'
      }`}
    >
      ✅ Validations
    </button>

    <button
  onClick={() => setFilter('new_internship')}
  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
    filter === 'new_internship' 
      ? 'bg-emerald-600 text-white shadow-md' 
      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
  }`}
>
  📢 New Internships
</button>
  </div>
</div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-500 text-lg">No notifications</p>
                <p className="text-gray-400 mt-2">You're all caught up!</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const displayType = getNotificationTypeFromMessage(
                  notification.title, 
                  notification.message, 
                  notification.type
                );
               // const style = getNotificationStyle(displayType, notification.is_read);
                const style = getNotificationStyle(notification);
                return (
                  <motion.div
  key={notification.id}
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  className={`rounded-xl shadow-lg overflow-hidden border-l-4 ${style.border} ${style.bg} hover:shadow-xl transition-shadow ${
    notification.is_read ? 'opacity-70' : ''
  }`}
>
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <span className="text-3xl">{style.icon}</span>
                          <div className="flex-1">
                            <h3 className={`font-bold text-lg ${style.title}`}>
                              {notification.title}
                            </h3>
                            <p className="text-gray-700 mt-1">{notification.message}</p>
                            <div className="flex items-center gap-3 mt-3">
                              <span className="text-xs text-gray-500">
                                {new Date(notification.created_at).toLocaleString()}
                              </span>
                              
                              {/* Special badges */}
                              {displayType === 'acceptance' && (
                                <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-medium">
                                  ⏳ Pending Admin
                                </span>
                              )}
                              {displayType === 'validation' && (
                                <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium">
                                  ✓ Validated
                                </span>
                              )}
                              {displayType === 'rejection' && (
                                <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-medium">
                                  ❌ Not selected
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                       {!notification.is_read && (
  <button
    onClick={() => markAsRead(notification.id)}
    className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
    title="Mark as read"
  >
    ✕
  </button>
)}
</div>
                      {/* Action Buttons */}
<div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-3">
  
  {/* ✅ Agreement Signed - نص فقط (بدون زر) */}
  {notification.title === '✅ Agreement Signed' && (
    <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium flex items-center gap-2">
      <span>✅</span> Already Signed
    </span>
  )}
  
  {/* 📄 INTERNSHIP AGREEMENT Generated! - زرين: View + Sign */}
{notification.title === '📄 INTERNSHIP AGREEMENT Generated!' && (
  <div className="flex gap-2">
    <button
      onClick={() => {
        // ✅ Debug: اطبع الإشعار كاملاً
        console.log('🔍 Full notification object:', notification);
        
        let agreementId = notification.agreement_id;
        
        // إذا لم يكن موجوداً، حاول من data
        if (!agreementId && notification.data) {
          try {
            const data = typeof notification.data === 'string' 
              ? JSON.parse(notification.data) 
              : notification.data;
            agreementId = data.agreement_id || data.agreementId;
            console.log('📦 Agreement ID from data:', agreementId);
          } catch (e) {
            console.error('Error parsing data:', e);
          }
        }
        
        console.log('🔍 Final Agreement ID:', agreementId);
        
        if (agreementId) {
          navigate('/student/agreements');
        } else {
          toast.error('❌ Agreement ID not found');
        }
      }}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2 shadow-sm"
    >
      <span>👁️</span> View Agreement
    </button>
    <button
      onClick={() => {
        let agreementId = notification.agreement_id;
        if (!agreementId && notification.data) {
          try {
            const data = typeof notification.data === 'string' 
              ? JSON.parse(notification.data) 
              : notification.data;
            agreementId = data.agreement_id || data.agreementId;
          } catch (e) {}
        }
        
        if (agreementId) {
          navigate(`/student/agreements/${agreementId}/sign`);
        } else {
          toast.error('❌ Could not find agreement ID');
        }
      }}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium flex items-center gap-2 shadow-sm"
    >
      <span>✍️</span> Sign Agreement
    </button>
  </div>
)}
  
  {/* 📄 Company Signed Agreement - زر View Agreement فقط */}
  {notification.title === '📄 Company Signed Agreement' && (
    <button
      onClick={() => {
        let agreementId = notification.agreement_id;
        if (!agreementId && notification.data) {
          try {
            const data = typeof notification.data === 'string' 
              ? JSON.parse(notification.data) 
              : notification.data;
            agreementId = data.agreementId || data.agreement_id;
          } catch (e) {}
        }
        if (agreementId) {
          navigate('/student/agreements');
        } else {
          toast.error('❌ Could not find agreement ID');
        }
      }}
      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium flex items-center gap-2 shadow-sm"
    >
      <span>👁️</span> View Agreement
    </button>
  )}
  
  {/* 🎉 All Parties Signed! - لا شيء (فقط رسالة، بدون زر) */}
  {notification.title === '🎉 All Parties Signed!' && (
    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center gap-2">
      <span>✅</span> Agreement Completed
    </span>
  )}
  
  {/* باقي الأزرار كما هي */}
  {displayType === 'acceptance' && notification.title !== '🎉 All Parties Signed!' && (
    <button
      onClick={() => navigate('/student/applications')}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center gap-2 shadow-sm"
    >
      <span>📋</span> View Applications
    </button>
  )}
  
  {displayType === 'validation' && notification.title !== '📄 INTERNSHIP AGREEMENT Generated!' && (
    <button
      onClick={() => navigate('/student/agreements')}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2 shadow-sm"
    >
      <span>📄</span> View Agreement
    </button>
  )}
  
  {displayType === 'rejection' && (
    <>
      <button
        onClick={() => navigate('/internships')}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2 shadow-sm"
      >
        <span>🔍</span> Browse Internships
      </button>
      <button
        onClick={() => navigate('/student/profile/edit')}
        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium flex items-center gap-2 shadow-sm"
      >
        <span>📝</span> Improve Profile
      </button>
    </>
  )}
  
  {notification.type === 'interview' && (
    <div className="flex gap-2">
      <button
        onClick={() => navigate('/student/applications')}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium flex items-center gap-2"
      >
        <span>👁️</span> View Details
      </button>
      <button
        onClick={() => markAsRead(notification.id)}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
      >
        Dismiss
      </button>
    </div>
  )}
  
  {notification.type === 'new_internship' && (
    <button
      onClick={() => {
        const internshipId = notification.internship_id;
        if (internshipId) {
          navigate(`/internships/${internshipId}`);
        } else {
          navigate('/internships');
        }
      }}
      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium flex items-center gap-2 shadow-sm"
    >
      <span>🔍</span> Apply Now
    </button>
  )}
</div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Notifications;