import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSocket } from '../../hooks/useSocket';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Sparkles, Bell, LogOut, Search, FileText, Bookmark, Calendar, 
  TrendingUp, User, Settings, Award, Briefcase, Clock, GraduationCap, 
  MapPin, Code, Download, Eye, ChevronRight, Menu, X, LayoutDashboard,
  Target, Zap, ShieldCheck, AlertCircle, Mail, Phone, Github, Linkedin,
  Globe, Star, CheckCircle, AlertTriangle, Info, ArrowRight, Home,
  BarChart3, Users, Building2, MessageCircle, HelpCircle, Facebook,
  Twitter, Linkedin as LinkedinIcon, Github as GithubIcon,Activity 
} from 'lucide-react';
import { getQuickRecommendations } from '../../services/matchingService';
import RecommendationCard from '../../components/student/RecommendationCard';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeApplications: 0,
    upcomingInterviews: 0,
    savedInternships: 0,
    successRate: 0 
  });
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [suspended, setSuspended] = useState(false);
  const [quickRecommendations, setQuickRecommendations] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeQuickAction, setActiveQuickAction] = useState(null);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [showAllDeadlines, setShowAllDeadlines] = useState(false);


  // ✅✅✅ أضف هذا الجزء هنا - بعد الـ useState مباشرة ✅✅✅
  const { newInternshipAlert, setNewInternshipAlert } = useSocket(user?.id, 'student');

  // ✅ عرض إشعار فوري عند وصول تدريب جديد
  useEffect(() => {
    if (newInternshipAlert) {
      toast.success(
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">📢</span>
            <strong className="text-indigo-600">{newInternshipAlert.company_name}</strong>
          </div>
          <p className="text-sm">{newInternshipAlert.title}</p>
          <div className="flex gap-2 mt-1">
            <button 
              onClick={() => {
                window.location.href = `/internships/${newInternshipAlert.internship_id}`;
              }}
              className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition"
            >
              عرض التفاصيل →
            </button>
          </div>
        </div>,
        {
          duration: 8000,
          position: 'top-right',
          icon: '🎯',
        }
      );

      // إضافة الإشعار إلى القائمة المحلية
      setNotifications(prev => [{
        id: Date.now(),
        title: '📢 تدريب جديد متاح!',
        message: `${newInternshipAlert.company_name} أعلنت عن تدريب جديد: "${newInternshipAlert.title}"`,
        type: 'new_internship',
        is_read: false,
        created_at: new Date().toISOString(),
        internship_id: newInternshipAlert.internship_id
      }, ...prev]);

      setNewInternshipAlert(null);
    }
  }, [newInternshipAlert, setNewInternshipAlert]);


  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || userData.user_type !== 'student') {
      navigate('/login');
      return;
    }
    
    setUser(userData);
    fetchStudentProfile();
    fetchRealStats();
    fetchNotifications();
    fetchRecentActivities();
    fetchQuickRecommendations();
    fetchSavedInternships();
    fetchUpcomingDeadlines();
  }, [navigate]);

  useEffect(() => {
    const handleNotificationsUpdate = () => {
      fetchNotifications();
    };
    window.addEventListener('notifications-updated', handleNotificationsUpdate);
    return () => {
      window.removeEventListener('notifications-updated', handleNotificationsUpdate);
    };
  }, []);

   const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/student/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

   const markNotificationAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/student/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

   const downloadInternshipAgreement = async (internshipId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/student/internships/${internshipId}/agreement`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'internship_agreement.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
     toast.success('Agreement downloaded successfully!');  
    } catch (error) {
      console.error('Error downloading agreement:', error);
      toast.error('Error downloading agreement. Please try again.');  
    }
  };

   const handleQuickAction = (action) => {
    switch(action) {
      case 'find-internships':
        navigate('/internships');
        break;
      case 'my-applications':
        navigate('/student/applications');
        break;
      case 'my-cv':
        navigate('/student/profile/edit');
        break;
      case 'settings':
        navigate('/student/settings');
        break;
      case 'github':
        window.open(profile.github_url || '#', '_blank');
        break;
      case 'portfolio':
        window.open(profile.portfolio_url || '#', '_blank');
        break;
      case 'analytics':
        navigate('/student/analytics');
        break;
      case 'resources':
        navigate('/student/resources');
        break;
      default:
        break;
    }
  setTimeout(() => setActiveQuickAction(null), 500);
};


 const fetchStudentProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      let profileData = response.data.profile;
      
      // معالجة المهارات إذا كانت string
      if (typeof profileData.skills === 'string') {
        try {
          profileData.skills = JSON.parse(profileData.skills);
        } catch (e) {
          profileData.skills = profileData.skills.split(',').map(s => s.trim());
        }
      }

       // ✅ ADD THIS - Parse soft_skills if string
      if (typeof profileData.soft_skills === 'string') {
        try {
          profileData.soft_skills = JSON.parse(profileData.soft_skills);
        } catch (e) {
          profileData.soft_skills = profileData.soft_skills.split(',').map(s => s.trim());
        }
      }

       // ✅ ADD THIS - Parse experiences if string
      if (typeof profileData.experiences === 'string') {
        try {
          profileData.experiences = JSON.parse(profileData.experiences);
        } catch (e) {
          profileData.experiences = [];
        }
      }
      
    // ✅ ADD THIS - Ensure arrays exist
      if (!profileData.soft_skills) profileData.soft_skills = [];
      if (!profileData.experiences) profileData.experiences = [];
      
      // Default values for missing fields
      if (!profileData.bio) profileData.bio = '';
      if (!profileData.date_of_birth) profileData.date_of_birth = '';
      if (!profileData.skills) profileData.skills = [];
      if (!profileData.phone) profileData.phone = '';
      if (!profileData.wilaya) profileData.wilaya = '';
      if (!profileData.university) profileData.university = '';
      if (!profileData.specialization) profileData.specialization = '';
      if (!profileData.year_of_study) profileData.year_of_study = '';
      if (!profileData.first_name) profileData.first_name = '';
      if (!profileData.last_name) profileData.last_name = '';
      
      // ✅ تحويل date_of_birth إلى string إذا كان موجوداً
      if (profileData.date_of_birth) {
        profileData.date_of_birth = new Date(profileData.date_of_birth).toISOString().split('T')[0];
      }
      
      console.log('📊 Profile loaded with defaults:', {
        bio: profileData.bio || '(empty)',
        date_of_birth: profileData.date_of_birth || '(empty)',
        skills: profileData.skills?.length || 0,
        phone: profileData.phone || '(empty)'
      });
      
      setProfile(profileData);
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...user,
        profile_image_url: profileData.profile_image_url
      }));
    }
  } catch (error) {
    console.error('Profile fetch error:', error);
    if (error.response && error.response.status === 403) {
      setSuspended(true);
    }
  } finally {
    setLoading(false);
  }
};

  const fetchUpcomingDeadlines = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/student/deadlines', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setUpcomingDeadlines(response.data.deadlines);
      }
    } catch (error) {
      console.error('Error fetching deadlines:', error);
      setUpcomingDeadlines([]);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/student/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        const unreadNotifications = response.data.notifications.filter(n => !n.is_read);
        setNotifications(unreadNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const applicationsRes = await axios.get('http://localhost:5000/api/student/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (applicationsRes.data.success) {
        const apps = applicationsRes.data.applications;
        const notificationsRes = await axios.get('http://localhost:5000/api/student/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const notifications = notificationsRes.data.success ? notificationsRes.data.notifications : [];
        const agreementsRes = await axios.get('http://localhost:5000/api/student/agreements', {
          headers: { Authorization: `Bearer ${token}` }
        });
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
        
        const applicationActivities = apps.slice(0, 3).map(app => ({
          id: `app-${app.id}`,
          action: `Applied for ${app.internship_title || 'internship'}`,
          time: getTimeAgo(app.applied_date),
          icon: getActivityIcon(app.status),
          color: getActivityColor(app.status),
          link: `/student/applications/${app.id}`
        }));
        
        const notificationActivities = notifications.slice(0, 3).map(notif => ({
          id: `notif-${notif.id}`,
          action: notif.title || 'Notification',
          time: getTimeAgo(notif.created_at),
          icon: getNotificationIcon(notif.type),
          color: getNotificationColor(notif.type),
          link: '/student/notifications'
        }));
        
        const agreementActivities = agreements.slice(0, 2).map(agreement => ({
          id: `agree-${agreement.id}`,
          action: `Agreement for ${agreement.internship_title || 'internship'}`,
          time: getTimeAgo(agreement.generated_at || agreement.created_at),
          icon: '📄',
          color: 'indigo',
          link: '/student/agreements'
        }));
        
        const allActivities = [...applicationActivities, ...notificationActivities, ...agreementActivities];
        setRecentActivities(allActivities.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      setRecentActivities([]);
    }
  };

  const fetchQuickRecommendations = async () => {
    try {
      const data = await getQuickRecommendations();
      if (data.success) {
        setQuickRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error('Error fetching quick recommendations:', error);
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
      
      setSavedIds(prev => 
        method === 'POST' 
          ? [...prev, internshipId] 
          : prev.filter(id => id !== internshipId)
      );
      
      toast.success(method === 'POST' ? 'Saved successfully!' : 'Removed from saved');
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Something went wrong');
    }
  };

  const fetchRealStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const applicationsRes = await axios.get('http://localhost:5000/api/student/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (applicationsRes.data.success) {
        const apps = applicationsRes.data.applications;
        const activeApplications = apps.filter(app => app.status === 'pending' || app.status === 'reviewed').length;
        const accepted = apps.filter(app => app.status === 'accepted').length;
        const rejected = apps.filter(app => app.status === 'rejected').length;
        const totalDecided = accepted + rejected;
        let successRate = 0;
        if (totalDecided > 0) successRate = Math.round((accepted / totalDecided) * 100);
        const upcomingInterviews = apps.filter(app => app.status === 'interview').length;
        
        let savedInternships = 0;
        try {
          const savedRes = await axios.get('http://localhost:5000/api/student/saved-internships', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (savedRes.data.success) savedInternships = savedRes.data.savedInternships?.length || 0;
        } catch (error) {
          savedInternships = 0;
        }
        
        setStats({ activeApplications, upcomingInterviews, savedInternships, successRate });
      }
    } catch (error) {
      console.error('Error fetching real stats:', error);
      fetchDashboardStats()
    }
  };

  const getActivityIcon = (status) => {
    switch(status) {
      case 'pending': return '⏳';
      case 'reviewed': return '🔍';
      case 'interview': return '🎯';
      case 'accepted': return '✅';
      case 'rejected': return '❌';
      default: return '📋';
    }
  };

  const getActivityColor = (status) => {
    switch(status) {
      case 'pending': return 'yellow';
      case 'reviewed': return 'blue';
      case 'interview': return 'purple';
      case 'accepted': return 'green';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'application': return '📨';
      case 'acceptance': return '✅';
      case 'interview': return '🎯';
      case 'agreement': return '📄';
      case 'validation': return '🟢';
      default: return '📢';
    }
  };

  const getNotificationColor = (type) => {
    switch(type) {
      case 'application': return 'blue';
      case 'acceptance': return 'green';
      case 'interview': return 'purple';
      case 'agreement': return 'indigo';
      case 'validation': return 'emerald';
      default: return 'gray';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

const handleSign = async (agreementId) => {
  try {
    navigate(`/student/agreements/${agreementId}`);
  } catch (error) {
    console.error('Error:', error);
    toast.error('Error signing agreement');
  }
};

const calculateProfileCompletion = () => {
  if (!profile) return 0;
  
  const fields = [
    profile.first_name && profile.last_name,
    profile.phone?.trim(),
    profile.wilaya?.trim(),
    profile.university?.trim(),
    profile.specialization?.trim(),
    profile.year_of_study?.trim(),
    profile.skills?.length > 0,
    profile.soft_skills?.length > 0,
    profile.experiences?.length > 0,
    profile.bio?.trim()
  ];
  
  const completedCount = fields.filter(Boolean).length;
  return Math.round((completedCount / 10) * 100);
};

// Search Progress - حسب أهمية الحقول للبحث (5 حقول = 100%)
const calculateSearchProgress = () => {
  if (!profile) return 0;
  
  let score = 0;
  
  // المهارات التقنية (الأهم) - 30%
  if (profile.skills && profile.skills.length >= 5) score += 30;
  else if (profile.skills && profile.skills.length > 0) score += 20;
  
  
  // الموقع (الولاية) - 20%
  if (profile.wilaya) score += 20;
  
  // التخصص - 15%
  if (profile.specialization) score += 15;
  
  // التقديمات النشطة - 10%
  if (stats.activeApplications > 0) score += 10;
  
  return Math.min(score, 100);
};

// أضف هذه الدالة بعد الـ useState وقبل الـ return
const shouldShowSignButton = (notification) => {
  // الأنواع التي لا تظهر فيها زر التوقيع
  const noSignButtonTypes = [
    'agreement_completed',      // اكتملت الاتفاقية
    'agreement_generated',      // تم إنشاء الاتفاقية
    'company_signed',           // توقيع الشركة
    'validation',               // إنشاء الاتفاقية من الأدمن
    'new_internship'            // تدريب جديد
  ];
  
  return !noSignButtonTypes.includes(notification.type);
};

// دالة لتحديد الزر المناسب لكل إشعار
const getNotificationButton = (notification) => {
  // ✅ اكتمال الاتفاقية (All Parties Signed)
  if (notification.title === '🎉 All Parties Signed!' || notification.type === 'agreement_completed') {
    return {
      text: '👁️ View Agreement',
      color: 'bg-green-100 text-green-700 hover:bg-green-200',
      onClick: () => navigate(`/student/agreements/${notification.agreement_id}`)
    };
  }
  
  // ✅ توقيع الشركة (Company Signed Agreement)
  if (notification.title === '📄 Company Signed Agreement' || notification.type === 'company_signed') {
    return {
      text: '👁️ View Agreement',
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      onClick: () => navigate(`/student/agreements/${notification.agreement_id}`)
    };
  }
  
  // ✅ توقيع الطالب (Agreement Signed) - لا يحتاج زر توقيع
  if (notification.title === '✅ Agreement Signed' || notification.type === 'agreement_signed') {
    return {
      text: '✅ Already Signed',
      color: 'bg-gray-100 text-gray-500',
      onClick: null,
      disabled: true
    };
  }
  
  // ✅ إنشاء الاتفاقية (INTERNSHIP AGREEMENT Generated)
  if (notification.title === '📄 INTERNSHIP AGREEMENT Generated!' || notification.type === 'validation') {
    return {
      text: '👁️ Preview Agreement',
      color: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      onClick: () => navigate(`/student/agreements/${notification.agreement_id}`)
    };
  }
  
  // ✅ تدريب جديد
  if (notification.type === 'new_internship') {
    return {
      text: '🔍 View Internship',
      color: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
      onClick: () => navigate(`/internships/${notification.internship_id}`)
    };
  }
  
  return null;
};



  if (suspended) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-100 to-rose-100 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full p-8 text-center border border-white/20"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <AlertCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-2">Account Suspended</h1>
          <p className="text-gray-600 mb-6">Please contact the administrator for more information.</p>
          <div className="bg-red-50/80 rounded-2xl p-4 mb-6 text-left">
            <p className="text-sm text-red-800 font-medium mb-2">Possible reasons:</p>
            <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
              <li>Violation of platform policies</li>
              <li>Multiple failed login attempts</li>
              <li>Administrative action</li>
            </ul>
          </div>
          <div className="flex gap-4">
            <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:shadow-lg transition-all font-medium">Back to Login</button>
            <button onClick={() => window.location.href = 'mailto:admin@stag.io'} className="flex-1 px-6 py-3 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-all font-medium">Contact Admin</button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const searchProgress = calculateSearchProgress();
  const profileCompletion = calculateProfileCompletion();

return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 pb-20 md:pb-0">
    {/* Modern Navbar with Glassmorphism */}
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section - Indigo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-indigo-700">
              Student Portal
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { to: "/student/dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} />, active: true },
              { to: "/internships", label: "Find", icon: <Search size={16} /> },
              { to: "/student/applications", label: "Apps", icon: <FileText size={16} /> },
              { to: "/student/saved-internships", label: "Favorite", icon: <Star size={16} /> },
              { to: "/student/agreements", label: "Agreements", icon: <Award size={16} /> }
            ].map((item) => (
              <Link 
                key={item.label} 
                to={item.to} 
                className={`px-4 py-2 rounded-xl transition-all duration-300 font-medium flex items-center gap-2 ${
                  item.active 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25' 
                    : 'text-gray-600 hover:bg-gray-100 hover:scale-105'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button onClick={() => setShowNotificationPanel(!showNotificationPanel)} className="relative p-2 rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-110">
                <Bell size={20} className="text-gray-600" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-full text-xs flex items-center justify-center shadow-lg animate-pulse">
                    {notifications.length > 9 ? '9+' : notifications.length}
                  </span>
                )}
              </button>
             {showNotificationPanel && (
  <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50">
    <div className="p-3 border-b border-gray-100">
      <h3 className="font-semibold text-gray-900">Notifications</h3>
    </div>
    <div className="max-h-96 overflow-y-auto">
      {notifications.length > 0 ? notifications.slice(0, 5).map(notif => {
        // تحديد الزر المناسب حسب عنوان الإشعار
        let button = null;
        
        if (notif.title === '🎉 All Parties Signed!') {
          button = { text: '👁️ View Agreement', color: 'bg-green-100 text-green-700 hover:bg-green-200', link: `/student/agreements/${notif.agreement_id}` };
        } else if (notif.title === '📄 Company Signed Agreement') {
          button = { text: '👁️ View Agreement', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200', link: `/student/agreements/${notif.agreement_id}` };
        } else if (notif.title === '✅ Agreement Signed') {
          button = { text: '✅ Already Signed', color: 'bg-gray-100 text-gray-500', link: null, disabled: true };
        } else if (notif.title === '📄 INTERNSHIP AGREEMENT Generated!') {
          button = { text: '👁️ Preview Agreement', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200', link: `/student/agreements/${notif.agreement_id}` };
        }
        
        return (
          <div key={notif.id} className="p-3 border-b border-gray-50 transition-all duration-300">
            <p className="text-sm font-medium text-gray-800">{notif.title}</p>
            <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
            <p className="text-xs text-gray-400 mt-1">{new Date(notif.created_at).toLocaleString()}</p>
            
            {button && !button.disabled && (
              <button
                onClick={() => navigate(button.link)}
                className={`mt-2 px-3 py-1 rounded-lg text-xs transition-all duration-300 ${button.color}`}
              >
                {button.text}
              </button>
            )}
            
            {button && button.disabled && (
              <span className={`mt-2 inline-block px-3 py-1 rounded-lg text-xs ${button.color}`}>
                {button.text}
              </span>
            )}
          </div>
        );
      }) : (
        <div className="p-4 text-center text-gray-500 text-sm">No new notifications</div>
      )}
    </div>
    <div className="p-2 border-t border-gray-100">
      <button onClick={() => navigate('/student/notifications')} className="w-full text-center text-indigo-600 text-sm py-1 hover:bg-indigo-50 rounded-lg transition-all">View All</button>
    </div>
  </div>
)}
            </div>
            
            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{profile?.first_name} {profile?.last_name}</p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
              <div className="relative group">
                <img src={profile?.profile_image_url ? `http://localhost:5000${profile.profile_image_url}?t=${Date.now()}` : `https://ui-avatars.com/api/?name=${profile?.first_name}+${profile?.last_name}&background=6366f1&color=fff&size=40&rounded=true`} alt="Profile" className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20 group-hover:ring-4 transition-all duration-300" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full ring-2 ring-white"></div>
              </div>
            </div>
            
            <button onClick={handleLogout} className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 font-medium hover:scale-105">
              <LogOut size={16} />Logout
            </button>
            
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-all">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-2">
              <Link to="/student/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium">Dashboard</Link>
              <Link to="/internships" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 flex items-center gap-2"><Search size={18} />Find Internships</Link>
              <Link to="/student/applications" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 flex items-center gap-2"><FileText size={18} />Applications</Link>
              <Link to="/student/saved-internships" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 flex items-center gap-2"><Star size={18} />Favorite</Link>
              <Link to="/student/agreements" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 flex items-center gap-2"><Award size={18} />Agreements</Link>
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white hover:shadow-lg flex items-center gap-2"><LogOut size={18} />Logout</button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>

    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Hero Welcome Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100 }} className="mb-8">
