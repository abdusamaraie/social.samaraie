import { motion } from 'motion/react';
import type { ProfileData } from '../types/profile';
import { useTheme } from '../contexts/ThemeContext';
import { getContrastColors, getGlassmorphismStyles } from '../utils/contrastUtils';

interface ProfileCardProps {
  profileData: ProfileData;
}

export function ProfileCard({ profileData }: ProfileCardProps) {
  const { backgroundType } = useTheme();
  const colors = getContrastColors(backgroundType);
  const glassStyles = getGlassmorphismStyles(backgroundType);
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="backdrop-blur-xl rounded-3xl p-8 text-center shadow-2xl"
      style={glassStyles}
    >
      {/* Profile Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
        className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center shadow-lg"
      >
        <span className="text-3xl">{profileData.avatar}</span>
      </motion.div>

      {/* Name */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`text-2xl font-medium ${colors.text} mb-2`}
      >
        {profileData.name}
      </motion.h1>

      {/* Bio */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`${colors.textSecondary} text-sm leading-relaxed whitespace-pre-line`}
      >
        {profileData.bio}
      </motion.p>
    </motion.div>
  );
}