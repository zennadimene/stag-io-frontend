// src/pages/student/Settings.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { KeyRound } from 'lucide-react';

// ✅ استيراد الأيقونات - تم تغيير اسم Settings إلى SettingsIcon
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Globe,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  LogOut,
  Trash2,
  Moon,
  Sun,
  Mail,
  Lock,
  MapPin,
  Clock,
  DollarSign,
  Briefcase
} from 'lucide-react';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  
  // ============================================
  // 🔐 Account Settings
  // ============================================
  const [account, setAccount] = useState({
    emailNotifications: true,
    applicationUpdates: true,
    deadlineReminders: true,
    newMatches: true,
    newsletter: false
  });
  
  // ============================================
  // 🔑 Password Change
  // ============================================
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // ============================================
  // 🛡️ Privacy Settings
  // ============================================
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showContactInfo: true,
    allowMessages: true,
    showSavedInternships: false,
    showApplications: true,
    dataSharing: true
  });
  
  // ============================================
  // ⚙️ Preferences
  // ============================================
  const [preferences, setPreferences] = useState({
    preferredLocations: [],
    internshipTypes: ['remote', 'part-time', 'full-time'],
    minStipend: 0,
    notificationFrequency: 'instant',
    language: 'en',
    theme: 'light'
  });

  // ============================================
  // 👁️ Show/Hide Password
  // ============================================
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // ============================================
  // 📍 Static Data
  // ============================================
  const [locations] = useState([
    'Algiers', 'Oran', 'Constantine', 'Annaba', 'Blida',
    'Batna', 'Sétif', 'Tlemcen', 'Mostaganem', 'Djelfa',
    'Remote', 'Any'
  ]);

  const [themes] = useState([
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System Default', icon: SettingsIcon }  // ✅ استخدام SettingsIcon هنا
  ]);

  const [languages] = useState([
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'French' },
    { value: 'ar', label: 'Arabic' }
  ]);

 // ============================================
// 🚀 Initial Load - للبيانات فقط
// ============================================
useEffect(() => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token || user.user_type !== 'student') {
    navigate('/login');
    return;
  }
  
  fetchSettings();
  
  const savedTheme = localStorage.getItem('theme') || 'light';
  setPreferences(prev => ({ ...prev, theme: savedTheme }));
  applyTheme(savedTheme);
  
}, [navigate]); // ✅ هذا يعتمد على navigate فقط

