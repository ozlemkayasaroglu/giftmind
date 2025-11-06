import { type ReactElement } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context";
import { ProtectedRoute, Navbar } from "./components";
import {
  LoginPage,
  RegisterPage,
  Dashboard,
  PersonaDetailPage,
  ForgotPasswordPage,
} from "./pages";
import LandingPage from "./pages/LandingPage";

export default function App(): ReactElement {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-b from-[#F6F7FB] to-[#EEF0F7]">
                  <Navbar />
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
