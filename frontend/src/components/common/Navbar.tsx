import React, { useState } from 'react';
import { PageId } from '../../types';
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
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  datasetDate?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onSelectPage, datasetDate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageId; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <Activity className="w-4 h-4" /> },
    { id: 'batting', label: 'Batting Leaderboard', icon: <Award className="w-4 h-4 text-emerald-400" />, badge: 'Top 10' },
    { id: 'bowling', label: 'Bowling Leaderboard', icon: <Shield className="w-4 h-4 text-cyan-400" />, badge: 'Top 10' },
    { id: 'comparison', label: 'Player Comparison', icon: <GitCompare className="w-4 h-4 text-amber-400" /> },
    { id: 'explorer', label: 'Pressure Explorer', icon: <Layers className="w-4 h-4 text-rose-400" /> },
    { id: 'methodology', label: 'Methodology', icon: <BookOpen className="w-4 h-4 text-purple-400" /> },
  ];

  const handleNav = (id: PageId) => {
    onSelectPage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#080C14]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => handleNav('overview')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 via-emerald-600/30 to-blue-600/20 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover:border-emerald-400 transition-all">
              <Flame className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                  SupeRR <span className="text-emerald-400 font-extrabold">Selector</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                  Season 2
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Cricket Pressure Intelligence &middot; Rajasthan Royals
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all ${
                    active
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 text-[9px] font-semibold bg-slate-800 text-slate-300 rounded border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Status Badge */}
          <div className="hidden xl:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>IPL & T20I Validated</span>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B0F19] border-b border-slate-800 px-4 pt-3 pb-5 space-y-2">
          {navItems.map((item) => {
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium ${
                  active
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-300 rounded border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
