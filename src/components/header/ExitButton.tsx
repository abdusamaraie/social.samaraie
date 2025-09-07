import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { GlassmorphismButton } from '../ui/glassmorphism-button';

export function ExitButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Determine if we're on admin routes
  const isOnAdminRoute = location.pathname.startsWith('/dashboard') || location.pathname === '/login';

  return (
    <GlassmorphismButton
      onClick={() => {
        if (isOnAdminRoute) {
          logout();
          navigate('/');
        } else {
          navigate('/dashboard');
        }
      }}
      variant={isOnAdminRoute ? 'primary' : 'default'}
      size="sm"
      className="w-10 h-10 rounded-full flex items-center justify-center"
    >
      <motion.div
        animate={{ rotate: isOnAdminRoute ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isOnAdminRoute ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10,17 15,12 10,7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </motion.div>
    </GlassmorphismButton>
  );
}
