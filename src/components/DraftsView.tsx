import React, { useState, useEffect } from 'react';
import { Draft, PlatformKey, PlatformsData } from '../types';
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
  Share2,
  Filter,
} from 'lucide-react';
import { deleteDraft, saveDraft, copyToClipboard } from '../utils/api';

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

  // Auto-expand if selectedDraftId changes
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
  const [editPlatforms, setEditPlatforms] = useState<PlatformsData | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Copy handler
  const handleCopy = async (text: string, label: string, draftId: string) => {
    if (!text) {
      showToast('error', `No ${label} content available to copy.`);
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
    // Deep clone platforms to preserve edits across platform tabs
    setEditPlatforms(JSON.parse(JSON.stringify(draft.platforms || {})));
  };

  // Update specific platform text in edit modal
  const handleEditPlatformTextChange = (text: string) => {
    if (!editPlatforms) return;
    setEditPlatforms((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [editPlatformKey]: {
          ...prev[editPlatformKey],
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

  // Download single draft as .TXT package
  const handleExportDraft = (draft: Draft) => {
    const textContent = `ELITE HUSTLE CONTENT STUDIO - VAULT CAMPAIGN\n` +
      `Title: ${draft.title}\n` +
      `URL: ${draft.url || 'N/A'}\n` +
      `Tone: ${draft.tone} | Focus: ${draft.focusAngle}\n` +
      `Saved: ${new Date(draft.createdAt).toLocaleString()}\n` +
      `==================================================\n\n` +
      `1. LINKEDIN DRAFT\n-----------------\n${draft.platforms?.linkedin?.fullPost || 'N/A'}\n\n` +
      `2. X (TWITTER) DRAFT\n--------------------\n${draft.platforms?.x?.fullPost || 'N/A'}\n\n` +
      `3. INSTAGRAM DRAFT\n-------------------\n${draft.platforms?.instagram?.fullPost || 'N/A'}\n\n` +
      `4. FACEBOOK DRAFT\n------------------\n${draft.platforms?.facebook?.fullPost || 'N/A'}\n`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${draft.title.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_campaign.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
    showToast('info', 'Campaign Exported', 'Downloaded as text file.');
  };

  // Filtered Drafts
  const filteredDrafts = drafts.filter((draft) => {
    const matchesSearch =
      !searchQuery.trim() ||
      draft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      draft.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (draft.url && draft.url.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (draft.platforms &&
        JSON.stringify(draft.platforms).toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTone = toneFilter === 'all' || draft.tone === toneFilter;

    const matchesPlatform =
      platformFilter === 'all' ||
      Boolean(draft.platforms && draft.platforms[platformFilter]?.fullPost);

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
            Manage, edit, export, and copy all promotional assets for Elite Hustle Vault Central.
          </p>
        </div>

        <button
          onClick={onNewDraftClick}
          className="self-start sm:self-auto px-4 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-md shadow-amber-500/20 min-h-[44px] flex items-center gap-1.5 active:scale-95"
        >
          <span>+ Create New Draft</span>
        </button>
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

        {/* Platform & Tone Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#18284d]/60">
          {/* Platform Segmented Tabs */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[11px] font-medium text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-amber-400" />
              <span>Channel:</span>
            </span>
            {[
              { id: 'all' as const, label: 'All Channels' },
              { id: 'linkedin' as const, label: 'LinkedIn' },
              { id: 'x' as const, label: 'X (Twitter)' },
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

          {/* Tone Filter */}
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

                    {/* Actions: Export, Edit & Delete */}
                    <div className="flex items-center gap-1 self-end sm:self-auto shrink-0">
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

                  {/* 4 Quick Copy Buttons Directly on Card */}
                  <div className="pt-3 border-t border-[#18284d]/60 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-slate-400 font-medium mr-1">Copy:</span>
                      <button
                        onClick={() =>
                          handleCopy(draft.platforms?.linkedin?.fullPost || '', 'LinkedIn', draft.id)
                        }
                        className="px-2.5 py-1.5 text-xs font-semibold bg-[#101c36] hover:bg-amber-400 hover:text-slate-950 text-slate-200 rounded-lg transition-colors flex items-center gap-1 min-h-[38px] active:scale-95"
                      >
                        {copiedKey === `${draft.id}-LinkedIn` ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>LinkedIn</span>
                      </button>

                      <button
                        onClick={() =>
                          handleCopy(draft.platforms?.x?.fullPost || '', 'X', draft.id)
                        }
                        className="px-2.5 py-1.5 text-xs font-semibold bg-[#101c36] hover:bg-amber-400 hover:text-slate-950 text-slate-200 rounded-lg transition-colors flex items-center gap-1 min-h-[38px] active:scale-95"
                      >
                        {copiedKey === `${draft.id}-X` ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>X</span>
                      </button>

                      <button
                        onClick={() =>
                          handleCopy(draft.platforms?.instagram?.fullPost || '', 'Instagram', draft.id)
                        }
                        className="px-2.5 py-1.5 text-xs font-semibold bg-[#101c36] hover:bg-amber-400 hover:text-slate-950 text-slate-200 rounded-lg transition-colors flex items-center gap-1 min-h-[38px] active:scale-95"
                      >
                        {copiedKey === `${draft.id}-Instagram` ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>Instagram</span>
                      </button>

                      <button
                        onClick={() =>
                          handleCopy(draft.platforms?.facebook?.fullPost || '', 'Facebook', draft.id)
                        }
                        className="px-2.5 py-1.5 text-xs font-semibold bg-[#101c36] hover:bg-amber-400 hover:text-slate-950 text-slate-200 rounded-lg transition-colors flex items-center gap-1 min-h-[38px] active:scale-95"
                      >
                        {copiedKey === `${draft.id}-Facebook` ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>Facebook</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setExpandedDraftId(isExpanded ? null : draft.id)}
                      className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors min-h-[38px] px-2"
                    >
                      <span>{isExpanded ? 'Hide Previews' : 'Expand All Posts'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Platform Detail Accordion */}
                {isExpanded && draft.platforms && (
                  <div className="bg-[#070c18] border-t border-[#18284d] p-4 md:p-6 space-y-4 animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* LinkedIn */}
                      <div className="p-4 rounded-xl bg-[#0b1325] border border-[#18284d] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-sky-400 font-mono">[LI] LinkedIn</span>
                          <button
                            onClick={() => handleCopy(draft.platforms.linkedin?.fullPost || '', 'LinkedIn', draft.id)}
                            className="text-xs text-amber-400 hover:underline flex items-center gap-1 min-h-[32px] px-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto pr-1">
                          {draft.platforms.linkedin?.fullPost || 'No LinkedIn copy generated.'}
                        </p>
                      </div>

                      {/* X */}
                      <div className="p-4 rounded-xl bg-[#0b1325] border border-[#18284d] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200 font-mono">[X] X (Twitter)</span>
                          <button
                            onClick={() => handleCopy(draft.platforms.x?.fullPost || '', 'X', draft.id)}
                            className="text-xs text-amber-400 hover:underline flex items-center gap-1 min-h-[32px] px-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto pr-1">
                          {draft.platforms.x?.fullPost || 'No X copy generated.'}
                        </p>
                      </div>

                      {/* Instagram */}
                      <div className="p-4 rounded-xl bg-[#0b1325] border border-[#18284d] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-pink-400 font-mono">[IG] Instagram</span>
                          <button
                            onClick={() => handleCopy(draft.platforms.instagram?.fullPost || '', 'Instagram', draft.id)}
                            className="text-xs text-amber-400 hover:underline flex items-center gap-1 min-h-[32px] px-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto pr-1">
                          {draft.platforms.instagram?.fullPost || 'No Instagram copy generated.'}
                        </p>
                      </div>

                      {/* Facebook */}
                      <div className="p-4 rounded-xl bg-[#0b1325] border border-[#18284d] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-400 font-mono">[FB] Facebook</span>
                          <button
                            onClick={() => handleCopy(draft.platforms.facebook?.fullPost || '', 'Facebook', draft.id)}
                            className="text-xs text-amber-400 hover:underline flex items-center gap-1 min-h-[32px] px-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto pr-1">
                          {draft.platforms.facebook?.fullPost || 'No Facebook copy generated.'}
                        </p>
                      </div>
                    </div>
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

      {/* Edit Draft Modal with Preserved Multi-Platform Edits */}
      {editingDraft && editPlatforms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 md:p-6 rounded-2xl md:rounded-3xl bg-[#0b1325] border border-amber-500/30 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#18284d]">
              <div>
                <h3 className="font-['Outfit'] font-bold text-white text-lg">
                  Edit Vault Draft
                </h3>
                <p className="text-xs text-slate-400">
                  Fine-tune article details and channel copies
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

              {/* Platform Selector for text editing */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-200">
                    Channel Copy to Modify:
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">
                    {editPlatforms[editPlatformKey]?.fullPost?.length || 0} chars
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {(['linkedin', 'x', 'instagram', 'facebook'] as PlatformKey[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setEditPlatformKey(p)}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold capitalize transition-all min-h-[40px] ${
                        editPlatformKey === p
                          ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                          : 'bg-[#070c18] text-slate-400 hover:text-white border border-[#18284d]'
                      }`}
                    >
                      {p === 'x' ? 'X' : p}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={7}
                  value={editPlatforms[editPlatformKey]?.fullPost || ''}
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
