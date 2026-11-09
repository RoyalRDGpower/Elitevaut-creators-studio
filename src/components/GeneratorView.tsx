import React, { useState, useEffect } from 'react';
import {
  PlatformsData,
  ToneType,
  ContentLengthType,
  FocusAngleType,
  PlatformKey,
  ContentVersionKey,
  ContentVersion,
  CarouselSlide,
  ArticleAnalysis,
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
  ExternalLink,
  Sliders,
  ChevronRight,
  MessageSquare,
  Users,
  RotateCcw,
  ShieldCheck,
  CheckSquare,
  HelpCircle,
  FileSearch,
  Eye,
  Hash,
} from 'lucide-react';
import {
  extractUrlData,
  analyzeArticleContent,
  generateSocialContent,
  regeneratePlatformContent,
  saveDraft,
  copyToClipboard,
  getPlatformPostText,
  getPlatformPostVersion,
} from '../utils/api';
import { generateSingleDraftPdf } from '../utils/pdfGenerator';

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
  const [articleText, setArticleText] = useState('');
  const [showFullTextInput, setShowFullTextInput] = useState(false);
  const [tone, setTone] = useState<ToneType>('authoritative');
  const [contentLength, setContentLength] = useState<ContentLengthType>('standard');
  const [focusAngle, setFocusAngle] = useState<FocusAngleType>('actionable');
  const [targetAudience, setTargetAudience] = useState('Solo Founders & Digital Builders');

  // Article Analysis State
  const [analysis, setAnalysis] = useState<ArticleAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);

  // Sync props if changed
  useEffect(() => {
    if (initialTitle) setTitle(initialTitle);
    if (initialSummary) setSummary(initialSummary);
    if (initialUrl) setUrl(initialUrl);
  }, [initialTitle, initialSummary, initialUrl]);

  // Async States
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [regeneratingPlatform, setRegeneratingPlatform] = useState<PlatformKey | null>(null);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [urlAccessWarning, setUrlAccessWarning] = useState<string | null>(null);

  // Generated Result States
  const [generatedPlatforms, setGeneratedPlatforms] = useState<PlatformsData | null>(null);
  const [activePlatform, setActivePlatform] = useState<PlatformKey>('linkedin');
  const [activeVersionKey, setActiveVersionKey] = useState<ContentVersionKey>('versionA');
  const [activeViewMode, setActiveViewMode] = useState<'formatted' | 'structured' | 'carousel'>('formatted');
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
    setArticleText('');
    setAnalysis(null);
    setGeneratedPlatforms(null);
    setErrorMessage(null);
    setUrlAccessWarning(null);
    setHasSavedCurrent(false);
    showToast('info', 'Form Cleared', 'Ready for new article content.');
  };

  // Sample Article Loader
  const handleLoadSample = () => {
    setUrl('https://elitehustlevaultcentral.com/blog/vault-multiplier-5-revenue-streams');
    setTitle('The Vault Multiplier: 5 Core Revenue Streams for Solo Builders');
    setSummary('A deep dive into how high-performing solo operators leverage automated knowledge vaults, digital assets, and high-margin consulting to scale past $20k/month without burning out.');
    setArticleText('Traditional 1:1 service businesses cap founder time and create fragile income ceilings. By packaging operational SOPs into self-onboarding digital hubs, launching recurring subscription knowledge vaults, charging $5k–$15k for 14-day outcome sprints, and licensing operational playbooks to non-competing firms, solo founders decouple revenue from calendar hours. Reinvesting high-margin vault cashflow creates a self-compounding asset flywheel.');
    setTone('authoritative');
    setContentLength('standard');
    setFocusAngle('actionable');
    setTargetAudience('Solo Founders & Digital Builders');
    setErrorMessage(null);
    setUrlAccessWarning(null);
    setAnalysis({
      title: 'The Vault Multiplier: 5 Core Revenue Streams for Solo Builders',
      mainArguments: [
        '1:1 client work caps gross revenue and induces founder fatigue.',
        'Digital knowledge assets can be replicated with zero marginal cost of distribution.',
        'Outcome-based sprints coupled with recurring subscription vaults create resilient cashflow.'
      ],
      verifiedFactsAndFigures: [
        '5 distinct revenue streams examined in framework.',
        '$20,000/month benchmark referenced as target solo threshold.'
      ],
      opinionsAndPerspectives: [
        'The author contends that traditional hourly retainers will become obsolete for high-leverage operators in 2026.',
        'Subscription access models build higher long-term enterprise valuation than one-time digital courses.'
      ],
      technicalDetails: [
        'Modular knowledge vault architecture',
        '14-day outcome sprint scoping',
        'Self-onboarding digital asset gateways'
      ]
    });
    showToast('info', 'Vault Blueprint Sample Loaded', 'Click "Generate Social Media Drafts" to build your V2.0 content package.');
  };

  // URL Auto-extraction with strict error reporting
  const handleExtractUrl = async () => {
    if (!url.trim()) {
      showToast('error', 'Please enter a URL first');
      return;
    }
    setIsExtracting(true);
    setErrorMessage(null);
    setUrlAccessWarning(null);

    try {
      const data = await extractUrlData(url.trim());
      if (data.title) setTitle(data.title);
      if (data.summary) setSummary(data.summary);
      if (data.fullText) setArticleText(data.fullText);
      if (data.analysis) {
        setAnalysis(data.analysis);
        setShowAnalysisPanel(true);
      }
      showToast('success', 'Article Metadata Extracted', 'Article content and fact-checked analysis populated.');
    } catch (err: any) {
      // Strictly do not pretend URL was analysed if it failed
      setUrlAccessWarning(err.message || 'Could not access the URL. Please enter the article title and summary manually below.');
      setShowFullTextInput(true);
      showToast('error', 'URL Inaccessible', 'Please enter or paste the article text manually.');
    } finally {
      setIsExtracting(false);
    }
  };

  // Run Dedicated Fact-Check & Article Analysis
  const handleAnalyzeArticle = async () => {
    const textToAnalyze = articleText.trim() || summary.trim();
    if (!textToAnalyze) {
      showToast('error', 'Please enter an article summary or text to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      const result = await analyzeArticleContent({
        title: title.trim(),
        text: textToAnalyze,
        url: url.trim(),
      });
      setAnalysis(result);
      setShowAnalysisPanel(true);
      showToast('success', 'Analysis & Fact-Check Complete', 'Verified facts distinguished from subjective opinions.');
    } catch (err: any) {
      showToast('error', 'Analysis Error', err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Content Generation (All 5 platforms x 3 versions + 6-slide carousel)
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

    setGenerationStep('Analyzing verified facts, technical details & thesis...');
    const stepTimer1 = setTimeout(() => {
      setGenerationStep('Engineering 3 versions (Professional, Engagement, Short) for LinkedIn, X, Threads, IG, FB...');
    }, 1300);
    const stepTimer2 = setTimeout(() => {
      setGenerationStep('Drafting 6-slide Instagram carousel script & applying anti-cliché quality control...');
    }, 2600);

    try {
      const result = await generateSocialContent({
        title: title.trim(),
        summary: summary.trim(),
        articleText: articleText.trim(),
        url: url.trim(),
        tone,
        contentLength,
        focusAngle,
        targetAudience,
      });

      setGeneratedPlatforms(result);
      if (result.articleAnalysis) {
        setAnalysis(result.articleAnalysis);
      }

      const activeText = getPlatformPostText(result[activePlatform], activeVersionKey);
      setEditableFullPost(activeText);
      setIsEditing(false);
      setErrorMessage(null);
      showToast('success', 'Elite Hustle V2.0 Content Ready!', '5 platforms generated with 3 versions each and 6-slide carousel script.');

      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } catch (err: any) {
      const rawMsg = err?.message || '';
      const safeMsg = rawMsg.includes('<') || rawMsg.includes('JSON') || rawMsg.includes('token')
        ? 'Network or gateway interruption. Our resilient engine will process your request.'
        : rawMsg || 'Error generating content. Please retry.';
      setErrorMessage(safeMsg);
      showToast('error', 'Generation Notice', safeMsg);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Regenerate Just One Platform
  const handleRegeneratePlatform = async (platformToRegen: PlatformKey) => {
    if (!title.trim() || !summary.trim()) return;
    setRegeneratingPlatform(platformToRegen);
    try {
      const updatedPlatform = await regeneratePlatformContent({
        platform: platformToRegen,
        title: title.trim(),
        summary: summary.trim(),
        articleText: articleText.trim(),
        url: url.trim(),
        tone,
        contentLength,
        focusAngle,
        targetAudience,
        analysis: analysis || undefined,
      });

      if (generatedPlatforms) {
        const nextPlatforms: PlatformsData = {
          ...generatedPlatforms,
          [platformToRegen]: updatedPlatform as any,
        };
        setGeneratedPlatforms(nextPlatforms);

        if (activePlatform === platformToRegen) {
          const newText = getPlatformPostText(updatedPlatform, activeVersionKey);
          setEditableFullPost(newText);
        }
      }
      showToast('success', `Regenerated ${platformToRegen.toUpperCase()}!`, 'Fresh versions generated while preserving all other platforms.');
    } catch (err: any) {
      showToast('error', 'Regeneration Failed', err.message);
    } finally {
      setRegeneratingPlatform(null);
    }
  };

  // Platform & Version Tab Switches
  const handlePlatformChange = (p: PlatformKey) => {
    if (isEditing && generatedPlatforms) {
      handleSaveInlineEdit();
    }
    setActivePlatform(p);
    if (generatedPlatforms) {
      const postText = getPlatformPostText(generatedPlatforms[p], activeVersionKey);
      setEditableFullPost(postText);
    }
    setIsEditing(false);
  };

  const handleVersionChange = (v: ContentVersionKey) => {
    if (isEditing && generatedPlatforms) {
      handleSaveInlineEdit();
    }
    setActiveVersionKey(v);
    if (generatedPlatforms) {
      const postText = getPlatformPostText(generatedPlatforms[activePlatform], v);
      setEditableFullPost(postText);
    }
    setIsEditing(false);
  };

  // Save Inline Edit
  const handleSaveInlineEdit = () => {
    if (!generatedPlatforms) return;
    const updated: PlatformsData = { ...generatedPlatforms };
    const currentPlatformData = updated[activePlatform];

    if (currentPlatformData && currentPlatformData.versions) {
      currentPlatformData.versions = {
        ...currentPlatformData.versions,
        [activeVersionKey]: {
          ...currentPlatformData.versions[activeVersionKey],
          fullPost: editableFullPost,
          characterCount: editableFullPost.length,
        },
      };
    }

    setGeneratedPlatforms(updated);
    setIsEditing(false);
    showToast('info', 'Edit Saved', `Updated ${activePlatform.toUpperCase()} (${activeVersionKey.replace('version', 'Ver ')}).`);
  };

  // Copy Single Active Version
  const handleCopyActiveVersion = async () => {
    const textToCopy = isEditing
      ? editableFullPost
      : getPlatformPostText(generatedPlatforms?.[activePlatform], activeVersionKey);

    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopiedKey(`${activePlatform}-${activeVersionKey}`);
      showToast('success', `Copied ${activePlatform.toUpperCase()} (${activeVersionKey.replace('version', 'Version ')})!`, 'Ready to paste into your social app.');
      setTimeout(() => setCopiedKey(null), 2000);
    } else {
      showToast('error', 'Failed to copy to clipboard.');
    }
  };

  // Copy Entire 6-Slide Carousel Script
  const handleCopyCarouselScript = async () => {
    const slides = generatedPlatforms?.instagram?.carouselScript;
    if (!slides || slides.length === 0) return;

    const formatted = `=== INSTAGRAM 6-SLIDE CAROUSEL SCRIPT ===\n` +
      `Topic: ${title}\n` +
      `URL: ${url || 'https://elitehustlevaultcentral.com'}\n\n` +
      slides.map((s) => `--- SLIDE ${s.slideNumber}: ${s.headline.toUpperCase()} ---\n` +
        `Visual: ${s.visualSuggestion}\n` +
        `Text: ${s.supportingText}\n` +
        `Hook To Next: ${s.transitionHook}\n`
      ).join('\n') +
      `\nCAPTION:\n${getPlatformPostText(generatedPlatforms.instagram, activeVersionKey)}\n`;

    const success = await copyToClipboard(formatted);
    if (success) {
      setCopiedKey('carousel-script');
      showToast('success', '6-Slide Carousel Script Copied!', 'Includes headlines, visual suggestions, slide copy, and transition hooks.');
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  // Download Current Campaign as Formatted PDF (Clean reading & printing)
  const handleDownloadPdf = () => {
    if (!generatedPlatforms) return;
    try {
      const tempDraft: any = {
        id: 'draft-current-' + Date.now(),
        title: title || 'Generated Social Campaign',
        summary: summary || '',
        url: url || '',
        tone,
        contentLength,
        focusAngle,
        platforms: generatedPlatforms,
        articleAnalysis: analysis || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      generateSingleDraftPdf(tempDraft);
      showToast('success', 'PDF Generated!', 'Downloaded clean campaign PDF formatted for reading and print.');
    } catch (err: any) {
      console.error('PDF export error:', err);
      showToast('error', 'PDF Download Failed', err.message || 'Could not generate PDF.');
    }
  };

  // Download All Drafts as Formatted TXT
  const handleDownloadAllTxt = () => {
    if (!generatedPlatforms) return;

    let textContent = `========================================================\n` +
      `ELITE HUSTLE CONTENT STUDIO V2.0 - MASTER CONTENT PACK\n` +
      `Elite Hustle Vault Central\n` +
      `========================================================\n\n` +
      `Title: ${title}\n` +
      `URL: ${url || 'N/A'}\n` +
      `Tone: ${tone} | Length: ${contentLength} | Angle: ${focusAngle}\n` +
      `Target Audience: ${targetAudience}\n` +
      `Generated: ${new Date().toLocaleString()}\n\n`;

    if (analysis) {
      textContent += `--- QUALITY CONTROL & FACT CHECK REPORT ---\n` +
        `Main Arguments:\n${analysis.mainArguments.map((a) => `• ${a}`).join('\n')}\n\n` +
        `Verified Facts & Figures:\n${analysis.verifiedFactsAndFigures.map((f) => `✓ ${f}`).join('\n')}\n\n` +
        `Opinions & Perspectives:\n${analysis.opinionsAndPerspectives.map((o) => `~ ${o}`).join('\n')}\n\n` +
        `Technical Details:\n${analysis.technicalDetails.map((t) => `+ ${t}`).join('\n')}\n\n` +
        `========================================================\n\n`;
    }

    const platformKeys: PlatformKey[] = ['linkedin', 'x', 'threads', 'instagram', 'facebook'];
    platformKeys.forEach((pk) => {
      const pData = generatedPlatforms[pk];
      textContent += `\n########################################################\n` +
        `### PLATFORM: ${pk.toUpperCase()} ###\n` +
        `########################################################\n\n`;

      if (pData?.versions) {
        (['versionA', 'versionB', 'versionC'] as ContentVersionKey[]).forEach((vk) => {
          const vObj = pData.versions[vk];
          if (vObj) {
            textContent += `--- [ ${vObj.label.toUpperCase()} (VERSION ${vObj.version}) ] ---\n` +
              `Hook: ${vObj.hook}\n\n` +
              `Body:\n${vObj.body}\n\n` +
              `CTA: ${vObj.callToAction}\n\n` +
              `Hashtags: ${vObj.hashtags.join(' ')}\n\n` +
              `Full Ready-to-Post Copy:\n${vObj.fullPost}\n\n`;
          }
        });
      }

      if (pk === 'instagram' && generatedPlatforms.instagram.carouselScript) {
        textContent += `--- [ 6-SLIDE CAROUSEL SCRIPT ] ---\n`;
        generatedPlatforms.instagram.carouselScript.forEach((slide) => {
          textContent += `Slide ${slide.slideNumber}: ${slide.headline}\n` +
            `  Visual Suggestion: ${slide.visualSuggestion}\n` +
            `  Copy: ${slide.supportingText}\n` +
            `  Transition Hook: ${slide.transitionHook}\n\n`;
        });
      }

      if (pk === 'x' && generatedPlatforms.x.threadTweets) {
        textContent += `--- [ 4-TWEET THREAD ] ---\n`;
        generatedPlatforms.x.threadTweets.forEach((tweet, idx) => {
          textContent += `Tweet ${idx + 1} (${tweet.length} chars):\n${tweet}\n\n`;
        });
      }
    });

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${title.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_v2_content_pack.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
    showToast('info', 'File Downloaded', 'Saved complete V2.0 content pack as plain text.');
  };

  // Save to Drafts Vault
  const handleSaveDraft = async () => {
    if (!generatedPlatforms) return;
    setIsSaving(true);
    try {
      let platformsToSave = generatedPlatforms;
      if (isEditing) {
        handleSaveInlineEdit();
        platformsToSave = generatedPlatforms;
      }

      const saved = await saveDraft({
        title: title.trim(),
        summary: summary.trim(),
        url: url.trim(),
        tone,
        contentLength,
        focusAngle,
        platforms: platformsToSave,
        articleAnalysis: analysis || undefined,
      });

      setHasSavedCurrent(true);
      onDraftSaved(saved);
      showToast('success', 'Draft Saved to Vault Central!', 'Includes all 5 platforms, 3 versions each, and 6-slide carousel script.');
    } catch (err: any) {
      showToast('error', 'Save Failed', 'Could not save draft to storage.');
    } finally {
      setIsSaving(false);
    }
  };

  const platformsMeta: { key: PlatformKey; label: string; icon: string; color: string }[] = [
    { key: 'linkedin', label: 'LinkedIn', icon: 'LI', color: 'text-sky-400' },
    { key: 'x', label: 'X (Twitter)', icon: 'X', color: 'text-slate-100' },
    { key: 'threads', label: 'Threads', icon: 'TH', color: 'text-purple-400' },
    { key: 'instagram', label: 'Instagram', icon: 'IG', color: 'text-pink-400' },
    { key: 'facebook', label: 'Facebook', icon: 'FB', color: 'text-blue-400' },
  ];

  const versionLabels: { key: ContentVersionKey; label: string; badge: string }[] = [
    { key: 'versionA', label: 'Version A', badge: 'Professional' },
    { key: 'versionB', label: 'Version B', badge: 'Strong Engagement' },
    { key: 'versionC', label: 'Version C', badge: 'Short & Powerful' },
  ];

  const activePostText = isEditing
    ? editableFullPost
    : getPlatformPostText(generatedPlatforms?.[activePlatform], activeVersionKey);

  const activePostVersion = getPlatformPostVersion(generatedPlatforms?.[activePlatform], activeVersionKey);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-200">
      {/* Studio Header & Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Elite Hustle Content Studio · Version 2.0</span>
          </div>
          <h1 className="font-['Outfit'] text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Multi-Platform Content Studio
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Generate 3 distinctive versions across LinkedIn, X, Threads, Instagram (6-Slide Carousel), and Facebook.
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
            <span>Load Vault Sample</span>
          </button>
        </div>
      </div>

      {/* URL Access Warning / Notice (Requirement 1: Do not pretend URL was analysed if it failed) */}
      {urlAccessWarning && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-200 flex items-start gap-3 text-xs md:text-sm">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="font-bold text-amber-300">URL Could Not Be Accessed Automatically</p>
            <p className="text-slate-300 leading-relaxed">
              {urlAccessWarning}
            </p>
            <p className="text-amber-400 text-xs font-medium pt-1">
              ✓ To ensure 100% factual accuracy and zero hallucinated numbers, please enter or paste the article title and summary manually below.
            </p>
          </div>
          <button
            onClick={() => setUrlAccessWarning(null)}
            className="text-amber-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* General Error Alert */}
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

      {/* Article Input & Fact Check Form Card */}
      <form onSubmit={handleGenerate} className="p-5 md:p-7 rounded-2xl md:rounded-3xl bg-[#0b1325] border border-[#18284d] space-y-5 shadow-xl shadow-black/40">
        <div className="flex items-center justify-between pb-3 border-b border-[#18284d]">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>1. Article Input & Fact Verification</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFullTextInput(!showFullTextInput)}
              className="text-xs text-slate-400 hover:text-amber-300 transition-colors"
            >
              {showFullTextInput ? 'Hide Full Text' : '+ Paste Full Article Text'}
            </button>
          </div>
        </div>

        {/* URL Input with Auto-extract */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-200">
            Article URL <span className="text-slate-400 font-normal">(Preserved in every generated draft)</span>
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
                  <span>Checking URL...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Analyze URL</span>
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
            placeholder="e.g. The Vault Multiplier: 5 Core Revenue Streams for Solo Builders"
            className="w-full px-4 py-3 bg-[#070c18] border border-[#18284d] focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-sm md:text-base font-medium text-slate-100 placeholder-slate-500 transition-colors"
          />
        </div>

        {/* Summary Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-slate-200">
              Article Summary & Verified Facts <span className="text-amber-400">*</span>
            </label>
            <span className="text-slate-400 text-[11px] font-mono">{summary.length} chars</span>
          </div>
          <textarea
            required
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Enter the core arguments and verified factual details. Our quality control system ensures only true claims are cited."
            className="w-full px-4 py-3 bg-[#070c18] border border-[#18284d] focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-sm text-slate-100 placeholder-slate-500 transition-colors leading-relaxed resize-y"
          />
        </div>

        {/* Optional Full Text Area */}
        {showFullTextInput && (
          <div className="space-y-1.5 pt-1 animate-in fade-in">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-200">Full Article Text / Transcript (Optional)</label>
              <span className="text-slate-400 text-[11px] font-mono">{articleText.length} chars</span>
            </div>
            <textarea
              rows={4}
              value={articleText}
              onChange={(e) => setArticleText(e.target.value)}
              placeholder="Paste full raw text here if you want deeper fact extraction and technical detail breakdown."
              className="w-full px-4 py-3 bg-[#070c18] border border-[#18284d] focus:border-amber-400 rounded-xl text-xs text-slate-200 placeholder-slate-500 transition-colors leading-relaxed resize-y font-mono"
            />
          </div>
        )}

        {/* Fact-Check & Analysis Trigger */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={handleAnalyzeArticle}
            disabled={isAnalyzing || (!summary.trim() && !articleText.trim())}
            className="px-3.5 py-2 bg-[#101c36] hover:bg-[#18284d] disabled:opacity-50 text-slate-300 hover:text-amber-400 border border-[#1e325c] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors min-h-[38px]"
          >
            {isAnalyzing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>Analyze Arguments & Fact-Check</span>
          </button>

          {analysis && (
            <button
              type="button"
              onClick={() => setShowAnalysisPanel(!showAnalysisPanel)}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showAnalysisPanel ? 'Hide Fact Check' : 'View Fact Check Report'}</span>
            </button>
          )}
        </div>

        {/* Fact-Check Intelligence Panel (Requirement 1 & 5) */}
        {analysis && showAnalysisPanel && (
          <div className="p-4 md:p-5 rounded-2xl bg-[#070c18] border border-amber-500/30 space-y-3.5 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-[#18284d]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="font-['Outfit'] text-sm font-bold text-white">
                  Quality Control: Article Intelligence & Facts
                </h3>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 font-mono">
                Verified Facts Separated
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Verified Facts & Figures */}
              <div className="p-3 rounded-xl bg-[#0b1325] border border-emerald-500/20 space-y-1.5">
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <span>✓ Verified Facts & Figures:</span>
                </span>
                <ul className="text-slate-300 space-y-1 list-disc list-inside">
                  {analysis.verifiedFactsAndFigures.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              {/* Opinions & Perspectives */}
              <div className="p-3 rounded-xl bg-[#0b1325] border border-amber-500/20 space-y-1.5">
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <span>~ Opinions & Subjective Claims:</span>
                </span>
                <ul className="text-slate-300 space-y-1 list-disc list-inside">
                  {analysis.opinionsAndPerspectives.map((o, i) => (
                    <li key={i}>{o}</li>
                  ))}
                </ul>
              </div>

              {/* Main Arguments */}
              <div className="p-3 rounded-xl bg-[#0b1325] border border-[#18284d] space-y-1.5">
                <span className="font-bold text-slate-200">Main Arguments:</span>
                <ul className="text-slate-300 space-y-1 list-disc list-inside">
                  {analysis.mainArguments.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>

              {/* Technical Details */}
              <div className="p-3 rounded-xl bg-[#0b1325] border border-[#18284d] space-y-1.5">
                <span className="font-bold text-slate-200">Technical Details & Frameworks:</span>
                <ul className="text-slate-300 space-y-1 list-disc list-inside">
                  {analysis.technicalDetails.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* User Controls: Tone, Length, Angle & Audience (Requirement 6) */}
        <div className="pt-2 border-t border-[#18284d] space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>2. User Strategy & Style Controls</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Tone Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                Promotional Tone
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'authoritative' as ToneType, label: 'Authoritative', desc: 'Direct thought leader' },
                  { id: 'conversational' as ToneType, label: 'Conversational', desc: 'Relatable story' },
                  { id: 'high-energy' as ToneType, label: 'High-Energy', desc: 'Urgent & motivational' },
                  { id: 'executive' as ToneType, label: 'Executive', desc: 'C-suite strategic' },
                  { id: 'provocative' as ToneType, label: 'Provocative', desc: 'Contrarian tension' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTone(item.id)}
                    className={`p-2 rounded-xl border text-left transition-all min-h-[44px] ${
                      tone === item.id
                        ? 'bg-amber-400/20 border-amber-400 text-white font-medium shadow-sm'
                        : 'bg-[#070c18] border-[#18284d] text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Length Selector (Requirement 6) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                Content Length Target
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'short' as ContentLengthType, label: 'Short', desc: 'Punchy & dense' },
                  { id: 'standard' as ContentLengthType, label: 'Standard', desc: 'Balanced structure' },
                  { id: 'in-depth' as ContentLengthType, label: 'In-Depth', desc: 'Detailed masterclass' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setContentLength(item.id)}
                    className={`p-2 rounded-xl border text-center transition-all min-h-[44px] flex flex-col justify-center ${
                      contentLength === item.id
                        ? 'bg-amber-400/20 border-amber-400 text-white font-medium shadow-sm'
                        : 'bg-[#070c18] border-[#18284d] text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>

              {/* Promotional Focus Angle */}
              <div className="pt-2 space-y-1">
                <label className="block text-xs font-semibold text-slate-200">
                  Promotional Angle
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'actionable' as FocusAngleType, label: 'Actionable Steps' },
                    { id: 'contrarian' as FocusAngleType, label: 'Contrarian Truth' },
                    { id: 'case-study' as FocusAngleType, label: 'Case Study' },
                    { id: 'growth' as FocusAngleType, label: 'Mindset & Scale' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFocusAngle(item.id)}
                      className={`p-2 rounded-lg border text-xs font-medium text-left transition-colors min-h-[36px] ${
                        focusAngle === item.id
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'bg-[#070c18] text-slate-300 border-[#18284d]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Target Audience Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                Target Audience
              </label>
              <div className="space-y-1.5">
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
                    className={`w-full p-2 rounded-xl border text-left text-xs font-medium transition-colors min-h-[38px] ${
                      targetAudience === aud
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                        : 'bg-[#070c18] text-slate-300 border-[#18284d] hover:border-slate-600'
                    }`}
                  >
                    {aud}
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
                <span>Generating Multi-Platform Versions & Carousel...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>Generate Social Media Drafts (5 Channels × 3 Versions)</span>
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
        <div id="results-section" className="space-y-5 pt-2">
          {/* Top Actions Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#18284d]">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Elite Hustle V2.0 Content Package</span>
              </div>
              <h2 className="font-['Outfit'] text-xl font-bold text-white mt-0.5">
                Multi-Platform Draft Studio
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                title="Download this campaign as a formatted PDF for reading and printing"
                className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl flex items-center gap-1.5 transition-all min-h-[44px] shadow-sm shadow-amber-500/20 active:scale-95"
              >
                <FileText className="w-3.5 h-3.5 text-slate-950" />
                <span>Download PDF</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadAllTxt}
                className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-[#101c36] hover:bg-[#18284d] border border-[#1e325c] rounded-xl flex items-center gap-1.5 transition-all min-h-[44px]"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Download TXT</span>
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
                    <span>Saved in Vault</span>
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

          {/* 5 Platform Selector Tabs (Requirement 2) */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 p-1.5 bg-[#0b1325] border border-[#18284d] rounded-2xl">
            {platformsMeta.map((p) => {
              const isSelected = activePlatform === p.key;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => handlePlatformChange(p.key)}
                  className={`py-2.5 px-1 sm:px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 min-h-[44px] ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-[#101c36]'
                  }`}
                >
                  <span className={`font-mono text-xs ${isSelected ? 'text-slate-950 font-bold' : p.color}`}>
                    [{p.icon}]
                  </span>
                  <span className="hidden sm:inline truncate">{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Platform Panel */}
          <div className="p-5 md:p-6 rounded-2xl md:rounded-3xl bg-[#0b1325] border border-[#18284d] space-y-4 shadow-xl shadow-black/40">
            {/* Header: Platform Info & Regenerate Single Platform Control */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#18284d]">
              <div className="flex items-center gap-2">
                <span className="font-['Outfit'] text-base md:text-lg font-bold text-white capitalize">
                  {activePlatform === 'x' ? 'X (Twitter)' : activePlatform}
                </span>

                {/* Character Limit Badge (Requirement 5) */}
                <span
                  className={`text-xs font-mono px-2 py-0.5 rounded ${
                    activePlatform === 'x'
                      ? activePostText.length <= 280
                        ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
                        : 'text-rose-400 bg-rose-950/40 border border-rose-500/30'
                      : activePlatform === 'threads'
                      ? activePostText.length <= 500
                        ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
                        : 'text-amber-400 bg-amber-950/40 border border-amber-500/30'
                      : 'text-slate-400 bg-[#070c18]'
                  }`}
                >
                  {activePlatform === 'x'
                    ? `${activePostText.length} / 280 chars`
                    : activePlatform === 'threads'
                    ? `${activePostText.length} / 500 chars`
                    : `${activePostText.length} chars`}
                </span>
              </div>

              {/* Action Buttons: Regenerate Single Platform, Edit, Copy */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Regenerate this platform only (Requirement 6) */}
                <button
                  type="button"
                  onClick={() => handleRegeneratePlatform(activePlatform)}
                  disabled={regeneratingPlatform === activePlatform}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-amber-400 bg-[#101c36] hover:bg-[#18284d] border border-[#1e325c] rounded-lg flex items-center gap-1.5 transition-colors min-h-[38px]"
                  title={`Regenerate ${activePlatform} only`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${regeneratingPlatform === activePlatform ? 'animate-spin' : ''}`} />
                  <span>{regeneratingPlatform === activePlatform ? 'Regenerating...' : `Regenerate ${activePlatform.toUpperCase()}`}</span>
                </button>

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
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border flex items-center gap-1.5 transition-colors min-h-[38px] ${
                    isEditing
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 font-semibold'
                      : 'bg-[#101c36] text-slate-300 border-[#1e325c] hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Save Text' : 'Edit Copy'}</span>
                </button>

                {/* Copy Active Version */}
                <button
                  type="button"
                  onClick={handleCopyActiveVersion}
                  className="px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-lg flex items-center gap-1.5 shadow-sm transition-all active:scale-95 min-h-[38px]"
                >
                  {copiedKey === `${activePlatform}-${activeVersionKey}` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-slate-950" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-950" />
                      <span>Copy {activeVersionKey.replace('version', 'Ver ')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sub-Tabs: 3 Content Versions (Requirement 3) + Carousel View (Requirement 4) */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 bg-[#070c18] border border-[#18284d] rounded-xl">
              <div className="flex flex-wrap items-center gap-1">
                {versionLabels.map((v) => {
                  const isSelected = activeVersionKey === v.key;
                  return (
                    <button
                      key={v.key}
                      type="button"
                      onClick={() => handleVersionChange(v.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[36px] flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>{v.label}:</span>
                      <span className="font-normal opacity-90">{v.badge}</span>
                    </button>
                  );
                })}
              </div>

              {/* Instagram Carousel Script Tab Toggle */}
              {activePlatform === 'instagram' && (
                <button
                  type="button"
                  onClick={() => setActiveViewMode(activeViewMode === 'carousel' ? 'formatted' : 'carousel')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 min-h-[36px] ${
                    activeViewMode === 'carousel'
                      ? 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                      : 'bg-[#101c36] text-slate-300 border-[#18284d] hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-pink-400" />
                  <span>{activeViewMode === 'carousel' ? 'View Caption' : '6-Slide Carousel Script (Script Mode)'}</span>
                </button>
              )}
            </div>

            {/* Display: Carousel Script vs Formatted Text vs Inline Editor */}
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-amber-300">
                  <span className="font-semibold">Editing: {activePlatform.toUpperCase()} ({activeVersionKey.replace('version', 'Version ')})</span>
                  <span className="font-mono text-slate-400">{editableFullPost.length} chars</span>
                </div>
                <textarea
                  rows={9}
                  value={editableFullPost}
                  onChange={(e) => setEditableFullPost(e.target.value)}
                  className="w-full p-4 bg-[#070c18] border border-amber-500/40 focus:border-amber-400 rounded-xl text-sm text-slate-100 font-sans leading-relaxed resize-y"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditableFullPost(getPlatformPostText(generatedPlatforms[activePlatform], activeVersionKey));
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
            ) : activeViewMode === 'carousel' && activePlatform === 'instagram' ? (
              /* Instagram 6-Slide Carousel Script Display (Requirement 4) */
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#18284d]">
                  <div className="flex items-center gap-2 text-xs font-bold text-pink-400 uppercase tracking-wider">
                    <Layers className="w-4 h-4 text-pink-400" />
                    <span>Instagram 6-Slide Carousel Script</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCarouselScript}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-[#101c36] hover:bg-[#18284d] border border-[#1e325c] rounded-lg flex items-center gap-1.5 transition-all min-h-[36px]"
                  >
                    {copiedKey === 'carousel-script' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>Copy Full 6-Slide Script</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {generatedPlatforms.instagram?.carouselScript?.map((slide: CarouselSlide) => (
                    <div
                      key={slide.slideNumber}
                      className="p-4 rounded-xl bg-[#070c18] border border-[#18284d] flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                            Slide {slide.slideNumber} of 6
                          </span>
                          <button
                            type="button"
                            onClick={async () => {
                              await copyToClipboard(`Slide ${slide.slideNumber}: ${slide.headline}\n${slide.supportingText}\nVisual: ${slide.visualSuggestion}`);
                              showToast('info', `Slide ${slide.slideNumber} Copied`);
                            }}
                            className="text-slate-400 hover:text-white p-1"
                            title="Copy slide"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h4 className="font-['Outfit'] font-bold text-white text-sm leading-snug">
                          {slide.headline}
                        </h4>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {slide.supportingText}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#18284d]/60 space-y-1.5 text-[11px]">
                        <div>
                          <strong className="text-amber-400 font-semibold">Visual Suggestion:</strong>{' '}
                          <span className="text-slate-400">{slide.visualSuggestion}</span>
                        </div>
                        <div>
                          <strong className="text-sky-400 font-semibold">Next Hook:</strong>{' '}
                          <span className="text-slate-400 italic">{slide.transitionHook}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Ready-to-Post Copy Display */
              <div className="space-y-3">
                <div className="p-4 md:p-5 rounded-xl bg-[#070c18] border border-[#18284d] text-sm md:text-base text-slate-100 whitespace-pre-wrap leading-relaxed select-text font-sans">
                  {activePostText}
                </div>

                {/* X Thread preview if on X */}
                {activePlatform === 'x' && generatedPlatforms.x?.threadTweets && generatedPlatforms.x.threadTweets.length > 0 && (
                  <div className="p-4 rounded-xl bg-[#0c162d] border border-amber-500/20 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-amber-400" />
                        <span>Optional Thread Breakdown ({generatedPlatforms.x.threadTweets.length} Tweets)</span>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          await copyToClipboard(generatedPlatforms.x.threadTweets!.join('\n\n---\n\n'));
                          showToast('info', 'Thread Copied to Clipboard');
                        }}
                        className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy Thread</span>
                      </button>
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
            )}

            {/* Bottom Actions Row */}
            <div className="pt-3 border-t border-[#18284d] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Original URL preserved · Anti-AI cliché filter active · No fabricated stats</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyActiveVersion}
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95 min-h-[40px]"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy This Post</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
