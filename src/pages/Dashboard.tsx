import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context";
import { api } from "../lib";
import type { Persona } from "../lib/types";
import { Plus, X, Tag as TagIcon } from "lucide-react";
import { PersonalityTraitsSelector } from "../components/PersonalityTraitsSelector";

// Add Persona Modal Component
const AddPersonaModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onPersonaAdded: () => void;
}> = ({ isOpen, onClose, onPersonaAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    birthDate: "",
    goals: "",
    challenges: "",
    description: "",
    interestsInput: "",
    budgetMin: "",
    budgetMax: "",
    behavioralInsights: "",
    notes: "",
  });

  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTraitsChange = (traits: string[]) => {
    setSelectedTraits(traits);
  };

  type StepKey = "profile" | "traits" | "preferences" | "notes";
  const [activeStep, setActiveStep] = useState<StepKey>("profile");

  const steps = useMemo(
    () => [
      { key: "profile" as StepKey, label: "Profil", icon: "👤" },
      { key: "traits" as StepKey, label: "Özellikler", icon: "🎭" },
      { key: "preferences" as StepKey, label: "Tercihler", icon: "🎯" },
      { key: "notes" as StepKey, label: "Ek Notlar", icon: "📝" },
    ],
    []
  );

  const currentIndex = steps.findIndex((s) => s.key === activeStep);

  // Renk paleti
  const colors = {
    primary: "#7B61FF",
    secondary: "#00C9A7",
    background: "#12132A",
    surface: "#17182B",
    surfaceLight: "#1E1F3A",
    border: "#2A2B3F",
    text: {
      primary: "#FFFFFF",
      secondary: "#C9CBF0",
      muted: "rgba(255,255,255,0.6)",
    },
    gradient: {
      primary: "linear-gradient(135deg, #7B61FF 0%, #5B5FF1 100%)",
      secondary: "linear-gradient(135deg, #00C9A7 0%, #009E7F 100%)",
      card: "linear-gradient(135deg, rgba(91,95,241,0.15), rgba(0,201,167,0.1))",
    },
  };

  const nextStep = () => {
    setError("");
    if (!formData.name.trim()) {
      setActiveStep("profile");
      setError("İsim gerekli");
      return;
    }
    if (currentIndex < steps.length - 1) {
      setActiveStep(steps[currentIndex + 1].key);
    }
  };

  const prevStep = () => {
    setError("");
    if (currentIndex > 0) setActiveStep(steps[currentIndex - 1].key);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      birthDate: "",
      goals: "",
      challenges: "",
      description: "",
      interestsInput: "",
      budgetMin: "",
      budgetMax: "",
      behavioralInsights: "",
      notes: "",
    });
    setSelectedTraits([]);
    setActiveStep("profile");
  };

  const toggleTrait = (t: string) => {
    setSelectedTraits((s) =>
      s.includes(t) ? s.filter((x) => x !== t) : [...s, t]
    );
  };

  const toArray = (value: string) =>
    value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.name.trim()) {
        setLoading(false);
        setActiveStep("profile");
        setError("İsim gerekli");
        return;
      }

      const personaData: any = {
        name: formData.name,
        role: formData.role || undefined,
        description: formData.description || formData.notes || undefined,
        goals: formData.goals || undefined,
        challenges: formData.challenges || undefined,
        interests: toArray(formData.interestsInput),
        personalityTraits: selectedTraits,
        interestsRaw: (formData.interestsInput || "").trim() || undefined,
        birthDate: formData.birthDate || undefined,
        budgetMin: Number.isFinite(Number(formData.budgetMin))
          ? Number(formData.budgetMin)
          : undefined,
        budgetMax: Number.isFinite(Number(formData.budgetMax))
          ? Number(formData.budgetMax)
          : undefined,
        behavioralInsights: formData.behavioralInsights || undefined,
        notesText: formData.notes || undefined,
      };

      console.log(formData, personaData);

      const { data: created, error } = await api.personas.create(personaData);
      if (error) {
        setError(error.message || "Persona oluşturulamadı");
        setLoading(false);
        return;
      }

      onPersonaAdded();
      onClose();
      resetForm();
    } catch (err: any) {
      setError("Persona oluşturulamadı");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Stil yardımcıları
  const inputClass =
    "w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all duration-200";
  const inputStyle: React.CSSProperties = {
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text.primary,
  };

  const buttonBase =
    "px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center overflow-y-auto p-4"
      style={{
        background:
          "radial-gradient(1200px circle at 50% -20%, rgba(35,201,255,0.14), transparent 40%), rgba(0,0,0,0.75)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="w-full max-w-4xl mx-auto my-8 rounded-3xl overflow-hidden"
        style={{
          backgroundColor: colors.background,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.65)",
        }}
      >
        {/* Header */}
        <div
          className="p-6 border-b"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: colors.gradient.primary,
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Yeni Persona Oluştur
              </h3>
              <p className="mt-2 text-sm opacity-90 text-white">
                Yapay zeka personanızı ayrıntılı özellikler ve tercihlerle
                tanımlayın
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:opacity-80 transition-opacity"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              aria-label="Close"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div
          className="px-6 py-4 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.key} className="flex items-center flex-1">
                <button
                  type="button"
                  onClick={() => setActiveStep(step.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    activeStep === step.key
                      ? "text-white scale-105"
                      : index < currentIndex
                      ? "text-white opacity-80"
                      : "text-white opacity-50"
                  }`}
                  style={{
                    backgroundColor:
                      activeStep === step.key ? colors.primary : "transparent",
                  }}
                >
                  <span className="text-sm">{step.icon}</span>
                  <span className="text-xs font-medium hidden sm:block">
                    {step.label}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className="flex-1 h-0.5 mx-2"
                    style={{
                      backgroundColor:
                        index < currentIndex
                          ? colors.primary
                          : "rgba(255,255,255,0.1)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {error && (
            <div
              className="mb-6 rounded-xl p-4 text-sm border"
              style={{
                backgroundColor: "rgba(219, 68, 55, 0.1)",
                color: "#FF6B6B",
                borderColor: "rgba(255, 107, 107, 0.3)",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Profile */}
            {activeStep === "profile" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.text.secondary }}
                    >
                      İsim *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="İsim girin"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.text.secondary }}
                    >
                      Rol / Meslek
                    </label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      placeholder="örn. Kreatif Direktör"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-3"
                    style={{ color: colors.text.secondary }}
                  >
                    Doğum Tarihi
                  </label>
                  <div>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) =>
                        setFormData({ ...formData, birthDate: e.target.value })
                      }
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.text.secondary }}
                    >
                      Hedefler ve Beklentiler
                    </label>
                    <textarea
                      rows={3}
                      value={formData.goals}
                      onChange={(e) =>
                        setFormData({ ...formData, goals: e.target.value })
                      }
                      placeholder="Bu persona ne başarmak istiyor?"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.text.secondary }}
                    >
                      Zorluklar ve Acı Noktaları
                    </label>
                    <textarea
                      rows={3}
                      value={formData.challenges}
                      onChange={(e) =>
                        setFormData({ ...formData, challenges: e.target.value })
                      }
                      placeholder="Karşılaştığı zorluklar neler?"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Traits */}
            {activeStep === "traits" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4
                    className="text-lg font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    Kişilik Özellikleri
                  </h4>
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.1)",
                      color: colors.text.muted,
                    }}
                  >
                    {selectedTraits.length} seçildi
                  </span>
                </div>

                <PersonalityTraitsSelector
                  selectedTraits={selectedTraits}
                  onTraitsChange={handleTraitsChange}
                />
              </div>
            )}

            {/* Step 3: Preferences */}
            {activeStep === "preferences" && (
              <div className="space-y-6">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text.secondary }}
                  >
                    İlgi Alanları ve Hobiler
                  </label>
                  <div className="flex items-center gap-3">
                    <TagIcon
                      className="h-5 w-5"
                      style={{ color: colors.text.muted }}
                    />
                    <input
                      type="text"
                      value={formData.interestsInput}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          interestsInput: e.target.value,
                        })
                      }
                      placeholder="örn. fotoğrafçılık, doğa yürüyüşü, okuma, yemek..."
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <p
                    className="text-xs mt-2"
                    style={{ color: colors.text.muted }}
                  >
                    Birden fazla ilgiyi virgülle ayırın
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.text.secondary }}
                    >
                      Minimum Bütçe (₺)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.budgetMin}
                      onChange={(e) =>
                        setFormData({ ...formData, budgetMin: e.target.value })
                      }
                      placeholder="0"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.text.secondary }}
                    >
                      Maksimum Bütçe (₺)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.budgetMax}
                      onChange={(e) =>
                        setFormData({ ...formData, budgetMax: e.target.value })
                      }
                      placeholder="10000"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Notes & AI */}
            {activeStep === "notes" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4
                    className="text-lg font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    Ek Detaylar
                  </h4>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text.secondary }}
                  >
                    Genel Açıklama
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Bu persona hakkında kısa bir anlatı yazın..."
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text.secondary }}
                  >
                    Davranışsal İçgörüler
                  </label>
                  <textarea
                    rows={3}
                    value={formData.behavioralInsights}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        behavioralInsights: e.target.value,
                      })
                    }
                    placeholder="Alışkanlıklar, karar verme kalıpları, motivasyonlar..."
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text.secondary }}
                  >
                    İç Notlar
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Ek notlar veya fikirler..."
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div
              className="flex items-center justify-between pt-6 border-t"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentIndex === 0}
                  className={buttonBase}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    color: colors.text.primary,
                    opacity: currentIndex === 0 ? 0.5 : 1,
                  }}
                >
                  ← Geri
                </button>

                {currentIndex < steps.length - 1 && (
                  <button
                    type="button"
                    onClick={nextStep}
                    className={buttonBase}
                    style={{ backgroundColor: colors.primary, color: "white" }}
                  >
                    Sonraki Adım →
                  </button>
                )}
              </div>

              {currentIndex === steps.length - 1 && (
                <button
                  type="submit"
                  disabled={loading}
                  className={`${buttonBase} inline-flex items-center gap-2`}
                  style={{
                    backgroundColor: colors.secondary,
                    color: "white",
                    boxShadow: "0 8px 25px rgba(0,201,167,0.3)",
                  }}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Persona Oluştur
                    </>
                  )}
                </button>
              )}
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
  const [error, setError] = useState<string>("");
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
        console.warn("API Health Check Failed:", error);
      } else {
        console.log("API Health Check:", data);
      }
    } catch (err) {
      console.warn("API Health Check Error:", err);
    }
  };

  const fetchPersonas = async () => {
    try {
      setLoading(true);
      const { data, error } = await api.personas.list();

      if (error) {
        setError(error.message || "Failed to fetch personas");
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
      setError("Failed to load personas");
    } finally {
      setLoading(false);
    }
  };

  // Safely compute budget range text across personas where budget fields may be missing
  const getBudgetRangeText = (items: Persona[]) => {
    const mins = items
      .map((p) => {
        const v = (p as any).budget_min ?? (p as any).budgetMin;
        return typeof v === "number" ? v : undefined;
      })
      .filter((v): v is number => typeof v === "number" && !Number.isNaN(v));
    const maxs = items
      .map((p) => {
        const v = (p as any).budget_max ?? (p as any).budgetMax;
        return typeof v === "number" ? v : undefined;
      })
      .filter((v): v is number => typeof v === "number" && !Number.isNaN(v));
    if (mins.length && maxs.length) {
      return `₺${Math.min(...mins)} - ₺${Math.max(...maxs)}`;
    }
    return "—";
  };

  if (authLoading || loading) {
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
          ></div>
          <p className="mt-4" style={{ color: "rgba(255,255,255,0.75)" }}>
            Yükleniyor…
          </p>
        </div>
      </div>
    );
  }

  const greetName = user?.email ? user.email.split("@")[0] : "misafir";
  const budgetText = getBudgetRangeText(personas);

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(1200px circle at 50% -20%, rgba(35,201,255,0.14), transparent 40%), linear-gradient(180deg, #0C0C1E 0%, #0B0B1A 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero */}
        <div className="mb-6 md:mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold"
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
            Yaratıcı personaların ve içgörülerin seni bekliyor.
          </p>
        </div>

        {/* Error banner (if any) */}
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
              background: "linear-gradient(135deg, #5B5FF1, #00C9A7)",
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
              background: "linear-gradient(135deg, #5B5FF1, #00C9A7)",
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
