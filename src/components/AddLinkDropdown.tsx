import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { IconPicker } from './ui/IconPicker';
import { Switch } from './ui/switch';
import { useTheme } from '../contexts/ThemeContext';
import { getContrastColors, getGlassmorphismStyles, getButtonStyles } from '../utils/contrastUtils';
import { FrostyOverlay } from './header/FrostyOverlay';
import type { SocialLink } from '../pages/AdminDashboard';

interface AddLinkDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLink: (link: Omit<SocialLink, 'id'>) => void;
  editingLink?: SocialLink | null;
}

interface LinkForm {
  title: string;
  url: string;
  icon: string;
  color: string;
  customColor?: string;
  customIcon?: string;
  useCustomColor: boolean;
  useCustomIcon: boolean;
}

const colorOptions = [
  { value: 'from-pink-500 to-orange-500', label: 'Sunset', preview: 'bg-gradient-to-r from-pink-500 to-orange-500' },
  { value: 'from-blue-400 to-blue-600', label: 'Blue', preview: 'bg-gradient-to-r from-blue-400 to-blue-600' },
  { value: 'from-purple-500 to-purple-700', label: 'Purple', preview: 'bg-gradient-to-r from-purple-500 to-purple-700' },
  { value: 'from-green-400 to-green-600', label: 'Green', preview: 'bg-gradient-to-r from-green-400 to-green-600' },
  { value: 'from-red-500 to-red-700', label: 'Red', preview: 'bg-gradient-to-r from-red-500 to-red-700' },
  { value: 'from-yellow-400 to-yellow-600', label: 'Yellow', preview: 'bg-gradient-to-r from-yellow-400 to-yellow-600' },
  { value: 'from-indigo-500 to-indigo-700', label: 'Indigo', preview: 'bg-gradient-to-r from-indigo-500 to-indigo-700' },
  { value: 'from-gray-600 to-gray-800', label: 'Gray', preview: 'bg-gradient-to-r from-gray-600 to-gray-800' },
];

