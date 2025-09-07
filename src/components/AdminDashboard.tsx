import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import type { SocialLink } from '../pages/AdminDashboard';
import type { ProfileData } from '../pages/AdminDashboard';
import { SocialLinks } from './SocialLinks';
import { ProfileManager } from './ProfileManager';
import { LinkPreview } from './LinkPreview';
import { ThemeSelector } from './features/admin/ThemeSelector';
import { GlassmorphismButton } from './ui/glassmorphism-button';
import { useTheme } from '../contexts/ThemeContext';
import { getContrastColors, getGlassmorphismStyles } from '../utils/contrastUtils';

interface AdminDashboardProps {
  socialLinks: SocialLink[];
  profileData: ProfileData;
  onAddLink: (link: Omit<SocialLink, 'id'>) => void;
  onUpdateLink: (id: string, link: Omit<SocialLink, 'id'>) => void;
  onDeleteLink: (id: string) => void;
  onUpdateProfile: (profile: ProfileData) => void;
  activeTab: 'links' | 'profile' | 'preview' | 'themes';
  onTabChange: (tab: 'links' | 'profile' | 'preview' | 'themes') => void;
}

export function AdminDashboard({
  socialLinks,
  profileData,
  onAddLink,
  onUpdateLink,
  onDeleteLink,
  onUpdateProfile,
  activeTab,
  onTabChange
}: AdminDashboardProps) {
  const { backgroundType } = useTheme();
  const colors = getContrastColors(backgroundType);
  const glassStyles = getGlassmorphismStyles(backgroundType);

  // Phase 1: no analytics side effects
  useEffect(() => {}, [activeTab]);


  return (
    <div 
      className="relative z-[130] min-h-screen"
      style={{ zIndex: 130 }}
    >
      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {activeTab === 'links' && (
          <SocialLinks
            links={socialLinks}
            onEdit={(link) => {
              // Edit functionality is now handled within SocialLinks component
              console.log('Edit link:', link);
            }}
            onDelete={(link) => {
              onDeleteLink(link.id);
            }}
            onAddLink={onAddLink}
            onUpdateLink={onUpdateLink}
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

    </div>
  );
}