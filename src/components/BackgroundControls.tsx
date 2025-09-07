import { motion } from 'motion/react';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { getContrastColors, getGlassmorphismStyles } from '../utils/contrastUtils';
import { BackgroundType } from '../utils/contrastUtils';

interface BackgroundControlsProps {
  currentBackground?: string; // Made optional since we'll use theme context
  onBackgroundChange?: (bg: BackgroundType) => void; // Made optional for backward compatibility
}

export function BackgroundControls({ currentBackground, onBackgroundChange }: BackgroundControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, updateTheme, backgroundType } = useTheme();
  const colors = getContrastColors(backgroundType);
  const glassStyles = getGlassmorphismStyles(backgroundType);
  
  // Use theme context background type as the source of truth
  const activeBackground = currentBackground || backgroundType;

  const backgrounds = [
    { id: 'gradient1', name: 'Aurora', emoji: '🌅' },
    { id: 'gradient2', name: 'Ocean', emoji: '🌊' },
    { id: 'gradient3', name: 'Sunset', emoji: '🌆' },
    { id: 'particles', name: 'Particles', emoji: '✨' },
    { id: 'geometric', name: 'Geometric', emoji: '🔷' },
  ] as const;

  return (
    <div 
      className="fixed top-6 right-6 z-50"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'end',
        alignItems: 'end'
      }}
    >
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

      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="backdrop-blur-xl rounded-2xl p-3 shadow-xl relative z-50"
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

      {/* Background Options - Simple Dropdown (All Devices) */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.9 }}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          y: isOpen ? 0 : -10,
          scale: isOpen ? 1 : 0.9,
          pointerEvents: isOpen ? 'auto' : 'none'
        }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        className="absolute top-16 right-0 space-y-2 relative z-50"
        style={{ zIndex: 50 }}
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
              setIsOpen(false);
            }}
            whileHover={{ scale: 1.05, x: -4 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : 20 }}
            transition={{ delay: isOpen ? index * 0.05 : 0, duration: 0.2 }}
            className={`backdrop-blur-xl rounded-xl p-3 shadow-lg flex items-center space-x-3 min-w-[140px] transition-all duration-200 ${
              activeBackground === bg.id 
                ? 'brightness-110' 
                : 'hover:brightness-110'
            }`}
            style={{
              ...glassStyles,
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
    </div>
  );
}