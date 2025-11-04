import { railwayApi } from '../railwayApi';

export type TraitCategory = {
  key: string;
  category: string;
  description: string;
  traits: string[];
};

export type PersonalityTraitsResponse = {
  success: boolean;
  data: {
    categories: TraitCategory[];
    allTraits: string[];
  };
};

export const personalityTraitsApi = {
  /**
   * Get all personality traits as a flat list
   */
  async getAll() {
    return await railwayApi.getPersonalityTraitsAll();
  },

  /**
   * Get personality traits grouped by categories
   */
  async getByCategory() {
    return await railwayApi.getPersonalityTraitsByCategory();
  },

  /**
   * Get complete personality traits data structure
   */
  async getFullData() {
    const [categoriesRes, allTraitsRes] = await Promise.all([
      railwayApi.getPersonalityTraitsByCategory(),
      railwayApi.getPersonalityTraitsAll()
    ]);
    
    return {
      success: categoriesRes.success && allTraitsRes.success,
      data: {
        categories: categoriesRes.data || [],
        allTraits: allTraitsRes.data || []
      }
    };
  },
};
