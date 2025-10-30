import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context';
import { ProtectedRoute, Navbar } from './components';
import { LoginPage, RegisterPage, Dashboard, PersonaDetailPage, ForgotPasswordPage } from './pages';

function App() {
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
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/persona/:id" 
              element={
                <ProtectedRoute>
                  <PersonaDetailPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App
