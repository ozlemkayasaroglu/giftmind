# GiftMind - AI-Powered Gift Recommendation Platform

GiftMind is a modern web application that helps users discover perfect gifts using AI-powered persona-based recommendations. Built with React, TypeScript, Vite, and Supabase.

## ✨ Features

- 🔐 **Secure Authentication** - User registration and login with Supabase Auth
- 👤 **Gift Personas** - Create and manage different gift recipient personas
- 🎁 **Smart Recommendations** - AI-powered gift suggestions based on personas
- 📱 **Responsive Design** - Beautiful UI with Tailwind CSS
- 🛡️ **Protected Routes** - Secure access to user-specific content

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ozlemkayasaroglu/giftmind.git
cd giftmind-fe
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

4. **Configure Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key to `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start development server**
```bash
npm run dev
```

## 🧪 Testing

### Test User Credentials

For testing the authentication flow, you can register with:
- **Email**: test@giftmind.com
- **Password**: TestUser123!

### Test Routes

- `/login` - User authentication
- `/register` - New user registration  
- `/dashboard` - Main application (protected)
- `/persona/:id` - Persona details (protected)

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Ready for Vercel/Netlify

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Route components
├── context/       # React Context (Auth)
├── lib/           # Utility functions (Supabase client)
├── hooks/         # Custom React hooks
└── assets/        # Static assets
```

## 🔧 Development

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Quality

This project uses:
- **ESLint** for code linting
- **TypeScript** for type safety
- **Prettier** (recommended) for code formatting

## 🔒 Security

- Environment variables are safely handled with Vite
- Supabase anon key is designed for frontend use
- Row Level Security (RLS) should be enabled in Supabase
- See `SECURITY.md` for detailed security guidelines

## 🚀 Deployment

1. **Build the project**
```bash
npm run build
```

2. **Deploy to Vercel/Netlify**
   - Connect your GitHub repository
   - Add environment variables
   - Deploy automatically on push

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Happy coding! 🎉**
