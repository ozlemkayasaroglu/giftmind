// Railway API Client for GiftMind
// Backend deployment: https://giftmind-be-production.up.railway.app

const API_BASE_URL = 'https://giftmind-be-production.up.railway.app';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  user?: any;
  token?: string;
  session?: {
    accessToken?: string;
  };
  message?: string;
  error?: string;
}

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

class RailwayAPI {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken') || null;
  }

  // Helper method for API calls
  private async apiCall<T = any>(
    method: string, 
    endpoint: string, 
    data: any = null
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return {
        success: true,
        ...result
      };
    } catch (error: any) {
      console.error('Railway API Error:', error);
      return {
        success: false,
        error: error.message || 'API request failed'
      };
    }
  }

  // 1. Register new user
  async register(email: string, password: string, firstName?: string, lastName?: string): Promise<ApiResponse<User>> {
    try {
      const result = await this.apiCall('POST', '/api/register', {
        email,
        password,
        firstName,
        lastName
      });

      // Save token if provided
      if (result.token) {
        this.token = result.token;
        localStorage.setItem('authToken', this.token);
      } else if (result.session?.accessToken) {
        this.token = result.session.accessToken;
        if (this.token) {
          localStorage.setItem('authToken', this.token);
        }
      }

      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 2. Login user
  async login(email: string, password: string): Promise<ApiResponse<User>> {
    try {
      const result = await this.apiCall('POST', '/api/login', {
        email,
        password
      });

      // Save token
      if (result.token) {
        this.token = result.token;
        localStorage.setItem('authToken', this.token);
      }

      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 3. Get current user info
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const result = await this.apiCall('GET', '/api/user');
      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 4. Logout user
  async logout(): Promise<ApiResponse> {
    try {
      await this.apiCall('POST', '/api/logout');
      
      // Clear token
      this.token = null;
      localStorage.removeItem('authToken');

      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error: any) {
      // Clear token even if API call fails
      this.token = null;
      localStorage.removeItem('authToken');
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 5. Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // 6. Clear authentication
  clearAuth(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // 7. Get authentication token
  getToken(): string | null {
    return this.token;
  }

  // 8. Set authentication token
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // === PERSONA MANAGEMENT ===

  // Get all personas for the current user
  async getPersonas(): Promise<ApiResponse<any[]>> {
    try {
      const result = await this.apiCall('GET', '/api/personas');
      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create a new persona
  async createPersona(persona: any): Promise<ApiResponse<any>> {
    try {
      const result = await this.apiCall('POST', '/api/personas', persona);
      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get a specific persona by ID
  async getPersona(id: string): Promise<ApiResponse<any>> {
    try {
      const result = await this.apiCall('GET', `/api/personas/${id}`);
      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update a persona
  async updatePersona(id: string, persona: any): Promise<ApiResponse<any>> {
    try {
      const result = await this.apiCall('PUT', `/api/personas/${id}`, persona);
      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete a persona
  async deletePersona(id: string): Promise<ApiResponse> {
    try {
      const result = await this.apiCall('DELETE', `/api/personas/${id}`);
      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // === GIFT RECOMMENDATIONS ===

  // Get gift recommendations for a persona
  async getGiftRecommendations(personaId: string): Promise<ApiResponse<any[]>> {
    try {
      const result = await this.apiCall('GET', `/api/personas/${personaId}/recommendations`);
      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Search for gifts
  async searchGifts(query: string, filters?: any): Promise<ApiResponse<any[]>> {
    try {
      const result = await this.apiCall('POST', '/api/gifts/search', { query, filters });
      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get gift categories
  async getGiftCategories(): Promise<ApiResponse<any[]>> {
    try {
      const result = await this.apiCall('GET', '/api/gifts/categories');
      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // === USER PREFERENCES ===

  // Get user preferences
  async getUserPreferences(): Promise<ApiResponse<any>> {
    try {
      const result = await this.apiCall('GET', '/api/preferences');
      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update user preferences
  async updateUserPreferences(preferences: any): Promise<ApiResponse<any>> {
    try {
      const result = await this.apiCall('PUT', '/api/preferences', preferences);
      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // === HEALTH CHECK ===

  // Check API health
  async healthCheck(): Promise<ApiResponse> {
    try {
      const result = await this.apiCall('GET', '/health');
      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
export const railwayApi = new RailwayAPI();

// Export the class for custom instances
export default RailwayAPI;

// Export types
export type { ApiResponse, User };
