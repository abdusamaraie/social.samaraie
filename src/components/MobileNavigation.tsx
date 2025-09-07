import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { GlassmorphismButton } from './ui/glassmorphism-button';
import { useTheme } from '../contexts/ThemeContext';
import { getContrastColors, getGlassmorphismStyles } from '../utils/contrastUtils';

interface NavigationButtonsProps {
  activeTab: 'links' | 'profile' | 'preview' | 'themes';
  onTabChange: (tab: 'links' | 'profile' | 'preview' | 'themes') => void;
}

const tabs = [
  { id: 'links', name: 'Links', icon: '🔗' },
  { id: 'profile', name: 'Profile', icon: '👤' },
  { id: 'preview', name: 'Preview', icon: '👁️' },
  { id: 'themes', name: 'Themes', icon: '🎨' },
] as const;

export function NavigationButtons({ activeTab, onTabChange }: NavigationButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { backgroundType } = useTheme();
  const colors = getContrastColors(backgroundType);
  const glassStyles = getGlassmorphismStyles(backgroundType);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Determine if we're on admin routes
  const isOnAdminRoute = location.pathname.startsWith('/dashboard') || location.pathname === '/login';

  return (
    <div 
      className="fixed top-6 left-6 z-50"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'start'
      }}
    >
      <div className="flex items-center space-x-2">
        {/* Full Screen Frosty Blur Overlay */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            style={{ 
              zIndex: 40,
              background: `
                linear-gradient(135deg, 
                  rgba(255, 255, 255, 0.1) 0%, 
                  rgba(255, 255, 255, 0.05) 50%, 
                  rgba(255, 255, 255, 0.1) 100%
                ),
                url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")
              `,
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Additional grain overlay for extra frosty effect */}
            <div 
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.2'/%3E%3C/svg%3E")`,
                mixBlendMode: 'overlay',
              }}
            />
          </motion.div>
        )}

        {/* Exit Admin Button */}
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10,17 15,12 10,7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </motion.div>
        </GlassmorphismButton>

        {/* Mobile Menu Toggle Button - Hidden on Desktop */}
        <div className="md:hidden">
          <GlassmorphismButton
            onClick={() => setIsOpen(!isOpen)}
            variant="default"
            size="sm"
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-xl"
          >
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={colors.iconStroke} strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </motion.div>
          </GlassmorphismButton>
        </div>

        {/* Mobile Navigation Menu */}
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.9 }}
          animate={{ 
            opacity: isOpen ? 1 : 0, 
            y: isOpen ? 0 : -10,
            scale: isOpen ? 1 : 0.9,
            pointerEvents: isOpen ? 'auto' : 'none'
          }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-12 left-0 space-y-2 relative z-50"
          style={{ zIndex: 50 }}
        >
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                setIsOpen(false);
              }}
              whileHover={{ scale: 1.05, x: -4 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : 20 }}
              transition={{ delay: isOpen ? index * 0.05 : 0, duration: 0.2 }}
              className={`backdrop-blur-xl rounded-xl p-3 shadow-lg flex items-center space-x-3 min-w-[140px] transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'brightness-110' 
                  : 'hover:brightness-110'
              }`}
              style={{
                ...glassStyles,
                filter: activeTab === tab.id ? 'brightness(1.1)' : 'brightness(1)',
              }}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className={`${colors.text} text-sm font-medium`}>{tab.name}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="mobileActiveTab"
                  className="w-2 h-2 bg-white rounded-full ml-auto"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}