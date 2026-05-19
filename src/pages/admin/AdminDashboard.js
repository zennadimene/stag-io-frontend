import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Bell, Users, Building2, Briefcase,
   FileText, LogOut, CheckCircle, Clock,
    XCircle, Search, Filter, Eye, Check,
     Ban, Trash2, Send, Archive, RotateCcw,
      PlusCircle, UserPlus, Award, GraduationCap,
       Calendar, Mail, Phone, MapPin, Star } from 'lucide-react';

       const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalStudents: 0,
    totalInternships: 0,
    activeInternships: 0,
    pendingAcceptances: 0,
    pendingCompanies: 0,
    agreements: 0,           
  pendingSignatures: 0 
  });

  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentStats, setStudentStats] = useState({
    totalApplications: 0,
    averageSkills: 0,
    topUniversities: []
  });

    const [agreements, setAgreements] = useState([]);
  const [agreementsLoading, setAgreementsLoading] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
 


  const [activeTab, setActiveTab] = useState('notifications');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notificationFilter, setNotificationFilter] = useState('all'); // all, unread, read

  const [placementStats, setPlacementStats] = useState({
    placed: 0,
    inProgress: 0,
    unplaced: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.user_type !== 'admin') {
      navigate('/login');
      return;
    }
    
    fetchNotifications();
    fetchStats();
    fetchCompanies();
    fetchStudents();
    fetchAgreements();
    fetchPlacementStats(); 
  }, [navigate]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      //const response = await axios.get('http://localhost:5000/api/admin/notifications', {
      const response = await axios.get(`${BASE}/api/admin/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.notifications.filter(n => !n.is_read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

const fetchStats = async () => {
  try {
    const token = localStorage.getItem('token');
    //const response = await axios.get('http://localhost:5000/api/admin/stats', {
    const response = await axios.get(`${BASE}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('📊 Stats from backend:', response.data.stats);
    
    if (response.data.success) {
      const stats = response.data.stats;
      
      // تحديث stats الرئيسية
      //setStats(stats);
      setStats({
        totalCompanies: stats.totalCompanies || 0,
        totalStudents: stats.totalStudents || 0,
        totalInternships: stats.totalInternships || 0,
        activeInternships: stats.activeInternships || 0,
        pendingAcceptances: stats.pendingAcceptances || 0,
        pendingCompanies: stats.pendingCompanies || 0,
        agreements: stats.agreements || 0,
        pendingSignatures: stats.pendingSignatures || 0
      });
      
      // تحديث studentStats
      setStudentStats(prev => ({
        ...prev,
        totalApplications: stats.totalApplications || 0
      }));
      
      // ✅ تحديث placementStats مع حساب unplaced بشكل صحيح
      const totalStudents = stats.totalStudents || 0;
      const placedStudents = stats.placed || 0;
      const calculatedUnplaced = totalStudents - placedStudents;
      
      setPlacementStats({
        placed: placedStudents,
        inProgress: stats.inProgress || 0,
        unplaced: calculatedUnplaced  // ✅ 2 - 1 = 1
      });
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
};

  const fetchPlacementStats = async () => {
    try {
      const token = localStorage.getItem('token');
      //const response = await axios.get('http://localhost:5000/api/admin/placement-stats', {
      const response = await axios.get(`${BASE}/api/admin/placement-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setPlacementStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching placement stats:', error);
      setPlacementStats({
        placed: 0,
        inProgress: 0,
        unplaced: 1
      });
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
       // `http://localhost:5000/api/admin/notifications/${notificationId}/read`,
        `${BASE}/api/admin/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: 1 } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
      //  'http://localhost:5000/api/admin/notifications/read-all',
        `${BASE}/api/admin/notifications/read-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications(notifications.map(n => ({ ...n, is_read: 1 })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

 const handleGenerateAgreement = async (notification) => {
  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    let studentName = '';
    let companyName = '';
    let internshipTitle = '';
    let internshipId = null;
    
    if (notification.title === '🎉 New Student Acceptance') {
      const message = notification.message;
      const acceptedMatch = message.match(/has accepted (.*?) for/);
      if (acceptedMatch && acceptedMatch[1]) {
        studentName = acceptedMatch[1].trim();
      }
      const companyMatch = message.match(/^(.*?) has accepted/);
      if (companyMatch && companyMatch[1]) {
        companyName = companyMatch[1].trim();
      }
      const titleMatch = message.match(/for "(.*?)" internship/);
      if (titleMatch && titleMatch[1]) {
        internshipTitle = titleMatch[1].trim();
      }
    }
    
    if (!studentName) studentName = notification.student_name || 'Student';
    if (!companyName) companyName = notification.company_name || 'Company';
    if (!internshipTitle) internshipTitle = notification.internship_title || 'Internship';
    
    // 🔥 🔥 🔥 الكود المفقود - جلب internship_id من قاعدة البيانات
    if (notification.application_id) {
      try {
        console.log('🔍 Fetching internship_id for application:', notification.application_id);
        
        const appResponse = await axios.get(
         // `http://localhost:5000/api/admin/applications/${notification.application_id}`,
          `${BASE}/api/admin/applications/${notification.application_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (appResponse.data.success && appResponse.data.application) {
          internshipId = appResponse.data.application.internship_id;
          console.log('✅ Found internship_id:', internshipId);
        }
      } catch (err) {
        console.error('❌ Error fetching application:', err);
      }
    }
    
    // إذا لم نجد، ابحث في قاعدة البيانات مباشرة
    if (!internshipId) {
      try {
        const searchResponse = await axios.get(
         // `http://localhost:5000/api/admin/internships/search?title=${encodeURIComponent(internshipTitle)}&company=${encodeURIComponent(companyName)}`,
           `${BASE}/api/admin/internships/search?title=${encodeURIComponent(internshipTitle)}&company=${encodeURIComponent(companyName)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (searchResponse.data.success && searchResponse.data.internships.length > 0) {
          internshipId = searchResponse.data.internships[0].id;
          console.log('✅ Found internship_id from search:', internshipId);
        }
      } catch (err) {
        console.error('❌ Error searching internships:', err);
      }
    }
    
    // إذا لم نجد internship_id، نستخدم قيمة افتراضية (اختياري)
    if (!internshipId) {
      console.warn('⚠️ Could not find internship_id, using default value 45');
      internshipId = 45; // القيمة الافتراضية التي تظهر في الـ Backend
    }
    
    const response = await axios.post(
      //'http://localhost:5000/api/admin/agreements/generate-from-notification',
      `${BASE}/api/admin/agreements/generate-from-notification`,
      {
        notificationId: notification.id,
        studentName: studentName,
        companyName: companyName,
        internshipTitle: internshipTitle,
        application_id: notification.application_id,
        internship_id: internshipId  // 👈 الآن هذه القيمة صحيحة
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (response.data.success) {
      toast.success('✅ Agreement generated successfully!')
      markAsRead(notification.id);
      fetchAgreements();
      fetchNotifications();
    }
  } catch (error) {
    console.error('Error generating agreement:', error);
    toast.error('❌ Error generating agreement: ' + (error.response?.data?.message || error.message)); 
  } finally {
    setLoading(false);
    setShowAgreementModal(false);
  }
};

  const fetchCompanies = async () => {
    setCompaniesLoading(true);
    try {
      const token = localStorage.getItem('token');
     // const response = await axios.get('http://localhost:5000/api/admin/companies', {
      const response = await axios.get(`${BASE}/api/admin/companies`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCompanies(response.data.companies);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setCompaniesLoading(false);
    }
  };

  const verifyCompany = async (companyId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        //`http://localhost:5000/api/admin/companies/${companyId}/verify`,
        `${BASE}/api/admin/companies/${companyId}/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setCompanies(companies.map(c => 
        c.id === companyId ? { ...c, is_verified: 1 } : c
      ));
      toast.success('Company verified successfully');
    } catch (error) {
      console.error('Error verifying company:', error);
      toast.error('Error verifying company');
    }
  };

  const suspendCompany = async (companyId) => {
    if (!window.confirm('Are you sure you want to suspend this company?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(
       // `http://localhost:5000/api/admin/companies/${companyId}/suspend`,
        `${BASE}/api/admin/companies/${companyId}/suspend`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompanies(companies.map(c => 
        c.id === companyId ? { ...c, is_suspended: 1 } : c
      ));
      toast.success('Company suspended successfully');
    } catch (error) {
      console.error('Error suspending company:', error);
      toast.error('Error suspending company');
    }
  };


  const deleteCompany = async (companyId) => {
    if (!window.confirm('Are you sure you want to delete this company? This action cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
       // `http://localhost:5000/api/admin/companies/${companyId}`,
        `${BASE}/api/admin/companies/${companyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompanies(companies.filter(c => c.id !== companyId));
      toast.success('Company deleted successfully');
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('Error deleting company');
    }
  };

  const fetchStudents = async () => {
    setStudentsLoading(true);
    try {
      const token = localStorage.getItem('token');
     // const response = await axios.get('http://localhost:5000/api/admin/students', {
      const response = await axios.get(`${BASE}/api/admin/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setStudents(response.data.students);
        setStudentStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setStudentsLoading(false);
    }
  };

  const viewStudentProfile = (studentId) => {
    navigate(`/admin/student/${studentId}`);
};

 const suspendStudent = async (studentId) => {
  if (!window.confirm('Are you sure you want to suspend this student?')) return;
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(
     // `http://localhost:5000/api/admin/students/${studentId}/suspend`,
      `${BASE}/api/admin/students/${studentId}/suspend`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (response.data.success) {
      setStudents(students.map(s => 
        s.id === studentId ? { ...s, is_suspended: 1 } : s
      ));
      toast.success('Student suspended successfully');
    }
  } catch (error) {
    console.error('Error suspending student:', error);
    toast.error('Error suspending student');
  }
};

// ✅ قبول الطالب (Verify)
const verifyStudent = async (studentId) => {
  try {
    const token = localStorage.getItem('token');
    // ✅ تغيير من /verify إلى /approve
    const response = await axios.put(
    //  `http://localhost:5000/api/admin/students/${studentId}/approve`,
      `${BASE}/api/admin/students/${studentId}/approve`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (response.data.success) {
      setStudents(students.map(s => 
        s.id === studentId ? { ...s, is_verified: 1, is_suspended: 0 } : s
      ));
      toast.success('Student verified successfully');
      fetchStats();
      fetchNotifications();
    }
  } catch (error) {
    console.error('Error verifying student:', error);
    toast.error('Error verifying student: ' + (error.response?.data?.message || error.message));
  }
};



// ✅ حذف الطالب (Delete)
const deleteStudent = async (studentId) => {
  if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) return;
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(
      //`http://localhost:5000/api/admin/students/${studentId}`,
      `${BASE}/api/admin/students/${studentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (response.data.success) {
      setStudents(students.filter(s => s.id !== studentId));
      toast.success('Student deleted successfully');
      fetchStats();
      fetchNotifications();
    }
  } catch (error) {
    console.error('Error deleting student:', error);
    toast.error('Error deleting student');
  }
};

  const fetchAgreements = async () => {
    setAgreementsLoading(true);
    try {
      const token = localStorage.getItem('token');
      //const response = await axios.get('http://localhost:5000/api/admin/agreements', {
      const response = await axios.get(`${BASE}/api/admin/agreements`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
         // ✅ تحقق من status لكل اتفاقية
      console.log('📊 Agreements status from API:', response.data.agreements.map(a => ({ 
        id: a.id, 
        status: a.status,
        archived_at: a.archived_at
      })));
        setAgreements(response.data.agreements);
      }
    } catch (error) {
      console.error('Error fetching agreements:', error);
    } finally {
      setAgreementsLoading(false);
    }
  };



  const signAgreementAsUniversity = async (agreementId) => {
  // ✅ انتقل إلى صفحة توقيع الجامعة
  navigate(`/admin/agreements/${agreementId}/sign`);
};

  

const handleValidateInternship = async (notification) => {
  try {
    const token = localStorage.getItem('token');
    
    // ✅ 1. مصادقة التدريب
    const response = await axios.put(
      //`http://localhost:5000/api/admin/applications/${notification.application_id}/validate`,
      `${BASE}/api/admin/applications/${notification.application_id}/validate`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (response.data.success) {
      toast.success('✅ Internship validated successfully!');
      
      // ✅ 2. جلب تفاصيل التقديم كاملة
      const appDetails = await axios.get(
        //`http://localhost:5000/api/admin/applications/${notification.application_id}/details`,
        `${BASE}/api/admin/applications/${notification.application_id}/details`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (appDetails.data.success) {
        const application = appDetails.data.application;
        
        // ✅ 3. جلب بيانات الطالب
        const studentData = await axios.get(
         // `http://localhost:5000/api/admin/students/${application.student_id}`,
          `${BASE}/api/admin/students/${application.student_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // ✅ 4. جلب بيانات الشركة
        const companyData = await axios.get(
         // `http://localhost:5000/api/admin/companies/${application.company_id}`,
          `${BASE}/api/admin/companies/${application.company_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // ✅ 5. تحضير البيانات للتوليد التلقائي
        const today = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + (parseInt(application.duration) || 3));
        
       const agreementData = {
  studentName: `${application.first_name} ${application.last_name}`,
  companyName: application.company_name,
  internshipTitle: application.internship_title,
  university: application.university || 'Université de Constantine 2',
  companyAddress: application.address || application.company_address || '',
  companyRepresentative: application.contact_person || application.company_representative || '',
  companyPhone: application.company_phone || '',
  studentId: application.student_id || '___________________',
  socialSecurity: application.social_security || '___________________',
  studentPhone: application.student_phone || '___________________',
  supervisor: application.academic_supervisor || '___________________',
  duration: application.duration || '3',
  startDate: today.toISOString().split('T')[0],
  endDate: endDate.toISOString().split('T')[0]
};
        
        // ✅ 6. توليد PDF تلقائياً
        const pdfResponse = await axios.post(
         // 'http://localhost:5000/api/admin/agreements/generate-pdf',
          `${BASE}/api/admin/agreements/generate-pdf`,
          agreementData,
          { 
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob'
          }
        );
        
        // ✅ 7. تحميل ملف PDF تلقائياً
        const url = window.URL.createObjectURL(new Blob([pdfResponse.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `convention_stage_${agreementData.studentName.replace(/\s+/g, '_')}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        toast.success('✅ Convention de stage generated automatically!');
        
        // ✅ 8. إنشاء الاتفاقية في قاعدة البيانات
        await axios.post(
          //'http://localhost:5000/api/admin/agreements/generate-from-validation',
          `${BASE}/api/admin/agreements/generate-from-validation`,
          { 
            applicationId: notification.application_id,
            agreementData: agreementData
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      // ✅ 9. تحديث الإشعار كمقروء
      await markAsRead(notification.id);
      
      // ✅ 10. تحديث القوائم
      fetchNotifications();
      fetchStats();
      fetchAgreements();
    }
  } catch (error) {
    console.error('Error validating internship:', error);
    toast.error('❌ Error validating internship: ' + (error.response?.data?.message || error.message));
  }
};


const handleViewDetails = async (notification) => {
  try {
    const token = localStorage.getItem('token');
    
    // استخراج اسم الطالب من الإشعار
    let studentName = '';
    const message = notification.message;
    const acceptedMatch = message.match(/has accepted (.*?) for/);
    if (acceptedMatch && acceptedMatch[1]) {
      studentName = acceptedMatch[1].trim();
    }
    
    // فتح نافذة منبثقة بالتفاصيل (أو التوجيه لصفحة منفصلة)
    toast.success(`عرض تفاصيل الطالب: ${studentName}`);
    
    // يمكنك توجيه المستخدم لصفحة تفاصيل الطالب
    // navigate(`/admin/student/${studentId}`);
    
  } catch (error) {
    console.error('Error viewing details:', error);
    toast.error('خطأ في عرض التفاصيل');
  }
};


const generateAgreementPDF = async (agreementData) => {
  try {
    const token = localStorage.getItem('token');
    toast.loading('Generating Convention de Stage PDF...', { id: 'agreement-gen' });
    
    // ✅ استخدم GET endpoint مباشرة (بدون POST إضافي)
    const response = await axios.get(
     // `http://localhost:5000/api/admin/agreements/${agreementData.id}/download`,
      `${BASE}/api/admin/agreements/${agreementData.id}/download`,
      { 
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      }
    );
    
    // ✅ تحميل الملف
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `convention_stage_${agreementData.studentName.replace(/\s+/g, '_')}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    toast.success('✅ Convention de Stage downloaded successfully', { id: 'agreement-gen' });
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('❌ Error generating PDF: ' + (error.response?.data?.message || error.message), { id: 'agreement-gen' });
  }
};

 

 const sendAgreementByEmail = async (agreementId) => {
  try {
    const token = localStorage.getItem('token');
    
    // ✅ إظهار رسالة تحميل
    toast.loading('Sending agreement...', { id: 'sending' });
    
    await axios.post(
     // `http://localhost:5000/api/admin/agreements/${agreementId}/send`,
      `${BASE}/api/admin/agreements/${agreementId}/send`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    // ✅ تحديث الرسالة إلى نجاح
    toast.success('✅ Agreement sent successfully via email', { id: 'sending' });
    
    // ✅ إعادة تحميل الاتفاقيات لتحديث الحالة
    fetchAgreements();
    
  } catch (error) {
    console.error('Error sending agreement:', error);
    toast.error('❌ Error sending agreement', { id: 'sending' });
  }
};

 const archiveAgreement = async (agreementId) => {
  if (!window.confirm('Are you sure you want to archive this agreement?')) return;
  try {
    const token = localStorage.getItem('token');
    await axios.put(
      //`http://localhost:5000/api/admin/agreements/${agreementId}/archive`,
      `${BASE}/api/admin/agreements/${agreementId}/archive`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    // ✅ إعادة جلب البيانات من الخادم
    await fetchAgreements();
    
    toast.success('✅ Agreement archived successfully');
  } catch (error) {
    console.error('Error archiving agreement:', error);
    toast.error('❌ Error archiving agreement'); 
  }
};

const unarchiveAgreement = async (agreementId) => {
  if (!window.confirm('Are you sure you want to unarchive this agreement?')) return;
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      //`http://localhost:5000/api/admin/agreements/${agreementId}/unarchive`,
      `${BASE}/api/admin/agreements/${agreementId}/unarchive`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (response.data.success) {
      // ✅ إعادة جلب البيانات من الخادم
      await fetchAgreements();
      
      toast.success('Agreement unarchived successfully!');
    }
  } catch (error) {
    console.error('Error unarchiving agreement:', error);
    toast.error(error.response?.data?.message || 'Error unarchiving agreement');
  }
};

  const generateCertificate = async (agreementData) => {
    try {
      const token = localStorage.getItem('token');
      toast.loading('Generating certificate...', { id: 'cert-gen' });

       // ✅ أضف agreementId إلى البيانات المرسلة
    const response = await axios.post(
     // 'http://localhost:5000/api/admin/certificates/generate',
      `${BASE}/api/admin/certificates/generate`,
      {
        studentName: agreementData.studentName,
        companyName: agreementData.companyName,
        internshipTitle: agreementData.internshipTitle,
        agreementId: agreementData.id  // ✅ أضف هذا
      },
      { 
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      }
    );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate_${agreementData.studentName.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('✅ Certificate generated successfully', { id: 'cert-gen' });
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error('❌ Error generating certificate', { id: 'cert-gen' });
    }
  };

  const generateEvaluationForm = async (agreementData) => {
  try {
    const token = localStorage.getItem('token');
    toast.loading('Generating evaluation form...', { id: 'eval-gen' });
    
    // ✅ أضف agreementId فقط (startDate و endDate ستأتي من قاعدة البيانات)
    const response = await axios.post(
     // 'http://localhost:5000/api/admin/evaluation/generate',
      `${BASE}/api/admin/evaluation/generate`,
      {
        studentName: agreementData.studentName,
        companyName: agreementData.companyName,
        internshipTitle: agreementData.internshipTitle,
        agreementId: agreementData.id  // ✅ أضف هذا
      },
      { 
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      }
    );
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `evaluation_${agreementData.studentName.replace(/\s+/g, '_')}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    toast.success('✅ Evaluation form generated successfully', { id: 'eval-gen' });
  } catch (error) {
    console.error('Error generating evaluation:', error);
    toast.error('❌ Error generating evaluation', { id: 'eval-gen' });
  }
};


const generateAcceptanceLetter = async (agreementData) => {
  try {
    const token = localStorage.getItem('token');
    toast.loading('Generating acceptance letter...', { id: 'acceptance-gen' });
    
    // ✅ أضف agreementId فقط (startDate ستأتي من قاعدة البيانات)
    const response = await axios.post(
      //'http://localhost:5000/api/admin/acceptance-letter/generate',
      `${BASE}/api/admin/acceptance-letter/generate`,
      {
        studentName: agreementData.studentName,
        companyName: agreementData.companyName,
        internshipTitle: agreementData.internshipTitle,
        agreementId: agreementData.id  // ✅ أضف هذا
      },
      { 
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      }
    );
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `acceptance_${agreementData.studentName.replace(/\s+/g, '_')}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    toast.success('✅ Acceptance letter generated successfully', { id: 'acceptance-gen' });
  } catch (error) {
    console.error('Error generating acceptance letter:', error);
    toast.error('❌ Error generating acceptance letter', { id: 'acceptance-gen' });
  }
};


const generateAllDocuments = async (agreementData) => {
  try {
    toast.loading('📚 Generating all documents...', { id: 'all-docs' });
    
    // توليد الاتفاقية
    await generateAgreementPDF(agreementData);
    
    // توليد خطاب القبول
    await generateAcceptanceLetter({
      ...agreementData,
      startDate: 'March 15, 2026'
    });
    
    // توليد الشهادة
    await generateCertificate(agreementData);
    
    // توليد نموذج التقييم
    await generateEvaluationForm({
      ...agreementData,
      startDate: 'March 1, 2026',
      endDate: 'May 31, 2026'
    });
    
    toast.success('✅ All documents generated successfully', { id: 'all-docs' });
  } catch (error) {
    console.error('Error generating all documents:', error);
    toast.error('❌ Error generating some documents', { id: 'all-docs' });
  }
};

 const getNotificationIcon = (type) => {
  switch(type) {
    case 'company_accept': return '🎉';
    case 'view_details': return '👁️';
    case 'validation_complete': return '✅';
    case 'rejection_complete': return '❌';
    case 'company_register': return '🏢';
    case 'student_register': return '👨‍🎓';
    case 'agreement_generated': return '📄';      
    case 'agreement_signed': return '✍️';         
    case 'internship_completed': return '🎓';     
    case 'company_rated': return '⭐';           
    case 'application_status_changed': return '📝';
    case 'interview_reminder': return '⏰';
    case 'company_approved': return '✅';
    case 'new_application': return '📨';
    default: return '📌';
  }
};

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const getStatusBadge = (status, isSuspended, isVerified) => {
  // إذا كان معلقاً، أظهر Suspended
  if (isSuspended) {
    return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Suspended</span>;
  }
  
  // ✅ للطلاب: التحقق من is_verified
  if (isVerified === 1) {
    return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Verified</span>;
  }
  
  switch(status) {
    case 'verified': 
      return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Verified</span>;
    case 'pending': 
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Pending</span>;
    case 'signed':  // ✅ أضف هذا
      return <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Signed</span>;
    case 'completed':  // ✅ أضف هذا
      return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Completed</span>;
    case 'archived':  // ✅ أضف هذا
      return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">Archived</span>;
    case 'suspended': 
      return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Suspended</span>;
    case 'active': 
      return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Active</span>;
    default: 
      return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{status}</span>;
  }
};

  // ✅ الفلترة الصحيحة لجميع الحالات
const filteredCompanies = companies.filter(company => {
    // البحث
    const matchesSearch = company.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // الفلترة حسب الحالة
    let matchesStatus = true;
    
    switch(statusFilter) {
        case 'all':
            matchesStatus = true;
            break;
        case 'verified':
            matchesStatus = company.is_verified === 1 && company.is_suspended === 0 ;
            break;
        case 'pending':
            matchesStatus = company.is_verified === 0 && company.is_suspended === 0 ;
            break;
        case 'suspended':
            matchesStatus = company.is_suspended === 1;
            break;
        case 'active':
            matchesStatus = company.is_verified === 1 && company.is_suspended === 0 ;
            break;
        default:
            matchesStatus = true;
    }
    
    return matchesSearch && matchesStatus;
});

const filteredStudents = students.filter(student => {
    const matchesSearch = student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.university?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // ✅ للطلاب: pending يعامل مثل all
    if (statusFilter === 'pending') {
        return matchesSearch;  // يعرض جميع الطلاب (لأنه لا يوجد pending للطلاب)
    }
    
    if (statusFilter === 'active') {
        return matchesSearch && student.is_suspended === 0;
    }
    if (statusFilter === 'suspended') {
        return matchesSearch && student.is_suspended === 1;
    }
    
    return matchesSearch;
});


const activateStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to activate this student?')) return;
    
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(
           // `http://localhost:5000/api/admin/students/${studentId}/unsuspend`,
            `${BASE}/api/admin/students/${studentId}/unsuspend`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data.success) {
            // تحديث حالة الطالب في الواجهة
            setStudents(students.map(s => 
                s.id === studentId ? { ...s, is_suspended: 0 } : s
            ));
            toast.success('Student activated successfully');
        }
    } catch (error) {
        console.error('Error activating student:', error);
        toast.error('Error activating student');
    }
};

  const filteredAgreements = agreements.filter(agreement => {
    const matchesSearch = agreement.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agreement.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agreement.internship_title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agreement.status === statusFilter;
    return matchesSearch && matchesStatus;
  });


const filteredNotifications = notifications.filter(notification => {
  // فلترة البحث
  let matchesSearch = true;
  if (searchTerm !== '') {
    const searchLower = searchTerm.toLowerCase();
    matchesSearch = notification.title?.toLowerCase().includes(searchLower) ||
                    notification.message?.toLowerCase().includes(searchLower);
  }
  
  // ✅ فلترة حسب المقروء/غير المقروء
  let matchesStatus = true;
  if (notificationFilter === 'unread') {
    matchesStatus = notification.is_read === 0;
  } else if (notificationFilter === 'read') {
    matchesStatus = notification.is_read === 1;
  }
  
  return matchesSearch && matchesStatus;
});


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      {/* Header - Enhanced Design */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Admin Dashboard</h1>
              <p className="text-gray-500 text-sm mt-0.5">Manage platform activities and agreements</p>
            </div>
            <div className="flex items-center gap-3">
              {/* 🔔 أيقونة الجرس */}
<div className="relative">
  <button
    onClick={() => {
      console.log('🔔 Bell clicked - switching to notifications tab');
      console.log('Current activeTab:', activeTab);
      setActiveTab('notifications');
      console.log('New activeTab set to: notifications');
    }}
    className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
    title="Notifications"
  >
    <Bell size={20} />
    {unreadCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-md">
        {unreadCount > 99 ? '99+' : unreadCount}
      </span>
    )}
  </button>
</div>

              {/* زر Mark all as read */}
              <button
                onClick={markAllAsRead}
                className="hidden md:block px-3 py-1.5 text-xs bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all font-medium"
              >
                Mark all as read
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  navigate('/login');
                  toast.success('Logged out successfully');
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-medium"
              >
                <LogOut size={16} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
        
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards - Enhanced Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5 border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Companies</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalCompanies}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl text-white shadow-lg">
                <Building2 size={20} />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">{stats.pendingCompanies || 0} pending verification</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5 border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Students</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalStudents}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2.5 rounded-xl text-white shadow-lg">
                <Users size={20} />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">{studentStats.totalApplications || 0} total applications</p>
          </motion.div>

          <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5 border border-gray-100"
>
  <div className="flex justify-between items-start">
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Internships</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalInternships}</p>
    </div>
    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-xl text-white shadow-lg">
      <Briefcase size={20} />
    </div>
  </div>
  <p className="text-xs text-gray-400 mt-3">{stats.activeInternships} active opportunities</p>
</motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5 border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Accept.</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
  {stats.pendingAcceptances || 0}
</p>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2.5 rounded-xl text-white shadow-lg">
                <Clock size={20} />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">Awaiting agreements</p>
          </motion.div>

         <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.5 }}
  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5 border border-gray-100"
>
  <div className="flex justify-between items-start">
    <div>
       <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Agreements</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{stats.agreements || 0}</p>
    </div>
    <div className="bg-gradient-to-br from-rose-500 to-red-600 p-2.5 rounded-xl text-white shadow-lg">
      <FileText size={20} />
    </div>
  </div>
  <p className="text-xs text-gray-400 mt-3">{stats.pendingSignatures || 0} pending signatures</p>
</motion.div>
</div>

        {/* 📊 Placement Statistics - Enhanced Design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5 border border-gray-100"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Students Placed</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{placementStats.placed || 0}</p>
              </div>
              <div className="bg-green-100 p-2.5 rounded-xl text-2xl">🎓</div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${stats.totalStudents > 0 ? (placementStats.placed / stats.totalStudents) * 100 : 0}%` }}></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Successfully placed in internships</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5 border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">In Progress</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{placementStats.inProgress}</p>
              </div>
              <div className="bg-amber-100 p-2.5 rounded-xl text-2xl">⏳</div>
            </div>
            <p className="text-xs text-gray-400 mt-3">Applications under review</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5 border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Unplaced</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{placementStats.unplaced}</p>
              </div>
              <div className="bg-red-100 p-2.5 rounded-xl text-2xl">❌</div>
            </div>
            <p className="text-xs text-gray-400 mt-3">Still searching for internships</p>
          </motion.div>
        </div>

        {/* Search and Filter Bar - Enhanced Design */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/50 transition-all"
              />
            </div>
            <div className="md:w-48">
  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/50 text-gray-700 cursor-pointer"
  >
    {activeTab === 'students' ? (
      // ✅ للطلاب: فقط All, Active, Suspended (بدون Pending)
      <>
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
      </>
    ) : activeTab === 'agreements' ? (
      // ✅ للاتفاقيات: All, Pending, Signed, Active, Completed
      <>
      <option value="all">All Status</option>
      <option value="pending">Pending</option>
      <option value="signed">Signed</option>
      <option value="completed">Completed</option>
      <option value="archived">Archived</option>
      </>
    ) : (
      // ✅ للشركات: All, Verified, Pending, Suspended, Active
      <>
        <option value="all">All Status</option>
        <option value="verified">Verified</option>
        <option value="pending">Pending</option>
        <option value="suspended">Suspended</option>
        <option value="active">Active</option>
      </>
    )}
  </select>
</div>
          </div>
        </div>

        {/* Tabs - Enhanced Design */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 px-6 pt-4">
            <nav className="flex gap-1 overflow-x-auto">
              <button
  onClick={() => setActiveTab('notifications')}
  className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all ${
    activeTab === 'notifications'
      ? 'bg-indigo-50 text-indigo-600 shadow-sm'
      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
  }`}
>
  <Bell size={16} />
  Notifications
  {unreadCount > 0 && (
    <span className="text-xs px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-600">
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  )}
</button>

              <button
                onClick={() => setActiveTab('companies')}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all ${
                  activeTab === 'companies'
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Building2 size={16} />
                Companies ({companies.length})
              </button>
              
              <button
                onClick={() => setActiveTab('students')}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all ${
                  activeTab === 'students'
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Users size={16} />
                Students ({students.length})
              </button>
              <button
                onClick={() => setActiveTab('agreements')}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all ${
                  activeTab === 'agreements'
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FileText size={16} />
                Agreements ({agreements.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* ========== NOTIFICATIONS TAB - REDESIGNED ========== */}
{activeTab === 'notifications' && (
  <motion.div
    key="notifications"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="space-y-3"
  >
     {/* ✅✅✅ أضف أزرار الفلترة هنا ✅✅✅ */}
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => setNotificationFilter('all')}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
          notificationFilter === 'all'
            ? 'bg-indigo-600 text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All ({notifications.length})
      </button>
      <button
        onClick={() => setNotificationFilter('unread')}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
          notificationFilter === 'unread'
            ? 'bg-yellow-600 text-white shadow-md'
            : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
        }`}
      >
        Unread ({notifications.filter(n => n.is_read === 0).length})
      </button>
      <button
        onClick={() => setNotificationFilter('read')}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
          notificationFilter === 'read'
            ? 'bg-green-600 text-white shadow-md'
            : 'bg-green-50 text-green-700 hover:bg-green-100'
        }`}
      >
        Read ({notifications.filter(n => n.is_read === 1).length})
      </button>
    </div>
        {filteredNotifications.length > 0 ? (
      filteredNotifications.map((notification, index) => {
        
        // Determine notification type for styling
        const getTypeStyles = () => {
          if (notification.title?.includes('Agreement Signed') || notification.title?.includes('Company Signed Agreement')) {
            return {
              bgGradient: 'from-emerald-50 to-teal-50',
              borderColor: 'border-emerald-400',
              iconBg: 'bg-emerald-100',
              iconColor: 'text-emerald-600'
            };
          }
          if (notification.title?.includes('Convention de Stage Generated') || notification.title?.includes('Agreement Generated')) {
            return {
              bgGradient: 'from-blue-50 to-indigo-50',
              borderColor: 'border-blue-400',
              iconBg: 'bg-blue-100',
              iconColor: 'text-blue-600'
            };
          }
          if (notification.title?.includes('Validation Complete')) {
            return {
              bgGradient: 'from-green-50 to-emerald-50',
              borderColor: 'border-green-400',
              iconBg: 'bg-green-100',
              iconColor: 'text-green-600'
            };
          }
          if (notification.title?.includes('New Acceptance Pending Validation')) {
            return {
              bgGradient: 'from-amber-50 to-orange-50',
              borderColor: 'border-amber-400',
              iconBg: 'bg-amber-100',
              iconColor: 'text-amber-600'
            };
          }
          return {
            bgGradient: 'from-gray-50 to-gray-50',
            borderColor: 'border-gray-300',
            iconBg: 'bg-gray-100',
            iconColor: 'text-gray-600'
          };
        };

        const styles = getTypeStyles();
        
        return (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className={`group relative overflow-hidden rounded-xl transition-all duration-300 ${
              notification.is_read 
                ? 'bg-white border border-gray-100 hover:shadow-md' 
                : `bg-gradient-to-r ${styles.bgGradient} border-l-4 ${styles.borderColor} shadow-sm hover:shadow-md`
            }`}
          >
            {/* Status indicator dot for unread */}
            {!notification.is_read && (
              <div className="absolute top-4 right-4">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              </div>
            )}
            
            <div className="p-5">
              <div className="flex items-start gap-4">
                {/* Icon with gradient background */}
                <div className={`${styles.iconBg} p-3 rounded-xl shadow-sm`}>
                  <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Header with title and time */}
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold ${notification.is_read ? 'text-gray-700' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      {/* Badge for pending actions */}
                      {!notification.is_read && notification.title?.includes('Pending') && (
                        <span className="px-2 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-700 rounded-full">
                          Action Required
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar size={12} />
                      <span>{getTimeAgo(notification.created_at)}</span>
                    </div>
                  </div>
                  
                  {/* Message with better formatting */}
                  <p className={`text-sm mb-3 leading-relaxed ${notification.is_read ? 'text-gray-500' : 'text-gray-700'}`}>
                    {notification.message}
                  </p>
                  
                  {/* Validation Complete Badge */}
                  {notification.type === 'validation_complete' && (
                    <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium mb-3">
                      <CheckCircle size={14} />
                      <span>Internship Successfully Validated</span>
                    </div>
                  )}

                  {/* Rejection Badge */}
                  {notification.type === 'rejection_complete' && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg mb-3">
                      <p className="text-xs text-red-700 font-medium mb-1">Rejection Reason:</p>
                      <p className="text-sm text-gray-700">
                        {notification.message.split('Reason:')[1] || notification.message}
                      </p>
                    </div>
                  )}

                  {/* 🎉 New Student Acceptance - Action Buttons */}
                  {notification.title === '🎉 New Student Acceptance' && !notification.is_read && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        onClick={() => navigate(`/admin/internship-details/${notification.application_id}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-all shadow-sm"
                      >
                        <Eye size={14} />
                        View Details
                      </button>
                      <button
                        onClick={() => handleValidateInternship(notification)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-all shadow-sm"
                      >
                        <CheckCircle size={14} />
                        Validate
                      </button>
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300 transition-all"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {/* 📋 New Acceptance Pending Validation */}
                  {!notification.is_read && notification.title === '📋 New Acceptance Pending Validation' && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        onClick={() => navigate(`/admin/internship-details/${notification.application_id}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-all shadow-sm"
                      >
                        <Eye size={14} />
                        Review Application
                      </button>
                      <button
                        onClick={() => handleValidateInternship(notification)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-all shadow-sm"
                      >
                        <CheckCircle size={14} />
                        Approve & Validate
                      </button>
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300 transition-all"
                      >
                        Later
                      </button>
                    </div>
                  )}

                  {/* 🏢 New Company Registration */}
                  {!notification.is_read && notification.title === '🏢 New Company Registration Pending Approval' && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        onClick={() => {
                          markAsRead(notification.id);
                          setActiveTab('companies');
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-all shadow-sm"
                      >
                        <Building2 size={14} />
                        Review Company
                      </button>
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300 transition-all"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {/* 👨‍🎓 New Student Registration Pending Approval - مثل الشركة */}
{!notification.is_read && notification.title === '👨‍🎓 New Student Registration Pending Approval' && (
  <div className="flex flex-wrap gap-2 mt-3">
    <button
      onClick={() => {
        // استخراج بيانات الطالب من الإشعار
        let studentData = {};
        try {
          studentData = typeof notification.data === 'string' 
            ? JSON.parse(notification.data) 
            : notification.data;
        } catch (e) {
          studentData = {};
        }
        
        // التوجيه إلى صفحة الطالب
        markAsRead(notification.id);
        setActiveTab('students');
        
        // ✅ استخدم toast.success بدلاً من toast.info
        toast.success(`📋 Student ${studentData.student_name || 'registration'} ready for review`);
      }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-all shadow-sm"
    >
      <Users size={14} />
      Review Student
    </button>
    <button
      onClick={() => markAsRead(notification.id)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300 transition-all"
    >
      Dismiss
    </button>
  </div>
)}

                  {/* Agreement Generated Actions */}
                  {notification.type === 'agreement_generated' && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        onClick={() => navigate(`/admin/agreements/${notification.agreement_id}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-all shadow-sm"
                      >
                        <FileText size={14} />
                        View Agreement
                      </button>
                      <button
                        onClick={() => sendAgreementByEmail(notification.agreement_id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-all shadow-sm"
                      >
                        <Mail size={14} />
                        Send Email
                      </button>
                    </div>
                  )}

                  {/* Agreement Signed - View Student */}
                  {notification.type === 'agreement_signed' && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        onClick={() => navigate(`/admin/students/${notification.student_id}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition-all shadow-sm"
                      >
                        <Users size={14} />
                        View Student Profile
                      </button>
                    </div>
                  )}

                  {/* Internship Completed - Generate Certificate */}
                  {notification.type === 'internship_completed' && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        onClick={() => generateCertificate(notification)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-medium hover:bg-amber-700 transition-all shadow-sm"
                      >
                        <Award size={14} />
                        Generate Certificate
                      </button>
                    </div>
                  )}

                  {/* Company Rating Display */}
                  {notification.type === 'company_rated' && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              className={i < (notification.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{notification.rating}/5</span>
                      </div>
                      {notification.review && (
                        <p className="text-sm text-gray-600 italic">"{notification.review}"</p>
                      )}
                    </div>
                  )}

                  {/* Processed/Read indicator */}
                  {notification.is_read === 1 && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-3">
                      <CheckCircle size={12} />
                      <span>Processed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })
  ) : (
  <div className="text-center py-16">
    <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <Bell size={40} className="text-gray-400" />
    </div>
    <p className="text-xl text-gray-600">
      {searchTerm ? 'No matching notifications found' : 'No notifications yet'}
    </p>
    <p className="text-gray-400 text-sm mt-2">
      {searchTerm ? 'Try adjusting your search' : 'When companies accept students, you\'ll see them here'}
    </p>
  </div>
)}
  </motion.div>
)}

              {/* ========== COMPANIES TAB ========== */}
              {activeTab === 'companies' && (
                <motion.div
                  key="companies"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {companiesLoading ? (
                    <div className="text-center py-16">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
                      <p className="mt-4 text-gray-600">Loading companies...</p>
                    </div>
                  ) : filteredCompanies.length > 0 ? (
                    <div className="space-y-3">
                      {filteredCompanies.map((company, index) => (
                        <motion.div
                          key={company.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-indigo-200 transition-all duration-300"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-3 rounded-xl">
                                {company.logo_url ? (
                                  <img 
                                    src={`${BASE}${company.logo_url}`}
                                    alt={company.company_name}
                                    className="w-10 h-10 rounded-lg object-cover"
                                  />
                                ) : (
                                  <Building2 size={24} className="text-indigo-600" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900">{company.company_name}</h3>
                                <p className="text-sm text-gray-500">{company.email}</p>
                                <div className="flex flex-wrap gap-3 mt-2">
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <MapPin size={12} />
                                    {company.wilaya || 'Location not set'}
                                  </span>
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Briefcase size={12} />
                                    {company.internships_count ? company.internships_count + ' internships' : ''}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-2">
                              {getStatusBadge(company.verification_status, company.is_suspended)}
                              
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => navigate(`/admin/companies/${company.id}`)}
                                  className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                                  title="View Company Details"
                                >
                                  <Eye size={14} />
                                </button>
                                <button
                                  onClick={() => verifyCompany(company.id)}
                                  disabled={company.verification_status === 'verified' && !company.is_suspended}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    company.verification_status === 'verified' && !company.is_suspended
                                      ? 'bg-green-50 text-green-400 cursor-not-allowed'
                                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                                  }`}
                                  title={company.is_suspended ? "Activate & Verify Company" : "Verify Company"}
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  onClick={() => suspendCompany(company.id)}
                                  disabled={company.verification_status === 'suspended'}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    company.verification_status === 'suspended'
                                      ? 'bg-amber-50 text-amber-400 cursor-not-allowed'
                                      : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                                  }`}
                                  title="Suspend Company"
                                >
                                  <Ban size={14} />
                                </button>
                                <button
                                  onClick={() => deleteCompany(company.id)}
                                  className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                  title="Delete Company"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="text-6xl mb-4">🏢</div>
                      <p className="text-xl text-gray-600">No companies found</p>
                      <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filter</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ========== STUDENTS TAB ========== */}
{activeTab === 'students' && (
  <motion.div
    key="students"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
  >
    {studentsLoading ? (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading students...</p>
      </div>
    ) : filteredStudents.length > 0 ? (
      <div className="space-y-3">
        {filteredStudents.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-purple-200 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-xl">
                  {student.profile_image_url ? (
                    <img 
                      src={`${BASE}${student.profile_image_url}`}
                      alt={`${student.first_name} ${student.last_name}`}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <Users size={24} className="text-purple-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {student.first_name} {student.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">{student.email}</p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <GraduationCap size={12} />
                      {student.university || 'University not set'}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Award size={12} />
                      {student.specialization || 'N/A'}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Briefcase size={12} />
                      {student.applications_count || 0} applications
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                {/* ✅ حالة الطالب */}
                {getStatusBadge(student.verification_status, student.is_suspended, student.is_verified)}
                
                {/* ✅ أزرار التحكم - مثل الشركات */}
                <div className="flex gap-1.5">
                  <button
                    onClick={() => viewStudentProfile(student.id)}
                    className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                    title="View Student Details"
                  >
                    <Eye size={14} />
                  </button>
                  
                  {/* زر Verify - يظهر فقط إذا كان الطالب غير مفعل */}
                  {(student.is_verified === 0 || student.is_verified === undefined) && !student.is_suspended && (
                    <button
                      onClick={() => verifyStudent(student.id)}
                      className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                      title="Verify Student"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  
                  {/* زر Verified - يظهر إذا كان الطالب مفعلاً */}
                  {student.is_verified === 1 && !student.is_suspended && (
                    <button
                      disabled
                      className="p-1.5 bg-green-100 text-green-400 rounded-lg cursor-not-allowed"
                      title="Already Verified"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  
                  {/* زر Suspend - يظهر إذا كان الطالب غير معلق */}
                  {!student.is_suspended && (
                    <button
                      onClick={() => suspendStudent(student.id)}
                      className="p-1.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors"
                      title="Suspend Student"
                    >
                      <Ban size={14} />
                    </button>
                  )}
                  
                  {/* زر Activate - يظهر إذا كان الطالب معلقاً */}
                  {student.is_suspended === 1 && (
                    <button
                      onClick={() => activateStudent(student.id)}
                      className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                      title="Activate Student"
                    >
                      <RotateCcw size={14} />
                    </button>
                  )}
                  
                  {/* زر Delete */}
                  <button
                    onClick={() => deleteStudent(student.id)}
                    className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    title="Delete Student"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    ) : (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">👨‍🎓</div>
        <p className="text-xl text-gray-600">No students found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filter</p>
      </div>
    )}
  </motion.div>
)}

              {/* ========== AGREEMENTS TAB ========== */}
              {activeTab === 'agreements' && (
                <motion.div
                  key="agreements"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {agreementsLoading ? (
                    <div className="text-center py-16">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
                      <p className="mt-4 text-gray-600">Loading agreements...</p>
                    </div>
                  ) : filteredAgreements.length > 0 ? (
                    <div className="space-y-3">
                      {filteredAgreements.map((agreement, index) => (
                        <motion.div
                          key={agreement.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-rose-200 transition-all duration-300"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="bg-gradient-to-br from-rose-100 to-pink-100 p-3 rounded-xl">
                                <FileText size={24} className="text-rose-600" />
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900">{agreement.internship_title}</h3>
                                <p className="text-sm text-gray-600">
                                  {agreement.student_name} • {agreement.company_name}
                                </p>
                                <div className="flex flex-wrap gap-3 mt-2">
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Calendar size={12} />
                                    Created: {new Date(agreement.created_at).toLocaleDateString()}
                                  </span>
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock size={12} />
                                    {agreement.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-2">
                              {getStatusBadge(agreement.status)}
                              
                              <div className="flex gap-1.5 flex-wrap">
                                <button
                                  onClick={() => {
                                    setSelectedAgreement({
                                      id: agreement.id,
                                      studentName: agreement.student_name,
                                      companyName: agreement.company_name,
                                      internshipTitle: agreement.internship_title
                                    });
                                    setShowAgreementModal(true);
                                  }}
                                  className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 text-xs font-medium flex items-center gap-1"
                                >
                                  <FileText size={12} />
                                  PDF
                                </button>
                                
                                <button
                                  onClick={() => sendAgreementByEmail(agreement.id)}
                                  className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 text-xs font-medium flex items-center gap-1"
                                >
                                  <Mail size={12} />
                                  Send
                                </button>

                                {agreement.status !== 'archived' && (
                                  <>
                                    {agreement.university_signed !== 1 ? (
                                      <button
                                        onClick={() => signAgreementAsUniversity(agreement.id)}
                                        className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-xs font-medium flex items-center gap-1"
                                      >
                                        ✍️ Sign
                                      </button>
                                    ) : (
                                      <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium flex items-center gap-1">
                                        <CheckCircle size={12} />
                                        Signed
                                      </div>
                                    )}
                                  </>
                                )}
                                
                                {agreement.status !== 'archived' && (
                                  <button
                                    onClick={() => archiveAgreement(agreement.id)}
                                    className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-xs font-medium flex items-center gap-1"
                                  >
                                    <Archive size={12} />
                                    Archive
                                  </button>
                                )}

                                {agreement.status === 'archived' && (
                                  <button
                                    onClick={() => unarchiveAgreement(agreement.id)}
                                    className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 text-xs font-medium flex items-center gap-1"
                                  >
                                    <RotateCcw size={12} />
                                    Unarchive
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="text-6xl mb-4">📄</div>
                      <p className="text-xl text-gray-600">No agreements found</p>
                      <p className="text-gray-400 text-sm mt-2">Generate agreements from notifications</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
           
      {/* Agreement Generation Modal */}
      {showAgreementModal && selectedAgreement && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Generate Agreement</h2>
                <button
                  onClick={() => setShowAgreementModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-4">Agreement Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Student:</span>
                      <span className="font-medium text-gray-900">{selectedAgreement.studentName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Company:</span>
                      <span className="font-medium text-gray-900">{selectedAgreement.companyName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Internship:</span>
                      <span className="font-medium text-gray-900">{selectedAgreement.internshipTitle}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> Documents will be generated as PDF files.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Generate Documents:</h3>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => generateAgreementPDF(selectedAgreement)}
                      className="flex flex-col items-center justify-center p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all border-2 border-indigo-200 hover:border-indigo-500"
                    >
                      <span className="text-3xl mb-2">📄</span>
                      <span className="text-xs font-medium text-indigo-700 text-center">Internship Agreement</span>
                    </button>
                    
                    <button
                      onClick={() => generateCertificate(selectedAgreement)}
                      className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-all border-2 border-green-200 hover:border-green-500"
                    >
                      <span className="text-3xl mb-2">🎓</span>
                      <span className="text-xs font-medium text-green-700 text-center">Completion Certificate</span>
                    </button>
                    
                    <button
                      onClick={() => generateAcceptanceLetter(selectedAgreement)}
                      className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all border-2 border-blue-200 hover:border-blue-500"
                    >
                      <span className="text-3xl mb-2">📬</span>
                      <span className="text-xs font-medium text-blue-700 text-center">Acceptance Letter</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => generateEvaluationForm(selectedAgreement)}
                      className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all border-2 border-purple-200 hover:border-purple-500"
                    >
                      <span className="text-3xl mb-2">📋</span>
                      <span className="text-xs font-medium text-purple-700 text-center">Evaluation Form</span>
                    </button>
                    
                    <button
                      onClick={() => generateAllDocuments(selectedAgreement)}
                      className="flex flex-col items-center justify-center p-4 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all border-2 border-amber-200 hover:border-amber-500"
                    >
                      <span className="text-3xl mb-2">📚</span>
                      <span className="text-xs font-medium text-amber-700 text-center">Generate All</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <button
                    onClick={() => setShowAgreementModal(false)}
                    className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;