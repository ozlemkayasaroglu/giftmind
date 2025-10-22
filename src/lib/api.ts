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
