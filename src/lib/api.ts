// API Base Configuration - Railway Backend
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://giftmind-be-production.up.railway.app";

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
      GOOGLE: `${API_BASE_URL}/api/auth/oauth/google`,
      CALLBACK: `${API_BASE_URL}/api/auth/oauth/callback`,
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
    RECOMMENDATIONS: (id: string) => `${API_BASE_URL}/api/persona/${id}/gift-ideas`,
    SEARCH: `${API_BASE_URL}/api/gifts/search`,
    CATEGORIES: `${API_BASE_URL}/api/gift/categories`,
  },

  // User Preferences
  PREFERENCES: {
    GET: `${API_BASE_URL}/api/preferences`,
    UPDATE: `${API_BASE_URL}/api/preferences`,
  },
};

// HTTP Client Configuration
export const apiConfig = {
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

// HTTP Client yardımcı fonksiyonu
export const fetchAPI = async (url: string, options: RequestInit = {}) => {
  // Check for token in all possible locations
  const token = 
    localStorage.getItem("railway_token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("supabase.auth.token") ||
    localStorage.getItem("token") ||
    '';

  if (!token) {
    console.error("No authorization token found in localStorage");
    throw new Error("No authorization token provided");
  }

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Gift API fonksiyonları
export const giftAPI = {
  getRecommendations: async (personaId: string) => {
    // POST request ile doğru endpoint
    return await fetchAPI(API_ENDPOINTS.GIFTS.RECOMMENDATIONS(personaId), {
      method: "POST", // ✅ POST method ekle
    });
  },

  searchGifts: async (query: string, filters?: any) => {
    return await fetchAPI(API_ENDPOINTS.GIFTS.SEARCH, {
      method: "POST",
      body: JSON.stringify({ query, filters }),
    });
  },

  getCategories: async () => {
    return await fetchAPI(API_ENDPOINTS.GIFTS.CATEGORIES);
  },
};
