import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { ThemeProvider } from '../contexts/ThemeContext';
import { NotificationToast } from '../components/NotificationToast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  const { login, requestPasswordReset } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        setNotification({
          show: true,
          message: 'Login successful! Redirecting to dashboard...',
          type: 'success'
        });
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setNotification({
          show: true,
          message: 'Invalid credentials. Please check your email and password.',
          type: 'error'
        });
      }
    } catch (error) {
      setNotification({
        show: true,
        message: 'Login failed. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setNotification({
        show: true,
        message: 'Please enter your email address.',
        type: 'error'
      });
      return;
    }

    setResetLoading(true);
    try {
      const response = await requestPasswordReset(resetEmail.trim());
      if (response.success) {
        setNotification({
          show: true,
          message: 'Password reset instructions sent to your email.',
          type: 'success'
        });
        setShowPasswordReset(false);
        setResetEmail('');
      } else {
        // Use the actual error message from the auth service
        const errorMessage = response.error || 'Email not found in our system. Please contact support.';
        setNotification({
          show: true,
          message: errorMessage,
          type: 'error'
        });
      }
    } catch (error) {
      setNotification({
        show: true,
        message: 'Password reset request failed. Please try again.',
        type: 'error'
      });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen relative overflow-hidden">
        <AnimatedBackground type="gradient1" />

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* Glass Card */}
            <div
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="text-4xl mb-4"
                >
                  🔐
                </motion.div>
                <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
                <p className="text-white/70 text-sm">
                  Sign in to manage your social links
                </p>
              </div>

              {/* Login Form */}
              {!showPasswordReset ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all"
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      'Sign In'
                    )}
                  </button>

                  {/* Password Reset Link */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setShowPasswordReset(true)}
                      className="text-white/60 hover:text-white/80 text-sm transition-colors underline"
                    >
                      Forgot your password?
                    </button>
                  </div>
                </form>
              ) : (
                /* Password Reset Form */
                <form onSubmit={handlePasswordReset} className="space-y-6">
                  <div>
                    <label htmlFor="resetEmail" className="block text-sm font-medium text-white/90 mb-2">
                      Email Address
                    </label>
                    <input
                      id="resetEmail"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full py-3 px-4 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    {resetLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Reset Instructions'
                    )}
                  </button>

                  {/* Back to Login */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setShowPasswordReset(false)}
                      className="text-white/60 hover:text-white/80 text-sm transition-colors underline"
                    >
                      Back to login
                    </button>
                  </div>
                </form>
              )}

              {/* Back to Public Link */}
              <div className="mt-6 text-center">
                <a
                  href="/"
                  className="text-white/60 hover:text-white/80 text-sm transition-colors"
                >
                  ← Back to Public Page
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Notification Toast */}
        <NotificationToast
          {...notification}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      </div>
    </ThemeProvider>
  );
}
