import { motion } from 'motion/react';
import { GlassmorphismButton } from '../ui/glassmorphism-button';
import { useTheme } from '../../contexts/ThemeContext';
import { getContrastColors, getGlassmorphismStyles } from '../../utils/contrastUtils';

interface MenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function MenuButton({ isOpen, onClick }: MenuButtonProps) {
  const { backgroundType } = useTheme();
  const colors = getContrastColors(backgroundType);
  const glassStyles = getGlassmorphismStyles(backgroundType);

  return (
    <div className="hide-on-desktop">
      <GlassmorphismButton
        onClick={onClick}
        variant="default"
        size="sm"
        className="w-10 h-10 rounded-full flex items-center justify-center shadow-xl"
        style={glassStyles}
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={colors.iconStroke} strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </motion.div>
      </GlassmorphismButton>
    </div>
  );
}
