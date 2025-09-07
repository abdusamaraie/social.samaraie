import { motion } from 'motion/react';
import { GlassmorphismButton } from './ui/glassmorphism-button';
import { useTheme } from '../contexts/ThemeContext';
import { getGlassmorphismStyles } from '../utils/contrastUtils';

interface AddLinkButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function AddLinkButton({ onClick, isOpen }: AddLinkButtonProps) {
  const { backgroundType } = useTheme();
  const glassStyles = getGlassmorphismStyles(backgroundType);

  return (
    <motion.div
      className="relative z-[999]"
      style={{
        zIndex: 999,
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <div
        style={{
          minWidth: '48px',
          minHeight: '48px',
          pointerEvents: 'auto',
        }}
      >
        <GlassmorphismButton
          onClick={onClick}
          variant="primary"
          size="sm"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform duration-200 touch-manipulation"
          style={glassStyles}
        >
          <motion.svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="2" 
            className="select-none"
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </motion.svg>
        </GlassmorphismButton>
      </div>
    </motion.div>
  );
}
