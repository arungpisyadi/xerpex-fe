import apiClient from './api.service';

interface Villa {
  id: number;
  name: string;
  nightly_rate?: number;
  cleaning_fee?: number;
  [key: string]: any;
}

interface VillaListResponse {
  villas: Villa[];
  total?: number;
  skip?: number;
  limit?: number;
}

interface VillaFilters {
  page?: number;
  limit?: number;
  active_only?: boolean;
  [key: string]: any;
}

interface AvailabilityData {
  [key: string]: any;
}

interface CheckAvailabilityData {
  [key: string]: any;
}

class VillaService {
  /**
   * Get all villas with optional pagination
   * @param params - Query parameters
   * @returns Promise - Response from API
   */
  async getVillas(params: VillaFilters = {}): Promise<VillaListResponse> {
    try {
      const response = await apiClient.get('/villas', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get villa by ID
   * @param id - Villa ID
   * @returns Promise - Response from API
   */
  async getVillaById(id: string | number): Promise<Villa> {
    try {
      const response = await apiClient.get(`/villas/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new villa
   * @param villaData - Villa data
   * @returns Promise - Response from API
   */
  async createVilla(villaData: Partial<Villa>): Promise<Villa> {
    try {
      const response = await apiClient.post('/villas', villaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update villa
   * @param id - Villa ID
   * @param villaData - Updated villa data
   * @returns Promise - Response from API
   */
  async updateVilla(id: string | number, villaData: Partial<Villa>): Promise<Villa> {
    try {
      const response = await apiClient.put(`/villas/${id}`, villaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete villa
   * @param id - Villa ID
   * @returns Promise - Response from API
   */
  async deleteVilla(id: string | number): Promise<any> {
    try {
      const response = await apiClient.delete(`/villas/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create villa availability
   * @param availabilityData - Availability data
   * @returns Promise - Response from API
   */
  async createVillaAvailability(availabilityData: AvailabilityData): Promise<any> {
    try {
      const response = await apiClient.post('/villas/availability', availabilityData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update villa availability for a specific date
   * @param id - Villa ID
   * @param date - Date in YYYY-MM-DD format
   * @param availabilityData - Updated availability data
   * @returns Promise - Response from API
   */
  async updateVillaAvailability(id: string | number, date: string, availabilityData: AvailabilityData): Promise<any> {
    try {
      const response = await apiClient.put(`/villas/${id}/availability/${date}`, availabilityData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check villa availability
   * @param checkData - Check availability data
   * @returns Promise - Response from API
   */
  async checkAvailability(checkData: CheckAvailabilityData): Promise<any> {
    try {
      const response = await apiClient.post('/villas/check-availability', checkData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new VillaService();
