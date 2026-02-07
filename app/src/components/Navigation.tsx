import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, BookOpen, Menu, X, ChevronRight } from 'lucide-react';

const navLinks = [
  { path: '/', label: 'Home', icon: null },
  { path: '/understanding', label: 'Understanding', icon: BookOpen },
  { path: '/aamal-dua', label: 'Aamal & Dua', icon: null },
  { path: '/calendar', label: 'Calendar', icon: null },
  { path: '/education', label: 'Education', icon: null },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-4 mt-4">
          <div className="glass-card px-4 py-3 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <path
                    d="M20 5 C28 5, 34 12, 34 20 C34 28, 28 35, 20 35 C12 35, 6 28, 6 20 C6 12, 12 5, 20 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-[hsl(var(--primary))]"
                  />
                  <circle cx="20" cy="20" r="3" className="fill-[hsl(var(--primary))]" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-semibold tracking-wide">Shahr Ramadan</span>
                <span className="block text-xs text-muted-foreground">Digital Platform</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg ${location.pathname === link.path
                    ? 'text-[hsl(var(--primary))]'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-secondary rounded-lg"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-[hsl(var(--primary))]" />
                ) : (
                  <Moon className="w-5 h-5 text-[hsl(var(--primary))]" />
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-20 z-40 lg:hidden"
          >
            <div className="glass-card p-4 space-y-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${location.pathname === link.path
                      ? 'bg-secondary text-[hsl(var(--primary))]'
                      : 'hover:bg-secondary/50 text-muted-foreground'
                      }`}
                  >
                    <span className="font-medium">{link.label}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}