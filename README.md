
# Social Link Tree - social.samaraie.com

A modern, beautifully designed social media link aggregation platform featuring Apple's liquid glass UI design, advanced analytics, and comprehensive customization options. Built with React, Vite, TypeScript, and Supabase with Google Analytics 4 integration.

## ✨ Features

- **Apple Liquid Glass UI** - Beautiful glass morphism design with smooth animations
- **Advanced Analytics** - Click tracking, visitor metrics, and Google Analytics 4 integration
- **Theme Customization** - 5 background themes with custom colors and auto-switching
- **Custom Link Personalization** - Individual link colors and 200+ emoji icon options
- **Responsive Design** - Mobile-first approach that works on all devices
- **Content Management** - Easy link management and customization
- **Supabase Integration** - Real-time database and analytics storage
- **Static Site Ready** - Optimized for deployment on Cloudflare Pages, Vercel, or Netlify

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

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
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXXX
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
├── docs/                   # Project documentation
└── build/                 # Production build output
```

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Analytics 4 Configuration
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXXX

# Application Configuration
VITE_APP_ENV=development
VITE_APP_NAME=Social Link Tree
VITE_APP_URL=http://localhost:3000

# Authentication
VITE_AUTH_REDIRECT_URL=http://localhost:3000/dashboard

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_PWA=false
```

## 📊 Google Analytics Setup

To enable Google Analytics 4 tracking:

1. **Create a GA4 Property** at [Google Analytics](https://analytics.google.com/)
2. **Get your Measurement ID** (format: `GA-XXXXXXXXXX`)
3. **Add to your `.env.local`**:
   ```env
   VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXXX
   ```
4. **The app will automatically**:
   - Track social link clicks
   - Monitor page views and user engagement
   - Send events to both GA4 and custom analytics
   - Track scroll depth and time on page

**Events Tracked:**
- Social link clicks with platform detection
- Page views for public and admin pages
- User engagement (scroll depth, time on page)
- Tab changes in admin dashboard
- Form interactions and theme changes

## 🏗️ Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## 🚀 Deployment

### Cloudflare Pages (Recommended)

1. **Connect your repository** to Cloudflare Pages
2. **Build settings:**
   - Build command: `npm run build`
   - Build output directory: `build`
   - Root directory: `/`
3. **Environment variables:** Add your production env vars in Cloudflare dashboard
4. **Custom domain:** Set up `social.samaraie.com`

### Vercel

```bash
npm i -g vercel
vercel
```

### Manual Deployment

```bash
npm run build
# Upload the 'build' folder to your hosting provider
```

## 🔐 Admin Access

- **URL:** `/login` (not linked from public page for security)
- **Demo Credentials:**
  - Email: `admin@social.samaraie`
  - Password: `admin123`
- **Access Dashboard:** `/dashboard` (protected route)

## 🛠️ Technologies Used

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Radix UI, Custom CSS injection
- **Animations:** Framer Motion, React Motion
- **Backend:** Supabase (Database, Real-time, Edge Functions)
- **Analytics:** Google Analytics 4, Custom analytics dashboard
- **Routing:** React Router DOM (Single Page Application)
- **Build:** Vite (ES modules, code splitting, TypeScript)
- **Deployment:** Static site ready for Cloudflare Pages, Vercel, Netlify
- **Development:** ESLint, Prettier, Cursor AI Rules

## 📱 Features Overview

### Core Features
- Clean, professional landing page
- Social media link cards with custom icons and colors
- Apple liquid glass design aesthetic
- Responsive mobile-first design
- Background theme customization (5 themes available)
- Smooth animations and transitions
- Click tracking and analytics
- Google Analytics 4 integration
- Content management system
- Advanced theme customization (colors, auto-switching, custom CSS)
- Custom link personalization (200+ emoji icons, individual colors)

## 🎨 Design System

- **Apple Liquid Glass UI** with glass morphism effects
- **Advanced Theme System:** 5 background themes + custom color schemes
- **Custom Link Styling:** Individual colors and 200+ emoji icons per link
- **Auto Theme Switching:** Time-based theme changes (day/night mode)
- **Responsive breakpoints:** Mobile-first approach
- **Color schemes:** Adaptive themes with custom CSS injection
- **Typography:** Clean, modern font hierarchy
- **Spacing:** Consistent 4px grid system
- **Accessibility:** WCAG 2.1 AA compliant

## 🔒 Security

- Environment variables for sensitive data
- Input validation and sanitization
- HTTPS enforcement in production
- Secure data handling and storage
- No sensitive data in client-side code

## 📈 Performance & Analytics

- **Bundle size:** Optimized with code splitting and tree shaking
- **Loading:** Lazy loading for components and routes
- **Caching:** Efficient asset caching strategies
- **SEO:** Static generation for fast loading
- **Analytics:** Real-time click tracking and visitor metrics
- **Google Analytics 4:** Comprehensive event tracking and reporting
- **Performance Monitoring:** Core Web Vitals tracking (planned)
- **PWA Ready:** Service worker support (planned)

## 🚀 Roadmap

### Planned Features
- Progressive Web App (PWA) capabilities
- Advanced performance monitoring
- Enhanced accessibility features
- Mobile app companion
- Additional theme options
- Social media platform integrations

### Community Contributions
We're always looking for contributions in these areas:
- New theme designs
- Performance optimizations
- Accessibility improvements
- Internationalization support
- Documentation enhancements

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### How to Contribute

1. **Fork the repository** and create a feature branch
2. **Follow the setup instructions** to get the project running locally
3. **Make your changes** following the existing code style
4. **Test thoroughly** - ensure your changes don't break existing functionality
5. **Update documentation** if needed
6. **Submit a pull request** with a clear description of your changes

### Development Guidelines

- **Code Style**: Follow the existing patterns and use TypeScript
- **Commits**: Write clear, concise commit messages
- **Testing**: Test your changes across different browsers and devices
- **Documentation**: Update README and inline comments as needed
- **Security**: Don't introduce security vulnerabilities or expose sensitive data

### Areas for Contribution

- UI/UX improvements
- Performance optimizations
- Accessibility enhancements
- Bug fixes
- Feature enhancements
- Documentation improvements

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

- **Issues**: Report bugs or request features via GitHub Issues
- **Discussions**: Join community discussions on GitHub Discussions
- **Documentation**: Check the `docs/` folder for detailed guides
  