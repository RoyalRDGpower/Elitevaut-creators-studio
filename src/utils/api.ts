import { Draft, PlatformsData, ToneType, FocusAngleType } from '../types';

const LOCAL_STORAGE_KEY = 'elite_hustle_vault_drafts';

function getLocalDrafts(): Draft[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed reading local drafts', e);
  }
  return [];
}

function setLocalDrafts(drafts: Draft[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(drafts));
  } catch (e) {
    console.error('Failed writing local drafts', e);
  }
}

export async function extractUrlData(url: string): Promise<{ url: string; title: string; summary: string }> {
  const res = await fetch('/api/extract-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to extract content from the URL.');
  }

  return res.json();
}

export async function generateSocialContent(params: {
  title: string;
  summary: string;
  url: string;
  tone: ToneType;
  focusAngle: FocusAngleType;
  targetAudience?: string;
}): Promise<PlatformsData> {
  const res = await fetch('/api/generate-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate content. Please verify your inputs.');
  }

  const data = await res.json();
  return data.data;
}

export async function fetchDrafts(): Promise<Draft[]> {
  try {
    const res = await fetch('/api/drafts');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.drafts)) {
        // Sync local cache with server (including empty state!)
        setLocalDrafts(data.drafts);
        return data.drafts;
      }
    }
  } catch (err) {
    console.warn('Backend drafts fetch failed, using local backup', err);
  }

  // Fallback to local storage if network or offline
  return getLocalDrafts();
}

export async function saveDraft(draft: Omit<Draft, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<Draft> {
  const isUpdate = !!draft.id;
  const draftId = draft.id || ('draft-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6));

  try {
    const url = isUpdate ? `/api/drafts/${draft.id}` : '/api/drafts';
    const method = isUpdate ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...draft, id: draftId }),
    });

    if (res.ok) {
      const data = await res.json();
      const savedDraft: Draft = data.draft;
      // Sync local storage directly without duplicate fetch
      const current = getLocalDrafts();
      const updated = current.some((d) => d.id === savedDraft.id)
        ? current.map((d) => (d.id === savedDraft.id ? savedDraft : d))
        : [savedDraft, ...current.filter((d) => d.id !== savedDraft.id)];
      setLocalDrafts(updated);
      return savedDraft;
    }
  } catch (err) {
    console.warn('Backend save draft failed, saving locally', err);
  }

  // Local fallback creation
  const now = new Date().toISOString();
  const fallbackDraft: Draft = {
    id: draftId,
    title: draft.title,
    summary: draft.summary,
    url: draft.url,
    tone: draft.tone,
    focusAngle: draft.focusAngle,
    platforms: draft.platforms,
    createdAt: (draft as any).createdAt || now,
    updatedAt: now,
  };

  const current = getLocalDrafts();
  const updated = current.some((d) => d.id === fallbackDraft.id)
    ? current.map((d) => (d.id === fallbackDraft.id ? fallbackDraft : d))
    : [fallbackDraft, ...current];
  setLocalDrafts(updated);
  return fallbackDraft;
}

export async function deleteDraft(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/drafts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      const current = getLocalDrafts();
      const filtered = current.filter((d) => d.id !== id);
      setLocalDrafts(filtered);
      return true;
    }
  } catch (err) {
    console.warn('Backend delete draft failed, updating locally', err);
  }

  const current = getLocalDrafts();
  const filtered = current.filter((d) => d.id !== id);
  setLocalDrafts(filtered);
  return true;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers or iframes
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    textArea.remove();
    return successful;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}
