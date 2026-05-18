import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

import { 
  Star, 
  Send, 
  ArrowLeft,
  Building,
  Briefcase,
  MessageSquare,
  ThumbsUp,
  Award,
  Users
} from 'lucide-react';

const RateCompany = () => {
  const navigate = useNavigate();
  const { companyId, internshipId, agreementId } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [company, setCompany] = useState(null);
  const [internship, setInternship] = useState(null);
  const [ratings, setRatings] = useState({
    overall: 0,
    communication: 0,
    supervision: 0,
    learning: 0,
    workEnvironment: 0
  });
  const [review, setReview] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    fetchData();
  }, [companyId, internshipId]);

// في RateCompany.js
const fetchData = async () => {
  try {
    const token = localStorage.getItem('token');
    
    console.log('Company ID from URL:', companyId);
    console.log('Internship ID from URL:', internshipId);
    
    // جلب بيانات الشركة
    const companyRes = await axios.get(
      `http://localhost:5000/api/company/profile/${companyId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log('Company response:', companyRes.data);
    
    // جلب بيانات التدريب
    const internshipRes = await axios.get(
      `http://localhost:5000/api/internships/${internshipId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log('Internship response:', internshipRes.data);
    
    if (companyRes.data.success) {
      setCompany(companyRes.data.profile);
    }
    
    if (internshipRes.data.success) {
      setInternship(internshipRes.data.internship);
    }
    
  } catch (error) {
    console.error('Error fetching data:', error);
    toast.error('Error loading data: ' + (error.response?.data?.message || error.message));
  } finally {
    setLoading(false);
  }
};

  const handleRatingChange = (category, value) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async () => {
    // التحقق من صحة البيانات
    if (ratings.overall === 0) {
      toast.error('Please rate your overall experience');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        'http://localhost:5000/api/student/rate-company',
        {
          company_id: parseInt(companyId),
          internship_id: parseInt(internshipId),
          agreement_id: parseInt(agreementId),
          rating: ratings.overall,
          review: review,
          would_recommend: wouldRecommend,
          communication_rating: ratings.communication || null,
          supervision_rating: ratings.supervision || null,
          learning_rating: ratings.learning || null,
          work_environment_rating: ratings.workEnvironment || null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success('✅ Thank you for your review!');
        navigate('/student/agreements');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('❌ Error submitting review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ category, value, label }) => (
    <div className="mb-6">
      <p className="text-gray-700 font-medium mb-2">{label}</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(category, star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            className="focus:outline-none"
          >
            <Star
              size={32}
              className={`transition-colors ${
                star <= (hoveredStar || value)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-yellow-600 hover:text-yellow-800 mb-4"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-6">
            <h1 className="text-2xl font-bold text-white">Rate Your Internship Experience</h1>
            <p className="text-yellow-100 mt-2">Help other students by sharing your experience</p>
          </div>

          <div className="p-8">
            {/* Company Info */}
            <div className="bg-yellow-50 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Building className="text-yellow-600" size={32} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{company?.company_name}</h2>
                  <p className="text-gray-600">{internship?.title}</p>
                </div>
              </div>
            </div>

            {/* Rating Form */}
            <div className="space-y-6">
              <StarRating
                category="overall"
                value={ratings.overall}
                label="Overall Experience"
              />
              
              <StarRating
                category="communication"
                value={ratings.communication}
                label="Communication"
              />
              
              <StarRating
                category="supervision"
                value={ratings.supervision}
                label="Supervision & Mentorship"
              />
              
              <StarRating
                category="learning"
                value={ratings.learning}
                label="Learning Opportunities"
              />
              
              <StarRating
                category="workEnvironment"
                value={ratings.workEnvironment}
                label="Work Environment"
              />

              {/* Review Text */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Write a Review (Optional)
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Share your experience... What did you like? What could be improved?"
                />
              </div>

              {/* Would Recommend */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-3">
                  Would you recommend this company?
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setWouldRecommend(true)}
                    className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                      wouldRecommend
                        ? 'bg-green-600 text-white border-green-600'
                        : 'border-gray-300 text-gray-700 hover:border-green-600'
                    }`}
                  >
                    <ThumbsUp size={20} className="inline mr-2" />
                    Yes
                  </button>
                  <button
                    onClick={() => setWouldRecommend(false)}
                    className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                      !wouldRecommend
                        ? 'bg-red-600 text-white border-red-600'
                        : 'border-gray-300 text-gray-700 hover:border-red-600'
                    }`}
                  >
                    <ThumbsUp size={20} className="inline mr-2 transform rotate-180" />
                    No
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={submitting || ratings.overall === 0}
                className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Submit Review
                  </>
                )}
              </button>

              <p className="text-sm text-gray-500 text-center">
                Your review will help other students make informed decisions
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RateCompany;