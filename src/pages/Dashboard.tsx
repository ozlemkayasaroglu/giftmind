// Dashboard.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, X } from "lucide-react";
import { api } from "../lib";
import type { Persona } from "../lib/types";
import type { PersonaFormValues } from "../components/PersonaForm";
import PersonaForm from "../components/PersonaForm";

type AddPersonaModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onPersonaAdded: () => void;
};

/**
 * AddPersonaModal
 * - İçeride PersonaForm kullanır
 * - Dirty-check (kaydedilmemiş değişiklik varsa kapatma öncesi uyarı)
 * - Escape ile kapatma, body scroll lock
 */
const AddPersonaModal: React.FC<AddPersonaModalProps> = ({
  isOpen,
  onClose,
  onPersonaAdded,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsaved, setHasUnsaved] = useState(false);

  // body scroll lock
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // escape to close (with dirty-check)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) attemptClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, hasUnsaved]);

  const attemptClose = () => {
    if (hasUnsaved) {
      const ok = window.confirm(
        "Kaydedilmemiş değişiklikler var. Pencereyi kapatmak istediğinize emin misiniz?"
      );
      if (!ok) return;
    }
    setError(null);
    setHasUnsaved(false);
    onClose();
  };

  const handleSubmit = async (values: PersonaFormValues) => {
    setLoading(true);
    setError(null);

    // map fields to backend payload (backend alan adlarına göre düzenle)
    const payload: any = {
      name: values.name,
      role: values.role,
      birth_date: values.birth_date,
      interests: values.interests?.length ? values.interests : undefined,
      description: values.description,
      goals: values.goals,
      challenges: values.challenges,
      behavioral_insights: values.behavioral_insights,
      budget_min: values.budget_min,
      budget_max: values.budget_max,
      personality_traits: values.personality_traits,
      is_active: values.is_active ?? true,
      notes: values.notes,
    };

    try {
      const { error: apiError } = await api.personas.create(payload);
      if (apiError) {
        setError(apiError.message || "Persona oluşturulamadı");
        return;
      }

      setHasUnsaved(false);
      onPersonaAdded();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Persona oluşturulamadı");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = () => {
    setHasUnsaved(true);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(1200px circle at 50% -20%, rgba(35,201,255,0.12), transparent 40%), rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
      }}
      onClick={attemptClose}
    >
      {/* backdrop clickable area handled by parent div onClick */}
      <div
        className="relative z-10 w-full max-w-3xl mx-auto rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0E0F1A",
          border: "1px solid rgba(255, 255, 255, 0.04)",
        }}
      >
        {/* header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "rgba(255,255,255,0.03)" }}
        >
          <div>
            <h3 className="text-lg font-semibold text-white">
              Yeni Persona Oluştur
            </h3>
            <p className="text-sm text-white/60">
              Kişisel bilgileri doldurun — daha iyi hediye önerileri için
              ayrıntı ekleyin.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {hasUnsaved && (
              <span className="text-xs text-yellow-300">
                Kaydedilmemiş değişiklik
              </span>
            )}
            <button
              aria-label="Kapat"
              onClick={attemptClose}
              className="p-2 rounded-md hover:bg-white/5"
            >
              <X className="w-5 h-5 text-white/80" />
            </button>
          </div>
        </div>

        {/* body */}
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {error && (
            <div
              className="mb-4 rounded-md p-3 text-sm border"
              style={{
                backgroundColor: "rgba(219,68,55,0.08)",
                color: "#FF6B6B",
                borderColor: "rgba(255,107,107,0.2)",
              }}
            >
              {error}
            </div>
          )}

          {/* PersonaForm - onSubmit handles saving */}
          <PersonaForm
            onSubmit={handleSubmit}
            initialData={{}}
            submitLabel={loading ? "Kaydediliyor…" : "Kaydet"}
            // @ts-ignore optional onChange prop — eğer PersonaForm tanımında yoksa ekle (önceki öneride gösterildi)
            onChange={handleFormChange}
          />
        </div>
      </div>
    </div>
  );
};

/* ------------------------
   Dashboard page component
   ------------------------ */
