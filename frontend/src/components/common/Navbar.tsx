import React, { useState } from 'react';
import { PageId } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import {
  Flame,
  Activity,
  Award,
  Shield,
  Layers,
  BookOpen,
  GitCompare,
  Menu,
  X,
  Sun,
  Moon,
  Crown,
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  datasetDate?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onSelectPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navItems: { id: PageId; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <Activity className="w-4 h-4" /> },
    { id: 'batting', label: 'Batting Leaderboard', icon: <Award className="w-4 h-4 text-amber-300" />, badge: 'Top 10' },
    { id: 'bowling', label: 'Bowling Leaderboard', icon: <Shield className="w-4 h-4 text-pink-200" />, badge: 'Top 10' },
    { id: 'comparison', label: 'Player Comparison', icon: <GitCompare className="w-4 h-4 text-amber-300" /> },
    { id: 'explorer', label: 'Pressure Explorer', icon: <Layers className="w-4 h-4 text-purple-200" /> },
    { id: 'methodology', label: 'Methodology', icon: <BookOpen className="w-4 h-4 text-white" /> },
  ];

  const handleNav = (id: PageId) => {
    onSelectPage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#E5008A] via-[#C90079] to-[#650D73] dark:from-[#5A0A66] dark:via-[#42064C] dark:to-[#260C35] text-white shadow-royals-pink border-b border-white/15 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & Royals Identity */}
          <div
            onClick={() => handleNav('overview')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:bg-white/25 transition-all">
              <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 drop-shadow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl sm:text-2xl tracking-tight text-white drop-shadow-sm">
                  Supe<span className="text-amber-300">RR</span> Selector
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold tracking-wider bg-white/20 text-white border border-white/30 rounded-full uppercase">
                  Season 2
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-white/80 font-medium tracking-wide hidden sm:block">
                Cricket Pressure Intelligence &middot; Rajasthan Royals Official Challenge
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    active
                      ? 'bg-white text-[#650D73] shadow-md shadow-black/10'
                      : 'text-white/90 hover:text-white hover:bg-white/15'
                  }`}
                >
                  {React.cloneElement(item.icon as React.ReactElement, {
                    className: `w-4 h-4 ${active ? 'text-[#E5008A]' : 'text-white'}`,
                  })}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-[9px] font-extrabold rounded-full ${
                        active
                          ? 'bg-[#E5008A] text-white'
                          : 'bg-white/20 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Dark Mode Toggle & Live Badge */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-white/40"
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-white" />
              )}
            </button>

            {/* Match Status Badge */}
            <div className="hidden xl:flex items-center gap-2 text-xs font-semibold bg-white/15 border border-white/25 px-3.5 py-2 rounded-xl text-white backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>837 Matches &middot; 194K Balls</span>
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/20 bg-[#C90079] dark:bg-[#3A0844] px-4 pt-3 pb-4 space-y-1 animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-white text-[#650D73]'
                    : 'text-white hover:bg-white/15'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      active ? 'bg-[#E5008A] text-white' : 'bg-white/20 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
