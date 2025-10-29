import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context';
import { api } from '../lib';
import type { Persona } from '../lib/types';
import { Plus } from 'lucide-react';

// Add Persona Modal Component
const AddPersonaModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onPersonaAdded: () => void;
}> = ({ isOpen, onClose, onPersonaAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    description: '',
    interests: '',
    budgetMin: '',
    budgetMax: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const personaData = {
        name: formData.name,
        birth_date: formData.birthDate,
        description: formData.description,
        interests: formData.interests.split(',').map(i => i.trim()).filter(i => i),
        budget_min: parseInt(formData.budgetMin) || 0,
        budget_max: parseInt(formData.budgetMax) || 1000,
      };

      const { error } = await api.personas.create(personaData);
      
      if (error) {
        setError(error.message || 'Persona oluşturulamadı');
      } else {
        onPersonaAdded();
        onClose();
        // Reset form
        setFormData({
          name: '',
          birthDate: '',
          description: '',
          interests: '',
          budgetMin: '',
          budgetMax: '',
        });
      }
    } catch (err) {
      setError('Persona oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Yeni Persona Ekle</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">İsim</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Persona ismini girin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Doğum Tarihi</label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Açıklama</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Bu personayı tanımlayın"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">İlgi Alanları</label>
              <input
                type="text"
                value={formData.interests}
                onChange={(e) => setFormData({...formData, interests: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="İlgi alanlarını virgülle ayırarak girin (örn: müzik, kitap, spor)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Min Bütçe (₺)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.budgetMin}
                  onChange={(e) => setFormData({...formData, budgetMin: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Bütçe (₺)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.budgetMax}
                  onChange={(e) => setFormData({...formData, budgetMax: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="1000"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Oluşturuluyor...' : 'Persona Oluştur'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        // Accept both shapes: [Persona] or { success: boolean, personas: [Persona] }
        const list = Array.isArray(data)
          ? data
          : Array.isArray((data as any)?.personas)
          ? (data as any).personas
          : [];
        setPersonas(list as Persona[]);
      }
    } catch (err) {
      setError('Failed to load personas');
    } finally {
      setLoading(false);
    }
  };

  const formatBirthDate = (dateString: string) => {
    if (!dateString) return 'Doğum tarihi yok';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Geçersiz tarih';
    }
  };

  // Safely compute budget range text across personas where budget fields may be missing
  const getBudgetRangeText = (items: Persona[]) => {
    const mins = items
      .map(p => (typeof (p as any).budget_min === 'number' ? (p as any).budget_min : undefined))
      .filter((v): v is number => typeof v === 'number' && !Number.isNaN(v));
    const maxs = items
      .map(p => (typeof (p as any).budget_max === 'number' ? (p as any).budget_max : undefined))
      .filter((v): v is number => typeof v === 'number' && !Number.isNaN(v));
    if (mins.length && maxs.length) {
      return `₺${Math.min(...mins)} - ₺${Math.max(...maxs)}`;
    }
    return '—';
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Personalarınız yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold leading-tight text-gray-900">
                  Kontrol Paneli
                </h1>
                {user && (
                  <p className="mt-1 text-sm text-gray-700">
                    Tekrar hoş geldiniz, {user.email}!
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                {user && (
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-700">
                      <span className="font-medium">{user.email}</span>
                    </div>
                    {/* Logout button kept in Navbar */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="rounded-2xl p-8 bg-white/70 backdrop-blur shadow">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Hediye Personaları
                  </h2>
                  <p className="text-gray-700 mb-6">
                    Herkes için mükemmel hediyeler bulmak üzere hediye verme personalarınızı yönetin.
                  </p>
                  
                  {/* Quick Stats */}
                  {personas.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white rounded-xl shadow p-4 transition hover:shadow-md">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="text-2xl font-semibold text-gray-900">{personas.length}</p>
                            <p className="text-sm text-gray-600">Toplam Persona</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl shadow p-4 transition hover:shadow-md">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="text-2xl font-semibold text-gray-900">
                              {getBudgetRangeText(personas)}
                            </p>
                            <p className="text-sm text-gray-600">Bütçe Aralığı</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl shadow p-4 transition hover:shadow-md">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="text-2xl font-semibold text-gray-900">
                              {personas.reduce((acc, p) => acc + (p.interests?.length || 0), 0)}
                            </p>
                            <p className="text-sm text-gray-600">Toplam İlgi Alanı</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="mb-6 bg-red-100/80 border border-red-300 text-red-800 px-4 py-3 rounded-xl">
                    {error}
                    <button 
                      onClick={fetchPersonas}
                      className="ml-4 text-red-900 underline hover:opacity-80"
                    >
                      Tekrar Dene
                    </button>
                  </div>
                )}
                
                {personas.length === 0 && !error ? (
                  <div className="text-center py-16">
                    <div className="text-gray-400 mb-6">
                      <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Henüz persona yok</h3>
                    <p className="text-gray-700 mb-8 max-w-sm mx-auto">
                      Hayatınızdaki özel insanlar için kişiselleştirilmiş hediye önerileri almak üzere ilk hediye personanızı oluşturun.
                    </p>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex items-center px-6 py-3 rounded-xl shadow text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      İlk Personanızı Oluşturun
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {personas.map((persona) => (
                      <div key={persona.id} className="bg-white rounded-2xl shadow hover:shadow-lg transition-shadow duration-200 p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {persona.name}
                          </h3>
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Aktif
                            </span>
                          </div>
                        </div>
                        
                        {/* Birth Date */}
                        {persona.birth_date && (
                          <div className="mb-3">
                            <div className="flex items-center text-sm text-gray-600">
                              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="font-medium">Doğum:</span>
                              <span className="ml-1">{formatBirthDate(persona.birth_date)}</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {persona.description || 'Açıklama sağlanmamış.'}
                        </p>
                        
                        {/* Budget */}
                        <div className="mb-4">
                          <div className="flex items-center text-sm">
                            <svg className="h-4 w-4 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <span className="text-gray-500">Bütçe:</span>
                            <span className="ml-1 font-semibold text-gray-900">
                              {typeof (persona as any).budget_min === 'number' && typeof (persona as any).budget_max === 'number'
                                ? `₺${(persona as any).budget_min} - ₺${(persona as any).budget_max}`
                                : 'Belirtilmemiş'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Interests */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {(persona.interests || []).slice(0, 3).map((interest, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                              >
                                {interest}
                              </span>
                            ))}
                            {(persona.interests || []).length > 3 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                +{(persona.interests || []).length - 3} more
                              </span>
                            )}
                            {(!persona.interests || persona.interests.length === 0) && (
                              <span className="text-xs text-gray-400 italic">İlgi alanı listelenmemiş</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Action Button */}
                        <Link
                          to={`/persona/${persona.id}`}
                          className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        >
                          Detayları Görüntüle
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Add Persona Button */}
                <div className="mt-8 flex justify-center">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center px-6 py-3 rounded-xl shadow text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add New Persona
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Persona Modal */}
      <AddPersonaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPersonaAdded={fetchPersonas}
      />
    </div>
  );
}

export default Dashboard;
