import React from 'react';
import { ActiveTab } from '../types';
import { ShieldCheck, PlusCircle, HelpCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  draftsCount: number;
  onOpenGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  draftsCount,
  onOpenGuide,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#070c18]/90 backdrop-blur-md border-b border-[#18284d] px-4 md:px-8 py-3.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-bold shrink-0">
            <ShieldCheck className="w-5 h-5 text-slate-950" />
          </div>
          <div className="flex flex-col">
            <span className="font-['Outfit'] text-base md:text-lg font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors whitespace-nowrap">
              Elite Hustle <span className="text-amber-400 font-extrabold">Studio</span>
            </span>
            <span className="text-[10px] tracking-wider uppercase text-amber-500/80 font-medium -mt-1 hidden sm:inline">
              Vault Central
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (hidden on small mobile, visible on tablet/desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`whitespace-nowrap transition-colors hover:text-amber-400 ${
              activeTab === 'dashboard' ? 'text-amber-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`whitespace-nowrap transition-colors hover:text-amber-400 ${
              activeTab === 'create' ? 'text-amber-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Create Post
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`whitespace-nowrap transition-colors hover:text-amber-400 flex items-center gap-1.5 ${
              activeTab === 'drafts' ? 'text-amber-400 font-semibold' : 'text-slate-300'
            }`}
          >
            <span>Saved Drafts</span>
            {draftsCount > 0 && (
              <span className="text-[11px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded-full font-mono">
                {draftsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('playbook')}
            className={`whitespace-nowrap transition-colors hover:text-amber-400 ${
              activeTab === 'playbook' ? 'text-amber-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Vault Playbook
          </button>
        </nav>

        {/* Zone 3: Primary Action & Guide */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenGuide}
            title="App & Deployment Guide"
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-[#101c36] text-slate-300 hover:text-amber-400 hover:bg-[#18284d] border border-[#18284d] transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-semibold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-500 rounded-xl shadow-md shadow-amber-500/20 transition-all active:scale-95 whitespace-nowrap min-h-[40px]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Post</span>
          </button>
        </div>
      </div>
    </header>
  );
};
