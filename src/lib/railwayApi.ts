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
  goals?: string; // compat
  challenges?: string; // compat
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
  notesText?: string; // compat
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
  goals?: string;
  challenges?: string;
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
  notes_text?: string;
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
  category?: string;
  type?: string;
  tags?: string[];
  occurredAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Convert camelCase persona into snake_case for API/DB
const camelToSnakePersona = (p: Partial<PersonaCamel>): PersonaSnake => ({
  id: p.id,
  user_id: p.userId ?? (p as any).user_id,
  name: p.name || (p as any).name || '',
  description: p.description ?? (p as any).description,
  role: p.role ?? (p as any).role,
  goals: (p as any).goals ?? p.goal,
  challenges: (p as any).challenges ?? p.challenge,
  birth_date: p.birthDate ?? (p as any).birth_date,
  interests: p.interests ?? (p as any).interests,
  personality_traits: p.personalityTraits ?? (p as any).personality_traits,
  interests_raw: p.interestsRaw ?? (p as any).interests_raw,
  age_min: p.ageMin ?? (p as any).age_min,
  age_max: p.ageMax ?? (p as any).age_max,
  budget_min: p.budgetMin ?? (p as any).budget_min,
  budget_max: p.budgetMax ?? (p as any).budget_max,
  behavioral_insights: p.behavioralInsights ?? (p as any).behavioral_insights ?? (p as any).insights,
  notes_text: p.notesText ?? (p as any).notes_text ?? p.notes,
  created_at: p.createdAt ?? (p as any).created_at,
  updated_at: p.updatedAt ?? (p as any).updated_at,
});

// Convert snake_case event to camelCase for UI
const snakeToCamelEvent = (e: PersonaEventSnake): PersonaEventCamel => {
  const out: PersonaEventCamel = {
    id: e.id,
    personaId: e.persona_id,
    userId: e.user_id,
    title: e.title,
  };
  if (e.details !== undefined) out.details = e.details;
  if (e.category !== undefined) out.category = e.category as string;
  if (e.type !== undefined) out.type = e.type as string;
  if (e.tags !== undefined) out.tags = e.tags;
  if (e.occurred_at !== undefined) out.occurredAt = e.occurred_at;
  if (e.created_at !== undefined) out.createdAt = e.created_at;
  if (e.updated_at !== undefined) out.updatedAt = e.updated_at;
  return out;
};

const normalizeNotesToString = (notes: any, notesText?: any): string | undefined => {
  if (typeof notesText === 'string') return notesText;
  if (typeof notes === 'string') {
    // Handle JSON-like empty array string
    if (notes.trim() === '[]' || notes.trim() === '[\"\"]') return undefined;
    return notes;
  }
  if (Array.isArray(notes)) {
    const strings = notes.filter((x) => typeof x === 'string') as string[];
    if (!strings.length) return undefined;
    const joined = strings.join('\n');
    if (joined.trim() === '[]') return undefined;
    return joined;
  }
  return undefined;
};

const snakeToCamelPersona = (p: any): PersonaCamel => {
  if (!p || typeof p !== 'object') return p;
  return {
    // Spread first so mapped fields below always win
    ...p,
    id: p.id,
    userId: p.user_id,
    name: p.name,
    description: p.description,
    role: p.role,
    // Read from both variants; prefer pluralized columns
    goal: p.goals ?? p.goal,
    goals: p.goals ?? p.goal,
    challenge: p.challenges ?? p.challenge,
    challenges: p.challenges ?? p.challenge,
    birthDate: p.birth_date || p.birthDate,
    interests: p.interests,
    personalityTraits: p.personality_traits || p.personalityTraits,
    interestsRaw: p.interests_raw ?? p.interestsRaw,
    ageMin: p.age_min ?? p.ageMin,
    ageMax: p.age_max ?? p.ageMax,
    budgetMin: p.budget_min ?? p.budgetMin,
    budgetMax: p.budget_max ?? p.budgetMax,
    behavioralInsights: p.behavioral_insights ?? p.behavioralInsights ?? p.insights,
    // Prefer notes_text; fallback to notes, normalize arrays like ["[]"]
    notes: normalizeNotesToString(p.notes, p.notes_text),
    notesText: p.notes_text ?? normalizeNotesToString(p.notes, p.notes_text),
    createdAt: p.created_at ?? p.createdAt,
    updatedAt: p.updated_at ?? p.updatedAt,
  };
};

// Helper to decide if a value is absent/nullish
const isPresent = (v: any) => v !== undefined && v !== null && !(typeof v === 'string' && v.trim() === '');

