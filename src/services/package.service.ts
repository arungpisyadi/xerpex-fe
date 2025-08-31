pimport apiClient from './api.service';
import type {
  Package,
  CreatePackageRequest,
  UpdatePackageRequest,
  PackageListResponse,
  PackageFilters,
  PackageCategory,
  PackageType
} from '../types/package.types';

class PackageService {
  /**
   * Get all packages with optional pagination and filters
   * @param params - Query parameters
   * @returns Promise with packages data
   */
  async getPackages(params: PackageFilters = {}): Promise<PackageListResponse> {
    try {
      const response = await apiClient.get('/packages', { params });

      // Handle different response structures
      const data = response.data;
      let packages = [];
      let total = 0;

      if (Array.isArray(data)) {
        // Direct array response
        packages = data;
        total = data.length;
      } else if (data && Array.isArray(data.packages)) {
        // Paginated response with packages array
        packages = data.packages;
        total = data.total || data.packages.length;
      } else if (data && Array.isArray(data.data)) {
        // Response with data array
        packages = data.data;
        total = data.total || data.data.length;
      }

      return {
        packages,
        total,
        skip: params.skip || 0,
        limit: params.limit || 100
      };
    } catch (error) {
      console.error('PackageService.getPackages error:', error);
      throw error;
    }
  }

  /**
   * Get package by ID
   * @param id - Package ID
   * @returns Promise with package data
   */
  async getPackageById(id: number): Promise<Package> {
    try {
      const response = await apiClient.get(`/packages/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new package
   * @param packageData - Package data
   * @returns Promise with created package
   */
  async createPackage(packageData: CreatePackageRequest): Promise<Package> {
    try {
      const response = await apiClient.post('/packages', packageData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update package
   * @param id - Package ID
   * @param packageData - Updated package data
   * @returns Promise with updated package
   */
  async updatePackage(id: number, packageData: UpdatePackageRequest): Promise<Package> {
    try {
      const response = await apiClient.put(`/packages/${id}`, packageData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete package
   * @param id - Package ID
   * @returns Promise with deletion result
   */
  async deletePackage(id: number): Promise<void> {
    try {
      await apiClient.delete(`/packages/${id}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get package categories
   * @returns Promise with categories list
   */
  async getCategories(): Promise<PackageCategory[]> {
    try {
      const response = await apiClient.get('/packages/meta/categories');
      return response.data || ['tour', 'accommodation', 'transport', 'activity', 'other'];
    } catch (error) {
      // Return default categories if API fails
      return ['tour', 'accommodation', 'transport', 'activity', 'other'];
    }
  }

  /**
   * Get package types
   * @returns Promise with types list
   */
  async getTypes(): Promise<PackageType[]> {
    try {
      const response = await apiClient.get('/packages/meta/types');
      return response.data || ['adventure', 'cultural', 'relaxation', 'business', 'family', 'other'];
    } catch (error) {
      // Return default types if API fails
      return ['adventure', 'cultural', 'relaxation', 'business', 'family', 'other'];
    }
  }

  /**
   * Search packages by name or description
   * @param query - Search query
   * @param filters - Additional filters
   * @returns Promise with search results
   */
  async searchPackages(query: string, filters: Omit<PackageFilters, 'search'> = {}): Promise<PackageListResponse> {
    return this.getPackages({ ...filters, search: query });
  }

  /**
   * Get packages by category
   * @param category - Package category
   * @param filters - Additional filters
   * @returns Promise with filtered packages
   */
  async getPackagesByCategory(category: PackageCategory, filters: Omit<PackageFilters, 'category'> = {}): Promise<PackageListResponse> {
    return this.getPackages({ ...filters, category });
  }

  /**
   * Get packages by type
   * @param type - Package type
   * @param filters - Additional filters
   * @returns Promise with filtered packages
   */
  async getPackagesByType(type: PackageType, filters: Omit<PackageFilters, 'type'> = {}): Promise<PackageListResponse> {
    return this.getPackages({ ...filters, type });
  }

  /**
   * Get packages within cost range
   * @param minCost - Minimum cost per pax
   * @param maxCost - Maximum cost per pax
   * @param filters - Additional filters
   * @returns Promise with filtered packages
   */
  async getPackagesByCostRange(
    minCost: number,
    maxCost: number,
    filters: Omit<PackageFilters, 'min_cost' | 'max_cost'> = {}
  ): Promise<PackageListResponse> {
    return this.getPackages({ ...filters, min_cost: minCost, max_cost: maxCost });
  }
}

export default new PackageService();
