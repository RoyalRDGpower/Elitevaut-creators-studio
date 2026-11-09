import {
  Draft,
  PlatformsData,
  ToneType,
  ContentLengthType,
  FocusAngleType,
  PlatformKey,
  ContentVersionKey,
  ContentVersion,
  ArticleAnalysis,
  StandardPlatformContent,
  InstagramContent,
} from '../types';
import { generateClientSideV2Pack, analyzeArticleClientSide } from './clientGenerator';

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

/**
 * Bulletproof JSON response parser that handles HTML error pages, Cloud Run timeouts,
 * and proxy responses without throwing "Unexpected token '<', <!" syntax errors.
 */
async function parseSafeJson<T>(res: Response, fallbackError: string): Promise<{ ok: boolean; data?: T; error?: string }> {
  let text = '';
  try {
    text = await res.text();
  } catch (e: any) {
    return { ok: false, error: e?.message || fallbackError };
  }

  const trimmed = text.trim();

  // Detect HTML responses (Cloud Run 502/504, Vite SPA fallback, or server error pages)
  const isHtml = trimmed.startsWith('<!doctype') || trimmed.startsWith('<html') || trimmed.startsWith('<!DOCTYPE') || trimmed.includes('<title>');

  if (isHtml) {
    // If the status is 200 but content is HTML, it's a SPA fallback on unmatched route or dev server reload
    const statusNote = res.status !== 200 ? ` (Server status ${res.status})` : '';
    return {
      ok: false,
      error: `Service reached gateway or route boundary${statusNote}. Engaging resilient high-scale generator.`,
    };
  }

  try {
    const json = JSON.parse(trimmed);
    if (!res.ok) {
      return { ok: false, error: json.error || fallbackError };
    }
    return { ok: true, data: json };
  } catch {
    return { ok: false, error: fallbackError };
  }
}

// 1. URL Extraction - strict adherence: if URL cannot be accessed, return error requiring manual text
export async function extractUrlData(url: string): Promise<{
  url: string;
  title: string;
  summary: string;
  fullText?: string;
  analysis?: ArticleAnalysis;
}> {
  try {
    const res = await fetch('/api/extract-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const parsed = await parseSafeJson<any>(
      res,
      'Could not access the URL directly. Please enter or paste the article title and summary manually below.'
    );

    if (!parsed.ok || !parsed.data || parsed.data.accessible === false) {
      throw new Error(
        parsed.error ||
        parsed.data?.error ||
        'The URL could not be accessed directly. Please paste the article text or summary manually below so our analysis is 100% accurate.'
      );
    }

    return parsed.data;
  } catch (err: any) {
    throw new Error(
      err.message ||
      'Could not access the URL directly. Please paste the article title and summary manually below so our analysis is 100% accurate.'
    );
  }
}

// 2. Dedicated Article Analysis Endpoint (with resilient local fallback)
export async function analyzeArticleContent(params: {
  url?: string;
  title?: string;
  text?: string;
}): Promise<ArticleAnalysis> {
  const safeText = params.text || '';
  const safeTitle = params.title || '';
  const safeUrl = params.url || '';

  try {
    const res = await fetch('/api/analyze-article', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const parsed = await parseSafeJson<any>(res, 'Failed to analyze article text.');
    if (parsed.ok && parsed.data?.analysis) {
      return parsed.data.analysis;
    }
  } catch (err) {
    console.warn('Backend article analysis interrupted, utilizing local intelligence engine:', err);
  }

  // Resilient fallback: perform rigorous local analysis distinguishing facts from opinions
  return analyzeArticleClientSide(safeTitle, safeText, safeUrl);
}

// 3. Multi-Platform Generation (V2 with 5 platforms & 3 versions each + 6-slide carousel)
// Guaranteed 100% uptime for maximum scale: seamlessly falls back to resilient client generator
export async function generateSocialContent(params: {
  title: string;
  summary: string;
  articleText?: string;
  url: string;
  tone: ToneType;
  contentLength: ContentLengthType;
  focusAngle: FocusAngleType;
  targetAudience?: string;
}): Promise<PlatformsData> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000);

    const res = await fetch('/api/generate-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    const parsed = await parseSafeJson<any>(res, 'Generation failed on remote server.');
    if (parsed.ok && parsed.data?.data) {
      return parsed.data.data;
    }

    console.warn('Server generation response non-standard, activating resilient client engine:', parsed.error);
  } catch (err) {
    console.warn('Network or server gateway interruption, engaging resilient client engine:', err);
  }

  // Maximum scale guarantee: Generate full 5-channel x 3-version package locally
  return generateClientSideV2Pack({
    title: params.title,
    summary: params.summary,
    url: params.url,
    tone: params.tone,
    contentLength: params.contentLength,
    focusAngle: params.focusAngle,
    targetAudience: params.targetAudience,
  });
}

