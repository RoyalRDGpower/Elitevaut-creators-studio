export type ToneType = 'authoritative' | 'conversational' | 'high-energy' | 'executive';

export type FocusAngleType = 'actionable' | 'contrarian' | 'case-study' | 'mindset' | 'growth';

export interface FacebookContent {
  hook: string;
  body: string;
  callToAction: string;
  hashtags: string[];
  fullPost: string;
}

export interface InstagramContent {
  hook: string;
  body: string;
  carouselSlides: string[];
  callToAction: string;
  hashtags: string[];
  fullPost: string;
}

export interface LinkedInContent {
  hook: string;
  body: string;
  takeaways: string[];
  callToAction: string;
  hashtags: string[];
  fullPost: string;
}

export interface XContent {
  hook: string;
  body: string;
  callToAction: string;
  hashtags: string[];
  fullPost: string;
  threadTweets?: string[];
}

export interface PlatformsData {
  facebook: FacebookContent;
  instagram: InstagramContent;
  linkedin: LinkedInContent;
  x: XContent;
  suggestedHashtags?: string[];
  keyThemes?: string[];
}

export interface Draft {
  id: string;
  title: string;
  summary: string;
  url: string;
  tone: ToneType;
  focusAngle: FocusAngleType;
  platforms: PlatformsData;
  createdAt: string;
  updatedAt: string;
}

export type ActiveTab = 'dashboard' | 'create' | 'drafts' | 'playbook';
export type PlatformKey = 'facebook' | 'instagram' | 'linkedin' | 'x';
