import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useTheme } from '../contexts/ThemeContext';
import { getContrastColors, getGlassmorphismStyles, getButtonStyles } from '../utils/contrastUtils';

interface ProfileData {
  name: string;
  bio: string;
  avatar: string;
}

interface ProfileManagerProps {
  profileData: ProfileData;
  onUpdateProfile: (profile: ProfileData) => void;
}

const avatarOptions = ['👤', '😊', '🎭', '🚀', '💻', '🎨', '🎵', '📚', '🏃', '🌍', '🎯', '✨'];

export function ProfileManager({ profileData, onUpdateProfile }: ProfileManagerProps) {
  const { backgroundType } = useTheme();
  const colors = getContrastColors(backgroundType);
  const glassStyles = getGlassmorphismStyles(backgroundType);
  const primaryButtonStyles = getButtonStyles(backgroundType, 'primary');
  const outlineButtonStyles = getButtonStyles(backgroundType, 'outline');
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileData>(profileData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Display */}
      {!isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl"
          style={glassStyles}
        >
          <div className="text-center">
            {/* Avatar */}
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
              <span className="text-3xl">{profileData.avatar}</span>
            </div>

            {/* Name */}
            <h2 className={`text-2xl font-medium ${colors.text} mb-2`}>
              {profileData.name}
            </h2>

            {/* Bio */}
            <p className={`${colors.textSecondary} text-sm leading-relaxed whitespace-pre-line`}>
              {profileData.bio}
            </p>

            {/* Edit Button */}
            <Button
              onClick={() => setIsEditing(true)}
              className={`${primaryButtonStyles.default} ${primaryButtonStyles.hover} ${primaryButtonStyles.active} !text-white hover:!text-white mt-4`}
            >
              Edit Profile
            </Button>
          </div>
        </motion.div>
      )}

      {/* Profile Edit Form */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl"
          style={glassStyles}
        >
          <h3 className={`text-xl font-medium ${colors.text} mb-6`}>Edit Profile</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Selection */}
            <div>
              <Label className={`${colors.textSecondary} mb-3 block`}>Avatar</Label>
              <div className="grid grid-cols-6 gap-3">
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar })}
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-xl shadow-lg transition-all duration-200 ${
                      formData.avatar === avatar
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent scale-110'
                        : 'hover:scale-105'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <Label className={colors.textSecondary}>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your Name"
                className={`${backgroundType === 'gradient3' ? 'bg-black/10 border-black/20 text-gray-900 placeholder:text-gray-600' : 'bg-white/10 border-white/20 text-white placeholder:text-white/50'}`}
              />
            </div>

            {/* Bio */}
            <div>
              <Label className={colors.textSecondary}>Bio</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell people about yourself..."
                rows={4}
                className={`${backgroundType === 'gradient3' ? 'bg-black/10 border-black/20 text-gray-900 placeholder:text-gray-600' : 'bg-white/10 border-white/20 text-white placeholder:text-white/50'} resize-none`}
              />
              <p className={`${colors.textMuted} text-xs mt-1`}>
                Use line breaks to separate different parts of your bio
              </p>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3">
              <Button 
                type="submit" 
                className={`${primaryButtonStyles.default} ${primaryButtonStyles.hover} ${primaryButtonStyles.active} !text-white hover:!text-white`}
              >
                Save Changes
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                className={`${outlineButtonStyles.default} ${outlineButtonStyles.hover} ${outlineButtonStyles.active} !text-white hover:!text-white`}
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Tips */}
      <motion.div
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <h4 className={`${colors.textSecondary} font-medium mb-3 flex items-center`}>
          <span className="text-lg mr-2">💡</span>
          Profile Tips
        </h4>
        <ul className={`${colors.textMuted} text-sm space-y-2`}>
          <li>• Keep your name concise and memorable</li>
          <li>• Use your bio to highlight what makes you unique</li>
          <li>• Choose an avatar that represents your personality</li>
          <li>• Add line breaks in your bio for better readability</li>
        </ul>
      </motion.div>
    </div>
  );
}