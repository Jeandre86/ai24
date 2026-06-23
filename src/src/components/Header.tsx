import React, { useState } from 'react';
import { Search, Menu, X, LogOut, Settings, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SearchModal } from './SearchModal';
import { LoginModal } from './LoginModal';
import { useAuthStore } from '../../store/authStore';
import { useAuth } from '../../hooks/useAuth';
import { useThemeStore } from '../../store/themeStore';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, profile } = useAuthStore();
  const { logout } = useAuth();
  const { theme, setTheme } = useThemeStore();

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Explore', path: '/explore' },
    { name: 'Mosaic Picks', path: '/picks' },
    { name: 'Community', path: '/community', requiresAuth: true },
    { name: 'Categories', path: '/categories', hidden: true },
    { name: 'Preferences', path: '/preferences', requiresAuth: true, hidden: true },
    { name: 'AI Jobs', path: '/jobs', requiresAuth: true, hidden: true },
    { name: 'Advertise', path: '/advertise', requiresAuth: true, hidden: true }
  ];

  const visibleNavLinks = navLinks.filter(link => (!link.requiresAuth || user) && !link.hidden);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-base/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
            <img
              src="/mos-top-logo.svg"
              alt="Mosaic Logo"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {visibleNavLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium relative group transition-colors ${
                    isActive
                      ? 'text-primary'
                      : 'text-secondary hover:text-primary'
                  }`}>
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Search"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 text-secondary hover:text-primary transition-colors rounded-full hover:bg-surface p-2 md:pl-3 md:pr-2 md:py-1.5 md:border md:border-border">
              <Search className="w-5 h-5 md:w-4 md:h-4" />
              <span className="hidden md:inline text-sm">Search</span>
              <kbd className="hidden md:inline text-[10px] font-sans px-1.5 py-0.5 rounded bg-base border border-border text-muted">
                ⌘K
              </kbd>
            </button>


            {/* Auth Actions */}
            {user ? (
              // Logged In: Profile Dropdown
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-10 h-10 rounded-full bg-accent hover:bg-accent/90 border-2 border-accent hover:border-accent/80 transition-colors flex items-center justify-center font-semibold text-white">
                  {profile?.displayName ? (
                    profile.displayName
                      .split(' ')
                      .slice(0, 2)
                      .map(n => n[0])
                      .join('')
                      .toUpperCase()
                  ) : (
                    'U'
                  )}
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-lg overflow-hidden z-50">
                      {/* Profile Info */}
                      <div className="p-4 border-b border-border">
                        <p className="font-semibold text-primary text-sm truncate">
                          {profile?.displayName}
                        </p>
                        <p className="text-xs text-secondary truncate">
                          {profile?.email}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-secondary hover:text-primary hover:bg-base transition-colors border-b border-border">
                        <Settings className="w-4 h-4" />
                        My Profile
                      </Link>

                      <Link
                        to="/preferences"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-secondary hover:text-primary hover:bg-base transition-colors">
                        <Settings className="w-4 h-4" />
                        Feed Preferences
                      </Link>

                      {/* Settings: Theme Toggle */}
                      <div className="border-t border-border">
                        <button
                          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-secondary hover:text-primary hover:bg-base transition-colors">
                          {theme === 'dark' ? (
                            <Sun className="w-4 h-4" />
                          ) : (
                            <Moon className="w-4 h-4" />
                          )}
                          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </button>
                      </div>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-secondary hover:text-red-500 hover:bg-base transition-colors border-t border-border">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // Logged Out: Login Button
              <button
                onClick={() => setIsLoginOpen(true)}
                className="hidden md:inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
                Sign In
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              aria-label="Toggle menu"
              className="md:hidden text-secondary hover:text-primary p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border bg-base">
              <nav className="flex flex-col px-4 py-4 gap-4">
                {visibleNavLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-base font-medium transition-colors ${
                        isActive ? 'text-primary' : 'text-secondary hover:text-primary'
                      }`}>
                      {link.name}
                    </Link>
                  );
                })}

                {!user && (
                  <>
                    <div className="h-px bg-border my-2" />
                    <button
                      onClick={() => {
                        setIsLoginOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-accent hover:bg-accent/90 text-white text-sm font-semibold px-4 py-3 rounded-full transition-colors">
                      Sign In
                    </button>
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
