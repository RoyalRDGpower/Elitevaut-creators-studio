import React, { useState, useEffect } from 'react';
import {
  PlatformsData,
  ToneType,
  FocusAngleType,
  PlatformKey,
  Draft,
} from '../types';
import {
  Sparkles,
  Link2,
  FileText,
  Copy,
  Check,
  Save,
  RefreshCw,
  Edit3,
  CheckCircle2,
  Layers,
  Download,
  AlertCircle,
  Hash,
  ExternalLink,
  Sliders,
  ChevronRight,
  MessageSquare,
  Users,
  RotateCcw,
} from 'lucide-react';
import { extractUrlData, generateSocialContent, saveDraft, copyToClipboard } from '../utils/api';

interface GeneratorViewProps {
  initialTitle?: string;
  initialSummary?: string;
  initialUrl?: string;
  onDraftSaved: (draft: Draft) => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const GeneratorView: React.FC<GeneratorViewProps> = ({
  initialTitle = '',
  initialSummary = '',
  initialUrl = '',
  onDraftSaved,
  showToast,
}) => {
  // Input States
  const [url, setUrl] = useState(initialUrl);
  const [title, setTitle] = useState(initialTitle);
  const [summary, setSummary] = useState(initialSummary);
  const [tone, setTone] = useState<ToneType>('authoritative');
  const [focusAngle, setFocusAngle] = useState<FocusAngleType>('actionable');
  const [targetAudience, setTargetAudience] = useState('Solo Founders & Digital Builders');

  // Update when initial props change
  useEffect(() => {
    if (initialTitle) setTitle(initialTitle);
    if (initialSummary) setSummary(initialSummary);
    if (initialUrl) setUrl(initialUrl);
  }, [initialTitle, initialSummary, initialUrl]);

  // Async States
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generated Result States
  const [generatedPlatforms, setGeneratedPlatforms] = useState<PlatformsData | null>(null);
  const [activePlatform, setActivePlatform] = useState<PlatformKey>('linkedin');
  const [activeViewMode, setActiveViewMode] = useState<'formatted' | 'structured'>('formatted');
  const [isEditing, setIsEditing] = useState(false);
  const [editableFullPost, setEditableFullPost] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSavedCurrent, setHasSavedCurrent] = useState(false);

  // Clear Form
  const handleClearForm = () => {
    setUrl('');
    setTitle('');
    setSummary('');
    setGeneratedPlatforms(null);
    setErrorMessage(null);
    setHasSavedCurrent(false);
    showToast('info', 'Form Cleared', 'Ready for new article content.');
  };

  // Sample Article Loader
  const handleLoadSample = () => {
    setUrl('https://elitehustlevaultcentral.com/blog/asymmetric-digital-leverage');
    setTitle('The Asymmetric Leverage Formula: How to 10x Output Without Hiring');
    setSummary('A systematic operational breakdown of how solopreneurs replace traditional 40-hour work weeks with automated knowledge vaults, AI micro-tools, and high-margin productized systems. Covers pricing transformation, asset compounding, and eliminating client drag.');
    setTone('authoritative');
    setFocusAngle('actionable');
    setTargetAudience('Solo Founders & Digital Builders');
    setErrorMessage(null);
    showToast('info', 'Vault Blueprint Sample Loaded', 'Click "Generate Social Drafts" to create your multi-platform assets.');
  };

  // URL Auto-extraction
  const handleExtractUrl = async () => {
    if (!url.trim()) {
      showToast('error', 'Please enter a URL first');
      return;
    }
    setIsExtracting(true);
    setErrorMessage(null);
    try {
      const data = await extractUrlData(url.trim());
      if (data.title) setTitle(data.title);
      if (data.summary) setSummary(data.summary);
      showToast('success', 'Article Metadata Extracted', 'Title and summary populated successfully.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not extract article content. You can manually enter the title and summary.');
      showToast('error', 'Extraction Notice', 'You can type or paste the title and summary directly.');
    } finally {
      setIsExtracting(false);
    }
  };

