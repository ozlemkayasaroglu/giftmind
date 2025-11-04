// Railway API Client for GiftMind
// Backend deployment: https://giftmind-be-production.up.railway.app

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://giftmind-be-production.up.railway.app';

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

interface PersonaCamel {
  id?: string;
  userId?: string;
  name: string;
  description?: string;
  role?: string;
  goal?: string;
  challenge?: string;
  birthDate?: string;
  interests?: string[];
  personalityTraits?: string[];
  interestsRaw?: string;
  ageMin?: number;
  ageMax?: number;
  budgetMin?: number;
  budgetMax?: number;
  behavioralInsights?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

interface PersonaSnake {
  id?: string;
  user_id?: string;
  name: string;
  description?: string;
  role?: string;
  goal?: string;
  challenge?: string;
  birth_date?: string;
  interests?: string[];
  personality_traits?: string[];
  interests_raw?: string;
  age_min?: number;
  age_max?: number;
  budget_min?: number;
  budget_max?: number;
  behavioral_insights?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

interface Milestone {
  id: string;
  persona_id: string;
  user_id: string;
  title: string;
  details?: string;
  category?: string;
  tags?: string[];
  occurred_at?: string; // ISO date
  created_at?: string;
  updated_at?: string;
}

interface PersonaEventSnake {
  id: string;
  persona_id: string;
  user_id?: string;
  title: string;
  details?: string;
  category?: string;
  type?: string;
  tags?: string[];
  occurred_at?: string; // ISO date
  created_at?: string;
  updated_at?: string;
}

interface PersonaEventCamel {
  id: string;
  personaId: string;
  userId?: string;
  title: string;
  details?: string;
  category: string;
  type?: string;
  tags?: string[];
  occurredAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

const snakeToCamelPersona = (p: any): PersonaCamel => {
  if (!p || typeof p !== 'object') return p;
  return {
    id: p.id,
    userId: p.user_id,
    name: p.name,
    description: p.description,
    role: p.role,
    goal: p.goal,
    challenge: p.challenge,
    birthDate: p.birth_date || p.birthDate,
    interests: p.interests,
    personalityTraits: p.personality_traits || p.personalityTraits,
    interestsRaw: p.interests_raw ?? p.interestsRaw,
    ageMin: p.age_min ?? p.ageMin,
    ageMax: p.age_max ?? p.ageMax,
    budgetMin: p.budget_min ?? p.budgetMin,
    budgetMax: p.budget_max ?? p.budgetMax,
    behavioralInsights: p.behavioral_insights ?? p.behavioralInsights ?? p.insights,
    notes: p.notes,
    createdAt: p.created_at ?? p.createdAt,
    updatedAt: p.updated_at ?? p.updatedAt,
    ...p,
  };
};

const camelToSnakePersona = (p: Partial<PersonaCamel>): PersonaSnake => ({
  id: p.id,
  user_id: p.userId,
  name: p.name || '',
  description: p.description,
  role: p.role,
  goal: p.goal,
  challenge: p.challenge,
  birth_date: p.birthDate,
  interests: p.interests,
  personality_traits: p.personalityTraits,
  interests_raw: (p as any).interestsRaw ?? (p as any).interests_raw,
  age_min: p.ageMin,
  age_max: p.ageMax,
  budget_min: p.budgetMin,
  budget_max: p.budgetMax,
  behavioral_insights: p.behavioralInsights ?? (p as any).insights,
  notes: p.notes,
  created_at: p.createdAt,
  updated_at: p.updatedAt,
});

const snakeToCamelEvent = (e: PersonaEventSnake): PersonaEventCamel => {
  const out: PersonaEventCamel = {
    id: e.id,
    personaId: e.persona_id,
    userId: e.user_id,
    title: e.title,
  } as PersonaEventCamel;
  if (e.details !== undefined) out.details = e.details;
  if (e.category !== undefined) out.category = e.category as string;
  if (e.type !== undefined) out.type = e.type as string;
  if (e.tags !== undefined) out.tags = e.tags;
  if (e.occurred_at !== undefined) out.occurredAt = e.occurred_at;
  if (e.created_at !== undefined) out.createdAt = e.created_at;
  if (e.updated_at !== undefined) out.updatedAt = e.updated_at;
  return out;
};

class RailwayAPI {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    // Read any existing token from either key
    this.token =
      localStorage.getItem('railway_token') ||
      localStorage.getItem('authToken') ||
      null;
  }

