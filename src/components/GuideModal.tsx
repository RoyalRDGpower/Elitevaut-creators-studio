import React from 'react';
import { X, ShieldCheck, Terminal, Globe, Server, CheckCircle2 } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-3xl bg-[#0b1325] border border-amber-500/30 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#18284d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="font-['Outfit'] font-bold text-white text-lg md:text-xl">
                Elite Hustle Content Studio Guide
              </h2>
              <p className="text-xs text-amber-400 font-medium">
                Architecture, Local Execution & Publishing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#101c36] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Security & Architecture */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Server className="w-4 h-4 text-amber-400" />
            <span>1. Zero-Exposure API Security Architecture</span>
          </div>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed bg-[#070c18] p-4 rounded-xl border border-[#18284d]">
            In strict compliance with modern security standards, your <strong>GEMINI_API_KEY</strong> is never sent or exposed to client browser code. All generation requests route through our secure full-stack backend endpoint (<code className="text-amber-400 font-mono">/api/generate-content</code>), and drafts are safely persisted in server storage and synchronized with local cache.
          </p>
        </div>

        {/* Section 2: How to Run Locally */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>2. How to Run the App Locally</span>
          </div>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-[#070c18] border border-[#18284d] font-mono space-y-1">
              <div className="text-slate-400"># 1. Install dependencies</div>
              <div className="text-amber-300">npm install</div>
              <div className="text-slate-400 pt-1"># 2. Configure environment variable</div>
              <div className="text-slate-300">GEMINI_API_KEY=your_key_here (in .env or Secrets panel)</div>
              <div className="text-slate-400 pt-1"># 3. Start development server</div>
              <div className="text-amber-300">npm run dev</div>
            </div>
            <p className="text-[11px] text-slate-400">
              The application will run on <span className="text-slate-200 font-mono">http://localhost:3000</span> with hot full-stack reloading.
            </p>
          </div>
        </div>

        {/* Section 3: How to Build & Publish */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Globe className="w-4 h-4 text-amber-400" />
            <span>3. How to Build & Deploy to Production</span>
          </div>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-[#070c18] border border-[#18284d] font-mono space-y-1">
              <div className="text-slate-400"># 1. Build production client bundle</div>
              <div className="text-amber-300">npm run build</div>
              <div className="text-slate-400 pt-1"># 2. Start full-stack Node server</div>
              <div className="text-amber-300">npm start</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div className="p-3 rounded-xl bg-[#070c18] border border-[#18284d]">
                <strong className="text-white block mb-0.5">Google Cloud Run / AI Studio</strong>
                <span className="text-slate-400 text-[11px]">
                  Configured automatically with port 3000 binding and injected environment secrets.
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#070c18] border border-[#18284d]">
                <strong className="text-white block mb-0.5">Vercel / Render / Docker</strong>
                <span className="text-slate-400 text-[11px]">
                  Use Node.js runtime with `npm run build` and `npm start`.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-[#18284d]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md shadow-amber-500/20"
          >
            Got it, Let's Build
          </button>
        </div>
      </div>
    </div>
  );
};
