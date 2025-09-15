import apiClient from './api.service';

const surveyService = {
  // Get all surveys with optional filtering
  async getSurveys(params = {}) {
    try {
      const response = await apiClient.get('/surveys', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching surveys:', error);
      throw error;
    }
  },

  // Get single survey by ID
  async getSurveyById(id) {
    try {
      const response = await apiClient.get(`/surveys/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching survey:', error);
      throw error;
    }
  },

  // Create new survey
  async createSurvey(surveyData) {
    try {
      const response = await apiClient.post('/surveys', surveyData);
      return response.data;
    } catch (error) {
      console.error('Error creating survey:', error);
      throw error;
    }
  },

  // Update survey
  async updateSurvey(id, surveyData) {
    try {
      const response = await apiClient.put(`/surveys/${id}`, surveyData);
      return response.data;
    } catch (error) {
      console.error('Error updating survey:', error);
      throw error;
    }
  },

  // Delete survey
  async deleteSurvey(id) {
    try {
      const response = await apiClient.delete(`/surveys/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting survey:', error);
      throw error;
    }
  },

  // Get overdue surveys
  async getOverdueSurveys(params = {}) {
    try {
      const response = await apiClient.get('/surveys/overdue', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching overdue surveys:', error);
      throw error;
    }
  },

  // Get upcoming visits
  async getUpcomingVisits(params = {}) {
    try {
      const response = await apiClient.get('/surveys/upcoming-visits', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming visits:', error);
      throw error;
    }
  },

  // Get survey stats
  async getSurveyStats(params = {}) {
    try {
      const response = await apiClient.get('/surveys/stats', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching survey stats:', error);
      throw error;
    }
  },

};

export default surveyService;