<div className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-indigo-50 to-white rounded-2xl shadow-sm p-6 md:p-8 border border-blue-100">
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400/60 rounded-full animate-ping"></div>
    <div className="absolute top-20 right-20 w-3 h-3 bg-indigo-400/50 rounded-full animate-pulse"></div>
    <div className="absolute bottom-10 left-1/4 w-2 h-2 bg-blue-400/50 rounded-full animate-ping" style={{ animationDelay: "0.5s" }}></div>
    <div className="absolute bottom-20 right-1/3 w-1.5 h-1.5 bg-indigo-400/40 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
  </div>
  
  <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
        Welcome back, {profile?.first_name} {profile?.last_name}!  
        <span className="inline-block animate-wave ml-1">👋</span>
      </h1>
      <p className="text-gray-500">{profile?.university ? `${profile.university} - ${profile.specialization || ''}` : 'Ready to find your perfect internship?'}</p>
    </div>
    
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center min-w-[120px] hover:bg-white transition-all duration-300 border border-blue-100 shadow-sm">
      <p className="text-blue-600 text-xs font-medium">Profile Completion</p>
      <p className="text-2xl font-bold text-blue-700">{profileCompletion}%</p>
      <div className="w-full h-1.5 bg-blue-100 rounded-full mt-1 overflow-hidden">
        <motion.div 
          className="h-full bg-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${profileCompletion}%` }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
    </div>
  </div>
