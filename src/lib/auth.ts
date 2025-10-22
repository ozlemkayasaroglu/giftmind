// Legacy Auth Module - DEACTIVATED
// Railway API kullanıldığı için bu dosya artık kullanılmıyor
// Backward compatibility için railwayAuth'u yönlendir

import { railwayAuth } from './railwayAuth';

console.warn('⚠️ Legacy auth.ts dosyası kullanılıyor - Railway auth\'a yönlendiriliyor');

// Legacy uyumluluk için auth objesini railwayAuth'a yönlendir
export const auth = railwayAuth;