  // Helper to always get the freshest token (in case another client set it)
  getToken(): string | null {
    const latest =
      this.token ||
      localStorage.getItem('railway_token') ||
      localStorage.getItem('authToken');
    if (latest && latest !== this.token) {
      this.token = latest;
    }
    return latest || null;
  }

  // Set authentication token and persist under both keys for compatibility
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('railway_token', token);
    localStorage.setItem('authToken', token);
  }

  // Clear authentication token from both keys
  clearToken() {
    this.token = null;
    localStorage.removeItem('railway_token');
    localStorage.removeItem('authToken');
  }

  // Helper method for API calls
  private async apiCall<T = any>(
    method: string,
    endpoint: string,
    data: any = null
  ): Promise<ApiResponse<T>> {
    // Ensure we use the latest token before each call
    const currentToken = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }

    console.log(`🌐 API Call: ${method} ${endpoint}`);
    console.log('📤 Headers:', { ...headers, Authorization: headers['Authorization'] ? 'Bearer ***' : undefined });
    if (data) console.log('📤 Data:', data);

    const config: RequestInit = {
      method,
      headers,
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      console.log(`📥 Response status: ${response.status}`);
      console.log(`📥 Full URL: ${this.baseURL}${endpoint}`);

      // Get raw response text first
      const responseText = await response.text();
      console.log('📥 Raw response:', responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''));

      // Try to parse as JSON
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('📥 Parsed JSON:', result);
      } catch (parseError) {
        console.error('🚨 JSON Parse Error:', parseError);
        console.log('📄 Response appears to be HTML/Text, not JSON');
        throw new Error(`Server returned non-JSON response: ${responseText.substring(0, 100)}...`);
      }

      if (!response.ok) {
        throw new Error(result.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return {
        success: true,
        ...result,
      };
    } catch (error: any) {
      console.error('🚨 Railway API Error:', error);
      return {
        success: false,
        error: error.message || 'API request failed',
      };
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    return this.apiCall('GET', '/health');
  }

  // Get current user
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return await this.apiCall<User>('GET', '/api/users/me');
  }

  // Authentication methods
  async signUp(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.apiCall('POST', '/api/register', userData);

    const token = response.token || response.session?.accessToken;
    if ((response as any).success && token) {
      this.setToken(token);
    }

    return response;
  }

  async signIn(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.apiCall('POST', '/api/login', credentials);

    const token = response.token || response.session?.accessToken;
    if ((response as any).success && token) {
      this.setToken(token);
    }

    return response;
  }

  async signOut(): Promise<ApiResponse> {
    const response = await this.apiCall('POST', '/api/logout');
    this.clearToken();
    return response;
  }

  // Request password reset email
  async requestPasswordReset(email: string): Promise<ApiResponse<{ message?: string }>> {
    return this.apiCall('POST', '/api/password/forgot', { email });
  }

  // Backward-compat auth wrappers (used by httpClient)
  login(email: string, password: string) {
    return this.signIn({ email, password });
  }
  register(email: string, password: string, firstName?: string, lastName?: string) {
    return this.signUp({ email, password, firstName, lastName });
  }
  logout() {
    return this.signOut();
  }

  // Personas
  async getPersonas(): Promise<ApiResponse<PersonaCamel[]>> {
    const res = await this.apiCall<any>('GET', '/api/personas');
    if (!res.success) return res as ApiResponse<PersonaCamel[]>;
    const raw = (res as any).data ?? (res as any).personas ?? (res as any).items ?? [];
    const data = Array.isArray(raw) ? raw.map(snakeToCamelPersona) : [];
    return { success: true, data };
  }

  async getPersona(id: string): Promise<ApiResponse<PersonaCamel>> {
    const res = await this.apiCall<any>('GET', `/api/personas/${id}`);
    if (!res.success) return res as ApiResponse<PersonaCamel>;
    const raw = (res as any).data ?? (res as any).persona ?? res;
    const data = snakeToCamelPersona(raw);
    return { success: true, data };
  }

  async createPersona(personaData: Partial<PersonaCamel>): Promise<ApiResponse<PersonaCamel>> {
    const payload = camelToSnakePersona(personaData);
    const res = await this.apiCall<any>('POST', '/api/personas', payload);
    if (!res.success) return res as ApiResponse<PersonaCamel>;
    const raw = (res as any).data ?? (res as any).persona ?? res;
    const data = snakeToCamelPersona(raw);
    return { success: true, data };
  }

