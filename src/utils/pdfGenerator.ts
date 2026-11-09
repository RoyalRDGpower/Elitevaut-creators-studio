import { jsPDF } from 'jspdf';
import { Draft, PlatformKey, ContentVersionKey, ContentVersion, CarouselSlide } from '../types';
import { getPlatformPostText } from './api';

const PAGE_WIDTH = 210; // A4 mm
const PAGE_HEIGHT = 297;
const MARGIN_LEFT = 15;
const MARGIN_RIGHT = 15;
const MARGIN_TOP = 20;
const MARGIN_BOTTOM = 20;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT; // 180mm

// Color palette optimized for high-contrast reading and clean printing
const COLOR_PRIMARY = [12, 22, 45] as const; // Deep Navy #0c162d
const COLOR_GOLD = [180, 115, 15] as const; // Gold/Amber #b4730f
const COLOR_TEXT = [30, 41, 59] as const; // Slate 800 #1e293b
const COLOR_MUTED = [100, 116, 139] as const; // Slate 500 #64748b
const COLOR_LIGHT_BG = [248, 250, 252] as const; // Slate 50 #f8fafc
const COLOR_BORDER = [226, 232, 240] as const; // Slate 200 #e2e8f0
const COLOR_WHITE = [255, 255, 255] as const;

class PdfBuilder {
  private doc: jsPDF;
  private y: number = MARGIN_TOP;

