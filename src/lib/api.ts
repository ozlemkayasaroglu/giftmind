// API Base Configuration - Railway Backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://giftmind-be-production.up.railway.app';

// API Endpoints
export const API_ENDPOINTS = {
  // Health check
  HEALTH: `${API_BASE_URL}/health`,
  
  // Authentication
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/login`,
    REGISTER: `${API_BASE_URL}/api/register`,
    LOGOUT: `${API_BASE_URL}/api/logout`,
    PROFILE: `${API_BASE_URL}/api/user`,
    REFRESH: `${API_BASE_URL}/api/auth/refresh`,
    OAUTH: {
      GOOGLE: `${API_BASE_URL}/api/oauth`,
      CALLBACK: `${API_BASE_URL}/api/oauth/callback`,
    },
  },
  
  // Personas
  PERSONAS: {
    LIST: `${API_BASE_URL}/api/personas`,
    CREATE: `${API_BASE_URL}/api/personas`,
    GET: (id: string) => `${API_BASE_URL}/api/personas/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/api/personas/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/api/personas/${id}`,
  },
  
  // Gift Recommendations
  GIFTS: {
    RECOMMENDATIONS: (personaId: string) => `${API_BASE_URL}/api/personas/${personaId}/recommendations`,
    SEARCH: `${API_BASE_URL}/api/gifts/search`,
    CATEGORIES: `${API_BASE_URL}/api/gifts/categories`,
  },
  
  // User Preferences
  PREFERENCES: {
    GET: `${API_BASE_URL}/api/preferences`,
    UPDATE: `${API_BASE_URL}/api/preferences`,
  }
};

// HTTP Client Configuration
export const apiConfig = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Gift API Service
export const giftAPI = {
  getRecommendations: async (personaId: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.GIFTS.RECOMMENDATIONS(personaId), {
        method: 'GET',
        headers: {
          ...apiConfig.headers,
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch gift recommendations');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching gift recommendations:', error);
      throw error;
    }
  },

  searchGifts: async (query: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.GIFTS.SEARCH}?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          ...apiConfig.headers,
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to search gifts');
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching gifts:', error);
      throw error;
    }
  },

  getCategories: async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GIFTS.CATEGORIES, {
        method: 'GET',
        headers: {
          ...apiConfig.headers,
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch gift categories');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching gift categories:', error);
      throw error;
    }
  }
};
