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

  /* eslint-disable @typescript-eslint/no-unused-vars */
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
  /* eslint-enable @typescript-eslint/no-unused-vars */

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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            'radial-gradient(1200px circle at 50% -20%, rgba(35,201,255,0.14), transparent 40%), linear-gradient(180deg, #0C0C1E 0%, #0B0B1A 100%)',
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: 'var(--gm-secondary)' }}></div>
          <p className="mt-4" style={{ color: 'rgba(255,255,255,0.75)' }}>Loading…</p>
        </div>
      </div>
    );
  }

  const greetName = user?.email ? user.email.split('@')[0] : 'there';
  const budgetText = getBudgetRangeText(personas);

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          'radial-gradient(1200px circle at 50% -20%, rgba(35,201,255,0.14), transparent 40%), linear-gradient(180deg, #0C0C1E 0%, #0B0B1A 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold" style={{ color: '#FFFFFF' }}>
            Welcome back, {greetName} <span role="img" aria-label="wave">👋</span>
          </h1>
          <p className="mt-2 text-sm md:text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Your creative personas and insights await.
          </p>
        </div>

        {/* Error banner (if any) */}
        {error && (
          <div className="mb-6 rounded-xl px-4 py-3" style={{ backgroundColor: '#3b1d2a', color: '#ff9eb8', border: '1px solid rgba(255,158,186,0.3)' }}>
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError('')} className="underline text-xs" style={{ color: '#ff9eb8' }}>Dismiss</button>
            </div>
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
          <div
            className="rounded-2xl p-5 md:p-6 flex items-center justify-between"
            style={{
              background: 'linear-gradient(135deg, #5B5FF1, #00C9A7)',
              color: 'white',
              boxShadow: '0 12px 40px rgba(0,201,167,0.25)'
            }}
          >
            <div>
              <div className="text-xs uppercase tracking-wide opacity-90">Total Personas</div>
              <div className="text-3xl font-semibold mt-1">{personas.length}</div>
            </div>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
              <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>

          <div
            className="rounded-2xl p-5 md:p-6 flex items-center justify-between"
            style={{
              background: 'linear-gradient(135deg, #5B5FF1, #00C9A7)',
              color: 'white',
              boxShadow: '0 12px 40px rgba(0,201,167,0.25)'
            }}
          >
            <div>
              <div className="text-xs uppercase tracking-wide opacity-90">Budget Range</div>
              <div className="text-2xl md:text-3xl font-semibold mt-1">{budgetText}</div>
            </div>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
              <path d="M3 3v18h18"/>
              <path d="M19 9l-5 5-4-4-3 3"/>
            </svg>
          </div>
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-semibold" style={{ color: '#FFFFFF' }}>Your Personas</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white hover:opacity-95"
            style={{
              backgroundColor: 'var(--gm-primary)',
              boxShadow: '0 10px 30px rgba(123,97,255,0.35)'
            }}
          >
            <Plus className="h-4 w-4" /> Add Persona
          </button>
        </div>

        {/* Personas grid */}
        {personas.length === 0 ? (
          <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.7)' }}>
            No personas yet. Create your first one.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {personas.map((persona) => (
              <div
                key={persona.id}
                className="rounded-3xl p-4 md:p-5 flex flex-col"
                style={{
                  backgroundColor: '#12132A',
                  border: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.35)'
                }}
              >
                <div
                  className="h-36 md:h-40 w-full rounded-2xl mb-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(91,95,241,0.3), rgba(0,201,167,0.25))'
                  }}
                />
                <div className="flex-1">
                  <h3 className="text-base md:text-lg font-semibold" style={{ color: '#FFFFFF' }}>{persona.name}</h3>
                  <p className="text-sm mt-1 line-clamp-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {persona.description || '—'}
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    to={`/persona/${persona.id}`}
                    className="text-sm font-medium"
                    style={{ color: 'var(--gm-secondary)' }}
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
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
