import React, { useState } from 'react';
import { Draft, PlatformKey } from '../types';
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
  FileText,
  Share2,
} from 'lucide-react';
import { deleteDraft, saveDraft, copyToClipboard } from '../utils/api';

interface DraftsViewProps {
  drafts: Draft[];
  onDraftDeleted: (id: string) => void;
  onDraftUpdated: (draft: Draft) => void;
  onNewDraftClick: () => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const DraftsView: React.FC<DraftsViewProps> = ({
  drafts,
  onDraftDeleted,
  onDraftUpdated,
  onNewDraftClick,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [expandedDraftId, setExpandedDraftId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Delete Confirmation State
  const [draftToDelete, setDraftToDelete] = useState<Draft | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit Modal State
  const [editingDraft, setEditingDraft] = useState<Draft | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editPlatformKey, setEditPlatformKey] = useState<PlatformKey>('linkedin');
  const [editPlatformText, setEditPlatformText] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Copy handler
  const handleCopy = async (text: string, label: string, draftId: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedKey(`${draftId}-${label}`);
      showToast('success', `Copied ${label}!`, 'Ready to paste directly into social channels.');
      setTimeout(() => setCopiedKey(null), 2000);
    } else {
      showToast('error', 'Failed to copy to clipboard.');
    }
  };

  // Open Edit Modal
  const openEditModal = (draft: Draft) => {
    setEditingDraft(draft);
    setEditTitle(draft.title);
    setEditSummary(draft.summary);
    setEditPlatformKey('linkedin');
    setEditPlatformText(draft.platforms?.linkedin?.fullPost || '');
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
      const updatedPlatforms = { ...editingDraft.platforms };
      if (editPlatformKey === 'facebook' && updatedPlatforms.facebook) {
        updatedPlatforms.facebook = { ...updatedPlatforms.facebook, fullPost: editPlatformText };
      } else if (editPlatformKey === 'instagram' && updatedPlatforms.instagram) {
        updatedPlatforms.instagram = { ...updatedPlatforms.instagram, fullPost: editPlatformText };
      } else if (editPlatformKey === 'linkedin' && updatedPlatforms.linkedin) {
        updatedPlatforms.linkedin = { ...updatedPlatforms.linkedin, fullPost: editPlatformText };
      } else if (editPlatformKey === 'x' && updatedPlatforms.x) {
        updatedPlatforms.x = { ...updatedPlatforms.x, fullPost: editPlatformText };
      }

      const updated = await saveDraft({
        ...editingDraft,
        title: editTitle.trim(),
        summary: editSummary.trim(),
        platforms: updatedPlatforms,
      });

      onDraftUpdated(updated);
      setEditingDraft(null);
      showToast('success', 'Draft Updated Successfully!');
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

  // Filtered Drafts
  const filteredDrafts = drafts.filter((draft) => {
    const matchesSearch =
      draft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      draft.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (draft.platforms &&
        JSON.stringify(draft.platforms).toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
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
            Manage, edit, and copy all generated promotional assets for Elite Hustle Vault Central.
          </p>
        </div>

        <button
          onClick={onNewDraftClick}
          className="self-start sm:self-auto px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md shadow-amber-500/20 min-h-[40px] flex items-center gap-1.5"
        >
          <span>+ Create New Draft</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved drafts by title, keyword, or hashtag..."
            className="w-full pl-10 pr-4 py-3 bg-[#0b1325] border border-[#18284d] focus:border-amber-400 rounded-xl text-sm text-slate-100 placeholder-slate-500 transition-colors"
          />
        </div>
      </div>

      {/* Drafts List */}
      {filteredDrafts.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-[#0b1325] border border-dashed border-[#18284d] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#101c36] text-amber-400 flex items-center justify-center mx-auto">
            <BookmarkCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">No drafts found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery
                ? 'No drafts matched your search query. Try a different keyword.'
                : 'You have not saved any drafts yet. Generate and save a campaign to start building your vault.'}
            </p>
          </div>
          <button
            onClick={onNewDraftClick}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all"
          >
            <span>Launch Generator</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDrafts.map((draft) => {
            const isExpanded = expandedDraftId === draft.id;
            return (
              <div
                key={draft.id}
                className="rounded-2xl bg-[#0b1325] border border-[#18284d] overflow-hidden transition-all hover:border-[#1e325c]"
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
                          {new Date(draft.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h2 className="font-['Outfit'] text-base md:text-lg font-bold text-white">
                        {draft.title}
                      </h2>
                    </div>

                    {/* Actions: Edit & Delete */}
                    <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                      <button
                        onClick={() => openEditModal(draft)}
                        title="Edit Draft"
                        className="p-2 text-slate-400 hover:text-amber-400 hover:bg-[#101c36] rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDraftToDelete(draft)}
                        title="Delete Draft"
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed line-clamp-2">
                    {draft.summary}
                  </p>

                  {draft.url && (
                    <div className="flex items-center gap-1.5 text-xs text-sky-400 break-all pt-1">
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <a
                        href={draft.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        {draft.url}
                      </a>
                    </div>
                  )}

                  {/* 4 Quick Copy Buttons Directly on Card */}
                  <div className="pt-3 border-t border-[#18284d]/60 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400 font-medium mr-1">Copy:</span>
                      <button
                        onClick={() =>
                          handleCopy(draft.platforms?.linkedin?.fullPost || '', 'LinkedIn', draft.id)
                        }
                        className="px-2.5 py-1 text-xs font-semibold bg-[#101c36] hover:bg-amber-400 hover:text-slate-950 text-slate-200 rounded-lg transition-colors flex items-center gap-1 min-h-[34px]"
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
                        className="px-2.5 py-1 text-xs font-semibold bg-[#101c36] hover:bg-amber-400 hover:text-slate-950 text-slate-200 rounded-lg transition-colors flex items-center gap-1 min-h-[34px]"
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
                        className="px-2.5 py-1 text-xs font-semibold bg-[#101c36] hover:bg-amber-400 hover:text-slate-950 text-slate-200 rounded-lg transition-colors flex items-center gap-1 min-h-[34px]"
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
                        className="px-2.5 py-1 text-xs font-semibold bg-[#101c36] hover:bg-amber-400 hover:text-slate-950 text-slate-200 rounded-lg transition-colors flex items-center gap-1 min-h-[34px]"
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
                      className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors min-h-[34px] px-2"
                    >
                      <span>{isExpanded ? 'Hide Previews' : 'Expand All Posts'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Platform Detail Accordion */}
                {isExpanded && draft.platforms && (
                  <div className="bg-[#070c18] border-t border-[#18284d] p-5 space-y-4 animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* LinkedIn */}
                      <div className="p-4 rounded-xl bg-[#0b1325] border border-[#18284d] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-sky-400 font-mono">[LI] LinkedIn</span>
                          <button
                            onClick={() => handleCopy(draft.platforms.linkedin.fullPost, 'LinkedIn', draft.id)}
                            className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto pr-1">
                          {draft.platforms.linkedin.fullPost}
                        </p>
                      </div>

                      {/* X */}
                      <div className="p-4 rounded-xl bg-[#0b1325] border border-[#18284d] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200 font-mono">[X] X (Twitter)</span>
                          <button
                            onClick={() => handleCopy(draft.platforms.x.fullPost, 'X', draft.id)}
                            className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto pr-1">
                          {draft.platforms.x.fullPost}
                        </p>
                      </div>

                      {/* Instagram */}
                      <div className="p-4 rounded-xl bg-[#0b1325] border border-[#18284d] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-pink-400 font-mono">[IG] Instagram</span>
                          <button
                            onClick={() => handleCopy(draft.platforms.instagram.fullPost, 'Instagram', draft.id)}
                            className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto pr-1">
                          {draft.platforms.instagram.fullPost}
                        </p>
                      </div>

                      {/* Facebook */}
                      <div className="p-4 rounded-xl bg-[#0b1325] border border-[#18284d] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-400 font-mono">[FB] Facebook</span>
                          <button
                            onClick={() => handleCopy(draft.platforms.facebook.fullPost, 'Facebook', draft.id)}
                            className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto pr-1">
                          {draft.platforms.facebook.fullPost}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0b1325] border border-rose-500/30 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center">
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
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#101c36] rounded-xl transition-colors min-h-[40px]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-md shadow-rose-900/30 min-h-[40px]"
              >
                {isDeleting ? 'Deleting...' : 'Delete Draft'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Draft Modal */}
      {editingDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl bg-[#0b1325] border border-amber-500/30 space-y-4 shadow-2xl">
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
                className="text-slate-400 hover:text-white text-sm"
              >
                Close
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
                <label className="text-xs font-semibold text-slate-200">
                  Platform Copy to Modify:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['linkedin', 'x', 'instagram', 'facebook'] as PlatformKey[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setEditPlatformKey(p);
                        setEditPlatformText(editingDraft.platforms?.[p]?.fullPost || '');
                      }}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                        editPlatformKey === p
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'bg-[#070c18] text-slate-400 hover:text-white border border-[#18284d]'
                      }`}
                    >
                      {p === 'x' ? 'X' : p}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={8}
                  value={editPlatformText}
                  onChange={(e) => setEditPlatformText(e.target.value)}
                  className="w-full p-3 bg-[#070c18] border border-amber-500/40 rounded-xl text-xs text-slate-100 font-sans leading-relaxed resize-y"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#18284d]">
              <button
                type="button"
                onClick={() => setEditingDraft(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#101c36] rounded-xl transition-colors min-h-[40px]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSavingEdit}
                onClick={handleSaveEdit}
                className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md shadow-amber-500/20 min-h-[40px]"
              >
                {isSavingEdit ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
