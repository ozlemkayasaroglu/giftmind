import React, { useEffect, useState } from 'react';

export interface PersonaFormValues {
  name: string;
  birthDate: string; // YYYY-MM-DD
  interests: string[];
  notes: string;
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

const PersonaForm: React.FC<PersonaFormProps> = ({ onSubmit, initialData, submitLabel = 'Save', className = '' }) => {
  const [name, setName] = useState<string>(initialData?.name ?? '');
  const [birthDate, setBirthDate] = useState<string>(initialData?.birthDate ?? '');
  const [interestsInput, setInterestsInput] = useState<string>(toCommaSeparated(initialData?.interests));
  const [notes, setNotes] = useState<string>(initialData?.notes ?? '');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep form in sync if initialData changes
  useEffect(() => {
    if (!initialData) return;
    setName(initialData.name ?? '');
    setBirthDate(initialData.birthDate ?? '');
    setInterestsInput(toCommaSeparated(initialData.interests));
    setNotes(initialData.notes ?? '');
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const values: PersonaFormValues = {
      name: name.trim(),
      birthDate: birthDate || '',
      interests: toArray(interestsInput),
      notes: notes.trim(),
    };

    if (!values.name) {
      setError('Name is required');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(values);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200" role="alert">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="persona-name" className="block text-sm font-medium text-gray-800">
          Name
        </label>
        <input
          id="persona-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Alex Doe"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="persona-birthDate" className="block text-sm font-medium text-gray-800">
          Birth Date
        </label>
        <input
          id="persona-birthDate"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="persona-interests" className="block text-sm font-medium text-gray-800">
          Interests (comma-separated)
        </label>
        <input
          id="persona-interests"
          type="text"
          value={interestsInput}
          onChange={(e) => setInterestsInput(e.target.value)}
          placeholder="e.g., books, yoga, cooking"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="persona-description" className="block text-sm font-medium text-gray-800">
          Description
        </label>
        <textarea
          id="persona-description"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Describe this persona..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default PersonaForm;
