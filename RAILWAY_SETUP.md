# Railway URL Güncelleme Rehberi

## Railway'den API URL'ini Alma:

1. Railway.app'te login olun
2. Projenizi açın (giftmind-be)
3. "Settings" sekmesinde "Domains" bölümünü bulun
4. Public URL'i kopyalayın (örnek: https://giftmind-backend-production.up.railway.app)

## .env Dosyasını Güncelleme:

```bash
# .env dosyasında VITE_API_BASE_URL'i güncelleyin:
VITE_API_BASE_URL=https://your-actual-railway-url.up.railway.app
```

## Test:

Geliştirme sunucusu otomatik restart olacak ve gerçek API'yi kullanmaya başlayacak.

Console'da "API Health Check" loglarını görebilirsiniz.

## Sorun Giderme:

Eğer API çalışmıyorsa:
1. Railway deployment loglarını kontrol edin
2. API endpoint'lerinin doğru olduğunu確认认定
3. CORS ayarlarının frontend domain'ini allow ettiğini kontrol edin
