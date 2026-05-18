import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from "react-hot-toast";

import { 
  Building2, 
  MapPin, 
  Users, 
  Briefcase, 
  Linkedin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Github,
  FileText,
  Bell,
  LogOut,
  Search,
  Plus,
  Eye,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  Award,
  Settings,
  ChevronRight,
  Menu,
  X,
  LayoutDashboard,
  Target,
  Zap,
  Activity,
  BarChart3,
  Star,
  UserCheck,
  Mail,
  Phone,
  Globe,
  ArrowRight
} from 'lucide-react';

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [stats, setStats] = useState({
    totalInternships: 0,
    totalApplications: 0,
    pendingApplications: 0,
    interviewApplications: 0,
    acceptedApplications: 0
  });
  const [analytics, setAnalytics] = useState({
  acceptanceRate: 0,
  averageRating: 0,
  totalApplications: 0,
  totalViews: 0
});

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [suspended, setSuspended] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

useEffect(() => {
  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token || userData.user_type !== 'company') {
    navigate('/login');
    return;
  }
  
  setUser(userData);

  const checkAccountStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 Checking company account status...');
      
      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Account active:', response.data);
      
      if (response.data.success) {
        setProfile(response.data.profile);
        fetchCompanyProfile();
        fetchDashboardStats();
        fetchNotifications();
        fetchRecentActivities();
        fetchAnalytics();
      }
    } catch (error) {
      console.error('❌ Account check error:', error);
      console.log('🔍 Error status:', error.response?.status);
      
      // ✅ إذا كان الخطأ 403، الحساب معلق
      if (error.response && error.response.status === 403) {
        console.log('🚨 Company is suspended! Setting suspended=true');
        setSuspended(true);
        setLoading(false);
        return;
      } else {
        // أخطاء أخرى (مثل 401)
        console.log('🚪 Other error, redirecting to login...');
        navigate('/login');
      }
    }
  };

  checkAccountStatus();
  
}, [navigate]);


  const fetchCompanyProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/company/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setProfile(response.data.profile);
        console.log('✅ Company profile loaded:', response.data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/company/dashboard-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        totalInternships: 0,
        totalApplications: 0,
        pendingApplications: 0,
        interviewApplications: 0,
        acceptedApplications: 0
      });
    }
  };


  // ✅ أضف هذه الدالة بعد fetchDashboardStats
const fetchNotifications = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5000/api/company/notifications', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.notifications.filter(n => !n.is_read).length);
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};


