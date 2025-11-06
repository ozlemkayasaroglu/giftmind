import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context";
import { oauthService } from "../lib/oauthService";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { error } = await login(email, password);
      if (error) {
        setError(error.message || "Login failed");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setIsLoading(true);
      
      const { data, error } = await oauthService.signInWithGoogle();
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to get OAuth URL');
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err.message || 'Failed to sign in with Google');
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(1200px circle at 50% -20%, rgba(35,201,255,0.18), transparent 40%), linear-gradient(180deg, #0C0C1E 0%, #0B0B1A 100%)",
      }}
    >
      <div className="w-full max-w-md">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-white">giftMind</h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Gift your mind with intelligence
          </p>
        </div>

        {/* Card */}
        <div
          className="mt-8 rounded-2xl p-6 md:p-8"
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.04), 0 20px 60px rgba(123,97,255,0.15), 0 10px 30px rgba(35,201,255,0.10)",
          }}
        >
          {/* Tabs */}
          <div
            className="rounded-full p-1 mb-6 grid grid-cols-2 gap-1"
            style={{ backgroundColor: "#1E2034" }}
          >
            <div
              className="text-center text-sm font-medium py-2 rounded-full"
              style={{ backgroundColor: "#2A2855", color: "white" }}
            >
              Sign In
            </div>
            <Link
              to="/register"
              className="text-center text-sm font-medium py-2 rounded-full"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Sign Up
            </Link>
          </div>

          {error && (
            <div
              className="mb-4 text-sm rounded-xl px-3 py-2"
              style={{
                backgroundColor: "#3b1d2a",
                color: "#ff9eb8",
                border: "1px solid rgba(255,158,186,0.3)",
              }}
            >
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                className="block text-xs mb-1"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
                style={{
                  backgroundColor: "#17182B",
                  color: "#E5E7EB",
                  border: "1px solid #2A2B3F",
                  boxShadow: "0 0 0 0 rgba(35,201,255,0)",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 0 0 4px rgba(35,201,255,0.15)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 0 0 0 rgba(35,201,255,0)")
                }
                placeholder="Enter your email address"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                className="block text-xs mb-1"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
                style={{
                  backgroundColor: "#17182B",
                  color: "#E5E7EB",
                  border: "1px solid #2A2B3F",
                  boxShadow: "0 0 0 0 rgba(35,201,255,0)",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 0 0 4px rgba(35,201,255,0.15)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 0 0 0 rgba(35,201,255,0)")
                }
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl text-white font-medium py-2.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "var(--gm-primary)" }}
            >
              {isLoading ? "Signing in…" : "Sign In"}
            </button>

            {/* Divider */}
            <div
              className="flex items-center gap-3 text-xs"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              <div
                className="h-px flex-1"
                style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
              />
              Or continue with
              <div
                className="h-px flex-1"
                style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
              />
            </div>

            {/* Google login button */}
            <div className="flex items-center justify-center">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium"
                style={{
                  backgroundColor: "#1A1B2E",
                  border: "1px solid #2A2B3F",
                }}
                onClick={handleGoogleLogin}
                disabled={isLoading}
                aria-label="Sign in with Google"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Sign in with Google</span>
              </button>
            </div>

            <div
              className="text-center text-sm"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Don't have an account?{" "}
              <Link to="/register" style={{ color: "var(--gm-primary)" }}>
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
