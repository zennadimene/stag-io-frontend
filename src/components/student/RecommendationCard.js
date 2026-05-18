// frontend/src/components/student/RecommendationCard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Briefcase,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { trackInteraction, provideFeedback } from '../../services/matchingService';

const RecommendationCard = ({ internship, onSave, isSaved }) => {
  const navigate = useNavigate();
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Get match badge color
  const getMatchColor = (level) => {
    switch(level) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-300';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'fair': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Get match badge text
  const getMatchText = (level) => {
    switch(level) {
      case 'excellent': return 'Excellent Match';
      case 'good': return 'Good Match';
      case 'fair': return 'Average Match';
      default: return 'Suggested for you';
    }
  };

  // Handle card click
  const handleClick = async () => {
    await trackInteraction(internship.id, 'click');
    navigate(`/internships/${internship.id}`);
  };

  // Handle "View Details" click
  const handleViewDetails = async (e) => {
    e.stopPropagation();
    await trackInteraction(internship.id, 'view');
    navigate(`/internships/${internship.id}`);
  };

  // Handle save/remove internship
  const handleSave = async (e) => {
    e.stopPropagation();
    const action = isSaved ? 'unsave' : 'save';
    await trackInteraction(internship.id, action);
    onSave(internship.id);
  };

  // Submit feedback
  const handleFeedback = async (helpful) => {
    await provideFeedback(internship.id, helpful);
    setFeedbackSubmitted(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 cursor-pointer transition-all"
      onClick={handleClick}
    >
      {/* Top bar with match score */}
      <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600" style={{ width: `${internship.match_score}%` }}></div>
      
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {/* Match badge */}
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getMatchColor(internship.match_level)}`}>
                {getMatchText(internship.match_level)} {internship.match_score}%
              </span>
              
              {/* Internship type badge */}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                internship.type === 'remote' ? 'bg-green-100 text-green-800' :
                internship.type === 'part-time' ? 'bg-blue-100 text-blue-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {internship.type === 'remote' ? 'Remote' :
                 internship.type === 'part-time' ? 'Part-time' :
                 internship.type === 'full-time' ? 'Full-time' :
                 internship.type}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-1">{internship.title}</h3>
            <p className="text-gray-600 font-medium mb-2">{internship.company_name}</p>
          </div>
          
          {/* Company logo */}
          {internship.logo_url ? (
            <img 
              src={`http://localhost:5000${internship.logo_url}`}
              alt={internship.company_name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
              <Briefcase className="text-indigo-600" size={24} />
            </div>
          )}
        </div>

        {/* Match reason */}
        {internship.reason && internship.reason.length > 0 && (
          <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
            <p className="text-sm text-indigo-800 font-medium mb-1">✨ Why it suits you?</p>
            <ul className="text-xs text-indigo-700 space-y-1">
              {internship.reason.map((reason, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span>•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quick details */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-gray-600">
            <MapPin size={14} className="mr-1 text-gray-400" />
            <span className="text-sm">{internship.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock size={14} className="mr-1 text-gray-400" />
            <span className="text-sm">{internship.duration} months</span>
          </div>
          <div className="flex items-center text-gray-600">
            <DollarSign size={14} className="mr-1 text-gray-400" />
            <span className="text-sm font-medium">
              {internship.stipend ? `${internship.stipend} DZD` : 'Unpaid'}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <Briefcase size={14} className="mr-1 text-gray-400" />
            <span className="text-sm capitalize">{internship.type}</span>
          </div>
        </div>

        {/* Required skills */}
        {internship.required_skills && internship.required_skills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Required skills:</p>
            <div className="flex flex-wrap gap-1">
              {internship.required_skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                >
                  {skill}
                </span>
              ))}
              {internship.required_skills.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{internship.required_skills.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className={`p-2 rounded-lg transition-colors ${
                isSaved 
                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save for later'}
            >
              {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
            
            <button
              onClick={handleViewDetails}
              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              title="View details"
            >
              <Eye size={18} />
            </button>
          </div>
          
          {/* Feedback button */}
          {!feedbackSubmitted ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowFeedback(!showFeedback);
              }}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Is this recommendation helpful?
            </button>
          ) : (
            <span className="text-xs text-green-600">Thank you for rating! ✓</span>
          )}
        </div>

        {/* Feedback window */}
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm text-gray-700 mb-3">Is this recommendation suitable for you?</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleFeedback(true)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
              >
                <ThumbsUp size={16} />
                <span>Yes</span>
              </button>
              <button
                onClick={() => handleFeedback(false)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
              >
                <ThumbsDown size={16} />
                <span>No</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default RecommendationCard;