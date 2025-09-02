import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import type { SocialLink } from '../pages/AdminDashboard';
import type { ProfileData } from '../pages/AdminDashboard';
import { LinkManager } from './LinkManager';
import { ProfileManager } from './ProfileManager';
import { LinkPreview } from './LinkPreview';
import { ThemeSelector } from './features/admin/ThemeSelector';
import { useTheme } from '../contexts/ThemeContext';
import { getContrastColors, getGlassmorphismStyles } from '../utils/contrastUtils';

interface AdminDashboardProps {
  socialLinks: SocialLink[];
  profileData: ProfileData;
  onAddLink: (link: Omit<SocialLink, 'id'>) => void;
  onUpdateLink: (id: string, link: Omit<SocialLink, 'id'>) => void;
  onDeleteLink: (id: string) => void;
  onUpdateProfile: (profile: ProfileData) => void;
}

export function AdminDashboard({
  socialLinks,
  profileData,
  onAddLink,
  onUpdateLink,
  onDeleteLink,
  onUpdateProfile
}: AdminDashboardProps) {
  const { backgroundType } = useTheme();
  const colors = getContrastColors(backgroundType);
  const glassStyles = getGlassmorphismStyles(backgroundType);

  const [activeTab, setActiveTab] = useState<'links' | 'profile' | 'preview' | 'themes'>('links');

  // Phase 1: no analytics side effects
  useEffect(() => {}, [activeTab]);

  const tabs = [
    { id: 'links', name: 'Links', icon: '🔗' },
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'preview', name: 'Preview', icon: '👁️' },
    { id: 'themes', name: 'Themes', icon: '🎨' },
  ] as const;

  return (
    <div className="relative z-10 min-h-screen p-4 pt-20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* Header */}
          <motion.div
            className="backdrop-blur-xl border rounded-3xl p-6 shadow-2xl"
            style={glassStyles}
          >
            <h1 className={`text-3xl font-medium ${colors.text} mb-2`}>Admin Dashboard</h1>
            <p className={colors.textMuted}>Manage your profile and social links</p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            className="backdrop-blur-xl border rounded-2xl p-2 shadow-xl"
            style={glassStyles}
          >
            <div className="flex space-x-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? backgroundType === 'gradient3' ? 'bg-black/20 shadow-lg' : 'bg-white/20 shadow-lg'
                      : backgroundType === 'gradient3' ? 'hover:bg-black/10' : 'hover:bg-white/10'
                  }`}
                  style={activeTab === tab.id ? (
                    backgroundType === 'gradient3' ? {
                      background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1))',
                      boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.2)',
                    } : {
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
                      boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
                    }
                  ) : {}}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className={`${colors.text} font-medium`}>{tab.name}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: backgroundType === 'gradient3' 
                          ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05))'
                          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                        zIndex: -1,
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 'links' && (
              <LinkManager
                socialLinks={socialLinks}
                onAddLink={onAddLink}
                onUpdateLink={onUpdateLink}
                onDeleteLink={onDeleteLink}
              />
            )}
            {activeTab === 'profile' && (
              <ProfileManager
                profileData={profileData}
                onUpdateProfile={onUpdateProfile}
              />
            )}
            {activeTab === 'preview' && (
              <LinkPreview
                socialLinks={socialLinks}
                profileData={profileData}
              />
            )}
            {activeTab === 'themes' && (
              <ThemeSelector />
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}