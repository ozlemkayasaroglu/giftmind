import { railwayApi } from './railwayApi';
import { apiConfig } from './api';
import { mockApi } from './mockData';

// Environment check for using mock data
const USE_MOCK_DATA = false; // Railway API is deployed, use real API

// HTTP Client Class - Updated for Railway
class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://giftmind-be-production.up.railway.app';
    this.timeout = apiConfig.timeout;
  }

  // Get authorization headers
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = railwayApi.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data: T | null; error: any }> {
    try {
      const headers = await this.getAuthHeaders();
      
      const config: RequestInit = {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
        signal: AbortSignal.timeout(this.timeout),
      };

      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      console.error('API Request Error:', error);
      return { 
        data: null, 
        error: { 
          message: error.message || 'Network error occurred',
          status: error.status || 500 
        } 
      };
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<{ data: T | null; error: any }> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, body?: any): Promise<{ data: T | null; error: any }> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, body?: any): Promise<{ data: T | null; error: any }> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<{ data: T | null; error: any }> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create and export API client instance
export const apiClient = new ApiClient();

// API Service Functions
export const api = {
  // Health Check
  health: {
    check: () => {
      if (USE_MOCK_DATA) {
        return Promise.resolve({ data: { status: 'ok', message: 'Mock API is running' }, error: null });
      }
      return railwayApi.healthCheck().then(result => ({ 
        data: result.success ? { status: 'ok', message: result.message } : null, 
        error: result.success ? null : { message: result.error }
      }));
    },
  },

  // Authentication - Now using Railway API directly
  auth: {
    login: (email: string, password: string) => {
      if (USE_MOCK_DATA) {
        return mockApi.auth.login(email, password);
      }
      return railwayApi.login(email, password).then(result => ({
        data: result.success ? result : null,
        error: result.success ? null : { message: result.error }
      }));
    },
    
    register: (email: string, password: string, firstName?: string, lastName?: string) => {
      if (USE_MOCK_DATA) {
        return mockApi.auth.login(email, password); // Mock doesn't differentiate
      }
      return railwayApi.register(email, password, firstName, lastName).then(result => ({
        data: result.success ? result : null,
        error: result.success ? null : { message: result.error }
      }));
    },
    
    logout: () => {
      if (USE_MOCK_DATA) {
        return Promise.resolve({ data: null, error: null });
      }
      return railwayApi.logout().then(result => ({
        data: result.success ? result : null,
        error: result.success ? null : { message: result.error }
      }));
    },
    
    getProfile: () => {
      if (USE_MOCK_DATA) {
        return Promise.resolve({ data: null, error: null });
      }
      return railwayApi.getCurrentUser().then(result => ({
        data: result.success ? result.user : null,
        error: result.success ? null : { message: result.error }
      }));
    },

    // Request password reset email
    requestPasswordReset: (email: string) => {
      return railwayApi.requestPasswordReset(email).then(result => ({
        data: result.success ? { message: result.message || 'Reset email sent' } : null,
        error: result.success ? null : { message: result.error }
      }));
    },
  },

  // Personas - Now using Railway API directly
  personas: {
    list: () => {
      if (USE_MOCK_DATA) {
        return mockApi.personas.list();
      }
      return railwayApi.getPersonas().then(result => ({
        data: result.success ? result.data : null,
        error: result.success ? null : { message: result.error }
      }));
    },
    
    create: (persona: any) => {
      if (USE_MOCK_DATA) {
        return mockApi.personas.create(persona);
      }
      return railwayApi.createPersona(persona).then(result => ({
        data: result.success ? result.data : null,
        error: result.success ? null : { message: result.error }
      }));
    },
    
    get: (id: string) => {
      if (USE_MOCK_DATA) {
        return mockApi.personas.get(id);
      }
      return railwayApi.getPersona(id).then(result => ({
        data: result.success ? result.data : null,
        error: result.success ? null : { message: result.error }
      }));
    },
    
    update: (id: string, persona: any) => {
      if (USE_MOCK_DATA) {
        return mockApi.personas.update(id, persona);
      }
      return railwayApi.updatePersona(id, persona).then(result => ({
        data: result.success ? result.data : null,
        error: result.success ? null : { message: result.error }
      }));
    },
    
    delete: (id: string) => {
      if (USE_MOCK_DATA) {
        return mockApi.personas.delete(id);
      }
      return railwayApi.deletePersona(id).then(result => ({
        data: result.success ? result : null,
        error: result.success ? null : { message: result.error }
      }));
    },
  },

  // Gift Recommendations - Now using Railway API directly
  gifts: {
    getRecommendations: async (personaId: string, context?: any) => {
      if (USE_MOCK_DATA) return mockApi.gifts.getRecommendations(personaId)
      // Forward context to the lower-level railway API so backend can use persona context (preferences, events, behavioralInsights)
      return railwayApi.getGiftRecommendations(personaId, context).then((r) => ({ data: r.data, error: r.error }))
    },
    
    search: (query: string, filters?: any) => {
      if (USE_MOCK_DATA) {
        return mockApi.gifts.search(query, filters);
      }
      return railwayApi.searchGifts(query, filters).then(result => ({
        data: result.success ? result.data : null,
        error: result.success ? null : { message: result.error }
      }));
    },
    
    getCategories: () => {
      if (USE_MOCK_DATA) {
        return mockApi.gifts.getCategories();
      }
      return railwayApi.getGiftCategories().then(result => ({
        data: result.success ? result.data : null,
        error: result.success ? null : { message: result.error }
      }));
    },
  },

  // User Preferences - Now using Railway API directly
  preferences: {
    get: () => {
      if (USE_MOCK_DATA) {
        return Promise.resolve({ data: null, error: null });
      }
      return railwayApi.getUserPreferences().then(result => ({
        data: result.success ? result.data : null,
        error: result.success ? null : { message: result.error }
      }));
    },
    
    update: (preferences: any) => {
      if (USE_MOCK_DATA) {
        return Promise.resolve({ data: preferences, error: null });
      }
      return railwayApi.updateUserPreferences(preferences).then(result => ({
        data: result.success ? result.data : null,
        error: result.success ? null : { message: result.error }
      }));
    },
  },

  // Milestones - Now using Railway API directly
  milestones: {
    list: (personaId: string) =>
      railwayApi.getPersonaMilestones(personaId).then(result => ({
        data: result.success ? result.data : null,
        error: result.success ? null : { message: result.error }
      })),
    create: (personaId: string, payload: { title: string; details?: string; category?: string; tags?: string[]; occurred_at?: string; }) =>
      railwayApi.createPersonaMilestone(personaId, payload).then(result => ({
        data: result.success ? result.data : null,
        error: result.success ? null : { message: result.error }
      })),
    delete: (milestoneId: string) =>
      railwayApi.deleteMilestone(milestoneId).then(result => ({
        data: result.success ? result : null,
        error: result.success ? null : { message: result.error }
      })),
  },

  // Events - Now using Railway API directly
  events: {
    list: (personaId: string) =>
      railwayApi.getPersonaEvents(personaId).then(result => ({
        data: result.success ? result.data : null,
        error: result.success ? null : { message: result.error }
      })),
    create: (personaId: string, payload: { title: string; details?: string; category?: string; type?: string; tags?: string[]; occurred_at?: string; }) =>
      railwayApi.createPersonaEvent(personaId, payload).then(result => ({
        data: result.success ? result.data : null,
        error: result.success ? null : { message: result.error }
      })),
    update: (eventId: string, payload: Partial<{ title: string; details?: string; category?: string; type?: string; tags?: string[]; occurred_at?: string; }>) =>
      railwayApi.updateEvent(eventId, payload).then(result => ({
        data: result.success ? result.data : null,
        error: result.success ? null : { message: result.error }
      })),
    delete: (eventId: string) =>
      railwayApi.deleteEvent(eventId).then(result => ({
        data: result.success ? result : null,
        error: result.success ? null : { message: result.error }
      })),
  },

};
