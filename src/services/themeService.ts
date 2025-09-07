import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration');
}

// Create client with anon key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ThemeSettings {
  backgroundType: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  customCSS?: string;
  autoSwitchTime?: {
    enabled: boolean;
    lightTheme: string;
    darkTheme: string;
    switchTime: string;
  };
}

class ThemeService {
  private readonly TABLE_NAME = 'kv_store_af6f5999';
  private readonly THEME_KEY = 'linktree-theme';

  async getTheme(): Promise<ThemeSettings | null> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('value')
        .eq('key', this.THEME_KEY)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found, return null
          return null;
        }
        console.error('Error fetching theme:', error);
        return null;
      }

      return data?.value || null;
    } catch (error) {
      console.error('Error fetching theme:', error);
      return null;
    }
  }

  async updateTheme(theme: ThemeSettings): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(this.TABLE_NAME)
        .upsert({
          key: this.THEME_KEY,
          value: theme
        });

      if (error) {
        console.error('Error updating theme:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating theme:', error);
      return false;
    }
  }
}

export const themeService = new ThemeService();
