import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { cn } from './utils';

interface GlassmorphismButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  asChild?: boolean;
  fullWidth?: boolean;
  responsive?: boolean;
  style?: React.CSSProperties;
}

export function GlassmorphismButton({ 
  children, 
  onClick, 
  className = '', 
  disabled = false,
  variant = 'default',
  size = 'md',
  type = 'button',
  asChild = false,
  fullWidth = false,
  responsive = true,
  style
}: GlassmorphismButtonProps) {
  const baseClasses = `
    relative overflow-hidden rounded-full
    backdrop-blur-md
    transition-all duration-300 ease-out
    text-white font-medium
    select-none cursor-pointer
    shadow-lg hover:shadow-xl
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent
    inline-flex items-center justify-center
    min-w-0 max-w-full
    break-words hyphens-auto
    ${fullWidth ? 'w-full' : 'w-auto'}
  `;

  const sizeClasses = {
    sm: responsive 
      ? 'px-2 py-1.5 text-xs min-h-[32px] gap-1 sm:px-3 sm:py-2 sm:text-sm sm:min-h-[36px] sm:gap-1.5'
      : 'px-3 py-2 text-sm min-h-[36px] gap-1.5',
    md: responsive
      ? 'px-3 py-2 text-sm min-h-[40px] gap-1.5 sm:px-4 sm:py-3 sm:text-base sm:min-h-[44px] sm:gap-2'
      : 'px-4 py-3 text-base min-h-[44px] gap-2',
    lg: responsive
      ? 'px-4 py-3 text-base min-h-[48px] gap-2 sm:px-6 sm:py-4 sm:text-lg sm:min-h-[52px] sm:gap-2.5'
      : 'px-6 py-4 text-lg min-h-[52px] gap-2.5'
  };

  const variantClasses = {
    default: 'bg-white/10 hover:bg-white/20',
    primary: 'bg-white/15 hover:bg-white/25',
    secondary: 'bg-white/5 hover:bg-white/15'
  };

  const getBorderStyle = (variant: 'default' | 'primary' | 'secondary') => {
    const borderStyles = {
      default: {
        borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
        borderRight: '1px solid rgba(255, 255, 255, 0.2)',
        borderBottom: '4px solid rgba(255, 255, 255, 0.6)',
      },
      primary: {
        borderLeft: '1px solid rgba(255, 255, 255, 0.25)',
        borderRight: '1px solid rgba(255, 255, 255, 0.25)',
        borderBottom: '4px solid rgba(255, 255, 255, 0.7)',
      },
      secondary: {
        borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
        borderRight: '1px solid rgba(255, 255, 255, 0.15)',
        borderBottom: '4px solid rgba(255, 255, 255, 0.5)',
      }
    };
    return borderStyles[variant];
  };

  const buttonStyle = {
    background: `
      linear-gradient(135deg, 
        rgba(255, 255, 255, 0.1) 0%, 
        rgba(255, 255, 255, 0.05) 50%, 
        rgba(255, 255, 255, 0.1) 100%
      ),
      url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.01'/%3E%3C/svg%3E")
    `,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: `
      0 4px 16px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,
    ...getBorderStyle(variant),
  };

  const Component = asChild ? motion.div : motion.button;

  return (
    <div className="relative">
      {/* Main Button */}
      <Component
        onClick={onClick}
        disabled={disabled}
        type={asChild ? undefined : type}
        className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}
        style={{ ...buttonStyle, ...style }}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17
        }}
      >
        {/* Subtle grain overlay */}
        <div 
          className="absolute inset-0 opacity-[0.005] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
            mixBlendMode: 'overlay',
          }}
        />
        
        {/* Highlight shine effect */}
        <div 
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%)',
            borderRadius: 'inherit',
          }}
        />
        
        {/* Content */}
        <span className="relative z-10 flex items-center justify-center min-w-0 w-full">
          {children}
        </span>
      </Component>

    </div>
  );
}
