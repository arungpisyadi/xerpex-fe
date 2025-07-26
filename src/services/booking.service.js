import apiClient from './api.service';

class BookingService {
  /**
   * Get all bookings with optional pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} - Response from API
   */
  async getBookings(params = {}) {
    try {
      const response = await apiClient.get('/bookings', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get booking by ID
   * @param {string} id - Booking ID
   * @returns {Promise} - Response from API
   */
  async getBookingById(id) {
    try {
      const response = await apiClient.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get booking details
   * @param {string} id - Booking ID
   * @returns {Promise} - Response from API
   */
  async getBookingDetails(id) {
    try {
      const response = await apiClient.get(`/bookings/${id}/details`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new booking
   * @param {Object} bookingData - Booking data
   * @returns {Promise} - Response from API
   */
  async createBooking(bookingData) {
    try {
      const response = await apiClient.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update booking
   * @param {string} id - Booking ID
   * @param {Object} bookingData - Updated booking data
   * @returns {Promise} - Response from API
   */
  async updateBooking(id, bookingData) {
    try {
      const response = await apiClient.put(`/bookings/${id}`, bookingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete booking
   * @param {string} id - Booking ID
   * @returns {Promise} - Response from API
   */
  async deleteBooking(id) {
    try {
      const response = await apiClient.delete(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update booking status
   * @param {string} id - Booking ID
   * @param {Object} statusData - Status data
   * @returns {Promise} - Response from API
   */
  async updateBookingStatus(id, statusData) {
    try {
      const response = await apiClient.patch(`/bookings/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add villa to booking
   * @param {string} id - Booking ID
   * @param {Object} villaData - Villa data
   * @returns {Promise} - Response from API
   */
  async addVillaToBooking(id, villaData) {
    try {
      const response = await apiClient.post(`/bookings/${id}/villas`, villaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove villa from booking
   * @param {string} bookingId - Booking ID
   * @param {string} villaId - Villa ID
   * @returns {Promise} - Response from API
   */
  async removeVillaFromBooking(bookingId, villaId) {
    try {
      const response = await apiClient.delete(`/bookings/${bookingId}/villas/${villaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add package to booking
   * @param {string} id - Booking ID
   * @param {Object} packageData - Package data
   * @returns {Promise} - Response from API
   */
  async addPackageToBooking(id, packageData) {
    try {
      const response = await apiClient.post(`/bookings/${id}/packages`, packageData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove package from booking
   * @param {string} bookingId - Booking ID
   * @param {string} packageId - Package ID
   * @returns {Promise} - Response from API
   */
  async removePackageFromBooking(bookingId, packageId) {
    try {
      const response = await apiClient.delete(`/bookings/${bookingId}/packages/${packageId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add addon to booking
   * @param {string} id - Booking ID
   * @param {Object} addonData - Addon data
   * @returns {Promise} - Response from API
   */
  async addAddonToBooking(id, addonData) {
    try {
      const response = await apiClient.post(`/bookings/${id}/addons`, addonData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove addon from booking
   * @param {string} bookingId - Booking ID
   * @param {string} addonId - Addon ID
   * @returns {Promise} - Response from API
   */
  async removeAddonFromBooking(bookingId, addonId) {
    try {
      const response = await apiClient.delete(`/bookings/${bookingId}/addons/${addonId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new BookingService();
