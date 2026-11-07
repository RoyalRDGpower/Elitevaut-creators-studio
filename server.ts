import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

const hasApiKey = Boolean(
  process.env.GEMINI_API_KEY &&
  process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' &&
  process.env.GEMINI_API_KEY.trim().length > 5
);

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'dummy_key',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Drafts storage file path
const DATA_DIR = path.join(__dirname, 'data');
const DRAFTS_FILE = path.join(DATA_DIR, 'drafts.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DRAFTS_FILE)) {
    const initialDrafts = [
      {
        id: 'vault-seed-1',
        title: 'The Vault Multiplier: 5 Core Revenue Streams for Solo Builders',
        url: 'https://elitehustlevaultcentral.com/blog/vault-multiplier-5-revenue-streams',
        summary: 'A deep dive into how high-performing solo operators leverage automated knowledge vaults, digital assets, and high-margin consulting to scale past $20k/month without burning out.',
        tone: 'authoritative',
        focusAngle: 'actionable',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        platforms: {
          facebook: {
            hook: 'Are you trading time for money, or are you building assets that work while you sleep?',
            body: 'Most entrepreneurs make the fatal mistake of building 1:1 service businesses that cap their time and ceiling.\n\nIn our latest breakdown on Elite Hustle Vault Central, we unpack the exact 5-stream architecture that lets solo founders scale past $20k/month.\n\nHere is what separates high-leverage operators:\n1. Digital product hubs that self-onboard\n2. Recurring subscription vaults\n3. High-ticket strategic retainers\n4. Performance royalties\n5. Licensing micro-systems',
            callToAction: 'Read the comprehensive breakdown and grab the free blueprint right here:',
            hashtags: ['#EliteHustle', '#SoloEntrepreneur', '#WealthArchitecture', '#FinancialFreedom'],
            fullPost: 'Are you trading time for money, or are you building assets that work while you sleep?\n\nMost entrepreneurs make the fatal mistake of building 1:1 service businesses that cap their time and ceiling.\n\nIn our latest breakdown on Elite Hustle Vault Central, we unpack the exact 5-stream architecture that lets solo founders scale past $20k/month.\n\nHere is what separates high-leverage operators:\n1. Digital product hubs that self-onboard\n2. Recurring subscription vaults\n3. High-ticket strategic retainers\n4. Performance royalties\n5. Licensing micro-systems\n\nRead the comprehensive breakdown and grab the free blueprint right here: https://elitehustlevaultcentral.com/blog/vault-multiplier-5-revenue-streams\n\n#EliteHustle #SoloEntrepreneur #WealthArchitecture #FinancialFreedom',
          },
          instagram: {
            hook: 'Stop building businesses that feel like a second job you can never clock out of. 🚫⏱️',
            body: 'If your income stops the second your laptop closes, you don\'t have a business—you have a demanding client.\n\nSWIPE TO UNLOCK THE 5 VAULT REVENUE PILLARS: ➡️\n\nSlide 1: The Productized Asset (Zero marginal cost)\nSlide 2: The Vault Subscription (Predictable base MRR)\nSlide 3: High-Ticket Sprint (Cashflow accelerant)\nSlide 4: Systematic Licensing (Passive royalties)\nSlide 5: Reinvestment Flywheel',
            carouselSlides: [
              'The 5 Pillars of Asymmetric Solo Income (Save this)',
              'Pillar 1: Productized Assets - Build once, sell infinite times with zero marginal cost of replication.',
              'Pillar 2: Vault Membership - High-value gated workflows with high-retention recurring MRR.',
              'Pillar 3: Strategic Sprints - 14-day outcome-focused consulting for enterprise clients.',
              'Pillar 4: System Licensing - License your operational frameworks to non-competing niches.',
              'Action Step: Link in bio to access the complete blueprint.'
            ],
            callToAction: 'Tap the link in bio to read the full guide on Elite Hustle Vault Central and download the framework!',
            hashtags: ['#EliteHustle', '#VaultCentral', '#HustleSmart', '#DigitalAssets', '#PassiveIncome', '#BusinessStrategy'],
            fullPost: 'Stop building businesses that feel like a second job you can never clock out of. 🚫⏱️\n\nIf your income stops the second your laptop closes, you don\'t have a business—you have a demanding client.\n\nSWIPE TO UNLOCK THE 5 VAULT REVENUE PILLARS: ➡️\n\nSlide 1: The Productized Asset (Zero marginal cost)\nSlide 2: The Vault Subscription (Predictable base MRR)\nSlide 3: High-Ticket Sprint (Cashflow accelerant)\nSlide 4: Systematic Licensing (Passive royalties)\nSlide 5: Reinvestment Flywheel\n\nTap the link in bio to read the full guide on Elite Hustle Vault Central and download the framework!\n\nLink: https://elitehustlevaultcentral.com/blog/vault-multiplier-5-revenue-streams\n\n#EliteHustle #VaultCentral #HustleSmart #DigitalAssets #PassiveIncome #BusinessStrategy',
          },
          linkedin: {
            hook: 'The biggest lie in the hustle culture: "Work 80 hours a week until you burn out."',
            body: 'The smartest solo founders aren\'t working 80 hours.\nThey\'re working 20 hours on high-leverage assets, and letting automated vaults do the heavy lifting.\n\nHere are 3 key lessons from our recent Elite Hustle Vault Central research:\n\n• Lesson 1: Asymmetric Leverage beats brute force every single day.\n• Lesson 2: Build tools, vaults, and intellectual property that survive market cycles.\n• Lesson 3: Price based on business transformation, never on billable hours.\n\nWhen you decouple income from direct hours, your potential becomes exponential rather than linear.',
            takeaways: [
              'Asymmetric Leverage beats brute force every single day.',
              'Build tools, vaults, and intellectual property that survive market cycles.',
              'Price based on business transformation, never on billable hours.'
            ],
            callToAction: 'What is your highest-leverage asset in your current business? Let\'s discuss in the comments below.\n\nFull article link:',
            hashtags: ['#Entrepreneurship', '#Solopreneur', '#BusinessStrategy', '#Leadership', '#EliteHustle'],
            fullPost: 'The biggest lie in the hustle culture: "Work 80 hours a week until you burn out."\n\nThe smartest solo founders aren\'t working 80 hours.\nThey\'re working 20 hours on high-leverage assets, and letting automated vaults do the heavy lifting.\n\nHere are 3 key lessons from our recent Elite Hustle Vault Central research:\n\n• Lesson 1: Asymmetric Leverage beats brute force every single day.\n• Lesson 2: Build tools, vaults, and intellectual property that survive market cycles.\n• Lesson 3: Price based on business transformation, never on billable hours.\n\nWhen you decouple income from direct hours, your potential becomes exponential rather than linear.\n\nWhat is your highest-leverage asset in your current business? Let\'s discuss in the comments below.\n\nFull article link: https://elitehustlevaultcentral.com/blog/vault-multiplier-5-revenue-streams\n\n#Entrepreneurship #Solopreneur #BusinessStrategy #Leadership #EliteHustle',
          },
          x: {
            hook: 'If your business dies when you take a 7-day vacation, you own a job, not an enterprise.',
            body: '5 revenue streams every solo operator needs to scale past $20k/mo:\n\n1. Digital product hubs\n2. Vault subscriptions\n3. High-ticket outcome sprints\n4. Licensing systems\n5. Compounding royalties\n\nFull breakdown below 🧵👇',
            callToAction: 'Read the full guide on Elite Hustle Vault Central:',
            hashtags: ['#buildinpublic', '#solopreneur', '#EliteHustle'],
            fullPost: 'If your business dies when you take a 7-day vacation, you own a job, not an enterprise.\n\n5 revenue streams every solo operator needs to scale past $20k/mo:\n\n1. Digital product hubs\n2. Vault subscriptions\n3. High-ticket outcome sprints\n4. Licensing systems\n5. Compounding royalties\n\nRead the full guide on Elite Hustle Vault Central: https://elitehustlevaultcentral.com/blog/vault-multiplier-5-revenue-streams #buildinpublic #solopreneur #EliteHustle',
            threadTweets: [
              'If your business dies when you take a 7-day vacation, you own a job, not an enterprise.\n\n5 revenue streams every solo operator needs to scale past $20k/mo: 🧵👇',
              '1/ Productized Knowledge Assets\nTurn your private SOPs, templates, and frameworks into turnkey downloads. Once built, distribution cost is zero.',
              '2/ Vault Memberships\nInstead of chasing new clients monthly, build a curated inner-circle resource vault with recurring access.',
              '3/ Outcome Sprints\nStop billing hourly. Charge $5,000–$15,000 for a 14-day direct sprint solving one high-value bottleneck.',
              '4/ Read the complete blueprint on Elite Hustle Vault Central:\nhttps://elitehustlevaultcentral.com/blog/vault-multiplier-5-revenue-streams\n\nRetweet if you found this valuable! 🔁',
            ]
          }
        }
      }
    ];
    fs.writeFileSync(DRAFTS_FILE, JSON.stringify(initialDrafts, null, 2), 'utf-8');
  }
}

