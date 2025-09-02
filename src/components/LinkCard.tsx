import { motion } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { getContrastColors, getGlassmorphismStyles } from '../utils/contrastUtils';
// import removed: analyticsService

interface LinkCardProps {
  id: string;
  title: string;
  url: string;
  icon: string;
  color: string;
  customColor?: string;
  customIcon?: string;
}

export function LinkCard({ id, title, url, icon, color, customColor, customIcon }: LinkCardProps) {
  const { backgroundType } = useTheme();
  const colors = getContrastColors(backgroundType);
  const glassStyles = getGlassmorphismStyles(backgroundType);

  // Use custom properties if available, otherwise fall back to defaults
  const displayIcon = customIcon || icon;
  const displayColor = customColor || color;

  const handleClick = async () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ 
        scale: 1.02,
        y: -2,
      }}
      whileTap={{ scale: 0.98 }}
      className="w-full group relative overflow-hidden rounded-2xl"
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Main Card */}
      <div
        className="backdrop-blur-xl rounded-2xl p-4 shadow-xl relative z-10 transition-all duration-300 group-hover:brightness-110"
        style={glassStyles}
      >
        {/* Gradient Overlay (appears on hover) */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${displayColor} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}
        />
        
        {/* Content */}
        <div className="flex items-center space-x-4 relative z-10">
          {/* Icon */}
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className={`flex-shrink-0 w-12 h-12 rounded-xl ${backgroundType === 'gradient3' ? 'bg-black/20' : 'bg-white/20'} flex items-center justify-center shadow-lg`}
          >
            <span className="text-xl">{displayIcon}</span>
          </motion.div>

          {/* Title */}
          <div className="flex-1 text-left">
            <h3 className={`${colors.text} font-medium group-hover:${colors.textSecondary} transition-colors`}>
              {title}
            </h3>
          </div>

          {/* Arrow */}
          <motion.div
            className={`flex-shrink-0 ${colors.textMuted} group-hover:${colors.textSecondary} transition-colors`}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Glow Effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${displayColor} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 rounded-2xl -z-10`}
      />
    </motion.button>
  );
}