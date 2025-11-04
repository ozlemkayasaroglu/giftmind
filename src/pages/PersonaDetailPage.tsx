import React, { useCallback, useEffect, useState } from "react";
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
  ArrowLeft,
  Briefcase,
  Flag,
  AlertCircle,
  User as UserIcon,
  Sparkles,
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
  personaId: string;
  title: string;
  details?: string;
  category?: string;
  type?: string;
  tags?: string[];
  occurredAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

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

// Helper to compute age from ISO birth date (used in UI)
const computeAge = (iso?: string | null) => {
  if (!iso) return null;
  try {
    const b = new Date(iso);
    const diff = Date.now() - b.getTime();
    const age = Math.floor(diff / (365.25 * 24 * 3600 * 1000));
    return Number.isFinite(age) ? age : null;
  } catch {
    return null;
  }
};

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
  // Tabs for redesigned UI
  const [activeTab, setActiveTab] = useState<
    "overview" | "insights" | "preferences" | "notes" | "events"
  >("overview");

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
      const payload: any = {
        name: values.name,
        description: values.notes || undefined,
        notes: values.notes || undefined,
        interests: Array.isArray(values.interests) && values.interests.length ? values.interests : undefined,
        birthDate: values.birthDate || undefined,
      };

      const { error } = await api.personas.update(id, payload);
      if (error) throw new Error(error.message || 'Failed to update persona');

      await fetchPersona();
      setEditing(false);
    } catch (e: any) {
      setError(e?.message || 'Failed to update');
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
        occurred_at: (editEventDraft as any).occurredAt || undefined,
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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "radial-gradient(1200px circle at 50% -20%, rgba(35,201,255,0.14), transparent 40%), linear-gradient(180deg, #0C0C1E 0%, #0B0B1A 100%)",
        }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: "var(--gm-secondary)" }}
          />
          <p className="mt-4" style={{ color: "rgba(255,255,255,0.75)" }}>
            Loading persona…
          </p>
        </div>
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
  const ageText = computeAge(formInitial.birthDate);
  const roleText =
    (persona as any).role || (persona as any).job_title || (persona as any).profession || "—";
  const goalText = (persona as any).goal || (persona as any).primary_goal || "—";
  const challengeText =
    (persona as any).challenge || (persona as any).budget_max ? "Limited budget" : "—";

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(1200px circle at 50% -20%, rgba(35,201,255,0.14), transparent 40%), linear-gradient(180deg, #0C0C1E 0%, #0B0B1A 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* Top actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-2 text-white/80">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: "var(--gm-accent)" }}
            />
            <span className="font-medium">giftMind</span>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-white hover:opacity-95"
            style={{ backgroundColor: "var(--gm-primary)" }}
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </div>

        {/* Header: name + subtitle */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold" style={{ color: "#FFFFFF" }}>
            {persona.name}
          </h1>
          <p className="mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>
            {(persona as any).title || (persona as any).headline || "Creative Strategist"}
          </p>
        </div>

        {/* Info Card */}
        <div
          className="rounded-3xl p-5 md:p-6 mb-6"
          style={{
            backgroundColor: "#12132A",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
            {/* Left: avatar + facts */}
            <div className="md:col-span-2 flex items-center gap-5 md:gap-6">
              {/* Avatar */}
              <div
                className="h-20 w-20 md:h-24 md:w-24 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(91,95,241,0.3), rgba(0,201,167,0.25))",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <UserIcon className="h-9 w-9 opacity-90" />
              </div>

              {/* Facts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex items-center gap-2" style={{ color: "#C9CBF0" }}>
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#2A2B44" }}
                  >
                    <Gift className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm">
                    <span className="opacity-80">Age:</span>{" "}
                    <span className="text-white/90 font-medium">{ageText ?? "—"}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2" style={{ color: "#C9CBF0" }}>
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#2A2B44" }}
                  >
                    <Briefcase className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm">
                    <span className="opacity-80">Role:</span>{" "}
                    <span className="text-white/90 font-medium">{roleText}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2" style={{ color: "#C9CBF0" }}>
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#2A2B44" }}
                  >
                    <Flag className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm">
                    <span className="opacity-80">Goal:</span>{" "}
                    <span className="text-white/90 font-medium">{goalText}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2" style={{ color: "#C9CBF0" }}>
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#2A2B44" }}
                  >
                    <AlertCircle className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm">
                    <span className="opacity-80">Challenge:</span>{" "}
                    <span className="text-white/90 font-medium">{challengeText}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: placeholder chart */}
            <div className="hidden md:block">
              <div
                className="rounded-2xl h-44 w-full"
                style={{
                  background: "linear-gradient(135deg, #5B5FF1, #00C9A7)",
                  boxShadow: "0 20px 45px rgba(91,95,241,0.25)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4">
          <div className="flex items-center gap-6 border-b border-white/10">
            {(
              [
                { key: "overview", label: "Overview" },
                { key: "insights", label: "Behavioral Insights" },
                { key: "preferences", label: "Preferences" },
                { key: "notes", label: "Notes/AI Suggestions" },
                { key: "events", label: "Events" },
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className="relative py-3 text-sm font-medium"
                style={{ color: activeTab === t.key ? "#FFFFFF" : "rgba(255,255,255,0.6)" }}
              >
                {t.label}
                {activeTab === t.key && (
                  <span
                    className="absolute left-0 -bottom-px h-0.5 w-full"
                    style={{ backgroundColor: "var(--gm-secondary)" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Panels */}
        <div className="mb-8">
          {activeTab === "overview" && (
            <div
              className="rounded-2xl p-5 md:p-6"
              style={{
                backgroundColor: "#12132A",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p className="text-sm leading-6" style={{ color: "#C9CBF0" }}>
                {persona.description ||
                  "A narrative summary of the persona, their background, and core motivations. This section provides a detailed look into who this person is, what drives them, and the context of their life."}
              </p>
            </div>
          )}

          {activeTab === "insights" && (
            <div
              className="rounded-2xl p-5 md:p-6"
              style={{ backgroundColor: "#12132A", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-sm" style={{ color: "#C9CBF0" }}>
                Insights coming soon.
              </p>
            </div>
          )}

          {activeTab === "preferences" && (
            <div
              className="rounded-2xl p-5 md:p-6"
              style={{ backgroundColor: "#12132A", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {formInitial.interests.length ? (
                <div className="flex flex-wrap gap-2">
                  {formInitial.interests.map((it, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: "rgba(255,158,234,0.12)",
                        color: "#ffb7ef",
                        border: "1px solid rgba(255,158,234,0.25)",
                      }}
                    >
                      <Tag className="h-3 w-3 mr-1" /> {it}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{ color: "#C9CBF0" }}>
                  İlgi alanı girilmemiş.
                </p>
              )}
            </div>
          )}

          {activeTab === "notes" && (
            <div
              className="rounded-2xl p-5 md:p-6 space-y-4"
              style={{ backgroundColor: "#12132A", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium" style={{ color: "#FFFFFF" }}>
                  AI Suggestions
                </h3>
                <button
                  onClick={handleSuggest}
                  disabled={suggesting}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                  style={{ backgroundColor: "var(--gm-secondary)" }}
                >
                  <Sparkles className="h-4 w-4" />
                  {suggesting ? "Generating…" : "Generate"}
                </button>
              </div>
              {suggestions.length ? (
                <ul className="list-disc pl-5 text-sm" style={{ color: "#C9CBF0" }}>
                  {suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm" style={{ color: "#C9CBF0" }}>
                  Henüz öneri yok.
                </p>
              )}
            </div>
          )}

          {activeTab === "events" && (
            <div className="space-y-4">
              {/* Existing Events UI moved under Events tab */}
              <form
                onSubmit={handleAddEvent}
                className="grid grid-cols-1 md:grid-cols-5 gap-3"
              >
                {/* Title */}
                <input
                  type="text"
                  value={evTitle}
                  onChange={(e) => setEvTitle(e.target.value)}
                  placeholder="Başlık (örn: Gitar kursuna başladı)"
                  className="md:col-span-3 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: "#2A2B3F", backgroundColor: "#17182B", color: "#E5E7EB" }}
                />
                {/* Date */}
                <input
                  type="date"
                  value={evDate}
                  onChange={(e) => setEvDate(e.target.value)}
                  className="md:col-span-1 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: "#2A2B3F", backgroundColor: "#17182B", color: "#E5E7EB" }}
                />
                {/* Submit */}
                <button
                  type="submit"
                  className="md:col-span-1 inline-flex items-center justify-center rounded-xl text-white text-sm px-3 py-2 hover:opacity-95"
                  style={{ backgroundColor: "var(--gm-primary)" }}
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
                  style={{ borderColor: "#2A2B3F", backgroundColor: "#17182B", color: "#E5E7EB" }}
                />
              </form>

              {evError && (
                <div
                  className="rounded-xl p-3 text-sm border"
                  style={{ backgroundColor: "#3b1d2a", color: "#ff9eb8", borderColor: "rgba(255,158,186,0.3)" }}
                >
                  {evError}
                </div>
              )}

              <div className="mt-2 space-y-3">
                {evLoading ? (
                  <div className="text-sm" style={{ color: "#C9CBF0" }}>
                    Loading events…
                  </div>
                ) : (
                  events.map((e) => (
                    <div
                      key={e.id}
                      className="rounded-2xl border p-4"
                      style={{ backgroundColor: "#12132A", borderColor: "rgba(255,255,255,0.06)" }}
                    >
                      {editingEventId === e.id ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={editEventDraft.title || ""}
                              onChange={(ev) =>
                                setEditEventDraft((d) => ({ ...d, title: ev.target.value }))
                              }
                              className="rounded-xl border px-2 py-1 text-sm"
                              style={{ borderColor: "#2A2B3F", backgroundColor: "#17182B", color: "#E5E7EB" }}
                              placeholder="Başlık"
                            />
                            <input
                              type="date"
                              value={editEventDraft.occurredAt || ""}
                              onChange={(ev) =>
                                setEditEventDraft((d) => ({ ...d, occurredAt: ev.target.value }))
                              }
                              className="rounded-xl border px-2 py-1 text-sm"
                              style={{ borderColor: "#2A2B3F", backgroundColor: "#17182B", color: "#E5E7EB" }}
                            />
                          </div>
                          <textarea
                            value={editEventDraft.details || ""}
                            onChange={(ev) => setEditEventDraft((d) => ({ ...d, details: ev.target.value }))}
                            className="w-full rounded-xl border px-2 py-1 text-sm"
                            rows={2}
                            style={{ borderColor: "#2A2B3F", backgroundColor: "#17182B", color: "#E5E7EB" }}
                            placeholder="Açıklama"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={saveEditEvent}
                              className="inline-flex items-center text-xs text-green-400 hover:text-green-300"
                            >
                              <Check className="h-4 w-4 mr-1" /> Kaydet
                            </button>
                            <button
                              onClick={cancelEditEvent}
                              className="inline-flex items-center text-xs text-gray-300 hover:text-gray-200"
                            >
                              <X className="h-4 w-4 mr-1" /> İptal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium flex items-center gap-2" style={{ color: "#FFFFFF" }}>
                              <Calendar className="h-4 w-4" style={{ color: "#9CA3AF" }} />
                              {e.title}
                            </div>
                            <div className="text-xs mt-1" style={{ color: "#C9CBF0" }}>
                              {e.occurredAt || "—"}
                              {e.category ? ` · ${e.category}` : ""}
                              {e.type ? ` · ${e.type}` : ""}
                            </div>
                            {e.details && (
                              <div className="text-sm mt-2 whitespace-pre-wrap" style={{ color: "#C9CBF0" }}>
                                {e.details}
                              </div>
                            )}
                            {e.tags && e.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {e.tags.map((t, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center text-xs px-2 py-0.5 rounded-full"
                                    style={{ backgroundColor: "rgba(255,158,234,0.15)", color: "#ffb7ef" }}
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
                              style={{ color: "var(--gm-secondary)" }}
                            >
                              <Pencil className="h-4 w-4 mr-1" /> Düzenle
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(e.id)}
                              className="inline-flex items-center text-xs"
                              style={{ color: "#E44848" }}
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
          )}
        </div>

        {/* Edit mode overlay card */}
        {editing && (
          <div
            className="rounded-2xl p-4 md:p-5 mb-8"
            style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <PersonaForm
              initialData={formInitial}
              submitLabel="Save Changes"
              onSubmit={handleUpdate}
            />
          </div>
        )}

        {/* Bottom actions */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            ← Back
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditing((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white hover:opacity-95"
              style={{ backgroundColor: "var(--gm-primary)" }}
            >
              {editing ? "Cancel" : "Edit Persona"}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              style={{ backgroundColor: "#E44848" }}
            >
              {deleting ? "Deleting…" : "Delete Persona"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonaDetailPage;
