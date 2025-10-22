import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context';
import { api } from '../lib';
import type { Persona } from '../lib/types';

const Dashboard: React.FC = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  // Fetch personas on component mount
  useEffect(() => {
    if (user) {
      checkApiHealth();
      fetchPersonas();
    }
  }, [user]);

  const checkApiHealth = async () => {
    try {
      const { data, error } = await api.health.check();
      if (error) {
        console.warn('API Health Check Failed:', error);
      } else {
        console.log('API Health Check:', data);
      }
    } catch (err) {
      console.warn('API Health Check Error:', err);
    }
  };

  const fetchPersonas = async () => {
    try {
      setLoading(true);
      const { data, error } = await api.personas.list();
      
      if (error) {
        setError(error.message || 'Failed to fetch personas');
      } else {
        setPersonas(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError('Failed to load personas');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold leading-tight text-gray-900">
                  Dashboard
                </h1>
                {user && (
                  <p className="mt-1 text-sm text-gray-600">
                    Welcome back, {user.email}!
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                {user && (
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{user.email}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
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

                {error && (
                  <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                    <button 
                      onClick={fetchPersonas}
                      className="ml-4 text-red-800 underline hover:text-red-900"
                    >
                      Retry
                    </button>
                  </div>
                )}
                
                {personas.length === 0 && !error ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-4">
                      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No personas yet</h3>
                    <p className="text-gray-600 mb-6">Get started by creating your first gift persona.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {personas.map((persona) => (
                      <div key={persona.id} className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {persona.name}
                        </h3>
                        <p className="text-gray-600 mb-3">{persona.description}</p>
                        <div className="mb-4">
                          <span className="text-sm text-gray-500">Budget: </span>
                          <span className="text-sm font-medium text-gray-900">
                            ${persona.budget_min} - ${persona.budget_max}
                          </span>
                        </div>
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {persona.interests.slice(0, 3).map((interest, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                              >
                                {interest}
                              </span>
                            ))}
                            {persona.interests.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{persona.interests.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                        <Link
                          to={`/persona/${persona.id}`}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          View Details
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
                
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
