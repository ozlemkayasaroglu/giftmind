import React, { useEffect, useState } from "react";
// import Swal from "sweetalert2";
// import "sweetalert2/dist/sweetalert2.min.css";

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
  onValuesChange?: (values: PersonaFormValues) => void;
}

const toCommaSeparated = (arr?: string[]) =>
  arr && arr.length ? arr.join(", ") : "";
const toArray = (value: string) =>
  value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

const PersonaForm: React.FC<PersonaFormProps> = ({
  onSubmit,
  initialData,
  submitLabel = "Kaydet",
  className = "",
  onValuesChange,
}) => {
  const [name, setName] = useState<string>(initialData?.name ?? "");
  const [birthDate, setBirthDate] = useState<string>(
    initialData?.birthDate ?? ""
  );
  const [interestsInput, setInterestsInput] = useState<string>(
    toCommaSeparated(initialData?.interests)
  );
  const [notes, setNotes] = useState<string>(initialData?.notes ?? "");
  // New fields
  const [role, setRole] = useState<string>(initialData?.role ?? "");
  const [goals, setGoals] = useState<string>(initialData?.goals ?? "");
  const [challenges, setChallenges] = useState<string>(
    initialData?.challenges ?? ""
  );
  const [behavioralInsights, setBehavioralInsights] = useState<string>(
    initialData?.behavioralInsights ?? ""
  );
  const [budgetMinStr, setBudgetMinStr] = useState<string>(
    typeof initialData?.budgetMin === "number"
      ? String(initialData?.budgetMin)
      : ""
  );
  const [budgetMaxStr, setBudgetMaxStr] = useState<string>(
    typeof initialData?.budgetMax === "number"
      ? String(initialData?.budgetMax)
      : ""
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep form in sync if initialData changes
  useEffect(() => {
    if (!initialData) return;
    setName(initialData.name ?? "");
    setBirthDate(initialData.birthDate ?? "");
    setInterestsInput(toCommaSeparated(initialData.interests));
    setNotes(initialData.notes ?? "");
    setRole(initialData.role ?? "");
    setGoals(initialData.goals ?? "");
    setChallenges(initialData.challenges ?? "");
    setBehavioralInsights(initialData.behavioralInsights ?? "");
    setBudgetMinStr(
      typeof (initialData as any).budgetMin === "number"
        ? String((initialData as any).budgetMin)
        : ""
    );
    setBudgetMaxStr(
      typeof (initialData as any).budgetMax === "number"
        ? String((initialData as any).budgetMax)
        : ""
    );
  }, [initialData]);

  // Notify parent of current values whenever any relevant field changes
  useEffect(() => {
    if (!onValuesChange) return;
    const parsedBudgetMin = Number.isFinite(Number(budgetMinStr))
      ? Number(budgetMinStr)
      : undefined;
    const parsedBudgetMax = Number.isFinite(Number(budgetMaxStr))
      ? Number(budgetMaxStr)
      : undefined;

    const values: PersonaFormValues = {
      name: name.trim(),
      birthDate: birthDate || "",
      interests: toArray(interestsInput),
      notes: notes.trim(),
      role: role || undefined,
      goals: goals || undefined,
      challenges: challenges || undefined,
      behavioralInsights: behavioralInsights || undefined,
      budgetMin: parsedBudgetMin,
      budgetMax: parsedBudgetMax,
    };

    // Debounced-ish behavior isn't necessary for small forms; call directly
    try {
      onValuesChange(values);
    } catch {
      /* ignore parent errors */
    }
  }, [
    name,
    birthDate,
    interestsInput,
    notes,
    role,
    goals,
    challenges,
    behavioralInsights,
    budgetMinStr,
    budgetMaxStr,
    onValuesChange,
  ]);

  const next = () => {
    // simply clear errors for now; navigation removed
    setError(null);
    if (!name.trim()) {
      setError("İsim gerekli");
    }
  };

  const prev = () => {
    // no-op navigation; keep for compatibility
    setError(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const parsedBudgetMin = Number.isFinite(Number(budgetMinStr))
      ? Number(budgetMinStr)
      : undefined;
    const parsedBudgetMax = Number.isFinite(Number(budgetMaxStr))
      ? Number(budgetMaxStr)
      : undefined;

    const values: PersonaFormValues = {
      name: name.trim(),
      birthDate: birthDate || "",
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
      setError("İsim gerekli");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(values);
    } catch (err: any) {
      setError(err?.message || "Gönderim başarısız");
    } finally {
      setSubmitting(false);
    }
  };

  // Common styles for dark inputs matching the app’s design
  const inputClass =
    "w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2";
  const inputStyle: React.CSSProperties = {
    borderColor: "#2A2B3F",
    backgroundColor: "#17182B",
    color: "#E5E7EB",
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-4 overflow-y-auto max-h-[70vh] pr-1 max-w-2xl w-full mx-auto ${className}`}
      style={{ WebkitOverflowScrolling: "touch" }}
    >
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

      {/* Step Panels */}
      <div className="space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="persona-name"
            className="block text-sm font-medium"
            style={{ color: "#C9CBF0" }}
          >
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
          <label
            htmlFor="persona-birthDate"
            className="block text-sm font-medium"
            style={{ color: "#C9CBF0" }}
          >
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
          <label
            htmlFor="persona-role"
            className="block text-sm font-medium"
            style={{ color: "#C9CBF0" }}
          >
            Rol / Meslek
          </label>
          <input
            id="persona-role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder={role ? undefined : "örn. Öğrenci, Mühendis, Sanatçı"}
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="persona-interests"
            className="block text-sm font-medium"
            style={{ color: "#C9CBF0" }}
          >
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
            <label
              htmlFor="persona-budgetMin"
              className="block text-sm font-medium"
              style={{ color: "#C9CBF0" }}
            >
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
            <label
              htmlFor="persona-budgetMax"
              className="block text-sm font-medium"
              style={{ color: "#C9CBF0" }}
            >
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
          <label
            htmlFor="persona-behavioral"
            className="block text-sm font-medium"
            style={{ color: "#C9CBF0" }}
          >
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

      <div className="space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="persona-goals"
            className="block text-sm font-medium"
            style={{ color: "#C9CBF0" }}
          >
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
          <label
            htmlFor="persona-challenges"
            className="block text-sm font-medium"
            style={{ color: "#C9CBF0" }}
          >
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
      </div>

      {/* Controls */}
      <div className="pt-2 ">
        <div className=" flex justify-between gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={prev}
              disabled={true}
              className="px-3 py-2 rounded-full text-sm disabled:opacity-50"
              style={{
                color: "#E5E7EB",
                backgroundColor: "rgba(255,255,255,0.06)",
              }}
            >
              Geri
            </button>
            <button
              type="button"
              onClick={next}
              className="px-3 py-2 rounded-full text-sm text-white"
              style={{ backgroundColor: "var(--gm-primary)" }}
            >
              İleri
            </button>
          </div>

          <div className="flex items-right gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-right rounded-full px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              style={{
                backgroundColor:
                  "var(--gm_secondary, var(--gm-secondary, #23C9FF))",
              }}
            >
              {submitting ? "Kaydediliyor…" : submitLabel}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PersonaForm;
