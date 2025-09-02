import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

interface NotificationToastProps {
  message: string;
  type: 'success' | 'error';
  show: boolean;
  onClose: () => void;
}

export function NotificationToast({ message, type, show, onClose }: NotificationToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-6 right-6 z-50 max-w-sm"
        >
          <div
            className={`backdrop-blur-xl border rounded-2xl p-4 shadow-2xl ${
              type === 'success'
                ? 'bg-green-500/20 border-green-400/30'
                : 'bg-red-500/20 border-red-400/30'
            }`}
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">
                {type === 'success' ? '✅' : '❌'}
              </span>
              <span className="text-white text-sm font-medium">
                {message}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}