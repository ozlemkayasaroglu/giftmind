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
    const res = await railwayApi.getPersonalityTraitsAll();
    return res;
  },

  /**
   * Get personality traits grouped by categories
   */
  async getByCategory() {
    const res = await railwayApi.getPersonalityTraitsByCategory();
    return res;
  },

  /**
   * Get complete personality traits data structure
   */
  async getFullData() {
    const [categoriesRes, allTraitsRes] = await Promise.all([
      railwayApi.getPersonalityTraitsByCategory(),
      railwayApi.getPersonalityTraitsAll(),
    ]);

    return {
      success: Boolean(categoriesRes.success && allTraitsRes.success),
      data: {
        categories: categoriesRes.data ?? [],
        allTraits: allTraitsRes.data ?? [],
      },
    };
  },
};