  constructor() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });
  }

  private checkPage(neededHeight: number): void {
    if (this.y + neededHeight > PAGE_HEIGHT - MARGIN_BOTTOM) {
      this.doc.addPage();
      this.y = MARGIN_TOP;
      this.drawRunningHeader();
    }
  }

  private drawRunningHeader(): void {
    const prevFont = this.doc.getFont();
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(...COLOR_GOLD);
    this.doc.text('ELITE HUSTLE CONTENT STUDIO', MARGIN_LEFT, 12);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(...COLOR_MUTED);
    this.doc.text('Vault Central · Consolidated Marketing Dossier', MARGIN_LEFT + 55, 12);

    this.doc.setDrawColor(...COLOR_GOLD);
    this.doc.setLineWidth(0.3);
    this.doc.line(MARGIN_LEFT, 14, PAGE_WIDTH - MARGIN_RIGHT, 14);

    this.doc.setFont(prevFont.fontName, prevFont.fontStyle);
  }

  private drawRunningFooters(): void {
    const totalPages = this.doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);

      // Footer divider
      this.doc.setDrawColor(...COLOR_BORDER);
      this.doc.setLineWidth(0.3);
      this.doc.line(MARGIN_LEFT, PAGE_HEIGHT - 12, PAGE_WIDTH - MARGIN_RIGHT, PAGE_HEIGHT - 12);

      // Footer text
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      this.doc.setTextColor(...COLOR_MUTED);
      this.doc.text(
        'Elite Hustle Vault Central · Confidential Social Campaign Assets',
        MARGIN_LEFT,
        PAGE_HEIGHT - 8
      );

      const pageStr = `Page ${i} of ${totalPages}`;
      const pageStrWidth = this.doc.getTextWidth(pageStr);
      this.doc.text(pageStr, PAGE_WIDTH - MARGIN_RIGHT - pageStrWidth, PAGE_HEIGHT - 8);
    }
  }

  public addCoverHeader(draftsCount: number): void {
    this.y = 20;

    // Navy header block
    this.doc.setFillColor(...COLOR_PRIMARY);
    this.doc.rect(MARGIN_LEFT, this.y, CONTENT_WIDTH, 42, 'F');

    // Gold accent stripe
    this.doc.setFillColor(...COLOR_GOLD);
    this.doc.rect(MARGIN_LEFT, this.y, CONTENT_WIDTH, 2.5, 'F');

    // Brand and Title inside block
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.setTextColor(234, 179, 8); // Gold-yellow
    this.doc.text('ELITE HUSTLE VAULT CENTRAL · CONTENT STUDIO V2.0', MARGIN_LEFT + 8, this.y + 11);

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(18);
    this.doc.setTextColor(...COLOR_WHITE);
    this.doc.text('Consolidated Social Media Master Dossier', MARGIN_LEFT + 8, this.y + 22);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(203, 213, 225); // Slate 300
    this.doc.text(
      'Complete Multi-Platform Promotional Campaigns across LinkedIn, X, Threads, Instagram & Facebook',
      MARGIN_LEFT + 8,
      this.y + 30
    );

    const nowStr = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    this.doc.setFontSize(8);
    this.doc.setTextColor(148, 163, 184); // Slate 400
    this.doc.text(
      `Compiled on ${nowStr} · Total Campaigns: ${draftsCount} · 15 Asset Versions + 6-Slide Carousel Script per Project`,
      MARGIN_LEFT + 8,
      this.y + 37
    );

    this.y += 48;
  }

  public addTableOfContents(drafts: Draft[]): void {
    this.checkPage(40);

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12);
    this.doc.setTextColor(...COLOR_PRIMARY);
    this.doc.text('Executive Summary & Draft Directory', MARGIN_LEFT, this.y);
    this.y += 6;

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(...COLOR_MUTED);
    this.doc.text(
      'Quick index of all verified campaigns included in this consolidated report:',
      MARGIN_LEFT,
      this.y
    );
    this.y += 5;

    // Table of contents box
    const boxStartY = this.y;
    drafts.forEach((draft, idx) => {
      this.checkPage(12);
      this.doc.setFillColor(...COLOR_LIGHT_BG);
      this.doc.rect(MARGIN_LEFT, this.y, CONTENT_WIDTH, 9, 'F');
      this.doc.setDrawColor(...COLOR_BORDER);
      this.doc.setLineWidth(0.2);
      this.doc.rect(MARGIN_LEFT, this.y, CONTENT_WIDTH, 9, 'S');

      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8.5);
      this.doc.setTextColor(...COLOR_GOLD);
      this.doc.text(`${idx + 1}.`, MARGIN_LEFT + 3, this.y + 6);

      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(...COLOR_PRIMARY);
      const titleSnippet = draft.title.length > 70 ? draft.title.slice(0, 67) + '...' : draft.title;
      this.doc.text(titleSnippet, MARGIN_LEFT + 9, this.y + 6);

      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(...COLOR_MUTED);
      const meta = `${draft.tone} tone · ${draft.contentLength || 'standard'} · 5 platforms`;
      const metaWidth = this.doc.getTextWidth(meta);
      this.doc.text(meta, PAGE_WIDTH - MARGIN_RIGHT - metaWidth - 3, this.y + 6);

      this.y += 10.5;
    });

    this.y += 5;
  }

  public addDraftSection(draft: Draft, index: number): void {
    // Start major draft project on a new page unless it's page 1 with ample space
    if (this.y > 60) {
      this.doc.addPage();
      this.y = MARGIN_TOP;
      this.drawRunningHeader();
    }

    // Project Header Box
    this.checkPage(30);
    this.doc.setFillColor(...COLOR_PRIMARY);
    this.doc.rect(MARGIN_LEFT, this.y, CONTENT_WIDTH, 22, 'F');

    this.doc.setFillColor(...COLOR_GOLD);
    this.doc.rect(MARGIN_LEFT, this.y, 3, 22, 'F');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(234, 179, 8);
    this.doc.text(`PROJECT ${index + 1} · SOCIAL LAUNCH BLUEPRINT`, MARGIN_LEFT + 6, this.y + 6);

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(11);
    this.doc.setTextColor(...COLOR_WHITE);
    const titleLines = this.doc.splitTextToSize(draft.title, CONTENT_WIDTH - 12);
    this.doc.text(titleLines[0] || draft.title, MARGIN_LEFT + 6, this.y + 13);
    if (titleLines[1]) {
      this.doc.setFontSize(8.5);
      this.doc.text(titleLines[1], MARGIN_LEFT + 6, this.y + 18);
    }

    this.y += 26;

    // Meta Details Stripe
    this.checkPage(12);
    this.doc.setFillColor(...COLOR_LIGHT_BG);
    this.doc.rect(MARGIN_LEFT, this.y, CONTENT_WIDTH, 8, 'F');
    this.doc.setDrawColor(...COLOR_BORDER);
    this.doc.setLineWidth(0.2);
    this.doc.rect(MARGIN_LEFT, this.y, CONTENT_WIDTH, 8, 'S');

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(...COLOR_MUTED);

    const safeUrl = draft.url || 'https://elitehustlevaultcentral.com';
    const cleanUrl = safeUrl.length > 50 ? safeUrl.slice(0, 48) + '...' : safeUrl;
    this.doc.text(`Source URL: ${cleanUrl}`, MARGIN_LEFT + 3, this.y + 5.5);

    const metaRight = `Tone: ${draft.tone.toUpperCase()} | Length: ${(draft.contentLength || 'standard').toUpperCase()} | Created: ${new Date(
      draft.createdAt
    ).toLocaleDateString()}`;
    const metaRightWidth = this.doc.getTextWidth(metaRight);
    this.doc.text(metaRight, PAGE_WIDTH - MARGIN_RIGHT - metaRightWidth - 3, this.y + 5.5);

    this.y += 12;

    // Article Summary & Core Arguments
    this.checkPage(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(...COLOR_PRIMARY);
    this.doc.text('Article Summary & Strategic Thesis', MARGIN_LEFT, this.y);
    this.y += 5;

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(...COLOR_TEXT);
    const summaryLines = this.doc.splitTextToSize(draft.summary, CONTENT_WIDTH);
    this.doc.text(summaryLines, MARGIN_LEFT, this.y);
    this.y += summaryLines.length * 4.2 + 4;

    // Fact Verification Box if analysis available
    if (draft.articleAnalysis) {
      this.renderFactAnalysis(draft.articleAnalysis);
    }

    // 5 Platform Content Sections
    const platforms: PlatformKey[] = ['linkedin', 'x', 'threads', 'instagram', 'facebook'];
    platforms.forEach((platform) => {
      this.renderPlatformContent(platform, draft.platforms?.[platform]);
    });
  }

  private renderFactAnalysis(analysis: NonNullable<Draft['articleAnalysis']>): void {
    this.checkPage(30);

    this.doc.setFillColor(254, 243, 199); // Soft amber tint
    this.doc.roundedRect(MARGIN_LEFT, this.y, CONTENT_WIDTH, 6, 1, 1, 'F');
    this.doc.setDrawColor(245, 158, 11);
    this.doc.setLineWidth(0.3);
    this.doc.roundedRect(MARGIN_LEFT, this.y, CONTENT_WIDTH, 6, 1, 1, 'S');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(146, 64, 14); // Amber 800
    this.doc.text('QUALITY CONTROL: VERIFIED FACTS & ARGUMENTS SEPARATION', MARGIN_LEFT + 4, this.y + 4.2);
    this.y += 8;

    // Verified Facts
    if (analysis.verifiedFactsAndFigures && analysis.verifiedFactsAndFigures.length > 0) {
      this.checkPage(15);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8);
      this.doc.setTextColor(5, 150, 105); // Green 600
      this.doc.text('[V] Verified Facts & Figures (Zero invented statistics):', MARGIN_LEFT, this.y);
      this.y += 4;

      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      this.doc.setTextColor(...COLOR_TEXT);
      analysis.verifiedFactsAndFigures.forEach((fact) => {
        const factLines = this.doc.splitTextToSize(`• ${fact}`, CONTENT_WIDTH - 4);
        this.checkPage(factLines.length * 4);
        this.doc.text(factLines, MARGIN_LEFT + 3, this.y);
        this.y += factLines.length * 3.8;
      });
      this.y += 2;
    }

    // Main Arguments & Opinions
    if (analysis.opinionsAndPerspectives && analysis.opinionsAndPerspectives.length > 0) {
      this.checkPage(15);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8);
      this.doc.setTextColor(217, 119, 6); // Amber 600
      this.doc.text('[~] Subjective Viewpoints & Perspectives:', MARGIN_LEFT, this.y);
      this.y += 4;

      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      this.doc.setTextColor(...COLOR_TEXT);
      analysis.opinionsAndPerspectives.forEach((opinion) => {
        const opLines = this.doc.splitTextToSize(`• ${opinion}`, CONTENT_WIDTH - 4);
        this.checkPage(opLines.length * 4);
        this.doc.text(opLines, MARGIN_LEFT + 3, this.y);
        this.y += opLines.length * 3.8;
      });
      this.y += 4;
    }
  }

  private renderPlatformContent(platform: PlatformKey, platformData: any): void {
    if (!platformData) return;

    const platformLabels: Record<PlatformKey, string> = {
      linkedin: '1. LinkedIn Thought-Leadership Posts',
      x: '2. X (Twitter) High-Tension Posts & Thread',
      threads: '3. Threads Conversational Insights',
      instagram: '4. Instagram Captions & 6-Slide Carousel Script',
      facebook: '5. Facebook Community Discussion Posts',
    };

    this.checkPage(25);

    // Platform Header Banner
    this.doc.setFillColor(...COLOR_LIGHT_BG);
    this.doc.rect(MARGIN_LEFT, this.y, CONTENT_WIDTH, 8, 'F');
    this.doc.setDrawColor(...COLOR_GOLD);
    this.doc.setLineWidth(0.4);
    this.doc.rect(MARGIN_LEFT, this.y, CONTENT_WIDTH, 8, 'S');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(...COLOR_PRIMARY);
    this.doc.text(platformLabels[platform], MARGIN_LEFT + 4, this.y + 5.5);
    this.y += 12;

    // Render Version A, Version B, Version C
    const versions: ContentVersionKey[] = ['versionA', 'versionB', 'versionC'];
    const versionTitles: Record<ContentVersionKey, string> = {
      versionA: 'Version A: Professional (Structured & Authoritative)',
      versionB: 'Version B: Strong Engagement (High Conversation Trigger)',
      versionC: 'Version C: Short & Powerful (Punchy Impact)',
    };

    versions.forEach((verKey) => {
      const ver: ContentVersion | undefined = platformData.versions?.[verKey];
      const postText = ver?.fullPost || getPlatformPostText(platformData, verKey);

      if (postText) {
        this.checkPage(25);
        this.doc.setFont('helvetica', 'bold');
        this.doc.setFontSize(8.5);
        this.doc.setTextColor(...COLOR_GOLD);
        this.doc.text(versionTitles[verKey], MARGIN_LEFT, this.y);

        if (ver?.characterCount) {
          this.doc.setFont('helvetica', 'normal');
          this.doc.setFontSize(7.5);
          this.doc.setTextColor(...COLOR_MUTED);
          const countStr = `${ver.characterCount} chars`;
          const countWidth = this.doc.getTextWidth(countStr);
          this.doc.text(countStr, PAGE_WIDTH - MARGIN_RIGHT - countWidth, this.y);
        }
        this.y += 4;

        // Post Content Box
        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(8);
        this.doc.setTextColor(...COLOR_TEXT);
        const postLines = this.doc.splitTextToSize(postText, CONTENT_WIDTH - 6);

        const boxHeight = postLines.length * 3.8 + 6;
        this.checkPage(boxHeight);

        this.doc.setFillColor(255, 255, 255);
        this.doc.roundedRect(MARGIN_LEFT, this.y, CONTENT_WIDTH, boxHeight, 1, 1, 'F');
        this.doc.setDrawColor(...COLOR_BORDER);
        this.doc.setLineWidth(0.2);
        this.doc.roundedRect(MARGIN_LEFT, this.y, CONTENT_WIDTH, boxHeight, 1, 1, 'S');

        this.doc.text(postLines, MARGIN_LEFT + 3, this.y + 4.5);
        this.y += boxHeight + 4;
      }
    });

    // Special: X Twitter Thread Tweets
    if (platform === 'x' && Array.isArray(platformData.threadTweets) && platformData.threadTweets.length > 0) {
      this.checkPage(20);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8.5);
      this.doc.setTextColor(...COLOR_PRIMARY);
      this.doc.text('X (Twitter) 4-Tweet Thread Breakdown:', MARGIN_LEFT, this.y);
      this.y += 5;

      platformData.threadTweets.forEach((tweet: string, tweetIdx: number) => {
        this.checkPage(15);
        this.doc.setFont('helvetica', 'bold');
        this.doc.setFontSize(7.5);
        this.doc.setTextColor(...COLOR_GOLD);
        this.doc.text(`Tweet ${tweetIdx + 1}:`, MARGIN_LEFT + 2, this.y);

        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(8);
        this.doc.setTextColor(...COLOR_TEXT);
        const tweetLines = this.doc.splitTextToSize(tweet, CONTENT_WIDTH - 6);
        this.doc.text(tweetLines, MARGIN_LEFT + 4, this.y + 4);
        this.y += tweetLines.length * 3.8 + 6;
      });
      this.y += 2;
    }

    // Special: Instagram 6-Slide Carousel Script
    const carouselSlides: CarouselSlide[] = platformData.carouselScript || platformData.carouselSlides || [];
    if (platform === 'instagram' && Array.isArray(carouselSlides) && carouselSlides.length > 0) {
      this.renderInstagramCarouselScript(carouselSlides);
    }

    this.y += 4;
  }

  private renderInstagramCarouselScript(slides: CarouselSlide[]): void {
    this.checkPage(25);

    // Instagram Carousel Header
    this.doc.setFillColor(253, 242, 248); // Soft pink tint #fdf2f8
    this.doc.roundedRect(MARGIN_LEFT, this.y, CONTENT_WIDTH, 7, 1, 1, 'F');
    this.doc.setDrawColor(236, 72, 153); // Pink 500
    this.doc.setLineWidth(0.3);
    this.doc.roundedRect(MARGIN_LEFT, this.y, CONTENT_WIDTH, 7, 1, 1, 'S');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(190, 24, 93); // Pink 700
    this.doc.text('INSTAGRAM 6-SLIDE CAROUSEL SCRIPT & VISUAL DIRECTIVES', MARGIN_LEFT + 4, this.y + 4.8);
    this.y += 10;

    slides.forEach((slide) => {
      this.checkPage(28);

      // Slide Card
      const headline = slide.headline || `Slide ${slide.slideNumber}`;
      const support = slide.supportingText || '';
      const visual = slide.visualSuggestion || '';
      const transition = slide.transitionHook || '';

      this.doc.setFillColor(...COLOR_LIGHT_BG);
      this.doc.roundedRect(MARGIN_LEFT, this.y, CONTENT_WIDTH, 24, 1, 1, 'F');
      this.doc.setDrawColor(...COLOR_BORDER);
      this.doc.setLineWidth(0.2);
      this.doc.roundedRect(MARGIN_LEFT, this.y, CONTENT_WIDTH, 24, 1, 1, 'S');

      // Slide Badge
      this.doc.setFillColor(...COLOR_PRIMARY);
      this.doc.rect(MARGIN_LEFT + 2, this.y + 2, 16, 5, 'F');
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(7);
      this.doc.setTextColor(...COLOR_WHITE);
      this.doc.text(`SLIDE ${slide.slideNumber}`, MARGIN_LEFT + 4, this.y + 5.5);

      // Headline
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8.5);
      this.doc.setTextColor(...COLOR_PRIMARY);
      const headlineSnippet = headline.length > 55 ? headline.slice(0, 52) + '...' : headline;
      this.doc.text(headlineSnippet, MARGIN_LEFT + 20, this.y + 5.5);

      // Supporting Copy
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(...COLOR_TEXT);
      const supportSnippet = support.length > 105 ? support.slice(0, 102) + '...' : support;
      this.doc.text(`Copy: ${supportSnippet}`, MARGIN_LEFT + 4, this.y + 11);

      // Visual Prompt
      this.doc.setFont('helvetica', 'italic');
      this.doc.setFontSize(7);
      this.doc.setTextColor(...COLOR_GOLD);
      const visualSnippet = visual.length > 115 ? visual.slice(0, 112) + '...' : visual;
      this.doc.text(`Visual Suggestion: ${visualSnippet}`, MARGIN_LEFT + 4, this.y + 16);

      // Transition Hook
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(7);
      this.doc.setTextColor(16, 185, 129); // Emerald 500
      const transSnippet = transition.length > 115 ? transition.slice(0, 112) + '...' : transition;
      this.doc.text(`Next Slide Hook: ${transSnippet}`, MARGIN_LEFT + 4, this.y + 20.5);

      this.y += 26;
    });

    this.y += 2;
  }

  public save(filename: string): void {
    this.drawRunningFooters();
    this.doc.save(filename);
  }
}

