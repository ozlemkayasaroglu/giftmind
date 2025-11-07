import React, { useMemo, useState } from "react";

interface GiftSuggestionsProps {
  personaId: string;
  className?: string;
  buttonLabel?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const GiftSuggestions: React.FC<GiftSuggestionsProps> = ({
  personaId,
  className = "",
  buttonLabel = "Get Gift Suggestions",
}) => {
  const [ideas, setIdeas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authHeader = useMemo(() => {
    const token =
      localStorage.getItem("railway_token") ||
      localStorage.getItem("authToken");
    return token
      ? { Authorization: `Bearer ${token}` }
      : ({} as Record<string, string>);
  }, []);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/gift/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader,
        } as HeadersInit,
        body: JSON.stringify({ personaId }),
      });

      const text = await res.text();
      let json: any = {};
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(`Unexpected response: ${text.substring(0, 120)}...`);
      }

      if (!res.ok) {
        throw new Error(
          json?.message ||
            json?.error ||
            `Failed to get suggestions (${res.status})`
        );
      }

      const list: string[] =
        json?.data ?? json?.suggestions ?? json?.recommendations ?? [];
      setIdeas(Array.isArray(list) ? list : []);
    } catch (e: any) {
      setError(e?.message || "Failed to get suggestions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <button
          onClick={handleClick}
          disabled={loading}
          className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 shadow-sm"
        >
          {loading ? "Getting Suggestions…" : buttonLabel}
        </button>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>

      {ideas.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ideas.map((idea, idx) => (
            <div
              key={`${idx}-${idea.slice(0, 10)}`}
              className="group relative overflow-hidden rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200 transition hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-start gap-3">
                <div className="text-2xl leading-none select-none">🎁</div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    {idea}
                  </h4>
                  <p className="mt-1 text-xs text-gray-500">
                    Curated idea tailored to this persona
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {ideas.length === 0 && !loading && !error && (
        <div className="text-sm text-gray-500">
          No suggestions yet. Click the button to generate ideas.
        </div>
      )}
    </div>
  );
};

export default GiftSuggestions;
