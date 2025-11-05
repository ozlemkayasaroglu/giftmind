import React, { useEffect, useMemo, useRef, useState } from "react";

export interface PersonaFormValues {
  name: string;
  birth_date?: string; // YYYY-MM-DD
  interests: string[];
  notes: string;
  role?: string;
  goals?: string;
  challenges?: string;
  behavioral_insights?: string;
  budget_min?: number;
  budget_max?: number;
  personality_traits?: string[];
  description?: string;
  is_active?: boolean;
}

export interface PersonaFormProps {
  onSubmit: (values: PersonaFormValues) => Promise<void> | void;
  initialData?: Partial<PersonaFormValues>;
  submitLabel?: string;
  className?: string;
  /**
   * Optional: called when any field changes (useful for dirty-check/autosave)
   */
  onChange?: (partial: Partial<PersonaFormValues>) => void;
}

type StepKey = "basic" | "preferences" | "insights" | "overview";

const starterPrompts = {
  goals: [
    "Kariyerinde bir sonraki adım: yönetici olmak",
    "Kişisel gelişim: yeni bir dil öğrenmek",
    "Hobide ilerleme: sergi açmak",
  ],
  challenges: [
    "Zaman yönetimi sorunları",
    "Bütçe sınırlaması",
    "Yeni teknolojilere adapte olmakta güçlük",
  ],
  behavioral: [
    "Hafta sonları online alışveriş yapmayı tercih eder",
    "Deneyim odaklı harcama yapar (etkinlik/atölye)",
    "Marka sadakati düşüktür; fiyat ve yorumlara bakar",
  ],
};

const toCommaSeparated = (arr?: string[]) =>
  arr && arr.length ? arr.join(", ") : "";

const toArray = (value: string) =>
  value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

/** Autosize helper */
function useAutosizeTextArea(
  textAreaRef: React.RefObject<HTMLTextAreaElement | null>,
  value: string
) {
  useEffect(() => {
    const el = textAreaRef.current;
    if (!el) return;
    el.style.height = "0px";
    const scrollHeight = el.scrollHeight || 0;
    el.style.height = `${Math.max(60, scrollHeight)}px`;
  }, [textAreaRef, value]);
}

