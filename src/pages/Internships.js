import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign, 
  Briefcase,
  Calendar,
  Eye, 
  CheckCircle,
  XCircle,
  Loader2,
  Bookmark,        // ✅ أضف هذا
  BookmarkCheck    // ✅ أضف هذا
} from 'lucide-react';

const Internships = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [internships, setInternships] = useState([]);
  const [originalInternships, setOriginalInternships] = useState([]); // ADD THIS LINE
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [sortBy, setSortBy] = useState('most_relevant');
  const [savedInternships, setSavedInternships] = useState([]);
const [saving, setSaving] = useState(null);

  // Enhanced filter state
  const [filters, setFilters] = useState({
    wilaya: '',
    technology: '',
    type: '',
    remote: false,
    search: '',
    duration: '',
    stipend: '',
    datePosted: ''
  });
  
  // State for showing advanced filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

 const [technologies] = useState([
  'Android Studio',
  'Angular',
  'Ansible',
  'Apache Spark',
  'ASP.NET',
  'AWS',
  'Azure',
  'Bitbucket',
  'Bootstrap',
  'Burp Suite',
  'Cassandra',
  'Cypress',
  'Deep Learning',
  'Django',
  'Docker',
  'DynamoDB',
  'Elasticsearch',
  'Express.js',
  'FastAPI',
  'Figma',
  'Firebase',
  'Flask',
  'Flutter',
  'Git',
  'GitHub',
  'GitHub Actions',
  'GitLab',
  'GitLab CI/CD',
  'Go',
  'Google Cloud',
  'Grafana',
  'GraphQL',
  'Hadoop',
  'Hugging Face',
  'HTML/CSS',
  'Ionic',
  'Java',
  'JavaScript',
  'Jenkins',
  'Jest',
  'Jetpack Compose',
  'jQuery',
  'JUnit',
  'Kafka',
  'Kali Linux',
  'Keras',
  'Kotlin',
  'Kubernetes',
  'LangChain',
  'Laravel',
  'LLM',
  'Machine Learning',
  'MariaDB',
  'Metasploit',
  'Mocha',
  'MongoDB',
  'MySQL',
  'NestJS',
  'Next.js',
  'Nmap',
  'Node.js',
  'NumPy',
  'OpenCV',
  'Oracle',
  'OWASP',
  'Pandas',
  'Penetration Testing',
  'PHP',
  'PostgreSQL',
  'Postman',
  'Power BI',
  'Prometheus',
  'PyTest',
  'Python',
  'PyTorch',
  'R',
  'RabbitMQ',
  'React',
  'React Native',
  'Redis',
  'Redux',
  'REST API',
  'Ruby on Rails',
  'Rust',
  'Scikit-learn',
  'Selenium',
  'Socket.io',
  'Spring Boot',
  'SQL',
  'SQLite',
  'Swift',
  'Swagger',
  'Tableau',
  'Tailwind CSS',
  'TensorFlow',
  'Terraform',
  'TypeScript',
  'Vue.js',
  'WebSocket',
  'Wireshark',
  'Xcode'
]);

