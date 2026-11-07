import React from 'react';
import { ActiveTab } from '../types';
import { LayoutDashboard, Sparkles, BookmarkCheck, BookOpen } from 'lucide-react';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  draftsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  draftsCount,
}) => {
  const tabs = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'create' as ActiveTab,
      label: 'Studio',
      icon: Sparkles,
      highlight: true,
    },
    {
      id: 'drafts' as ActiveTab,
      label: 'Drafts',
      icon: BookmarkCheck,
      badge: draftsCount > 0 ? draftsCount : undefined,
    },
    {
      id: 'playbook' as ActiveTab,
      label: 'Playbook',
      icon: BookOpen,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070c18]/95 backdrop-blur-lg border-t border-[#18284d] pb-safe">
      <div className="grid grid-cols-4 items-center h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center min-h-[48px] py-1 transition-all active:scale-90"
              aria-label={tab.label}
            >
              <div
                className={`relative flex items-center justify-center w-10 h-7 rounded-xl transition-all ${
                  isActive
                    ? 'text-amber-400 bg-amber-400/15'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold font-mono flex items-center justify-center shadow">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] tracking-tight mt-0.5 transition-colors whitespace-nowrap ${
                  isActive ? 'font-bold text-amber-400' : 'font-medium text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
