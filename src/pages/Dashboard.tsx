import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const personas = [
    { id: 1, name: "Tech Enthusiast", description: "Loves gadgets and tech innovations" },
    { id: 2, name: "Book Lover", description: "Enjoys reading fiction and non-fiction" },
    { id: 3, name: "Fitness Enthusiast", description: "Passionate about health and fitness" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Dashboard
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Gift Personas
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Manage your gift-giving personas to find perfect gifts for everyone.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {personas.map((persona) => (
                    <div key={persona.id} className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {persona.name}
                      </h3>
                      <p className="text-gray-600 mb-4">{persona.description}</p>
                      <Link
                        to={`/persona/${persona.id}`}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        View Details
                      </Link>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Add New Persona
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