export function AddLinkDropdown({ isOpen, onClose, onAddLink, editingLink }: AddLinkDropdownProps) {
  const { backgroundType } = useTheme();
  const colors = getContrastColors(backgroundType);
  const glassStyles = getGlassmorphismStyles(backgroundType);
  const primaryButtonStyles = getButtonStyles(backgroundType, 'primary');
  const outlineButtonStyles = getButtonStyles(backgroundType, 'outline');

  const [form, setForm] = useState<LinkForm>({
    title: '',
    url: '',
    icon: '🔗',
    color: 'from-blue-400 to-blue-600',
    useCustomColor: false,
    useCustomIcon: false,
  });

  // Initialize form with editing data when editingLink changes
  useEffect(() => {
    if (editingLink) {
      setForm({
        title: editingLink.title,
        url: editingLink.url,
        icon: editingLink.icon,
        color: editingLink.color,
        customColor: editingLink.customColor,
        customIcon: editingLink.customIcon,
        useCustomColor: !!editingLink.customColor,
        useCustomIcon: !!editingLink.customIcon,
      });
    } else {
      // Reset form when not editing
      setForm({
        title: '',
        url: '',
        icon: '🔗',
        color: 'from-blue-400 to-blue-600',
        useCustomColor: false,
        useCustomIcon: false,
      });
    }
  }, [editingLink]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.url.trim()) {
      return;
    }

    const newLink: Omit<SocialLink, 'id'> = {
      title: form.title.trim(),
      url: form.url.trim(),
      icon: form.useCustomIcon ? form.customIcon || form.icon : form.icon,
      color: form.useCustomColor ? form.customColor || form.color : form.color,
    };

    onAddLink(newLink);
    
    // Reset form
    setForm({
      title: '',
      url: '',
      icon: '🔗',
      color: 'from-blue-400 to-blue-600',
      useCustomColor: false,
      useCustomIcon: false,
    });
    
    onClose();
  };

  const handleInputChange = (field: keyof LinkForm, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Frosty Blur Overlay */}
          <FrostyOverlay isVisible={isOpen} onClose={onClose} />

          {/* Add Link Dropdown - Full screen on mobile, normal on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 md:relative md:inset-auto z-[400] flex items-center justify-center p-4"
            style={{ zIndex: 400 }}
          >
            <Card
              className="backdrop-blur-xl border rounded-2xl p-6 shadow-2xl w-full max-w-2xl md:max-w-4xl max-h-[90vh] overflow-y-auto"
              style={glassStyles}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-semibold ${colors.text}`}>
                    {editingLink ? 'Edit Link' : 'Add New Link'}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-white/70 hover:text-white"
                  >
                    ✕
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className={`text-sm font-medium ${colors.text}`}>
                      Link Title
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      value={form.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., My Instagram"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                  </div>

                  {/* URL */}
                  <div className="space-y-2">
                    <Label htmlFor="url" className={`text-sm font-medium ${colors.text}`}>
                      URL
                    </Label>
                    <Input
                      id="url"
                      type="url"
                      value={form.url}
                      onChange={(e) => handleInputChange('url', e.target.value)}
                      placeholder="https://example.com"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                  </div>

                  {/* Icon Selection */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className={`text-sm font-medium ${colors.text}`}>
                        Icon
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={form.useCustomIcon}
                          onCheckedChange={(checked) => handleInputChange('useCustomIcon', checked)}
                        />
                        <span className={`text-xs ${colors.textMuted}`}>Custom</span>
                      </div>
                    </div>
                    
                    {form.useCustomIcon ? (
                      <IconPicker
                        value={form.customIcon || form.icon}
                        onChange={(icon) => handleInputChange('customIcon', icon)}
                      />
                    ) : (
                      <div className="grid grid-cols-6 gap-2">
                        {['🔗', '📷', '💼', '📺', '🎵', '📱', '💻', '🎮', '📚', '🏠', '📧', '🐦'].map((icon) => (
                          <button
                            key={icon}
                            type="button"
                            onClick={() => handleInputChange('icon', icon)}
                            className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg transition-all ${
                              form.icon === icon
                                ? 'border-white bg-white/20'
                                : 'border-white/30 hover:border-white/50'
                            }`}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Color Selection */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className={`text-sm font-medium ${colors.text}`}>
                        Color
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={form.useCustomColor}
                          onCheckedChange={(checked) => handleInputChange('useCustomColor', checked)}
                        />
                        <span className={`text-xs ${colors.textMuted}`}>Custom</span>
                      </div>
                    </div>
                    
                    {form.useCustomColor ? (
                      <Input
                        type="color"
                        value={form.customColor || '#3b82f6'}
                        onChange={(e) => handleInputChange('customColor', e.target.value)}
                        className="w-full h-10 bg-white/10 border-white/20"
                      />
                    ) : (
                      <div className="grid grid-cols-4 gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() => handleInputChange('color', color.value)}
                            className={`w-12 h-12 rounded-lg border-2 transition-all ${
                              form.color === color.value
                                ? 'border-white scale-110'
                                : 'border-white/30 hover:border-white/50'
                            }`}
                          >
                            <div className={`w-full h-full rounded-md ${color.preview}`} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Preview */}
                  <div className="space-y-2">
                    <Label className={`text-sm font-medium ${colors.text}`}>
                      Preview
                    </Label>
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${form.color} flex items-center justify-center shadow-lg`}>
                          <span className="text-lg">{form.useCustomIcon ? form.customIcon || form.icon : form.icon}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-white font-medium truncate">{form.title || 'Link Title'}</h4>
                          <p className="text-white/70 text-sm truncate">{form.url || 'https://example.com'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className={`flex-1 ${outlineButtonStyles.default} ${outlineButtonStyles.hover} ${outlineButtonStyles.active}`}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className={`flex-1 ${primaryButtonStyles.default} ${primaryButtonStyles.hover} ${primaryButtonStyles.active}`}
                      disabled={!form.title.trim() || !form.url.trim()}
                    >
                      {editingLink ? 'Edit Link' : 'Add Link'}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
