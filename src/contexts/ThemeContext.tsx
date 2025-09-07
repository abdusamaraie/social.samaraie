import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { BackgroundType } from '../utils/contrastUtils';
import { dataService } from '../services/dataService';

export interface ThemeSettings {
  backgroundType: BackgroundType;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  customCSS?: string;
  autoSwitchTime?: {
    enabled: boolean;
    lightTheme: BackgroundType;
    darkTheme: BackgroundType;
    switchTime: string; // HH:MM format
  };
}

interface ThemeContextType {
  theme: ThemeSettings;
  updateTheme: (updates: Partial<ThemeSettings>) => void;
  resetTheme: () => void;
  backgroundType: BackgroundType; // For backward compatibility
  isLoading: boolean;
}

const defaultTheme: ThemeSettings = {
  backgroundType: 'gradient1',
  primaryColor: '#3b82f6',
  secondaryColor: '#6b7280',
  accentColor: '#10b981',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialBackgroundType?: BackgroundType;
}

export function ThemeProvider({ children, initialBackgroundType = 'gradient1' }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeSettings>({
    ...defaultTheme,
    backgroundType: initialBackgroundType,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from Supabase on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        setIsLoading(true);
        const savedTheme = await dataService.getTheme();
        if (savedTheme) {
          setTheme({ ...defaultTheme, ...savedTheme });
        }
      } catch (error) {
        console.warn('Failed to load theme from server, using default:', error);
        // Fallback to localStorage if server fails
        const localTheme = localStorage.getItem('social-link-theme');
        if (localTheme) {
          try {
            const parsedTheme = JSON.parse(localTheme);
            setTheme({ ...defaultTheme, ...parsedTheme });
          } catch (parseError) {
            console.warn('Failed to parse local theme:', parseError);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Save theme to Supabase when it changes (with debouncing)
  useEffect(() => {
    if (isLoading) return; // Don't save during initial load

    const saveTheme = async () => {
      try {
        await dataService.updateTheme(theme);
        // Also save to localStorage as backup
        localStorage.setItem('social-link-theme', JSON.stringify(theme));
      } catch (error) {
        console.warn('Failed to save theme to server:', error);
        // Fallback to localStorage only
        localStorage.setItem('social-link-theme', JSON.stringify(theme));
      }
    };

    // Debounce the save operation
    const timeoutId = setTimeout(saveTheme, 500);
    return () => clearTimeout(timeoutId);
  }, [theme, isLoading]);

  // Auto-switch theme based on time
  useEffect(() => {
    if (!theme.autoSwitchTime?.enabled) return;

    const checkTime = () => {
      const now = new Date();
      const currentTime = now.getHours() * 100 + now.getMinutes();
      const switchTime = parseInt(theme.autoSwitchTime!.switchTime.replace(':', ''));

      const newBackgroundType = currentTime >= switchTime
        ? theme.autoSwitchTime?.darkTheme || 'gradient3'
        : theme.autoSwitchTime?.lightTheme || 'gradient1';

      if (newBackgroundType !== theme.backgroundType) {
        setTheme(prev => ({ ...prev, backgroundType: newBackgroundType }));
      }
    };

    // Check immediately
    checkTime();

    // Check every minute
    const interval = setInterval(checkTime, 60000);

    return () => clearInterval(interval);
  }, [theme.autoSwitchTime, theme.backgroundType]);

  const updateTheme = (updates: Partial<ThemeSettings>) => {
    setTheme(prev => ({ ...prev, ...updates }));
    console.log('Theme updated:', { ...theme, ...updates });
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
  };

  const value: ThemeContextType = {
    theme,
    updateTheme,
    resetTheme,
    backgroundType: theme.backgroundType, // For backward compatibility
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}