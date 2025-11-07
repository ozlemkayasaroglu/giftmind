import {
  StarHalf,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0C0C1E] border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className=" p-2 rounded-xl">
                <StarHalf className="w-8 h-8 text-white" />
              </div>
              <span className="text-white text-xl font-bold">GiftMind</span>
            </div>

            <p className="text-gray-400 mb-6 leading-relaxed">
              Yapay zeka destekli kişiselleştirilmiş hediye önerileriyle
              sevdiklerinizi mutlu etmenin en akıllı yolu.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-[#7B61FF] rounded-lg flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-[#23C9FF] rounded-lg flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-[#FF9EEA] rounded-lg flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-[#7B61FF] rounded-lg flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Ürün</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="text-gray-400 hover:text-[#23C9FF] transition-colors"
                >
                  Özellikler
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-gray-400 hover:text-[#23C9FF] transition-colors"
                >
                  Fiyatlandırma
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#23C9FF] transition-colors"
                >
                  API
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#23C9FF] transition-colors"
                >
                  Entegrasyonlar
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#23C9FF] transition-colors"
                >
                  Mobil Uygulama
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Şirket</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#about"
                  className="text-gray-400 hover:text-[#23C9FF] transition-colors"
                >
                  Hakkımızda
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#23C9FF] transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#23C9FF] transition-colors"
                >
                  Kariyer
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#23C9FF] transition-colors"
                >
                  Basın Kiti
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#23C9FF] transition-colors"
                >
                  İletişim
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6">İletişim</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#7B61FF]" />
                <span className="text-gray-400">hello@giftmind.app</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#23C9FF]" />
                <span className="text-gray-400">+90 (212) 555-0123</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#FF9EEA] mt-0.5" />
                <span className="text-gray-400">
                  Maslak Mahallesi
                  <br />
                  Büyükdere Caddesi No: 123
                  <br />
                  Şişli, İstanbul
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} GiftMind. Tüm hakları saklıdır.
            </div>

            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-[#23C9FF] transition-colors"
              >
                Gizlilik Politikası
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#23C9FF] transition-colors"
              >
                Kullanım Koşulları
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#23C9FF] transition-colors"
              >
                KVKK
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#23C9FF] transition-colors"
              >
                Çerez Politikası
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
