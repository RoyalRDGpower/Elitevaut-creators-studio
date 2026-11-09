import React from 'react';
import { BookOpen, Sparkles, Copy, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { copyToClipboard } from '../utils/api';

interface PlaybookViewProps {
  onUseTemplate: (title: string, summary: string) => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const PlaybookView: React.FC<PlaybookViewProps> = ({ onUseTemplate, showToast }) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const hookFormulas = [
    {
      title: 'The Contrarian Truth Hook',
      category: 'High-Tension',
      example: 'The advice that "hard work beats smart work" is keeping you stuck in 60-hour weeks. Here is the asymmetric formula that actually creates wealth:',
      breakdown: 'Attacks a widespread sacred cow, then promises the proprietary alternative.',
    },
    {
      title: 'The Asymmetric Leverage Hook',
      category: 'Mindset & Systems',
      example: 'If your income stops the minute you step away from your keyboard, you own a demanding job, not a business. 5 assets that work while you sleep:',
      breakdown: 'Highlights hidden fragility and introduces compounding asset architecture.',
    },
    {
      title: 'The Transparent Numbers Hook',
      category: 'Authority & Proof',
      example: 'We analyzed 14 solo founders scaling past $25k/month with zero full-time staff. 82% of their revenue came from these 3 digital systems:',
      breakdown: 'Leverages specific data, curation, and quantifiable proof points.',
    },
    {
      title: 'The 3-Year Time-Horizon Hook',
      category: 'Storytelling',
      example: '3 years ago I was billing hourly and running out of daylight. Today, our automated vault drives 70% of inbound leads on autopilot. Here was the exact pivot:',
      breakdown: 'Before-and-after transformation with an immediate operational roadmap.',
    },
  ];

  const handleCopyFormula = async (text: string, idx: number) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedIndex(idx);
      showToast('success', 'Formula Copied to Clipboard!');
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Elite Hustle Vault Central</span>
        </div>
        <h1 className="font-['Outfit'] text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Social Growth Playbook & Swipe File
        </h1>
        <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
          Battle-tested hooks, algorithmic principles, and call-to-action blueprints designed to convert social impressions into loyal vault readers.
        </p>
      </div>

      {/* 5 Platform Optimization Cheat Sheet */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0b1325] border border-[#18284d] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-['Outfit'] font-bold text-white text-base">LinkedIn Mastery</span>
            <span className="text-xs font-mono text-sky-400 bg-sky-950/40 px-2 py-0.5 rounded border border-sky-500/20">Dwell-Time Engine</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <li>• <strong>Line Break Spacing:</strong> Never use 4-line blocks. Single sentences maximize mobile tap-to-expand.</li>
            <li>• <strong>First 2 Lines:</strong> The "...see more" cutoff happens at line 2. Your first 140 characters must deliver a cliffhanger.</li>
            <li>• <strong>Fact Integrity:</strong> Use verified facts and takeaways; avoid synthetic buzzwords and false guarantees.</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b1325] border border-[#18284d] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-['Outfit'] font-bold text-white text-base">X (Twitter) Virality</span>
            <span className="text-xs font-mono text-slate-300 bg-[#101c36] px-2 py-0.5 rounded border border-slate-700">Repost Momentum</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <li>• <strong>The Standalone Hook:</strong> Version C keeps strictly under 280 characters to allow direct one-tap reposting.</li>
            <li>• <strong>Thread Continuity:</strong> Tweet 1 hooks the reader, tweets 2–3 unpack tactics, and tweet 4 closes with the source link.</li>
            <li>• <strong>Zero Fluff:</strong> Strip filler phrases like "In today's fast-paced world" or "Unlock your potential".</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b1325] border border-[#18284d] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-['Outfit'] font-bold text-white text-base">Threads Discourse</span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">Replies & Opinion</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <li>• <strong>Conversational Brevity:</strong> Keep under 500 characters. Threads prioritizes reply threads over hashtag walls.</li>
            <li>• <strong>Contrarian Angle:</strong> Lead with an authentic founder observation or tension point to spark discussions.</li>
            <li>• <strong>Clean Formatting:</strong> 2 to 3 short paragraphs with an open-ended debate prompt.</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b1325] border border-[#18284d] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-['Outfit'] font-bold text-white text-base">Instagram 6-Slide Carousel</span>
            <span className="text-xs font-mono text-pink-400 bg-pink-950/40 px-2 py-0.5 rounded border border-pink-500/20">Save / Bookmark Focus</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <li>• <strong>Slide 1 Hook:</strong> High-intrigue cover title paired with a strong visual cue to stop infinite scrolling.</li>
            <li>• <strong>Slides 2–5 Flow:</strong> Progression from Problem &rarr; Root Cause &rarr; Solution &rarr; Practical Action Step.</li>
            <li>• <strong>Slide 6 Save CTA:</strong> Explicit call to bookmark and link in bio to read the full Vault Central guide.</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b1325] border border-[#18284d] space-y-3 md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="font-['Outfit'] font-bold text-white text-base">Facebook Communities</span>
            <span className="text-xs font-mono text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-500/20">Discussion Loops</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <li>• <strong>Personal Context:</strong> Frame the takeaway with "Why this matters to digital entrepreneurs".</li>
            <li>• <strong>High Engagement CTA:</strong> Invite founders to share their current system or bottleneck in the comments.</li>
            <li>• <strong>Native Link Embedding:</strong> Keep the source article URL visible and clear for direct click-throughs.</li>
          </ul>
        </div>
      </div>

      {/* Swipe File: Tested Opening Hook Templates */}
      <div className="space-y-4">
        <h2 className="font-['Outfit'] text-xl font-bold text-white tracking-tight">
          Swipe File: High-Retention Opening Hooks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hookFormulas.map((formula, idx) => (
            <div
              key={idx}
              className="p-4 md:p-5 rounded-2xl bg-[#0b1325] border border-[#18284d] space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-400">{formula.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono bg-[#101c36] px-2 py-0.5 rounded">
                    {formula.category}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-100 italic bg-[#070c18] p-3 rounded-xl border border-[#18284d] leading-relaxed">
                  "{formula.example}"
                </p>
                <p className="text-[11px] text-slate-400">
                  <strong>Why it converts:</strong> {formula.breakdown}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#18284d]/60">
                <button
                  onClick={() => handleCopyFormula(formula.example, idx)}
                  className="text-xs text-slate-300 hover:text-amber-400 flex items-center gap-1.5 transition-colors min-h-[36px]"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedIndex === idx ? 'Copied' : 'Copy Hook'}</span>
                </button>

                <button
                  onClick={() =>
                    onUseTemplate(
                      `Masterclass: ${formula.title}`,
                      `${formula.example}\n\nStrategic premise: ${formula.breakdown} Designed for ambitious solo operators building compounding digital assets.`
                    )
                  }
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors min-h-[38px] px-1"
                >
                  <span>Use in Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
