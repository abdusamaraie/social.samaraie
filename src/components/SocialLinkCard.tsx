import { motion } from 'motion/react';
import { Button } from './ui/button';
import { SocialLink } from '../pages/AdminDashboard';

interface SocialLinkCardProps {
  link: SocialLink;
  onEdit?: (link: SocialLink) => void;
  onDelete?: (link: SocialLink) => void;
}

export function SocialLinkCard({ link, onEdit, onDelete }: SocialLinkCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl group relative z-10"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Link Info */}
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${link.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
            <span className="text-xl">{link.icon}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-white font-medium truncate">{link.title}</h4>
            <p className="text-white/70 text-sm truncate">{link.url}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(link)}
            className="w-8 h-8 p-0 border-white/30 text-white hover:bg-white/10 hover:text-white/90 active:bg-white/20 active:text-white/80 !text-white hover:!text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete?.(link)}
            className="w-8 h-8 p-0 border-red-400/50 text-red-300 hover:bg-red-500/20 hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6"/>
              <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
