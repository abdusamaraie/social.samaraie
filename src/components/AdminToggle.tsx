import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { getContrastColors, getGlassmorphismStyles } from '../utils/contrastUtils';

interface AdminToggleProps {
  isAdminMode: boolean;
  onToggle: () => void;
}

export function AdminToggle({ isAdminMode, onToggle }: AdminToggleProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { backgroundType } = useTheme();
  const colors = getContrastColors(backgroundType);
  const glassStyles = getGlassmorphismStyles(backgroundType);

  // Determine if we're on admin routes
  const isOnAdminRoute = location.pathname.startsWith('/dashboard') || location.pathname === '/login';

  return (
    <div className="fixed top-6 left-6 z-50">
      <motion.button
        onClick={() => {
          if (isOnAdminRoute) {
            logout();
            navigate('/');
          } else {
            navigate('/dashboard');
          }
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`backdrop-blur-xl rounded-2xl p-3 shadow-xl transition-all duration-300 ${
          isOnAdminRoute
            ? 'brightness-110'
            : 'hover:brightness-110'
        }`}
        style={{
          ...glassStyles,
          filter: isOnAdminRoute ? 'brightness(1.1)' : 'brightness(1)',
        }}
      >
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: isOnAdminRoute ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOnAdminRoute ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={colors.iconStroke} strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10,17 15,12 10,7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={colors.iconStroke} strokeWidth="2">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </motion.div>
          <span className={`${colors.text} text-sm font-medium hidden sm:block`}>
            {isOnAdminRoute ? 'Exit Admin' : 'Admin'}
          </span>
        </div>
      </motion.button>
    </div>
  );
}