/**
 * Generates and downloads a consolidated PDF of all saved drafts
 */
export function generateConsolidatedPdf(drafts: Draft[]): void {
  if (!drafts || drafts.length === 0) {
    throw new Error('No drafts available to download.');
  }

  const builder = new PdfBuilder();
  builder.addCoverHeader(drafts.length);
  builder.addTableOfContents(drafts);

  drafts.forEach((draft, idx) => {
    builder.addDraftSection(draft, idx);
  });

  const dateTag = new Date().toISOString().split('T')[0];
  builder.save(`Elite_Hustle_Vault_Consolidated_Drafts_${dateTag}.pdf`);
}

/**
 * Generates and downloads a PDF for a single draft project
 */
export function generateSingleDraftPdf(draft: Draft): void {
  if (!draft) {
    throw new Error('Draft data is required.');
  }

  const builder = new PdfBuilder();
  builder.addCoverHeader(1);
  builder.addDraftSection(draft, 0);

  const cleanSlug = (draft.title || 'draft')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .slice(0, 30);
  const dateTag = new Date().toISOString().split('T')[0];
  builder.save(`Elite_Hustle_${cleanSlug}_${dateTag}.pdf`);
}

/**
 * Opens a print-optimized window for browser-native printing / saving to PDF
 */
export function openPrintableDocument(drafts: Draft[]): void {
  if (!drafts || drafts.length === 0) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Elite Hustle Vault Central - Consolidated Marketing Dossier</title>
  <style>
    @page {
      size: A4;
      margin: 15mm 15mm 15mm 15mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.5;
      font-size: 11pt;
      margin: 0;
      padding: 20px;
    }
    .header {
      background: #0c162d;
      color: #ffffff;
      padding: 24px;
      border-radius: 8px;
      border-top: 4px solid #b4730f;
      margin-bottom: 24px;
    }
    .header h1 {
      margin: 0 0 6px 0;
      font-size: 20pt;
      color: #ffffff;
    }
    .header .subtitle {
      color: #cbd5e1;
      font-size: 11pt;
      margin: 0 0 8px 0;
    }
    .header .meta {
      color: #94a3b8;
      font-size: 9pt;
      margin: 0;
    }
    .draft-card {
      page-break-after: always;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px dashed #cbd5e1;
    }
    .draft-card:last-child {
      page-break-after: avoid;
      border-bottom: none;
    }
    .draft-title {
      font-size: 16pt;
      color: #0c162d;
      margin: 0 0 8px 0;
      border-left: 4px solid #b4730f;
      padding-left: 12px;
    }
    .meta-bar {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 8px 12px;
      font-size: 9pt;
      color: #64748b;
      border-radius: 6px;
      margin-bottom: 16px;
    }
    .summary-box {
      background: #f8fafc;
      border-left: 3px solid #0c162d;
      padding: 12px;
      font-size: 10pt;
      margin-bottom: 18px;
    }
    .platform-section {
      margin-bottom: 18px;
    }
    .platform-title {
      font-size: 12pt;
      font-weight: bold;
      color: #0c162d;
      background: #f1f5f9;
      padding: 6px 12px;
      border-radius: 4px;
      margin: 14px 0 8px 0;
    }
    .version-box {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 10px;
    }
    .version-label {
      font-weight: bold;
      font-size: 9.5pt;
      color: #b4730f;
      margin-bottom: 4px;
    }
    .post-text {
      white-space: pre-wrap;
      font-size: 9.5pt;
      color: #334155;
    }
    .slide-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 8px;
    }
    .slide-box {
      border: 1px solid #fbcfe8;
      background: #fdf2f8;
      border-radius: 6px;
      padding: 10px;
      font-size: 8.5pt;
    }
    .slide-num {
      font-weight: bold;
      color: #be185d;
      margin-bottom: 2px;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 16px; text-align: right;">
    <button onclick="window.print()" style="padding: 10px 20px; font-weight: bold; background: #b4730f; color: white; border: none; border-radius: 6px; cursor: pointer;">
      Print / Save as PDF
    </button>
  </div>

  <div class="header">
    <h1>Elite Hustle Vault Central · Content Studio</h1>
    <div class="subtitle">Consolidated Social Media Master Dossier (Version 2.0)</div>
    <div class="meta">Compiled on ${new Date().toLocaleDateString()} · Total Projects: ${drafts.length}</div>
  </div>

  ${drafts
    .map(
      (draft, idx) => `
    <div class="draft-card">
      <h2 class="draft-title">${idx + 1}. ${draft.title}</h2>
      <div class="meta-bar">
        Source URL: ${draft.url || 'N/A'} | Tone: ${draft.tone.toUpperCase()} | Length: ${(
        draft.contentLength || 'standard'
      ).toUpperCase()} | Date: ${new Date(draft.createdAt).toLocaleDateString()}
      </div>

      <div class="summary-box">
        <strong>Strategic Summary:</strong><br>
        ${draft.summary}
      </div>

      ${['linkedin', 'x', 'threads', 'instagram', 'facebook']
        .map((p) => {
          const pData = (draft.platforms as any)?.[p];
          if (!pData) return '';
          return `
          <div class="platform-section">
            <div class="platform-title">${p.toUpperCase()} Content Suite</div>
            ${['versionA', 'versionB', 'versionC']
              .map((ver) => {
                const text = getPlatformPostText(pData, ver as any);
                if (!text) return '';
                const verLabel =
                  ver === 'versionA'
                    ? 'Version A: Professional'
                    : ver === 'versionB'
                    ? 'Version B: Strong Engagement'
                    : 'Version C: Short & Powerful';
                return `
                <div class="version-box">
                  <div class="version-label">${verLabel}</div>
                  <div class="post-text">${text}</div>
                </div>`;
              })
              .join('')}
          </div>`;
        })
        .join('')}
    </div>`
    )
    .join('')}
</body>
</html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
