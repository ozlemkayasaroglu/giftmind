import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib";
import { Gift } from "lucide-react";
import PersonaForm, { type PersonaFormValues } from "../components/PersonaForm";

// Local Persona type to map common fields
type Persona = {
  id: string;
  name: string;
  description?: string;
  interests?: string[] | string;
  // Notes can come as string, string[], or array of objects from Supabase/BE
  notes?: string | string[] | Array<Record<string, any>>;
  birthDate?: string; // ISO date (YYYY-MM-DD)
  birth_date?: string; // alt naming
  dob?: string; // alt naming
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
};

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string) ||
  "https://giftmind-be-production.up.railway.app";

const getAuthToken = () =>
  localStorage.getItem("railway_token") ||
  localStorage.getItem("authToken") ||
  "";

// Normalize interests from string | string[] | JSON-string -> string[]
const normalizeInterests = (raw: unknown): string[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter((x) => typeof x === "string") as string[];
  if (typeof raw === "string") {
    const str = raw.trim();
    // Try JSON parse first (e.g., "[\"books\",\"music\"]")
    try {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed)) {
        return parsed.filter((x) => typeof x === "string") as string[];
      }
    } catch {/* not JSON, fallback split */}
    return str
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }
  return [];
};

// Normalize notes from string | string[] | object[] -> string
const normalizeNotes = (raw: unknown, fallback?: string): string => {
  if (typeof raw === "string") return raw;
  if (Array.isArray(raw)) {
    // If array of strings
    const strings = raw.filter((x) => typeof x === "string") as string[];
    if (strings.length === raw.length) return strings.join("\n");
    // If array of objects, try common fields
    const texts = (raw as Array<Record<string, any>>)
      .map((o) => (o?.content ?? o?.text ?? o?.note ?? "").toString().trim())
      .filter((s) => s.length > 0);
    if (texts.length) return texts.join("\n");
  }
  return fallback || "";
};

const normalizePersonaToForm = (p: Persona | null): PersonaFormValues => ({
  name: p?.name ?? "",
  birthDate: p?.birthDate || p?.birth_date || p?.dob || "",
  interests: normalizeInterests(p?.interests),
  // Use backend description as the form's description field
  notes: typeof p?.description === "string" && p.description
    ? p.description
    : normalizeNotes(p?.notes),
});

const PersonaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggesting, setSuggesting] = useState(false);

  const authHeader = useMemo(() => {
    const token = getAuthToken();
    return token
      ? { Authorization: `Bearer ${token}` }
      : ({} as Record<string, string>);
  }, []);

  const fetchPersona = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      // Use centralized API client to support various response shapes ({data} | {persona} | plain)
      const { data, error } = await api.personas.get(id);
      if (error) throw new Error(error.message || "Failed to load persona");
      setPersona((data as any) ?? null);
    } catch (e: any) {
      setError(e?.message || "Failed to load persona");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPersona();
  }, [fetchPersona]);

  const handleUpdate = async (values: PersonaFormValues) => {
    if (!id) return;
    setError(null);

    try {
      // Send snake_case for birth_date; keep interests array and notes string
      const res = await fetch(`${API_BASE_URL}/api/personas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader,
        } as HeadersInit,
        body: JSON.stringify({
          name: values.name,
          description: values.notes,
          notes: values.notes,
          interests: values.interests,
          birth_date: values.birthDate,
        }),
      });

      const body = await res.text();
      const json = body ? JSON.parse(body) : {};
      if (!res.ok) {
        throw new Error(
          json?.message || json?.error || `Failed to update persona (${res.status})`
        );
      }

      // Re-fetch to get the server canonical record (from Supabase)
      await fetchPersona();
      setEditing(false);
    } catch (e: any) {
      setError(e?.message || "Failed to update");
    }
  };

  const handleSuggest = async () => {
    if (!id) return;
    setSuggesting(true);
    setError(null);

    try {
      const { data, error } = await api.gifts.getRecommendations(id);
      if (error) {
        throw new Error(error.message || "Failed to get suggestions");
      }
      const list = Array.isArray(data) ? data : [];
      setSuggestions(list as string[]);
    } catch (e: any) {
      setError(e?.message || "Failed to get suggestions");
    } finally {
      setSuggesting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-sm text-gray-600">Loading persona…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      </div>
    );
  }

  if (!persona) {
    return (
      <div className="p-6">
        <div className="text-sm text-gray-600">Persona not found.</div>
      </div>
    );
  }

  const formInitial = normalizePersonaToForm(persona);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {persona.name}
          </h1>
          {formInitial.birthDate && (
            <p className="text-sm text-gray-600">
              Birth Date: {formInitial.birthDate}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditing((v) => !v)}
            className="inline-flex items-center rounded-md bg-violet-400 px-3 py-2 text-sm font-medium text-white hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {editing ? "Cancel" : "Personayı Düzenle"}
          </button>
          <button
            onClick={handleSuggest}
            disabled={suggesting}
            className="inline-flex items-center gap-2 rounded-md bg-amber-400 px-3 py-2 text-sm font-medium text-white hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
          >
            <Gift className="h-4 w-4" />
            {suggesting ? "Getting Suggestions…" : "Hediye Önerileri"}
          </button>
        </div>
      </div>

      {!editing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-800">
              İlgi alanları
            </h2>
            {formInitial.interests.length ? (
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {formInitial.interests.map((it, idx) => (
                  <li key={idx}>{it}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">İlgi alanı girilmemiş</p>
            )}
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-800">Açıklama</h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {persona.description || "—"}
            </p>
          </div>
        </div>
      )}

      {editing && (
        <div className="border rounded-md p-4">
          <PersonaForm
            initialData={formInitial}
            submitLabel="Save Changes"
            onSubmit={handleUpdate}
          />
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-800">
          Hediye Önerileri
        </h2>
        {suggestions.length ? (
          <ul className="list-disc pl-5 text-sm text-gray-700">
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">Henüz öneri yok.</p>
        )}
      </div>

      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Kontrol Paneline git
        </Link>
      </div>
    </div>
  );
};

export default PersonaDetailPage;
