import { motion } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { getGlassmorphismStyles } from '../../utils/contrastUtils';
import { FrostyOverlay } from './FrostyOverlay';
import type { BackgroundType } from '../../contexts/ThemeContext';

interface ThemeToggleDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onBackgroundChange?: (backgroundType: BackgroundType) => void;
}

const backgrounds = [
  { id: 'gradient1', name: 'Aurora', emoji: '🌅' },
  { id: 'gradient2', name: 'Ocean', emoji: '🌊' },
  { id: 'gradient3', name: 'Sunset', emoji: '🌆' },
  { id: 'particles', name: 'Particles', emoji: '✨' },
  { id: 'geometric', name: 'Geometric', emoji: '🔷' },
] as const;

export function ThemeToggleDropdown({ isOpen, onClose, onBackgroundChange }: ThemeToggleDropdownProps) {
  const { backgroundType, updateTheme } = useTheme();
  const glassStyles = getGlassmorphismStyles(backgroundType);
  const activeBackground = backgroundType;

  if (!isOpen) return null;

  return (
    <>
      {/* Frosty Blur Overlay */}
      <FrostyOverlay isVisible={isOpen} onClose={onClose} />

      {/* Theme Toggle Dropdown */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: 1,
        }}
        exit={{ opacity: 0, y: -10, scale: 0.9 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        className="fixed right-6 md:right-8 flex flex-col gap-2 z-[300]"
        style={{ 
          zIndex: 300,
          top: '80px', // Match mobile menu spacing
        }}
      >
        {backgrounds.map((bg, index) => (
          <motion.button
            key={bg.id}
            onClick={() => {
              // Update theme context
              updateTheme({ backgroundType: bg.id as BackgroundType });
              // Call the optional callback for backward compatibility
              if (onBackgroundChange) {
                onBackgroundChange(bg.id as BackgroundType);
              }
              onClose();
            }}
            whileHover={{ scale: 1.05, x: 4 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
            className={`backdrop-blur-xl rounded-xl p-3 shadow-lg flex items-center space-x-3 min-w-[140px] transition-all duration-200 ${
              activeBackground === bg.id 
                ? 'brightness-110' 
                : 'hover:brightness-110'
            }`}
            style={{
              ...glassStyles,
              zIndex: 310,
              filter: activeBackground === bg.id ? 'brightness(1.1)' : 'brightness(1)',
            }}
          >
            <span className="text-lg">{bg.emoji}</span>
            <span className="text-white text-sm font-medium">{bg.name}</span>
            {activeBackground === bg.id && (
              <motion.div
                layoutId="selectedBg"
                className="w-2 h-2 bg-white rounded-full ml-auto"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>
    </>
  );
}