const PersonaForm: React.FC<PersonaFormProps> = ({
  onSubmit,
  initialData,
  submitLabel = "Kaydet",
  className = "",
  onChange,
}) => {
  // --- state
  const [name, setName] = useState<string>(initialData?.name ?? "");
  const [birth_date, setBirthDate] = useState<string>(
    initialData?.birth_date ?? ""
  );
  const [interestsInput, setInterestsInput] = useState<string>(
    toCommaSeparated(initialData?.interests)
  );
  const [interestsTags, setInterestsTags] = useState<string[]>(
    initialData?.interests ?? []
  );
  const [notes, setNotes] = useState<string>(initialData?.notes ?? "");
  const [role, setRole] = useState<string>(initialData?.role ?? "");
  const [goals, setGoals] = useState<string>(initialData?.goals ?? "");
  const [challenges, setChallenges] = useState<string>(
    initialData?.challenges ?? ""
  );
  const [behavioral_insights, setBehavioralInsights] = useState<string>(
    initialData?.behavioral_insights ?? ""
  );
  const [budget_min, setBudgetMin] = useState<string>(
    initialData?.budget_min !== undefined ? String(initialData!.budget_min) : ""
  );
  const [budget_max, setBudgetMax] = useState<string>(
    initialData?.budget_max !== undefined ? String(initialData!.budget_max) : ""
  );
  const [personality_traits, setPersonalityTraits] = useState<string[]>(
    initialData?.personality_traits ?? []
  );
  const [description, setDescription] = useState<string>(
    initialData?.description ?? ""
  );
  const [is_active, setIsActive] = useState<boolean>(
    initialData?.is_active ?? true
  );

  const [active, setActive] = useState<StepKey>("basic");
  const steps = useMemo(
    () => [
      { key: "basic" as StepKey, label: "Temel Bilgiler" },
      { key: "preferences" as StepKey, label: "Tercihler" },
      { key: "insights" as StepKey, label: "İçgörüler" },
      { key: "overview" as StepKey, label: "Özet" },
    ],
    []
  );
  const currentIndex = steps.findIndex((s) => s.key === active);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // refs for autosize
  const goalsRef = useRef<HTMLTextAreaElement | null>(null);
  const challengesRef = useRef<HTMLTextAreaElement | null>(null);
  const behavioralRef = useRef<HTMLTextAreaElement | null>(null);
  const notesRef = useRef<HTMLTextAreaElement | null>(null);

  useAutosizeTextArea(goalsRef, goals);
  useAutosizeTextArea(challengesRef, challenges);
  useAutosizeTextArea(behavioralRef, behavioral_insights);
  useAutosizeTextArea(notesRef, notes);

  // sync initialData if it changes
  useEffect(() => {
    if (!initialData) return;
    setName(initialData.name ?? "");
    setBirthDate(initialData.birth_date ?? "");
    setInterestsInput(toCommaSeparated(initialData.interests));
    setInterestsTags(initialData.interests ?? []);
    setNotes(initialData.notes ?? "");
    setRole(initialData.role ?? "");
    setGoals(initialData.goals ?? "");
    setChallenges(initialData.challenges ?? "");
    setBehavioralInsights(initialData.behavioral_insights ?? "");
    setBudgetMin(
      initialData?.budget_min !== undefined
        ? String(initialData!.budget_min)
        : ""
    );
    setBudgetMax(
      initialData?.budget_max !== undefined
        ? String(initialData!.budget_max)
        : ""
    );
    setPersonalityTraits(initialData.personality_traits ?? []);
    setDescription(initialData.description ?? "");
    setIsActive(initialData.is_active ?? true);
  }, [initialData]);

  // call onChange when fields change (small, immediate notify)
  useEffect(() => {
    onChange?.({
      name,
      birth_date: birth_date || undefined,
      interests: interestsTags.length ? interestsTags : [],
      notes,
      role: role || undefined,
      goals: goals || undefined,
      challenges: challenges || undefined,
      behavioral_insights: behavioral_insights || undefined,
      budget_min: budget_min ? Number(budget_min) : undefined,
      budget_max: budget_max ? Number(budget_max) : undefined,
      personality_traits: personality_traits.length
        ? personality_traits
        : undefined,
      description: description || undefined,
      is_active,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    name,
    birth_date,
    interestsTags,
    notes,
    role,
    goals,
    challenges,
    behavioral_insights,
    budget_min,
    budget_max,
    personality_traits,
    description,
    is_active,
  ]);

  // --- tag helpers
  const addTag = (raw: string) => {
    const t = toArray(raw);
    if (!t.length) return;
    const next = Array.from(new Set([...interestsTags, ...t]));
    setInterestsTags(next);
    setInterestsInput("");
  };

  const removeTag = (tag: string) =>
    setInterestsTags((prev) => prev.filter((t) => t !== tag));

  const onInterestsKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    e
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (interestsInput.trim()) addTag(interestsInput);
    } else if (
      e.key === "Backspace" &&
      !interestsInput &&
      interestsTags.length
    ) {
      removeTag(interestsTags[interestsTags.length - 1]);
    }
  };

  const onInterestsBlur = () => {
    if (interestsInput.trim()) addTag(interestsInput);
  };

  // budget handlers (only digits)
  const handleBudgetMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v === "" || /^\d+$/.test(v)) setBudgetMin(v);
  };
  const handleBudgetMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v === "" || /^\d+$/.test(v)) setBudgetMax(v);
  };

  // steps navigation
  const next = () => {
    setError(null);
    if (active === "basic" && !name.trim()) {
      setError("İsim gerekli");
      return;
    }
    if (
      active === "preferences" &&
      interestsTags.length === 0 &&
      !interestsInput.trim()
    ) {
      setError("En az bir ilgi alanı eklemek önerilir (örn. kitaplar)");
      return;
    }
    if (currentIndex < steps.length - 1) setActive(steps[currentIndex + 1].key);
  };

  const prev = () => {
    setError(null);
    if (currentIndex > 0) setActive(steps[currentIndex - 1].key);
  };

  const validateBudgets = () => {
    const min = budget_min === "" ? undefined : Number(budget_min);
    const max = budget_max === "" ? undefined : Number(budget_max);
    if (min !== undefined && max !== undefined && min > max)
      return "Minimum bütçe maksimumdan büyük olamaz.";
    if (min !== undefined && (isNaN(min) || min < 0))
      return "Minimum bütçe geçerli bir sayı olmalı.";
    if (max !== undefined && (isNaN(max) || max < 0))
      return "Maksimum bütçe geçerli bir sayı olmalı.";
    return null;
  };

  // submit
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSubmitting(true);

    const budgetError = validateBudgets();
    if (budgetError) {
      setError(budgetError);
      setActive("preferences");
      setSubmitting(false);
      return;
    }

    const payload: PersonaFormValues = {
      name: name.trim(),
      birth_date: birth_date || undefined,
      interests: interestsTags.length ? interestsTags : [],
      notes: notes || "",
      role: role || undefined,
      goals: goals || undefined,
      challenges: challenges || undefined,
      behavioral_insights: behavioral_insights || undefined,
      budget_min: budget_min ? Number(budget_min) : undefined,
      budget_max: budget_max ? Number(budget_max) : undefined,
      personality_traits: personality_traits.length
        ? personality_traits
        : undefined,
      description: description || undefined,
      is_active,
    };

    try {
      await onSubmit(payload);
    } catch (err: any) {
      console.error("Form submission error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Bir hata oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // helper to insert starter prompts
  const applyStarter = (
    field: "goals" | "challenges" | "behavioral",
    text: string
  ) => {
    if (field === "goals")
      setGoals((prev) => (prev ? `${prev}\n${text}` : text));
    if (field === "challenges")
      setChallenges((prev) => (prev ? `${prev}\n${text}` : text));
    if (field === "behavioral")
      setBehavioralInsights((prev) => (prev ? `${prev}\n${text}` : text));
  };

  // Calculate age from birth date (YYYY-MM-DD format)
  const calculateAge = (birthDate: string): string => {
    if (!birthDate) return "—";

    try {
      const birthDateObj = new Date(birthDate);
      const today = new Date();

      // Check if the date is valid
      if (isNaN(birthDateObj.getTime())) return "—";

      let age = today.getFullYear() - birthDateObj.getFullYear();
      const monthDiff = today.getMonth() - birthDateObj.getMonth();

      // Adjust age if birthday hasn't occurred yet this year
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
      ) {
        age--;
      }

      return age > 0 ? `${age} yaş` : "—";
    } catch (error) {
      console.error("Error calculating age:", error);
      return "—";
    }
  };

  // preview component
  const PreviewCard: React.FC = () => (
    <div className="border rounded-xl p-4 bg-light-200">
      <h4 className="text-sm font-semibold mb-2 text-white">Özet Önizleme</h4>
      <div className="text-sm mb-2 flex">
        <strong className="text-white/60">İsim:</strong>
        <div className="mt-1 whitespace-pre-wrap text-xs text-teal-400 text-bold">
          {name || "—"}
        </div>
      </div>
      <div className="text-sm mb-2 flex items-center">
        <strong className="text-white/60">Yaş:</strong>
        <div className="ml-1 whitespace-pre-wrap text-xs text-teal-400 text-bold">
          {calculateAge(birth_date)}
        </div>
      </div>
      <div className="text-sm mb-2 flex">
        <strong className="text-white/60">Rol:</strong>{" "}
        <div className="mt-1 whitespace-pre-wrap text-xs text-teal-400 text-bold">
          {" "}
          {role || "—"}
        </div>
      </div>
      <div className="text-sm mb-2 flex">
        <strong className="text-white/60">İlgi Alanları:</strong>
        <div className="mt-1 whitespace-pre-wrap text-xs text-teal-400 text-bold">
          {interestsTags.length
            ? interestsTags.join(", ")
            : interestsInput || "—"}
        </div>
      </div>
      <div className="text-sm mb-2 flex">
        <strong className="text-white/60">Bütçe:</strong>
        <div className="mt-1 whitespace-pre-wrap text-xs text-teal-400 text-bold">
          {budget_min || "—"} —{" "}
        </div>
        <div className="mt-1 whitespace-pre-wrap text-xs text-teal-400 text-bold">
          {budget_max || "—"}
        </div>
      </div>
      <div className="text-sm mt-2 flex">
        <strong className="text-white/60">Hedefler:</strong>
        <div className="mt-1 whitespace-pre-wrap text-xs text-teal-400 text-bold">
          {goals || "—"}
        </div>
      </div>
      <div className="text-sm mt-2 flex">
        <strong className="text-white/60">Zorluklar:</strong>
        <div className="mt-1 whitespace-pre-wrap text-xs text-teal-400 text-bold">
          {challenges || "—"}
        </div>
      </div>
      <div className="text-sm mt-2 flex">
        <strong className="text-white/60">Davranışsal İçgörüler:</strong>
        <div className="mt-1 whitespace-pre-wrap text-xs text-teal-400 text-bold">
          {behavioral_insights || "—"}
        </div>
      </div>
      <div className="text-sm mt-2 flex">
        <strong className="text-white/60">Notlar:</strong>
        <div className="mt-1 whitespace-pre-wrap text-xs text-teal-400 text-bold">
          {notes || "—"}
        </div>
      </div>
    </div>
  );

  // styles (removed unused variables)

  // render step panels
  const renderFormPanel = () => {
    switch (active) {
      case "basic":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                İsim <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-300 border border-gray-700 rounded-md text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Ayşe Yılmaz"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Doğum Tarihi
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 bg-gray-300 border border-gray-700 rounded-md text-sm"
                value={birth_date}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Rol / Meslek
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-300 border border-gray-700 rounded-md text-sm"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Örn: Kreatif Direktör"
              />
              <div className="text-xs text-white/60 mt-1">
                Kısa bir rol tanımı (takma ad da kullanılabilir). Bu alan hediye
                önerilerinde bağlam sağlar.
              </div>
            </div>
          </div>
        );
      case "preferences":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                İlgi Alanları
              </label>
              <div className="flex gap-2 flex-wrap mb-2">
                {interestsTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.04)",
                      color: "#fff",
                    }}
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${tag}`}
                      onClick={() => removeTag(tag)}
                      className="text-xs px-1 rounded-full"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-300 border border-gray-700 rounded-md text-sm"
                value={interestsInput}
                onChange={(e) => setInterestsInput(e.target.value)}
                onKeyDown={onInterestsKeyDown}
                onBlur={onInterestsBlur}
                placeholder="Enter ile veya virgül ile ekleyin — örn. kitaplar, yoga"
              />
              <div className="text-xs text-white/60 mt-1">
                Virgül veya Enter ile yeni etiket ekleyin. Etiketler hediye
                önerilerinde önemli sinyallerdir.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Minimum Bütçe
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  className="w-full px-3 py-2 bg-gray-300 border border-gray-700 rounded-md text-sm"
                  value={budget_min}
                  onChange={handleBudgetMinChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Maksimum Bütçe
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  className="w-full px-3 py-2 bg-gray-300 border border-gray-700 rounded-md text-sm"
                  value={budget_max}
                  onChange={handleBudgetMaxChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Davranışsal İçgörüler
              </label>
              <textarea
                ref={behavioralRef}
                className="w-full px-3 py-2 bg-gray-300 border border-gray-700 rounded-md text-sm resize-none"
                value={behavioral_insights}
                onChange={(e) => setBehavioralInsights(e.target.value)}
                rows={3}
                placeholder="Alışkanlıklar, motivasyonlar, satın alma davranışları…"
              />
              <div className="flex items-center justify-between mt-1">
                <div className="text-xs text-white/60">
                  Kısa notlar: neyi neden yapıyor?
                </div>
                <div className="flex gap-1">
                  {starterPrompts.behavioral.map((p) => (
                    <button
                      key={p}
                      type="button"
                      className="text-xs px-2 py-1 rounded-md"
                      onClick={() => applyStarter("behavioral", p)}
                      style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                    >
                      {p.split(" ")[0]}…
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case "insights":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Hedefler
              </label>
              <textarea
                ref={goalsRef}
                className="w-full px-3 py-2 bg-gray-300 border border-gray-700 rounded-md text-sm resize-none"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                rows={3}
                placeholder="Bu persona ne başarmak istiyor?"
              />
              <div className="flex items-center justify-between mt-1">
                <div className="text-xs text-white/60">
                  Hedefleri kısa ve olumlu cümlelerle yazmak önerilir.
                </div>
                <div className="flex gap-1">
                  {starterPrompts.goals.map((p) => (
                    <button
                      key={p}
                      type="button"
                      className="text-xs px-2 py-1 rounded-md"
                      onClick={() => applyStarter("goals", p)}
                      style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                    >
                      {p.split(" ")[0]}…
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-xs text-white/50 mt-1">
                Karakter: {goals.length}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Zorluklar
              </label>
              <textarea
                ref={challengesRef}
                className="w-full px-3 py-2 bg-gray-300 border border-gray-700 rounded-md text-sm resize-none"
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                rows={3}
                placeholder="Karşılaştığı zorluklar neler?"
              />
              <div className="text-xs text-white/50 mt-1">
                Karakter: {challenges.length}
              </div>
            </div>
          </div>
        );
      case "overview":
      default:
        return (
          <div className="space-y-4">
            <PreviewCard />
            <div className="text-sm text-white/60">
              Bilgileri kontrol edip kaydet butonuna bas.
            </div>
          </div>
        );
    }
  };

  // final render
  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-4 overflow-y-auto max-h-[70vh] pr-1 max-w-2xl w-full mx-auto ${className}`}
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* Step indicator */}
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs text-white/70">
          Adım {currentIndex + 1} / {steps.length}
        </div>
        <div className="flex items-center gap-2">
          {steps.map((s, idx) => {
            const reached = idx <= currentIndex;
            return (
              <span
                key={s.key}
                className="px-2 py-1 rounded-full border text-xs select-none"
                style={{
                  borderColor: "rgba(255,255,255,0.12)",
                  backgroundColor: reached
                    ? "rgba(123,97,255,0.18)"
                    : "rgba(255,255,255,0.03)",
                  color: reached ? "#fff" : "rgba(255,255,255,0.6)",
                }}
              >
                {s.label}
              </span>
            );
          })}
        </div>
      </div>

      {error && (
        <div
          className="rounded-md p-3 text-sm border"
          style={{
            backgroundColor: "#3b1d2a",
            color: "#ff9eb8",
            borderColor: "rgba(255,158,186,0.3)",
          }}
          role="alert"
        >
          {error}
        </div>
      )}

      {/* panel */}
      {renderFormPanel()}

      {/* Controls */}
      <div className="pt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            disabled={currentIndex === 0}
            className="px-3 py-2 rounded-full text-sm disabled:opacity-50"
            style={{
              color: "#E5E7EB",
              backgroundColor: "rgba(255,255,255,0.04)",
            }}
          >
            Geri
          </button>

          {currentIndex < steps.length - 1 && (
            <button
              type="button"
              onClick={next}
              className="px-3 py-2 rounded-full text-sm text-white"
              style={{ backgroundColor: "var(--gm-primary, #7B61FF)" }}
            >
              İleri
            </button>
          )}
        </div>

        {currentIndex === steps.length - 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActive("basic")}
              className="px-3 py-2 rounded-full text-sm"
              style={{
                color: "#E5E7EB",
                backgroundColor: "rgba(255,255,255,0.03)",
              }}
            >
              Düzenle
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              style={{ backgroundColor: "var(--gm_secondary, #23C9FF)" }}
            >
              {submitting ? "Kaydediliyor…" : submitLabel}
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default PersonaForm;
