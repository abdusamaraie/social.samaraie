import { useLocation } from 'react-router-dom';
import { ExitButton } from './header/ExitButton';
import { MenuButton } from './header/MenuButton';
import { ThemeButton } from './header/ThemeButton';
import { MobileMenuDropdown } from './header/MobileMenuDropdown';
import { ThemeToggleDropdown } from './header/ThemeToggleDropdown';
import { DesktopNavigation } from './header/DesktopNavigation';
import { useHeaderState } from '../hooks/useHeaderState';
import type { BackgroundType } from '../utils/contrastUtils';

interface HeaderProps {
  // For mobile navigation
  activeTab?: 'links' | 'profile' | 'preview' | 'themes';
  onTabChange?: (tab: 'links' | 'profile' | 'preview' | 'themes') => void;
  // For theme controls
  currentBackground?: string;
  onBackgroundChange?: (bg: BackgroundType) => void;
}

export function Header({ activeTab = 'links', onTabChange, onBackgroundChange }: HeaderProps) {
  const location = useLocation();
  const { state, actions } = useHeaderState();

  // Determine if we're on admin routes
  const isOnAdminRoute = location.pathname.startsWith('/dashboard') || location.pathname === '/login';

  return (
    <>
      {/* Header Container - Fixed with proper layout */}
      <header 
        className="fixed top-0 left-0 right-0 z-[200]"
        style={{
          background: 'transparent',
          zIndex: 200,
        }}
      >
        {/* Main Header Row */}
        <div className="h-20 md:h-24 px-4 md:px-6 flex items-center justify-between">
          {/* Left Side - Exit Button */}
          <div className="flex items-center">
            <ExitButton />
          </div>

          {/* Center - Desktop Navigation (hidden on mobile) */}
          {isOnAdminRoute && onTabChange && (
            <div className="hidden md:flex items-center">
              <DesktopNavigation 
                activeTab={activeTab}
                onTabChange={onTabChange}
              />
            </div>
          )}

          {/* Right Side - Theme Button and Mobile Menu */}
          <div className="flex items-center space-x-2">
            <ThemeButton 
              isOpen={state.isThemeOpen} 
              onClick={actions.toggleTheme} 
            />
            
            {/* Mobile Menu Button - Only show on mobile */}
            {onTabChange && (
              <div className="md:hidden">
                <MenuButton 
                  isOpen={state.isMenuOpen} 
                  onClick={actions.toggleMenu} 
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown - Only renders when open */}
      {onTabChange && (
        <MobileMenuDropdown
          isOpen={state.isMenuOpen}
          onClose={actions.closeMenu}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      )}

      {/* Theme Toggle Dropdown - Only renders when open */}
      <ThemeToggleDropdown
        isOpen={state.isThemeOpen}
        onClose={actions.closeTheme}
        onBackgroundChange={onBackgroundChange}
      />
    </>
  );
}