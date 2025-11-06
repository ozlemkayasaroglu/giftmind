import { User, Brain, Bell, Users } from "lucide-react";

const features = [
  {
    icon: User,
    title: "Kişiselleştirilmiş Profiller",
    description:
      "Sevdiklerinizin ilgi alanlarını, hobilerini ve tercihlerini kaydedin",
    color: "from-[#7B61FF] to-[#6751E8]",
  },
  {
    icon: Brain,
    title: "Akıllı Öneriler",
    description: "Yapay zeka ile kişiye özel hediye fikirleri alın",
    color: "from-[#23C9FF] to-[#0BB5E0]",
  },
  {
    icon: Bell,
    title: "Bilgi Sürekliliği",
    description: "Her yeni haber ya da gelişmede anında önerinizi güncelleyin",
    color: "from-[#FF9EEA] to-[#E084D7]",
  },
  {
    icon: Users,
    title: "Büyümenin Kolay Yolu",
    description: "Sevdiklerinizin hayatındaki önemli anlara ortak olun",
    color: "from-[#FF9EEA] to-[#E084D7]",
  },
  // {
  //   icon: Bell,
  //   title: 'Özel Gün Hatırlatıcıları',
  //   description: 'Doğum günleri ve özel günler için zamanında hatırlatma',
  //   color: 'from-[#FF9EEA] to-[#E084D7]'
  // },
  // {
  //   icon: Users,
  //   title: 'İşbirlikçi Liste',
  //   description: 'Aile ve arkadaşlarla birlikte hediye fikirleri ekleyin',
  //   color: 'from-[#00C9A7] to-[#00B398]'
  // }
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-[#F6F7FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#1A1A1A] mb-4">
            Hediye Seçimini Kolaylaştıran Özellikler
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            GiftMind ile hediye verme deneyiminizi bir üst seviyeye taşıyın
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-[#7B61FF] to-[#23C9FF] rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">%100</div>
              <div className="text-white/80">Yanlış hediye riskini azaltır</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">%70</div>
              <div className="text-white/80">
                Hediye arama süresini kısaltır
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-white/80">Mutlu kullanıcı</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
