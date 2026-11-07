import { Draft, PlatformsData, ToneType, FocusAngleType } from '../types';

const LOCAL_STORAGE_KEY = 'elite_hustle_vault_drafts';

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
      if (Array.isArray(data.drafts) && data.drafts.length > 0) {
        // Cache to local storage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.drafts));
        return data.drafts;
      }
    }
  } catch (err) {
    console.warn('Backend drafts fetch failed, using local backup', err);
  }

  // Fallback to local storage
  const local = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error('Error parsing local drafts', e);
    }
  }
  return [];
}

export async function saveDraft(draft: Omit<Draft, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<Draft> {
  try {
    const isUpdate = !!draft.id;
    const url = isUpdate ? `/api/drafts/${draft.id}` : '/api/drafts';
    const method = isUpdate ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });

    if (res.ok) {
      const data = await res.json();
      const savedDraft: Draft = data.draft;
      // Sync local storage
      const current = await fetchDrafts();
      const updated = isUpdate
        ? current.map((d) => (d.id === savedDraft.id ? savedDraft : d))
        : [savedDraft, ...current.filter((d) => d.id !== savedDraft.id)];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return savedDraft;
    }
  } catch (err) {
    console.warn('Backend save draft failed, saving locally', err);
  }

  // Local fallback creation
  const now = new Date().toISOString();
  const fallbackDraft: Draft = {
    id: draft.id || 'draft-local-' + Date.now(),
    title: draft.title,
    summary: draft.summary,
    url: draft.url,
    tone: draft.tone,
    focusAngle: draft.focusAngle,
    platforms: draft.platforms,
    createdAt: now,
    updatedAt: now,
  };

  const local = localStorage.getItem(LOCAL_STORAGE_KEY);
  let drafts: Draft[] = [];
  if (local) {
    try {
      drafts = JSON.parse(local);
    } catch {}
  }

  if (draft.id) {
    drafts = drafts.map((d) => (d.id === draft.id ? fallbackDraft : d));
  } else {
    drafts.unshift(fallbackDraft);
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(drafts));
  return fallbackDraft;
}

export async function deleteDraft(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/drafts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      const current = await fetchDrafts();
      const filtered = current.filter((d) => d.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
      return true;
    }
  } catch (err) {
    console.warn('Backend delete draft failed, updating locally', err);
  }

  const local = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (local) {
    try {
      const drafts: Draft[] = JSON.parse(local);
      const filtered = drafts.filter((d) => d.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch {}
  }
  return false;
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
