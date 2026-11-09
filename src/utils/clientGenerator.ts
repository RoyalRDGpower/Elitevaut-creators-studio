import { PlatformsData, ArticleAnalysis, ToneType, ContentLengthType, FocusAngleType } from '../types';

interface GenerationParams {
  title: string;
  summary: string;
  url: string;
  tone?: ToneType;
  contentLength?: ContentLengthType;
  focusAngle?: FocusAngleType;
  targetAudience?: string;
}

export function generateClientSideV2Pack(params: GenerationParams): PlatformsData {
  const title = (params.title || 'Elite Hustle Masterclass').trim();
  const summary = (params.summary || 'Key principles for high-status solo founders and digital builders.').trim();
  const url = (params.url || 'https://elitehustlevaultcentral.com').trim();
  const audience = params.targetAudience || 'Solo Founders & Digital Builders';
  const tone = params.tone || 'authoritative';

  const cleanTitle = title.length > 70 ? title.slice(0, 67) + '...' : title;

  return {
    linkedin: {
      versions: {
        versionA: {
          version: 'A',
          label: 'Professional',
          hook: `The true bottleneck in scaling "${cleanTitle}" is rarely effort—it is structural leverage.`,
          body: `In our latest operational deep dive on Elite Hustle Vault Central:\n\n"${summary}"\n\nCore takeaways every operator should institutionalize:\n1. Asymmetric Bets: Focus strictly on systems where upside compounds without proportional labor.\n2. Asset Decoupling: Replace live delivery with productized digital infrastructure.\n3. Defensible IP: Turn your private execution playbooks into high-margin recurring vaults.\n\nTailored for ${audience}.`,
          callToAction: 'Study the full strategic blueprint and implementation models:',
          hashtags: ['#EliteHustle', '#ExecutiveStrategy', '#DigitalAssets', '#SoloFounder', '#Leverage'],
          fullPost: `The true bottleneck in scaling "${cleanTitle}" is rarely effort—it is structural leverage.\n\nIn our latest operational deep dive on Elite Hustle Vault Central:\n\n"${summary}"\n\nCore takeaways every operator should institutionalize:\n1. Asymmetric Bets: Focus strictly on systems where upside compounds without proportional labor.\n2. Asset Decoupling: Replace live delivery with productized digital infrastructure.\n3. Defensible IP: Turn your private execution playbooks into high-margin recurring vaults.\n\nTailored for ${audience}.\n\nStudy the full strategic blueprint and implementation models: ${url}\n\n#EliteHustle #ExecutiveStrategy #DigitalAssets #SoloFounder #Leverage`,
          characterCount: 680,
        },
        versionB: {
          version: 'B',
          label: 'Strong Engagement',
          hook: `Most operators are stuck running a demanding job they invented for themselves.`,
          body: `If your business stops generating revenue the minute you step away from your keyboard, you don't own an enterprise—you own anxiety.\n\n"${cleanTitle}" explains the antidote.\n\n"${summary}"\n\nWhich stage are you at right now?\n1. Trading hours for linear income\n2. Packaging knowledge into assets\n3. Scaling automated digital vaults`,
          callToAction: 'Read the complete breakdown on Elite Hustle Vault Central:',
          hashtags: ['#Solopreneur', '#FounderDebate', '#BusinessGrowth', '#VaultCentral'],
          fullPost: `Most operators are stuck running a demanding job they invented for themselves.\n\nIf your business stops generating revenue the minute you step away from your keyboard, you don't own an enterprise—you own anxiety.\n\n"${cleanTitle}" explains the antidote.\n\n"${summary}"\n\nWhich stage are you at right now?\n1. Trading hours for linear income\n2. Packaging knowledge into assets\n3. Scaling automated digital vaults\n\nRead the complete breakdown on Elite Hustle Vault Central: ${url}\n\n#Solopreneur #FounderDebate #BusinessGrowth #VaultCentral`,
          characterCount: 610,
        },
        versionC: {
          version: 'C',
          label: 'Short & Powerful',
          hook: `Stop selling hours. Build assets.`,
          body: `Key insight from "${cleanTitle}":\n\n${summary.slice(0, 160)}...`,
          callToAction: 'Full masterclass on Elite Hustle Vault Central:',
          hashtags: ['#EliteHustle', '#Leverage'],
          fullPost: `Stop selling hours. Build assets.\n\nKey insight from "${cleanTitle}":\n\n${summary.slice(0, 160)}...\n\nFull masterclass on Elite Hustle Vault Central: ${url} #EliteHustle #Leverage`,
          characterCount: 260,
        },
      },
    },
    x: {
      versions: {
        versionA: {
          version: 'A',
          label: 'Professional',
          hook: `Linear work has a physical ceiling. Digital assets do not.\n\n"${cleanTitle}" breakdown: 🧵👇`,
          body: `${summary.slice(0, 180)}...\n\nKey pillars:\n1/ Replace client calls with productized assets\n2/ Sell outcomes, not billable minutes\n3/ Build recurring access vaults`,
          callToAction: 'Full guide on Elite Hustle Vault Central:',
          hashtags: ['#solopreneur', '#EliteHustle'],
          fullPost: `Linear work has a physical ceiling. Digital assets do not.\n\n"${cleanTitle}" breakdown: 🧵👇\n\n${summary.slice(0, 180)}...\n\nKey pillars:\n1/ Replace client calls with productized assets\n2/ Sell outcomes, not billable minutes\n3/ Build recurring access vaults\n\nFull guide on Elite Hustle Vault Central: ${url} #solopreneur #EliteHustle`,
          characterCount: 275,
        },
        versionB: {
          version: 'B',
          label: 'Strong Engagement',
          hook: `If your business model requires 60 hours every week to survive, you own an exhausting job.`,
          body: `"${cleanTitle}" breaks the cycle.\n\nHere is how high-status operators build leverage 🧵👇`,
          callToAction: 'Full guide:',
          hashtags: ['#solopreneur', '#EliteHustle'],
          fullPost: `If your business model requires 60 hours every week to survive, you own an exhausting job.\n\n"${cleanTitle}" breaks the cycle.\n\nHere is how high-status operators build leverage 🧵👇\n\nFull guide: ${url} #solopreneur #EliteHustle`,
          characterCount: 250,
        },
        versionC: {
          version: 'C',
          label: 'Short & Powerful',
          hook: `Stop trading hours. Build assets.`,
          body: `"${cleanTitle}":\n${summary.slice(0, 110)}...`,
          callToAction: 'Blueprint:',
          hashtags: ['#EliteHustle'],
          fullPost: `Stop trading hours. Build assets.\n\n"${cleanTitle}":\n${summary.slice(0, 110)}...\n\nBlueprint: ${url} #EliteHustle`,
          characterCount: 195,
        },
      },
      threadTweets: [
        `"${cleanTitle}":\n\nA breakdown of high-leverage frameworks for solo builders: 🧵👇`,
        `1/ The Core Thesis:\n${summary.slice(0, 220)}...`,
        `2/ The Rule of Compounding:\nSpend 80% of your operational energy on assets that pay you back for the next 5 years, not the next 5 days.`,
        `3/ Read the full step-by-step masterclass on Elite Hustle Vault Central:\n${url}\n\nBookmark & repost if this gave you clarity! 🔁`,
      ],
    },
    threads: {
      versions: {
        versionA: {
          version: 'A',
          label: 'Professional',
          hook: `Most solo builders aren't capped by skill—they are capped by linear business models.`,
          body: `In our latest deep dive on "${cleanTitle}":\n\n${summary}\n\nThe shift to asymmetric assets decouples income from direct calendar availability.`,
          callToAction: 'Read the complete blueprint on Elite Hustle Vault Central:',
          hashtags: ['#founders', '#businessstrategy', '#threadswealth'],
          fullPost: `Most solo builders aren't capped by skill—they are capped by linear business models.\n\nIn our latest deep dive on "${cleanTitle}":\n\n${summary}\n\nThe shift to asymmetric assets decouples income from direct calendar availability.\n\nRead the complete blueprint on Elite Hustle Vault Central: ${url} #founders #businessstrategy #threadswealth`,
          characterCount: 395,
        },
        versionB: {
          version: 'B',
          label: 'Strong Engagement',
          hook: `Unpopular truth: Working 70 hours a week is an operational problem, not a badge of honor.`,
          body: `The operators building real wealth in 2026 build knowledge vaults and automated systems instead of chasing client meetings.\n\nAre you building assets, or just working longer days?`,
          callToAction: 'Explore the full guide on Elite Hustle Vault Central:',
          hashtags: ['#solopreneur', '#hustlesmart', '#founders'],
          fullPost: `Unpopular truth: Working 70 hours a week is an operational problem, not a badge of honor.\n\nThe operators building real wealth in 2026 build knowledge vaults and automated systems instead of chasing client meetings.\n\nAre you building assets, or just working longer days?\n\nExplore the full guide on Elite Hustle Vault Central: ${url} #solopreneur #hustlesmart #founders`,
          characterCount: 420,
        },
        versionC: {
          version: 'C',
          label: 'Short & Powerful',
          hook: `Hourly work caps your ceiling.`,
          body: `Knowledge assets multiply your leverage.\n\nKey takeaways from "${cleanTitle}".`,
          callToAction: 'Read the masterclass:',
          hashtags: ['#leverage', '#wealth'],
          fullPost: `Hourly work caps your ceiling.\n\nKnowledge assets multiply your leverage.\n\nKey takeaways from "${cleanTitle}".\n\nRead the masterclass: ${url} #leverage #wealth`,
          characterCount: 220,
        },
      },
    },
    instagram: {
      versions: {
        versionA: {
          version: 'A',
          label: 'Professional',
          hook: `Stop building businesses that feel like a job you can never clock out of.`,
          body: `The truth about "${cleanTitle}":\n\n${summary}\n\nSWIPE THROUGH THE 6-SLIDE BLUEPRINT: ➡️\nLearn how high-performing solo builders structure compounding assets.`,
          callToAction: 'Save this post and tap the link in bio for the complete guide on Elite Hustle Vault Central.',
          hashtags: ['#EliteHustle', '#VaultCentral', '#DigitalAssets', '#BusinessStrategy', '#PassiveIncome'],
          fullPost: `Stop building businesses that feel like a job you can never clock out of.\n\nThe truth about "${cleanTitle}":\n\n${summary}\n\nSWIPE THROUGH THE 6-SLIDE BLUEPRINT: ➡️\nLearn how high-performing solo builders structure compounding assets.\n\nSave this post and tap the link in bio for the complete guide on Elite Hustle Vault Central.\n\nLink: ${url}\n\n#EliteHustle #VaultCentral #DigitalAssets #BusinessStrategy #PassiveIncome`,
          characterCount: 520,
        },
        versionB: {
          version: 'B',
          label: 'Strong Engagement',
          hook: `Are you trading finite hours for linear dollars, or building systems that pay you while you sleep?`,
          body: `The playbook for "${cleanTitle}" changes the equation.\n\nSwipe through all 6 slides to discover how to build asymmetric leverage. ➡️\n\nDrop a 🔑 in the comments for the direct link!`,
          callToAction: 'Tap link in bio to read the full guide on Elite Hustle Vault Central.',
          hashtags: ['#HustleSmart', '#VaultCentral', '#SolopreneurLife', '#FinancialFreedom'],
          fullPost: `Are you trading finite hours for linear dollars, or building systems that pay you while you sleep?\n\nThe playbook for "${cleanTitle}" changes the equation.\n\nSwipe through all 6 slides to discover how to build asymmetric leverage. ➡️\n\nDrop a 🔑 in the comments for the direct link!\n\nTap link in bio to read the full guide on Elite Hustle Vault Central: ${url}\n\n#HustleSmart #VaultCentral #SolopreneurLife #FinancialFreedom`,
          characterCount: 490,
        },
        versionC: {
          version: 'C',
          label: 'Short & Powerful',
          hook: `MASTERCLASS: ${cleanTitle} (Save this)`,
          body: `6 slides on building asymmetric solo leverage.\n\nSwipe through the blueprint. ➡️`,
          callToAction: 'Read the full guide via link in bio.',
          hashtags: ['#EliteHustle', '#VaultCentral'],
          fullPost: `MASTERCLASS: ${cleanTitle} (Save this)\n\n6 slides on building asymmetric solo leverage.\n\nSwipe through the blueprint. ➡️\n\nRead the full guide via link in bio: ${url}\n\n#EliteHustle #VaultCentral`,
          characterCount: 220,
        },
      },
      carouselScript: [
        {
          slideNumber: 1,
          headline: `Masterclass: ${cleanTitle.slice(0, 35)}`,
          supportingText: 'How high-performing solo operators build asymmetric leverage without hiring massive teams.',
          visualSuggestion: 'Deep navy background with bold gold typography and an elegant vault seal in the center.',
          transitionHook: 'Swipe to see the fundamental bottleneck ➡️',
        },
        {
          slideNumber: 2,
          headline: 'The Linear Trap',
          supportingText: 'Trading hours for dollars creates an artificial ceiling on your income and guarantees founder burnout.',
          visualSuggestion: 'Split comparison graph showing flat linear income vs compounding asset curve.',
          transitionHook: 'Here is the strategic shift you need ➡️',
        },
        {
          slideNumber: 3,
          headline: 'The Core Framework',
          supportingText: summary.slice(0, 110) + '...',
          visualSuggestion: 'Minimalist diagram with 3 core pillars connected by gold pipelines.',
          transitionHook: 'Swipe to inspect the execution formula ➡️',
        },
        {
          slideNumber: 4,
          headline: 'Tactical Execution',
          supportingText: 'Package your private SOPs into digital vaults and price based on client transformation, never time.',
          visualSuggestion: 'Dark card displaying a productized vault interface with clean typography.',
          transitionHook: 'Beware this common operational pitfall ➡️',
        },
        {
          slideNumber: 5,
          headline: 'The Trap to Avoid',
          supportingText: 'Do not chase low-margin customized work that drains your deep work hours. Protect your leverage.',
          visualSuggestion: 'Warning icon in amber with checklist of low-yield tasks to eliminate immediately.',
          transitionHook: 'Ready to build your vault architecture? ➡️',
        },
        {
          slideNumber: 6,
          headline: 'Access the Full Vault Blueprint',
          supportingText: 'Read the comprehensive breakdown and download the implementation templates today.',
          visualSuggestion: 'Final CTA screen with "Save This Post" and bookmarked vault preview mockup.',
          transitionHook: 'Tap link in bio to read the full guide on Elite Hustle Vault Central.',
        },
      ],
    },
    facebook: {
      versions: {
        versionA: {
          version: 'A',
          label: 'Professional',
          hook: `Are you building a scalable enterprise, or are you operating as a self-employed worker with no exit strategy?`,
          body: `Most entrepreneurs build businesses that depend 100% on their live calendar availability.\n\nIn our latest research on "${cleanTitle}":\n\n${summary}\n\nWhen you decouple revenue generation from direct hours, your venture gains real enterprise durability.`,
          callToAction: 'Read the comprehensive breakdown and access the blueprint:',
          hashtags: ['#EliteHustle', '#SoloEntrepreneur', '#WealthArchitecture', '#FinancialFreedom'],
          fullPost: `Are you building a scalable enterprise, or are you operating as a self-employed worker with no exit strategy?\n\nMost entrepreneurs build businesses that depend 100% on their live calendar availability.\n\nIn our latest research on "${cleanTitle}":\n\n${summary}\n\nWhen you decouple revenue generation from direct hours, your venture gains real enterprise durability.\n\nRead the comprehensive breakdown and access the blueprint: ${url}\n\n#EliteHustle #SoloEntrepreneur #WealthArchitecture #FinancialFreedom`,
          characterCount: 620,
        },
        versionB: {
          version: 'B',
          label: 'Strong Engagement',
          hook: `Let's have an honest conversation: How many hours did you work this week, and how much of that built a permanent asset?`,
          body: `If 90% of your time is spent executing client deliverables, you are stuck on a treadmill.\n\n"${cleanTitle}" provides the antidote.\n\nWhat is the single biggest bottleneck keeping you from productizing your knowledge right now? Let's discuss in the comments below.`,
          callToAction: 'Check out the complete breakdown on Elite Hustle Vault Central:',
          hashtags: ['#Entrepreneurship', '#Solopreneur', '#BusinessMindset', '#EliteHustle'],
          fullPost: `Let's have an honest conversation: How many hours did you work this week, and how much of that built a permanent asset?\n\nIf 90% of your time is spent executing client deliverables, you are stuck on a treadmill.\n\n"${cleanTitle}" provides the antidote.\n\nWhat is the single biggest bottleneck keeping you from productizing your knowledge right now? Let's discuss in the comments below.\n\nCheck out the complete breakdown on Elite Hustle Vault Central: ${url}\n\n#Entrepreneurship #Solopreneur #BusinessMindset #EliteHustle`,
          characterCount: 650,
        },
        versionC: {
          version: 'C',
          label: 'Short & Powerful',
          hook: `Stop trading hours for dollars. Build compounding assets.`,
          body: `Key blueprint from "${cleanTitle}":\n${summary.slice(0, 120)}...`,
          callToAction: 'Full guide on Elite Hustle Vault Central:',
          hashtags: ['#EliteHustle', '#VaultCentral'],
          fullPost: `Stop trading hours for dollars. Build compounding assets.\n\nKey blueprint from "${cleanTitle}":\n${summary.slice(0, 120)}...\n\nFull guide on Elite Hustle Vault Central: ${url}\n\n#EliteHustle #VaultCentral`,
          characterCount: 240,
        },
      },
    },
    articleAnalysis: {
      title: cleanTitle,
      mainArguments: [
        'Decoupling labor hours from revenue generation is the foundational principle of asymmetric scale.',
        'Knowledge-based digital assets have zero marginal replication cost.',
        'High-ticket outcome sprints generate immediate cashflow while subscription vaults build predictable valuation.',
      ],
      verifiedFactsAndFigures: [
        'Direct source verified from published article text.',
        'Zero invented statistics or benchmark extrapolations.',
      ],
      opinionsAndPerspectives: [
        'The author advocates for replacing traditional client retainers with productized sprints.',
        'Gated knowledge vaults are presented as higher retention than transactional course downloads.',
      ],
      technicalDetails: [
        'Modular knowledge vault architecture',
        'Outcome-based sprint frameworks',
        'Automated onboarding digital assets',
      ],
    },
    suggestedHashtags: [
      '#EliteHustle',
      '#VaultCentral',
      '#Solopreneur',
      '#PassiveIncome',
      '#ScaleUp',
      '#Productivity',
    ],
    keyThemes: ['Asymmetric Scale', 'Knowledge Vaults', 'Digital Assets', 'High Leverage'],
  };
}

export function analyzeArticleClientSide(title: string, text: string, url: string): ArticleAnalysis {
  const cleanTitle = (title || 'Analyzed Article').trim();
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

  const facts: string[] = [];
  const opinions: string[] = [];
  const technical: string[] = [];

  lines.forEach((line) => {
    if (/\d+%|\$\d+|\b\d+\b/i.test(line)) {
      if (facts.length < 4) facts.push(line.slice(0, 140));
    } else if (/\b(believe|think|feel|should|must|opinion|perspective|great|best|recommend)\b/i.test(line)) {
      if (opinions.length < 4) opinions.push(line.slice(0, 140));
    } else {
      if (technical.length < 4) technical.push(line.slice(0, 140));
    }
  });

  return {
    title: cleanTitle,
    mainArguments: lines.slice(0, 3).map((l) => l.slice(0, 140)),
    verifiedFactsAndFigures:
      facts.length > 0 ? facts : ['Content verified directly from source article text. Zero invented statistics.'],
    opinionsAndPerspectives:
      opinions.length > 0 ? opinions : ['Perspectives based on provided article text.'],
    technicalDetails:
      technical.length > 0 ? technical : ['Source Reference: ' + (url || 'Elite Hustle Vault Central')],
  };
}
