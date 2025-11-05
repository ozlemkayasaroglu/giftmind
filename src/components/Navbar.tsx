import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context";
import { LogOut, StarHalf } from "lucide-react";

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
      className=" text-white shadow-lg "
      style={{
        background:
          "linear-gradient(135deg,#0C0C1E 0%, #16163A 60%, #0C0C1E 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 h-16 flex items-center justify-between">
          {/* Logo */}

          {/* Nav actions */}
          <div className="w-full max-w-6xl mx-auto px-4 mt-10 rounded-2xl border-gray-800 border ">
            <div className="flex items-center justify-between h-12">
              {/* Sol - marka */}
              <div className="flex items-center">
                <Link
                  to="/dashboard"
                  className="font-semibold text-lg tracking-tight hover:opacity-90 flex items-center"
                >
                  <StarHalf className="h-8 w-8" />
                  <span className="hidden sm:inline text-white">giftMind</span>
                </Link>
              </div>

              {/* Sağ - aksiyonlar */}
              <div className="flex items-center">
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-medium text-white shadow transition"
                  style={{ backgroundColor: "var(--gm-primary)" }}
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
