import { useState } from "react";
import { giftAPI } from "../lib/api"; // Import giftAPI instead of api

interface GiftSuggestionsProps {
  persona: {
    id: string;
    name: string;
    interests?: string[];
    role?: string;
    birth_date?: string;
    goals?: string;
    challenges?: string;
    behavioral_insights?: string;
    budget_min?: number;
    budget_max?: number;
    personality_traits?: string[];
    notes?: string;
  };
  className?: string;
  buttonLabel?: string;
}

const GiftSuggestions = ({
  persona,
  className = "",
  buttonLabel = "Hediye Önerileri Al",
}: GiftSuggestionsProps) => {
  const [ideas, setIdeas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (!persona.id) {
      setError("Persona ID bulunamadı");
      return;
    }

    setLoading(true);
    setError(null);
    setIdeas([]); // Yeni öneri alırken eski listeyi temizle

    try {
      console.log("Fetching recommendations for persona ID:", persona.id);
      const response = await giftAPI.getRecommendations(persona.id);
      console.log("API Response:", response);

      // Eğer giftIdeas dizisi varsa
      if (response.giftIdeas && Array.isArray(response.giftIdeas)) {
        const suggestions = response.giftIdeas.map(
          (item: any) => item.title || item.name || JSON.stringify(item)
        );

        if (suggestions.length === 0) {
          console.warn("API boş dizi döndü (giftIdeas)");
          throw new Error("Bu persona için henüz öneri bulunamadı");
        }

        console.log("Parsed gift ideas:", suggestions);
        setIdeas(suggestions);
        return;
      }

      // API'den direkt dizi dönüyorsa
      if (Array.isArray(response)) {
        const suggestions = response.map((item: any) =>
          typeof item === "string"
            ? item
            : item.title || item.name || JSON.stringify(item)
        );

        if (suggestions.length === 0) {
          console.warn("API boş dizi döndü");
          throw new Error("Bu persona için henüz öneri bulunamadı");
        }

        console.log("Parsed suggestions:", suggestions);
        setIdeas(suggestions.slice(0, 6));
        return;
      }

      // Eğer response.data içinde dizi varsa
      if (response.data && Array.isArray(response.data)) {
        const suggestions = response.data.map((item: any) =>
          typeof item === "string"
            ? item
            : item.title || item.name || JSON.stringify(item)
        );

        if (suggestions.length === 0) {
          console.warn("API boş dizi döndü (response.data)");
          throw new Error("Bu persona için henüz öneri bulunamadı");
        }

        console.log("Parsed suggestions from response.data:", suggestions);
        setIdeas(suggestions.slice(0, 6));
        return;
      }
    } catch (err: any) {
      console.error("Hediye önerileri alınırken hata:", err);
      setError(
        err.message ||
          "Hediye önerileri alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
  };

  // Yaş hesaplama fonksiyonu
  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return null;
    try {
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        age--;
      }

      return age;
    } catch {
      return null;
    }
  };

  // Persona bilgilerini gösteren yardımcı fonksiyon
  const renderPersonaInfo = () => {
    const info = [];
    const age = calculateAge(persona.birth_date);

    if (age) {
      info.push(`Yaş: ${age}`);
    }

    if (persona.interests?.length) {
      info.push(`İlgi Alanları: ${persona.interests.join(", ")}`);
    }

    if (persona.role) {
      info.push(`Meslek: ${persona.role}`);
    }

    if (persona.budget_min || persona.budget_max) {
      const min = persona.budget_min || 0;
      const max = persona.budget_max || "Belirsiz";
      info.push(`Bütçe: ${min} - ${max} TL`);
    }

    if (persona.personality_traits?.length) {
      info.push(
        `Kişilik: ${persona.personality_traits.slice(0, 3).join(", ")}`
      );
    }

    return info.length > 0
      ? info.join(" • ")
      : "Yeterli persona bilgisi bulunmuyor";
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Persona Bilgileri */}
      <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
        <div className="font-medium text-blue-800 mb-1 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
          {persona.name} - Kişisel Analiz
        </div>
        <div className="text-blue-700">{renderPersonaInfo()}</div>
      </div>

      {/* Buton ve Hata Mesajı */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <button
          onClick={handleClick}
          disabled={loading || !persona.id}
          className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 px-5 py-2.5 text-sm font-medium text-white hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 shadow-sm transition-all duration-200"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              AI Analiz Yapıyor...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              {buttonLabel}
            </>
          )}
        </button>

        {error && (
          <div className="flex-1">
            <div className="text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Öneri Listesi */}
      {ideas.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-sky-300 mt-5">
              {persona.name} için Özel Hediye Önerileri
            </h3>
            <span className="text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              {ideas.length} öneri
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ideas.map((idea, idx) => (
              <div
                key={`${idx}-${idea.substring(0, 20).replace(/\s+/g, "-")}`}
                className="group relative overflow-hidden rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Sıra Numarası */}
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </div>
                </div>

                <div className="relative">
                  {/* Emoji ve İçerik */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg flex items-center justify-center text-lg">
                      🎁
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 leading-tight break-words">
                        {idea}
                      </h4>
                      <p className="mt-1 text-xs text-gray-500">
                        {persona.name} için özel seçilmiş
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Boş Durum */}
      {ideas.length === 0 && !loading && !error && (
        <div className="text-center py-8">
          <div className="text-gray-300 mb-3">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
          </div>
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            Kişiselleştirilmiş Hediye Önerileri
          </h4>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Butona tıklayarak {persona.name} için AI destekli,
            kişiselleştirilmiş hediye önerileri alabilirsiniz.
          </p>
        </div>
      )}

      {/* Yükleniyor Durumu */}
      {loading && (
        <div className="text-center py-8">
          <div className="flex justify-center mb-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
          <p className="text-sm text-gray-600">
            AI, {persona.name} için en uygun hediyeleri analiz ediyor...
          </p>
        </div>
      )}
    </div>
  );
};

export default GiftSuggestions;