function readDrafts(): any[] {
  try {
    ensureDataDir();
    const data = fs.readFileSync(DRAFTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading drafts:', err);
    return [];
  }
}

function writeDrafts(drafts: any[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(DRAFTS_FILE, JSON.stringify(drafts, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing drafts:', err);
  }
}

// 1. URL Extraction Endpoint
app.post('/api/extract-url', async (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'A valid URL is required.' });
  }

  let formattedUrl = url.trim();
  if (!/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = 'https://' + formattedUrl;
  }

  try {
    // Attempt fast HTTP fetch to read page title and meta description
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    let html = '';
    let fetchedTitle = '';
    let fetchedDescription = '';

    try {
      const response = await fetch(formattedUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        html = await response.text();
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
          fetchedTitle = titleMatch[1].trim();
        }
        const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
        if (ogTitleMatch && ogTitleMatch[1]) {
          fetchedTitle = ogTitleMatch[1].trim();
        }

        const metaDescMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
        if (metaDescMatch && metaDescMatch[1]) {
          fetchedDescription = metaDescMatch[1].trim();
        }
        const ogDescMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i);
        if (ogDescMatch && ogDescMatch[1]) {
          fetchedDescription = ogDescMatch[1].trim();
        }
      }
    } catch (fetchErr) {
      clearTimeout(timeoutId);
    }

    // Derive readable title from URL slug if fetched title is still empty
    if (!fetchedTitle) {
      try {
        const parsedUrl = new URL(formattedUrl);
        const segments = parsedUrl.pathname.split('/').filter(Boolean);
        const lastSegment = segments.length > 0 ? segments[segments.length - 1] : '';
        if (lastSegment) {
          fetchedTitle = lastSegment
            .replace(/[-_]+/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());
        }
      } catch (err) {}
    }

    // If Gemini API Key is available, use Gemini to summarize or refine the article
    if (hasApiKey) {
      try {
        const prompt = `Analyze this blog article URL: "${formattedUrl}".
Page title found: "${fetchedTitle || 'Unknown'}"
Page description snippet: "${fetchedDescription || 'Unknown'}"

Extract or synthesize:
1. A clean, engaging article title suitable for Elite Hustle Vault Central.
2. A comprehensive 2-3 sentence summary highlighting the core premise, key value propositions, and actionable takeaway for ambitious entrepreneurs.

Return strict JSON with fields "title" and "summary".`;

        const geminiRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
              },
              required: ['title', 'summary'],
            },
          },
        });

        const text = geminiRes.text;
        if (text) {
          const parsed = JSON.parse(text);
          return res.json({
            url: formattedUrl,
            title: parsed.title || fetchedTitle || 'Elite Hustle Article',
            summary: parsed.summary || fetchedDescription || 'Comprehensive insights on scaling digital ventures and building high-leverage assets.',
          });
        }
      } catch (geminiErr) {
        console.error('Gemini extraction error:', geminiErr);
      }
    }

    // Fallback if no Gemini or if Gemini errored
    const fallbackTitle = fetchedTitle || 'Vault Masterclass Article';
    const fallbackSummary = fetchedDescription || `Essential insights and tactical scaling frameworks extracted from ${formattedUrl} for Elite Hustle Vault Central readers.`;

    return res.json({
      url: formattedUrl,
      title: fallbackTitle,
      summary: fallbackSummary,
    });
  } catch (error: any) {
    console.error('Extract URL general error:', error);
    return res.status(500).json({
      error: 'Could not extract content from the URL. You can enter the title and summary manually.',
    });
  }
});

