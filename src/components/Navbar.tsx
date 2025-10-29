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
    <nav className="mx-4 rounded-2xl text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-14 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="font-semibold text-lg tracking-tight hover:opacity-90"
          >
            <img
              className="h-12 w-12 rounded-xl mt-4"
              src="/Logo.jpeg"
              alt="GiftMind Logo"
            />
          </Link>

          {/* Nav actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-white text-indigo-700 hover:bg-gray-100 shadow transition-colors"
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
