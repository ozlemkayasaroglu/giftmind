import React, { useEffect, useMemo, useState } from 'react';

export interface PersonaFormValues {
  name: string;
  birthDate: string; // YYYY-MM-DD
  interests: string[];
  notes: string;
  // New optional fields
  role?: string;
  goals?: string;
  challenges?: string;
  behavioralInsights?: string;
  budgetMin?: number;
  budgetMax?: number;
}

export interface PersonaFormProps {
  onSubmit: (values: PersonaFormValues) => Promise<void> | void;
  initialData?: Partial<PersonaFormValues>;
  submitLabel?: string;
  className?: string;
}

const toCommaSeparated = (arr?: string[]) => (arr && arr.length ? arr.join(', ') : '');
const toArray = (value: string) =>
  value
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

type StepKey = 'basic' | 'preferences' | 'overview';

const PersonaForm: React.FC<PersonaFormProps> = ({ onSubmit, initialData, submitLabel = 'Kaydet', className = '' }) => {
  const [name, setName] = useState<string>(initialData?.name ?? '');
  const [birthDate, setBirthDate] = useState<string>(initialData?.birthDate ?? '');
  const [interestsInput, setInterestsInput] = useState<string>(toCommaSeparated(initialData?.interests));
  const [notes, setNotes] = useState<string>(initialData?.notes ?? '');
  // New fields
  const [role, setRole] = useState<string>(initialData?.role ?? '');
  const [goals, setGoals] = useState<string>(initialData?.goals ?? '');
  const [challenges, setChallenges] = useState<string>(initialData?.challenges ?? '');
  const [behavioralInsights, setBehavioralInsights] = useState<string>(initialData?.behavioralInsights ?? '');
  const [budgetMinStr, setBudgetMinStr] = useState<string>(
    typeof initialData?.budgetMin === 'number' ? String(initialData?.budgetMin) : ''
  );
  const [budgetMaxStr, setBudgetMaxStr] = useState<string>(
    typeof initialData?.budgetMax === 'number' ? String(initialData?.budgetMax) : ''
  );
  const [, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const [active, setActive] = useState<StepKey>('basic');
  const steps = useMemo(() => (
    [
      { key: 'basic' as StepKey, label: 'Temel Bilgiler' },
      { key: 'preferences' as StepKey, label: 'Tercihler' },
      { key: 'overview' as StepKey, label: 'Özet' },
    ]
  ), []);
  const currentIndex = steps.findIndex(s => s.key === active);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep form in sync if initialData changes
  useEffect(() => {
    if (!initialData) return;
    setName(initialData.name ?? '');
    setBirthDate(initialData.birthDate ?? '');
    setInterestsInput(toCommaSeparated(initialData.interests));
    setNotes(initialData.notes ?? '');
    setRole(initialData.role ?? '');
    setGoals(initialData.goals ?? '');
    setChallenges(initialData.challenges ?? '');
    setBehavioralInsights(initialData.behavioralInsights ?? '');
    setBudgetMinStr(typeof (initialData as any).budgetMin === 'number' ? String((initialData as any).budgetMin) : '');
    setBudgetMaxStr(typeof (initialData as any).budgetMax === 'number' ? String((initialData as any).budgetMax) : '');
  }, [initialData]);

  const next = () => {
    setError(null);
    if (active === 'basic' && !name.trim()) {
      setError('İsim gerekli');
      return;
    }
    if (currentIndex < steps.length - 1) setActive(steps[currentIndex + 1].key);
  };

  const prev = () => {
    setError(null);
    if (currentIndex > 0) setActive(steps[currentIndex - 1].key);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const parsedBudgetMin = Number.isFinite(Number(budgetMinStr)) ? Number(budgetMinStr) : undefined;
    const parsedBudgetMax = Number.isFinite(Number(budgetMaxStr)) ? Number(budgetMaxStr) : undefined;

    const values: PersonaFormValues = {
      name: name.trim(),
      birthDate: birthDate || '',
      interests: toArray(interestsInput),
      notes: notes.trim(),
      role: role || undefined,
      goals: goals || undefined,
      challenges: challenges || undefined,
      behavioralInsights: behavioralInsights || undefined,
      budgetMin: parsedBudgetMin,
      budgetMax: parsedBudgetMax,
    };

    if (!values.name) {
      setActive('basic');
      setError('İsim gerekli');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(values);
    } catch (err: any) {
      setError(err?.message || 'Gönderim başarısız');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    // Log selected avatar
    console.log('PersonaForm avatar selected:', { file, previewUrl: url });
  };

  // Common styles for dark inputs matching the app’s design
  const inputClass = 'w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2';
  const inputStyle: React.CSSProperties = {
    borderColor: '#2A2B3F',
    backgroundColor: '#17182B',
    color: '#E5E7EB',
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-4 overflow-y-auto max-h-[70vh] pr-1 max-w-2xl w-full mx-auto ${className}`}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* Step indicator (non-interactive) */}
      <div className="mb-1 flex items-center justify-between">
        <div className="text-xs text-white/70">Adım {currentIndex + 1} / {steps.length}</div>
        <div className="flex items-center gap-2">
          {steps.map((s, idx) => {
            const reached = idx <= currentIndex;
            return (
              <span
                key={s.key}
                className="px-2 py-1 rounded-full border text-xs select-none"
                style={{ borderColor: 'rgba(255,255,255,0.14)', backgroundColor: reached ? 'rgba(123,97,255,0.25)' : 'rgba(255,255,255,0.06)', color: reached ? '#fff' : 'rgba(255,255,255,0.6)' }}
              >
                {s.label}
              </span>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="rounded-md p-3 text-sm border" style={{ backgroundColor: '#3b1d2a', color: '#ff9eb8', borderColor: 'rgba(255,158,186,0.3)' }} role="alert">
          {error}
        </div>
      )}

      {/* Step Panels */}
      {active === 'basic' && (
        <div className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="persona-name" className="block text-sm font-medium" style={{ color: '#C9CBF0' }}>
              İsim
            </label>
            <input
              id="persona-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="örn. Alex Doğan"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="persona-birthDate" className="block text-sm font-medium" style={{ color: '#C9CBF0' }}>
              Doğum Tarihi
            </label>
            <input
              id="persona-birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="persona-role" className="block text-sm font-medium" style={{ color: '#C9CBF0' }}>
              Rol / Meslek
            </label>
            <input
              id="persona-role"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="örn. Kreatif Direktör"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium" style={{ color: '#C9CBF0' }}>
              Avatar
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-white/60">Yok</div>
                )}
              </div>
              <label className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium text-white cursor-pointer" style={{ backgroundColor: 'var(--gm-primary)' }}>
                Dosya Seç
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarSelect} />
              </label>
            </div>
          </div>
        </div>
      )}

      {active === 'preferences' && (
        <div className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="persona-interests" className="block text-sm font-medium" style={{ color: '#C9CBF0' }}>
              İlgi Alanları (virgülle ayırın)
            </label>
            <input
              id="persona-interests"
              type="text"
              value={interestsInput}
              onChange={(e) => setInterestsInput(e.target.value)}
              placeholder="örn. kitaplar, yoga, yemek"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="persona-budgetMin" className="block text-sm font-medium" style={{ color: '#C9CBF0' }}>
                Minimum Bütçe
              </label>
              <input
                id="persona-budgetMin"
                type="number"
                min={0}
                value={budgetMinStr}
                onChange={(e) => setBudgetMinStr(e.target.value)}
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="persona-budgetMax" className="block text-sm font-medium" style={{ color: '#C9CBF0' }}>
                Maksimum Bütçe
              </label>
              <input
                id="persona-budgetMax"
                type="number"
                min={0}
                value={budgetMaxStr}
                onChange={(e) => setBudgetMaxStr(e.target.value)}
                className={inputClass}
                style={inputStyle}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="persona-behavioral" className="block text-sm font-medium" style={{ color: '#C9CBF0' }}>
              Davranışsal İçgörüler
            </label>
            <textarea
              id="persona-behavioral"
              value={behavioralInsights}
              onChange={(e) => setBehavioralInsights(e.target.value)}
              rows={4}
              placeholder="Alışkanlıklar, motivasyonlar, satın alma davranışları…"
              className={`${inputClass} resize-y`}
              style={inputStyle}
            />
          </div>
        </div>
      )}

      {active === 'overview' && (
        <div className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="persona-goals" className="block text-sm font-medium" style={{ color: '#C9CBF0' }}>
              Hedefler
            </label>
            <textarea
              id="persona-goals"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              rows={3}
              placeholder="Bu persona ne başarmak istiyor?"
              className={`${inputClass} resize-y`}
              style={inputStyle}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="persona-challenges" className="block text-sm font-medium" style={{ color: '#C9CBF0' }}>
              Zorluklar
            </label>
            <textarea
              id="persona-challenges"
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              rows={3}
              placeholder="Karşılaştığı zorluklar neler?"
              className={`${inputClass} resize-y`}
              style={inputStyle}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="persona-description" className="block text-sm font-medium" style={{ color: '#C9CBF0' }}>
              Açıklama / Notlar
            </label>
            <textarea
              id="persona-description"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="Bu personayı tanımlayın..."
              className={`${inputClass} resize-y`}
              style={inputStyle}
            />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="pt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            disabled={currentIndex === 0}
            className="px-3 py-2 rounded-full text-sm disabled:opacity-50"
            style={{ color: '#E5E7EB', backgroundColor: 'rgba(255,255,255,0.06)' }}
          >
            Geri
          </button>
          {currentIndex < steps.length - 1 && (
            <button
              type="button"
              onClick={next}
              className="px-3 py-2 rounded-full text-sm text-white"
              style={{ backgroundColor: 'var(--gm-primary)' }}
            >
              İleri
            </button>
          )}
        </div>
        {currentIndex === steps.length - 1 && (
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            style={{ backgroundColor: 'var(--gm_secondary, var(--gm-secondary, #23C9FF))' }}
          >
            {submitting ? 'Kaydediliyor…' : submitLabel}
          </button>
        )}
      </div>
    </form>
  );
};

export default PersonaForm;
