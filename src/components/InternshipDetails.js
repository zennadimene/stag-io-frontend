import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [similarInternships, setSimilarInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchInternshipDetails();
  }, [id]);

  const fetchInternshipDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/internships/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setInternship(response.data.internship);
        setSimilarInternships(response.data.similarInternships || []);
      }
    } catch (error) {
      console.error('Error fetching internship details:', error);
      alert('Failed to load internship details');
      navigate('/internships');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!window.confirm('Are you sure you want to apply for this internship?')) {
      return;
    }
    
    setApplying(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/student/applications',
        { internship_id: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        alert('Application submitted successfully!');
        fetchInternshipDetails(); // Refresh to update has_applied status
      }
    } catch (error) {
      console.error('Error applying:', error);
      alert(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-red-600">Internship not found</div>
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
          {/* Back Button */}
          <button
            onClick={() => navigate('/internships')}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Internships
          </button>

          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="p-8">
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                <div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    internship.type === 'remote' 
                      ? 'bg-purple-100 text-purple-800' 
                      : internship.type === 'hybrid'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {internship.type}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 mt-4">
                    {internship.title}
                  </h1>
                  <p className="text-xl text-gray-600 mt-2">{internship.company_name}</p>
                </div>
                
                <div className="mt-4 lg:mt-0">
                  {internship.has_applied ? (
                    <div className="text-center">
                      <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        Already Applied
                      </span>
                      <p className="text-sm text-gray-500 mt-2">
                        Status: {internship.application_status || 'pending'}
                      </p>
                      <button
                        onClick={() => navigate('/student/applications')}
                        className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        View Application
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleApply}
                      disabled={applying}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {applying ? 'Applying...' : 'Apply Now'}
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-lg font-semibold">{internship.location}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="text-lg font-semibold">{internship.duration} months</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Stipend</p>
                  <p className="text-lg font-semibold">${internship.stipend}/month</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Positions</p>
                  <p className="text-lg font-semibold">{internship.positions_available} available</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{internship.description}</p>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-3">
                  {internship.required_skills?.map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              {internship.requirements && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                  <div className="prose max-w-none">
                    {Array.isArray(internship.requirements) ? (
                      <ul className="list-disc pl-5">
                        {internship.requirements.map((req, index) => (
                          <li key={index} className="text-gray-700 mb-2">{req}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-700 whitespace-pre-line">{internship.requirements}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {internship.benefits && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits</h2>
                  <div className="prose max-w-none">
                    {Array.isArray(internship.benefits) ? (
                      <ul className="list-disc pl-5">
                        {internship.benefits.map((benefit, index) => (
                          <li key={index} className="text-gray-700 mb-2">{benefit}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-700 whitespace-pre-line">{internship.benefits}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Company Info */}
              {/* Company Info - ديناميكي بالكامل */}
<div className="border-t pt-8">
  <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Company</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {/* Left Column - Company Description */}
    <div className="bg-gray-50 p-6 rounded-xl">
      <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        {internship.company_name}
      </h3>
      <p className="text-gray-700 leading-relaxed">
        {internship.company_description || 'No description available'}
      </p>
    </div>

    {/* Right Column - Contact & Location */}
    <div className="space-y-4">
      {/* Address */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
        <div className="bg-blue-100 p-2 rounded-lg">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-gray-500">Address</p>
          <p className="font-semibold text-gray-900">
            {internship.company_address || internship.location || 'Not specified'}
          </p>
        </div>
      </div>

      {/* Email */}
      <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
        <div className="bg-purple-100 p-2 rounded-lg">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-semibold text-gray-900 break-all">
            {internship.company_email || 'Not provided'}
          </p>
        </div>
      </div>

      {/* Phone */}
      <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
        <div className="bg-green-100 p-2 rounded-lg">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-gray-500">Phone</p>
          <p className="font-semibold text-gray-900">
            {internship.phone || 'Not provided'}
          </p>
        </div>
      </div>

      {/* Website (إذا كان موجوداً) */}
      {internship.website && (
        <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
          <div className="bg-yellow-100 p-2 rounded-lg">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Website</p>
            <a 
              href={internship.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 hover:underline break-all"
            >
              {internship.website}
            </a>
          </div>
        </div>
      )}
    </div>
  </div>
  </div>
  </div>


          {/* Similar Internships - تصميم محسن */}
{similarInternships.length > 0 && (
  <div className="mt-12 pt-8 border-t border-gray-200 mb-8 ml-4">
    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
      Similar Internships
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {similarInternships.map((internship) => (
        <div
          key={internship.id}
          className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group"
        >
          {/* Header with company logo */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-xl">🏢</span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{internship.company_name}</h4>
                <p className="text-indigo-100 text-xs">{internship.type || 'Full-time'}</p>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {/* Title */}
            <h4 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 hover:text-indigo-600 transition">
              {internship.title}
            </h4>
            
            {/* Details */}
            <div className="space-y-3 mb-5">
              {/* Location */}
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">{internship.location || 'Location not specified'}</span>
              </div>
              
              {/* Duration */}
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">{internship.duration || '3'} months</span>
              </div>
              
              {/* Stipend */}
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-green-600">
                  {internship.stipend ? `${internship.stipend.toLocaleString()} DZD/month` : 'Negotiable'}
                </span>
              </div>
            </div>
            
            {/* Skills */}
            {internship.required_skills && internship.required_skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {internship.required_skills.slice(0, 3).map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {skill}
                  </span>
                ))}
                {internship.required_skills.length > 3 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                    +{internship.required_skills.length - 3}
                  </span>
                )}
              </div>
            )}
            
            {/* Button */}
            <button
              onClick={() => navigate(`/internships/${internship.id}`)}
              className="w-full mt-3 px-5 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-all font-medium text-sm flex items-center justify-center gap-2 group"
            >
              <span>View Details</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
          </div> 
        </motion.div>
      </div>
    </div>
  );
};

export default InternshipDetails;