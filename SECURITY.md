# Supabase Security Configuration

## Environment Variables Security

### VITE_SUPABASE_URL
- ✅ Safe to expose in frontend
- This is your public Supabase project URL

### VITE_SUPABASE_ANON_KEY  
- ⚠️ Designed for frontend use but requires proper RLS setup
- This key has limited permissions by design
- Should be paired with Row Level Security (RLS) policies

## Security Checklist

### 1. Row Level Security (RLS)
Enable RLS on all tables in your Supabase database:
```sql
ALTER TABLE your_table_name ENABLE ROW LEVEL SECURITY;
```

### 2. Create Security Policies
Example policy for user-specific data:
```sql
CREATE POLICY "Users can only see their own data" ON your_table_name
FOR ALL USING (auth.uid() = user_id);
```

### 3. Never Expose Service Role Key
- Service role key should NEVER be in frontend code
- Keep it server-side only
- It bypasses all RLS policies

### 4. Use Environment-Specific Keys
- Different keys for development/staging/production
- Monitor usage in Supabase dashboard

### 5. Implement Authentication
- Always validate user authentication
- Use Supabase Auth for user management
- Implement proper session handling

## Additional Security Measures

### Rate Limiting
Configure rate limiting in Supabase dashboard

### API Key Restrictions
Set up domain restrictions if available

### Regular Monitoring
- Monitor API usage in Supabase dashboard
- Set up alerts for unusual activity
- Regular security audits
