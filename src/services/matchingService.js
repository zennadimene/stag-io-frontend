// frontend/src/services/matchingService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/matching';

/**
 * الحصول على توصيات ذكية
 */
export const getSmartRecommendations = async (limit = 10) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/recommendations?limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return { success: false, recommendations: [] };
  }
};

/**
 * الحصول على توصيات سريعة للوحة التحكم
 */
export const getQuickRecommendations = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/quick`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching quick recommendations:', error);
    return { success: false, recommendations: [] };
  }
};

/**
 * تسجيل تفاعل مع توصية
 */
export const trackInteraction = async (internshipId, action) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/track`,
      { internshipId, action },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error tracking interaction:', error);
    return { success: false };
  }
};

/**
 * إرسال تغذية راجعة عن توصية
 */
export const provideFeedback = async (internshipId, helpful, reason = '') => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/feedback`,
      { internshipId, helpful, reason },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error providing feedback:', error);
    return { success: false };
  }
};