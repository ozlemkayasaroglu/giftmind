import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error } = await login(email, password);
      if (error) {
        setError(error.message || 'Login failed');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          'radial-gradient(1200px circle at 50% -20%, rgba(35,201,255,0.18), transparent 40%), linear-gradient(180deg, #0C0C1E 0%, #0B0B1A 100%)',
      }}
    >
      <div className="w-full max-w-md">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-white">giftMind</h1>
          <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Gift your mind with intelligence
          </p>
        </div>

        {/* Card */}
        <div
          className="mt-8 rounded-2xl p-6 md:p-8"
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow:
              '0 0 0 1px rgba(255,255,255,0.04), 0 20px 60px rgba(123,97,255,0.15), 0 10px 30px rgba(35,201,255,0.10)',
          }}
        >
          {/* Tabs */}
          <div
            className="rounded-full p-1 mb-6 grid grid-cols-2 gap-1"
            style={{ backgroundColor: '#1E2034' }}
          >
            <div
              className="text-center text-sm font-medium py-2 rounded-full"
              style={{ backgroundColor: '#2A2855', color: 'white' }}
            >
              Sign In
            </div>
            <Link
              to="/register"
              className="text-center text-sm font-medium py-2 rounded-full"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              Sign Up
            </Link>
          </div>

          {error && (
            <div
              className="mb-4 text-sm rounded-xl px-3 py-2"
              style={{ backgroundColor: '#3b1d2a', color: '#ff9eb8', border: '1px solid rgba(255,158,186,0.3)' }}
            >
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs mb-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
                style={{
                  backgroundColor: '#17182B',
                  color: '#E5E7EB',
                  border: '1px solid #2A2B3F',
                  boxShadow: '0 0 0 0 rgba(35,201,255,0)',
                }}
                onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 4px rgba(35,201,255,0.15)')}
                onBlur={(e) => (e.currentTarget.style.boxShadow = '0 0 0 0 rgba(35,201,255,0)')}
                placeholder="Enter your email address"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-xs mb-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
                style={{
                  backgroundColor: '#17182B',
                  color: '#E5E7EB',
                  border: '1px solid #2A2B3F',
                  boxShadow: '0 0 0 0 rgba(35,201,255,0)',
                }}
                onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 4px rgba(35,201,255,0.15)')}
                onBlur={(e) => (e.currentTarget.style.boxShadow = '0 0 0 0 rgba(35,201,255,0)')}
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl text-white font-medium py-2.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--gm-primary)' }}
            >
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <div className="h-px flex-1" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
              Or continue with
              <div className="h-px flex-1" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
            </div>

            {/* Social icons (visual only) */}
            <div className="flex items-center justify-center gap-3">
              <button type="button" className="h-10 w-10 rounded-full" style={{ backgroundColor: '#1A1B2E', border: '1px solid #2A2B3F', color: '#E5E7EB' }}>G</button>
              <button type="button" className="h-10 w-10 rounded-full" style={{ backgroundColor: '#1A1B2E', border: '1px solid #2A2B3F', color: '#E5E7EB' }}>f</button>
            </div>

            <div className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Don’t have an account?{' '}
              <Link to="/register" style={{ color: 'var(--gm-primary)' }}>Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
