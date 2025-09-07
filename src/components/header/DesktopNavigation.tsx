import { motion } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { getGlassmorphismStyles } from '../../utils/contrastUtils';

interface DesktopNavigationProps {
  activeTab: 'links' | 'profile' | 'preview' | 'themes';
  onTabChange: (tab: 'links' | 'profile' | 'preview' | 'themes') => void;
}

const tabs = [
  { id: 'links', name: 'Links', icon: '🔗' },
  { id: 'profile', name: 'Profile', icon: '👤' },
  { id: 'preview', name: 'Preview', icon: '👁️' },
  { id: 'themes', name: 'Themes', icon: '🎨' },
] as const;

export function DesktopNavigation({ activeTab, onTabChange }: DesktopNavigationProps) {
  const { backgroundType } = useTheme();
  const glassStyles = getGlassmorphismStyles(backgroundType);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="backdrop-blur-xl border rounded-2xl p-2 shadow-xl hidden md:block"
      style={glassStyles}
    >
      <div className="flex space-x-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-xl transition-all duration-200 ${
              activeTab === tab.id
                ? backgroundType === 'gradient3' ? 'bg-black/20 shadow-lg' : 'bg-white/20 shadow-lg'
                : backgroundType === 'gradient3' ? 'hover:bg-black/10' : 'hover:bg-white/10'
            }`}
            style={activeTab === tab.id ? (
              backgroundType === 'gradient3' ? {
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1))',
                boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.2)',
              } : {
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
                boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
              }
            ) : {}}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-white text-sm font-medium">{tab.name}</span>
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTab" 
                className="w-2 h-2 bg-white rounded-full" 
                transition={{ type: "spring", stiffness: 500, damping: 30 }} 
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
