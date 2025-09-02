// Utility functions for contrast-aware styling based on background themes

export type BackgroundType = 'gradient1' | 'gradient2' | 'gradient3' | 'particles' | 'geometric';

interface ContrastColors {
  text: string;
  textSecondary: string;
  textMuted: string;
  buttonText: string;
  buttonTextHover: string;
  buttonTextActive: string;
  iconStroke: string;
}

// Define color schemes for each background theme
export const getContrastColors = (backgroundType: BackgroundType): ContrastColors => {
  switch (backgroundType) {
    case 'gradient3': // Sunset - light background needs dark text
      return {
        text: 'text-gray-900',
        textSecondary: 'text-gray-700',
        textMuted: 'text-gray-600',
        buttonText: 'text-gray-900',
        buttonTextHover: 'text-gray-800',
        buttonTextActive: 'text-gray-700',
        iconStroke: 'stroke-gray-900',
      };
    case 'gradient1': // Aurora - medium contrast
    case 'gradient2': // Ocean - medium contrast
      return {
        text: 'text-white',
        textSecondary: 'text-white/90',
        textMuted: 'text-white/70',
        buttonText: 'text-white',
        buttonTextHover: 'text-white/90',
        buttonTextActive: 'text-white/80',
        iconStroke: 'stroke-white',
      };
    case 'particles': // Dark background
    case 'geometric': // Dark background
    default:
      return {
        text: 'text-white',
        textSecondary: 'text-white/90',
        textMuted: 'text-white/80',
        buttonText: 'text-white',
        buttonTextHover: 'text-white/90',
        buttonTextActive: 'text-white/80',
        iconStroke: 'stroke-white',
      };
  }
};

// Get glassmorphism background styles based on theme
export const getGlassmorphismStyles = (backgroundType: BackgroundType) => {
  const isDark = ['particles', 'geometric'].includes(backgroundType);
  const isSunset = backgroundType === 'gradient3';
  
  if (isSunset) {
    // For sunset theme, use darker glass for better contrast
    return {
      background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.08))',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    };
  } else {
    // Default glass style for other themes
    return {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    };
  }
};

// Get button specific styles based on theme and state
export const getButtonStyles = (backgroundType: BackgroundType, variant: 'primary' | 'secondary' | 'outline' = 'primary') => {
  const colors = getContrastColors(backgroundType);
  const isSunset = backgroundType === 'gradient3';
  
  if (variant === 'outline') {
    if (isSunset) {
      return {
        default: `border-gray-400 ${colors.buttonText} hover:bg-gray-900/10 hover:${colors.buttonTextHover}`,
        hover: `hover:bg-gray-900/10 hover:${colors.buttonTextHover}`,
        active: `active:bg-gray-900/20 active:${colors.buttonTextActive}`,
      };
    } else {
      return {
        default: `border-white/30 ${colors.buttonText} hover:bg-white/10 hover:${colors.buttonTextHover}`,
        hover: `hover:bg-white/10 hover:${colors.buttonTextHover}`,
        active: `active:bg-white/20 active:${colors.buttonTextActive}`,
      };
    }
  }
  
  // Primary button styles
  if (isSunset) {
    return {
      default: `bg-gray-900/20 hover:bg-gray-900/30 ${colors.buttonText} border-gray-400/50`,
      hover: `hover:bg-gray-900/30 hover:${colors.buttonTextHover}`,
      active: `active:bg-gray-900/40 active:${colors.buttonTextActive}`,
    };
  } else {
    return {
      default: `bg-white/20 hover:bg-white/30 ${colors.buttonText} border-white/30`,
      hover: `hover:bg-white/30 hover:${colors.buttonTextHover}`,
      active: `active:bg-white/40 active:${colors.buttonTextActive}`,
    };
  }
};