import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign,
  Edit,
  Trash2,
  Eye,
  Clock,
  AlertCircle,
  Search
} from 'lucide-react';

const MyInternships = () => {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.user_type !== 'company') {
      navigate('/login');
      return;
    }
    
    fetchInternships();
  }, [navigate]);

  const fetchInternships = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/company/internships', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setInternships(response.data.internships);
      }
    } catch (error) {
      toast.error('Error fetching internships');
    } finally {
      setLoading(false);
    }
  };

 const handleDelete = async (internshipId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.delete(
      `http://localhost:5000/api/company/internships/${internshipId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    if (response.data.success) {
      setInternships(internships.filter(internship => internship.id !== internshipId));
      setDeleteConfirm(null);
      toast.success('Internship deleted successfully!');
    }
  } catch (error) {
    console.error('Error deleting internship:', error);
    
    // رسالة خطأ واضحة
    const errorMessage = error.response?.data?.message || 'Error deleting internship';
    
    // إذا كان الخطأ بسبب وجود تطبيقات
    if (errorMessage.includes('foreign key') || errorMessage.includes('constraint') || errorMessage.includes('student_internships')) {
      toast.error('This internship has applications and cannot be deleted. You can close it instead.'); 
      
      // اقتراح إغلاق التدريب بدلاً من الحذف
      const closeIt = window.confirm('Would you like to close this internship instead?');
      if (closeIt) {
        handleStatusChange(internshipId, 'closed');
      }
    } else {
      toast.error(`Error: ${errorMessage}`);
    }
  }
};

  const handleStatusChange = async (internshipId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/company/internships/${internshipId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchInternships();
    } catch (error) {
      console.error('Error updating status:', error);
       toast.error('Error updating status'); 
    }
  };

const filteredInternships = internships
  .filter(internship => {
    if (filter === 'all') return true;
    return internship.status === filter;
  })
  .filter(internship => {
    if (!searchTerm) return true;
    
    // ✅ التحقق من وجود title و location قبل استخدام toLowerCase()
    const title = internship.title || '';
    const location = internship.location || '';
    
    return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           location.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Internships</h1>
              <p className="text-gray-600 mt-2">Manage and track all your internship postings</p>
            </div>
            <button
              onClick={() => navigate('/company/create-internship')}
              className="mt-4 md:mt-0 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:opacity-90 transition"
            >
              <Briefcase size={20} />
              Post New Internship
            </button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Internships</p>
                  <p className="text-3xl font-bold text-gray-900">{internships.length}</p>
                </div>
                <Briefcase className="text-blue-600" size={32} />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Active</p>
                  <p className="text-3xl font-bold text-green-600">
                    {internships.filter(i => i.status === 'active').length}
                  </p>
                </div>
                <div className="text-green-600">✅</div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Applications</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {internships.reduce((acc, i) => acc + (i.applications_count || 0), 0)}
                  </p>
                </div>
                <Users className="text-purple-600" size={32} />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Pending Review</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {internships.reduce((acc, i) => acc + (i.pending_applications || 0), 0)}
                  </p>
                </div>
                <Clock className="text-yellow-600" size={32} />
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search internships..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('active')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === 'active' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilter('closed')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === 'closed' 
                      ? 'bg-gray-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Closed
                </button>
              </div>
            </div>
          </div>

          {/* Internships List */}
          {filteredInternships.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-12 text-center">
              <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No internships found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Post your first internship to get started'}
              </p>
              <button
                onClick={() => navigate('/company/create-internship')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                Post an Internship
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredInternships.map((internship) => (
                <motion.div
                  key={internship.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {internship.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            internship.status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : internship.status === 'filled'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {internship.status}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            internship.type === 'remote' ? 'bg-purple-100 text-purple-800' :
                            internship.type === 'part-time' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {internship.type}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin size={16} />
                            {internship.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={16} />
                            {internship.positions_available} positions
                          </span>
                          {internship.stipend > 0 && (
                            <span className="flex items-center gap-1">
                              <DollarSign size={16} />
                              {internship.stipend} DZD/month
                            </span>
                          )}
                          {internship.deadline && (
                            <span className="flex items-center gap-1">
                              <Calendar size={16} />
                              Deadline: {new Date(internship.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 lg:mt-0 flex items-center gap-3">
                        <button
                          onClick={() => navigate(`/company/internships/${internship.id}/applications`)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                        >
                          <Eye size={18} />
                          <span className="hidden sm:inline">View Applications</span>
                          <span className="sm:hidden">{internship.applications_count || 0}</span>
                        </button>
                        
                        <button
                          onClick={() => navigate(`/company/internships/edit/${internship.id}`)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit size={20} />
                        </button>
                        
                        {deleteConfirm === internship.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDelete(internship.id)}
                              className="p-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="p-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(internship.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 line-clamp-2 mb-4">
                      {internship.description}
                    </p>

                    {/* Skills */}
                    {internship.required_skills?.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {internship.required_skills.slice(0, 5).map((skill, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                          {internship.required_skills.length > 5 && (
                            <span className="text-gray-500 text-sm">
                              +{internship.required_skills.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Stats Footer */}
                    <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-sm text-gray-500">Total Applications</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {internship.applications_count || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Pending Review</p>
                        <p className="text-lg font-semibold text-yellow-600">
                          {internship.pending_applications || 0}
                        </p>
                      </div>
                      <div className="flex-1 text-right">
                        <button
                          onClick={() => handleStatusChange(
                            internship.id, 
                            internship.status === 'active' ? 'closed' : 'active'
                          )}
                          className={`px-4 py-2 rounded-lg font-medium ${
                            internship.status === 'active'
                              ? 'text-orange-600 bg-orange-50 hover:bg-orange-100'
                              : 'text-green-600 bg-green-50 hover:bg-green-100'
                          }`}
                        >
                          {internship.status === 'active' ? 'Close Posting' : 'Activate Posting'}
                        </button>
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

export default MyInternships;