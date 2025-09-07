import { motion } from 'motion/react';
import { SocialLink, ProfileData } from '../App';
import { LinkCard } from './LinkCard';
import { ProfileCard } from './ProfileCard';
import { SectionWrapper } from './SectionWrapper';

interface LinkPreviewProps {
  socialLinks: SocialLink[];
  profileData: ProfileData;
}

export function LinkPreview({ socialLinks, profileData }: LinkPreviewProps) {
  return (
    <SectionWrapper>
      <div className="space-y-6">
        {/* Preview Header */}
        <motion.div
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <h3 className="text-xl font-medium text-white mb-2 flex items-center">
            <span className="text-2xl mr-3">👁️</span>
            Live Preview
          </h3>
          <p className="text-white/70">
            This is how your public page will look to visitors
          </p>
        </motion.div>

        {/* Preview Content */}
        <motion.div
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div className="max-w-md mx-auto space-y-6">
            {/* Profile Preview */}
            <ProfileCard profileData={profileData} />

            {/* Links Preview */}
            {socialLinks.length > 0 ? (
              <motion.div 
                className="space-y-4"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                initial="hidden"
                animate="show"
              >
                {socialLinks.map((link, index) => (
                  <motion.div
                    key={link.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                  >
                    <LinkCard {...link} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-4xl mb-4">🔗</div>
                <div className="text-white/70">No links added yet</div>
                <div className="text-white/50 text-sm mt-2">
                  Go to the Links tab to add your first link
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <h4 className="text-white/90 font-medium mb-4 flex items-center">
            <span className="text-lg mr-2">📊</span>
            Quick Stats
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-medium text-white">{socialLinks.length}</div>
              <div className="text-white/60 text-sm">Active Links</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-medium text-white">{profileData.name ? '✓' : '×'}</div>
              <div className="text-white/60 text-sm">Profile Setup</div>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}