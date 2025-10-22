// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

// Persona Types
export interface Persona {
  id: string;
  user_id: string;
  name: string;
  description: string;
  birth_date?: string; // Birth date field
  age_range: string;
  budget_min: number;
  budget_max: number;
  interests: string[];
  personality_traits: string[];
  relationship: string;
  occasion_preferences: string[];
  created_at: string;
  updated_at: string;
}

export interface CreatePersonaRequest {
  name: string;
  description: string;
  birth_date?: string; // Birth date field
  age_range: string;
  budget_min: number;
  budget_max: number;
  interests: string[];
  personality_traits: string[];
  relationship: string;
  occasion_preferences: string[];
}

// Gift Types
export interface Gift {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  affiliate_url?: string;
  rating?: number;
  tags: string[];
}

export interface GiftRecommendation {
  id: string;
  persona_id: string;
  gift: Gift;
  match_score: number;
  reasons: string[];
  created_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}

// Search Types
export interface SearchFilters {
  category?: string;
  min_price?: number;
  max_price?: number;
  occasion?: string;
  interests?: string[];
}

export interface SearchRequest {
  query: string;
  filters?: SearchFilters;
  limit?: number;
  offset?: number;
}

// Preferences Types
export interface UserPreferences {
  id: string;
  user_id: string;
  language: string;
  currency: string;
  email_notifications: boolean;
  push_notifications: boolean;
  preferred_categories: string[];
  budget_alerts: boolean;
  created_at: string;
  updated_at: string;
}

// Error Types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}
