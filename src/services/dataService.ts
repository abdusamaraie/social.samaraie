import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

// Define types locally to avoid circular imports
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

// Supabase configuration
const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey);

console.log('DataService initialized with:');
console.log('- Project ID:', projectId);
console.log('- Supabase URL:', supabaseUrl);
console.log('- Public Key:', publicAnonKey ? 'Present' : 'Missing');

class DataService {
  private readonly TABLE_NAME = 'kv_store_af6f5999';

  // Health check method for debugging
  async healthCheck() {
    try {
      // Simple health check by trying to read from the database
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('key')
        .limit(1);
      
      if (error) {
        throw new Error(`Database health check failed: ${error.message}`);
      }
      
      return { 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        database: 'connected'
      };
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  // Profile methods
  async getProfile(): Promise<ProfileData> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('value')
        .eq('key', 'linktree-profile')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found, return default
          return {
            name: 'Your Name',
            bio: 'Your bio here',
            avatar: ''
          };
        }
        throw new Error(`Failed to get profile: ${error.message}`);
      }

      return data?.value || {
        name: 'Your Name',
        bio: 'Your bio here',
        avatar: ''
      };
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  }

  async updateProfile(profile: ProfileData): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.TABLE_NAME)
        .upsert({
          key: 'linktree-profile',
          value: profile
        });

      if (error) {
        throw new Error(`Failed to update profile: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Links methods
  async getLinks(): Promise<SocialLink[]> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('value')
        .eq('key', 'linktree-links')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No links found, return empty array
          return [];
        }
        throw new Error(`Failed to get links: ${error.message}`);
      }

      return data?.value || [];
    } catch (error) {
      console.error('Error getting links:', error);
      throw error;
    }
  }

  async addLink(link: Omit<SocialLink, 'id'>): Promise<SocialLink> {
    try {
      const newLink: SocialLink = {
        ...link,
        id: crypto.randomUUID()
      };

      const existingLinks = await this.getLinks();
      const updatedLinks = [...existingLinks, newLink];

      const { error } = await supabase
        .from(this.TABLE_NAME)
        .upsert({
          key: 'linktree-links',
          value: updatedLinks
        });

      if (error) {
        throw new Error(`Failed to add link: ${error.message}`);
      }

      return newLink;
    } catch (error) {
      console.error('Error adding link:', error);
      throw error;
    }
  }

  async updateLink(id: string, link: Omit<SocialLink, 'id'>): Promise<void> {
    try {
      const existingLinks = await this.getLinks();
      const updatedLinks = existingLinks.map(l => 
        l.id === id ? { ...link, id } : l
      );

      const { error } = await supabase
        .from(this.TABLE_NAME)
        .upsert({
          key: 'linktree-links',
          value: updatedLinks
        });

      if (error) {
        throw new Error(`Failed to update link: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating link:', error);
      throw error;
    }
  }

  async deleteLink(id: string): Promise<void> {
    try {
      const existingLinks = await this.getLinks();
      const updatedLinks = existingLinks.filter(l => l.id !== id);

      const { error } = await supabase
        .from(this.TABLE_NAME)
        .upsert({
          key: 'linktree-links',
          value: updatedLinks
        });

      if (error) {
        throw new Error(`Failed to delete link: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting link:', error);
      throw error;
    }
  }

  // Theme methods (these are now handled by themeService, but keeping for compatibility)
  async getTheme(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('value')
        .eq('key', 'linktree-theme')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to get theme: ${error.message}`);
      }

      return data?.value || null;
    } catch (error) {
      console.error('Error getting theme:', error);
      throw error;
    }
  }

  async updateTheme(theme: any): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.TABLE_NAME)
        .upsert({
          key: 'linktree-theme',
          value: theme
        });

      if (error) {
        throw new Error(`Failed to update theme: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating theme:', error);
      throw error;
    }
  }
}

export const dataService = new DataService();