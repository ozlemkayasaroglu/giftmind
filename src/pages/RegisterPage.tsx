import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await register(
        formData.email, 
        formData.password, 
        formData.firstName, 
        formData.lastName
      );
      
      if (error) {
        setError(error.message || 'Registration failed');
      } else {
        // Registration successful - redirect to dashboard
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
              Sign Up
            </div>
            <Link
              to="/login"
              className="text-center text-sm font-medium py-2 rounded-full"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              Sign In
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs mb-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  First name
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
                  style={{ backgroundColor: '#17182B', color: '#E5E7EB', border: '1px solid #2A2B3F' }}
                  placeholder="First name"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  Last name
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
                  style={{ backgroundColor: '#17182B', color: '#E5E7EB', border: '1px solid #2A2B3F' }}
                  placeholder="Last name"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs mb-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
                style={{ backgroundColor: '#17182B', color: '#E5E7EB', border: '1px solid #2A2B3F' }}
                placeholder="Enter your email address"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs mb-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
                  style={{ backgroundColor: '#17182B', color: '#E5E7EB', border: '1px solid #2A2B3F' }}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
                  style={{ backgroundColor: '#17182B', color: '#E5E7EB', border: '1px solid #2A2B3F' }}
                  placeholder="Re-enter your password"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl text-white font-medium py-2.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--gm-primary)' }}
            >
              {isLoading ? 'Creating account…' : 'Create Account'}
            </button>

            <div className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--gm-primary)' }}>Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
