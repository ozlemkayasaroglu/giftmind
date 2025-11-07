import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'GiftMind nasıl çalışır?',
    answer: 'GiftMind, sevdiklerinizin profillerini oluşturmanızı sağlar ve yapay zeka teknolojisi kullanarak bu profillere göre kişiselleştirilmiş hediye önerileri sunar. İlgi alanları, hobiler, yaş, cinsiyet ve geçmiş hediye tercihleri gibi faktörleri analiz ederek en uygun seçenekleri bulur.'
  },
  {
    question: 'AI önerileri ne kadar doğru?',
    answer: 'Önerilerimiz %85+ doğruluk oranına sahiptir. Sistem, kullanıcı geri bildirimlerinden sürekli öğrenir ve her öneriyle birlikte daha da gelişir. Ayrıca, her profil için ne kadar çok bilgi girerseniz, öneriler o kadar kişiselleşir.'
  },
  {
    question: 'Premium özellikler nelerdir?',
    answer: 'Premium plan ile sınırsız profil oluşturabilir, gelişmiş AI önerilerinden faydalanabilir, SMS/push hatırlatıcıları alabilir, ailenizle liste paylaşabilir, fiyat takibi yapabilir ve öncelikli destek alabilirsiniz.'
  },
  {
    question: 'Verilerim güvende mi?',
    answer: 'Evet, tüm verileriniz şifrelenerek saklanır ve KVKK standartlarına uygun şekilde korunur. Kişisel bilgilerinizi üçüncü taraflarla paylaşmayız ve istediğiniz zaman hesabınızı silebilirsiniz.'
  },
  {
    question: 'Ücretsiz planın sınırları nelerdir?',
    answer: 'Ücretsiz plan ile 3 kişi profili oluşturabilir, temel AI önerilerinden faydalanabilir ve email hatırlatıcıları alabilirsiniz. Premium özellikler ve sınırsız kullanım için Premium plana geçebilirsiniz.'
  },
  {
    question: 'Nasıl iptal edebilirim?',
    answer: 'Premium aboneliğinizi istediğiniz zaman hesap ayarlarından iptal edebilirsiniz. İptal sonrası mevcut dönem bitene kadar Premium özelliklerden faydalanmaya devam edersiniz.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-[#F6F7FB]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#1A1A1A] mb-4">
            Sıkça Sorulan Sorular
          </h2>
          <p className="text-xl text-gray-600">
            Merak ettiğiniz her şeyin yanıtı burada
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <button
                className="w-full px-6 py-6 text-left flex items-center justify-between focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-semibold text-[#1A1A1A] pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="w-6 h-6 text-[#7B61FF]" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <div className="h-px bg-gray-200 mb-4"></div>
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Başka sorularınız mı var?
          </p>
          <button className="bg-gradient-to-r from-[#7B61FF] to-[#23C9FF] hover:from-[#6751E8] hover:to-[#0BB5E0] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
            Bizimle İletişime Geçin
          </button>
        </div>
      </div>
    </section>
  );
}
