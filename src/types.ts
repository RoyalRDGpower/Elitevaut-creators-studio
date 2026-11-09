export type ToneType = 'authoritative' | 'conversational' | 'high-energy' | 'executive' | 'provocative';

export type ContentLengthType = 'short' | 'standard' | 'in-depth';

export type FocusAngleType = 'actionable' | 'contrarian' | 'case-study' | 'mindset' | 'growth';

export type PlatformKey = 'linkedin' | 'x' | 'threads' | 'instagram' | 'facebook';

export type ContentVersionKey = 'versionA' | 'versionB' | 'versionC';

export interface ContentVersion {
  version: 'A' | 'B' | 'C';
  label: string; // 'Professional' | 'Strong Engagement' | 'Short & Powerful'
  hook: string;
  body: string;
  callToAction: string;
  hashtags: string[];
  fullPost: string;
  characterCount?: number;
}

export interface CarouselSlide {
  slideNumber: number; // 1 to 6
  headline: string;
  supportingText: string;
  visualSuggestion: string;
  transitionHook: string; // Logical connection to next slide
}

export interface InstagramContent {
  versions: {
    versionA: ContentVersion;
    versionB: ContentVersion;
    versionC: ContentVersion;
  };
  carouselScript: CarouselSlide[]; // Actual 6-slide carousel script
  // Legacy backward-compatibility fields:
  hook?: string;
  body?: string;
  callToAction?: string;
  hashtags?: string[];
  fullPost?: string;
  carouselSlides?: string[];
}

export interface StandardPlatformContent {
  versions: {
    versionA: ContentVersion;
    versionB: ContentVersion;
    versionC: ContentVersion;
  };
  threadTweets?: string[]; // for X
  // Legacy backward-compatibility fields:
  hook?: string;
  body?: string;
  callToAction?: string;
  hashtags?: string[];
  fullPost?: string;
}

export interface ArticleAnalysis {
  title: string;
  mainArguments: string[];
  verifiedFactsAndFigures: string[];
  opinionsAndPerspectives: string[];
  technicalDetails: string[];
  sourceNote?: string;
}

export interface PlatformsData {
  linkedin: StandardPlatformContent;
  x: StandardPlatformContent;
  threads: StandardPlatformContent;
  instagram: InstagramContent;
  facebook: StandardPlatformContent;
  articleAnalysis?: ArticleAnalysis;
  suggestedHashtags?: string[];
  keyThemes?: string[];
}

export interface Draft {
  id: string;
  title: string;
  summary: string;
  url: string;
  tone: ToneType;
  contentLength?: ContentLengthType;
  focusAngle: FocusAngleType;
  platforms: PlatformsData;
  articleAnalysis?: ArticleAnalysis;
  createdAt: string;
  updatedAt: string;
}

export type ActiveTab = 'dashboard' | 'create' | 'drafts' | 'playbook';
