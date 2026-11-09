import React from 'react';
import { Draft, ActiveTab } from '../types';
import {
  Sparkles,
  BookmarkCheck,
  Share2,
  ArrowRight,
  Copy,
  ExternalLink,
  Flame,
  Check,
  TrendingUp,
  Layers,
  FileText,
} from 'lucide-react';
import { copyToClipboard, getPlatformPostText } from '../utils/api';
import { generateConsolidatedPdf } from '../utils/pdfGenerator';

interface DashboardViewProps {
  drafts: Draft[];
  setActiveTab: (tab: ActiveTab) => void;
  onSelectDraft: (draft: Draft) => void;
  onNewPost: () => void;
  onLoadSample: () => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  drafts,
  setActiveTab,
  onSelectDraft,
  onNewPost,
  onLoadSample,
  showToast,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleQuickCopy = async (e: React.MouseEvent, text: string, label: string, draftId: string) => {
    e.stopPropagation();
    if (!text) {
      showToast('info', `No ${label} content available in this draft.`);
      return;
    }
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedId(`${draftId}-${label}`);
      showToast('success', `Copied ${label} Post!`, 'Ready to paste into your social channel.');
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      showToast('error', 'Could not copy to clipboard.');
    }
  };

  const totalSavedDrafts = drafts.length;
  // 5 platforms x 3 versions per draft = 15 tailored assets per project
  const totalAssetsReady = drafts.length * 15;
  const recentDrafts = drafts.slice(0, 3);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-200">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#0c162d] via-[#091124] to-[#060a16] border border-amber-500/20 p-5 md:p-8 shadow-2xl shadow-black/60">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="tracking-wide uppercase">Elite Hustle Vault Central · Studio 2.0</span>
          </div>

          <h1 className="font-['Outfit'] text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Turn Any Blog Post Into High-Converting Multi-Platform Assets
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Generate factual, battle-tested promotional hooks across 5 platforms (LinkedIn, X, Threads, Instagram, and Facebook) with 3 specialized content versions and full 6-slide carousel scripts.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onNewPost}
              className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-500 rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 min-h-[44px]"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Launch Studio Generator</span>
            </button>

            <button
              onClick={onLoadSample}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-200 bg-[#101c36] hover:bg-[#18284d] border border-[#1e325c] rounded-xl transition-all active:scale-95 min-h-[44px]"
            >
              <span>Load Vault Blueprint Sample</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="p-4 rounded-2xl bg-[#0b1325] border border-[#18284d] space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Saved Drafts</span>
            <BookmarkCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-['Outfit'] text-2xl md:text-3xl font-extrabold text-white tabular-nums">
            {totalSavedDrafts}
          </div>
          <p className="text-[11px] text-slate-400">Stored in your private vault</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b1325] border border-[#18284d] space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Total Assets Ready</span>
            <Share2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="font-['Outfit'] text-2xl md:text-3xl font-extrabold text-white tabular-nums">
            {totalAssetsReady}
          </div>
          <p className="text-[11px] text-slate-400">5 platforms · 3 versions each</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b1325] border border-[#18284d] space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Multi-Platform</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-['Outfit'] text-2xl md:text-3xl font-extrabold text-white">
            5 Channels
          </div>
          <p className="text-[11px] text-slate-400">LI · X · Threads · IG · FB</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b1325] border border-[#18284d] space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Carousel Engine</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-['Outfit'] text-2xl md:text-3xl font-extrabold text-amber-400">
            6 Slides
          </div>
          <p className="text-[11px] text-slate-400">Visuals + transition hooks</p>
        </div>
      </div>

      {/* Recent Content Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-['Outfit'] text-lg md:text-xl font-bold text-white tracking-tight">
              Recent Content Projects
            </h2>
            <p className="text-xs text-slate-400">
              Quick access to your latest generated campaigns
            </p>
          </div>
          {drafts.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  try {
                    generateConsolidatedPdf(drafts);
                    showToast('success', 'PDF Generated!', `Exported all ${drafts.length} campaigns formatted for reading and print.`);
                  } catch (err: any) {
                    showToast('error', 'PDF Export Failed', err.message);
                  }
                }}
                title="Generate clean consolidated PDF document of all drafts"
                className="px-3 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-sm shadow-amber-500/20 min-h-[40px] flex items-center gap-1.5 active:scale-95"
              >
                <FileText className="w-3.5 h-3.5 text-slate-950" />
                <span className="hidden sm:inline">Download All (PDF)</span>
                <span className="sm:hidden">PDF</span>
              </button>

              <button
                onClick={() => setActiveTab('drafts')}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors min-h-[40px] px-2"
              >
                <span>View All ({drafts.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {recentDrafts.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#0b1325] border border-dashed border-[#18284d] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#101c36] text-amber-400 flex items-center justify-center mx-auto">
              <BookmarkCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white">No drafts saved yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Enter a blog URL or summary to generate promotional posts for LinkedIn, X, Threads, Instagram, and Facebook.
              </p>
            </div>
            <button
              onClick={onNewPost}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all min-h-[44px]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Your First Draft</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentDrafts.map((draft) => (
              <div
                key={draft.id}
                onClick={() => onSelectDraft(draft)}
                className="group cursor-pointer p-4 rounded-2xl bg-[#0b1325] hover:bg-[#0e1931] border border-[#18284d] hover:border-amber-500/30 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="capitalize text-amber-400/90 font-medium">
                      {draft.tone} tone
                    </span>
                    <span className="font-mono">
                      {new Date(draft.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-100 text-sm line-clamp-2 group-hover:text-amber-300 transition-colors">
                    {draft.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {draft.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#18284d]/60 space-y-2">
                  <div className="text-[10px] text-slate-400 uppercase font-medium tracking-wider flex items-center justify-between">
                    <span>Quick Copy (Ver A):</span>
                    <span className="text-[9px] text-amber-400/80 font-mono">5 Channels</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {/* LinkedIn */}
                    <button
                      onClick={(e) =>
                        handleQuickCopy(
                          e,
                          getPlatformPostText(draft.platforms?.linkedin, 'versionA'),
                          'LinkedIn',
                          draft.id
                        )
                      }
                      title="Copy LinkedIn Post"
                      className="px-1.5 py-2 text-[11px] font-semibold bg-[#101c36] hover:bg-amber-400 hover:text-slate-950 text-slate-300 rounded-lg transition-colors flex items-center justify-center gap-0.5 min-h-[44px] active:scale-95"
                    >
                      {copiedId === `${draft.id}-LinkedIn` ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>LI</span>
                    </button>

                    {/* X */}
                    <button
                      onClick={(e) =>
                        handleQuickCopy(
                          e,
                          getPlatformPostText(draft.platforms?.x, 'versionA'),
                          'X',
                          draft.id
                        )
                      }
                      title="Copy X / Twitter Post"
                      className="px-1.5 py-2 text-[11px] font-semibold bg-[#101c36] hover:bg-amber-400 hover:text-slate-950 text-slate-300 rounded-lg transition-colors flex items-center justify-center gap-0.5 min-h-[44px] active:scale-95"
                    >
                      {copiedId === `${draft.id}-X` ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>X</span>
                    </button>

                    {/* Threads */}
                    <button
                      onClick={(e) =>
                        handleQuickCopy(
                          e,
                          getPlatformPostText(draft.platforms?.threads, 'versionA'),
                          'Threads',
                          draft.id
                        )
                      }
                      title="Copy Threads Post"
                      className="px-1.5 py-2 text-[11px] font-semibold bg-[#101c36] hover:bg-amber-400 hover:text-slate-950 text-slate-300 rounded-lg transition-colors flex items-center justify-center gap-0.5 min-h-[44px] active:scale-95"
                    >
                      {copiedId === `${draft.id}-Threads` ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>TH</span>
                    </button>

                    {/* Instagram */}
                    <button
                      onClick={(e) =>
                        handleQuickCopy(
                          e,
                          getPlatformPostText(draft.platforms?.instagram, 'versionA'),
                          'Instagram',
                          draft.id
                        )
                      }
                      title="Copy Instagram Caption"
                      className="px-1.5 py-2 text-[11px] font-semibold bg-[#101c36] hover:bg-amber-400 hover:text-slate-950 text-slate-300 rounded-lg transition-colors flex items-center justify-center gap-0.5 min-h-[44px] active:scale-95"
                    >
                      {copiedId === `${draft.id}-Instagram` ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>IG</span>
                    </button>

                    {/* Facebook */}
                    <button
                      onClick={(e) =>
                        handleQuickCopy(
                          e,
                          getPlatformPostText(draft.platforms?.facebook, 'versionA'),
                          'Facebook',
                          draft.id
                        )
                      }
                      title="Copy Facebook Post"
                      className="px-1.5 py-2 text-[11px] font-semibold bg-[#101c36] hover:bg-amber-400 hover:text-slate-950 text-slate-300 rounded-lg transition-colors flex items-center justify-center gap-0.5 min-h-[44px] active:scale-95"
                    >
                      {copiedId === `${draft.id}-Facebook` ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>FB</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Elite Hustle Playbook Spotlight */}
      <div className="rounded-2xl bg-[#0b1325] border border-[#18284d] p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <ExternalLink className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-['Outfit'] font-bold text-white text-base">
                Vault Strategic Pillars: The 5-Platform Formula (v2.0)
              </h3>
              <p className="text-xs text-slate-400">
                How each generated post is optimized for conversion with zero hallucinated stats
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('playbook')}
            className="text-xs text-amber-400 font-medium hover:underline hidden sm:inline"
          >
            Read Playbook
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#070c18] border border-[#18284d]/80 space-y-1.5">
            <div className="font-bold text-amber-400">1. LinkedIn</div>
            <p className="text-slate-300">
              Thought-leadership hooks with line breaks and verified takeaways that maximize feed dwell time.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#070c18] border border-[#18284d]/80 space-y-1.5">
            <div className="font-bold text-amber-400">2. X (Twitter)</div>
            <p className="text-slate-300">
              High-tension &le;280-char hooks and punchy thread breakdowns designed for viral reposts.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#070c18] border border-[#18284d]/80 space-y-1.5">
            <div className="font-bold text-amber-400">3. Threads</div>
            <p className="text-slate-300">
              Conversational bite-sized insights (&le;500 char) designed to spark immediate comment debate.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#070c18] border border-[#18284d]/80 space-y-1.5">
            <div className="font-bold text-amber-400">4. Instagram</div>
            <p className="text-slate-300">
              Scroll-stopping captions plus full 6-slide carousel scripts with visual prompts and logical transition hooks.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#070c18] border border-[#18284d]/80 space-y-1.5">
            <div className="font-bold text-amber-400">5. Facebook</div>
            <p className="text-slate-300">
              Story-driven long-form copy with open conversational prompts driving group engagement and clicks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
