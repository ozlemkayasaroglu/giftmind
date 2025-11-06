import { AlertCircle, CheckCircle } from "lucide-react";

export default function ProblemSolution() {
  const problems = [
    "Sevdiğiniz kişinin ne istediğini bilmiyorsunuz",
    "Saatlerce hediye aramaktan yoruluyorsunuz",
    "Yanlış hediye alma korkusu yaşıyorsunuz",
    "Özel günleri unutma riski taşıyorsunuz",
  ];

  const solutions = [
    "Kişiye özel profil analizi ile doğru tercihleri keşfedin",
    "AI destekli önerilerle dakikalar içinde hediye bulun",
    "Kişiselleştirilmiş önerilerle %100 isabetli hediyeler",
    "Akıllı hatırlatıcılarla hiçbir özel günü kaçırmayın",
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Problem Section */}
          <div>
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-8">
              Doğru Hediyeyi Bulmak Neden Zor?
            </h2>

            <div className="space-y-4 mb-8">
              {problems.map((problem, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 leading-relaxed">{problem}</p>
                </div>
              ))}
            </div>

            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
              <p className="text-red-700 font-medium">
                Sonuç: Stres, zaman kaybı ve hayal kırıklığı
              </p>
            </div>
          </div>

          {/* Solution Section */}
          <div>
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-8">
              GiftMind ile Kişiye Özel Hediye Keşfi
            </h2>

            <div className="space-y-4 mb-8">
              {solutions.map((solution, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 leading-relaxed">{solution}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-400 p-4 rounded-r-lg">
              <p className="text-green-700 font-medium">
                Sonuç: Mutlu alıcılar, memnun hediye verenler
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