// ============================================
// 🎨 إضافة الأنيميشينات - مرة واحدة فقط
// ============================================
useEffect(() => {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    @keyframes enter {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(10px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    @keyframes leave {
      from {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
      to {
        opacity: 0;
        transform: scale(0.9) translateY(10px);
      }
    }

    .animate-enter {
      animation: enter 0.2s ease-out;
    }

    .animate-leave {
      animation: leave 0.15s ease-in forwards;
    }
  `;
  document.head.appendChild(styleSheet);
  
  return () => {
    styleSheet.remove();
  };
}, []); // ✅ مصفوفة فارغة = ينفذ مرة واحدة فقط عند تحميل المكون





// ============================================
// 📥 Fetch Settings from Server - المعدل
// ============================================
const fetchSettings = async () => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    //const response = await axios.get('http://localhost:5000/api/student/settings', {
    const response = await axios.get(`${BASE}/api/student/settings`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      const settings = response.data.settings;
      
      // ✅ أضف هذا السطر لرؤية البيانات التي يجلبها الخادم
      console.log('📥 Fetched settings from server:', settings);
      
      if (settings.account) setAccount(prev => ({ ...prev, ...settings.account }));
      if (settings.privacy) setPrivacy(prev => ({ ...prev, ...settings.privacy }));
      if (settings.preferences) setPreferences(prev => ({ ...prev, ...settings.preferences }));
    }
  } catch (error) {
    console.error('Error fetching preferences:', error);
    toast.error('Using default preferences');
  } finally {
    setLoading(false);
  }
};


// ============================================
// 💾 Save Settings - النسخة النهائية
// ============================================
const handleSaveSettings = async () => {
  setSaving(true);
  
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    const settingsData = {
      account: {
        emailNotifications: account.emailNotifications,
        applicationUpdates: account.applicationUpdates,
        deadlineReminders: account.deadlineReminders,
        newMatches: account.newMatches,
        newsletter: account.newsletter
      },
      privacy: {
        profileVisibility: privacy.profileVisibility,
        showContactInfo: privacy.showContactInfo,
        allowMessages: privacy.allowMessages,
        showSavedInternships: privacy.showSavedInternships,
        showApplications: privacy.showApplications,
        dataSharing: privacy.dataSharing
      },
      preferences: {
        preferredLocations: preferences.preferredLocations || [],
        internshipTypes: preferences.internshipTypes || [],
        minStipend: preferences.minStipend || 0,
        notificationFrequency: preferences.notificationFrequency || 'instant',
        language: preferences.language || 'en',
        theme: preferences.theme || 'light'
      }
    };
    
    // ✅ أضف هذا السطر لرؤية ما يتم إرساله
    console.log('📤 Sending to server:', JSON.stringify(settingsData, null, 2));
    
    const response = await axios.put(
      //'http://localhost:5000/api/student/settings',
      `${BASE}/api/student/settings`,
      settingsData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log('📥 Server response:', response.data);
    
    if (response.data.success) {
      toast.success('✅ Settings saved successfully!');
      localStorage.setItem('theme', preferences.theme);
      applyTheme(preferences.theme);
    }
  } catch (error) {
    console.error('❌ Error saving settings:', error);
    console.error('Response:', error.response?.data);
    toast.error(error.response?.data?.message || '❌ Error saving settings');
  } finally {
    setSaving(false);
  }
};


  // ============================================
  // 🎨 Apply Theme
  // ============================================
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // ============================================
  // 🔐 Change Password
  // ============================================
  const handleChangePassword = async () => {
    if (!passwordData.currentPassword) {
      toast.error('❌ Please enter current password');
      return;
    }
    
    if (!passwordData.newPassword) {
      toast.error('❌ Please enter new password');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error('❌ Password must be at least 8 characters');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('❌ New passwords do not match');
      return;
    }
    
    setPasswordLoading(true);
    
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await axios.put(
        //'http://localhost:5000/api/student/change-password',
        `${BASE}/api/student/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        toast.success('✅ Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      
      if (error.response?.status === 401) {
        toast.error('❌ Current password is incorrect');
      } else {
        toast.error(error.response?.data?.message || '❌ Error changing password');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  // ============================================
// 🎨 مودال إدخال كلمة المرور (جديد)
// ============================================
// ============================================
// 🎨 مودال إدخال كلمة المرور
// ============================================
const showPasswordModal = () => {
  return new Promise((resolve) => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white rounded-2xl shadow-2xl p-6 pointer-events-auto`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <KeyRound className="text-red-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Confirm Password</h3>
        </div>
        
        <p className="text-gray-600 mb-4">
          Please enter your password to confirm account deletion:
        </p>
        
        <input
          type="password"
          id="delete-password"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-4"
          placeholder="Enter your password"
          autoFocus
        />
        
        <div className="flex gap-3">
          <button
            onClick={() => {
              const password = document.getElementById('delete-password').value;
              if (password) {
                toast.dismiss(t.id);
                resolve(password);
              } else {
                toast.error('❌ Password is required');
              }
            }}
            className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
          >
            Delete Account
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              resolve(null);
            }}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
    });
  });
};


  // ============================================
  // 🗑️ Delete Account
  // ============================================
 // ============================================
// 🗑️ Delete Account - مع مودال أنيق
// ============================================
const handleDeleteAccount = async () => {
  const confirmFirst = window.confirm(
    '⚠️ WARNING: This action is permanent!\n\n' +
    'Are you absolutely sure you want to delete your account?\n' +
    'All your data will be permanently lost.'
  );
  
  if (!confirmFirst) return;
  
  // ✅ استخدم المودال بدلاً من window.prompt
  const password = await showPasswordModal();
  
  if (!password) {
    toast.error('❌ Password is required to delete account');
    return;
  }
  
  setDeleteLoading(true);
  
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    const response = await axios.delete(
      //'http://localhost:5000/api/student/account',
      `${BASE}/api/student/account`,
      {
        data: { password },
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    if (response.data.success) {
      toast.success('✅ Account deleted successfully');
      localStorage.clear();
      sessionStorage.clear();
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  } catch (error) {
    console.error('Error deleting account:', error);
    
    if (error.response?.status === 401) {
      toast.error('❌ Incorrect password');
    } else {
      toast.error(error.response?.data?.message || '❌ Error deleting account');
    }
  } finally {
    setDeleteLoading(false);
  }
};



  // ============================================
  // 🚪 Logout
  // ============================================
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  // ============================================
  // 🔄 Toggle Functions
  // ============================================
  const handleToggleLocation = (location) => {
    setPreferences(prev => ({
      ...prev,
      preferredLocations: prev.preferredLocations.includes(location)
        ? prev.preferredLocations.filter(l => l !== location)
        : [...prev.preferredLocations, location]
    }));
  };

  const handleToggleInternshipType = (type) => {
    setPreferences(prev => ({
      ...prev,
      internshipTypes: prev.internshipTypes.includes(type)
        ? prev.internshipTypes.filter(t => t !== type)
        : [...prev.internshipTypes, type]
    }));
  };

  // ============================================
  // 📋 Tabs
  // ============================================
  const tabs = [
    { id: 'account', label: 'Account', icon: SettingsIcon },  // ✅ استخدام SettingsIcon هنا
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Globe }
  ];

  // ============================================
  // ⏳ Loading State
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-lg text-gray-600">Loading settings...</div>
        </div>
      </div>
    );
  }

  // ============================================
  // 🎨 Main Render
  // ============================================
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-2">Manage your account preferences and settings</p>
              </div>
              <button
                onClick={() => navigate('/student/dashboard')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <tab.icon size={20} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition mt-4"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </nav>
                
                <div className="mt-8 pt-6 border-t">
                  <button
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        Save All Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:w-3/4">
              <div className="space-y-8">
                {/* ========== ACCOUNT TAB ========== */}
                {activeTab === 'account' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-xl shadow-lg p-8"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <SettingsIcon />  {/* ✅ استخدام SettingsIcon هنا */}
                      Account Settings
                    </h2>
                    
                    {/* Change Password Section */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Lock size={20} className="text-purple-600" />
                        Change Password
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Current Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword.current ? 'text' : 'password'}
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter current password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                              {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                        </div>
                        
                        {/* New Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword.new ? 'text' : 'password'}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                              {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            Password must be at least 8 characters
                          </p>
                        </div>
                        
                        {/* Confirm Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword.confirm ? 'text' : 'password'}
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Confirm new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                              {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                        </div>
                        
                        <button
                          onClick={handleChangePassword}
                          disabled={passwordLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
                        >
                          {passwordLoading ? 'Changing Password...' : 'Change Password'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ========== NOTIFICATIONS TAB ========== */}
                {activeTab === 'notifications' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-xl shadow-lg p-8"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <Bell />
                      Notification Settings
                    </h2>
                    
                    <div className="space-y-6">
                      {/* Email Notifications */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Mail size={20} className="text-blue-600 mt-1" />
                          <div>
                            <p className="font-medium text-gray-900">Email Notifications</p>
                            <p className="text-sm text-gray-500">Receive notifications via email</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={account.emailNotifications}
                            onChange={(e) => setAccount({ ...account, emailNotifications: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      {/* Application Updates */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Bell size={20} className="text-blue-600 mt-1" />
                          <div>
                            <p className="font-medium text-gray-900">Application Updates</p>
                            <p className="text-sm text-gray-500">Get notified when your application status changes</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={account.applicationUpdates}
                            onChange={(e) => setAccount({ ...account, applicationUpdates: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      {/* Deadline Reminders */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Clock size={20} className="text-blue-600 mt-1" />
                          <div>
                            <p className="font-medium text-gray-900">Deadline Reminders</p>
                            <p className="text-sm text-gray-500">Remind me about upcoming application deadlines</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={account.deadlineReminders}
                            onChange={(e) => setAccount({ ...account, deadlineReminders: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      {/* New Matching Internships */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Briefcase size={20} className="text-blue-600 mt-1" />
                          <div>
                            <p className="font-medium text-gray-900">New Matching Internships</p>
                            <p className="text-sm text-gray-500">Notify me about new internships that match my profile</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={account.newMatches}
                            onChange={(e) => setAccount({ ...account, newMatches: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      {/* Newsletter */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Mail size={20} className="text-blue-600 mt-1" />
                          <div>
                            <p className="font-medium text-gray-900">Newsletter</p>
                            <p className="text-sm text-gray-500">Receive our weekly newsletter with tips and opportunities</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={account.newsletter}
                            onChange={(e) => setAccount({ ...account, newsletter: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ========== PRIVACY TAB ========== */}
                {activeTab === 'privacy' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-xl shadow-lg p-8"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <Shield />
                      Privacy Settings
                    </h2>
                    
                    <div className="space-y-6">
                      {/* Profile Visibility */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Profile Visibility</h3>
                        <div className="space-y-3">
                          {[
                            { value: 'public', label: 'Public', description: 'Your profile is visible to all companies' },
                            { value: 'recruiters_only', label: 'Recruiters Only', description: 'Only registered companies can view your profile' },
                            { value: 'private', label: 'Private', description: 'Your profile is hidden from all companies' }
                          ].map((option) => (
                            <label key={option.value} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                              <input
                                type="radio"
                                name="profileVisibility"
                                value={option.value}
                                checked={privacy.profileVisibility === option.value}
                                onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                                className="text-blue-600 focus:ring-blue-500"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{option.label}</p>
                                <p className="text-sm text-gray-500">{option.description}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Other Privacy Options */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Show Contact Information</p>
                            <p className="text-sm text-gray-500">Display your email and phone number on your profile</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacy.showContactInfo}
                              onChange={(e) => setPrivacy({ ...privacy, showContactInfo: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Allow Messages</p>
                            <p className="text-sm text-gray-500">Allow companies to send you messages</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacy.allowMessages}
                              onChange={(e) => setPrivacy({ ...privacy, allowMessages: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Show Saved Internships</p>
                            <p className="text-sm text-gray-500">Show internships you have saved</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacy.showSavedInternships}
                              onChange={(e) => setPrivacy({ ...privacy, showSavedInternships: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Show Applications</p>
                            <p className="text-sm text-gray-500">Show internships you have applied to</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacy.showApplications}
                              onChange={(e) => setPrivacy({ ...privacy, showApplications: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Data Sharing</p>
                            <p className="text-sm text-gray-500">Share anonymized data to improve our services</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacy.dataSharing}
                              onChange={(e) => setPrivacy({ ...privacy, dataSharing: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ========== PREFERENCES TAB ========== */}
                {activeTab === 'preferences' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-xl shadow-lg p-8"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <Globe />
                      Preferences
                    </h2>
                    
                    <div className="space-y-8">
                      {/* Preferred Locations */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Preferred Locations</h3>
                        <p className="text-gray-600 mb-4">Select locations where you're interested in internships</p>
                        <div className="flex flex-wrap gap-2">
                          {locations.map((location) => (
                            <button
                              key={location}
                              onClick={() => handleToggleLocation(location)}
                              className={`px-4 py-2 rounded-lg transition ${
                                preferences.preferredLocations.includes(location)
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {location}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Internship Types */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Internship Types</h3>
                        <p className="text-gray-600 mb-4">Select types of internships you're interested in</p>
                        <div className="flex flex-wrap gap-2">
                          {['remote', 'part-time', 'full-time', 'hybrid', 'project'].map((type) => (
                            <button
                              key={type}
                              onClick={() => handleToggleInternshipType(type)}
                              className={`px-4 py-2 rounded-lg capitalize transition ${
                                preferences.internshipTypes.includes(type)
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {type.replace('-', ' ')}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Minimum Stipend */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Minimum Stipend Preference</h3>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="0"
                            max="100000"
                            step="1000"
                            value={preferences.minStipend}
                            onChange={(e) => setPreferences({ ...preferences, minStipend: parseInt(e.target.value) })}
                            className="flex-1"
                          />
                          <span className="text-lg font-semibold text-gray-900">
                            {preferences.minStipend.toLocaleString()} DZD/month
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                          <span>0 DZD</span>
                          <span>100,000 DZD</span>
                        </div>
                      </div>

                      {/* Language & Theme */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Language
                          </label>
                          <select
                            value={preferences.language}
                            onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            {languages.map((lang) => (
                              <option key={lang.value} value={lang.value}>
                                {lang.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Theme
                          </label>
                          <div className="flex gap-2">
                            {themes.map((theme) => (
                              <button
                                key={theme.value}
                                onClick={() => setPreferences({ ...preferences, theme: theme.value })}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition ${
                                  preferences.theme === theme.value
                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <theme.icon size={18} />
                                {theme.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Notification Frequency */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notification Frequency
                        </label>
                        <select
                          value={preferences.notificationFrequency}
                          onChange={(e) => setPreferences({ ...preferences, notificationFrequency: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="instant">Instant</option>
                          <option value="daily">Daily Digest</option>
                          <option value="weekly">Weekly Summary</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* ========== DANGER ZONE ========== */}
          <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center gap-2">
              <AlertCircle className="text-red-600" />
              Danger Zone
            </h3>
            <p className="text-red-700 mb-4">
              These actions are irreversible. Please proceed with caution.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
              >
                {deleteLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete Account
                  </>
                )}
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 font-medium"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;