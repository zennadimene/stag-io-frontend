import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

       const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const InternshipCard = ({ internship }) => {
  const navigate = useNavigate();

  const handleApply = async (e) => {
    e.stopPropagation();
    
    try {
      const token = localStorage.getItem('token');
      //const response = await fetch('http://localhost:5000/api/student/applications', {
      const response = await fetch(`${BASE}/api/student/applications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ internship_id: internship.id })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Application submitted successfully!');
        
        window.location.reload();
      } else {
        alert(data.message || 'Failed to apply');
      }
    } catch (error) {
      console.error('Error applying:', error);
      alert('Error submitting application');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              internship.type === 'remote' 
                ? 'bg-purple-100 text-purple-800' 
                : internship.type === 'hybrid'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {internship.type}
            </span>
            <h3 className="text-xl font-bold text-gray-900 mt-2">
              {internship.title}
            </h3>
            <p className="text-gray-600 mt-1">{internship.company_name}</p>
          </div>
          
          {internship.has_applied && (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              Applied ✓
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-6 line-clamp-3">
          {internship.description}
        </p>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{internship.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{internship.duration} months</span>
          </div>
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>${internship.stipend}/month</span>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Required Skills:</p>
          <div className="flex flex-wrap gap-2">
            {internship.required_skills?.map((skill, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/internships/${internship.id}`)}
            className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
          >
            View Details
          </button>
          
          {!internship.has_applied ? (
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Apply Now
            </button>
          ) : (
            <button
              onClick={() => navigate('/student/applications')}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              View Application
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default InternshipCard;