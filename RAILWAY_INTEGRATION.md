# GiftMind Railway API Integration

## Overview
This document outlines the complete integration of GiftMind frontend with the Railway backend API.

**Railway Backend URL**: `https://giftmind-be-production.up.railway.app`

## Changes Made

### 1. Railway API Client (`src/lib/railwayApi.ts`)
- **Purpose**: Direct API client for Railway backend
- **Features**:
  - JWT token management with localStorage
  - Comprehensive error handling
  - Full CRUD operations for personas
  - Gift recommendation services
  - User preferences management
  - Health checks

**Key Methods**:
```typescript
// Authentication
railwayApi.register(email, password, firstName?, lastName?)
railwayApi.login(email, password)
railwayApi.logout()
railwayApi.getCurrentUser()

// Personas
railwayApi.getPersonas()
railwayApi.createPersona(persona)
railwayApi.getPersona(id)
railwayApi.updatePersona(id, persona)
railwayApi.deletePersona(id)

// Gift Recommendations
railwayApi.getGiftRecommendations(personaId)
railwayApi.searchGifts(query, filters?)
railwayApi.getGiftCategories()

// User Preferences
railwayApi.getUserPreferences()
railwayApi.updateUserPreferences(preferences)
```

### 2. Railway Authentication Service (`src/lib/railwayAuth.ts`)
- **Purpose**: Bridge between Railway API and existing Supabase-compatible auth interface
- **Features**:
  - Compatible with existing AuthContext
  - Session management
  - Auth state change notifications
  - Token validation and refresh
  - Backward compatibility with existing auth hooks

**Interface Compatibility**:
```typescript
// All existing auth methods work the same
await railwayAuth.signUp(email, password, options?)
await railwayAuth.signInWithPassword(email, password)
await railwayAuth.signOut()
await railwayAuth.getUser()
await railwayAuth.getSession()
railwayAuth.onAuthStateChange(callback)
```

### 3. Updated AuthContext (`src/context/AuthContext.tsx`)
- **Purpose**: Maintains existing auth interface while using Railway backend
- **Changes**:
  - Imports Railway auth instead of Supabase
  - Supports firstName/lastName in registration
  - Maintains all existing auth state management
  - Compatible with all existing components

### 4. Enhanced HTTP Client (`src/lib/httpClient.ts`)
- **Purpose**: Unified API service layer
- **Features**:
  - Direct Railway API integration
  - Mock data fallback (disabled)
  - Consistent error handling
  - Auth token management

### 5. Updated API Configuration (`src/lib/api.ts`)
- **Purpose**: Central API endpoint configuration
- **Changes**:
  - Railway base URL configuration
  - Updated endpoint paths to match Railway API
  - Environment variable support

### 6. Enhanced Registration (`src/pages/RegisterPage.tsx`)
- **Purpose**: Support Railway API registration format
- **Features**:
  - First name and last name fields
  - Direct dashboard redirect on success
  - Enhanced validation

### 7. Environment Configuration (`.env`)
- **Purpose**: Configuration management
- **Changes**:
  - Primary API URL points to Railway
  - Commented out Supabase configuration
  - Clear documentation

## API Endpoints

### Authentication
- `POST /api/register` - User registration with firstName/lastName
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user profile

### Personas
- `GET /api/personas` - List user personas
- `POST /api/personas` - Create new persona
- `GET /api/personas/:id` - Get specific persona
- `PUT /api/personas/:id` - Update persona
- `DELETE /api/personas/:id` - Delete persona

### Gift Recommendations
- `GET /api/personas/:id/recommendations` - Get gift recommendations for persona
- `POST /api/gifts/search` - Search gifts with query and filters
- `GET /api/gifts/categories` - Get available gift categories

### User Preferences
- `GET /api/preferences` - Get user preferences
- `PUT /api/preferences` - Update user preferences

### Health Check
- `GET /health` - API health status

## Authentication Flow

1. **Registration**: User provides email, password, firstName, lastName
2. **Login**: User provides email, password
3. **Token Storage**: JWT token stored in localStorage as 'authToken'
4. **API Requests**: Token sent as Bearer token in Authorization header
5. **Session Management**: Session state maintained in React context
6. **Logout**: Token cleared from localStorage and session state

## Error Handling

All API calls return consistent response format:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  user?: User;
  token?: string;
  message?: string;
  error?: string;
}
```

## Migration Benefits

1. **Seamless Integration**: All existing components work without changes
2. **Enhanced Features**: Support for first/last names, better user management
3. **Direct Communication**: No intermediate auth layer, direct API calls
4. **Better Performance**: Optimized API client with Railway backend
5. **Scalability**: Railway infrastructure handles scaling automatically

## Development Workflow

1. **Environment Setup**: Update `.env` with Railway URL
2. **Authentication Testing**: Test login/register flows
3. **Persona Management**: Test CRUD operations
4. **Gift Recommendations**: Test recommendation engine
5. **Error Handling**: Verify error states and recovery

## Deployment Considerations

- Railway backend already deployed and accessible
- Frontend environment variables properly configured
- CORS configuration should allow frontend domain
- API rate limiting considerations for production
- SSL/HTTPS properly configured for secure token transmission

## Backward Compatibility

The integration maintains 100% backward compatibility with existing:
- Component interfaces
- Hook usage patterns
- Auth flow logic
- Error handling
- State management

All existing features continue to work while gaining Railway backend capabilities.

## Testing

1. **Start Development Server**: `npm run dev`
2. **Test Registration**: Create new account with first/last name
3. **Test Login**: Login with registered credentials
4. **Test Dashboard**: Verify persona loading from Railway API
5. **Test API Health**: Check `/health` endpoint availability

## Production Deployment

1. Ensure `.env` has correct Railway URL
2. Build frontend: `npm run build`
3. Deploy to hosting platform (Vercel, Netlify, etc.)
4. Verify CORS settings on Railway backend
5. Test complete user journey in production environment
