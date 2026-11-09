import React, { useState, useEffect } from 'react';
import { Draft, PlatformKey, ContentVersionKey, CarouselSlide, PlatformsData } from '../types';
import {
  Search,
  Trash2,
  Edit2,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  BookmarkCheck,
  Calendar,
  AlertTriangle,
  Download,
  Filter,
  Layers,
  ShieldCheck,
  FileText,
  Printer,
} from 'lucide-react';
import { deleteDraft, saveDraft, copyToClipboard, getPlatformPostText } from '../utils/api';
import { generateConsolidatedPdf, generateSingleDraftPdf, openPrintableDocument } from '../utils/pdfGenerator';

interface DraftsViewProps {
  drafts: Draft[];
  selectedDraftId?: string | null;
  onDraftDeleted: (id: string) => void;
  onDraftUpdated: (draft: Draft) => void;
  onNewDraftClick: () => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const DraftsView: React.FC<DraftsViewProps> = ({
  drafts,
  selectedDraftId,
  onDraftDeleted,
  onDraftUpdated,
  onNewDraftClick,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'all' | PlatformKey>('all');
  const [toneFilter, setToneFilter] = useState<string>('all');
  const [expandedDraftId, setExpandedDraftId] = useState<string | null>(selectedDraftId || null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Active version tab per expanded draft
  const [expandedVersions, setExpandedVersions] = useState<Record<string, ContentVersionKey>>({});

  useEffect(() => {
    if (selectedDraftId) {
      setExpandedDraftId(selectedDraftId);
    }
  }, [selectedDraftId]);

  // Delete Confirmation State
  const [draftToDelete, setDraftToDelete] = useState<Draft | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit Modal State
  const [editingDraft, setEditingDraft] = useState<Draft | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editPlatformKey, setEditPlatformKey] = useState<PlatformKey>('linkedin');
  const [editVersionKey, setEditVersionKey] = useState<ContentVersionKey>('versionA');
  const [editPlatforms, setEditPlatforms] = useState<PlatformsData | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Copy handler
  const handleCopy = async (text: string, label: string, draftId: string) => {
    if (!text) {
      showToast('error', `No ${label} copy available to copy.`);
      return;
    }
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedKey(`${draftId}-${label}`);
      showToast('success', `Copied ${label}!`, 'Ready to paste directly into your social channel.');
      setTimeout(() => setCopiedKey(null), 2000);
    } else {
      showToast('error', 'Failed to copy to clipboard.');
    }
  };

  // Open Edit Modal with full multi-platform state
  const openEditModal = (draft: Draft) => {
    setEditingDraft(draft);
    setEditTitle(draft.title);
    setEditSummary(draft.summary || '');
    setEditUrl(draft.url || '');
    setEditPlatformKey('linkedin');
    setEditVersionKey('versionA');
    setEditPlatforms(JSON.parse(JSON.stringify(draft.platforms || {})));
  };

  // Update specific platform text in edit modal
  const handleEditPlatformTextChange = (text: string) => {
    if (!editPlatforms) return;
    setEditPlatforms((prev) => {
      if (!prev) return prev;
      const targetPlatform = prev[editPlatformKey];
      if (targetPlatform?.versions && targetPlatform.versions[editVersionKey]) {
        return {
          ...prev,
          [editPlatformKey]: {
            ...targetPlatform,
            versions: {
              ...targetPlatform.versions,
              [editVersionKey]: {
                ...targetPlatform.versions[editVersionKey],
                fullPost: text,
                characterCount: text.length,
              },
            },
          },
        };
      }
      // V1 fallback
      return {
        ...prev,
        [editPlatformKey]: {
          ...targetPlatform,
          fullPost: text,
        },
      };
    });
  };

  // Save Edit
  const handleSaveEdit = async () => {
    if (!editingDraft) return;
    if (!editTitle.trim()) {
      showToast('error', 'Draft title cannot be empty.');
      return;
    }

    setIsSavingEdit(true);
    try {
      const updated = await saveDraft({
        ...editingDraft,
        title: editTitle.trim(),
        summary: editSummary.trim(),
        url: editUrl.trim(),
        platforms: editPlatforms || editingDraft.platforms,
      });

      onDraftUpdated(updated);
      setEditingDraft(null);
      showToast('success', 'Draft Updated Successfully!', 'All channel copy changes have been saved.');
    } catch (err: any) {
      showToast('error', 'Failed to update draft');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Delete Action
  const confirmDelete = async () => {
    if (!draftToDelete) return;
    setIsDeleting(true);
    try {
      const success = await deleteDraft(draftToDelete.id);
      if (success) {
        onDraftDeleted(draftToDelete.id);
        if (expandedDraftId === draftToDelete.id) {
          setExpandedDraftId(null);
        }
        showToast('info', 'Draft Deleted', 'Removed from your saved vault.');
      } else {
        showToast('error', 'Could not delete draft.');
      }
    } catch (err) {
      showToast('error', 'Delete failed.');
    } finally {
      setIsDeleting(false);
      setDraftToDelete(null);
    }
  };

  // Download all drafts as consolidated PDF document
  const handleDownloadAllPdf = () => {
    if (drafts.length === 0) {
      showToast('info', 'No Drafts Available', 'Create and save at least one draft before exporting.');
      return;
    }
    try {
      generateConsolidatedPdf(drafts);
      showToast('success', 'Consolidated PDF Generated!', `Exported all ${drafts.length} campaigns formatted for reading and print.`);
    } catch (err: any) {
      console.error('PDF generation error:', err);
      showToast('error', 'PDF Export Failed', err.message || 'Could not generate PDF document.');
    }
  };

  // Download single draft as PDF
  const handleDownloadSinglePdf = (draft: Draft) => {
    try {
      generateSingleDraftPdf(draft);
      showToast('success', 'Campaign PDF Generated!', `Downloaded clean PDF dossier for "${draft.title.slice(0, 30)}...".`);
    } catch (err: any) {
      console.error('Single PDF generation error:', err);
      showToast('error', 'PDF Export Failed', err.message || 'Could not generate PDF document.');
    }
  };

  // Open browser-native print view formatted for clean reading and printing
  const handleOpenPrintView = () => {
    if (drafts.length === 0) {
      showToast('info', 'No Drafts to Print');
      return;
    }
    openPrintableDocument(drafts);
    showToast('info', 'Opening Print Preview', 'Use the print dialog to print or save to PDF.');
  };

  // Download single draft as complete V2 .TXT package
  const handleExportDraft = (draft: Draft) => {
    let textContent = `========================================================\n` +
      `ELITE HUSTLE CONTENT STUDIO V2.0 - CAMPAIGN EXPORT\n` +
      `Title: ${draft.title}\n` +
      `URL: ${draft.url || 'N/A'}\n` +
      `Tone: ${draft.tone} | Length: ${draft.contentLength || 'standard'} | Angle: ${draft.focusAngle}\n` +
      `Saved: ${new Date(draft.createdAt).toLocaleString()}\n` +
      `========================================================\n\n`;

    if (draft.articleAnalysis) {
      textContent += `--- FACT CHECK & ANALYSIS ---\n` +
        `Main Arguments:\n${draft.articleAnalysis.mainArguments.map((a) => `• ${a}`).join('\n')}\n\n` +
        `Verified Facts:\n${draft.articleAnalysis.verifiedFactsAndFigures.map((f) => `✓ ${f}`).join('\n')}\n\n` +
        `Opinions:\n${draft.articleAnalysis.opinionsAndPerspectives.map((o) => `~ ${o}`).join('\n')}\n\n` +
        `========================================================\n\n`;
    }

    const platformKeys: PlatformKey[] = ['linkedin', 'x', 'threads', 'instagram', 'facebook'];
    platformKeys.forEach((pk) => {
      const pData = draft.platforms?.[pk];
      textContent += `\n########################################################\n` +
        `### PLATFORM: ${pk.toUpperCase()} ###\n` +
        `########################################################\n\n`;

      if (pData?.versions) {
        (['versionA', 'versionB', 'versionC'] as ContentVersionKey[]).forEach((vk) => {
          const vObj = pData.versions[vk];
          if (vObj) {
            textContent += `--- [ ${vObj.label.toUpperCase()} (VERSION ${vObj.version}) ] ---\n` +
              `${vObj.fullPost}\n\n`;
          }
        });
      } else if (pData?.fullPost) {
        textContent += `${pData.fullPost}\n\n`;
      }

      if (pk === 'instagram' && draft.platforms?.instagram?.carouselScript) {
        textContent += `--- [ 6-SLIDE CAROUSEL SCRIPT ] ---\n`;
        draft.platforms.instagram.carouselScript.forEach((slide) => {
          textContent += `Slide ${slide.slideNumber}: ${slide.headline}\n` +
            `  Visual: ${slide.visualSuggestion}\n` +
            `  Copy: ${slide.supportingText}\n` +
            `  Hook: ${slide.transitionHook}\n\n`;
        });
      }
    });

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${draft.title.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_v2_campaign.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
    showToast('info', 'Campaign Exported', 'Downloaded complete V2 plain text package.');
  };

  // Filtered Drafts
  const filteredDrafts = drafts.filter((draft) => {
    const matchesSearch =
      !searchQuery.trim() ||
      draft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      draft.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (draft.url && draft.url.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (draft.platforms && JSON.stringify(draft.platforms).toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTone = toneFilter === 'all' || draft.tone === toneFilter;

    const matchesPlatform =
      platformFilter === 'all' ||
      Boolean(draft.platforms && draft.platforms[platformFilter]);

    return matchesSearch && matchesTone && matchesPlatform;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-['Outfit'] text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Saved Drafts Vault
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Manage, export, and copy 5-platform promotional assets for Elite Hustle Vault Central.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {drafts.length > 0 && (
            <>
              <button
                onClick={handleDownloadAllPdf}
                title="Generate clean consolidated PDF document of all drafts"
                className="px-3.5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-500 rounded-xl transition-all shadow-md shadow-amber-500/20 min-h-[44px] flex items-center gap-2 active:scale-95"
              >
                <FileText className="w-4 h-4 text-slate-950" />
                <span>Download All (PDF)</span>
              </button>

              <button
                onClick={handleOpenPrintView}
                title="Open clean print-formatted dossier for printing or saving to PDF"
                className="px-3 py-2.5 text-xs font-medium text-slate-300 hover:text-white bg-[#101c36] hover:bg-[#18284d] border border-[#1e325c] rounded-xl transition-all min-h-[44px] flex items-center gap-1.5 active:scale-95"
              >
                <Printer className="w-4 h-4 text-slate-300" />
                <span className="hidden sm:inline">Print View</span>
              </button>
            </>
          )}

          <button
            onClick={onNewDraftClick}
            className="px-4 py-2.5 text-xs font-bold text-slate-200 bg-[#101c36] hover:bg-[#18284d] border border-[#1e325c] rounded-xl transition-all min-h-[44px] flex items-center gap-1.5 active:scale-95"
          >
            <span>+ Create Draft</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="space-y-3 p-4 rounded-2xl bg-[#0b1325] border border-[#18284d]">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved drafts by title, keyword, url, or hashtag..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#070c18] border border-[#18284d] focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-sm text-slate-100 placeholder-slate-500 transition-colors"
          />
        </div>

        {/* 5 Channels & Tone Filters (Requirement 2 & 6) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#18284d]/60">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[11px] font-medium text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-amber-400" />
              <span>Channel:</span>
            </span>
            {[
              { id: 'all' as const, label: 'All' },
              { id: 'linkedin' as const, label: 'LinkedIn' },
              { id: 'x' as const, label: 'X (Twitter)' },
              { id: 'threads' as const, label: 'Threads' },
              { id: 'instagram' as const, label: 'Instagram' },
              { id: 'facebook' as const, label: 'Facebook' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPlatformFilter(item.id)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors min-h-[34px] ${
                  platformFilter === item.id
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#101c36]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] text-slate-400">Tone:</span>
            <select
              value={toneFilter}
              onChange={(e) => setToneFilter(e.target.value)}
              className="bg-[#070c18] border border-[#18284d] rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:border-amber-400 focus:outline-none min-h-[34px]"
            >
              <option value="all">All Tones</option>
              <option value="authoritative">Authoritative</option>
              <option value="conversational">Conversational</option>
              <option value="high-energy">High-Energy</option>
              <option value="executive">Executive</option>
              <option value="provocative">Provocative</option>
            </select>
          </div>
        </div>
      </div>

      {/* Drafts List */}
      {filteredDrafts.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-[#0b1325] border border-dashed border-[#18284d] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#101c36] text-amber-400 flex items-center justify-center mx-auto">
            <BookmarkCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">No matching drafts</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery || platformFilter !== 'all' || toneFilter !== 'all'
                ? 'No drafts matched your filter criteria. Try resetting filters or search.'
                : 'You have not saved any drafts yet. Generate and save a campaign to start building your vault.'}
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setPlatformFilter('all');
              setToneFilter('all');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-300 bg-[#101c36] hover:bg-[#18284d] rounded-xl transition-all"
          >
            <span>Reset Search & Filters</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDrafts.map((draft) => {
            const isExpanded = expandedDraftId === draft.id;
            const currentVersionKey = expandedVersions[draft.id] || 'versionA';

            return (
              <div
                key={draft.id}
                className={`rounded-2xl bg-[#0b1325] border transition-all ${
                  isExpanded
                    ? 'border-amber-500/40 shadow-lg shadow-black/40'
                    : 'border-[#18284d] hover:border-[#1e325c]'
                }`}
              >
                {/* Draft Card Main Summary */}
                <div className="p-5 md:p-6 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span className="capitalize text-amber-400 font-medium">
                          {draft.tone} tone
                        </span>
                        <span>·</span>
                        <span className="capitalize text-slate-300 font-medium">
                          {draft.contentLength || 'standard'} length
                        </span>
                        <span>·</span>
                        <span className="capitalize text-slate-400 font-medium">
                          {draft.focusAngle}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {new Date(draft.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <h2 className="font-['Outfit'] text-base md:text-lg font-bold text-white leading-snug">
                        {draft.title}
                      </h2>
                    </div>

                    {/* Actions: Export PDF, TXT, Edit & Delete */}
                    <div className="flex items-center gap-1 self-end sm:self-auto shrink-0">
                      <button
                        onClick={() => handleDownloadSinglePdf(draft)}
                        title="Download Campaign as PDF (Reading & Print)"
                        className="p-2 text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                      >
                        <FileText className="w-4 h-4 text-amber-400" />
                      </button>
                      <button
                        onClick={() => handleExportDraft(draft)}
                        title="Download Campaign as .TXT"
                        className="p-2 text-slate-400 hover:text-amber-400 hover:bg-[#101c36] rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(draft)}
                        title="Edit Draft"
                        className="p-2 text-slate-400 hover:text-amber-400 hover:bg-[#101c36] rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDraftToDelete(draft)}
                        title="Delete Draft"
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {draft.summary && (
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed line-clamp-2">
                      {draft.summary}
                    </p>
                  )}

                  {draft.url && (
                    <div className="flex items-center gap-1.5 text-xs text-sky-400 break-all pt-0.5">
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      <a
                        href={draft.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline truncate max-w-full"
                      >
                        {draft.url}
                      </a>
                    </div>
                  )}

                  {/* 5 Quick Copy Buttons Directly on Card (Requirement 2) */}
                  <div className="pt-3 border-t border-[#18284d]/60 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-slate-400 font-medium mr-1">Copy:</span>
                      {[
                        { key: 'linkedin' as PlatformKey, label: 'LinkedIn', code: 'LI' },
                        { key: 'x' as PlatformKey, label: 'X', code: 'X' },
                        { key: 'threads' as PlatformKey, label: 'Threads', code: 'TH' },
                        { key: 'instagram' as PlatformKey, label: 'Instagram', code: 'IG' },
                        { key: 'facebook' as PlatformKey, label: 'Facebook', code: 'FB' },
                      ].map((p) => {
                        const postText = getPlatformPostText(draft.platforms?.[p.key], currentVersionKey);
                        return (
                          <button
                            key={p.key}
                            onClick={() => handleCopy(postText, p.label, draft.id)}
                            className="px-2.5 py-1.5 text-xs font-semibold bg-[#101c36] hover:bg-amber-400 hover:text-slate-950 text-slate-200 rounded-lg transition-colors flex items-center gap-1 min-h-[38px] active:scale-95"
                          >
                            {copiedKey === `${draft.id}-${p.label}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{p.code}</span>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setExpandedDraftId(isExpanded ? null : draft.id)}
                      className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors min-h-[38px] px-2"
                    >
                      <span>{isExpanded ? 'Hide Previews' : 'Expand All Channels'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Platform Detail Accordion */}
                {isExpanded && draft.platforms && (
                  <div className="bg-[#070c18] border-t border-[#18284d] p-4 md:p-6 space-y-4 animate-in fade-in duration-150">
                    {/* Version Switcher (Requirement 3) */}
                    <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-[#0b1325] border border-[#18284d] rounded-xl text-xs">
                      <span className="font-semibold text-slate-300">View Version:</span>
                      <div className="flex items-center gap-1.5">
                        {[
                          { key: 'versionA' as ContentVersionKey, label: 'Ver A: Professional' },
                          { key: 'versionB' as ContentVersionKey, label: 'Ver B: Strong Engagement' },
                          { key: 'versionC' as ContentVersionKey, label: 'Ver C: Short & Powerful' },
                        ].map((v) => (
                          <button
                            key={v.key}
                            type="button"
                            onClick={() =>
                              setExpandedVersions((prev) => ({ ...prev, [draft.id]: v.key }))
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                              currentVersionKey === v.key
                                ? 'bg-amber-400 text-slate-950 font-bold'
                                : 'text-slate-400 hover:text-white bg-[#070c18]'
                            }`}
                          >
                            {v.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 5 Platform Previews Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* LinkedIn */}
                      <div className="p-4 rounded-xl bg-[#0b1325] border border-[#18284d] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-sky-400 font-mono">[LI] LinkedIn</span>
                          <button
                            onClick={() =>
                              handleCopy(
                                getPlatformPostText(draft.platforms?.linkedin, currentVersionKey),
                                'LinkedIn',
                                draft.id
                              )
                            }
                            className="text-xs text-amber-400 hover:underline flex items-center gap-1 min-h-[32px] px-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto pr-1">
                          {getPlatformPostText(draft.platforms?.linkedin, currentVersionKey)}
                        </p>
                      </div>

                      {/* X */}
                      <div className="p-4 rounded-xl bg-[#0b1325] border border-[#18284d] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200 font-mono">[X] X (Twitter)</span>
                          <button
                            onClick={() =>
                              handleCopy(
                                getPlatformPostText(draft.platforms?.x, currentVersionKey),
                                'X',
                                draft.id
                              )
                            }
                            className="text-xs text-amber-400 hover:underline flex items-center gap-1 min-h-[32px] px-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto pr-1">
                          {getPlatformPostText(draft.platforms?.x, currentVersionKey)}
                        </p>
                      </div>

                      {/* Threads (Requirement 2) */}
                      <div className="p-4 rounded-xl bg-[#0b1325] border border-[#18284d] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-purple-400 font-mono">[TH] Threads</span>
                          <button
                            onClick={() =>
                              handleCopy(
                                getPlatformPostText(draft.platforms?.threads, currentVersionKey),
                                'Threads',
                                draft.id
                              )
                            }
                            className="text-xs text-amber-400 hover:underline flex items-center gap-1 min-h-[32px] px-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto pr-1">
                          {getPlatformPostText(draft.platforms?.threads, currentVersionKey)}
                        </p>
                      </div>

                      {/* Instagram */}
                      <div className="p-4 rounded-xl bg-[#0b1325] border border-[#18284d] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-pink-400 font-mono">[IG] Instagram</span>
                          <button
                            onClick={() =>
                              handleCopy(
                                getPlatformPostText(draft.platforms?.instagram, currentVersionKey),
                                'Instagram',
                                draft.id
                              )
                            }
                            className="text-xs text-amber-400 hover:underline flex items-center gap-1 min-h-[32px] px-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto pr-1">
                          {getPlatformPostText(draft.platforms?.instagram, currentVersionKey)}
                        </p>
                      </div>

                      {/* Facebook */}
                      <div className="p-4 rounded-xl bg-[#0b1325] border border-[#18284d] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-400 font-mono">[FB] Facebook</span>
                          <button
                            onClick={() =>
                              handleCopy(
                                getPlatformPostText(draft.platforms?.facebook, currentVersionKey),
                                'Facebook',
                                draft.id
                              )
                            }
                            className="text-xs text-amber-400 hover:underline flex items-center gap-1 min-h-[32px] px-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto pr-1">
                          {getPlatformPostText(draft.platforms?.facebook, currentVersionKey)}
                        </p>
                      </div>
                    </div>

                    {/* Instagram 6-Slide Carousel Script Display if available (Requirement 4) */}
                    {draft.platforms?.instagram?.carouselScript && draft.platforms.instagram.carouselScript.length > 0 && (
                      <div className="p-4 rounded-xl bg-[#0b1325] border border-pink-500/20 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 font-bold text-pink-400">
                            <Layers className="w-4 h-4 text-pink-400" />
                            <span>Instagram 6-Slide Carousel Script</span>
                          </div>
                          <button
                            onClick={async () => {
                              const scriptText = draft.platforms.instagram.carouselScript.map((s) =>
                                `Slide ${s.slideNumber}: ${s.headline}\n${s.supportingText}\nVisual: ${s.visualSuggestion}\nHook: ${s.transitionHook}`
                              ).join('\n\n');
                              await copyToClipboard(scriptText);
                              showToast('info', '6-Slide Carousel Script Copied');
                            }}
                            className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy 6-Slide Script</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                          {draft.platforms.instagram.carouselScript.map((s) => (
                            <div key={s.slideNumber} className="p-2.5 rounded-lg bg-[#070c18] border border-[#18284d] space-y-1">
                              <span className="text-[10px] font-bold text-amber-400 font-mono">Slide {s.slideNumber}:</span>
                              <div className="font-semibold text-white">{s.headline}</div>
                              <p className="text-slate-300 text-[11px]">{s.supportingText}</p>
                              <div className="text-[10px] text-slate-400 italic pt-0.5">Visual: {s.visualSuggestion}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {draftToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0b1325] border border-rose-500/30 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="font-['Outfit'] font-bold text-white text-base">
                  Delete Saved Draft?
                </h3>
                <p className="text-xs text-slate-400">
                  This action permanently removes this campaign from your vault.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-medium bg-[#070c18] p-3 rounded-xl border border-[#18284d]">
              "{draftToDelete.title}"
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDraftToDelete(null)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#101c36] rounded-xl transition-colors min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="px-4 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-md shadow-rose-900/30 min-h-[44px]"
              >
                {isDeleting ? 'Deleting...' : 'Delete Draft'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Draft Modal with Preserved Multi-Platform & Version Edits */}
      {editingDraft && editPlatforms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 md:p-6 rounded-2xl md:rounded-3xl bg-[#0b1325] border border-amber-500/30 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#18284d]">
              <div>
                <h3 className="font-['Outfit'] font-bold text-white text-lg">
                  Edit Vault Draft (V2.0)
                </h3>
                <p className="text-xs text-slate-400">
                  Fine-tune article details, channels, and specific version copy
                </p>
              </div>
              <button
                onClick={() => setEditingDraft(null)}
                className="text-slate-400 hover:text-white text-sm min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-200">Draft Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#070c18] border border-[#18284d] focus:border-amber-400 rounded-xl text-sm text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-200">Article URL</label>
                <input
                  type="text"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 bg-[#070c18] border border-[#18284d] focus:border-amber-400 rounded-xl text-xs text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-200">Article Summary</label>
                <textarea
                  rows={2}
                  value={editSummary}
                  onChange={(e) => setEditSummary(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#070c18] border border-[#18284d] focus:border-amber-400 rounded-xl text-xs text-slate-100 resize-none"
                />
              </div>

              {/* Channel Selector for text editing (All 5 platforms) */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-200">
                  Select Channel to Modify:
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['linkedin', 'x', 'threads', 'instagram', 'facebook'] as PlatformKey[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setEditPlatformKey(p)}
                      className={`py-2 px-1 rounded-xl text-xs font-semibold capitalize transition-all min-h-[40px] truncate ${
                        editPlatformKey === p
                          ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                          : 'bg-[#070c18] text-slate-400 hover:text-white border border-[#18284d]'
                      }`}
                    >
                      {p === 'x' ? 'X' : p}
                    </button>
                  ))}
                </div>

                {/* Version Selector inside modal */}
                <div className="flex items-center gap-1.5 pt-1">
                  {(['versionA', 'versionB', 'versionC'] as ContentVersionKey[]).map((vk) => (
                    <button
                      key={vk}
                      type="button"
                      onClick={() => setEditVersionKey(vk)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                        editVersionKey === vk
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'bg-[#070c18] text-slate-400 hover:text-white border border-[#18284d]'
                      }`}
                    >
                      {vk.replace('version', 'Version ')}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={7}
                  value={getPlatformPostText(editPlatforms[editPlatformKey], editVersionKey)}
                  onChange={(e) => handleEditPlatformTextChange(e.target.value)}
                  className="w-full p-3.5 bg-[#070c18] border border-amber-500/40 rounded-xl text-xs md:text-sm text-slate-100 font-sans leading-relaxed resize-y"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#18284d]">
              <button
                type="button"
                onClick={() => setEditingDraft(null)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#101c36] rounded-xl transition-colors min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSavingEdit}
                onClick={handleSaveEdit}
                className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md shadow-amber-500/20 min-h-[44px]"
              >
                {isSavingEdit ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