// 2. Social Media Generator Endpoint
app.post('/api/generate-content', async (req: Request, res: Response) => {
  const { title, summary, url, tone = 'authoritative', focusAngle = 'actionable', targetAudience = 'Entrepreneurs & High Performers' } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Article title is required.' });
  }
  if (!summary || !summary.trim()) {
    return res.status(400).json({ error: 'Article summary is required.' });
  }

  const safeUrl = url && url.trim() ? url.trim() : 'https://elitehustlevaultcentral.com';

  const toneGuidelines: Record<string, string> = {
    authoritative: 'Authoritative, direct, uncompromising, data-backed, high-status thought leader tone.',
    conversational: 'Warm, relatable, candid, behind-the-scenes founder storytelling tone.',
    'high-energy': 'Electrifying, urgent, hype-free motivational, relentless hustle and momentum tone.',
    executive: 'Strategic, boardroom-ready, macroeconomic, enterprise-level clarity and leverage.',
  };

  const selectedTone = toneGuidelines[tone] || toneGuidelines.authoritative;

  if (hasApiKey) {
    try {
      const systemInstruction = `You are the Lead Growth & Social Copywriter for "Elite Hustle Vault Central", an elite hub for high-performing entrepreneurs, solo founders, and digital builders.
Your job is to transform blog articles into world-class, high-converting social media posts customized specifically for:
1. Facebook: High engagement, relatable narrative hook, line breaks for scannability, curious engagement question, clear CTA, article link, and 3-5 relevant hashtags.
2. Instagram: Scroll-stopping 1st line hook with emoji, formatted carousel caption with slide breakdown (Slide 1 to Slide 5), strong save-this / link-in-bio CTA, link to article, and 6-10 targeted high-reach hashtags.
3. LinkedIn: Professional thought-leadership power hook, formatted micro-paragraphs (1-2 sentences each), 3-4 bulleted punchy takeaways, insightful discussion question, CTA directing to the link, and 3-5 professional hashtags.
4. X (Twitter): High-retention viral hook under 280 characters with link, plus an optional 4-part thread breakdown for deeper readership. Must include clear CTA and 2-3 concise hashtags.

Brand Voice: ${selectedTone}
Focus Angle: ${focusAngle}
Target Audience: ${targetAudience}

Crucial Rules:
- Never write generic fluff like "Check out this cool post!". Use psychological open loops, contrarian tension, and tangible frameworks.
- Include a clear call to action (CTA) in every platform.
- Always seamlessly integrate the article link: ${safeUrl}
- Ensure formatted fullPost has ready-to-copy line breaks and polished layout.`;

      const userPrompt = `Generate promotional drafts for this Elite Hustle Vault Central article:
Title: "${title}"
Summary: "${summary}"
Article URL: "${safeUrl}"

Return pure JSON matching the schema.`;

      const geminiResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              facebook: {
                type: Type.OBJECT,
                properties: {
                  hook: { type: Type.STRING },
                  body: { type: Type.STRING },
                  callToAction: { type: Type.STRING },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  fullPost: { type: Type.STRING },
                },
                required: ['hook', 'body', 'callToAction', 'hashtags', 'fullPost'],
              },
              instagram: {
                type: Type.OBJECT,
                properties: {
                  hook: { type: Type.STRING },
                  body: { type: Type.STRING },
                  carouselSlides: { type: Type.ARRAY, items: { type: Type.STRING } },
                  callToAction: { type: Type.STRING },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  fullPost: { type: Type.STRING },
                },
                required: ['hook', 'body', 'carouselSlides', 'callToAction', 'hashtags', 'fullPost'],
              },
              linkedin: {
                type: Type.OBJECT,
                properties: {
                  hook: { type: Type.STRING },
                  body: { type: Type.STRING },
                  takeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
                  callToAction: { type: Type.STRING },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  fullPost: { type: Type.STRING },
                },
                required: ['hook', 'body', 'takeaways', 'callToAction', 'hashtags', 'fullPost'],
              },
              x: {
                type: Type.OBJECT,
                properties: {
                  hook: { type: Type.STRING },
                  body: { type: Type.STRING },
                  callToAction: { type: Type.STRING },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  fullPost: { type: Type.STRING },
                  threadTweets: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['hook', 'body', 'callToAction', 'hashtags', 'fullPost'],
              },
              suggestedHashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
              keyThemes: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['facebook', 'instagram', 'linkedin', 'x'],
          },
        },
      });

      const responseText = geminiResponse.text;
      if (!responseText) {
        throw new Error('Empty response received from Gemini.');
      }

      const generated = JSON.parse(responseText);

      return res.json({
        success: true,
        data: generated,
      });
    } catch (error: any) {
      console.error('Error in Gemini generation:', error);
      // Fallback gracefully with structured high-quality algorithmic template if API fails
    }
  }

  // High-Quality Fallback Generator (Ensures 100% reliability if API key is temporarily absent or quota limits apply)
  const cleanTitle = title.trim();
  const cleanSummary = summary.trim();

  const fallbackData = {
    facebook: {
      hook: `Most people will read about "${cleanTitle}" and change nothing. The top 1% will implement it before midnight.`,
      body: `Here is the reality:\n\n${cleanSummary}\n\nAt Elite Hustle Vault Central, we believe execution beats theory every single day. If you want results that stand out, you need strategies that aren't being regurgitated by everyone else on your feed.\n\nKey principles to apply right now:\n1. Audit where your highest leverage comes from.\n2. Cut out low-yield busywork.\n3. Institutionalize your best processes so they compound over time.`,
      callToAction: `Read the complete article on Elite Hustle Vault Central and start applying the blueprint:`,
      hashtags: ['#EliteHustle', '#VaultCentral', '#HighPerformance', '#BusinessGrowth'],
      fullPost: `Most people will read about "${cleanTitle}" and change nothing. The top 1% will implement it before midnight.\n\nHere is the reality:\n\n${cleanSummary}\n\nAt Elite Hustle Vault Central, we believe execution beats theory every single day. If you want results that stand out, you need strategies that aren't being regurgitated by everyone else on your feed.\n\nKey principles to apply right now:\n1. Audit where your highest leverage comes from.\n2. Cut out low-yield busywork.\n3. Institutionalize your best processes so they compound over time.\n\nRead the complete article on Elite Hustle Vault Central and start applying the blueprint: ${safeUrl}\n\n#EliteHustle #VaultCentral #HighPerformance #BusinessGrowth`,
    },
    instagram: {
      hook: `Stop scrolling if you want to unlock true leverage in 2026. 🔑📈`,
      body: `The truth about "${cleanTitle}":\n\n${cleanSummary}\n\nSWIPE TO UNPACK THE SYSTEM: ➡️\n• Slide 1: The Bottleneck Audit\n• Slide 2: Building Asymmetric Leverage\n• Slide 3: Eliminating Friction\n• Slide 4: Compounding Assets\n• Slide 5: The Execution Checklist`,
      carouselSlides: [
        `MASTERCLASS: ${cleanTitle}`,
        `The Core Shift: ${cleanSummary.slice(0, 120)}...`,
        `Principle 1: Stop trading finite hours for linear output. Build assets that duplicate your leverage.`,
        `Principle 2: Turn raw knowledge into systematized workflows inside your personal vault.`,
        `Ready to scale? Link in bio to access the complete guide on Elite Hustle Vault Central.`,
      ],
      callToAction: `Save this post for your next planning sprint and tap the link in bio for the complete guide!`,
      hashtags: ['#EliteHustle', '#VaultCentral', '#HustleSmart', '#DigitalLeverage', '#EntrepreneurMindset', '#CreatorEconomy'],
      fullPost: `Stop scrolling if you want to unlock true leverage in 2026. 🔑📈\n\nThe truth about "${cleanTitle}":\n\n${cleanSummary}\n\nSWIPE TO UNPACK THE SYSTEM: ➡️\n• Slide 1: The Bottleneck Audit\n• Slide 2: Building Asymmetric Leverage\n• Slide 3: Eliminating Friction\n• Slide 4: Compounding Assets\n• Slide 5: The Execution Checklist\n\nSave this post for your next planning sprint and tap the link in bio for the complete guide!\n\nLink: ${safeUrl}\n\n#EliteHustle #VaultCentral #HustleSmart #DigitalLeverage #EntrepreneurMindset #CreatorEconomy`,
    },
    linkedin: {
      hook: `A lot of professionals spend 40 hours a week running on a treadmill. Here is how to step off and build genuine leverage:`,
      body: `In our latest deep dive on "${cleanTitle}", we analyzed what separates operators who grind endlessly from those who build compounding enterprises.\n\n${cleanSummary}\n\nHere are 3 core takeaways every builder should write down:\n\n1. Asymmetric Bets: Focus only on opportunities where downside is capped and upside is exponential.\n2. Knowledge Institutionalization: If it only exists in your head, it cannot scale.\n3. Ruthless Prioritization: Say no to good opportunities so you can execute the legendary ones.`,
      takeaways: [
        'Asymmetric Bets: Focus only on opportunities with exponential upside.',
        'Knowledge Institutionalization: Package frameworks into recurring assets.',
        'Ruthless Prioritization: Protect your deep work focus hours.',
      ],
      callToAction: `What is one system you implemented this year that gave you your time back? Let's discuss in the comments.\n\nFull article on Elite Hustle Vault Central:`,
      hashtags: ['#Leadership', '#Solopreneur', '#Productivity', '#EliteHustle', '#BusinessStrategy'],
      fullPost: `A lot of professionals spend 40 hours a week running on a treadmill. Here is how to step off and build genuine leverage:\n\nIn our latest deep dive on "${cleanTitle}", we analyzed what separates operators who grind endlessly from those who build compounding enterprises.\n\n${cleanSummary}\n\nHere are 3 core takeaways every builder should write down:\n\n1. Asymmetric Bets: Focus only on opportunities where downside is capped and upside is exponential.\n2. Knowledge Institutionalization: If it only exists in your head, it cannot scale.\n3. Ruthless Prioritization: Say no to good opportunities so you can execute the legendary ones.\n\nWhat is one system you implemented this year that gave you your time back? Let's discuss in the comments.\n\nFull article on Elite Hustle Vault Central: ${safeUrl}\n\n#Leadership #Solopreneur #Productivity #EliteHustle #BusinessStrategy`,
    },
    x: {
      hook: `Most people work hard. Very few build systems that work hard FOR them.`,
      body: `"${cleanTitle}":\n\n${cleanSummary}\n\nRead the full strategic breakdown below 👇`,
      callToAction: `Full guide on Elite Hustle Vault Central:`,
      hashtags: ['#solopreneur', '#EliteHustle', '#buildinpublic'],
      fullPost: `Most people work hard. Very few build systems that work hard FOR them.\n\n"${cleanTitle}":\n\n${cleanSummary}\n\nRead the full strategic breakdown on Elite Hustle Vault Central: ${safeUrl} #solopreneur #EliteHustle #buildinpublic`,
      threadTweets: [
        `Most people work hard. Very few build systems that work hard FOR them.\n\nHere is how to build high-margin asymmetric leverage: 🧵👇`,
        `1/ "${cleanTitle}"\n\n${cleanSummary}`,
        `2/ The rule of compounding:\nSpend 80% of your energy building assets that pay you back for the next 5 years, not just the next 5 days.`,
        `3/ Read the full step-by-step masterclass on Elite Hustle Vault Central:\n${safeUrl}\n\nBookmark & repost if this gave you clarity! 🔁`,
      ],
    },
    suggestedHashtags: ['#EliteHustle', '#VaultCentral', '#Solopreneur', '#PassiveIncome', '#ScaleUp', '#Productivity'],
    keyThemes: ['Systematic Scaling', 'High-Leverage Work', 'Knowledge Vaults', 'Digital Asset Generation'],
  };

  return res.json({
    success: true,
    data: fallbackData,
  });
});