const [wilayas] = useState([
  "Adrar",
  "Aïn Defla",
  "Aïn Témouchent",
  "Algiers",
  "Annaba",
  "Batna",
  "Béchar",
  "Béjaïa",
  "Béni Abbès",
  "Biskra",
  "Blida",
  "Bordj Badji Mokhtar",
  "Bordj Bou Arréridj",
  "Bouira",
  "Boumerdès",
  "Chlef",
  "Constantine",
  "Djanet",
  "Djelfa",
  "El Bayadh",
  "El M'Ghair",
  "El Menia",
  "El Oued",
  "El Tarf",
  "Ghardaïa",
  "Guelma",
  "Illizi",
  "In Guezzam",
  "In Salah",
  "Jijel",
  "Khenchela",
  "Laghouat",
  "M'Sila",
  "Mascara",
  "Médéa",
  "Mila",
  "Mostaganem",
  "Naâma",
  "Oran",
  "Ouargla",
  "Ouled Djellal",
  "Oum El Bouaghi",
  "Relizane",
  "Saïda",
  "Sétif",
  "Sidi Bel Abbès",
  "Skikda",
  "Souk Ahras",
  "Tamanrasset",
  "Tébessa",
  "Tiaret",
  "Tindouf",
  "Tipaza",
  "Tissemsilt",
  "Tizi Ouzou",
  "Tlemcen",
  "Touggourt"
]);


  const internshipTypes = [
    { value: '', label: 'All Types' },
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'project', label: 'Project-based' }
  ];

  const durationOptions = [
    { value: '', label: 'Any Duration' },
    { value: '1-3', label: '1-3 Months' },
    { value: '3-6', label: '3-6 Months' },
    { value: '6+', label: '6+ Months' }
  ];

  const stipendOptions = [
    { value: '', label: 'Any Stipend' },
    { value: 'paid', label: 'Paid' },
    { value: 'unpaid', label: 'Unpaid' },
    { value: 'negotiable', label: 'Negotiable' }
  ];

  const datePostedOptions = [
    { value: '', label: 'Any Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

   useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.user_type !== 'student') {
      navigate('/login');
      return;
    }

     // Parse URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const urlFilters = {
      wilaya: queryParams.get('wilaya') || '',
      technology: queryParams.get('technology') || '',
      type: queryParams.get('type') || '',
      remote: queryParams.get('remote') === 'true',
      search: queryParams.get('search') || '',
      duration: queryParams.get('duration') || '',
      stipend: queryParams.get('stipend') || '',
      datePosted: queryParams.get('datePosted') || ''
    };
    
    setFilters(urlFilters);
    fetchInternships(urlFilters);
    fetchSavedInternships();
  }, [navigate, location.search]);

  const fetchInternships = async (filterParams) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams(filterParams);
      
      const response = await axios.get(`http://localhost:5000/api/internships?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const internshipsData = response.data.internships;
        setOriginalInternships(internshipsData); // Store original
        setInternships(internshipsData);
        // Apply initial sort
        sortInternshipsData(internshipsData, sortBy);
      }
    } catch (error) {
      console.error('Error fetching internships:', error);
    } finally {
      setLoading(false);
    }
  };


  
  // Sorting function
  const sortInternshipsData = (data, sortType) => {
    const sorted = [...data];
    
    switch (sortType) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
        
      case 'deadline':
        sorted.sort((a, b) => {
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline) - new Date(b.deadline);
        });
        break;
        
      case 'stipend_high':
        sorted.sort((a, b) => (b.stipend || 0) - (a.stipend || 0));
        break;
        
      case 'stipend_low':
        sorted.sort((a, b) => (a.stipend || 0) - (b.stipend || 0));
        break;
        
      case 'duration_short':
        sorted.sort((a, b) => (a.duration || 999) - (b.duration || 999));
        break;
        
      case 'duration_long':
        sorted.sort((a, b) => (b.duration || 0) - (a.duration || 0));
        break;
        
      case 'most_relevant':
      default:
        // For "Most Relevant", sort by creation date (newest first) as default
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }
    
    setInternships(sorted);
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
    sortInternshipsData(internships, sortType);
  };


  

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL without reloading
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== 'false') params.set(k, v);
    });
    navigate({ search: params.toString() });
  };

  const clearFilters = () => {
    const newFilters = {
      wilaya: '',
      technology: '',
      type: '',
      remote: false,
      search: '',
      duration: '',
      stipend: '',
      datePosted: ''
    };
    setFilters(newFilters);
    setShowAdvancedFilters(false);
    navigate({ search: '' });
  };

  const handleApply = async (internshipId) => {
    try {
      setApplying(internshipId);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/student/applications',
        { internship_id: internshipId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        toast.success('Application submitted successfully!');
        fetchInternships(filters);
      }
    } catch (error) {
      console.error('Error applying:', error);
      toast.error(error.response?.data?.message || 'Error applying to internship');
    } finally {
      setApplying(null);
    }
  };


   // ============================================
  // SAVE INTERNSHIP FUNCTIONS - أضف هنا
  // ============================================

  // جلب التدريبات المحفوظة
  const fetchSavedInternships = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/student/saved-internships', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const savedIds = response.data.savedInternships.map(item => item.internship_id);
        setSavedInternships(savedIds);
      }
    } catch (error) {
      console.error('Error fetching saved internships:', error);
    }
  };

  // حفظ تدريب
  const handleSave = async (internshipId) => {
    try {
      setSaving(internshipId);
      const token = localStorage.getItem('token');
      
      await axios.post(
        `http://localhost:5000/api/student/saved-internships/${internshipId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setSavedInternships([...savedInternships, internshipId]);
    } catch (error) {
      console.error('Error saving internship:', error);
      toast.error(error.response?.data?.message || 'Error saving internship');
    } finally {
      setSaving(null);
    }
  };

  // إزالة تدريب محفوظ
  const handleUnsave = async (internshipId) => {
    try {
      setSaving(internshipId);
      const token = localStorage.getItem('token');
      
      await axios.delete(
        `http://localhost:5000/api/student/saved-internships/${internshipId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setSavedInternships(savedInternships.filter(id => id !== internshipId));
    } catch (error) {
      console.error('Error removing saved internship:', error);
      toast.error('Error removing internship');
    } finally {
      setSaving(null);
    }
  };

  // التحقق من أن التدريب محفوظ
  const isSaved = (internshipId) => {
    return savedInternships.includes(internshipId);
  };



  const getApplicationStatus = (internship) => {
    if (internship.has_applied) {
      return (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle size={16} />
          <span className="text-sm font-medium">Applied</span>
        </div>
      );
    }
    return null;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
        <div className="text-xl text-gray-600">Loading internships...</div>
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Browse Internships</h1>
                <p className="text-gray-600 mt-2">
                  Find and apply to the best internship opportunities
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {internships.length} opportunities found
                </span>
                <button
                  onClick={() => navigate('/student/applications')}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Eye size={16} />
                  View My Applications
                </button>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Filter className="text-blue-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              </div>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
              </button>
            </div>

            {/* Basic Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Internships
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search by title, company, or keywords..."
                  />
                </div>
              </div>

              {/* Wilaya */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={14} className="inline mr-1" />
                  Location
                </label>
                <select
                  value={filters.wilaya}
                  onChange={(e) => handleFilterChange('wilaya', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Locations</option>
                  {wilayas.map(wilaya => (
                    <option key={wilaya} value={wilaya}>{wilaya}</option>
                  ))}
                </select>
              </div>

              {/* Technology */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technology
                </label>
                <select
                  value={filters.technology}
                  onChange={(e) => handleFilterChange('technology', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Technologies</option>
                  {technologies.map(tech => (
                    <option key={tech} value={tech}>{tech}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t pt-4 mt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Briefcase size={14} className="inline mr-1" />
                      Internship Type
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {internshipTypes.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock size={14} className="inline mr-1" />
                      Duration
                    </label>
                    <select
                      value={filters.duration}
                      onChange={(e) => handleFilterChange('duration', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {durationOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Stipend */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign size={14} className="inline mr-1" />
                      Stipend
                    </label>
                    <select
                      value={filters.stipend}
                      onChange={(e) => handleFilterChange('stipend', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {stipendOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Posted */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar size={14} className="inline mr-1" />
                      Date Posted
                    </label>
                    <select
                      value={filters.datePosted}
                      onChange={(e) => handleFilterChange('datePosted', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {datePostedOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Remote Checkbox and Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="remote"
                    checked={filters.remote}
                    onChange={(e) => handleFilterChange('remote', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">Remote Only</span>
                </label>
                
                {/* Quick Filter Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      handleFilterChange('type', 'remote');
                      handleFilterChange('remote', true);
                    }}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100"
                  >
                    Remote
                  </button>
                  <button
                    onClick={() => handleFilterChange('type', 'part-time')}
                    className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100"
                  >
                    Part-time
                  </button>
                  <button
                    onClick={() => handleFilterChange('stipend', 'paid')}
                    className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100"
                  >
                    Paid
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => fetchInternships(filters)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* Internships Grid */}
          {internships.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-12 text-center">
              <div className="max-w-md mx-auto">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No internships found</h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search terms to find more opportunities.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Sorting Options */}
              {/* Sorting Options */}
{/* Sorting Options */}
<div className="flex justify-between items-center mb-4">
  <p className="text-gray-600">
    Showing <span className="font-semibold">{internships.length}</span> internships
  </p>
  <select 
    value={sortBy}
    onChange={(e) => handleSortChange(e.target.value)}  // ✅ CORRECT FUNCTION NAME
    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  >
    <option value="most_relevant">Sort by: Most Relevant</option>
    <option value="newest">Sort by: Newest First</option>
    <option value="deadline">Sort by: Deadline</option>
    <option value="stipend_high">Sort by: Stipend (High to Low)</option>
    <option value="stipend_low">Sort by: Stipend (Low to High)</option>
    <option value="duration_short">Sort by: Duration (Shortest)</option>
    <option value="duration_long">Sort by: Duration (Longest)</option>
  </select>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {internships.map((internship) => (
                  <motion.div
                    key={internship.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-gray-100"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {getApplicationStatus(internship)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              internship.type === 'remote' ? 'bg-green-100 text-green-800' :
                              internship.type === 'part-time' ? 'bg-blue-100 text-blue-800' :
                              internship.type === 'full-time' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {internship.type}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                            {internship.title}
                          </h3>
                          <p className="text-gray-600 font-medium">{internship.company_name}</p>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-4">
                        <p className="text-gray-700 line-clamp-2">{internship.description}</p>
                      </div>

                      {/* Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-gray-600">
                          <MapPin size={16} className="mr-2 text-gray-400" />
                          <span>{internship.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock size={16} className="mr-2 text-gray-400" />
                          <span>{internship.duration} months</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <DollarSign size={16} className="mr-2 text-gray-400" />
                          <span className="font-medium">
                            {internship.stipend ? `$${internship.stipend}/month` : 'Unpaid'}
                          </span>
                        </div>
                        {internship.posted_date && (
                          <div className="text-sm text-gray-500">
                            Posted {formatDate(internship.posted_date)}
                          </div>
                        )}
                      </div>

                      {/* Skills */}
                      <div className="mb-6">
                        <p className="text-sm text-gray-500 mb-2">Required Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {internship.required_skills.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="bg-gray-50 text-gray-800 px-3 py-1 rounded-full text-sm border border-gray-200"
                            >
                              {skill}
                            </span>
                          ))}
                          {internship.required_skills.length > 3 && (
                            <span className="text-gray-500 text-sm">
                              +{internship.required_skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
<div className="flex justify-between items-center pt-6 border-t">
  <div className="flex gap-2">
    {/* زر الحفظ/إزالة */}
    <button
      onClick={() => isSaved(internship.id) 
        ? handleUnsave(internship.id) 
        : handleSave(internship.id)
      }
      disabled={saving === internship.id}
      className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
        isSaved(internship.id)
          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      title={isSaved(internship.id) ? 'Remove from saved' : 'Save for later'}
    >
      {saving === internship.id ? (
        <Loader2 className="animate-spin" size={16} />
      ) : isSaved(internship.id) ? (
        <BookmarkCheck size={16} />
      ) : (
        <Bookmark size={16} />
      )}
    </button>

    {/* زر التفاصيل */}
    <button
      onClick={() => navigate(`/internships/${internship.id}`)}
      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-medium"
    >
      <Eye size={16} />
      Details
    </button>
  </div>
  
  <button
    onClick={() => handleApply(internship.id)}
    disabled={internship.has_applied || applying === internship.id}
    className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
      internship.has_applied
        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
        : applying === internship.id
        ? 'bg-blue-500 text-white'
        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90'
    }`}
  >
    {applying === internship.id ? (
      <>
        <Loader2 className="animate-spin" size={16} />
        Applying...
      </>
    ) : internship.has_applied ? (
      <>
        <CheckCircle size={16} />
        Applied
      </>
    ) : (
      'Apply Now'
    )}
  </button>
</div>

                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Internships;