import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Header } from '../components/Header';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { AdminDashboard as AdminDashboardComponent } from '../components/AdminDashboard';
import { NotificationToast } from '../components/NotificationToast';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { dataService } from '../services/dataService';

// Wrapper component to use theme context
function AnimatedBackgroundWrapper() {
  const { backgroundType } = useTheme();
  return <AnimatedBackground type={backgroundType} />;
}

export interface SocialLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  color: string;
  customColor?: string;
  customIcon?: string;
}

export interface ProfileData {
  name: string;
  bio: string;
  avatar: string;
}

export default function AdminDashboardPage() {
  // Remove local background state - will use theme context instead
  const [isAdminMode, setIsAdminMode] = useState(true);
  const [activeTab, setActiveTab] = useState<'links' | 'profile' | 'preview' | 'themes'>('links');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Your Name',
    bio: 'Creator • Developer • Dreamer\nBuilding amazing things on the internet ✨',
    avatar: '👤'
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type });
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // First try health check to ensure server is running
        console.log('Checking server health...');
        await dataService.healthCheck();
        console.log('Server is healthy, loading data...');

        const [profile, links] = await Promise.all([
          dataService.getProfile(),
          dataService.getLinks()
        ]);
        setProfileData(profile);
        setSocialLinks(links);
        console.log('Data loaded successfully');
      } catch (error) {
        console.error('Error loading data:', error);

        // Fallback to default data if server is not available
        console.log('Using fallback data...');
        setProfileData({
          name: 'Your Name',
          bio: 'Creator • Developer • Dreamer\nBuilding amazing things on the internet ✨',
          avatar: '👤'
        });
        setSocialLinks([
          {
            id: '1',
            title: 'Instagram',
            url: 'https://instagram.com/username',
            icon: '📷',
            color: 'from-pink-500 to-orange-500'
          },
          {
            id: '2',
            title: 'Twitter',
            url: 'https://twitter.com/username',
            icon: '🐦',
            color: 'from-blue-400 to-blue-600'
          },
          {
            id: '3',
            title: 'LinkedIn',
            url: 'https://linkedin.com/in/username',
            icon: '💼',
            color: 'from-blue-600 to-blue-800'
          },
          {
            id: '4',
            title: 'GitHub',
            url: 'https://github.com/username',
            icon: '🔗',
            color: 'from-gray-600 to-gray-800'
          },
          {
            id: '5',
            title: 'YouTube',
            url: 'https://youtube.com/@username',
            icon: '📺',
            color: 'from-red-500 to-red-700'
          },
          {
            id: '6',
            title: 'Website',
            url: 'https://yourwebsite.com',
            icon: '🌐',
            color: 'from-purple-500 to-purple-700'
          }
        ]);

        showNotification('Server unavailable - using local data', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const addLink = async (link: Omit<SocialLink, 'id'>) => {
    try {
      const newLink = await dataService.addLink(link);
      setSocialLinks([...socialLinks, newLink]);
      showNotification('Link added successfully!');
    } catch (error) {
      console.error('Error adding link:', error);
      showNotification('Failed to add link', 'error');
    }
  };

  const updateLink = async (id: string, updatedLink: Omit<SocialLink, 'id'>) => {
    try {
      await dataService.updateLink(id, updatedLink);
      setSocialLinks(socialLinks.map(link =>
        link.id === id ? { ...updatedLink, id } : link
      ));
      showNotification('Link updated successfully!');
    } catch (error) {
      console.error('Error updating link:', error);
      showNotification('Failed to update link', 'error');
    }
  };

  const deleteLink = async (id: string) => {
    try {
      await dataService.deleteLink(id);
      setSocialLinks(socialLinks.filter(link => link.id !== id));
      showNotification('Link deleted successfully!');
    } catch (error) {
      console.error('Error deleting link:', error);
      showNotification('Failed to delete link', 'error');
    }
  };

  const updateProfile = async (profile: ProfileData) => {
    try {
      await dataService.updateProfile(profile);
      setProfileData(profile);
      showNotification('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('Failed to update profile', 'error');
    }
  };

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen relative overflow-hidden">
          <AnimatedBackgroundWrapper />
          <div className="relative z-10 min-h-screen flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">✨</div>
                <div className="text-white font-medium">Loading admin dashboard...</div>
              </div>
            </motion.div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background - managed by theme context */}
        <AnimatedBackgroundWrapper />

        {/* Header with navigation and theme controls */}
        <Header 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Admin Dashboard */}
        <AdminDashboardComponent
          socialLinks={socialLinks}
          profileData={profileData}
          onAddLink={addLink}
          onUpdateLink={updateLink}
          onDeleteLink={deleteLink}
          onUpdateProfile={updateProfile}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Notification Toast */}
        <NotificationToast
          {...notification}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      </div>
    </ThemeProvider>
  );
}