// 3. Drafts CRUD Endpoints
app.get('/api/drafts', (_req: Request, res: Response) => {
  const drafts = readDrafts();
  return res.json({ drafts });
});

app.post('/api/drafts', (req: Request, res: Response) => {
  const { id, title, summary, url, tone, focusAngle, platforms } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Draft title is required.' });
  }

  const drafts = readDrafts();
  const newDraft = {
    id: id || ('draft-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6)),
    title: title.trim(),
    summary: (summary || '').trim(),
    url: (url || '').trim(),
    tone: tone || 'authoritative',
    focusAngle: focusAngle || 'actionable',
    platforms: platforms || {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  drafts.unshift(newDraft);
  writeDrafts(drafts);
  return res.status(201).json({ draft: newDraft });
});

app.put('/api/drafts/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, summary, url, tone, focusAngle, platforms } = req.body;

  const drafts = readDrafts();
  const index = drafts.findIndex((d) => d.id === id);

  if (index === -1) {
    // Resilient upsert if draft was stored locally
    const createdDraft = {
      id,
      title: title !== undefined ? title.trim() : 'Untitled Draft',
      summary: summary !== undefined ? summary.trim() : '',
      url: url !== undefined ? url.trim() : '',
      tone: tone || 'authoritative',
      focusAngle: focusAngle || 'actionable',
      platforms: platforms || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    drafts.unshift(createdDraft);
    writeDrafts(drafts);
    return res.json({ draft: createdDraft });
  }

  const existing = drafts[index];
  const updatedDraft = {
    ...existing,
    title: title !== undefined ? title.trim() : existing.title,
    summary: summary !== undefined ? summary.trim() : existing.summary,
    url: url !== undefined ? url.trim() : existing.url,
    tone: tone || existing.tone,
    focusAngle: focusAngle || existing.focusAngle,
    platforms: platforms || existing.platforms,
    updatedAt: new Date().toISOString(),
  };

  drafts[index] = updatedDraft;
  writeDrafts(drafts);
  return res.json({ draft: updatedDraft });
});

app.delete('/api/drafts/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  let drafts = readDrafts();
  drafts = drafts.filter((d) => d.id !== id);
  writeDrafts(drafts);
  return res.json({ success: true, message: 'Draft deleted successfully.' });
});

// Setup Vite or Static File Serving
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Elite Hustle Content Studio running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
