import { ArrowRight, Gift, Sparkles } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#0C0C1E] via-[#1A1A2E] to-[#0C0C1E] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#7B61FF]/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#23C9FF]/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-[#FF9EEA]/5 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Icons */}
        <div className="flex justify-center items-center space-x-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-[#7B61FF] to-[#6751E8] rounded-2xl flex items-center justify-center animate-pulse">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-[#23C9FF] to-[#0BB5E0] rounded-xl flex items-center justify-center animate-bounce">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Main Headline */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Hediye Stresine{" "}
          <span className="bg-gradient-to-r from-[#7B61FF] to-[#23C9FF] bg-clip-text text-transparent">
            Son Verin
          </span>
        </h2>

        {/* Subheadline */}
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Artık yanlış hediye alma korkusu yaşamayın. GiftMind ile her hediyeniz
          tam isabeti olacak.
        </p>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">10K+</div>
            <div className="text-gray-400">Mutlu Kullanıcı</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">%95</div>
            <div className="text-gray-400">Memnuniyet Oranı</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">50K+</div>
            <div className="text-gray-400">Başarılı Hediye</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="bg-gradient-to-r from-[#7B61FF] to-[#23C9FF] hover:from-[#6751E8] hover:to-[#0BB5E0] text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center space-x-3 group">
            <span>Hemen Ücretsiz Başlayın</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
