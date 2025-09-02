import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Badge } from '../../ui/badge';
import { useTheme, ThemeSettings } from '../../../contexts/ThemeContext';
import { BackgroundType } from '../../../utils/contrastUtils';
import { getContrastColors, getGlassmorphismStyles } from '../../../utils/contrastUtils';
// analytics removed

interface ThemeSelectorProps {
  className?: string;
}

const backgroundOptions: { value: BackgroundType; label: string; description: string }[] = [
  { value: 'gradient1', label: 'Ocean Blue', description: 'Deep blue gradient with glass effects' },
  { value: 'gradient2', label: 'Sunset Orange', description: 'Warm orange gradient with golden accents' },
  { value: 'gradient3', label: 'Dark Mode', description: 'Dark theme with neon accents' },
  { value: 'particles', label: 'Particle Field', description: 'Animated particles with glass overlay' },
  { value: 'geometric', label: 'Geometric', description: 'Modern geometric patterns' },
];

const colorPresets = [
  { name: 'Blue', primary: '#3b82f6', secondary: '#6b7280', accent: '#10b981' },
  { name: 'Purple', primary: '#8b5cf6', secondary: '#6b7280', accent: '#f59e0b' },
  { name: 'Green', primary: '#10b981', secondary: '#6b7280', accent: '#3b82f6' },
  { name: 'Red', primary: '#ef4444', secondary: '#6b7280', accent: '#8b5cf6' },
  { name: 'Pink', primary: '#ec4899', secondary: '#6b7280', accent: '#10b981' },
  { name: 'Teal', primary: '#14b8a6', secondary: '#6b7280', accent: '#f59e0b' },
];

