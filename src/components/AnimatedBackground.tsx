import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface AnimatedBackgroundProps {
  type: 'gradient1' | 'gradient2' | 'gradient3' | 'particles' | 'geometric';
}

export function AnimatedBackground({ type }: AnimatedBackgroundProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number }>>([]);

  useEffect(() => {
    if (type === 'particles') {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 3 + 2,
      }));
      setParticles(newParticles);
    }
  }, [type]);

  const renderBackground = () => {
    switch (type) {
      case 'gradient1':
        return (
          <motion.div
            key="gradient1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
              backgroundSize: '400% 400%',
              animation: 'gradientShift 15s ease infinite'
            }}
          />
        );
      
      case 'gradient2':
        return (
          <motion.div
            key="gradient2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c)',
              backgroundSize: '400% 400%',
              animation: 'gradientShift 12s ease infinite'
            }}
          />
        );
      
      case 'gradient3':
        return (
          <motion.div
            key="gradient3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(-45deg, #ff9a9e, #fecfef, #fecfef, #ffd1ff)',
              backgroundSize: '400% 400%',
              animation: 'gradientShift 18s ease infinite'
            }}
          />
        );
      
      case 'particles':
        return (
          <motion.div
            key="particles"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
          >
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </motion.div>
        );
      
      case 'geometric':
        return (
          <motion.div
            key="geometric"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden"
          >
            {/* Floating Geometric Shapes */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/20 rounded-3xl"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute top-3/4 right-1/4 w-24 h-24 border border-white/30 rounded-full"
              animate={{
                rotate: [360, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute top-1/2 left-3/4 w-20 h-20 border border-white/25"
              style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return renderBackground();
}