import React from 'react';
import { Crown, Heart, Github, Award, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 bg-[#260C35] text-white border-t border-[#673A70] py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-[#673A70]/60">
          {/* Brand Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E5008A] to-[#650D73] flex items-center justify-center text-white shadow-lg">
                <Crown className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight">
                  Supe<span className="text-[#E5008A]">RR</span> Selector
                </span>
                <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-[#E5008A]/20 text-[#FF4FAF] border border-[#FF4FAF]/30 rounded-full">
                  Season 2
                </span>
              </div>
            </div>
            <p className="text-xs text-[#C5B4CE] leading-relaxed max-w-sm">
              Official analytical intelligence system for Rajasthan Royals & Unstop Hackathon.
              Isolating true clutch performers from 194,014 ball-by-ball delivery records.
            </p>
          </div>

          {/* Direct Navigation */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Analytics Hub
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-[#C5B4CE]">
              <a href="#overview" className="hover:text-white hover:underline transition-colors">Overview</a>
              <a href="#batting" className="hover:text-white hover:underline transition-colors">Top 10 Batters</a>
              <a href="#bowling" className="hover:text-white hover:underline transition-colors">Top 10 Bowlers</a>
              <a href="#comparison" className="hover:text-white hover:underline transition-colors">H2H Comparison</a>
              <a href="#explorer" className="hover:text-white hover:underline transition-colors">Pressure Explorer</a>
              <a href="#methodology" className="hover:text-white hover:underline transition-colors">Methodology Report</a>
            </div>
          </div>

          {/* Submission Info & Tech */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Engineering & Validation
            </h4>
            <p className="text-xs text-[#C5B4CE] leading-relaxed">
              Built with Python, React 19, TypeScript, and Tailwind CSS.
              39/39 Pytest verification suite passed with zero data leakage.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs text-white border border-white/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Vercel Edge Deployed
              </span>
              <a
                href="https://github.com/Pranavgaikwad007/superrr-selector"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#FF4FAF] hover:text-white transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repo</span>
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#C5B4CE]/80 gap-3">
          <p>
            &copy; {new Date().getFullYear()} SupeRR Selector Season 2 &middot; Developed by{' '}
            <span className="text-white font-semibold">Pranav Gaikwad</span> for Rajasthan Royals
          </p>
          <p className="flex items-center gap-1">
            Official Challenge Round 1 Submission &middot; Unstop
          </p>
        </div>
      </div>
    </footer>
  );
};
