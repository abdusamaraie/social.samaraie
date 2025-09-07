import { useState } from 'react';
import { motion } from 'motion/react';
import { SocialLink } from '../pages/AdminDashboard';
import { Button } from './ui/button';
import { GlassmorphismButton } from './ui/glassmorphism-button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { IconPicker } from './ui/IconPicker';
import { Switch } from './ui/switch';
import { useTheme } from '../contexts/ThemeContext';
import { getContrastColors, getGlassmorphismStyles, getButtonStyles } from '../utils/contrastUtils';

interface LinkManagerProps {
  socialLinks: SocialLink[];
  onAddLink: (link: Omit<SocialLink, 'id'>) => void;
  onUpdateLink: (id: string, link: Omit<SocialLink, 'id'>) => void;
  onDeleteLink: (id: string) => void;
  isAdding?: boolean;
  onAddingChange?: (isAdding: boolean) => void;
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

export function LinkManager({ socialLinks, onAddLink, onUpdateLink, onDeleteLink, isAdding: externalIsAdding, onAddingChange }: LinkManagerProps) {
  const { backgroundType } = useTheme();
  const colors = getContrastColors(backgroundType);
  const glassStyles = getGlassmorphismStyles(backgroundType);
  const primaryButtonStyles = getButtonStyles(backgroundType, 'primary');
  const outlineButtonStyles = getButtonStyles(backgroundType, 'outline');
  
  const [internalIsAdding, setInternalIsAdding] = useState(false);
  const isAdding = externalIsAdding !== undefined ? externalIsAdding : internalIsAdding;
  const setIsAdding = onAddingChange || setInternalIsAdding;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<LinkForm>({
    title: '',
    url: '',
    icon: '🔗',
    color: 'from-blue-400 to-blue-600',
    customColor: '#3b82f6',
    customIcon: '🔗',
    useCustomColor: false,
    useCustomIcon: false
  });

  const resetForm = () => {
    setFormData({
      title: '',
      url: '',
      icon: '🔗',
      color: 'from-blue-400 to-blue-600',
      customColor: '#3b82f6',
      customIcon: '🔗',
      useCustomColor: false,
      useCustomIcon: false
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.url) return;

    const linkData = {
      title: formData.title,
      url: formData.url,
      icon: formData.icon,
      color: formData.color,
      customColor: formData.useCustomColor ? formData.customColor : undefined,
      customIcon: formData.useCustomIcon ? formData.customIcon : undefined,
    };

    if (editingId) {
      onUpdateLink(editingId, linkData);
    } else {
      onAddLink(linkData);
    }
    resetForm();
  };

  const startEdit = (link: SocialLink) => {
    setFormData({
      title: link.title,
      url: link.url,
      icon: link.icon,
      color: link.color,
      customColor: link.customColor || '#3b82f6',
      customIcon: link.customIcon || link.icon,
      useCustomColor: !!link.customColor,
      useCustomIcon: !!link.customIcon,
    });
    setEditingId(link.id);
    setIsAdding(true);
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <h3 className={`text-xl font-medium ${colors.text} mb-4`}>
            {editingId ? 'Edit Link' : 'Add New Link'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className={colors.textSecondary}>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Instagram"
                  className={`${backgroundType === 'gradient3' ? 'bg-black/10 border-black/20 text-gray-900 placeholder:text-gray-600' : 'bg-white/10 border-white/20 text-white placeholder:text-white/50'}`}
                />
              </div>
              <div>
                <Label className={colors.textSecondary}>URL</Label>
                <Input
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://instagram.com/username"
                  className={`${backgroundType === 'gradient3' ? 'bg-black/10 border-black/20 text-gray-900 placeholder:text-gray-600' : 'bg-white/10 border-white/20 text-white placeholder:text-white/50'}`}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className={colors.textSecondary}>Icon</Label>
                <div className="space-y-2">
                  <IconPicker
                    value={formData.useCustomIcon ? (formData.customIcon || formData.icon) : formData.icon}
                    onChange={(icon) => {
                      if (formData.useCustomIcon) {
                        setFormData({ ...formData, customIcon: icon });
                      } else {
                        setFormData({ ...formData, icon: icon });
                      }
                    }}
                  />
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.useCustomIcon}
                      onCheckedChange={(checked) => setFormData({ ...formData, useCustomIcon: checked })}
                    />
                    <Label className={`${colors.textSecondary} text-sm`}>
                      Use custom icon
                    </Label>
                  </div>
                </div>
              </div>
              <div>
                <Label className={colors.textSecondary}>Color Theme</Label>
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: option.value })}
                        className={`h-8 rounded-lg ${option.preview} ${
                          formData.color === option.value
                            ? backgroundType === 'gradient3' ? 'ring-2 ring-gray-800 ring-offset-2 ring-offset-transparent' : 'ring-2 ring-white ring-offset-2 ring-offset-transparent'
                            : ''
                        }`}
                        title={option.label}
                      />
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.useCustomColor}
                      onCheckedChange={(checked) => setFormData({ ...formData, useCustomColor: checked })}
                    />
                    <Label className={`${colors.textSecondary} text-sm`}>
                      Use custom color
                    </Label>
                  </div>
                  {formData.useCustomColor && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={formData.customColor}
                        onChange={(e) => setFormData({ ...formData, customColor: e.target.value })}
                        className="w-8 h-8 rounded border border-white/20 cursor-pointer"
                      />
                      <Input
                        value={formData.customColor}
                        onChange={(e) => setFormData({ ...formData, customColor: e.target.value })}
                        placeholder="#3b82f6"
                        className={`${backgroundType === 'gradient3' ? 'bg-black/10 border-black/20 text-gray-900 placeholder:text-gray-600' : 'bg-white/10 border-white/20 text-white placeholder:text-white/50'}`}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                type="submit" 
                className={`${primaryButtonStyles.default} ${primaryButtonStyles.hover} ${primaryButtonStyles.active} !text-white hover:!text-white`}
              >
                {editingId ? 'Update Link' : 'Add Link'}
              </Button>
              <Button
                type="button"
                onClick={resetForm}
                variant="outline"
                className={`${outlineButtonStyles.default} ${outlineButtonStyles.hover} ${outlineButtonStyles.active} !text-white hover:!text-white`}
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      )}


      {/* Links List */}
      <div className="space-y-4">
        {socialLinks.map((link) => (
          <motion.div
            key={link.id}
            layout
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl group"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-4 min-w-0 flex-1">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${link.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                >
                  <span className="text-xl">{link.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className={`${colors.text} font-medium truncate`}>{link.title}</h4>
                  <p className={`${colors.textMuted} text-sm truncate`}>{link.url}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <Button
                  onClick={() => startEdit(link)}
                  size="sm"
                  variant="outline"
                  className={`${outlineButtonStyles.default} ${outlineButtonStyles.hover} ${outlineButtonStyles.active} !text-white hover:!text-white min-w-[60px]`}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => onDeleteLink(link.id)}
                  size="sm"
                  variant="outline"
                  className={`${backgroundType === 'gradient3' ? 'border-red-600/50 text-red-700 hover:bg-red-500/20 hover:text-red-800' : 'border-red-400/50 text-red-300 hover:bg-red-500/20 hover:text-white'} !important min-w-[70px]`}
                >
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}