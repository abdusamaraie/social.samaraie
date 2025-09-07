import { useState } from 'react';
import { motion } from 'motion/react';
import { SocialLink } from '../pages/AdminDashboard';
import { AddLinkButton } from './AddLinkButton';
import { AddLinkDropdown } from './AddLinkDropdown';
import { SocialLinkCard } from './SocialLinkCard';
import { SectionWrapper } from './SectionWrapper';

interface SocialLinksProps {
  links: SocialLink[];
  onEdit?: (link: SocialLink) => void;
  onDelete?: (link: SocialLink) => void;
  onAddLink?: (link: Omit<SocialLink, 'id'>) => void;
  onUpdateLink?: (id: string, link: Omit<SocialLink, 'id'>) => void;
}

export function SocialLinks({ links, onEdit, onDelete, onAddLink, onUpdateLink }: SocialLinksProps) {
  const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);

  const handleAddLink = (link: Omit<SocialLink, 'id'>) => {
    onAddLink?.(link);
    setIsAddDropdownOpen(false);
  };

  const handleEditLink = (link: SocialLink) => {
    setEditingLink(link);
    setIsAddDropdownOpen(false);
  };

  const handleUpdateLink = (updatedLink: Omit<SocialLink, 'id'>) => {
    if (editingLink && onUpdateLink) {
      onUpdateLink(editingLink.id, updatedLink);
    }
    setEditingLink(null);
  };

  const handleCancelEdit = () => {
    setEditingLink(null);
  };

  return (
    <SectionWrapper>
      {/* Social Links Cards */}
      <div className="space-y-4">
        {links.map((link) => (
          <SocialLinkCard
            key={link.id}
            link={link}
            onEdit={handleEditLink}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Add Link Button - Positioned under the links cards */}
      <div className="flex justify-center pt-4">
        <AddLinkButton
          onClick={() => setIsAddDropdownOpen(!isAddDropdownOpen)}
          isOpen={isAddDropdownOpen}
        />
      </div>

      {/* Add Link Dropdown - Positioned under the social links */}
      <AddLinkDropdown
        isOpen={isAddDropdownOpen}
        onClose={() => setIsAddDropdownOpen(false)}
        onAddLink={handleAddLink}
      />

      {/* Edit Link Dropdown - Positioned under the social links */}
      {editingLink && (
        <AddLinkDropdown
          isOpen={true}
          onClose={handleCancelEdit}
          onAddLink={handleUpdateLink}
          editingLink={editingLink}
        />
      )}
    </SectionWrapper>
  );
}