// Build patch from requested camel payload when server returns nulls
const buildPatchFromRequested = (returned: PersonaCamel, requested: Partial<PersonaCamel>): Partial<PersonaCamel> => {
  const patch: Partial<PersonaCamel> = {};
  const keys: Array<keyof PersonaCamel> = [
    'role', 'goals', 'goal', 'challenges', 'challenge', 'interests', 'personalityTraits',
    'interestsRaw', 'ageMin', 'ageMax', 'budgetMin', 'budgetMax', 'behavioralInsights',
    'notesText', 'description', 'birthDate'
  ];
  for (const k of keys) {
    const retVal = (returned as any)[k];
    const reqVal = (requested as any)[k];
    if (!isPresent(retVal) && isPresent(reqVal)) {
      (patch as any)[k] = reqVal;
    }
  }
  return patch;
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
    let data = snakeToCamelPersona(raw);

    // Self-heal: if server responded with nulls, patch them using requested values
    if (data?.id) {
      const patch = buildPatchFromRequested(data, personaData);
      if (Object.keys(patch).length > 0) {
        try {
          const updatePayload = camelToSnakePersona(patch);
          const res2 = await this.apiCall<any>('PUT', `/api/personas/${data.id}`, updatePayload);
          if (res2.success) {
            const raw2 = (res2 as any).data ?? (res2 as any).persona ?? res2;
            const fixed = snakeToCamelPersona(raw2);
            data = { ...data, ...fixed };
          } else {
            // merge requested patch locally so UI doesn't see nulls
            data = { ...data, ...patch } as PersonaCamel;
          }
        } catch {
          data = { ...data, ...patch } as PersonaCamel;
        }
      }
    }

    return { success: true, data };
  }

  async updatePersona(id: string, personaData: Partial<PersonaCamel>): Promise<ApiResponse<PersonaCamel>> {
    const payload = camelToSnakePersona(personaData);
    const res = await this.apiCall<any>('PUT', `/api/personas/${id}`, payload);
    if (!res.success) return res as ApiResponse<PersonaCamel>;
    const raw = (res as any).data ?? (res as any).persona ?? res;
    let data = snakeToCamelPersona(raw);

    // Self-heal similarly after update
    const patch = buildPatchFromRequested(data, personaData);
    if (Object.keys(patch).length > 0) {
      try {
        const updatePayload = camelToSnakePersona(patch);
        const res2 = await this.apiCall<any>('PUT', `/api/personas/${id}`, updatePayload);
        if (res2.success) {
          const raw2 = (res2 as any).data ?? (res2 as any).persona ?? res2;
          const fixed = snakeToCamelPersona(raw2);
          data = { ...data, ...fixed };
        } else {
          data = { ...data, ...patch } as PersonaCamel;
        }
      } catch {
        data = { ...data, ...patch } as PersonaCamel;
      }
    }

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

  // Helper function to convert file to base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  // Avatar endpoints
  async uploadPersonaAvatar(personaId: string, file: File): Promise<ApiResponse<{ avatar_url: string }>> {
    const token = this.getToken();
    
    try {
      // Convert file to base64
      const base64Data = await this.fileToBase64(file);
      
      const res = await fetch(`${this.baseURL}/api/personas/${personaId}/avatar-basic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          avatar_data: base64Data,
          file_name: file.name,
          file_type: file.type
        })
      });

      const text = await res.text();
      let json: any;
      try { json = text ? JSON.parse(text) : {}; } catch { json = { message: text }; }
      
      if (!res.ok) {
        return { 
          success: false, 
          error: json?.message || 'Avatar upload failed',
          details: json?.error || undefined
        } as any;
      }
      
      return { 
        success: true, 
        ...(json || {}), 
        data: (json?.data || json) 
      } as any;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process avatar' 
      } as any;
    }
  }

  async getPersonaAvatar(personaId: string): Promise<ApiResponse<{ avatar_url: string }>> {
    const token = this.getToken();
    const res = await fetch(`${this.baseURL}/api/personas/${personaId}/avatar-simple`, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } as any : undefined,
    });
    const text = await res.text();
    let json: any;
    try { json = text ? JSON.parse(text) : {}; } catch { json = { message: text }; }
    if (!res.ok) {
      return { success: false, error: json?.message || 'Avatar fetch failed' } as any;
    }
    return { success: true, ...(json || {}), data: (json?.data || json) } as any;
  }

  async removePersonaAvatar(personaId: string): Promise<ApiResponse> {
    const token = this.getToken();
    const res = await fetch(`${this.baseURL}/api/personas/${personaId}/avatar-simple`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } as any : undefined,
    });
    const text = await res.text();
    let json: any;
    try { json = text ? JSON.parse(text) : {}; } catch { json = { message: text }; }
    if (!res.ok) {
      return { success: false, error: json?.message || 'Avatar remove failed' } as any;
    }
    return { success: true, ...(json || {}) } as any;
  }

  // Personality Traits
  async getPersonalityTraits(): Promise<ApiResponse<{
    categories: Array<{
      key: string;
      category: string;
      description: string;
      traits: string[];
    }>;
    allTraits: string[];
  }>> {
    // Mock data - replace with actual API call
    const mockData = {
      success: true,
      data: {
        categories: [
          {
            key: 'social',
            category: 'Sosyal Özellikler',
            description: 'Kişinin sosyal etkileşimlerini yansıtan özellikler',
            traits: [
              'Dışa dönük',
              'İçe dönük',
              'Sosyal',
              'Sessiz',
              'Girişken',
              'Çekingen',
              'Samimi',
              'Resmi',
              'Eğlenceli',
              'Ciddi',
              'Konuşkan',
              'Sessiz',
              'Lider',
              'Takım oyuncusu',
              'Popüler',
              'Münzevi',
              'Misafirperver',
              'Yalnız',
              'Arkadaş canlısı',
              'Sosyal sorumlu'
            ]
          },
          {
            key: 'emotional',
            category: 'Duygusal Özellikler',
            description: 'Duygu durumunu ve tepkilerini yansıtan özellikler',
            traits: [
              'Sakin',
              'Enerjik',
              'Optimist',
              'Pesimist',
              'Duygusal',
              'Soğukkanlı',
              'Heyecanlı',
              'Sakin',
              'Duyarlı',
              'Duyarsız',
              'Neşeli',
              'Hüzünlü',
              'Öfkeli',
              'Sakin',
              'Stresli',
              'Rahat',
              'Endişeli',
              'Güvenli',
              'Kırılgan',
              'Güçlü'
            ]
          },
          {
            key: 'intellectual',
            category: 'Zihinsel Özellikler',
            description: 'Düşünce yapısı ve zihinsel süreçleri yansıtan özellikler',
            traits: [
              'Meraklı',
              'Analitik',
              'Yaratıcı',
              'Mantıklı',
              'Duygusal',
              'Nesnel',
              'Öznel',
              'Akılcı',
              'Sezgisel',
              'Deneysel',
              'Teorik',
              'Pratik',
              'Detaycı',
              'Genel bakış',
              'Hızlı kavrayan',
              'Yavaş öğrenen',
              'Öğrenmeye açık',
              'Bilgili',
              'Araştırmacı',
              'Bilimsel'
            ]
          },
          {
            key: 'lifestyle',
            category: 'Yaşam Tarzı',
            description: 'Günlük yaşam tercihlerini yansıtan özellikler',
            traits: [
              'Aktif',
              'Sakin',
              'Düzenli',
              'Dağınık',
              'Erkenci',
              'Geçci',
              'Sporcu',
              'Evcimen',
              'Seyahat sever',
              'Ev kuşu',
              'Sosyal',
              'Yalnız',
              'Moda düşkünü',
              'Rahatına düşkün',
              'Sağlıklı yaşam',
              'Yemek sever',
              'Teknoloji meraklısı',
              'Doğa aşığı',
              'Şehir insanı',
              'Minimalist'
            ]
          },
          {
            key: 'work',
            category: 'İş ve Kariyer',
            description: 'İş yaşamındaki tutum ve davranışları yansıtan özellikler',
            traits: [
              'Hırslı',
              'Çalışkan',
              'Tembel',
              'Lider',
              'Takipçi',
              'Bağımsız',
              'Ekip çalışanı',
              'Yönetici',
              'Çalışan',
              'Girişimci',
              'Yaratıcı',
              'Analitik',
              'Detaycı',
              'Stratejik',
              'Pratik',
              'Teorik',
              'Deneyimli',
              'Acemi',
              'Uzman',
              'Çok yönlü'
            ]
          },
          {
            key: 'hobbies',
            category: 'Hobiler ve İlgi Alanları',
            description: 'Kişisel ilgi alanlarını yansıtan özellikler',
            traits: [
              'Sanat seven',
              'Müzik sever',
              'Kitap kurdu',
              'Sinemasever',
              'Sporcu',
              'Seyahat sever',
              'Yemek yapmayı seven',
              'Bahçe işleri',
              'El işleri',
              'Teknoloji meraklısı',
              'Oyun oynayan',
              'Dansçı',
              'Müzisyen',
              'Ressam',
              'Fotoğrafçı',
              'Yazar',
              'Şef',
              'Koleksiyoncu',
              'Gönüllü',
              'Aktivist'
            ]
          }
        ],
        allTraits: [
          // Social
          'Dışa dönük', 'İçe dönük', 'Sosyal', 'Sessiz', 'Girişken', 'Çekingen', 'Samimi', 'Resmi', 'Eğlenceli', 'Ciddi',
          'Konuşkan', 'Sessiz', 'Lider', 'Takım oyuncusu', 'Popüler', 'Münzevi', 'Misafirperver', 'Yalnız', 'Arkadaş canlısı', 'Sosyal sorumlu',
          // Emotional
          'Sakin', 'Enerjik', 'Optimist', 'Pesimist', 'Duygusal', 'Soğukkanlı', 'Heyecanlı', 'Duyarlı', 'Duyarsız', 'Neşeli',
          'Hüzünlü', 'Öfkeli', 'Stresli', 'Rahat', 'Endişeli', 'Güvenli', 'Kırılgan', 'Güçlü',
          // Intellectual
          'Meraklı', 'Analitik', 'Yaratıcı', 'Mantıklı', 'Duygusal', 'Nesnel', 'Öznel', 'Akılcı', 'Sezgisel', 'Deneysel',
          'Teorik', 'Pratik', 'Detaycı', 'Genel bakış', 'Hızlı kavrayan', 'Yavaş öğrenen', 'Öğrenmeye açık', 'Bilgili', 'Araştırmacı', 'Bilimsel',
          // Lifestyle
          'Aktif', 'Sakin', 'Düzenli', 'Dağınık', 'Erkenci', 'Geçci', 'Sporcu', 'Evcimen', 'Seyahat sever', 'Ev kuşu',
          'Sosyal', 'Yalnız', 'Moda düşkünü', 'Rahatına düşkün', 'Sağlıklı yaşam', 'Yemek sever', 'Teknoloji meraklısı', 'Doğa aşığı', 'Şehir insanı', 'Minimalist',
          // Work
          'Hırslı', 'Çalışkan', 'Tembel', 'Lider', 'Takipçi', 'Bağımsız', 'Ekip çalışanı', 'Yönetici', 'Çalışan', 'Girişimci',
          'Yaratıcı', 'Analitik', 'Detaycı', 'Stratejik', 'Pratik', 'Teorik', 'Deneyimli', 'Acemi', 'Uzman', 'Çok yönlü',
          // Hobbies
          'Sanat seven', 'Müzik sever', 'Kitap kurdu', 'Sinemasever', 'Sporcu', 'Seyahat sever', 'Yemek yapmayı seven', 'Bahçe işleri', 'El işleri', 'Teknoloji meraklısı',
          'Oyun oynayan', 'Dansçı', 'Müzisyen', 'Ressam', 'Fotoğrafçı', 'Yazar', 'Şef', 'Koleksiyoncu', 'Gönüllü', 'Aktivist'
        ]
      }
    };
    
    // In a real implementation, you would make an API call like:
    // return this.apiCall('GET', '/api/personality-traits');
    
    return mockData;
  }

  // Alias for backward compatibility
  async getPersonalityTraitsAll(): Promise<ApiResponse<string[]>> {
    const result = await this.getPersonalityTraits();
    return {
      success: result.success,
      data: result.data?.allTraits || []
    };
  }

  async getPersonalityTraitsByCategory(): Promise<ApiResponse<Array<{
    key: string;
    category: string;
    description: string;
    traits: string[];
  }>>> {
    const result = await this.getPersonalityTraits();
    return {
      success: result.success,
      data: result.data?.categories || []
    };
  }

  // Optional stubs for future endpoints
  async searchGifts(_query: string, _filters?: any): Promise<ApiResponse<any>> {
    return { success: true, data: [] };
  }

  async getGiftCategories(): Promise<ApiResponse<any>> {
    return { success: true, data: [] };
  }

  async getUserPreferences(): Promise<ApiResponse<any>> {
    return { success: true, data: {} };
  }

  async updateUserPreferences(_preferences: any): Promise<ApiResponse<any>> {
    return { success: true, data: {} };
  }
}

// Export singleton instance
export const railwayApi = new RailwayAPI();
export default railwayApi;