import { StarHalf, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#0C0C1E] border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl">
              <StarHalf className="w-8 h-8 text-white" />
            </div>
            <span className="text-white text-xl font-bold">GiftMind</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-300 hover:text-[#23C9FF] transition-colors"
            >
              Özellikler
            </a>
            <a
              href="#how-it-works"
              className="text-gray-300 hover:text-[#23C9FF] transition-colors"
            >
              Nasıl Çalışır?
            </a>
            {/* <a
              href="#pricing"
              className="text-gray-300 hover:text-[#23C9FF] transition-colors"
            >
              Fiyatlandırma
            </a> */}
            {/* <a
              href="#about"
              className="text-gray-300 hover:text-[#23C9FF] transition-colors"
            >
              Hakkımızda
            </a> */}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-800">
              <a
                href="#features"
                className="block px-3 py-2 text-gray-300 hover:text-[#23C9FF] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Özellikler
              </a>
              <a
                href="#how-it-works"
                className="block px-3 py-2 text-gray-300 hover:text-[#23C9FF] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Nasıl Çalışır?
              </a>
              {/* <a
                href="#pricing"
                className="block px-3 py-2 text-gray-300 hover:text-[#23C9FF] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Fiyatlandırma
              </a> */}
              <a
                href="#about"
                className="block px-3 py-2 text-gray-300 hover:text-[#23C9FF] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Hakkımızda
              </a>
              <button className="w-full mt-4 bg-[#7B61FF] hover:bg-[#6751E8] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                Hemen Başla
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