export function ThemeSelector({ className = '' }: ThemeSelectorProps) {
  const { theme, updateTheme, resetTheme, backgroundType } = useTheme();
  const colors = getContrastColors(backgroundType);
  const glassStyles = getGlassmorphismStyles(backgroundType);

  const [customCSS, setCustomCSS] = useState(theme.customCSS || '');
  const [autoSwitchEnabled, setAutoSwitchEnabled] = useState(theme.autoSwitchTime?.enabled || false);
  const [switchTime, setSwitchTime] = useState(theme.autoSwitchTime?.switchTime || '18:00');
  const [lightTheme, setLightTheme] = useState(theme.autoSwitchTime?.lightTheme || 'gradient1');
  const [darkTheme, setDarkTheme] = useState(theme.autoSwitchTime?.darkTheme || 'gradient3');

  const handleBackgroundChange = (newBackground: BackgroundType) => {
    updateTheme({ backgroundType: newBackground });
  };

  const handleColorPresetSelect = (preset: typeof colorPresets[0]) => {
    updateTheme({
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
    });
  };

  const handleCustomColorChange = (colorType: keyof Pick<ThemeSettings, 'primaryColor' | 'secondaryColor' | 'accentColor'>, value: string) => {
    updateTheme({ [colorType]: value });
  };

  const handleAutoSwitchToggle = (enabled: boolean) => {
    setAutoSwitchEnabled(enabled);
    if (enabled) {
      updateTheme({
        autoSwitchTime: {
          enabled: true,
          lightTheme,
          darkTheme,
          switchTime,
        },
      });
    } else {
      updateTheme({
        autoSwitchTime: {
          enabled: false,
          lightTheme,
          darkTheme,
          switchTime,
        },
      });
    }

  };

  const handleAutoSwitchSettingsChange = () => {
    updateTheme({
      autoSwitchTime: {
        enabled: autoSwitchEnabled,
        lightTheme,
        darkTheme,
        switchTime,
      },
    });
  };

  const handleCustomCSSChange = (css: string) => {
    setCustomCSS(css);
    updateTheme({ customCSS: css });
  };

  const handleReset = () => {
    resetTheme();
    setCustomCSS('');
    setAutoSwitchEnabled(false);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Background Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6" style={glassStyles}>
          <h3 className={`text-lg font-semibold mb-4 ${colors.text}`}>
            Background Themes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {backgroundOptions.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => handleBackgroundChange(option.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme.backgroundType === option.value
                    ? 'border-white/50 bg-white/10'
                    : 'border-white/20 hover:border-white/30 hover:bg-white/5'
                }`}
              >
                <h4 className={`${colors.text} font-medium mb-1`}>{option.label}</h4>
                <p className={`${colors.textMuted} text-sm`}>{option.description}</p>
                {theme.backgroundType === option.value && (
                  <Badge className="mt-2" variant="secondary">Active</Badge>
                )}
              </motion.button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Color Customization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6" style={glassStyles}>
          <h3 className={`text-lg font-semibold mb-4 ${colors.text}`}>
            Color Scheme
          </h3>

          {/* Color Presets */}
          <div className="mb-6">
            <Label className={`${colors.text} text-sm font-medium mb-3 block`}>
              Quick Presets
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {colorPresets.map((preset) => (
                <motion.button
                  key={preset.name}
                  onClick={() => handleColorPresetSelect(preset)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-3 rounded-lg border border-white/20 hover:border-white/30 hover:bg-white/5 transition-all"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: preset.secondary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: preset.accent }}
                    />
                  </div>
                  <span className={`${colors.text} text-sm font-medium`}>{preset.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="primary-color" className={`${colors.text} text-sm font-medium`}>
                Primary Color
              </Label>
              <div className="flex items-center space-x-2 mt-1">
                <input
                  id="primary-color"
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => handleCustomColorChange('primaryColor', e.target.value)}
                  className="w-8 h-8 rounded border border-white/20 cursor-pointer"
                />
                <Input
                  value={theme.primaryColor}
                  onChange={(e) => handleCustomColorChange('primaryColor', e.target.value)}
                  className="flex-1"
                  placeholder="#3b82f6"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="secondary-color" className={`${colors.text} text-sm font-medium`}>
                Secondary Color
              </Label>
              <div className="flex items-center space-x-2 mt-1">
                <input
                  id="secondary-color"
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) => handleCustomColorChange('secondaryColor', e.target.value)}
                  className="w-8 h-8 rounded border border-white/20 cursor-pointer"
                />
                <Input
                  value={theme.secondaryColor}
                  onChange={(e) => handleCustomColorChange('secondaryColor', e.target.value)}
                  className="flex-1"
                  placeholder="#6b7280"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="accent-color" className={`${colors.text} text-sm font-medium`}>
                Accent Color
              </Label>
              <div className="flex items-center space-x-2 mt-1">
                <input
                  id="accent-color"
                  type="color"
                  value={theme.accentColor}
                  onChange={(e) => handleCustomColorChange('accentColor', e.target.value)}
                  className="w-8 h-8 rounded border border-white/20 cursor-pointer"
                />
                <Input
                  value={theme.accentColor}
                  onChange={(e) => handleCustomColorChange('accentColor', e.target.value)}
                  className="flex-1"
                  placeholder="#10b981"
                />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Auto Theme Switching */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6" style={glassStyles}>
          <h3 className={`text-lg font-semibold mb-4 ${colors.text}`}>
            Auto Theme Switching
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className={`${colors.text} text-sm font-medium`}>
                  Enable Auto Switching
                </Label>
                <p className={`${colors.textMuted} text-sm`}>
                  Automatically switch themes based on time of day
                </p>
              </div>
              <Switch
                checked={autoSwitchEnabled}
                onCheckedChange={handleAutoSwitchToggle}
              />
            </div>

            {autoSwitchEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-4 border-t border-white/10"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className={`${colors.text} text-sm font-medium`}>
                      Switch Time
                    </Label>
                    <Input
                      type="time"
                      value={switchTime}
                      onChange={(e) => {
                        setSwitchTime(e.target.value);
                        setTimeout(handleAutoSwitchSettingsChange, 500);
                      }}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className={`${colors.text} text-sm font-medium`}>
                      Light Theme
                    </Label>
                    <Select
                      value={lightTheme}
                      onValueChange={(value: BackgroundType) => {
                        setLightTheme(value);
                        setTimeout(handleAutoSwitchSettingsChange, 500);
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {backgroundOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className={`${colors.text} text-sm font-medium`}>
                      Dark Theme
                    </Label>
                    <Select
                      value={darkTheme}
                      onValueChange={(value: BackgroundType) => {
                        setDarkTheme(value);
                        setTimeout(handleAutoSwitchSettingsChange, 500);
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {backgroundOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Custom CSS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6" style={glassStyles}>
          <h3 className={`text-lg font-semibold mb-4 ${colors.text}`}>
            Custom CSS
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="custom-css" className={`${colors.text} text-sm font-medium`}>
                Advanced Customization
              </Label>
              <p className={`${colors.textMuted} text-sm mb-2`}>
                Add custom CSS to further personalize your theme
              </p>
              <textarea
                id="custom-css"
                value={customCSS}
                onChange={(e) => handleCustomCSSChange(e.target.value)}
                placeholder="/* Add your custom CSS here */"
                className={`w-full h-32 p-3 rounded-lg border border-white/20 bg-white/5 ${colors.text} placeholder-${colors.textMuted} resize-none focus:outline-none focus:ring-2 focus:ring-white/30`}
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Reset Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex justify-end">
          <Button
            onClick={handleReset}
            variant="outline"
            className={`px-6 py-2 ${colors.text} border-white/20 hover:bg-white/10`}
          >
            Reset to Default
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
