import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib';
import type { Persona, GiftRecommendation } from '../lib/types';

const PersonaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [recommendations, setRecommendations] = useState<GiftRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetchPersonaData(id);
    }
  }, [id]);

  const fetchPersonaData = async (personaId: string) => {
    try {
      setLoading(true);
      
      // Fetch persona details
      const personaResponse = await api.personas.get(personaId);
      if (personaResponse.error) {
        setError(personaResponse.error.message || 'Failed to fetch persona');
        return;
      }
      
      setPersona(personaResponse.data as Persona);
      
      // Fetch recommendations
      const recommendationsResponse = await api.gifts.getRecommendations(personaId);
      if (recommendationsResponse.error) {
        console.error('Failed to fetch recommendations:', recommendationsResponse.error);
        // Don't show error for recommendations, just log it
      } else {
        setRecommendations((recommendationsResponse.data as GiftRecommendation[]) || []);
      }
      
    } catch (err) {
      setError('Failed to load persona data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading persona details...</p>
        </div>
      </div>
    );
  }

  if (error || !persona) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error || 'Persona not found'}</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-indigo-600 hover:text-indigo-500 flex items-center"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
            <h1 className="text-3xl font-bold leading-tight text-gray-900 mt-4">
              {persona.name}
            </h1>
          </div>
        </header>
        
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Persona Details Card */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Persona Details
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {persona.description}
                  </p>
                </div>
                
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Age Range</dt>
                      <dd className="mt-1 text-sm text-gray-900">{persona.age_range}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Budget Range</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        ${persona.budget_min} - ${persona.budget_max}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Relationship</dt>
                      <dd className="mt-1 text-sm text-gray-900">{persona.relationship}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Created</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(persona.created_at).toLocaleDateString()}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Interests</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <div className="flex flex-wrap gap-2">
                          {persona.interests.map((interest, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Personality Traits</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <div className="flex flex-wrap gap-2">
                          {persona.personality_traits.map((trait, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                            >
                              {trait}
                            </span>
                          ))}
                        </div>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              {/* Gift Recommendations */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Gift Recommendations
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    AI-curated gift ideas perfect for this persona
                  </p>
                </div>
                
                <div className="border-t border-gray-200">
                  {recommendations.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-500 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
                      <p className="text-gray-600 mb-6">We're generating personalized gift recommendations for you.</p>
                      <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                        Generate Recommendations
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {recommendations.map((recommendation) => (
                        <div key={recommendation.id} className="px-4 py-6 sm:px-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="text-lg font-medium text-gray-900">
                                  {recommendation.gift.name}
                                </h4>
                                <div className="ml-4 flex items-center">
                                  <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                                    {recommendation.match_score}% match
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {recommendation.gift.description}
                              </p>
                              <div className="mt-2">
                                <span className="text-lg font-semibold text-gray-900">
                                  ${recommendation.gift.price}
                                </span>
                                <span className="ml-2 text-sm text-gray-500">
                                  in {recommendation.gift.category}
                                </span>
                              </div>
                              <div className="mt-3">
                                <h5 className="text-sm font-medium text-gray-700 mb-1">Why this is perfect:</h5>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {recommendation.reasons.map((reason, index) => (
                                    <li key={index} className="flex items-start">
                                      <span className="text-indigo-500 mr-2">•</span>
                                      {reason}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PersonaDetailPage;
