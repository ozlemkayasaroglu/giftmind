import type { Persona, GiftRecommendation, Gift } from './types';

// Mock Data for Development
export const mockPersonas: Persona[] = [
  {
    id: '1',
    user_id: 'user123',
    name: 'Tech Enthusiast Friend',
    description: 'Loves the latest gadgets and technology trends',
    age_range: '25-35',
    budget_min: 50,
    budget_max: 500,
    interests: ['Technology', 'Gaming', 'Smart Home', 'Programming', 'AI'],
    personality_traits: ['Innovative', 'Curious', 'Early Adopter'],
    relationship: 'Friend',
    occasion_preferences: ['Birthday', 'Holiday', 'Achievement'],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    user_id: 'user123',
    name: 'Bookworm Sister',
    description: 'Passionate reader who enjoys both fiction and non-fiction',
    age_range: '20-30',
    budget_min: 25,
    budget_max: 200,
    interests: ['Reading', 'Literature', 'Writing', 'Coffee', 'Cozy spaces'],
    personality_traits: ['Thoughtful', 'Introspective', 'Creative'],
    relationship: 'Family',
    occasion_preferences: ['Birthday', 'Holiday', 'Just Because'],
    created_at: '2024-01-16T14:30:00Z',
    updated_at: '2024-01-16T14:30:00Z',
  },
  {
    id: '3',
    user_id: 'user123',
    name: 'Fitness Mom',
    description: 'Health-conscious mother who loves staying active',
    age_range: '35-45',
    budget_min: 30,
    budget_max: 300,
    interests: ['Fitness', 'Yoga', 'Healthy Cooking', 'Running', 'Wellness'],
    personality_traits: ['Disciplined', 'Caring', 'Energetic'],
    relationship: 'Family',
    occasion_preferences: ['Mother\'s Day', 'Birthday', 'New Year'],
    created_at: '2024-01-17T09:15:00Z',
    updated_at: '2024-01-17T09:15:00Z',
  },
];

export const mockGifts: Gift[] = [
  {
    id: 'gift1',
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Premium sound quality with active noise cancellation',
    price: 299,
    category: 'Electronics',
    image_url: 'https://example.com/headphones.jpg',
    rating: 4.8,
    tags: ['tech', 'audio', 'wireless', 'premium'],
  },
  {
    id: 'gift2',
    name: 'Smart Home Assistant',
    description: 'Voice-controlled smart speaker with AI assistant',
    price: 129,
    category: 'Smart Home',
    image_url: 'https://example.com/smart-speaker.jpg',
    rating: 4.6,
    tags: ['smart home', 'voice control', 'AI', 'convenience'],
  },
  {
    id: 'gift3',
    name: 'Premium Book Collection',
    description: 'Curated collection of bestselling novels',
    price: 89,
    category: 'Books',
    image_url: 'https://example.com/books.jpg',
    rating: 4.9,
    tags: ['books', 'reading', 'literature', 'collection'],
  },
];

export const mockRecommendations: GiftRecommendation[] = [
  {
    id: 'rec1',
    persona_id: '1',
    gift: mockGifts[0],
    match_score: 95,
    reasons: [
      'Perfect for tech enthusiasts who appreciate quality audio',
      'Matches the budget range perfectly',
      'High rating from similar users'
    ],
    created_at: '2024-01-18T12:00:00Z',
  },
  {
    id: 'rec2',
    persona_id: '1',
    gift: mockGifts[1],
    match_score: 88,
    reasons: [
      'Great for smart home enthusiasts',
      'Within budget range',
      'Popular among tech-savvy users'
    ],
    created_at: '2024-01-18T12:01:00Z',
  },
];

// Mock API Functions
export const mockApi = {
  // Authentication - Use existing Supabase auth
  auth: {
    login: async (_email: string, _password: string) => {
      // This will be handled by Supabase
      return { data: null, error: null };
    },
  },

  // Personas
  personas: {
    list: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return { data: mockPersonas, error: null };
    },

    get: async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const persona = mockPersonas.find(p => p.id === id);
      if (persona) {
        return { data: persona, error: null };
      } else {
        return { data: null, error: { message: 'Persona not found' } };
      }
    },

    create: async (persona: any) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newPersona: Persona = {
        ...persona,
        id: Date.now().toString(),
        user_id: 'user123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockPersonas.push(newPersona);
      return { data: newPersona, error: null };
    },

    update: async (id: string, persona: any) => {
      await new Promise(resolve => setTimeout(resolve, 800));
      const index = mockPersonas.findIndex(p => p.id === id);
      if (index !== -1) {
        mockPersonas[index] = { ...mockPersonas[index], ...persona, updated_at: new Date().toISOString() };
        return { data: mockPersonas[index], error: null };
      }
      return { data: null, error: { message: 'Persona not found' } };
    },

    delete: async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 600));
      const index = mockPersonas.findIndex(p => p.id === id);
      if (index !== -1) {
        mockPersonas.splice(index, 1);
        return { data: { success: true }, error: null };
      }
      return { data: null, error: { message: 'Persona not found' } };
    },
  },

  // Gift Recommendations
  gifts: {
    getRecommendations: async (personaId: string) => {
      await new Promise(resolve => setTimeout(resolve, 1200));
      const recommendations = mockRecommendations.filter(r => r.persona_id === personaId);
      return { data: recommendations, error: null };
    },

    search: async (query: string, _filters?: any) => {
      await new Promise(resolve => setTimeout(resolve, 800));
      const filteredGifts = mockGifts.filter(gift => 
        gift.name.toLowerCase().includes(query.toLowerCase()) ||
        gift.description.toLowerCase().includes(query.toLowerCase()) ||
        gift.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      return { data: filteredGifts, error: null };
    },

    getCategories: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { 
        data: ['Electronics', 'Books', 'Fashion', 'Home & Garden', 'Sports', 'Beauty', 'Toys'], 
        error: null 
      };
    },
  },
};
