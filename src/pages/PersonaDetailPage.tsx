import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../lib";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import type { PersonaFormValues } from "../components/PersonaForm";
import {
  User as UserIcon,
  Gift,
  Briefcase,
  Flag,
  AlertCircle,
  Tag,
} from "lucide-react";
import GiftSuggestions from "../components/GiftSuggestions";
import PersonaForm from "../components/PersonaForm";

// Local Persona type to map common fields
type Persona = {
  id: string;
  name: string;
  description?: string;
  interests?: string[];
  // Notes are stored as a string in the form
  notes?: string;
  birth_date?: string; // ISO date (YYYY-MM-DD)
  role?: string;
  goals?: string;
  challenges?: string;
  behavioral_insights?: string;
  budget_min?: number;
  budget_max?: number;
  personality_traits?: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
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

// Normalize notes from string | string[] | object[] -> string (unused but kept for future use)

const normalizePersonaToForm = (p: Persona | null): PersonaFormValues => ({
  name: p?.name ?? "",
  birth_date: p?.birth_date || "",
  interests: normalizeInterests(p?.interests),
  notes: typeof p?.notes === "string" ? p.notes : "",
  role: p?.role || "",
  goals: p?.goals || "",
  challenges: p?.challenges || "",
  behavioral_insights: p?.behavioral_insights || "",
  budget_min: p?.budget_min,
  budget_max: p?.budget_max,
  personality_traits: Array.isArray(p?.personality_traits)
    ? p.personality_traits
    : [],
  description: p?.description || "",
  is_active: p?.is_active ?? true,
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
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "insights" | "preferences" | "notes"
  >("overview");

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
      const payload: any = {
        name: values.name,
        birth_date: values.birth_date || undefined,
        interests: values.interests?.length ? values.interests : undefined,
        notes: values.notes || undefined,
        description: values.description || undefined,
        role: values.role || undefined,
        goals: values.goals || undefined,
        challenges: values.challenges || undefined,
        behavioral_insights: values.behavioral_insights || undefined,
        budget_min: values.budget_min,
        budget_max: values.budget_max,
        personality_traits: values.personality_traits?.length
          ? values.personality_traits
          : undefined,
        is_active: values.is_active ?? true,
      };

      const { error } = await api.personas.update(id, payload);
      if (error) throw new Error(error.message || "Failed to update persona");

      await fetchPersona();
      setEditing(false);
    } catch (e: any) {
      setError(e?.message || "Failed to update");
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
  const ageText = computeAge(formInitial.birth_date);
  const roleText =
    (persona as any).role ||
    (persona as any).job_title ||
    (persona as any).profession ||
    "—";
  const goalText =
    (persona as any).goal || (persona as any).primary_goal || "—";
  const challengeText =
    (persona as any).challenge || (persona as any).budget_max
      ? "Sınırlı bütçe"
      : "—";

  // Overview tab için gerekli değişkenler
  const overviewData = {
    name: persona.name,
    age: ageText,
    role: roleText,
    interests: formInitial.interests,
    budget_min: formInitial.budget_min,
    budget_max: formInitial.budget_max,
    goals: formInitial.goals,
    challenges: formInitial.challenges,
    behavioral_insights: formInitial.behavioral_insights,
    notes: formInitial.notes,
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(1200px circle at 50% -20%, rgba(35,201,255,0.14), transparent 40%), linear-gradient(180deg, #0C0C1E 0%, #0B0B1A 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* Header: name + subtitle */}
        <div className="mb-6">
          <h1
            className="text-3xl md:text-4xl font-bold"
            style={{ color: "#FFFFFF" }}
          >
            {persona.name}
          </h1>
          <p className="mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>
            {(persona as any).role || "—"}
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
                <div
                  className="flex items-center gap-2"
                  style={{ color: "#C9CBF0" }}
                >
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#2A2B44" }}
                  >
                    <Gift className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm">
                    <span className="opacity-80">Yaş:</span>{" "}
                    <span className="text-white/90 font-medium">
                      {ageText ?? "—"}
                    </span>
                  </span>
                </div>
                <div
                  className="flex items-center gap-2"
                  style={{ color: "#C9CBF0" }}
                >
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#2A2B44" }}
                  >
                    <Briefcase className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm">
                    <span className="opacity-80">Meslek:</span>{" "}
                    <span className="text-white/90 font-medium">
                      {roleText}
                    </span>
                  </span>
                </div>
                <div
                  className="flex items-center gap-2"
                  style={{ color: "#C9CBF0" }}
                >
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#2A2B44" }}
                  >
                    <Flag className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm">
                    <span className="opacity-80">Hedef:</span>{" "}
                    <span className="text-white/90 font-medium">
                      {goalText}
                    </span>
                  </span>
                </div>
                <div
                  className="flex items-center gap-2"
                  style={{ color: "#C9CBF0" }}
                >
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#2A2B44" }}
                  >
                    <AlertCircle className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm">
                    <span className="opacity-80">Bütçe:</span>{" "}
                    <span className="text-white/90 font-medium">
                      {challengeText}
                    </span>
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
                { key: "overview", label: "Özet" },
                { key: "insights", label: "Davranışsal İnançlar" },
                { key: "preferences", label: "Tercihler" },
                { key: "notes", label: "Notlar/AI Önerileri" },
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className="relative py-3 text-sm font-medium"
                style={{
                  color:
                    activeTab === t.key ? "#FFFFFF" : "rgba(255,255,255,0.6)",
                }}
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
              className="rounded-2xl p-4 mb-6"
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="border rounded-xl p-4 bg-light-200">
                <h4 className="text-sm font-semibold mb-2 text-white">
                  Özet Önizleme
                </h4>
                <div className="text-sm mb-2 flex">
                  <strong className="text-white/60">İsim:</strong>
                  <div className="mt-1 whitespace-pre-wrap text-xs text-teal-400 text-bold ml-2">
                    {overviewData.name || "—"}
                  </div>
                </div>
                <div className="text-sm mb-2 flex items-center">
                  <strong className="text-white/60">Yaş:</strong>
                  <div className="ml-2 whitespace-pre-wrap text-xs text-teal-400 text-bold">
                    {overviewData.age ?? "—"}
                  </div>
                </div>
                <div className="text-sm mb-2 flex">
                  <strong className="text-white/60">Rol:</strong>
                  <div className="mt-1 whitespace-pre-wrap text-xs text-teal-400 text-bold ml-2">
                    {overviewData.role || "—"}
                  </div>
                </div>
                <div className="text-sm mb-2 flex">
                  <strong className="text-white/60">İlgi Alanları:</strong>
                  <div className="mt-1 whitespace-pre-wrap text-xs text-teal-400 text-bold ml-2">
                    {overviewData.interests.length
                      ? overviewData.interests.join(", ")
                      : "—"}
                  </div>
                </div>
                <div className="text-sm mb-2 flex">
                  <strong className="text-white/60">Bütçe:</strong>
                  <div className="mt-1 whitespace-pre-wrap text-xs text-teal-400 text-bold ml-2">
                    {overviewData.budget_min || "—"} —{" "}
                    {overviewData.budget_max || "—"}
                  </div>
                </div>
                <div className="text-sm mt-2 flex">
                  <strong className="text-white/60">Hedefler:</strong>
                  <div className="mt-1 whitespace-pre-wrap text-xs text-teal-400 text-bold ml-2">
                    {overviewData.goals || "—"}
                  </div>
                </div>
                <div className="text-sm mt-2 flex">
                  <strong className="text-white/60">Zorluklar:</strong>
                  <div className="mt-1 whitespace-pre-wrap text-xs text-teal-400 text-bold ml-2">
                    {overviewData.challenges || "—"}
                  </div>
                </div>
                <div className="text-sm mt-2 flex">
                  <strong className="text-white/60">
                    Davranışsal İçgörüler:
                  </strong>
                  <div className="mt-1 whitespace-pre-wrap text-xs text-teal-400 text-bold ml-2">
                    {overviewData.behavioral_insights || "—"}
                  </div>
                </div>
                <div className="text-sm mt-2 flex">
                  <strong className="text-white/60">Notlar:</strong>
                  <div className="mt-1 whitespace-pre-wrap text-xs text-teal-400 text-bold ml-2">
                    {overviewData.notes || "—"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "insights" && (
            <div
              className="rounded-2xl p-5 md:p-6"
              style={{
                backgroundColor: "#12132A",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p className="text-sm" style={{ color: "#C9CBF0" }}>
                Insights coming soon.
              </p>
            </div>
          )}

          {activeTab === "preferences" && (
            <div
              className="rounded-2xl p-5 md:p-6"
              style={{
                backgroundColor: "#12132A",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
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
            // <div
            //   className="rounded-2xl p-5 md:p-6 space-y-4"
            //   style={{
            //     backgroundColor: "#12132A",
            //     border: "1px solid rgba(255,255,255,0.06)",
            //   }}
            // >
            //   <div className="flex items-center justify-between">
            //     <h3
            //       className="text-sm font-medium"
            //       style={{ color: "#FFFFFF" }}
            //     >
            //       AI Suggestions
            //     </h3>
            //     <button
            //       onClick={handleSuggest}
            //       disabled={suggesting}
            //       className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
            //       style={{ backgroundColor: "var(--gm-secondary)" }}
            //     >
            //       <Sparkles className="h-4 w-4" />
            //       {suggesting ? "Generating…" : "Generate"}
            //     </button>
            //   </div>
            //   {suggestions.length ? (
            //     <ul
            //       className="list-disc pl-5 text-sm"
            //       style={{ color: "#C9CBF0" }}
            //     >
            //       {suggestions.map((s, i) => (
            //         <li key={i}>{s}</li>
            //       ))}
            //     </ul>
            //   ) : (
            //     <p className="text-sm" style={{ color: "#C9CBF0" }}>
            //       Henüz öneri yok.
            //     </p>
            //   )}
            // </div>
            <GiftSuggestions persona={persona} />
          )}
        </div>

        {/* Edit mode overlay card */}
        {editing && (
          <div
            className="rounded-2xl p-4 md:p-5 mb-8"
            style={{
              backgroundColor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
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
