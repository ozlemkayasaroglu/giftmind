import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context';
import { api } from '../lib';
import type { Persona } from '../lib/types';
import { Plus, X, Upload, Tag as TagIcon, Sparkles } from 'lucide-react';

// Add Persona Modal Component
const AddPersonaModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onPersonaAdded: () => void;
}> = ({ isOpen, onClose, onPersonaAdded }) => {
  const traitOptions = ['Creative','Analytical','Spontaneous','Empathetic','Pragmatic','Optimistic'];

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    ageMin: 25,
    ageMax: 45,
    goals: '',
    challenges: '',
    description: '', // Overview text
    interestsInput: '',
    budgetMin: '',
    budgetMax: '',
    behavioralInsights: '',
    notes: '',
  });

  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [customTrait, setCustomTrait] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Temp Events to create after persona is created
  type NewEvent = { title: string; details?: string; occurred_at?: string };
  const [eventsDraft, setEventsDraft] = useState<NewEvent[]>([]);
  const [evTitle, setEvTitle] = useState('');
  const [evDetails, setEvDetails] = useState('');
  const [evDate, setEvDate] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      ageMin: 25,
      ageMax: 45,
      goals: '',
      challenges: '',
      description: '',
      interestsInput: '',
      budgetMin: '',
      budgetMax: '',
      behavioralInsights: '',
      notes: '',
    });
    setSelectedTraits([]);
    setCustomTrait('');
    setAvatarFile(null);
    setEventsDraft([]);
    setEvTitle('');
    setEvDetails('');
    setEvDate('');
  };

  const addCustomTrait = () => {
    const t = customTrait.trim();
    if (!t) return;
    if (!selectedTraits.includes(t)) setSelectedTraits((s) => [...s, t]);
    setCustomTrait('');
  };

  const toggleTrait = (t: string) => {
    setSelectedTraits((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));
  };

  const addEventDraft = () => {
    if (!evTitle.trim()) return;
    setEventsDraft((d) => [
      ...d,
      { title: evTitle.trim(), details: evDetails.trim() || undefined, occurred_at: evDate || undefined },
    ]);
    setEvTitle('');
    setEvDetails('');
    setEvDate('');
  };

  const removeEventDraft = (idx: number) => {
    setEventsDraft((d) => d.filter((_, i) => i !== idx));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarFile(file);
  };

  const toArray = (value: string) =>
    value
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const personaData: any = {
        name: formData.name,
        role: formData.role || undefined,
        description: formData.description || undefined,
        goal: formData.goals || undefined,
        challenge: formData.challenges || undefined,
        interests: toArray(formData.interestsInput),
        personality_traits: selectedTraits,
        age_min: Number.isFinite(Number(formData.ageMin)) ? Number(formData.ageMin) : undefined,
        age_max: Number.isFinite(Number(formData.ageMax)) ? Number(formData.ageMax) : undefined,
        budget_min: parseInt(formData.budgetMin) || undefined,
        budget_max: parseInt(formData.budgetMax) || undefined,
        insights: formData.behavioralInsights || undefined,
        notes: formData.notes || undefined,
      };

      // Avatar upload is not wired to backend yet. Placeholder retained in UI only.

      const { data: created, error } = await api.personas.create(personaData);
      if (error) {
        setError(error.message || 'Persona oluşturulamadı');
        setLoading(false);
        return;
      }

      // Create initial events if any
      if ((created as any)?.id && eventsDraft.length) {
        const pid = (created as any).id as string;
        for (const ev of eventsDraft) {
          await api.events.create(pid, ev);
        }
      }

      onPersonaAdded();
      onClose();
      resetForm();
    } catch (err: any) {
      setError('Persona oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center overflow-y-auto" style={{ background:
      'radial-gradient(1200px circle at 50% -20%, rgba(35,201,255,0.14), transparent 40%), rgba(0,0,0,0.55)' }}>
      <div className="w-full max-w-3xl mx-auto my-8 md:my-12 rounded-3xl" style={{ backgroundColor: '#12132A', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 30px 70px rgba(0,0,0,0.55)'}}>
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold" style={{ color: '#FFFFFF' }}>Create a New Persona</h3>
              <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Define your next creative AI persona to power your projects.
              </p>
            </div>
            <button onClick={onClose} className="rounded-full p-2 hover:opacity-90" style={{ color: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.06)'}} aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-xl p-3 text-sm border" style={{ backgroundColor: '#3b1d2a', color: '#ff9eb8', borderColor: 'rgba(255,158,186,0.3)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row: Name + Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#C9CBF0' }}>Persona Name / Nickname</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter a name for your persona"
                  className="w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: '#2A2B3F', backgroundColor: '#17182B', color: '#E5E7EB' }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#C9CBF0' }}>Role / Occupation</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g., Creative Director"
                  className="w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: '#2A2B3F', backgroundColor: '#17182B', color: '#E5E7EB' }}
                />
              </div>
            </div>

            {/* Age Range (dual sliders) */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#C9CBF0' }}>Age Range</label>
              <div className="space-y-2">
                <div className="relative">
                  {/* Min slider */}
                  <input
                    type="range"
                    min={10}
                    max={80}
                    value={formData.ageMin}
                    onChange={(e) => {
                      const v = Math.min(Number(e.target.value), formData.ageMax - 1);
                      setFormData({ ...formData, ageMin: v });
                    }}
                    className="w-full"
                  />
                  {/* Max slider overlays */}
                  <input
                    type="range"
                    min={10}
                    max={80}
                    value={formData.ageMax}
                    onChange={(e) => {
                      const v = Math.max(Number(e.target.value), formData.ageMin + 1);
                      setFormData({ ...formData, ageMax: v });
                    }}
                    className="w-full -mt-2 opacity-70"
                  />
                </div>
                <div className="flex items-center justify-between text-xs" style={{ color: '#C9CBF0' }}>
                  <span>{formData.ageMin}</span>
                  <span>{formData.ageMax}</span>
                </div>
              </div>
            </div>

            {/* Goals */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#C9CBF0' }}>Goals</label>
              <textarea
                rows={4}
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                placeholder="Describe the persona's primary objectives and aspirations..."
                className="w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: '#2A2B3F', backgroundColor: '#17182B', color: '#E5E7EB' }}
              />
            </div>

            {/* Challenges */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#C9CBF0' }}>Challenges</label>
              <textarea
                rows={4}
                value={formData.challenges}
                onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                placeholder="What are the main obstacles or pain points this persona faces?"
                className="w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: '#2A2B3F', backgroundColor: '#17182B', color: '#E5E7EB' }}
              />
            </div>

            {/* Personality Traits */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#C9CBF0' }}>Personality Traits</label>
              <div className="flex flex-wrap gap-2">
                {traitOptions.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTrait(t)}
                    className="px-3 py-1.5 rounded-full text-xs border"
                    style={{
                      backgroundColor: selectedTraits.includes(t) ? 'rgba(123,97,255,0.2)' : 'rgba(255,255,255,0.04)',
                      color: selectedTraits.includes(t) ? '#E4E1FF' : '#C9CBF0',
                      borderColor: 'rgba(255,255,255,0.12)'
                    }}
                  >
                    {t}
                  </button>
                ))}
                <div className="inline-flex items-center gap-2">
                  <input
                    value={customTrait}
                    onChange={(e) => setCustomTrait(e.target.value)}
                    placeholder="+ Add Trait"
                    className="rounded-full px-3 py-1.5 text-xs border focus:outline-none"
                    style={{ borderColor: '#2A2B3F', backgroundColor: '#17182B', color: '#E5E7EB' }}
                  />
                  <button type="button" onClick={addCustomTrait} className="rounded-full px-3 py-1.5 text-xs text-white" style={{ backgroundColor: 'var(--gm-secondary)' }}>
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Upload Avatar */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#C9CBF0' }}>Upload Avatar</label>
              <label className="w-full rounded-2xl border-dashed border-2 flex flex-col items-center justify-center gap-2 py-8 cursor-pointer" style={{ borderColor: '#2A2B3F', backgroundColor: '#17182B', color: '#C9CBF0' }}>
                <Upload className="h-6 w-6 opacity-80" />
                <span className="text-xs">Optional. Click or drag a file to this area to upload.</span>
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                {avatarFile && <span className="text-xs mt-2" style={{ color: '#E5E7EB' }}>{avatarFile.name}</span>}
              </label>
            </div>

            {/* Advanced Sections */}
            <div className="grid grid-cols-1 gap-4">
              {/* Overview */}
              <div className="rounded-2xl p-4 border" style={{ backgroundColor: '#12132A', borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium" style={{ color: '#FFFFFF' }}>Overview</h4>
                </div>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short narrative about the persona..."
                  className="w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: '#2A2B3F', backgroundColor: '#17182B', color: '#E5E7EB' }}
                />
              </div>

              {/* Behavioral Insights */}
              <div className="rounded-2xl p-4 border" style={{ backgroundColor: '#12132A', borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium" style={{ color: '#FFFFFF' }}>Behavioral Insights</h4>
                </div>
                <textarea
                  rows={3}
                  value={formData.behavioralInsights}
                  onChange={(e) => setFormData({ ...formData, behavioralInsights: e.target.value })}
                  placeholder="Habits, decision-making style, motivations..."
                  className="w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: '#2A2B3F', backgroundColor: '#17182B', color: '#E5E7EB' }}
                />
              </div>

              {/* Preferences */}
              <div className="rounded-2xl p-4 border" style={{ backgroundColor: '#12132A', borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium" style={{ color: '#FFFFFF' }}>Preferences</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#C9CBF0' }}>Interests</label>
                    <div className="flex items-center gap-2">
                      <TagIcon className="h-4 w-4" style={{ color: '#C9CBF0' }} />
                      <input
                        type="text"
                        value={formData.interestsInput}
                        onChange={(e) => setFormData({ ...formData, interestsInput: e.target.value })}
                        placeholder="e.g., books, yoga, cooking"
                        className="flex-1 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                        style={{ borderColor: '#2A2B3F', backgroundColor: '#17182B', color: '#E5E7EB' }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: '#C9CBF0' }}>Min Budget (₺)</label>
                      <input
                        type="number"
                        min={0}
                        value={formData.budgetMin}
                        onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                        className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                        style={{ borderColor: '#2A2B3F', backgroundColor: '#17182B', color: '#E5E7EB' }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: '#C9CBF0' }}>Max Budget (₺)</label>
                      <input
                        type="number"
                        min={0}
                        value={formData.budgetMax}
                        onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                        className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                        style={{ borderColor: '#2A2B3F', backgroundColor: '#17182B', color: '#E5E7EB' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes / AI Suggestions */}
              <div className="rounded-2xl p-4 border" style={{ backgroundColor: '#12132A', borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium" style={{ color: '#FFFFFF' }}>Notes / AI Suggestions</h4>
                  <button type="button" disabled className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-white opacity-60 cursor-not-allowed" style={{ backgroundColor: 'var(--gm-secondary)' }}>
                    <Sparkles className="h-4 w-4" /> Generate (save first)
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Quick notes about preferences, ideas, or constraints..."
                  className="w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: '#2A2B3F', backgroundColor: '#17182B', color: '#E5E7EB' }}
                />
              </div>

              {/* Events (initial) */}
              <div className="rounded-2xl p-4 border" style={{ backgroundColor: '#12132A', borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="mb-3">
                  <h4 className="text-sm font-medium" style={{ color: '#FFFFFF' }}>Events</h4>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Add a few recent events for this persona (optional)</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
                  <input
                    type="text"
                    value={evTitle}
                    onChange={(e) => setEvTitle(e.target.value)}
                    placeholder="Title"
                    className="md:col-span-2 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: '#2A2B3F', backgroundColor: '#17182B', color: '#E5E7EB' }}
                  />
                  <input
                    type="date"
                    value={evDate}
                    onChange={(e) => setEvDate(e.target.value)}
                    className="md:col-span-1 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: '#2A2B3F', backgroundColor: '#17182B', color: '#E5E7EB' }}
                  />
                  <input
                    type="text"
                    value={evDetails}
                    onChange={(e) => setEvDetails(e.target.value)}
                    placeholder="Details"
                    className="md:col-span-1 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: '#2A2B3F', backgroundColor: '#17182B', color: '#E5E7EB' }}
                  />
                  <button type="button" onClick={addEventDraft} className="md:col-span-1 rounded-xl text-sm text-white px-3 py-2 hover:opacity-95" style={{ backgroundColor: 'var(--gm-primary)' }}>
                    Add
                  </button>
                </div>
                {eventsDraft.length > 0 && (
                  <ul className="space-y-2">
                    {eventsDraft.map((ev, idx) => (
                      <li key={idx} className="flex items-center justify-between rounded-xl border px-3 py-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        <div className="text-xs" style={{ color: '#C9CBF0' }}>
                          <span className="font-medium" style={{ color: '#FFFFFF' }}>{ev.title}</span>
                          {ev.occurred_at ? ` · ${ev.occurred_at}` : ''}
                          {ev.details ? ` · ${ev.details}` : ''}
                        </div>
                        <button type="button" onClick={() => removeEventDraft(idx)} className="text-xs" style={{ color: '#ff9eb8' }}>Remove</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-sm"
                style={{ color: '#E5E7EB', backgroundColor: 'rgba(255,255,255,0.06)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-full text-sm text-white disabled:opacity-60"
                style={{ backgroundColor: 'var(--gm-primary)' }}
              >
                {loading ? 'Saving…' : 'Save Persona'}
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
