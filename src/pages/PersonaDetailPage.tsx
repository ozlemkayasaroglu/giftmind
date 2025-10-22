import React from 'react';
import { useParams, Link } from 'react-router-dom';

const PersonaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Mock data - in a real app, you'd fetch this based on the ID
  const persona = {
    id: id,
    name: "Tech Enthusiast",
    description: "Loves gadgets and tech innovations",
    interests: ["Smartphones", "Smart Home", "Gaming", "Wearables", "AI"],
    ageRange: "25-35",
    budget: "$50-$500",
    giftSuggestions: [
      { id: 1, name: "Wireless Earbuds", price: "$150", reason: "Perfect for music and calls" },
      { id: 2, name: "Smart Watch", price: "$300", reason: "Great for fitness tracking" },
      { id: 3, name: "Portable Charger", price: "$50", reason: "Essential for tech lovers" },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-indigo-600 hover:text-indigo-500"
              >
                ← Back to Dashboard
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
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
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
                      <dd className="mt-1 text-sm text-gray-900">{persona.ageRange}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Budget Range</dt>
                      <dd className="mt-1 text-sm text-gray-900">{persona.budget}</dd>
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
                  </dl>
                </div>
              </div>
              
              <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Gift Suggestions
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Curated gift ideas for this persona
                  </p>
                </div>
                
                <div className="border-t border-gray-200">
                  <div className="divide-y divide-gray-200">
                    {persona.giftSuggestions.map((gift) => (
                      <div key={gift.id} className="px-4 py-5 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {gift.name}
                            </h4>
                            <p className="text-sm text-gray-500">{gift.reason}</p>
                          </div>
                          <div className="ml-4">
                            <span className="text-lg font-semibold text-indigo-600">
                              {gift.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
