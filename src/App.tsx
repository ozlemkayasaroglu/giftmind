import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context';
import { ProtectedRoute, Navbar } from './components';
import { LoginPage, RegisterPage, Dashboard, PersonaDetailPage, ForgotPasswordPage } from './pages';
import OAuthCallback from './pages/auth/OAuthCallback';

export default function App(): ReactElement {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen" style={{ background: 'linear-gradient(180deg,#F6F7FB 0%, #EEF0F7 100%)' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/callback" element={<OAuthCallback />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/persona/:id"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-b from-[#F6F7FB] to-[#EEF0F7]">
                  <Navbar />
                  <PersonaDetailPage />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
