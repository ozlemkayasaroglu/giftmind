// Supabase Client - DEACTIVATED
// Railway API kullanıldığı için Supabase devre dışı bırakıldı

console.warn('⚠️ Supabase devre dışı - Railway API kullanılıyor');

// Legacy uyumluluk için mock supabase client
export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signUp: () => Promise.reject(new Error('Supabase devre dışı - Railway API kullanın')),
    signInWithPassword: () => Promise.reject(new Error('Supabase devre dışı - Railway API kullanın')),
    signOut: () => Promise.reject(new Error('Supabase devre dışı - Railway API kullanın')),
    onAuthStateChange: () => ({
      data: {
        subscription: {
          unsubscribe: () => console.log('Supabase auth listener temizlendi')
        }
      }
    }),
    refreshSession: () => Promise.resolve({ data: { session: null, user: null }, error: null })
  }
};

// Legacy imports için type definitions
export type Database = any;
