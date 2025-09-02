import { motion } from 'motion/react';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { getContrastColors, getGlassmorphismStyles } from '../utils/contrastUtils';

interface BackgroundControlsProps {
  currentBackground: string;
  onBackgroundChange: (bg: 'gradient1' | 'gradient2' | 'gradient3' | 'particles' | 'geometric') => void;
}

export function BackgroundControls({ currentBackground, onBackgroundChange }: BackgroundControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { backgroundType } = useTheme();
  const colors = getContrastColors(backgroundType);
  const glassStyles = getGlassmorphismStyles(backgroundType);

  const backgrounds = [
    { id: 'gradient1', name: 'Aurora', emoji: '🌅' },
    { id: 'gradient2', name: 'Ocean', emoji: '🌊' },
    { id: 'gradient3', name: 'Sunset', emoji: '🌆' },
    { id: 'particles', name: 'Particles', emoji: '✨' },
    { id: 'geometric', name: 'Geometric', emoji: '🔷' },
  ] as const;

  return (
    <div className="fixed top-6 right-6 z-50">
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="backdrop-blur-xl rounded-2xl p-3 shadow-xl"
        style={glassStyles}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={colors.iconStroke} strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m15.5-6.5l-4.24 4.24m-6.36 0L1.66 5.66m16.68 12.68l-4.24-4.24m-6.36 0L1.66 18.34"/>
          </svg>
        </motion.div>
      </motion.button>

      {/* Background Options */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.9 }}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          y: isOpen ? 0 : -10,
          scale: isOpen ? 1 : 0.9,
          pointerEvents: isOpen ? 'auto' : 'none'
        }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        className="absolute top-16 right-0 space-y-2"
      >
        {backgrounds.map((bg, index) => (
          <motion.button
            key={bg.id}
            onClick={() => {
              onBackgroundChange(bg.id);
              setIsOpen(false);
            }}
            whileHover={{ scale: 1.05, x: -4 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : 20 }}
            transition={{ delay: isOpen ? index * 0.05 : 0, duration: 0.2 }}
            className={`backdrop-blur-xl rounded-xl p-3 shadow-lg flex items-center space-x-3 min-w-[140px] transition-all duration-200 ${
              currentBackground === bg.id 
                ? 'brightness-110' 
                : 'hover:brightness-110'
            }`}
            style={{
              ...glassStyles,
              filter: currentBackground === bg.id ? 'brightness(1.1)' : 'brightness(1)',
            }}
          >
            <span className="text-lg">{bg.emoji}</span>
            <span className="text-white text-sm font-medium">{bg.name}</span>
            {currentBackground === bg.id && (
              <motion.div
                layoutId="selectedBg"
                className="w-2 h-2 bg-white rounded-full ml-auto"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}