import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { ScrollArea } from './scroll-area';

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  className?: string;
}

// Popular social media and platform icons
const socialIcons = [
  '📘', '📷', '🐦', '💼', '🔗', '📺', '🎵', '💻', '🌐', '📱',
  '🎮', '📧', '💬', '📝', '🎨', '📊', '🏆', '🎯', '🚀', '💡',
  '🌟', '✨', '🎉', '🎊', '🎈', '🎁', '🎪', '🎭', '🎨', '🎼',
  '🎹', '🎸', '🥁', '🎺', '🎷', '🎸', '🎻', '🎧', '📻', '📺',
  '📷', '📹', '📱', '💻', '🖥️', '⌨️', '🖱️', '🖨️', '📱', '📞',
  '📧', '💬', '📝', '📅', '📊', '📈', '📉', '📊', '💼', '🏢',
  '🏠', '🏘️', '🏙️', '🌆', '🌃', '🌉', '🏰', '🏯', '🏛️', '⛪',
  '🕌', '🕍', '⛩️', '🕋', '⛲', '🌋', '🏔️', '🏞️', '🏖️', '🏜️',
  '🌅', '🌄', '🌠', '🎇', '🎆', '🌈', '☀️', '🌤️', '⛅', '☁️',
  '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '☃️', '🌪️', '🌫️', '🌊', '🐠',
  '🐟', '🐡', '🦈', '🐙', '🐚', '🐳', '🐋', '🦭', '🐊', '🐅',
  '🐆', '🦓', '🦍', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘',
  '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌',
  '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🐓', '🐔', '🐣', '🐤',
  '🐥', '🐦', '🐧', '🦅', '🦆', '🦢', '🦉', '🦚', '🦜', '🐸',
  '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🦕', '🦖', '🐳', '🐋'
];

const emojiCategories = [
  { name: 'Faces', icons: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'] },
  { name: 'Gestures', icons: ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄'] },
  { name: 'Activities', icons: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️', '🤺', '🤾', '🏌️', '🧘', '🏃', '🚶', '🧎', '🧍', '🤳', '💃', '🕺', '👯', '👩‍🦽', '👨‍🦽', '👩‍🦼', '👨‍🦼', '🚵', '🚴', '🏇', '🧘‍♀️', '🧘‍♂️'] },
  { name: 'Food', icons: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥖', '🍞', '🥨', '🥯', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥙', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕', '🫖', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉', '🍾'] },
  { name: 'Objects', icons: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🪜', '🧰', '🧲', '🪝', '📿', '💈', '⚗️', '🔬', '🔭', '📡', '💉', '🩸', '💊', '🩹', '🩼', '🩺', '🩻', '🚪', '🪞', '🪟', '🛏️', '🛋️', '🪑', '🚽', '🪠', '🚿', '🛁', '🪤', '🪒', '🧴', '🧷', '🧹', '🧺', '🧻', '🪣', '🧼', '🫧', '🪥', '🧽', '🧯', '🛒', '🚬', '⚰️', '🪦', '⚱️', '🗿', '🪧', '🚮'] },
  { name: 'Symbols', icons: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '🆘', '👮', '💂', '🥷', '👷', '🤴', '👸', '👳', '👲', '🧕', '🤵', '🤰', '🤱', '👼', '🎅', '🤶', '🦸', '🦹', '🧙', '🧚', '🧛', '🧜', '🧝', '🧞', '🧟', '💆', '💇', '🚶', '🧍', '🧎', '👨‍🦯', '👩‍🦯', '👨‍🦼', '👩‍🦼', '👨‍🦽', '👩‍🦽', '🏃', '💃', '🕺', '🕴️', '👯', '👰', '🤵', '🤵‍♂️', '🤵‍♀️', '👰‍♂️', '👰‍♀️'] }
];

export function IconPicker({ value, onChange, className = '' }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Faces');

  const filteredIcons = searchTerm
    ? [...socialIcons, ...emojiCategories.flatMap(cat => cat.icons)].filter(icon =>
        icon.includes(searchTerm.toLowerCase())
      )
    : emojiCategories.find(cat => cat.name === activeCategory)?.icons || socialIcons;

  const handleIconSelect = (icon: string) => {
    onChange(icon);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={className}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
            type="button"
          >
            <span className="text-lg mr-2">{value || '👤'}</span>
            <span className="truncate">{value ? 'Change icon' : 'Select icon'}</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Choose an Icon</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search */}
            <div>
              <Label htmlFor="icon-search">Search icons</Label>
              <Input
                id="icon-search"
                placeholder="Search for icons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Categories */}
            {!searchTerm && (
              <div className="flex flex-wrap gap-2">
                {emojiCategories.map((category) => (
                  <Button
                    key={category.name}
                    variant={activeCategory === category.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(category.name)}
                    className="text-xs"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            )}

            {/* Icon Grid */}
            <ScrollArea className="h-64">
              <div className="grid grid-cols-8 gap-2">
                {filteredIcons.map((icon, index) => (
                  <motion.button
                    key={`${icon}-${index}`}
                    onClick={() => handleIconSelect(icon)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors ${
                      value === icon ? 'bg-primary text-primary-foreground' : ''
                    }`}
                    type="button"
                  >
                    <span className="text-xl">{icon}</span>
                  </motion.button>
                ))}
              </div>
            </ScrollArea>

            {/* Custom Text Input */}
            <div>
              <Label htmlFor="custom-icon">Or enter custom emoji/text</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="custom-icon"
                  placeholder="Enter emoji or text..."
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  maxLength={10}
                />
                <Button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  variant="default"
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