  async updatePersona(id: string, personaData: Partial<PersonaCamel>): Promise<ApiResponse<PersonaCamel>> {
    const payload = camelToSnakePersona(personaData);
    const res = await this.apiCall<any>('PUT', `/api/personas/${id}`, payload);
    if (!res.success) return res as ApiResponse<PersonaCamel>;
    const raw = (res as any).data ?? (res as any).persona ?? res;
    const data = snakeToCamelPersona(raw);
    return { success: true, data };
  }

  async deletePersona(id: string): Promise<ApiResponse> {
    return await this.apiCall('DELETE', `/api/personas/${id}`);
  }

  // Gift recommendations (extended with context)
  async getGiftRecommendations(personaId: string, context?: {
    preferences?: string[];
    behavioralInsights?: string;
    events?: Array<Partial<PersonaEventCamel>>;
  }): Promise<ApiResponse<any[]>> {
    const body = { personaId, ...context };
    const res = await this.apiCall<any>('POST', `/api/gift/recommend`, body);
    if (!res.success) return res as ApiResponse<any[]>;
    const data = (res as any).data ?? (res as any).suggestions ?? (res as any).recommendations ?? [];
    return { success: true, data };
  }

  // Milestones
  async getPersonaMilestones(personaId: string): Promise<ApiResponse<Milestone[]>> {
    const res = await this.apiCall<any>('GET', `/api/personas/${personaId}/milestones`);
    if (!res.success) return res as ApiResponse<Milestone[]>;
    const data = (res as any).data ?? (res as any).milestones ?? [];
    return { success: true, data };
  }

  async createPersonaMilestone(personaId: string, payload: {
    title: string;
    details?: string;
    category?: string;
    tags?: string[];
    occurred_at?: string; // YYYY-MM-DD
  }): Promise<ApiResponse<Milestone>> {
    const res = await this.apiCall<any>('POST', `/api/personas/${personaId}/milestones`, payload);
    if (!res.success) return res as ApiResponse<Milestone>;
    const data = (res as any).data ?? (res as any).milestone ?? res;
    return { success: true, data };
  }

  async deleteMilestone(milestoneId: string): Promise<ApiResponse> {
    return this.apiCall('DELETE', `/api/persona-milestones/${milestoneId}`);
  }

  // Events
  async getPersonaEvents(personaId: string): Promise<ApiResponse<PersonaEventCamel[]>> {
    const res = await this.apiCall<any>('GET', `/api/personas/${personaId}/events`);
    if (!res.success) return res as ApiResponse<PersonaEventCamel[]>;
    const raw = (res as any).data ?? (res as any).events ?? [];
    const data = Array.isArray(raw) ? raw.map(snakeToCamelEvent) : [];
    return { success: true, data };
  }

  async createPersonaEvent(personaId: string, payload: {
    title: string;
    details?: string;
    category?: string;
    type?: string;
    tags?: string[];
    occurred_at?: string; // YYYY-MM-DD
  }): Promise<ApiResponse<PersonaEventCamel>> {
    const res = await this.apiCall<any>('POST', `/api/personas/${personaId}/events`, payload);
    if (!res.success) return res as ApiResponse<PersonaEventCamel>;
    const raw = (res as any).data ?? (res as any).event ?? res;
    const data = snakeToCamelEvent(raw);
    return { success: true, data };
  }

  async updateEvent(eventId: string, payload: Partial<{
    title: string;
    details?: string;
    category?: string;
    type?: string;
    tags?: string[];
    occurred_at?: string;
  }>): Promise<ApiResponse<PersonaEventCamel>> {
    const res = await this.apiCall<any>('PUT', `/api/events/${eventId}`, payload);
    if (!res.success) return res as ApiResponse<PersonaEventCamel>;
    const raw = (res as any).data ?? (res as any).event ?? res;
    const data = snakeToCamelEvent(raw);
    return { success: true, data };
  }

  async deleteEvent(eventId: string): Promise<ApiResponse> {
    return this.apiCall('DELETE', `/api/events/${eventId}`);
  }

  // Optional stubs for future endpoints
  async searchGifts(_query: string, _filters?: any): Promise<ApiResponse<any>> {
    return { success: false, error: 'Not implemented' } as any;
  }

  async getGiftCategories(): Promise<ApiResponse<any>> {
    return { success: false, error: 'Not implemented' } as any;
  }

  async getUserPreferences(): Promise<ApiResponse<any>> {
    return { success: false, error: 'Not implemented' } as any;
  }

  async updateUserPreferences(_preferences: any): Promise<ApiResponse<any>> {
    return { success: false, error: 'Not implemented' } as any;
  }
}

// Export singleton instance
export const railwayApi = new RailwayAPI();
export default railwayApi;