# Test User Information

## 🔧 Before Testing - Supabase Setup Required

1. Create a Supabase account at https://supabase.com
2. Create a new project
3. Copy your project URL and anon key
4. Create a .env file with your credentials

## 📝 Test User Credentials (After Setup)

Once Supabase is configured, you can use these test credentials:

### Test User 1
- **Email**: test@giftmind.com
- **Password**: TestUser123!

### Test User 2  
- **Email**: demo@giftmind.com
- **Password**: DemoUser123!

### Test User 3
- **Email**: admin@giftmind.com
- **Password**: AdminUser123!

## 🚀 How to Test

1. **Registration Flow**:
   - Go to `/register`
   - Use one of the test emails above
   - Complete registration
   - Check email for verification (if enabled)

2. **Login Flow**:
   - Go to `/login`
   - Use registered credentials
   - Should redirect to `/dashboard`

3. **Protected Routes**:
   - Try accessing `/dashboard` without login
   - Should redirect to `/login`

## ⚡ Quick Setup Commands

```bash
# Copy environment template
cp .env.example .env

# Edit with your Supabase credentials
# VITE_SUPABASE_URL=your_project_url
# VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 🔒 Security Note

These are test credentials only. In production:
- Use strong, unique passwords
- Enable email verification
- Set up proper RLS policies
- Monitor authentication logs
