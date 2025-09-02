import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { BackgroundType } from '../utils/contrastUtils';

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

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('social-link-theme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setTheme({ ...defaultTheme, ...parsedTheme });
      } catch (error) {
        console.warn('Failed to parse saved theme:', error);
      }
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('social-link-theme', JSON.stringify(theme));
  }, [theme]);

  // Auto-switch theme based on time
  useEffect(() => {
    if (!theme.autoSwitchTime?.enabled) return;

    const checkTime = () => {
      const now = new Date();
      const currentTime = now.getHours() * 100 + now.getMinutes();
      const switchTime = parseInt(theme.autoSwitchTime!.switchTime.replace(':', ''));

      const newBackgroundType = currentTime >= switchTime
        ? theme.autoSwitchTime.darkTheme
        : theme.autoSwitchTime.lightTheme;

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
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
  };

  const value: ThemeContextType = {
    theme,
    updateTheme,
    resetTheme,
    backgroundType: theme.backgroundType, // For backward compatibility
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