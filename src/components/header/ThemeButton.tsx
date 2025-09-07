import { motion } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { getContrastColors } from '../../utils/contrastUtils';
import { GlassmorphismButton } from '../ui/glassmorphism-button';

interface ThemeButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function ThemeButton({ isOpen, onClick }: ThemeButtonProps) {
  const { backgroundType } = useTheme();
  const colors = getContrastColors(backgroundType);

  return (
    <GlassmorphismButton
      onClick={onClick}
      variant="default"
      size="sm"
      className="w-10 h-10 rounded-full flex items-center justify-center"
    >
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={colors.iconStroke} strokeWidth="2">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
      </motion.div>
    </GlassmorphismButton>
  );
}