const Dashboard: React.FC = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    checkApiHealth();
    fetchPersonas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkApiHealth = async () => {
    try {
      const { data, error } = await api.health.check();
      if (error) console.warn("API Health Check failed:", error);
      else console.log("API health:", data);
    } catch (err) {
      console.warn("API health error:", err);
    }
  };

  const fetchPersonas = async () => {
    try {
      setLoading(true);
      const { data, error } = await api.personas.list();
      if (error) {
        setError(error.message || "Personalar getirilemedi");
        setPersonas([]);
        return;
      }
      // normalize shapes
      const list = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.personas)
        ? (data as any).personas
        : [];
      setPersonas(list as Persona[]);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Personalar yüklenemedi");
      setPersonas([]);
    } finally {
      setLoading(false);
    }
  };

  // budget range helper
  const getBudgetRangeText = (items: Persona[]) => {
    const mins = items
      .map((p) => (p as any).budget_min ?? (p as any).budgetMin)
      .filter((v): v is number => typeof v === "number" && !Number.isNaN(v));
    const maxs = items
      .map((p) => (p as any).budget_max ?? (p as any).budgetMax)
      .filter((v): v is number => typeof v === "number" && !Number.isNaN(v));

    if (mins.length && maxs.length)
      return `₺${Math.min(...mins)} - ₺${Math.max(...maxs)}`;
    if (mins.length) return `₺${Math.min(...mins)}+`;
    if (maxs.length) return `Up to ₺${Math.max(...maxs)}`;
    return "—";
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "radial-gradient(1200px circle at 50% -20%, rgba(35,201,255,0.12), transparent 40%), linear-gradient(180deg, #0C0C1E 0%, #0B0B1A 100%)",
        }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: "var(--gm-secondary)" }}
          />
          <p className="mt-4" style={{ color: "rgba(255,255,255,0.75)" }}>
            Yükleniyor…
          </p>
        </div>
      </div>
    );
  }

  const budgetText = getBudgetRangeText(personas);
  const greetName = "misafir"; // Default greeting name

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(1200px circle at 50% -20%, rgba(35,201,255,0.12), transparent 40%), linear-gradient(180deg, #0C0C1E 0%, #0B0B1A 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ">
        {/* Hero */}
        <div className="mb-6 md:mb-8 ">
          <h1
            className="text-2xl md:text-4xl font-bold pt-10"
            style={{ color: "#FFFFFF" }}
          >
            Tekrar hoş geldin, {greetName}{" "}
            <span role="img" aria-label="wave">
              👋
            </span>
          </h1>
          <p
            className="mt-2 text-sm md:text-base"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Yaratıcı personeların ve içgörülerin seni bekliyor.
          </p>
        </div>

        {error && (
          <div
            className="mb-6 rounded-xl px-4 py-3"
            style={{
              backgroundColor: "#3b1d2a",
              color: "#ff9eb8",
              border: "1px solid rgba(255,158,186,0.3)",
            }}
          >
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError("")}
                className="underline text-xs"
                style={{ color: "#ff9eb8" }}
              >
                Kapat
              </button>
            </div>
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
          <div
            className="rounded-2xl p-5 md:p-6 flex items-center justify-between"
            style={{
              background: "linear-gradient(135deg, #3136c6ac, #08756386)",
              color: "white",
              boxShadow: "0 12px 40px rgba(0,201,167,0.25)",
            }}
          >
            <div>
              <div className="text-xs uppercase tracking-wide opacity-90">
                Toplam Persona
              </div>
              <div className="text-3xl font-semibold mt-1">
                {personas.length}
              </div>
            </div>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-90"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>

          <div
            className="rounded-2xl p-5 md:p-6 flex items-center justify-between"
            style={{
              background: "linear-gradient(135deg, #3136c6ac, #08756386)",
              color: "white",
              boxShadow: "0 12px 40px rgba(0,201,167,0.25)",
            }}
          >
            <div>
              <div className="text-xs uppercase tracking-wide opacity-90">
                Bütçe Aralığı
              </div>
              <div className="text-2xl md:text-3xl font-semibold mt-1">
                {budgetText}
              </div>
            </div>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-90"
            >
              <path d="M3 3v18h18" />
              <path d="M19 9l-5 5-4-4-3 3" />
            </svg>
          </div>
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2
            className="text-lg md:text-xl font-semibold"
            style={{ color: "#FFFFFF" }}
          >
            Personaların
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white hover:opacity-95"
            style={{
              backgroundColor: "var(--gm-primary)",
              boxShadow: "0 10px 30px rgba(123,97,255,0.35)",
            }}
          >
            <Plus className="h-4 w-4" /> Persona Ekle
          </button>
        </div>

        {/* Personas grid */}
        {personas.length === 0 ? (
          <div
            className="text-center py-16"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Henüz persona yok. İlkini oluştur.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {personas.map((persona) => (
              <div
                key={persona.id}
                className="rounded-3xl p-4 md:p-5 flex flex-col"
                style={{
                  backgroundColor: "#12132A",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
                }}
              >
                <div
                  className="h-36 md:h-40 w-full rounded-2xl mb-4"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(91,95,241,0.3), rgba(0,201,167,0.25))",
                  }}
                />
                <div className="flex-1">
                  <h3
                    className="text-base md:text-lg font-semibold"
                    style={{ color: "#FFFFFF" }}
                  >
                    {persona.name}
                  </h3>
                  <p
                    className="text-sm mt-1 line-clamp-2"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {persona.description || "—"}
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    to={`/persona/${persona.id}`}
                    className="text-sm font-medium"
                    style={{ color: "var(--gm-secondary)" }}
                  >
                    Detayları Gör →
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
};

export default Dashboard;
