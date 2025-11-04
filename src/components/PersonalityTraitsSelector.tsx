import React, { useState, useEffect } from 'react';
import { personalityTraitsApi } from '../lib/api/personalityTraits';
import { Check, X } from 'lucide-react';

interface TraitCategory {
  key: string;
  category: string;
  description: string;
  traits: string[];
}

type ViewMode = 'categories' | 'all';

interface PersonalityTraitsSelectorProps {
  selectedTraits: string[];
  onTraitsChange: (traits: string[]) => void;
  maxSelections?: number;
}

export const PersonalityTraitsSelector: React.FC<PersonalityTraitsSelectorProps> = ({
  selectedTraits = [],
  onTraitsChange,
  maxSelections = 10,
}) => {
  const [categories, setCategories] = useState<TraitCategory[]>([]);
  const [allTraits, setAllTraits] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('categories');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadTraits = async () => {
      try {
        setLoading(true);
        const [categoriesRes, allTraitsRes] = await Promise.all([
          personalityTraitsApi.getByCategory(),
          personalityTraitsApi.getAll(),
        ]);
        
        setCategories(categoriesRes.data);
        setAllTraits(allTraitsRes.data);
      } catch (err) {
        console.error('Failed to load personality traits:', err);
        setError('Kişilik özellikleri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    loadTraits();
  }, []);

  const toggleTrait = (trait: string) => {
    if (selectedTraits.includes(trait)) {
      onTraitsChange(selectedTraits.filter((t) => t !== trait));
    } else if (selectedTraits.length < maxSelections) {
      onTraitsChange([...selectedTraits, trait]);
    }
  };

  const removeTrait = (trait: string) => {
    onTraitsChange(selectedTraits.filter((t) => t !== trait));
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    traits: category.traits.filter(trait => 
      trait.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.traits.length > 0);

  const filteredAllTraits = allTraits.filter(trait => 
    trait.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 w-full">
          <input
            type="text"
            placeholder="Kişilik özelliği ara..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setViewMode('categories')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              viewMode === 'categories'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Kategorilere Göre
          </button>
          <button
            type="button"
            onClick={() => setViewMode('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              viewMode === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tüm Özellikler
          </button>
        </div>
      </div>

      {selectedTraits.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Seçilen Özellikler ({selectedTraits.length}/{maxSelections})
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedTraits.map((trait) => (
              <div
                key={trait}
                className="flex items-center bg-purple-100 text-purple-800 text-sm px-3 py-1.5 rounded-full"
              >
                {trait}
                <button
                  type="button"
                  onClick={() => removeTrait(trait)}
                  className="ml-1.5 text-purple-500 hover:text-purple-700 focus:outline-none"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {viewMode === 'categories' ? (
          filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div key={category.key} className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  {category.category}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{category.description}</p>
                <div className="flex flex-wrap gap-2">
                  {category.traits.map((trait) => (
                    <button
                      key={trait}
                      type="button"
                      onClick={() => toggleTrait(trait)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedTraits.includes(trait)
                          ? 'bg-purple-600 text-white shadow-md transform scale-105'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                      disabled={
                        !selectedTraits.includes(trait) &&
                        selectedTraits.length >= maxSelections
                      }
                      title={
                        selectedTraits.length >= maxSelections &&
                        !selectedTraits.includes(trait)
                          ? `En fazla ${maxSelections} özellik seçebilirsiniz`
                          : ''
                      }
                    >
                      {trait}
                      {selectedTraits.includes(trait) && (
                        <Check className="inline-block ml-1.5 h-3.5 w-3.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Arama kriterlerinize uygun özellik bulunamadı.
            </div>
          )
        ) : filteredAllTraits.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredAllTraits.map((trait) => (
              <button
                key={trait}
                type="button"
                onClick={() => toggleTrait(trait)}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedTraits.includes(trait)
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
                disabled={
                  !selectedTraits.includes(trait) &&
                  selectedTraits.length >= maxSelections
                }
              >
                <div className="flex items-center justify-between">
                  <span>{trait}</span>
                  {selectedTraits.includes(trait) && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Arama kriterlerinize uygun özellik bulunamadı.
          </div>
        )}
      </div>

      {selectedTraits.length > 0 && selectedTraits.length >= maxSelections && (
        <div className="mt-4 text-sm text-purple-700 bg-purple-50 p-3 rounded-lg">
          Maksimum {maxSelections} adet kişilik özelliği seçebilirsiniz. Daha fazla eklemek için önce mevcut özelliklerden bazılarını kaldırın.
        </div>
      )}
    </div>
  );
};

export default PersonalityTraitsSelector;
