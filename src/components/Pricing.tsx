import { Check, Sparkles, Crown } from "lucide-react";

const plans = [
  {
    name: "Ücretsiz",
    price: "0",
    period: "Sonsuza kadar ücretsiz",
    description: "Kişisel kullanım için temel özellikler",
    icon: Sparkles,
    color: "from-gray-400 to-gray-500",
    features: [
      "3 kişi profili",
      "Temel AI önerileri",
      "Email hatırlatıcıları",
      "Topluluk desteği",
    ],
    cta: "Ücretsiz Başla",
    popular: false,
  },
  {
    name: "Premium",
    price: "49",
    period: "Aylık",
    description: "Aileler ve aktif hediye verenler için",
    icon: Crown,
    color: "from-[#7B61FF] to-[#23C9FF]",
    features: [
      "Sınırsız kişi profili",
      "Gelişmiş AI önerileri",
      "SMS ve push hatırlatıcıları",
      "İşbirlikçi liste paylaşımı",
      "Fiyat takibi ve indirim uyarıları",
      "Öncelikli destek",
      "Özel etkinlik planlaması",
    ],
    cta: "Premium'a Geç",
    popular: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#1A1A1A] mb-4">
            Size Uygun Planı Seçin
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            İhtiyaçlarınıza göre tasarlanmış esnek fiyatlandırma seçenekleri
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white border-2 ${
                plan.popular
                  ? "border-[#7B61FF] shadow-2xl scale-105"
                  : "border-gray-200 shadow-lg"
              } rounded-3xl p-8 transition-all duration-300 hover:shadow-xl`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-[#7B61FF] to-[#23C9FF] text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    En Popüler
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                >
                  <plan.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                  {plan.name}
                </h3>

                <div className="mb-2">
                  <span className="text-4xl font-bold text-[#1A1A1A]">
                    ₺{plan.price}
                  </span>
                  {plan.price !== "0" && (
                    <span className="text-gray-500 ml-2">/{plan.period}</span>
                  )}
                </div>

                <p className="text-gray-600">{plan.description}</p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  plan.popular
                    ? "bg-gradient-to-r from-[#7B61FF] to-[#23C9FF] hover:from-[#6751E8] hover:to-[#0BB5E0] text-white shadow-lg"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Note */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Sorularınız mı var? Hemen yanıtlayalım.
          </p>
          <button className="text-[#7B61FF] hover:text-[#6751E8] font-semibold underline">
            SSS bölümünü görün
          </button>
        </div>
      </div>
    </section>
  );
}
