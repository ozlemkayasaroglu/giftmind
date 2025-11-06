import { Star, Quote } from "lucide-react";
import { useNavigate } from "react-router-dom";

const testimonials = [
  {
    name: "Ayşe Y.",
    location: "İstanbul",
    rating: 5,
    text: "Artık hediye seçmek saatlerimi almıyor! GiftMind sayesinde annemin doğum günü için mükemmel hediyeyi 5 dakikada buldum.",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Mehmet K.",
    location: "Ankara",
    rating: 5,
    text: "Eşim için aldığım hediye gerçekten onu çok mutlu etti. AI önerileri o kadar doğruydu ki, sanki onu yıllardır tanıyormuş gibi.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Zeynep S.",
    location: "İzmir",
    rating: 5,
    text: "Çocuklarım için hediye bulmak artık çok kolay. Yaş, cinsiyet ve ilgi alanlarına göre öneriler gerçekten çok isabetli.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Ali R.",
    location: "Bursa",
    rating: 5,
    text: "Arkadaşlarımla birlikte hediye listeleri oluşturmak harika bir özellik. Grup hediyesi için mükemmel koordinasyon sağladık.",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Fatma T.",
    location: "Antalya",
    rating: 5,
    text: "Hatırlatıcı özelliği sayesinde hiçbir özel günü kaçırmıyorum. Çok düşünceli hediyeler verdiğim için herkesten övgü alıyorum.",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Can D.",
    location: "Trabzon",
    rating: 5,
    text: "İş arkadaşlarım için hediye seçmek hep zordu. GiftMind profesyonel ve kişisel tercihleri mükemmel dengeliyor.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
  },
];

export default function Testimonials() {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-[#F6F7FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#1A1A1A] mb-4">
            Kullanıcılarımız Ne Diyor?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Binlerce mutlu kullanıcının deneyimlerini keşfedin
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative group"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-[#7B61FF]/20 mb-4" />

              {/* Stars */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-semibold text-[#1A1A1A]">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {testimonial.location}
                  </div>
                </div>
              </div>

              {/* Hover Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#7B61FF] to-[#23C9FF] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            Siz de bu mutlu kullanıcılarımıza katılın
          </p>
          <button
            onClick={() => navigate("/register")}
            className="bg-gradient-to-r from-[#7B61FF] to-[#23C9FF] hover:from-[#6751E8] hover:to-[#0BB5E0] text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Ücretsiz Hesap Oluştur
          </button>
        </div>
      </div>
    </section>
  );
}