</div>
      </motion.div>

      {/* Enhanced Stats Grid - 5 Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
  {[
    { label: "Active", value: stats.activeApplications, icon: <Briefcase size={18} />, iconBg: "bg-blue-100", iconColor: "text-blue-600", path: "/student/applications" },
    { label: "Interviews", value: stats.upcomingInterviews, icon: <Calendar size={18} />, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", path: "/student/applications?filter=interview" },
    { label: "Favorite", value: stats.savedInternships, icon: <Star size={18} />, iconBg: "bg-amber-100", iconColor: "text-amber-600", path: "/student/saved-internships" },
    { label: "Pending", value: stats.activeApplications, icon: <Clock size={18} />, iconBg: "bg-sky-100", iconColor: "text-sky-600", path: "/student/applications" },
    { label: "Success", value: stats.successRate ? `${stats.successRate}%` : "0%", icon: <TrendingUp size={18} />, iconBg: "bg-violet-100", iconColor: "text-violet-600", path: null }
  ].map((stat, idx) => (
    <motion.div 
      key={idx} 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: idx * 0.05, type: "spring" }}
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden cursor-pointer" 
      onClick={() => stat.path && navigate(stat.path)}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`w-8 h-8 rounded-lg ${stat.iconBg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
            <div className={stat.iconColor}>{stat.icon}</div>
          </div>
          <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all duration-300" />
        </div>
        <motion.p className="text-2xl font-bold text-gray-800" initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ delay: idx * 0.05 + 0.3 }}>{stat.value}</motion.p>
        <p className="text-xs text-gray-500 mt-1 font-medium">{stat.label}</p>
      </div>
    </motion.div>
  ))}
</div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <img src={profile?.profile_image_url ? `http://localhost:5000${profile.profile_image_url}?t=${Date.now()}` : `https://ui-avatars.com/api/?name=${profile?.first_name}+${profile?.last_name}&background=6366f1&color=fff&size=100&rounded=true`} alt="Profile" className="w-24 h-24 rounded-xl object-cover ring-4 ring-indigo-100" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{profile?.first_name} {profile?.last_name}</h2>
                <p className="text-gray-500 text-sm">{profile?.specialization || 'Computer Science Student'}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs flex items-center gap-1"><GraduationCap size={12} /> Year {profile?.year_of_study || '3'}</span>
                  <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs flex items-center gap-1"><MapPin size={12} /> {profile?.wilaya || 'Not set'}</span>
                </div>
              </div>
              <button onClick={() => navigate('/student/profile/edit')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium">Edit Profile</button>
            </div>
            {profile?.skills && profile.skills.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.slice(0, 6).map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">{skill}</span>
                  ))}
                  {profile.skills.length > 6 && <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">+{profile.skills.length - 6}</span>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Activity size={16} className="text-indigo-600" /> Recent Activity</h3>
          <div className="space-y-3">
            {recentActivities.slice(0, 4).map((activity, idx) => (
              <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition" onClick={() => navigate(activity.link)}>
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-lg">{activity.icon}</div>
                <div className="flex-1"><p className="font-medium text-sm text-gray-800">{activity.action}</p><p className="text-xs text-gray-400">{activity.time}</p></div>
                <ChevronRight size={14} className="text-gray-300" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Calendar size={16} className="text-amber-600" /> Upcoming Deadlines</h3>
          {upcomingDeadlines.length > 0 ? upcomingDeadlines.slice(0, 3).map((deadline, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border-l-4 border-amber-500 bg-amber-50/30 rounded-r-lg mb-2">
              <div><p className="text-sm font-medium text-gray-800">{deadline.title}</p><p className="text-xs text-gray-500">{deadline.company}</p></div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${deadline.daysLeft <= 3 ? 'bg-red-100 text-red-600' : deadline.daysLeft <= 7 ? 'bg-orange-100 text-orange-600' : 'bg-amber-100 text-amber-600'}`}>{deadline.daysLeft} days left</span>
            </div>
          )) : (
            <div className="text-center py-6"><Calendar size={32} className="text-gray-300 mx-auto mb-2" /><p className="text-sm text-gray-500">No upcoming deadlines</p></div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recommended for You</h2>
          <button onClick={() => navigate('/student/recommendations')} className="text-indigo-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition">View All <ChevronRight size={14} /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickRecommendations.length > 0 ? quickRecommendations.slice(0, 3).map((internship, idx) => (
            <RecommendationCard key={internship.id} internship={internship} onSave={handleSave} isSaved={savedIds.includes(internship.id)} />
          )) : (
            <div className="col-span-3 bg-white rounded-xl p-8 text-center border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3"><Sparkles size={24} className="text-gray-400" /></div>
              <p className="text-gray-500">No recommendations yet</p>
              <button onClick={() => navigate('/student/profile/edit')} className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">Complete Profile</button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
        <p>© {new Date().getFullYear()} Stag.io - Internship Management Platform. All rights reserved.</p>
      </footer>
    </div>

    {/* Mobile Bottom Navigation */}
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-white/20 md:hidden z-50 shadow-lg">
      <div className="flex justify-around py-2">
        {[
          { icon: <LayoutDashboard size={20} />, label: 'Home', path: '/student/dashboard' },
          { icon: <Search size={20} />, label: 'Find', path: '/internships' },
          { icon: <FileText size={20} />, label: 'Apps', path: '/student/applications' },
          { icon: <Bell size={20} />, label: 'Alerts', path: '/student/notifications', badge: notifications.length },
          { icon: <User size={20} />, label: 'Profile', path: '/student/profile/edit' },
        ].map((item) => (
          <Link key={item.label} to={item.path} className="flex flex-col items-center py-1 px-3 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-110">
            <div className="relative">{item.icon}{item.badge > 0 && <span className="absolute -top-1 -right-2 w-4 h-4 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] rounded-full flex items-center justify-center shadow-md animate-pulse">{item.badge > 9 ? '9+' : item.badge}</span>}</div>
            <span className="text-[10px] text-gray-500 mt-0.5">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>

    <style>{`
      @keyframes wave { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(15deg); } 75% { transform: rotate(-15deg); } }
      .animate-wave { animation: wave 0.5s ease-in-out infinite; display: inline-block; }
    `}</style>
  </div>
);
};

export default StudentDashboard;