// 4. Regenerate a Single Platform (preserves edits on all other platforms)
export async function regeneratePlatformContent(params: {
  platform: PlatformKey;
  title: string;
  summary: string;
  articleText?: string;
  url: string;
  tone: ToneType;
  contentLength: ContentLengthType;
  focusAngle: FocusAngleType;
  targetAudience?: string;
  analysis?: ArticleAnalysis;
}): Promise<StandardPlatformContent | InstagramContent> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch('/api/regenerate-platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    const parsed = await parseSafeJson<any>(res, `Failed to regenerate ${params.platform} content.`);
    if (parsed.ok && parsed.data?.data) {
      return parsed.data.data;
    }
  } catch (err) {
    console.warn(`Single platform regenerate interrupted for ${params.platform}, using fallback:`, err);
  }

  // Local fallback for requested platform
  const fullPack = generateClientSideV2Pack({
    title: params.title,
    summary: params.summary,
    url: params.url,
    tone: params.tone,
    contentLength: params.contentLength,
    focusAngle: params.focusAngle,
    targetAudience: params.targetAudience,
  });

  return fullPack[params.platform];
}

// 5. Drafts Persistent Storage
export async function fetchDrafts(): Promise<Draft[]> {
  try {
    const res = await fetch('/api/drafts');
    const parsed = await parseSafeJson<any>(res, 'Failed fetching drafts.');
    if (parsed.ok && Array.isArray(parsed.data?.drafts)) {
      setLocalDrafts(parsed.data.drafts);
      return parsed.data.drafts;
    }
  } catch (err) {
    console.warn('Backend drafts fetch failed, using local backup', err);
  }

  return getLocalDrafts();
}

export async function saveDraft(
  draft: Omit<Draft, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): Promise<Draft> {
  const isUpdate = !!draft.id;
  const draftId = draft.id || 'draft-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);

  try {
    const url = isUpdate ? `/api/drafts/${draft.id}` : '/api/drafts';
    const method = isUpdate ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...draft, id: draftId }),
    });

    const parsed = await parseSafeJson<any>(res, 'Failed to save draft on server.');
    if (parsed.ok && parsed.data?.draft) {
      const savedDraft: Draft = parsed.data.draft;
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

  const now = new Date().toISOString();
  const fallbackDraft: Draft = {
    id: draftId,
    title: draft.title,
    summary: draft.summary,
    url: draft.url,
    tone: draft.tone,
    contentLength: draft.contentLength || 'standard',
    focusAngle: draft.focusAngle,
    platforms: draft.platforms,
    articleAnalysis: draft.articleAnalysis,
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

// 6. Backward-compatibility helper to extract post text across V1 & V2 schema
export function getPlatformPostText(
  platformData?: StandardPlatformContent | InstagramContent | any,
  versionKey: ContentVersionKey = 'versionA'
): string {
  if (!platformData) return '';
  if (platformData.versions && platformData.versions[versionKey]?.fullPost) {
    return platformData.versions[versionKey].fullPost;
  }
  if (platformData.versions?.versionA?.fullPost) {
    return platformData.versions.versionA.fullPost;
  }
  // V1 fallback
  if (typeof platformData.fullPost === 'string') {
    return platformData.fullPost;
  }
  return '';
}

export function getPlatformPostVersion(
  platformData?: StandardPlatformContent | InstagramContent | any,
  versionKey: ContentVersionKey = 'versionA'
): ContentVersion | null {
  if (!platformData) return null;
  if (platformData.versions && platformData.versions[versionKey]) {
    return platformData.versions[versionKey];
  }
  if (platformData.versions?.versionA) {
    return platformData.versions.versionA;
  }
  // Synthesize from V1 if necessary
  if (platformData.fullPost) {
    return {
      version: 'A',
      label: 'Professional',
      hook: platformData.hook || '',
      body: platformData.body || platformData.fullPost,
      callToAction: platformData.callToAction || '',
      hashtags: platformData.hashtags || [],
      fullPost: platformData.fullPost,
      characterCount: platformData.fullPost.length,
    };
  }
  return null;
}
