import apiClient from './api.service';

const salesmanService = {
  // Get all salesmen with optional filtering
  async getSalesmen(params = {}) {
    try {
      const response = await apiClient.get('/salesmen', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching salesmen:', error);
      throw error;
    }
  },

  // Get salesmen for dropdown
  async getSalesmenDropdown() {
    try {
      const response = await apiClient.get('/salesmen/dropdown');
      return response.data;
    } catch (error) {
      console.error('Error fetching salesmen dropdown:', error);
      throw error;
    }
  },

  // Get single salesman by ID
  async getSalesmanById(id) {
    try {
      const response = await apiClient.get(`/salesmen/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching salesman:', error);
      throw error;
    }
  },

  // Create new salesman
  async createSalesman(salesmanData) {
    try {
      const response = await apiClient.post('/salesmen', salesmanData);
      return response.data;
    } catch (error) {
      console.error('Error creating salesman:', error);
      throw error;
    }
  },

  // Update salesman
  async updateSalesman(id, salesmanData) {
    try {
      const response = await apiClient.put(`/salesmen/${id}`, salesmanData);
      return response.data;
    } catch (error) {
      console.error('Error updating salesman:', error);
      throw error;
    }
  },

  // Delete salesman
  async deleteSalesman(id) {
    try {
      const response = await apiClient.delete(`/salesmen/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting salesman:', error);
      throw error;
    }
  }
};

export default salesmanService;
