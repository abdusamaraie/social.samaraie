import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { ThemeProvider } from '../contexts/ThemeContext';

export default function NotFoundPage() {
  return (
    <ThemeProvider backgroundType="gradient2">
      <div className="min-h-screen relative overflow-hidden">
        <AnimatedBackground type="gradient2" />

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Glass Card */}
            <div
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 shadow-xl max-w-md mx-auto"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {/* 404 Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="text-6xl mb-6"
              >
                🚀
              </motion.div>

              {/* Error Message */}
              <h1 className="text-4xl font-bold text-white mb-4">404</h1>
              <h2 className="text-xl font-semibold text-white mb-2">Page Not Found</h2>
              <p className="text-white/70 mb-8 text-sm">
                The page you're looking for doesn't exist or has been moved.
              </p>

              {/* Navigation Links */}
              <div className="space-y-4">
                <Link
                  to="/"
                  className="block w-full py-3 px-6 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg text-white font-medium transition-all duration-200"
                >
                  Go to Public Page
                </Link>

                <Link
                  to="/login"
                  className="block w-full py-3 px-6 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white/70 hover:text-white font-medium transition-all duration-200"
                >
                  Admin Login
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ThemeProvider>
  );
}
