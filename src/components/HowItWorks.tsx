import { UserPlus, Settings, Lightbulb, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LoginPage } from "../pages";

const steps = [
  {
    number: 1,
    icon: UserPlus,
    title: "Kişi Ekle",
    description: "Sevdiklerinizi uygulamaya ekleyin",
    color: "from-[#7B61FF] to-[#6751E8]",
  },
  {
    number: 2,
    icon: Settings,
    title: "Profil Oluştur",
    description: "İlgi alanlarını ve tercihlerini kaydedin",
    color: "from-[#23C9FF] to-[#0BB5E0]",
  },
  {
    number: 3,
    icon: Lightbulb,
    title: "Öneri Al",
    description: "AI destekli hediye fikirlerini görün",
    color: "from-[#FF9EEA] to-[#E084D7]",
  },
  {
    number: 4,
    icon: Gift,
    title: "Mutlu Et",
    description: "Mükemmel hediyeyi seçin",
    color: "from-[#00C9A7] to-[#00B398]",
  },
];

export default function HowItWorks() {
  const navigate = useNavigate();
  return (
    <section id="how-it-works" className="py-20 bg-white">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-[#1A1A1A] mb-4">
          Nasıl Çalışır?
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Sadece 4 basit adımda mükemmel hediyeyi bulun
        </p>
      </div>

      {/* Steps */}
      <div className="relative">
        {/* Connection Line - Desktop */}
        <div className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
          <div className="flex justify-between items-center">
            {steps.slice(0, -1).map((_, index) => (
              <div
                key={index}
                className="flex-1 h-1 bg-gradient-to-r from-[#7B61FF]/20 to-[#23C9FF]/20 mx-8"
              ></div>
            ))}
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              {/* Step Number */}
              <div
                className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
              >
                <span className="text-white font-bold text-xl">
                  {step.number}
                </span>
              </div>

              {/* Icon */}
              <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-100 transition-colors duration-300">
                <step.icon className="w-10 h-10 text-gray-600" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div onClick={() => navigate("/login")} className="text-center mt-16">
        <button className="bg-gradient-to-r from-[#7B61FF] to-[#23C9FF] hover:from-[#6751E8] hover:to-[#0BB5E0] text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl">
          Hemen Başla
        </button>
      </div>
    </section>
  );
}