// ✅ أضف هذه الدالة بعد fetchNotifications
const fetchRecentActivities = async () => {
  try {
    setActivitiesLoading(true);
    const token = localStorage.getItem('token');
    
    // جلب آخر 5 تطبيقات
    const applicationsRes = await axios.get('http://localhost:5000/api/company/applications?limit=5', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // جلب آخر 5 تدريبات منشورة
    const internshipsRes = await axios.get('http://localhost:5000/api/company/internships?limit=5', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const activities = [];
    
    // إضافة نشاطات التطبيقات
    if (applicationsRes.data.success && applicationsRes.data.applications) {
      applicationsRes.data.applications.slice(0, 3).forEach(app => {
        activities.push({
          id: `app-${app.id}`,
          icon: '📨',
          color: 'blue',
          title: `New application from ${app.student_name || 'student'}`,
          description: app.internship_title || '',
          time: getTimeAgo(app.created_at),
          rawTime: new Date(app.created_at),
          link: `/company/applications`
        });
      });
    }
    
    // إضافة نشاطات التدريبات المنشورة
    if (internshipsRes.data.success && internshipsRes.data.internships) {
      internshipsRes.data.internships.slice(0, 3).forEach(internship => {
        activities.push({
          id: `intern-${internship.id}`,
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
    
    // ترتيب حسب الأحدث
    activities.sort((a, b) => b.rawTime - a.rawTime);
    
    setRecentActivities(activities.slice(0, 3));
    
  } catch (error) {
    console.error('Error fetching activities:', error);
    // بيانات افتراضية في حالة الخطأ
    setRecentActivities([
      {
        id: 'default-1',
        icon: '📨',
        color: 'blue',
        title: 'New application received',
        time: '2 hours ago',
        link: '/company/applications'
      },
      {
        id: 'default-2',
        icon: '✅',
        color: 'green',
        title: 'Internship posted successfully',
        time: 'Yesterday',
        link: '/company/internships'
      },
      {
        id: 'default-3',
        icon: '👥',
        color: 'purple',
        title: '5 new applications',
        time: '2 days ago',
        link: '/company/applications'
      }
    ]);
  } finally {
    setActivitiesLoading(false);
  }
};

// ✅ دالة مساعدة لحساب الوقت المنقضي
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

const fetchAnalytics = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5000/api/company/analytics', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      setAnalytics(response.data.analytics);
      console.log('📊 Analytics data:', response.data.analytics);
    }
  } catch (error) {
    console.error('Error fetching analytics:', error);
  }
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

// للتشخيص - شاهد في Console
console.log('📊 Rendering - suspended =', suspended);





  if (suspended) {
    console.log('✅ Showing suspended page');
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-red-100 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full p-8 text-center border border-white/20"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-2">Account Suspended</h1>
          <p className="text-gray-600 mb-6">
            Your company account has been suspended. Please contact the administrator for more information.
          </p>
          <div className="bg-red-50/80 rounded-2xl p-4 mb-6 text-left border border-red-200">
            <p className="text-sm text-red-800 font-medium mb-2">Possible reasons:</p>
            <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
              <li>Violation of platform policies</li>
              <li>Multiple failed login attempts</li>
              <li>Administrative action</li>
            </ul>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                localStorage.clear();
                navigate('/login');
              }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 font-medium"
            >
              Back to Login
            </button>
            <button
              onClick={() => window.location.href = 'mailto:admin@stag.com?subject=Suspended Company Account'}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium"
            >
              Contact Admin
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-6">
            Account ID: {user?.id || 'N/A'}
          </p>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 pb-20 md:pb-0">
      {/* Modern Navbar with Glassmorphism */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 size={18} className="text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Company Portal</span>
            </div>

            <div className="hidden md:flex items-center gap-1">
              {[
                { to: "/company/dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} />, active: true },
                { to: "/company/applications", label: "Applications", icon: <Users size={16} /> },
                { to: "/company/internships", label: "Internships", icon: <Briefcase size={16} /> },
                { to: "/company/create-internship", label: "Post", icon: <Plus size={16} /> },
                { to: "/company/agreements", label: "Agreements", icon: <FileText size={16} /> }
              ].map((item) => (
                <Link 
                  key={item.label} 
                  to={item.to} 
                  className={`px-4 py-2 rounded-xl transition-all duration-300 font-medium flex items-center gap-2 ${
                    item.active 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/25' 
                      : 'text-gray-600 hover:bg-gray-100 hover:scale-105'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotificationPanel(!showNotificationPanel)} 
                  className="relative p-2 rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-110"
                >
                  <Bell size={20} className="text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-full text-xs flex items-center justify-center shadow-lg animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                
                {showNotificationPanel && (
                  <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50">
                    <div className="p-3 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 5).map(notif => (
                          <div key={notif.id} className="p-3 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent cursor-pointer border-b border-gray-50 transition-all duration-300">
                            <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">No new notifications</div>
                      )}
                    </div>
                    <div className="p-2 border-t border-gray-100">
                      <button onClick={() => navigate('/company/notifications')} className="w-full text-center text-blue-600 text-sm py-1 hover:bg-blue-50 rounded-lg transition-all">View All</button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Profile Section */}
              <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{profile?.company_name || 'Company'}</p>
                  <p className="text-xs text-gray-500">Company</p>
                </div>

                <div className="relative group">
                  {profile?.logo_url ? (
                    <img 
                      src={`http://localhost:5000${profile.logo_url}`}
                      alt={profile.company_name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20 group-hover:ring-4 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center ring-2 ring-blue-500/20">
                      <Building2 size={18} className="text-blue-600" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Logout Button */}
              <button 
                onClick={handleLogout} 
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 font-medium hover:scale-105"
              >
                <LogOut size={16} />Logout
              </button>
              
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-all">
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: "auto" }} 
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-gray-100"
            >
              <div className="flex flex-col gap-2">
                <Link to="/company/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium">Dashboard</Link>
                <Link to="/company/applications" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 flex items-center gap-2"><Users size={18} />Applications</Link>
                <Link to="/company/internships" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 flex items-center gap-2"><Briefcase size={18} />Internships</Link>
                <Link to="/company/create-internship" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 flex items-center gap-2"><Plus size={18} />Post Internship</Link>
                <Link to="/company/agreements" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 flex items-center gap-2"><FileText size={18} />Agreements</Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white hover:shadow-lg flex items-center gap-2"><LogOut size={18} />Logout</button>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-2xl shadow-2xl p-6 md:p-8 transform transition-all duration-500 hover:scale-[1.01]">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-10 left-10 w-2 h-2 bg-white/40 rounded-full animate-ping"></div>
              <div className="absolute top-20 right-20 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
              <div className="absolute bottom-10 left-1/4 w-2 h-2 bg-white/40 rounded-full animate-ping" style={{ animationDelay: "0.5s" }}></div>
              <div className="absolute bottom-20 right-1/3 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "1s" }}></div>
            
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  Welcome, {profile?.company_name || 'Company'}! 🏢
                </h1>
                <p className="text-cyan-100">Manage your internships, candidates, and company profile.</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center min-w-[180px] hover:bg-white/30 transition-all duration-300">
                <p className="text-white/80 text-xs">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: "Active Internships", value: stats.totalInternships, icon: <Briefcase size={18} />, color: "from-blue-500 to-cyan-500", gradient: "from-blue-600 to-cyan-600", path: "/company/internships" },
            { label: "Total Applications", value: stats.totalApplications, icon: <Users size={18} />, color: "from-emerald-500 to-teal-500", gradient: "from-emerald-600 to-teal-600", path: "/company/applications" },
            { label: "Pending Review", value: stats.pendingApplications, icon: <Clock size={18} />, color: "from-amber-500 to-orange-500", gradient: "from-amber-600 to-orange-600", path: "/company/applications?filter=pending" },
            { label: "Interviews", value: stats.interviewApplications, icon: <Calendar size={18} />, color: "from-purple-500 to-pink-500", gradient: "from-purple-600 to-pink-600", path: "/company/applications?filter=interview" },
            { label: "Accepted", value: stats.acceptedApplications, icon: <CheckCircle size={18} />, color: "from-green-500 to-emerald-500", gradient: "from-green-600 to-emerald-600", path: "/company/applications?filter=accepted" },
            { label: "Acceptance Rate", value: analytics.acceptanceRate ? `${analytics.acceptanceRate}%` : "-", icon: <TrendingUp size={18} />, color: "from-slate-500 to-gray-500", gradient: "from-slate-600 to-gray-600", path: null }
          ].map((stat, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: idx * 0.05, type: "spring" }}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 overflow-hidden cursor-pointer" 
              onClick={() => stat.path && navigate(stat.path)}
            >
              <motion.div 
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: idx * 0.05 + 0.2 }}
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${stat.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all duration-300" />
                </div>
                <motion.p 
                  className="text-xl font-bold text-gray-900"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.05 + 0.3 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </motion.div>
          ))}
        </div>

        {/* Main Grid - Company Info & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Company Info Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ type: "spring" }}
            className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl shadow-xl overflow-hidden border border-blue-100 hover:shadow-2xl transition-all duration-300"
          >
            {profile?.cover_image_url && (
              <div className="h-32 overflow-hidden">
                <img 
                  src={`http://localhost:5000${profile.cover_image_url}`}
                  alt="Company Cover"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-6">
              
              <div className="flex items-center gap-4 mb-6 -mt-8 ">
                <div className="relative group">
                  {profile?.logo_url ? (
                    <img 
                      src={`http://localhost:5000${profile.logo_url}`}
                      alt={profile.company_name}
                      className="w-20 h-20 rounded-xl object-cover ring-4 ring-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center ring-4 ring-white shadow-lg">
                      <Building2 className="text-blue-600" size={32} />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0 pt-4">  
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {profile?.company_name || 'Company Name'}
                  </h2>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin size={14} />
                    {profile?.wilaya || 'Location not set'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <Users className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <p className="text-xs text-gray-500">Contact Person</p>
                    <p className="font-semibold text-gray-900">{profile?.contact_person || 'Not set'}</p>
                    <p className="text-sm text-gray-600">{profile?.position || ''}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <Briefcase className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <p className="text-xs text-gray-500">Activity Sector</p>
                    <p className="font-semibold text-gray-900">{profile?.activity_sector || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-sm truncate">{user?.email || 'Not set'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium text-sm">{profile?.phone || 'Not set'}</p>
                  </div>
                  {profile?.founded_year && (
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500">Founded</p>
                      <p className="font-medium text-sm">{profile.founded_year}</p>
                    </div>
                  )}
                  {profile?.company_size && (
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500">Company Size</p>
                      <p className="font-medium text-sm">{profile.company_size}</p>
                    </div>
                  )}
                </div>
                
                {profile?.description && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">About</p>
                    <p className="text-sm text-gray-700 line-clamp-3">{profile.description}</p>
                  </div>
                )}
                
                <div className="flex items-center gap-2 pt-2">
                  {profile?.social_media?.linkedin && (
                    <a href={profile.social_media.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 hover:scale-110 transition-all duration-300">
                      <Linkedin size={18} />
                    </a>
                  )}
                  {profile?.social_media?.facebook && (
                    <a href={profile.social_media.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 hover:scale-110 transition-all duration-300">
                      <Facebook size={18} />
                    </a>
                  )}
                  {profile?.social_media?.twitter && (
                    <a href={profile.social_media.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 hover:scale-110 transition-all duration-300">
                      <Twitter size={18} />
                    </a>
                  )}
                  {profile?.social_media?.instagram && (
                    <a href={profile.social_media.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 hover:scale-110 transition-all duration-300">
                      <Instagram size={18} />
                    </a>
                  )}
                  {profile?.social_media?.github && (
                    <a href={profile.social_media.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 hover:scale-110 transition-all duration-300">
                      <Github size={18} />
                    </a>
                  )}
                </div>
                
                <button
                  onClick={() => navigate('/company/profile/edit')}
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Building2 size={18} />
                  Edit Company Profile
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Recent Activity & Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ type: "spring" }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-blue-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Activity size={16} className="text-blue-600" />
                  Recent Activity
                </h3>
                {activitiesLoading && (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                )}
              </div>
              
              <div className="space-y-3">
                {activitiesLoading ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center p-3 bg-gray-100 rounded-xl animate-pulse">
                      <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))
                ) : recentActivities.length > 0 ? (
                  recentActivities.map((activity, idx) => (
                    <motion.div 
                      key={activity.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all duration-300 border-l-2 border-transparent hover:border-blue-400 cursor-pointer`}
                      onClick={() => navigate(activity.link)}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-${activity.color}-100 flex items-center justify-center text-lg shadow-sm`}>
                        <span>{activity.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-800">{activity.title}</p>
                        {activity.description && (
                          <p className="text-xs text-gray-500">{activity.description}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                      <ArrowRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No recent activity</p>
                    <p className="text-sm mt-2">Activities will appear here when students apply</p>
                  </div>
                )}
                
                <button
                  onClick={() => navigate('/company/activity')}
                  className="w-full text-center text-blue-600 hover:text-blue-800 font-medium py-2 hover:gap-2 transition-all duration-300 flex items-center justify-center gap-1"
                >
                  View all activity <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>

            {/* Analytics Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1, type: "spring" }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-blue-100"
            >
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 size={16} className="text-blue-600" />
                Analytics Overview
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-blue-700">{analytics.totalApplications || 0}</p>
                  <p className="text-xs text-gray-600">Total Applications</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-700">{analytics.totalViews || 0}</p>
                  <p className="text-xs text-gray-600">Total Views</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-purple-700">{analytics.acceptanceRate || 0}%</p>
                  <p className="text-xs text-gray-600">Acceptance Rate</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-amber-700">{analytics.averageRating || 0}</p>
                  <p className="text-xs text-gray-600">Average Rating</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mt-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Zap size={16} className="text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
            </div>
            <span className="text-gray-500 text-sm">⚡ Fast access to common tasks</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate('/company/create-internship')} 
              className="group bg-white p-5 rounded-2xl shadow-lg text-center hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
                <Plus size={20} className="text-white" />
              </div>
              <h3 className="font-bold mb-1 text-gray-800">Post Internship</h3>
              <p className="text-gray-500 text-xs">Create new opportunity</p>
            </button>
            
            <button 
              onClick={() => navigate('/company/applications')} 
              className="group bg-white p-5 rounded-2xl shadow-lg text-center hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
                <Users size={20} className="text-white" />
              </div>
              <h3 className="font-bold mb-1 text-gray-800">View Candidates</h3>
              <p className="text-gray-500 text-xs">Review applications</p>
            </button>
            
            <button 
              onClick={() => navigate('/company/internships')} 
              className="group bg-white p-5 rounded-2xl shadow-lg text-center hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
                <Briefcase size={20} className="text-white" />
              </div>
              <h3 className="font-bold mb-1 text-gray-800">My Internships</h3>
              <p className="text-gray-500 text-xs">Manage postings</p>
            </button>
            
            <button 
              onClick={() => navigate('/company/settings')} 
              className="group bg-white p-5 rounded-2xl shadow-lg text-center hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
                <Settings size={20} className="text-white" />
              </div>
              <h3 className="font-bold mb-1 text-gray-800">Settings</h3>
              <p className="text-gray-500 text-xs">Company settings</p>
            </button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.3 }}
          className="mt-12 pt-8 border-t-2 border-gradient-to-r from-transparent via-blue-300 to-transparent"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
            <p className="flex items-center gap-1">
              <span className="text-blue-600">©</span> {new Date().getFullYear()} {profile?.company_name || 'Company Dashboard'}. All rights reserved.
            </p>
            <div className="flex gap-5">
              {['Help Center', 'Privacy Policy', 'Terms of Service', 'Contact Support'].map((item) => (
                <a 
                  key={item} 
                  href="#" 
                  className="hover:text-blue-600 transition-all duration-300 hover:scale-105 inline-block"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </motion.footer>
      </div>

      {/* Custom CSS Animations */}
<style>{`
  @keyframes float {
    0%, 100% { transform: translateY(0px) translateX(0px); }
    50% { transform: translateY(-10px) translateX(5px); }
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
`}</style>
    </div>
  );
};

export default CompanyDashboard;