  // Content Generation
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please enter an article title.');
      return;
    }
    if (!summary.trim()) {
      setErrorMessage('Please enter an article summary or key insights.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setHasSavedCurrent(false);

    setGenerationStep('Analyzing core article thesis & audience hooks...');
    const stepTimer1 = setTimeout(() => {
      setGenerationStep('Engineering platform-specific narratives (FB, IG, LI, X)...');
    }, 1200);
    const stepTimer2 = setTimeout(() => {
      setGenerationStep('Generating high-retention carousels, threads & hashtags...');
    }, 2400);

    try {
      const result = await generateSocialContent({
        title: title.trim(),
        summary: summary.trim(),
        url: url.trim(),
        tone,
        focusAngle,
        targetAudience,
      });

      setGeneratedPlatforms(result);
      setEditableFullPost(result[activePlatform]?.fullPost || '');
      setIsEditing(false);
      showToast('success', 'Content Generated Successfully!', 'Your 4-platform promotional drafts are ready below.');
      
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error generating content. Please retry.');
      showToast('error', 'Generation Error', err.message);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Platform Tab Switch
  const handlePlatformChange = (p: PlatformKey) => {
    // If currently editing, commit edits for active platform before switching
    if (isEditing && generatedPlatforms) {
      handleSaveInlineEdit();
    }
    setActivePlatform(p);
    if (generatedPlatforms) {
      setEditableFullPost(generatedPlatforms[p]?.fullPost || '');
    }
    setIsEditing(false);
  };

  // Update text from inline edit
  const handleSaveInlineEdit = () => {
    if (!generatedPlatforms) return;
    const updated: PlatformsData = { ...generatedPlatforms };
    if (activePlatform === 'facebook') {
      updated.facebook = { ...updated.facebook, fullPost: editableFullPost };
    } else if (activePlatform === 'instagram') {
      updated.instagram = { ...updated.instagram, fullPost: editableFullPost };
    } else if (activePlatform === 'linkedin') {
      updated.linkedin = { ...updated.linkedin, fullPost: editableFullPost };
    } else if (activePlatform === 'x') {
      updated.x = { ...updated.x, fullPost: editableFullPost };
    }
    setGeneratedPlatforms(updated);
    setIsEditing(false);
    showToast('info', 'Draft Updated', `Your edits for ${activePlatform.toUpperCase()} are saved.`);
  };

  // Single Platform Copy
  const handleCopyPlatform = async (pKey: PlatformKey) => {
    if (!generatedPlatforms) return;
    const textToCopy = isEditing && activePlatform === pKey ? editableFullPost : (generatedPlatforms[pKey]?.fullPost || '');
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopiedKey(pKey);
      showToast('success', `Copied ${pKey.toUpperCase()} Post!`, 'Ready to paste into your social app.');
      setTimeout(() => setCopiedKey(null), 2000);
    } else {
      showToast('error', 'Failed to copy to clipboard.');
    }
  };

  // Copy All 4 Platforms to Clipboard
  const handleCopyAll = async () => {
    if (!generatedPlatforms) return;
    const combined = `=== ELITE HUSTLE VAULT CENTRAL CONTENT PACK ===\nTitle: ${title}\nArticle URL: ${url || 'N/A'}\n\n` +
      `--- [ LINKEDIN POST ] ---\n${generatedPlatforms.linkedin?.fullPost || ''}\n\n` +
      `--- [ X (TWITTER) POST & THREAD ] ---\n${generatedPlatforms.x?.fullPost || ''}\n\n` +
      `--- [ INSTAGRAM CAPTION & CAROUSEL ] ---\n${generatedPlatforms.instagram?.fullPost || ''}\n\n` +
      `--- [ FACEBOOK POST ] ---\n${generatedPlatforms.facebook?.fullPost || ''}\n`;

    const success = await copyToClipboard(combined);
    if (success) {
      setCopiedKey('all');
      showToast('success', 'All 4 Channels Copied!', 'Complete campaign package copied to clipboard.');
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  // Save to Drafts Vault (Commits any active inline edits first)
  const handleSaveDraft = async () => {
    if (!generatedPlatforms) return;
    setIsSaving(true);
    try {
      // Ensure any uncommitted inline edits are included
      let platformsToSave = generatedPlatforms;
      if (isEditing) {
        platformsToSave = { ...generatedPlatforms };
        if (activePlatform === 'facebook') {
          platformsToSave.facebook = { ...platformsToSave.facebook, fullPost: editableFullPost };
        } else if (activePlatform === 'instagram') {
          platformsToSave.instagram = { ...platformsToSave.instagram, fullPost: editableFullPost };
        } else if (activePlatform === 'linkedin') {
          platformsToSave.linkedin = { ...platformsToSave.linkedin, fullPost: editableFullPost };
        } else if (activePlatform === 'x') {
          platformsToSave.x = { ...platformsToSave.x, fullPost: editableFullPost };
        }
        setGeneratedPlatforms(platformsToSave);
        setIsEditing(false);
      }

      const saved = await saveDraft({
        title: title.trim(),
        summary: summary.trim(),
        url: url.trim(),
        tone,
        focusAngle,
        platforms: platformsToSave,
      });
      setHasSavedCurrent(true);
      onDraftSaved(saved);
      showToast('success', 'Draft Saved to Vault Central!', 'You can review, edit, or copy this anytime in Saved Drafts.');
    } catch (err: any) {
      showToast('error', 'Save Failed', 'Could not save draft to storage.');
    } finally {
      setIsSaving(false);
    }
  };

  // Export as text file download
  const handleDownloadText = () => {
    if (!generatedPlatforms) return;
    const textContent = `ELITE HUSTLE CONTENT STUDIO - VAULT CAMPAIGN\n` +
      `Title: ${title}\n` +
      `URL: ${url || 'N/A'}\nTone: ${tone} | Focus: ${focusAngle}\n` +
      `Generated: ${new Date().toLocaleString()}\n` +
      `==================================================\n\n` +
      `1. LINKEDIN DRAFT\n-----------------\n${generatedPlatforms.linkedin?.fullPost || ''}\n\n` +
      `2. X (TWITTER) DRAFT\n--------------------\n${generatedPlatforms.x?.fullPost || ''}\n\n` +
      `3. INSTAGRAM DRAFT\n-------------------\n${generatedPlatforms.instagram?.fullPost || ''}\n\n` +
      `4. FACEBOOK DRAFT\n------------------\n${generatedPlatforms.facebook?.fullPost || ''}\n`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${title.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_social_pack.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
    showToast('info', 'File Downloaded', 'Saved as plain text file.');
  };

  const platformsMeta = [
    { key: 'linkedin' as PlatformKey, label: 'LinkedIn', icon: 'LI', color: 'text-sky-400' },
    { key: 'x' as PlatformKey, label: 'X (Twitter)', icon: 'X', color: 'text-slate-100' },
    { key: 'instagram' as PlatformKey, label: 'Instagram', icon: 'IG', color: 'text-pink-400' },
    { key: 'facebook' as PlatformKey, label: 'Facebook', icon: 'FB', color: 'text-blue-400' },
  ];

  const currentPostLength = isEditing
    ? editableFullPost.length
    : (generatedPlatforms?.[activePlatform]?.fullPost?.length || 0);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-200">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-['Outfit'] text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Social Content Studio
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Feed in a blog article to generate high-performing hooks, carousels, and promotional posts.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {(title || summary || url) && (
            <button
              type="button"
              onClick={handleClearForm}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-[#101c36] hover:bg-[#18284d] border border-[#18284d] rounded-xl transition-all min-h-[40px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleLoadSample}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all active:scale-95 min-h-[40px]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Sample</span>
          </button>
        </div>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 flex items-start gap-3 text-xs md:text-sm">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Notice</p>
            <p className="mt-0.5 text-rose-300">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-rose-100 p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input Form Card */}
      <form onSubmit={handleGenerate} className="p-5 md:p-7 rounded-2xl md:rounded-3xl bg-[#0b1325] border border-[#18284d] space-y-5 shadow-xl shadow-black/40">
        <div className="flex items-center gap-2 pb-3 border-b border-[#18284d] text-xs font-semibold text-amber-400 uppercase tracking-wider">
          <FileText className="w-4 h-4 text-amber-400" />
          <span>1. Blog Article Input</span>
        </div>

        {/* URL Input with Auto-extract */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-200">
            Blog Article URL <span className="text-slate-400 font-normal">(Optional but recommended)</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Link2 className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://elitehustlevaultcentral.com/blog/article-name"
                className="w-full pl-10 pr-4 py-3 bg-[#070c18] border border-[#18284d] focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-sm text-slate-100 placeholder-slate-500 transition-colors"
              />
            </div>
            <button
              type="button"
              onClick={handleExtractUrl}
              disabled={isExtracting || !url.trim()}
              className="px-4 py-3 bg-[#101c36] hover:bg-[#18284d] disabled:opacity-50 text-slate-200 hover:text-amber-300 border border-[#1e325c] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shrink-0 min-h-[44px]"
            >
              {isExtracting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>Fetching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Auto-Fill from URL</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Title Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-slate-200">
              Article Title <span className="text-amber-400">*</span>
            </label>
            <span className="text-slate-400 text-[11px] font-mono">{title.length} chars</span>
          </div>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. The 5 Core Revenue Streams of High-Performing Solo Operators"
            className="w-full px-4 py-3 bg-[#070c18] border border-[#18284d] focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-sm md:text-base font-medium text-slate-100 placeholder-slate-500 transition-colors"
          />
        </div>

        {/* Summary / Core Insights */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-slate-200">
              Article Summary & Key Insights <span className="text-amber-400">*</span>
            </label>
            <span className="text-slate-400 text-[11px] font-mono">{summary.length} chars</span>
          </div>
          <textarea
            required
            rows={4}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Paste the core thesis, key takeaways, or excerpt. The more specific the insights, the higher-converting the hooks will be."
            className="w-full px-4 py-3 bg-[#070c18] border border-[#18284d] focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-sm text-slate-100 placeholder-slate-500 transition-colors leading-relaxed resize-y"
          />
        </div>

        {/* Strategy, Tone & Target Audience */}
        <div className="pt-2 border-t border-[#18284d] space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>2. Strategic Voice & Positioning</span>
          </div>

          {/* Target Audience Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Target Audience Segment</span>
              </label>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Solo Founders & Digital Builders',
                'Side Hustlers & Aspiring Creators',
                'High-Ticket Consultants & Coaches',
                'Enterprise Operators & Executives',
              ].map((aud) => (
                <button
                  key={aud}
                  type="button"
                  onClick={() => setTargetAudience(aud)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors min-h-[36px] ${
                    targetAudience === aud
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                      : 'bg-[#070c18] text-slate-300 hover:text-white border border-[#18284d]'
                  }`}
                >
                  {aud}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tone Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                Brand Voice Tone
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'authoritative' as ToneType, label: 'Authoritative', desc: 'Direct thought leader' },
                  { id: 'conversational' as ToneType, label: 'Conversational', desc: 'Authentic founder story' },
                  { id: 'high-energy' as ToneType, label: 'High-Energy', desc: 'Urgent & motivating' },
                  { id: 'executive' as ToneType, label: 'Executive', desc: 'Strategic & leverage' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTone(item.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all min-h-[48px] ${
                      tone === item.id
                        ? 'bg-amber-400/15 border-amber-400 text-white font-medium shadow-sm shadow-amber-500/10'
                        : 'bg-[#070c18] border-[#18284d] text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Focus Angle Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                Promotional Angle
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'actionable' as FocusAngleType, label: 'Actionable Steps', desc: 'Tactical execution' },
                  { id: 'contrarian' as FocusAngleType, label: 'Contrarian Truth', desc: 'Challenges status quo' },
                  { id: 'case-study' as FocusAngleType, label: 'Case Study', desc: 'Results & metrics' },
                  { id: 'growth' as FocusAngleType, label: 'Mindset / Scaling', desc: 'High leverage' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFocusAngle(item.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all min-h-[48px] ${
                      focusAngle === item.id
                        ? 'bg-amber-400/15 border-amber-400 text-white font-medium shadow-sm shadow-amber-500/10'
                        : 'bg-[#070c18] border-[#18284d] text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button with Stepped Progress */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isGenerating || !title.trim() || !summary.trim()}
            className="w-full py-4 px-6 rounded-xl md:rounded-2xl font-['Outfit'] text-base md:text-lg font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-500 shadow-xl shadow-amber-500/25 disabled:opacity-50 transition-all flex items-center justify-center gap-3 active:scale-[0.99] min-h-[52px]"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-slate-950" />
                <span>Generating Promotional Content...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>Generate Social Media Drafts</span>
              </>
            )}
          </button>

          {isGenerating && generationStep && (
            <div className="mt-3 p-3.5 rounded-xl bg-[#070c18] border border-amber-500/30 flex items-center gap-3 text-xs text-amber-300 animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin shrink-0 text-amber-400" />
              <span>{generationStep}</span>
            </div>
          )}
        </div>
      </form>

      {/* Generated Results Section */}
      {generatedPlatforms && (
        <div id="results-section" className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#18284d]">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Generated Social Media Campaign</span>
              </div>
              <h2 className="font-['Outfit'] text-xl font-bold text-white mt-0.5">
                Review & Publish Drafts
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyAll}
                className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-[#101c36] hover:bg-[#18284d] border border-[#1e325c] rounded-xl flex items-center gap-1.5 transition-all min-h-[44px]"
              >
                {copiedKey === 'all' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>Copy All 4 Channels</span>
              </button>

              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSaving || hasSavedCurrent}
                className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all min-h-[44px] ${
                  hasSavedCurrent
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95'
                }`}
              >
                {hasSavedCurrent ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Saved to Vault</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Platform Tab Switcher */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 p-1.5 bg-[#0b1325] border border-[#18284d] rounded-2xl">
            {platformsMeta.map((p) => {
              const isSelected = activePlatform === p.key;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => handlePlatformChange(p.key)}
                  className={`py-2.5 px-2 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center justify-center gap-2 min-h-[44px] ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-[#101c36]'
                  }`}
                >
                  <span className={`font-mono text-xs ${isSelected ? 'text-slate-950 font-bold' : p.color}`}>
                    [{p.icon}]
                  </span>
                  <span className="hidden sm:inline">{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Platform Card */}
          <div className="p-5 md:p-6 rounded-2xl bg-[#0b1325] border border-[#18284d] space-y-4 shadow-xl shadow-black/40">
            {/* Platform Sub-Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#18284d]">
              <div className="flex items-center gap-2">
                <span className="font-['Outfit'] text-base md:text-lg font-bold text-white capitalize">
                  {activePlatform === 'x' ? 'X (Twitter)' : activePlatform} Draft
                </span>
                <span
                  className={`text-xs font-mono px-2 py-0.5 rounded ${
                    activePlatform === 'x'
                      ? currentPostLength <= 280
                        ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
                        : 'text-amber-400 bg-amber-950/40 border border-amber-500/30'
                      : 'text-slate-400 bg-[#070c18]'
                  }`}
                >
                  {activePlatform === 'x'
                    ? `${currentPostLength} / 280 chars`
                    : `${currentPostLength} chars`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex items-center p-1 bg-[#070c18] border border-[#18284d] rounded-lg">
                  <button
                    type="button"
                    onClick={() => setActiveViewMode('formatted')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors min-h-[32px] ${
                      activeViewMode === 'formatted'
                        ? 'bg-[#101c36] text-amber-400 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Full Post
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveViewMode('structured')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors min-h-[32px] ${
                      activeViewMode === 'structured'
                        ? 'bg-[#101c36] text-amber-400 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Breakdown
                  </button>
                </div>

                {/* Edit Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    if (isEditing) {
                      handleSaveInlineEdit();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border flex items-center gap-1.5 transition-colors min-h-[36px] ${
                    isEditing
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 font-semibold'
                      : 'bg-[#101c36] text-slate-300 border-[#1e325c] hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Save Text' : 'Edit'}</span>
                </button>

                {/* Copy Button */}
                <button
                  type="button"
                  onClick={() => handleCopyPlatform(activePlatform)}
                  className="px-3.5 py-1.5 text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-lg flex items-center gap-1.5 shadow-sm transition-all active:scale-95 min-h-[36px]"
                >
                  {copiedKey === activePlatform ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-slate-950" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-950" />
                      <span>Copy {activePlatform.toUpperCase()}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Content Display: Full Formatted or Structured */}
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-amber-300">
                  <span className="font-semibold">Inline Editor: Customize copy directly</span>
                  <span className="font-mono text-slate-400">{editableFullPost.length} chars</span>
                </div>
                <textarea
                  rows={10}
                  value={editableFullPost}
                  onChange={(e) => setEditableFullPost(e.target.value)}
                  className="w-full p-4 bg-[#070c18] border border-amber-500/40 focus:border-amber-400 rounded-xl text-sm text-slate-100 font-sans leading-relaxed resize-y"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditableFullPost(generatedPlatforms[activePlatform]?.fullPost || '');
                      setIsEditing(false);
                    }}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveInlineEdit}
                    className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm"
                  >
                    Confirm Edits
                  </button>
                </div>
              </div>
            ) : activeViewMode === 'formatted' ? (
              <div className="space-y-3">
                <div className="p-4 md:p-5 rounded-xl bg-[#070c18] border border-[#18284d] text-sm md:text-base text-slate-100 whitespace-pre-wrap leading-relaxed select-text font-sans">
                  {generatedPlatforms[activePlatform]?.fullPost}
                </div>

                {/* Instagram Carousel Slide Cards */}
                {activePlatform === 'instagram' && generatedPlatforms.instagram?.carouselSlides && (
                  <div className="p-4 rounded-xl bg-[#0c162d] border border-amber-500/20 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span>Carousel Slide Breakdown ({generatedPlatforms.instagram.carouselSlides.length} Slides)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {generatedPlatforms.instagram.carouselSlides.map((slide, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-[#070c18] border border-[#18284d] text-slate-300 space-y-1">
                          <span className="text-[10px] font-bold text-amber-400 font-mono">Slide {idx + 1}</span>
                          <p>{slide}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* X Thread Breakdown Cards */}
                {activePlatform === 'x' && generatedPlatforms.x?.threadTweets && generatedPlatforms.x.threadTweets.length > 0 && (
                  <div className="p-4 rounded-xl bg-[#0c162d] border border-amber-500/20 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                      <MessageSquare className="w-4 h-4 text-amber-400" />
                      <span>Optional Thread Breakdown ({generatedPlatforms.x.threadTweets.length} Tweets)</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      {generatedPlatforms.x.threadTweets.map((tweet, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-[#070c18] border border-[#18284d] text-slate-300 space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-amber-400 font-mono">
                            <span>Tweet {idx + 1}</span>
                            <span>{tweet.length} / 280</span>
                          </div>
                          <p className="whitespace-pre-wrap">{tweet}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Structured Breakdown Mode */
              <div className="space-y-3.5">
                {/* 1. Hook */}
                <div className="p-3.5 rounded-xl bg-[#070c18] border border-[#18284d] space-y-1">
                  <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
                    <span>1. Opening Hook (First 3 Seconds)</span>
                    <button
                      type="button"
                      onClick={async () => {
                        await copyToClipboard(generatedPlatforms[activePlatform]?.hook || '');
                        showToast('info', 'Hook Copied');
                      }}
                      className="text-slate-400 hover:text-white p-1"
                      title="Copy Hook"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-sm font-medium text-white italic">
                    "{generatedPlatforms[activePlatform]?.hook}"
                  </p>
                </div>

                {/* 2. Core Body */}
                <div className="p-3.5 rounded-xl bg-[#070c18] border border-[#18284d] space-y-1">
                  <div className="text-xs text-amber-400 font-semibold">
                    <span>2. Narrative Body</span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {generatedPlatforms[activePlatform]?.body}
                  </p>
                </div>

                {/* 3. Call to Action */}
                <div className="p-3.5 rounded-xl bg-[#070c18] border border-[#18284d] space-y-1">
                  <div className="text-xs text-amber-400 font-semibold">
                    <span>3. Call to Action (CTA)</span>
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-amber-300">
                    {generatedPlatforms[activePlatform]?.callToAction}
                  </p>
                </div>

                {/* 4. Article Link Back */}
                <div className="p-3.5 rounded-xl bg-[#070c18] border border-[#18284d] space-y-1">
                  <div className="text-xs text-amber-400 font-semibold">
                    <span>4. Target Blog Article Link</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-sky-400 break-all">
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    <span>{url || 'https://elitehustlevaultcentral.com'}</span>
                  </div>
                </div>

                {/* 5. Hashtags */}
                <div className="p-3.5 rounded-xl bg-[#070c18] border border-[#18284d] space-y-1">
                  <div className="text-xs text-amber-400 font-semibold">
                    <span>5. Relevant Targeted Hashtags</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(generatedPlatforms[activePlatform]?.hashtags || []).map((tag, i) => (
                      <span key={i} className="text-xs font-mono text-slate-300 bg-[#101c36] px-2 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions Row */}
            <div className="pt-3 border-t border-[#18284d] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-slate-400">
                Ready to publish on your connected social channels.
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadText}
                  className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-[#101c36] hover:bg-[#18284d] rounded-xl flex items-center gap-1.5 transition-colors min-h-[44px]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .TXT</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopyPlatform(activePlatform)}
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95 min-h-[44px]"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy {activePlatform.toUpperCase()} Post</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
