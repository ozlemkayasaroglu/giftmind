import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="bg-gradient-to-br from-[#0C0C1E] via-[#1A1A2E] to-[#0C0C1E] min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-[#7B61FF]/10 border border-[#7B61FF]/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-[#7B61FF]" />
              <span className="text-[#7B61FF] text-sm font-medium">
                Yapay Zeka Destekli
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Sevdiklerinize{" "}
              <span className="bg-gradient-to-r from-[#7B61FF] to-[#23C9FF] bg-clip-text text-transparent">
                Mükemmel Hediye
              </span>{" "}
              Bulmanın Akıllı Yolu
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-300 mb-8 max-w-2xl lg:max-w-none">
              Yapay zeka destekli kişiselleştirilmiş hediye önerileriyle artık
              hediye seçmek çok kolay
            </p>

            {/* Value Props */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center space-x-2 justify-center lg:justify-start">
                <div className="w-2 h-2 bg-[#FF9EEA] rounded-full"></div>
                <span className="text-gray-400 text-sm">%100 risk azaltma</span>
              </div>
              <div className="flex items-center space-x-2 justify-center lg:justify-start">
                <div className="w-2 h-2 bg-[#23C9FF] rounded-full"></div>
                <span className="text-gray-400 text-sm">%70 zaman tasarrufu</span>
              </div>
              <div className="flex items-center space-x-2 justify-center lg:justify-start">
                <div className="w-2 h-2 bg-[#7B61FF] rounded-full"></div>
                <span className="text-gray-400 text-sm">Kişiye özel öneriler</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-[#7B61FF] to-[#6751E8] hover:from-[#6751E8] hover:to-[#5B47D6] text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Ücretsiz Dene</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Column - App Mockup */}
          <div className="relative">
            <div className="bg-gradient-to-br from-[#F6F7FB] to-[#E5E7EB] rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>

                <div className="space-y-4">
                  <div className="h-4 bg-gradient-to-r from-[#7B61FF] to-[#23C9FF] rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-gradient-to-br from-[#7B61FF]/10 to-[#23C9FF]/10 p-4 rounded-xl">
                      <div className="w-8 h-8 bg-[#7B61FF] rounded-lg mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded w-full mb-1"></div>
                      <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="bg-gradient-to-br from-[#FF9EEA]/10 to-[#23C9FF]/10 p-4 rounded-xl">
                      <div className="w-8 h-8 bg-[#FF9EEA] rounded-lg mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded w-full mb-1"></div>
                      <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-[#FF9EEA] to-[#7B61FF] rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-[#23C9FF] to-[#7B61FF] rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
