import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../lib";
import {
  Gift,
  Trash,
  PlusCircle,
  Calendar,
  Tag,
  Pencil,
  Check,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import PersonaForm, { type PersonaFormValues } from "../components/PersonaForm";

// Local Persona type to map common fields
type Persona = {
  id: string;
  name: string;
  description?: string;
  interests?: string[] | string;
  // Notes can come as string, string[] | array of objects from Supabase/BE
  notes?: string | string[] | Array<Record<string, any>>;
  birthDate?: string; // ISO date (YYYY-MM-DD)
  birth_date?: string; // alt naming
  dob?: string; // alt naming
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
};

type PersonaEvent = {
  id: string;
  persona_id: string;
  title: string;
  details?: string;
  category?: string;
  type?: string;
  tags?: string[];
  occurred_at?: string;
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
  if (Array.isArray(raw))
    return raw.filter((x) => typeof x === "string") as string[];
  if (typeof raw === "string") {
    const str = raw.trim();
    // Try JSON parse first (e.g., "[\"books\",\"music\"]")
    try {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed)) {
        return parsed.filter((x) => typeof x === "string") as string[];
      }
    } catch {
      /* not JSON, fallback split */
    }
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
  notes:
    typeof p?.description === "string" && p.description
      ? p.description
      : normalizeNotes(p?.notes),
});

