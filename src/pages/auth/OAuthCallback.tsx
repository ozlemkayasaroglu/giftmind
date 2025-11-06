import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { oauthService } from "../../lib/oauthService";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) {
        setError(`Authentication failed: ${error}`);
        setTimeout(() => navigate("/login?error=oauth_failed"), 2000);
        return;
      }

      if (!code) {
        setError("Missing authentication code");
        setTimeout(() => navigate("/login?error=oauth_failed"), 2000);
        return;
      }

      try {
        console.log("Handling callback with code:", code);
        const { data, error } = await oauthService.handleCallback(code);
        console.log("Callback response:", { data, error });

        if (error) {
          throw new Error(error.message);
        }

        if (data?.token) {
          // Token storage is handled in oauthService
          console.log("Authentication successful, redirecting to dashboard...");
          window.location.href = "/dashboard";
        } else {
          console.error("No token in callback response:", data);
          throw new Error("No authentication token received");
        }
      } catch (error: any) {
        console.error("OAuth callback error:", error);
        setError(error.message || "Failed to complete authentication");
        setTimeout(() => navigate("/login?error=oauth_failed"), 2000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(1200px circle at 50% -20%, rgba(35,201,255,0.18), transparent 40%), linear-gradient(180deg, #0C0C1E 0%, #0B0B1A 100%)",
      }}
    >
      <div className="w-full max-w-md text-center">
        {error ? (
          <div className="text-red-400">
            <h2 className="text-xl font-semibold mb-2">
              Authentication Failed
            </h2>
            <p>{error}</p>
            <p className="mt-2 text-sm text-gray-400">
              Redirecting to login...
            </p>
          </div>
        ) : (
          <div className="text-white">
            <h2 className="text-xl font-semibold mb-2">
              Completing Authentication
            </h2>
            <p className="text-gray-400">Please wait...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;
