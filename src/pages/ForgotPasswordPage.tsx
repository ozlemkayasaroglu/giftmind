import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await api.auth.requestPasswordReset(email);
      if (result.error) {
        setError(result.error.message || 'Şifre sıfırlama e-postası gönderilemedi');
      } else {
        setMessage('Eğer bu e-posta kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.');
      }
    } catch (err) {
      setError('Beklenmeyen bir hata oluştu');
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
            Reset your password
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
          {message && (
            <div className="mb-4 text-sm rounded-xl px-3 py-2" style={{ backgroundColor: '#112717', color: '#34D399', border: '1px solid rgba(52,211,153,0.35)' }}>{message}</div>
          )}
          {error && (
            <div className="mb-4 text-sm rounded-xl px-3 py-2" style={{ backgroundColor: '#3b1d2a', color: '#ff9eb8', border: '1px solid rgba(255,158,186,0.3)' }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                style={{ backgroundColor: '#17182B', color: '#E5E7EB', border: '1px solid #2A2B3F' }}
                placeholder="ornek@mail.com"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl text-white font-medium py-2.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--gm-primary)' }}
            >
              {isLoading ? 'Gönderiliyor…' : 'Sıfırlama Bağlantısı Gönder'}
            </button>

            <div className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
              <Link to="/login" style={{ color: 'var(--gm-primary)' }}>Giriş sayfasına dön</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