// PersonaDetailPage component
const PersonaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggesting, setSuggesting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Events state
  const [events, setEvents] = useState<PersonaEvent[]>([]);
  const [evLoading, setEvLoading] = useState(false);
  const [evError, setEvError] = useState<string | null>(null);

  // New event form state (simplified: title, date, details)
  const [evTitle, setEvTitle] = useState("");
  const [evDetails, setEvDetails] = useState("");
  const [evDate, setEvDate] = useState("");

  // Inline edit state
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editEventDraft, setEditEventDraft] = useState<Partial<PersonaEvent>>(
    {}
  );

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

  const loadEvents = useCallback(async () => {
    if (!id) return;
    setEvLoading(true);
    setEvError(null);
    try {
      const { data, error } = await api.events.list(id);
      if (error) throw new Error(error.message || "Failed to load events");
      setEvents((data as PersonaEvent[]) || []);
    } catch (e: any) {
      setEvError(e?.message || "Failed to load events");
    } finally {
      setEvLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPersona();
    loadEvents();
  }, [fetchPersona, loadEvents]);

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
          json?.message ||
            json?.error ||
            `Failed to update persona (${res.status})`
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

  const handleDelete = async () => {
    if (!id) return;
    const result = await Swal.fire({
      title: "Silmek istediğinize emin misiniz?",
      text: "Bu işlem geri alınamaz.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Evet, sil",
      cancelButtonText: "İptal",
      reverseButtons: true,
      focusCancel: true,
    });

    if (!result.isConfirmed) return;

    setDeleting(true);
    setError(null);
    try {
      const { error } = await api.personas.delete(id);
      if (error) throw new Error(error.message || "Failed to delete persona");
      await Swal.fire({
        title: "Silindi",
        text: "Persona başarıyla silindi.",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
      navigate("/dashboard");
    } catch (e: any) {
      setError(e?.message || "Failed to delete persona");
      await Swal.fire({
        title: "Hata",
        text: e?.message || "Silme işlemi başarısız oldu.",
        icon: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!evTitle.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Başlık gerekli",
        timer: 1200,
        showConfirmButton: false,
      });
      return;
    }
    try {
      const payload = {
        title: evTitle.trim(),
        details: evDetails.trim() || undefined,
        occurred_at: evDate || undefined,
      };
      const { error } = await api.events.create(id, payload);
      if (error) throw new Error(error.message || "Failed to add event");
      setEvTitle("");
      setEvDetails("");
      setEvDate("");
      await loadEvents();
      await Swal.fire({
        icon: "success",
        title: "Eklendi",
        timer: 900,
        showConfirmButton: false,
      });
    } catch (e: any) {
      await Swal.fire({
        icon: "error",
        title: "Hata",
        text: e?.message || "Ekleme başarısız",
      });
    }
  };

  const handleDeleteEvent = async (eid: string) => {
    const res = await Swal.fire({
      title: "Silinsin mi?",
      text: "Bu etkinliği silmek istediğinizden emin misiniz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Evet, sil",
      cancelButtonText: "İptal",
      reverseButtons: true,
      focusCancel: true,
    });

    if (!res.isConfirmed) return;

    try {
      const { error } = await api.events.delete(eid);
      if (error) throw new Error(error.message || "Failed to delete event");
      await loadEvents();
      await Swal.fire({
        icon: "success",
        title: "Silindi",
        timer: 900,
        showConfirmButton: false,
      });
    } catch (e: any) {
      await Swal.fire({
        icon: "error",
        title: "Hata",
        text: e?.message || "Silme başarısız",
      });
    }
  };

  const startEditEvent = (e: PersonaEvent) => {
    setEditingEventId(e.id);
    setEditEventDraft({ ...e });
  };

  const cancelEditEvent = () => {
    setEditingEventId(null);
    setEditEventDraft({});
  };

  const saveEditEvent = async () => {
    if (!editingEventId) return;
    try {
      const payload: any = {
        title: editEventDraft.title?.trim(),
        details: editEventDraft.details?.trim() || undefined,
        occurred_at: editEventDraft.occurred_at || undefined,
      };
      const { error } = await api.events.update(editingEventId, payload);
      if (error) throw new Error(error.message || "Failed to update event");
      setEditingEventId(null);
      setEditEventDraft({});
      await loadEvents();
      await Swal.fire({
        icon: "success",
        title: "Güncellendi",
        timer: 900,
        showConfirmButton: false,
      });
    } catch (e: any) {
      await Swal.fire({
        icon: "error",
        title: "Hata",
        text: e?.message || "Güncelleme başarısız",
      });
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
          <h1 className="text-xl font-semibold" style={{ color: 'var(--gm-text)' }}>
            {persona.name}
          </h1>
          {formInitial.birthDate && (
            <p className="text-sm" style={{ color: '#4b5563' }}>
              Birth Date: {formInitial.birthDate}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditing((v) => !v)}
            className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-white hover:opacity-95 focus:outline-none focus:ring-2"
            style={{ backgroundColor: 'var(--gm-primary)' }}
          >
            {editing ? "Cancel" : "Personayı Düzenle"}
          </button>
          <button
            onClick={handleSuggest}
            disabled={suggesting}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 disabled:opacity-50"
            style={{ backgroundColor: 'var(--gm-secondary)' }}
          >
            <Gift className="h-4 w-4" />
            {suggesting ? "Getting Suggestions…" : "Hediye Önerileri"}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 disabled:opacity-50"
            style={{ backgroundColor: '#E44848' }}
          >
            <Trash className="h-4 w-4" />
            {deleting ? "Siliniyor…" : "Sil"}
          </button>
        </div>
      </div>

      {!editing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h2 className="text-sm font-semibold" style={{ color: '#1f2937' }}>
              İlgi alanları
            </h2>
            {formInitial.interests.length ? (
              <ul className="list-disc pl-5 text-sm" style={{ color: '#374151' }}>
                {formInitial.interests.map((it, idx) => (
                  <li key={idx}>{it}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm" style={{ color: '#6b7280' }}>İlgi alanı girilmemiş</p>
            )}
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold" style={{ color: '#1f2937' }}>Açıklama</h2>
            <p className="text-sm whitespace-pre-wrap" style={{ color: '#374151' }}>
              {persona.description || "—"}
            </p>
          </div>
        </div>
      )}

      {editing && (
        <div className="border rounded-xl p-4" style={{ backgroundColor: 'var(--gm-bg-light)' }}>
          <PersonaForm
            initialData={formInitial}
            submitLabel="Save Changes"
            onSubmit={handleUpdate}
          />
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-sm font-semibold" style={{ color: '#1f2937' }}>
          Hediye Önerileri
        </h2>
        {suggestions.length ? (
          <ul className="list-disc pl-5 text-sm" style={{ color: '#374151' }}>
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm" style={{ color: '#6b7280' }}>Henüz öneri yok.</p>
        )}
      </div>

      {/* Events Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold" style={{ color: '#1f2937' }}>
          Yeni Etkinlikler
        </h2>
        <form
          onSubmit={handleAddEvent}
          className="grid grid-cols-1 md:grid-cols-5 gap-3"
        >
          {/* Title input */}
          <input
            type="text"
            value={evTitle}
            onChange={(e) => setEvTitle(e.target.value)}
            placeholder="Başlık (örn: Gitar kursuna başladı)"
            className="md:col-span-3 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: '#e5e7eb', backgroundColor: '#ffffff' }}
          />

          {/* Date input */}
          <input
            type="date"
            value={evDate}
            onChange={(e) => setEvDate(e.target.value)}
            className="md:col-span-1 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: '#e5e7eb', backgroundColor: '#ffffff' }}
          />

          {/* Submit */}
          <button
            type="submit"
            className="md:col-span-1 inline-flex items-center justify-center rounded-xl text-white text-sm px-3 py-2 hover:opacity-95"
            style={{ backgroundColor: 'var(--gm-primary)' }}
          >
            <PlusCircle className="h-4 w-4 mr-1" /> Ekle
          </button>

          {/* Description */}
          <textarea
            value={evDetails}
            onChange={(e) => setEvDetails(e.target.value)}
            placeholder="Açıklama (örn: 16 Ekim'de başladı, çok eğleniyor)"
            rows={2}
            className="md:col-span-5 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: '#e5e7eb', backgroundColor: '#ffffff' }}
          />
        </form>

        {evError && (
          <div className="rounded-xl p-3 text-sm border" style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', borderColor: '#FCA5A5' }}>
            {evError}
          </div>
        )}

        <div className="mt-4">
          {evLoading ? (
            <div className="text-sm" style={{ color: '#4b5563' }}>Loading events…</div>
          ) : (
            events.map((e) => (
              <div
                key={e.id}
                className="rounded-2xl border bg-white p-4 shadow-sm"
                style={{ borderColor: '#e5e7eb' }}
              >
                {editingEventId === e.id ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={editEventDraft.title || ""}
                        onChange={(ev) =>
                          setEditEventDraft((d) => ({
                            ...d,
                            title: ev.target.value,
                          }))
                        }
                        className="rounded-xl border px-2 py-1 text-sm"
                        style={{ borderColor: '#e5e7eb' }}
                        placeholder="Başlık"
                      />
                      <input
                        type="date"
                        value={editEventDraft.occurred_at || ""}
                        onChange={(ev) =>
                          setEditEventDraft((d) => ({
                            ...d,
                            occurred_at: ev.target.value,
                          }))
                        }
                        className="rounded-xl border px-2 py-1 text-sm"
                        style={{ borderColor: '#e5e7eb' }}
                      />
                    </div>
                    <textarea
                      value={editEventDraft.details || ""}
                      onChange={(ev) =>
                        setEditEventDraft((d) => ({
                          ...d,
                          details: ev.target.value,
                        }))
                      }
                      className="w-full rounded-xl border px-2 py-1 text-sm"
                      style={{ borderColor: '#e5e7eb' }}
                      rows={2}
                      placeholder="Açıklama"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={saveEditEvent}
                        className="inline-flex items-center text-xs text-green-600 hover:text-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" /> Kaydet
                      </button>
                      <button
                        onClick={cancelEditEvent}
                        className="inline-flex items-center text-xs text-gray-600 hover:text-gray-700"
                      >
                        <X className="h-4 w-4 mr-1" /> İptal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium flex items-center gap-2" style={{ color: '#111827' }}>
                        <Calendar className="h-4 w-4" style={{ color: '#6b7280' }} />
                        {e.title}
                      </div>
                      <div className="text-xs mt-1" style={{ color: '#4b5563' }}>
                        {e.occurred_at || "—"}
                        {e.category ? ` · ${e.category}` : ""}
                        {e.type ? ` · ${e.type}` : ""}
                      </div>
                      {e.details && (
                        <div className="text-sm mt-2 whitespace-pre-wrap" style={{ color: '#374151' }}>
                          {e.details}
                        </div>
                      )}
                      {e.tags && e.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {e.tags.map((t, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center text-xs px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: 'rgba(255,158,234,0.15)', color: '#B2419D' }}
                            >
                              <Tag className="h-3 w-3 mr-1" /> {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => startEditEvent(e)}
                        className="inline-flex items-center text-xs"
                        style={{ color: 'var(--gm-primary)' }}
                      >
                        <Pencil className="h-4 w-4 mr-1" /> Düzenle
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(e.id)}
                        className="inline-flex items-center text-xs"
                        style={{ color: '#dc2626' }}
                      >
                        <Trash className="h-4 w-4 mr-1" /> Sil
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center rounded-xl border px-3 py-2 text-sm font-medium bg-white hover:bg-gray-50"
          style={{ color: '#374151', borderColor: '#e5e7eb' }}
        >
          Kontrol Paneline git
        </Link>
      </div>
    </div>
  );
}

export default PersonaDetailPage;
