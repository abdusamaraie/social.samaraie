import { motion } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { getContrastColors, getGlassmorphismStyles } from '../../utils/contrastUtils';
import { FrostyOverlay } from './FrostyOverlay';

interface MobileMenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'links' | 'profile' | 'preview' | 'themes';
  onTabChange: (tab: 'links' | 'profile' | 'preview' | 'themes') => void;
}

const tabs = [
  { id: 'links', name: 'Links', icon: '🔗' },
  { id: 'profile', name: 'Profile', icon: '👤' },
  { id: 'preview', name: 'Preview', icon: '👁️' },
  { id: 'themes', name: 'Themes', icon: '🎨' },
] as const;

export function MobileMenuDropdown({ isOpen, onClose, activeTab, onTabChange }: MobileMenuDropdownProps) {
  const { backgroundType } = useTheme();
  const colors = getContrastColors(backgroundType);
  const glassStyles = getGlassmorphismStyles(backgroundType);

  if (!isOpen) return null;

  return (
    <>
      {/* Frosty Blur Overlay */}
      <FrostyOverlay isVisible={isOpen} onClose={onClose} />

      {/* Mobile Navigation Menu */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: 1,
        }}
        exit={{ opacity: 0, y: -10, scale: 0.9 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        className="fixed right-6 md:right-8 flex flex-col gap-2 hide-on-desktop z-[300]"
        style={{ 
          zIndex: 300,
          top: '80px', // Match theme toggle spacing
        }}
      >
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            onClick={() => {
              onTabChange(tab.id);
              onClose();
            }}
            whileHover={{ scale: 1.05, x: 4 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
            className={`backdrop-blur-xl rounded-xl p-3 shadow-lg flex items-center space-x-3 min-w-[140px] transition-all duration-200 ${
              activeTab === tab.id
                ? 'brightness-110'
                : 'hover:brightness-110'
            }`}
            style={{
              ...glassStyles,
              zIndex: 310,
              filter: activeTab === tab.id ? 'brightness(1.1)' : 'brightness(1)',
            }}
          >
            {activeTab === tab.id && (
              <motion.div 
                layoutId="mobileActiveTab" 
                className="w-2 h-2 bg-white rounded-full mr-2" 
                transition={{ type: "spring", stiffness: 500, damping: 30 }} 
              />
            )}
            <span className="text-lg">{tab.icon}</span>
            <span className={`${colors.text} text-sm font-medium`}>{tab.name}</span>
          </motion.button>
        ))}
      </motion.div>
    </>
  );
}
