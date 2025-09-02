
# Social Link Tree - social.samaraie.com

A modern, beautifully designed social media link aggregation platform featuring Apple's liquid glass UI design, advanced analytics, and comprehensive customization options. Built with React, Vite, TypeScript, and Supabase.

## ✨ Features

- **Apple Liquid Glass UI** - Beautiful glass morphism design with smooth animations
- **Advanced Analytics** - Click tracking and visitor metrics
- **Theme Customization** - 5 background themes with custom colors and auto-switching
- **Custom Link Personalization** - Individual link colors and 200+ emoji icon options
- **Responsive Design** - Mobile-first approach that works on all devices
- **Content Management** - Easy link management and customization
- **Supabase Integration** - Real-time database and Edge Functions
- **Static Site Ready** - Optimized for deployment on Cloudflare Pages

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Resend account (for email functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd social.samaraie
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your actual values:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ACCESS_TOKEN=your_supabase_access_token
   VITE_APP_ENV=development
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # Run TypeScript type checking
npm run lint         # Run ESLint
```

### Development Guidelines

- Follow the existing code style and patterns
- Use TypeScript for type safety
- Write clear, concise commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📁 Project Structure

```
social.samaraie/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components
│   │   └── LinkCard.tsx    # Social link display component
│   ├── pages/              # Page components
│   ├── contexts/           # React context providers
│   ├── services/           # External service integrations
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and configurations
│   └── utils/              # Helper functions
├── public/                 # Static assets
├── supabase/               # Supabase Edge Functions
│   └── functions/          # Serverless functions
└── build/                  # Production build output
```

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ACCESS_TOKEN=your_access_token_here

# App Configuration
VITE_APP_ENV=development
```

## 🚀 Deployment

### Cloudflare Pages (Recommended)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Cloudflare Pages**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set build output directory: `build`
   - Set environment variables in Cloudflare dashboard

### Supabase Edge Functions

The project includes a mailer Edge Function for password reset emails:

1. **Deploy the mailer function** (see `MANUAL_DEPLOYMENT.md`)
2. **Set environment variables** in Supabase:
   - `RESEND_API_KEY`: Your Resend API key
   - `FROM_EMAIL`: `noreply@social.samaraie.com`

## 🔐 Security

- All sensitive information is stored in environment variables
- No secrets are committed to the repository
- JWT authentication for Edge Functions
- Secure password reset via email

## 📱 PWA Features

- Installable web app
- Offline support
- Push notifications (configurable)
- Responsive design for all devices

## 🎨 Customization

- 5 built-in background themes
- Custom color schemes
- Emoji icon selection
- Responsive layout adjustments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the documentation in the `Docs/` folder
- Review `MANUAL_DEPLOYMENT.md` for deployment help
- Open an issue on GitHub

---

**Built with ❤️ using React, Vite, TypeScript, and Supabase**
  