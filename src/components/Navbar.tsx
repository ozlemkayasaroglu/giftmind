import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context";
import { LogOut } from "lucide-react";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null; // Visible only when logged in

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      navigate("/login");
    }
  };

  return (
    <nav
      className="mx-4 mt-4 rounded-2xl text-white shadow-lg"
      style={{
        background:
          "linear-gradient(135deg,#0C0C1E 0%, #16163A 60%, #0C0C1E 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="font-semibold text-lg tracking-tight hover:opacity-90 flex items-center gap-3"
          >
            <img
              className="h-10 w-10 rounded-xl"
              src="/Logo.jpeg"
              alt="GiftMind Logo"
            />
            <span className="hidden sm:inline">GiftMind</span>
          </Link>

          {/* Nav actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-white/10 hover:bg-white/15 transition"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-white shadow transition"
              style={{ backgroundColor: "var(--gm-primary)" }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
