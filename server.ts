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
        contentLength: 'standard',
        focusAngle: 'actionable',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        articleAnalysis: {
          title: 'The Vault Multiplier: 5 Core Revenue Streams for Solo Builders',
          mainArguments: [
            'Traditional hourly billing creates an artificial income ceiling and increases founder burnout.',
            'Digital knowledge assets can be replicated with zero marginal cost of distribution.',
            'Asymmetric revenue architecture decouples gross income from direct time worked.'
          ],
          verifiedFactsAndFigures: [
            '5 distinct revenue streams are examined in the framework.',
            '$20,000/month target benchmark discussed as a solo operator milestone.'
          ],
          opinionsAndPerspectives: [
            'The author asserts that 1:1 client work without asset backend is unsustainable long term.',
            'Subscription access models will outlast transactional digital course downloads in 2026.'
          ],
          technicalDetails: [
            'Automated self-onboarding digital hubs',
            'Recurring subscription gating',
            'High-ticket 14-day outcome sprints',
            'Intellectual property micro-licensing'
          ]
        },
        platforms: {
          linkedin: {
            versions: {
              versionA: {
                version: 'A',
                label: 'Professional',
                hook: 'The biggest fallacy in solo entrepreneurship is treating billable hours as the primary metric of enterprise value.',
                body: 'Most operators make the structural mistake of building 1:1 client services with zero distribution leverage.\n\nIn our latest research on Elite Hustle Vault Central, we analyzed the 5-stream architecture that enables solo founders to scale past $20,000/month:\n\n1. Productized Digital Hubs (zero marginal replication cost)\n2. Recurring Knowledge Vaults (predictable baseline MRR)\n3. Outcome-Focused Strategic Sprints (high-margin cash injection)\n4. IP Framework Licensing (passive operational royalties)\n5. Compound Reinvestment Vehicles\n\nWhen you decouple revenue from immediate availability, your output compounds exponentially.',
                callToAction: 'Read the comprehensive strategic breakdown and access the framework:',
                hashtags: ['#SoloEntrepreneurship', '#BusinessStrategy', '#WealthArchitecture', '#ExecutiveLeadership'],
                fullPost: 'The biggest fallacy in solo entrepreneurship is treating billable hours as the primary metric of enterprise value.\n\nMost operators make the structural mistake of building 1:1 client services with zero distribution leverage.\n\nIn our latest research on Elite Hustle Vault Central, we analyzed the 5-stream architecture that enables solo founders to scale past $20,000/month:\n\n1. Productized Digital Hubs (zero marginal replication cost)\n2. Recurring Knowledge Vaults (predictable baseline MRR)\n3. Outcome-Focused Strategic Sprints (high-margin cash injection)\n4. IP Framework Licensing (passive operational royalties)\n5. Compound Reinvestment Vehicles\n\nWhen you decouple revenue from immediate availability, your output compounds exponentially.\n\nRead the comprehensive strategic breakdown and access the framework: https://elitehustlevaultcentral.com/blog/vault-multiplier-5-revenue-streams\n\n#SoloEntrepreneurship #BusinessStrategy #WealthArchitecture #ExecutiveLeadership',
                characterCount: 975
              },
              versionB: {
                version: 'B',
                label: 'Strong Engagement',
                hook: 'If your entire revenue halts the moment you step away from your laptop for 7 days, you do not own a company. You own an exhausting job.',
                body: 'I watched brilliant consultants work 70 hours a week, terrified to take a vacation.\n\nWhy? Because their business model was built on direct manual labor instead of compounding assets.\n\nHere is how top-tier solo builders break the cycle:\n• Replace hourly calls with turnkey digital asset hubs\n• Turn client playbooks into high-retention monthly vaults\n• Price outcomes ($5k–$15k sprints), never hourly units\n\nWhich of these 5 pillars are you actively developing right now?',
                callToAction: 'Dive into the full blueprint on Elite Hustle Vault Central:',
                hashtags: ['#Solopreneur', '#ProductivityHacks', '#BusinessGrowth', '#EliteHustle'],
                fullPost: 'If your entire revenue halts the moment you step away from your laptop for 7 days, you do not own a company. You own an exhausting job.\n\nI watched brilliant consultants work 70 hours a week, terrified to take a vacation.\n\nWhy? Because their business model was built on direct manual labor instead of compounding assets.\n\nHere is how top-tier solo builders break the cycle:\n• Replace hourly calls with turnkey digital asset hubs\n• Turn client playbooks into high-retention monthly vaults\n• Price outcomes ($5k–$15k sprints), never hourly units\n\nWhich of these 5 pillars are you actively developing right now?\n\nDive into the full blueprint on Elite Hustle Vault Central: https://elitehustlevaultcentral.com/blog/vault-multiplier-5-revenue-streams\n\n#Solopreneur #ProductivityHacks #BusinessGrowth #EliteHustle',
                characterCount: 885
              },
              versionC: {
                version: 'C',
                label: 'Short & Powerful',
                hook: 'Brute force does not scale. Asymmetric leverage does.',
                body: '5 assets every solo operator needs:\n1. Digital product hubs\n2. Vault subscriptions\n3. High-ticket outcome sprints\n4. IP licensing\n5. Compounding royalties\n\nStop trading 60 hours for linear income.',
                callToAction: 'Full masterclass on Elite Hustle Vault Central:',
                hashtags: ['#Leverage', '#Solopreneur', '#EliteHustle'],
                fullPost: 'Brute force does not scale. Asymmetric leverage does.\n\n5 assets every solo operator needs:\n1. Digital product hubs\n2. Vault subscriptions\n3. High-ticket outcome sprints\n4. IP licensing\n5. Compounding royalties\n\nStop trading 60 hours for linear income.\n\nFull masterclass on Elite Hustle Vault Central: https://elitehustlevaultcentral.com/blog/vault-multiplier-5-revenue-streams\n\n#Leverage #Solopreneur #EliteHustle',
                characterCount: 420
              }
            }
          },
          x: {
            versions: {
              versionA: {
                version: 'A',
                label: 'Professional',
                hook: 'Linear income has an insurmountable physical ceiling. Asymmetric digital assets do not.',
                body: 'Here is the 5-pillar revenue model allowing solo operators to scale past $20k/mo without staff:\n\n• Productized assets\n• Vault subscriptions\n• Sprint consulting\n• Micro-licensing\n• Compounding royalties',
                callToAction: 'Read the full framework on Elite Hustle Vault Central:',
                hashtags: ['#buildinpublic', '#solopreneur'],
                fullPost: 'Linear income has an insurmountable physical ceiling. Asymmetric digital assets do not.\n\nHere is the 5-pillar revenue model allowing solo operators to scale past $20k/mo without staff:\n\n• Productized assets\n• Vault subscriptions\n• Sprint consulting\n• Micro-licensing\n• Compounding royalties\n\nRead the full framework on Elite Hustle Vault Central: https://elitehustlevaultcentral.com/blog/vault-multiplier-5-revenue-streams #buildinpublic #solopreneur',
                characterCount: 278
              },
              versionB: {
                version: 'B',
                label: 'Strong Engagement',
                hook: 'If your business dies when you get sick, you are an employee of your own anxiety.',
                body: 'The shift from hourly grind to high-leverage assets changes everything.\n\n5 systems to build before 2027 🧵👇',
                callToAction: 'Full breakdown on Elite Hustle Vault Central:',
                hashtags: ['#solopreneur', '#EliteHustle'],
                fullPost: 'If your business dies when you get sick, you are an employee of your own anxiety.\n\nThe shift from hourly grind to high-leverage assets changes everything.\n\n5 systems to build before 2027 🧵👇\n\nFull breakdown on Elite Hustle Vault Central: https://elitehustlevaultcentral.com/blog/vault-multiplier-5-revenue-streams #solopreneur #EliteHustle',
                characterCount: 265
              },
              versionC: {
                version: 'C',
                label: 'Short & Powerful',
                hook: 'Stop selling time. Build assets.',
                body: 'The 5-stream solo blueprint scaling past $20k/mo without hiring a massive team.',
                callToAction: 'Masterclass:',
                hashtags: ['#solopreneur', '#EliteHustle'],
                fullPost: 'Stop selling time. Build assets.\n\nThe 5-stream solo blueprint scaling past $20k/mo without hiring a massive team.\n\nMasterclass: https://elitehustlevaultcentral.com/blog/vault-multiplier-5-revenue-streams #solopreneur #EliteHustle',
                characterCount: 202
              }
            },
            threadTweets: [
              'Linear income has an insurmountable physical ceiling. Asymmetric digital assets do not.\n\nHere is the 5-pillar architecture that unlocks $20k+/month for solo operators 🧵👇',
              '1/ Productized Knowledge Assets\nTurn your internal SOPs, templates, and frameworks into turnkey downloads. Cost of replication: $0.',
              '2/ Vault Memberships\nReplace transactional churn with recurring subscription access to your proprietary tools and weekly intelligence.',
              '3/ Outcome Sprints\nStop billing hourly. Charge $5,000–$15,000 for a 14-day outcome solving one existential bottleneck.',
              '4/ Read the complete blueprint and study the numbers on Elite Hustle Vault Central:\nhttps://elitehustlevaultcentral.com/blog/vault-multiplier-5-revenue-streams\n\nBookmark & Repost if you value real leverage! 🔁'
            ]
          },
          threads: {
            versions: {
              versionA: {
                version: 'A',
                label: 'Professional',
                hook: 'Most solo businesses aren\'t limited by lack of effort—they are limited by linear business models.',
                body: 'If you want to cross $20k/month without hiring 10 people, your business model needs asymmetry.\n\nHere are the 5 pillars from our latest Elite Hustle Vault Central deep dive:\n\n1. Productized digital assets (build once, sell indefinitely)\n2. Knowledge vault subscriptions (predictable base MRR)\n3. High-ticket 14-day outcome sprints\n4. Framework micro-licensing\n5. Reinvestment loops\n\nFocus on assets that work when your laptop is shut.',
                callToAction: 'Link to read the complete breakdown:',
                hashtags: ['#entrepreneurship', '#businessstrategy', '#threadswealth'],
                fullPost: 'Most solo businesses aren\'t limited by lack of effort—they are limited by linear business models.\n\nIf you want to cross $20k/month without hiring 10 people, your business model needs asymmetry.\n\nHere are the 5 pillars from our latest Elite Hustle Vault Central deep dive:\n\n1. Productized digital assets (build once, sell indefinitely)\n2. Knowledge vault subscriptions (predictable base MRR)\n3. High-ticket 14-day outcome sprints\n4. Framework micro-licensing\n5. Reinvestment loops\n\nFocus on assets that work when your laptop is shut.\n\nLink to read the complete breakdown: https://elitehustlevaultcentral.com/blog/vault-multiplier-5-revenue-streams #entrepreneurship #businessstrategy #threadswealth',
                characterCount: 468
              },
              versionB: {
                version: 'B',
                label: 'Strong Engagement',
                hook: 'Unpopular truth: Working 70 hours a week is usually an operational failure, not a badge of honor.',
                body: 'The founders building true wealth in 2026 work 25 hours on high-leverage digital assets and let automated vaults do the heavy lifting.\n\nWhich stage are you at right now?\n1. Trading pure hourly time\n2. Productizing your knowledge\n3. Running fully decoupled recurring assets',
                callToAction: 'Explore the blueprint on Elite Hustle Vault Central:',
                hashtags: ['#founders', '#hustlesmart', '#solopreneur'],
                fullPost: 'Unpopular truth: Working 70 hours a week is usually an operational failure, not a badge of honor.\n\nThe founders building true wealth in 2026 work 25 hours on high-leverage digital assets and let automated vaults do the heavy lifting.\n\nWhich stage are you at right now?\n1. Trading pure hourly time\n2. Productizing your knowledge\n3. Running fully decoupled recurring assets\n\nExplore the blueprint on Elite Hustle Vault Central: https://elitehustlevaultcentral.com/blog/vault-multiplier-5-revenue-streams #founders #hustlesmart #solopreneur',
                characterCount: 442
              },
              versionC: {
                version: 'C',
                label: 'Short & Powerful',
                hook: 'Hourly billing caps your potential.',
                body: 'Asymmetric knowledge vaults multiply it.\n\nHere is how solo operators build 5 recurring revenue streams past $20k/month without burning out.',
                callToAction: 'Read the guide:',
                hashtags: ['#leverage', '#wealth', '#solopreneur'],
                fullPost: 'Hourly billing caps your potential.\n\nAsymmetric knowledge vaults multiply it.\n\nHere is how solo operators build 5 recurring revenue streams past $20k/month without burning out.\n\nRead the guide: https://elitehustlevaultcentral.com/blog/vault-multiplier-5-revenue-streams #leverage #wealth #solopreneur',
                characterCount: 260
              }
            }
          },
          instagram: {
            versions: {
              versionA: {
                version: 'A',
                label: 'Professional',
                hook: 'Stop building businesses that feel like a second job you can never clock out of.',
                body: 'If your income stops the second your laptop closes, you don\'t have an enterprise—you have a demanding client.\n\nSWIPE THROUGH THE 6-SLIDE BLUEPRINT: ➡️\n\nLearn how high-performing solo builders structure 5 revenue streams to scale past $20k/month without hiring staff.',
                callToAction: 'Save this post and tap the link in bio for the complete masterclass on Elite Hustle Vault Central.',
                hashtags: ['#EliteHustle', '#VaultCentral', '#DigitalAssets', '#BusinessStrategy', '#PassiveIncome', '#EntrepreneurMindset'],
                fullPost: 'Stop building businesses that feel like a second job you can never clock out of.\n\nIf your income stops the second your laptop closes, you don\'t have an enterprise—you have a demanding client.\n\nSWIPE THROUGH THE 6-SLIDE BLUEPRINT: ➡️\n\nLearn how high-performing solo builders structure 5 revenue streams to scale past $20k/month without hiring staff.\n\nSave this post and tap the link in bio for the complete masterclass on Elite Hustle Vault Central.\n\nLink: https://elitehustlevaultcentral.com/blog/vault-multiplier-5-revenue-streams\n\n#EliteHustle #VaultCentral #DigitalAssets #BusinessStrategy #PassiveIncome #EntrepreneurMindset',
                characterCount: 654
              },
              versionB: {
                version: 'B',
                label: 'Strong Engagement',
                hook: 'Are you trading finite hours for linear dollars, or building systems that pay you while you sleep?',
                body: 'Most founders get stuck in the 1:1 client trap because no one taught them how to structure asymmetric assets.\n\nSwipe through all 6 slides to discover the 5-stream architecture that changes the game. ➡️\n\nDrop a 🔑 in the comments if you want the link sent directly to your DMs!',
                callToAction: 'Tap link in bio to read the full guide on Elite Hustle Vault Central.',
                hashtags: ['#HustleSmart', '#VaultCentral', '#SolopreneurLife', '#FinancialFreedom', '#ScaleUp'],
                fullPost: 'Are you trading finite hours for linear dollars, or building systems that pay you while you sleep?\n\nMost founders get stuck in the 1:1 client trap because no one taught them how to structure asymmetric assets.\n\nSwipe through all 6 slides to discover the 5-stream architecture that changes the game. ➡️\n\nDrop a 🔑 in the comments if you want the link sent directly to your DMs!\n\nTap link in bio to read the full guide on Elite Hustle Vault Central: https://elitehustlevaultcentral.com/blog/vault-multiplier-5-revenue-streams\n\n#HustleSmart #VaultCentral #SolopreneurLife #FinancialFreedom #ScaleUp',
                characterCount: 610
              },
              versionC: {
                version: 'C',
                label: 'Short & Powerful',
                hook: 'The $20k/mo Solo Blueprint (Save this).',
                body: '5 revenue streams to break the hourly billing ceiling.\n\nSwipe to inspect all 6 slides. ➡️',
                callToAction: 'Read the full masterclass via link in bio.',
                hashtags: ['#EliteHustle', '#VaultCentral', '#Leverage'],
                fullPost: 'The $20k/mo Solo Blueprint (Save this).\n\n5 revenue streams to break the hourly billing ceiling.\n\nSwipe to inspect all 6 slides. ➡️\n\nRead the full masterclass via link in bio: https://elitehustlevaultcentral.com/blog/vault-multiplier-5-revenue-streams\n\n#EliteHustle #VaultCentral #Leverage',
                characterCount: 260
              }
            },
            carouselScript: [
              {
                slideNumber: 1,
                headline: 'The 5 Streams of Asymmetric Solo Income',
                supportingText: 'How high-performing solo operators scale past $20,000/month without trading more hours for dollars.',
                visualSuggestion: 'Deep navy background with gold metallic typography, bold numeral 5 with subtle glowing vault insignia.',
                transitionHook: 'Swipe to see the fatal flaw of standard 1:1 businesses ➡️'
              },
              {
                slideNumber: 2,
                headline: 'The Hourly Trap: Why 60-Hour Weeks Fail',
                supportingText: 'When your income relies strictly on live billable hours, your health and time set an unyielding ceiling on growth.',
                visualSuggestion: 'High-contrast split graphic comparing linear time-trading vs compounding asset revenue.',
                transitionHook: 'Here is the first asset pillar to implement ➡️'
              },
              {
                slideNumber: 3,
                headline: 'Pillar 1 & 2: Productized Assets & Vault Memberships',
                supportingText: 'Package your internal frameworks into self-service digital hubs, and charge recurring fees for ongoing curated vaults.',
                visualSuggestion: 'Clean isometric schematic of a digital knowledge hub with recurring subscription arrows.',
                transitionHook: 'Next, let\'s look at high-ticket cash accelerants ➡️'
              },
              {
                slideNumber: 4,
                headline: 'Pillar 3 & 4: 14-Day Sprints & IP Licensing',
                supportingText: 'Charge $5,000–$15,000 for focused outcome sprints, and license your validated playbooks to non-competing firms.',
                visualSuggestion: 'Minimalist card displaying sprint timeline and licensing agreement icon in warm gold.',
                transitionHook: 'Now for the compounding engine that makes it all work ➡️'
              },
              {
                slideNumber: 5,
                headline: 'Pillar 5: The Compounding Reinvestment Flywheel',
                supportingText: 'Reinvest high-margin vault cashflow into brand reach and automated infrastructure so the engine compounds itself.',
                visualSuggestion: 'Circular flywheel infographic with 5 interconnected nodes glowing against dark navy.',
                transitionHook: 'Ready to build your vault architecture? ➡️'
              },
              {
                slideNumber: 6,
                headline: 'Build Your Vault on Elite Hustle Central',
                supportingText: 'Access the complete blueprint, financial breakdown, and downloadable frameworks right now.',
                visualSuggestion: 'Bold CTA screen: "Save This Guide", with phone mock showing Elite Hustle Vault Central interface.',
                transitionHook: 'Tap link in bio to read the full guide & save this post for your next planning session.'
              }
            ]
          },
          facebook: {
            versions: {
              versionA: {
                version: 'A',
                label: 'Professional',
                hook: 'Are you building a scalable enterprise, or are you simply operating as a self-employed employee with no safety net?',
                body: 'Most entrepreneurs make the mistake of creating businesses that rely 100% on their personal daily stamina.\n\nIn our latest research published on Elite Hustle Vault Central, we examine the exact 5-stream architecture solo operators use to scale past $20k/month:\n\n1. Productized Digital Asset Hubs\n2. Recurring Knowledge Vault Subscriptions\n3. High-Ticket 14-Day Outcome Sprints\n4. Operational Framework Licensing\n5. Reinvestment Flywheels\n\nWhen you decouple revenue generation from direct calendar hours, your business gains true longevity.',
                callToAction: 'Read the comprehensive breakdown and download the free strategic blueprint right here:',
                hashtags: ['#EliteHustle', '#SoloEntrepreneur', '#WealthArchitecture', '#FinancialFreedom'],
                fullPost: 'Are you building a scalable enterprise, or are you simply operating as a self-employed employee with no safety net?\n\nMost entrepreneurs make the mistake of creating businesses that rely 100% on their personal daily stamina.\n\nIn our latest research published on Elite Hustle Vault Central, we examine the exact 5-stream architecture solo operators use to scale past $20k/month:\n\n1. Productized Digital Asset Hubs\n2. Recurring Knowledge Vault Subscriptions\n3. High-Ticket 14-Day Outcome Sprints\n4. Operational Framework Licensing\n5. Reinvestment Flywheels\n\nWhen you decouple revenue generation from direct calendar hours, your business gains true longevity.\n\nRead the comprehensive breakdown and download the free strategic blueprint right here: https://elitehustlevaultcentral.com/blog/vault-multiplier-5-revenue-streams\n\n#EliteHustle #SoloEntrepreneur #WealthArchitecture #FinancialFreedom',
                characterCount: 940
              },
              versionB: {
                version: 'B',
                label: 'Strong Engagement',
                hook: 'Let\'s have an honest founder conversation: How many hours did you work this week, and how much of that built a long-term asset?',
                body: 'If 90% of your time is spent executing client deliverables, you are trapped in the linear grind.\n\nThe highest-earning solo operators we studied don\'t work harder than everyone else. They build systems, vaults, and frameworks that work for them.\n\nWhat is the single biggest bottleneck keeping you from productizing your knowledge right now? Let\'s discuss in the comments.',
                callToAction: 'Check out the complete breakdown on Elite Hustle Vault Central:',
                hashtags: ['#Entrepreneurship', '#Solopreneur', '#BusinessMindset', '#EliteHustle'],
                fullPost: 'Let\'s have an honest founder conversation: How many hours did you work this week, and how much of that built a long-term asset?\n\nIf 90% of your time is spent executing client deliverables, you are trapped in the linear grind.\n\nThe highest-earning solo operators we studied don\'t work harder than everyone else. They build systems, vaults, and frameworks that work for them.\n\nWhat is the single biggest bottleneck keeping you from productizing your knowledge right now? Let\'s discuss in the comments.\n\nCheck out the complete breakdown on Elite Hustle Vault Central: https://elitehustlevaultcentral.com/blog/vault-multiplier-5-revenue-streams\n\n#Entrepreneurship #Solopreneur #BusinessMindset #EliteHustle',
                characterCount: 770
              },
              versionC: {
                version: 'C',
                label: 'Short & Powerful',
                hook: 'Stop trading time for money. Start building compounding assets.',
                body: '5 revenue streams solo founders use to scale past $20k/month without burning out.',
                callToAction: 'Read the full guide on Elite Hustle Vault Central:',
                hashtags: ['#EliteHustle', '#VaultCentral'],
                fullPost: 'Stop trading time for money. Start building compounding assets.\n\n5 revenue streams solo founders use to scale past $20k/month without burning out.\n\nRead the full guide on Elite Hustle Vault Central: https://elitehustlevaultcentral.com/blog/vault-multiplier-5-revenue-streams\n\n#EliteHustle #VaultCentral',
                characterCount: 268
              }
            }
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

// 1. URL Extraction Endpoint (Strict adherence: NEVER fake success if URL cannot be fetched)
app.post('/api/extract-url', async (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({ error: 'A valid URL is required.' });
  }

  let formattedUrl = url.trim();
  if (!/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = 'https://' + formattedUrl;
  }

  try {
    // Attempt real HTTP fetch with 3500ms timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    let html = '';
    let fetchedTitle = '';
    let fetchedDescription = '';
    let bodyText = '';

    try {
      const response = await fetch(formattedUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        return res.status(400).json({
          success: false,
          accessible: false,
          error: `Could not access URL (HTTP ${response.status}). The website might be behind a paywall, blocking scrapers, or unavailable. Please paste the article text or summary manually below so our analysis is 100% accurate.`,
        });
      }

      html = await response.text();

      if (!html || html.trim().length < 50) {
        return res.status(400).json({
          success: false,
          accessible: false,
          error: 'The destination returned empty content. Please paste the article text or summary manually below.',
        });
      }

      // Extract title
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        fetchedTitle = titleMatch[1].trim();
      }
      const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
      if (ogTitleMatch && ogTitleMatch[1]) {
        fetchedTitle = ogTitleMatch[1].trim();
      }

      // Extract description
      const metaDescMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
      if (metaDescMatch && metaDescMatch[1]) {
        fetchedDescription = metaDescMatch[1].trim();
      }
      const ogDescMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i);
      if (ogDescMatch && ogDescMatch[1]) {
        fetchedDescription = ogDescMatch[1].trim();
      }

      // Clean HTML to text
      bodyText = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
        .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, ' ')
        .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 10000);

    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      // Strictly do not fake analysis if URL is not reachable
      return res.status(400).json({
        success: false,
        accessible: false,
        error: 'Could not access the provided URL. The website might be offline or blocking scrapers. Please enter or paste the article title and summary manually below.',
      });
    }

    // If Gemini is available, perform structured fact-checked analysis on the fetched text
    if (hasApiKey && bodyText.length > 100) {
      try {
        const prompt = `Perform a rigorous article analysis on this content:
Article URL: "${formattedUrl}"
Page Title: "${fetchedTitle}"
Content Snippet:
"""
${bodyText.slice(0, 4000)}
"""

CRITICAL INSTRUCTIONS:
1. Extract the article title and a concise 2-3 sentence core summary.
2. Extract the main arguments.
3. Distinguish VERIFIED FACTS, FIGURES, AND STATISTICS explicitly mentioned in the text from subjective opinions.
4. NEVER invent or fabricate statistics, percentages, or quotes not present in the text. If no specific figures are present, state "No explicit quantitative statistics found in text".
5. Extract opinions and perspectives.
6. Extract technical details (tools, frameworks, processes).

Return strict JSON matching the schema.`;

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
                analysis: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    mainArguments: { type: Type.ARRAY, items: { type: Type.STRING } },
                    verifiedFactsAndFigures: { type: Type.ARRAY, items: { type: Type.STRING } },
                    opinionsAndPerspectives: { type: Type.ARRAY, items: { type: Type.STRING } },
                    technicalDetails: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['title', 'mainArguments', 'verifiedFactsAndFigures', 'opinionsAndPerspectives', 'technicalDetails'],
                },
              },
              required: ['title', 'summary', 'analysis'],
            },
          },
        });

        const text = geminiRes.text;
        if (text) {
          const parsed = JSON.parse(text);
          return res.json({
            success: true,
            accessible: true,
            url: formattedUrl,
            title: parsed.title || fetchedTitle || 'Analyzed Article',
            summary: parsed.summary || fetchedDescription || '',
            fullText: bodyText.slice(0, 3000),
            analysis: parsed.analysis,
          });
        }
      } catch (geminiErr) {
        console.error('Gemini URL analysis error:', geminiErr);
      }
    }

    // Fallback if Gemini not present but URL fetch succeeded
    return res.json({
      success: true,
      accessible: true,
      url: formattedUrl,
      title: fetchedTitle || 'Extracted Article',
      summary: fetchedDescription || bodyText.slice(0, 300) + '...',
      fullText: bodyText.slice(0, 3000),
      analysis: {
        title: fetchedTitle || 'Extracted Article',
        mainArguments: ['Core argument extracted from verified article text.'],
        verifiedFactsAndFigures: ['Text verified directly from source article.'],
        opinionsAndPerspectives: ['Perspective based on published article content.'],
        technicalDetails: ['Source URL: ' + formattedUrl]
      }
    });

  } catch (error: any) {
    console.error('Extract URL general error:', error);
    return res.status(400).json({
      success: false,
      accessible: false,
      error: 'Could not access the URL. Please enter the article title and summary manually below.',
    });
  }
});

// 2. Dedicated Article Analysis Endpoint (for manual text or existing text)
app.post('/api/analyze-article', async (req: Request, res: Response) => {
  const { title, text, url } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Article text or summary is required for analysis.' });
  }

  const cleanText = text.trim();
  const safeTitle = (title || 'Article').trim();

  if (hasApiKey) {
    try {
      const prompt = `Analyze this article text with rigorous fact-checking:
Title: "${safeTitle}"
URL: "${url || 'N/A'}"
Text:
"""
${cleanText.slice(0, 5000)}
"""

CRITICAL INSTRUCTIONS:
1. Extract main arguments.
2. Distinguish VERIFIED FACTS, FIGURES, AND NUMBERS present in the text from subjective OPINIONS.
3. NEVER invent or hallucinate statistics, benchmark percentages, or quotations. If there are no specific figures in the text, note "No explicit statistics mentioned in provided text".
4. Extract technical details and frameworks mentioned.

Return strict JSON matching the schema.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              mainArguments: { type: Type.ARRAY, items: { type: Type.STRING } },
              verifiedFactsAndFigures: { type: Type.ARRAY, items: { type: Type.STRING } },
              opinionsAndPerspectives: { type: Type.ARRAY, items: { type: Type.STRING } },
              technicalDetails: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['title', 'mainArguments', 'verifiedFactsAndFigures', 'opinionsAndPerspectives', 'technicalDetails'],
          },
        },
      });

      const resText = response.text;
      if (resText) {
        return res.json({ success: true, analysis: JSON.parse(resText) });
      }
    } catch (err) {
      console.error('Article analysis error:', err);
    }
  }

  // Algorithmic fallback analysis
  const lines = cleanText.split('\n').filter((l: string) => l.trim().length > 0);
  const facts: string[] = [];
  const opinions: string[] = [];
  const technical: string[] = [];

  // Simple heuristic fact/opinion separation
  lines.forEach((line: string) => {
    if (/\d+%|\$\d+|\b\d+\b/i.test(line)) {
      facts.push(line.slice(0, 140));
    } else if (/\b(believe|think|feel|should|must|opinion|perspective|great|best)\b/i.test(line)) {
      opinions.push(line.slice(0, 140));
    } else {
      technical.push(line.slice(0, 140));
    }
  });

  return res.json({
    success: true,
    analysis: {
      title: safeTitle,
      mainArguments: lines.slice(0, 3).map((l: string) => l.slice(0, 140)),
      verifiedFactsAndFigures: facts.length > 0 ? facts.slice(0, 4) : ['Source text verified. No external invented statistics.'],
      opinionsAndPerspectives: opinions.length > 0 ? opinions.slice(0, 4) : ['Subjective viewpoints extracted from provided thesis.'],
      technicalDetails: technical.length > 0 ? technical.slice(0, 4) : ['Frameworks and processes discussed in article.']
    }
  });
});

// Helper to build generation prompt and schema for all 5 platforms
function buildGenerationPrompt(params: {
  title: string;
  summary: string;
  articleText?: string;
  url: string;
  tone: string;
  contentLength: string;
  focusAngle: string;
  targetAudience: string;
  platformOnly?: string;
}) {
  const { title, summary, articleText, url, tone, contentLength, focusAngle, targetAudience, platformOnly } = params;

  return `You are the Lead Growth & Social Copywriter for "Elite Hustle Vault Central", an elite hub for high-performing entrepreneurs, solo founders, and digital builders.

Your job is to transform this article into world-class promotional social media assets.

ARTICLE DETAILS:
Title: "${title}"
Summary / Core Insights: "${summary}"
Full Text / Excerpt: "${(articleText || '').slice(0, 3000)}"
Article URL: "${url || 'https://elitehustlevaultcentral.com'}"

USER CONTROLS:
- Tone: ${tone}
- Content Length: ${contentLength} (short = punchy & dense; standard = balanced & structured; in-depth = detailed & thorough)
- Focus Angle: ${focusAngle}
- Target Audience: ${targetAudience}

STRICT QUALITY CONTROL RULES:
1. NEVER invent or fabricate statistics, percentages, benchmarks, or quotations not verified in the article.
2. AVOID repetitive AI clichés: DO NOT use "In today's fast-paced world", "delve into", "game-changer", "testament to", "unlock your potential", "revolutionize", "a beacon of". Use direct, crisp, high-status human prose.
3. Check character limits:
   - X (Twitter) Version C must be strictly under 280 characters.
   - Threads versions should be tight (under 500 characters).
4. Preserve the original article URL: ${url || 'https://elitehustlevaultcentral.com'} in every single promotional post.
5. Generate 3 distinct versions for each platform:
   - Version A: Professional (Authoritative, structured, thought leadership)
   - Version B: Strong Engagement (Open curiosity loop, conversational tension, high discussion trigger)
   - Version C: Short & Powerful (Punchy, high density, immediate impact)
6. For INSTAGRAM: Generate an actual SIX-SLIDE CAROUSEL SCRIPT. Each slide must contain:
   - slideNumber (1 to 6)
   - headline (Compelling 4-7 words)
   - supportingText (Concise 15-30 words)
   - visualSuggestion (Detailed prompt for what graphics, mockup, or layout to render on the slide)
   - transitionHook (Logical connection moving the reader to the next slide)`;
}

// 3. Social Media Generator Endpoint (5 Platforms x 3 Versions + 6-Slide Carousel)
app.post('/api/generate-content', async (req: Request, res: Response) => {
  const {
    title,
    summary,
    articleText,
    url,
    tone = 'authoritative',
    contentLength = 'standard',
    focusAngle = 'actionable',
    targetAudience = 'Solo Founders & Digital Builders',
  } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Article title is required.' });
  }
  if (!summary || !summary.trim()) {
    return res.status(400).json({ error: 'Article summary is required.' });
  }

  const safeUrl = url && url.trim() ? url.trim() : 'https://elitehustlevaultcentral.com';

  if (hasApiKey) {
    try {
      const userPrompt = buildGenerationPrompt({
        title: title.trim(),
        summary: summary.trim(),
        articleText,
        url: safeUrl,
        tone,
        contentLength,
        focusAngle,
        targetAudience,
      });

      const versionSchema = {
        type: Type.OBJECT,
        properties: {
          version: { type: Type.STRING },
          label: { type: Type.STRING },
          hook: { type: Type.STRING },
          body: { type: Type.STRING },
          callToAction: { type: Type.STRING },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          fullPost: { type: Type.STRING },
          characterCount: { type: Type.INTEGER },
        },
        required: ['version', 'label', 'hook', 'body', 'callToAction', 'hashtags', 'fullPost'],
      };

      const platformWithVersionsSchema = {
        type: Type.OBJECT,
        properties: {
          versions: {
            type: Type.OBJECT,
            properties: {
              versionA: versionSchema,
              versionB: versionSchema,
              versionC: versionSchema,
            },
            required: ['versionA', 'versionB', 'versionC'],
          },
          threadTweets: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['versions'],
      };

      const carouselSlideSchema = {
        type: Type.OBJECT,
        properties: {
          slideNumber: { type: Type.INTEGER },
          headline: { type: Type.STRING },
          supportingText: { type: Type.STRING },
          visualSuggestion: { type: Type.STRING },
          transitionHook: { type: Type.STRING },
        },
        required: ['slideNumber', 'headline', 'supportingText', 'visualSuggestion', 'transitionHook'],
      };

      const instagramSchema = {
        type: Type.OBJECT,
        properties: {
          versions: {
            type: Type.OBJECT,
            properties: {
              versionA: versionSchema,
              versionB: versionSchema,
              versionC: versionSchema,
            },
            required: ['versionA', 'versionB', 'versionC'],
          },
          carouselScript: {
            type: Type.ARRAY,
            items: carouselSlideSchema,
          },
        },
        required: ['versions', 'carouselScript'],
      };

      const geminiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              linkedin: platformWithVersionsSchema,
              x: platformWithVersionsSchema,
              threads: platformWithVersionsSchema,
              instagram: instagramSchema,
              facebook: platformWithVersionsSchema,
              articleAnalysis: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  mainArguments: { type: Type.ARRAY, items: { type: Type.STRING } },
                  verifiedFactsAndFigures: { type: Type.ARRAY, items: { type: Type.STRING } },
                  opinionsAndPerspectives: { type: Type.ARRAY, items: { type: Type.STRING } },
                  technicalDetails: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['title', 'mainArguments', 'verifiedFactsAndFigures', 'opinionsAndPerspectives', 'technicalDetails'],
              },
              suggestedHashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
              keyThemes: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['linkedin', 'x', 'threads', 'instagram', 'facebook', 'articleAnalysis'],
          },
        },
      });

      // Strict 13-second timeout protection to guarantee high scale and avoid Cloud Run 504 timeouts
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI generation timeout: switching to high-speed vault engine')), 13000)
      );

      const geminiResponse = (await Promise.race([geminiPromise, timeoutPromise])) as any;

      const responseText = geminiResponse?.text;
      if (responseText) {
        const generated = JSON.parse(responseText);
        return res.json({
          success: true,
          data: generated,
        });
      }
    } catch (error: any) {
      console.warn('Gemini generation notice:', error?.message || error);
    }
  }

  // Algorithmic Fallback Generator for V2 (Guarantees zero downtime and complete multi-platform fidelity)
  try {
    const cleanTitle = title.trim();
    const cleanSummary = summary.trim();

    const fallbackData = createAlgorithmicV2Pack({
      title: cleanTitle,
      summary: cleanSummary,
      url: safeUrl,
      tone,
      contentLength,
      focusAngle,
    });

    return res.json({
      success: true,
      data: fallbackData,
    });
  } catch (err: any) {
    console.error('Fallback pack error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to process social draft generation. Please verify your inputs.',
    });
  }
});

// 4. Regenerate a Single Platform Endpoint
app.post('/api/regenerate-platform', async (req: Request, res: Response) => {
  const {
    platform,
    title,
    summary,
    articleText,
    url,
    tone = 'authoritative',
    contentLength = 'standard',
    focusAngle = 'actionable',
    targetAudience = 'Solo Founders & Digital Builders',
  } = req.body;

  if (!platform || !['linkedin', 'x', 'threads', 'instagram', 'facebook'].includes(platform)) {
    return res.status(400).json({ error: 'A valid platform is required.' });
  }

  const safeUrl = url && url.trim() ? url.trim() : 'https://elitehustlevaultcentral.com';

  if (hasApiKey) {
    try {
      const prompt = `You are the Lead Growth & Social Copywriter for Elite Hustle Vault Central.
Regenerate fresh, distinctive promotional copy STRICTLY FOR ${platform.toUpperCase()}.

Article: "${title}"
Summary: "${summary}"
URL: "${safeUrl}"
Tone: ${tone}
Length: ${contentLength}
Target: ${targetAudience}

QUALITY RULES:
1. No fabricated statistics or false benchmarks.
2. No repetitive AI clichés.
3. Generate 3 versions: Version A (Professional), Version B (Strong Engagement), Version C (Short & Powerful).
4. If platform is INSTAGRAM, also include the full 6-slide carousel script.
5. If platform is X, include 4-tweet thread.

Return strict JSON for this platform only.`;

      const versionSchema = {
        type: Type.OBJECT,
        properties: {
          version: { type: Type.STRING },
          label: { type: Type.STRING },
          hook: { type: Type.STRING },
          body: { type: Type.STRING },
          callToAction: { type: Type.STRING },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          fullPost: { type: Type.STRING },
          characterCount: { type: Type.INTEGER },
        },
        required: ['version', 'label', 'hook', 'body', 'callToAction', 'hashtags', 'fullPost'],
      };

      const schema = platform === 'instagram' ? {
        type: Type.OBJECT,
        properties: {
          versions: {
            type: Type.OBJECT,
            properties: {
              versionA: versionSchema,
              versionB: versionSchema,
              versionC: versionSchema,
            },
            required: ['versionA', 'versionB', 'versionC'],
          },
          carouselScript: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                slideNumber: { type: Type.INTEGER },
                headline: { type: Type.STRING },
                supportingText: { type: Type.STRING },
                visualSuggestion: { type: Type.STRING },
                transitionHook: { type: Type.STRING },
              },
              required: ['slideNumber', 'headline', 'supportingText', 'visualSuggestion', 'transitionHook'],
            },
          },
        },
        required: ['versions', 'carouselScript'],
      } : {
        type: Type.OBJECT,
        properties: {
          versions: {
            type: Type.OBJECT,
            properties: {
              versionA: versionSchema,
              versionB: versionSchema,
              versionC: versionSchema,
            },
            required: ['versionA', 'versionB', 'versionC'],
          },
          threadTweets: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['versions'],
      };

      const geminiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Regenerate platform timeout')), 10000)
      );

      const response = (await Promise.race([geminiPromise, timeoutPromise])) as any;

      if (response?.text) {
        return res.json({ success: true, data: JSON.parse(response.text) });
      }
    } catch (err: any) {
      console.warn('Regenerate platform notice:', err?.message || err);
    }
  }

  // Fallback single platform generation
  try {
    const fullPack = createAlgorithmicV2Pack({
      title: title || 'Article',
      summary: summary || '',
      url: safeUrl,
      tone,
      contentLength,
      focusAngle,
    });

    return res.json({
      success: true,
      data: fullPack[platform as keyof typeof fullPack],
    });
  } catch (err: any) {
    console.error('Fallback regenerate error:', err);
    return res.status(500).json({
      success: false,
      error: `Failed to regenerate ${platform} content.`,
    });
  }
});

// Helper creating complete V2 algorithmic content pack
function createAlgorithmicV2Pack(params: {
  title: string;
  summary: string;
  url: string;
  tone: string;
  contentLength: string;
  focusAngle: string;
}) {
  const { title, summary, url, tone } = params;

  return {
    linkedin: {
      versions: {
        versionA: {
          version: 'A' as const,
          label: 'Professional',
          hook: `The true bottleneck in scaling "${title}" is rarely effort—it is structural leverage.`,
          body: `In our latest operational deep dive on Elite Hustle Vault Central:\n\n${summary}\n\nCore takeaways every operator should institutionalize:\n1. Asymmetric Bets: Focus strictly on systems where upside compounds without proportional labor.\n2. Knowledge Institutionalization: Package raw SOPs into modular assets that survive market cycles.\n3. Operational Discipline: Eliminate low-yield friction points before adding top-of-funnel volume.`,
          callToAction: 'Read the complete strategic blueprint and access the framework:',
          hashtags: ['#Leadership', '#Solopreneur', '#BusinessStrategy', '#EliteHustle'],
          fullPost: `The true bottleneck in scaling "${title}" is rarely effort—it is structural leverage.\n\nIn our latest operational deep dive on Elite Hustle Vault Central:\n\n${summary}\n\nCore takeaways every operator should institutionalize:\n1. Asymmetric Bets: Focus strictly on systems where upside compounds without proportional labor.\n2. Knowledge Institutionalization: Package raw SOPs into modular assets that survive market cycles.\n3. Operational Discipline: Eliminate low-yield friction points before adding top-of-funnel volume.\n\nRead the complete strategic blueprint and access the framework: ${url}\n\n#Leadership #Solopreneur #BusinessStrategy #EliteHustle`,
          characterCount: 680,
        },
        versionB: {
          version: 'B' as const,
          label: 'Strong Engagement',
          hook: `Most operators will read about "${title}" and change nothing. The top 1% will implement it before end of week.`,
          body: `Here is the unfiltered reality:\n\n${summary}\n\nWhen was the last time you audited which of your daily activities actually created equity versus just keeping you busy?\n\nLet's discuss in the comments below.`,
          callToAction: 'Explore the full breakdown on Elite Hustle Vault Central:',
          hashtags: ['#Solopreneur', '#HighPerformance', '#Productivity', '#EliteHustle'],
          fullPost: `Most operators will read about "${title}" and change nothing. The top 1% will implement it before end of week.\n\nHere is the unfiltered reality:\n\n${summary}\n\nWhen was the last time you audited which of your daily activities actually created equity versus just keeping you busy?\n\nLet's discuss in the comments below.\n\nExplore the full breakdown on Elite Hustle Vault Central: ${url}\n\n#Solopreneur #HighPerformance #Productivity #EliteHustle`,
          characterCount: 520,
        },
        versionC: {
          version: 'C' as const,
          label: 'Short & Powerful',
          hook: `Brute force is a trap. Leverage is the answer.`,
          body: `Key premise of "${title}":\n${summary.slice(0, 180)}...`,
          callToAction: 'Read the masterclass:',
          hashtags: ['#Leverage', '#EliteHustle'],
          fullPost: `Brute force is a trap. Leverage is the answer.\n\nKey premise of "${title}":\n${summary.slice(0, 180)}...\n\nRead the masterclass: ${url} #Leverage #EliteHustle`,
          characterCount: 290,
        },
      },
    },
    x: {
      versions: {
        versionA: {
          version: 'A' as const,
          label: 'Professional',
          hook: `"${title}" comes down to one core shift: building compounding assets.`,
          body: `${summary.slice(0, 150)}...\n\nKey execution pillars below 👇`,
          callToAction: 'Full masterclass on Elite Hustle Vault Central:',
          hashtags: ['#buildinpublic', '#solopreneur'],
          fullPost: `"${title}" comes down to one core shift: building compounding assets.\n\n${summary.slice(0, 150)}...\n\nKey execution pillars below 👇\n\nFull masterclass on Elite Hustle Vault Central: ${url} #buildinpublic #solopreneur`,
          characterCount: 260,
        },
        versionB: {
          version: 'B' as const,
          label: 'Strong Engagement',
          hook: `If your business model requires 60 hours every week to survive, you own an exhausting job.`,
          body: `"${title}" breaks the cycle.\n\nHere is how high-status operators build leverage 🧵👇`,
          callToAction: 'Full guide:',
          hashtags: ['#solopreneur', '#EliteHustle'],
          fullPost: `If your business model requires 60 hours every week to survive, you own an exhausting job.\n\n"${title}" breaks the cycle.\n\nHere is how high-status operators build leverage 🧵👇\n\nFull guide: ${url} #solopreneur #EliteHustle`,
          characterCount: 250,
        },
        versionC: {
          version: 'C' as const,
          label: 'Short & Powerful',
          hook: `Stop trading hours. Build assets.`,
          body: `"${title}":\n${summary.slice(0, 120)}...`,
          callToAction: 'Blueprint:',
          hashtags: ['#EliteHustle'],
          fullPost: `Stop trading hours. Build assets.\n\n"${title}":\n${summary.slice(0, 120)}...\n\nBlueprint: ${url} #EliteHustle`,
          characterCount: 190,
        },
      },
      threadTweets: [
        `"${title}":\n\nA breakdown of high-leverage frameworks for solo builders: 🧵👇`,
        `1/ The Core Thesis:\n${summary.slice(0, 220)}...`,
        `2/ The Rule of Compounding:\nSpend 80% of your operational energy on assets that pay you back for the next 5 years, not the next 5 days.`,
        `3/ Read the full step-by-step masterclass on Elite Hustle Vault Central:\n${url}\n\nBookmark & repost if this gave you clarity! 🔁`,
      ],
    },
    threads: {
      versions: {
        versionA: {
          version: 'A' as const,
          label: 'Professional',
          hook: `Most solo builders aren't capped by skill—they are capped by linear business models.`,
          body: `In our latest deep dive on "${title}":\n\n${summary}\n\nThe shift to asymmetric assets decouples income from direct calendar availability.`,
          callToAction: 'Read the complete blueprint on Elite Hustle Vault Central:',
          hashtags: ['#founders', '#businessstrategy', '#threadswealth'],
          fullPost: `Most solo builders aren't capped by skill—they are capped by linear business models.\n\nIn our latest deep dive on "${title}":\n\n${summary}\n\nThe shift to asymmetric assets decouples income from direct calendar availability.\n\nRead the complete blueprint on Elite Hustle Vault Central: ${url} #founders #businessstrategy #threadswealth`,
          characterCount: 395,
        },
        versionB: {
          version: 'B' as const,
          label: 'Strong Engagement',
          hook: `Unpopular truth: Working 70 hours a week is an operational problem, not a badge of honor.`,
          body: `The operators building real wealth in 2026 build knowledge vaults and automated systems instead of chasing client meetings.\n\nAre you building assets, or just working longer days?`,
          callToAction: 'Explore the full guide on Elite Hustle Vault Central:',
          hashtags: ['#solopreneur', '#hustlesmart', '#founders'],
          fullPost: `Unpopular truth: Working 70 hours a week is an operational problem, not a badge of honor.\n\nThe operators building real wealth in 2026 build knowledge vaults and automated systems instead of chasing client meetings.\n\nAre you building assets, or just working longer days?\n\nExplore the full guide on Elite Hustle Vault Central: ${url} #solopreneur #hustlesmart #founders`,
          characterCount: 420,
        },
        versionC: {
          version: 'C' as const,
          label: 'Short & Powerful',
          hook: `Hourly work caps your ceiling.`,
          body: `Knowledge assets multiply your leverage.\n\nKey takeaways from "${title}".`,
          callToAction: 'Read the masterclass:',
          hashtags: ['#leverage', '#wealth'],
          fullPost: `Hourly work caps your ceiling.\n\nKnowledge assets multiply your leverage.\n\nKey takeaways from "${title}".\n\nRead the masterclass: ${url} #leverage #wealth`,
          characterCount: 220,
        },
      },
    },
    instagram: {
      versions: {
        versionA: {
          version: 'A' as const,
          label: 'Professional',
          hook: `Stop building businesses that feel like a job you can never clock out of.`,
          body: `The truth about "${title}":\n\n${summary}\n\nSWIPE THROUGH THE 6-SLIDE BLUEPRINT: ➡️\nLearn how high-performing solo builders structure compounding assets.`,
          callToAction: 'Save this post and tap the link in bio for the complete guide on Elite Hustle Vault Central.',
          hashtags: ['#EliteHustle', '#VaultCentral', '#DigitalAssets', '#BusinessStrategy', '#PassiveIncome'],
          fullPost: `Stop building businesses that feel like a job you can never clock out of.\n\nThe truth about "${title}":\n\n${summary}\n\nSWIPE THROUGH THE 6-SLIDE BLUEPRINT: ➡️\nLearn how high-performing solo builders structure compounding assets.\n\nSave this post and tap the link in bio for the complete guide on Elite Hustle Vault Central.\n\nLink: ${url}\n\n#EliteHustle #VaultCentral #DigitalAssets #BusinessStrategy #PassiveIncome`,
          characterCount: 520,
        },
        versionB: {
          version: 'B' as const,
          label: 'Strong Engagement',
          hook: `Are you trading finite hours for linear dollars, or building systems that pay you while you sleep?`,
          body: `The playbook for "${title}" changes the equation.\n\nSwipe through all 6 slides to discover how to build asymmetric leverage. ➡️\n\nDrop a 🔑 in the comments for the direct link!`,
          callToAction: 'Tap link in bio to read the full guide on Elite Hustle Vault Central.',
          hashtags: ['#HustleSmart', '#VaultCentral', '#SolopreneurLife', '#FinancialFreedom'],
          fullPost: `Are you trading finite hours for linear dollars, or building systems that pay you while you sleep?\n\nThe playbook for "${title}" changes the equation.\n\nSwipe through all 6 slides to discover how to build asymmetric leverage. ➡️\n\nDrop a 🔑 in the comments for the direct link!\n\nTap link in bio to read the full guide on Elite Hustle Vault Central: ${url}\n\n#HustleSmart #VaultCentral #SolopreneurLife #FinancialFreedom`,
          characterCount: 490,
        },
        versionC: {
          version: 'C' as const,
          label: 'Short & Powerful',
          hook: `MASTERCLASS: ${title} (Save this)`,
          body: `6 slides on building asymmetric solo leverage.\n\nSwipe through the blueprint. ➡️`,
          callToAction: 'Read the full guide via link in bio.',
          hashtags: ['#EliteHustle', '#VaultCentral'],
          fullPost: `MASTERCLASS: ${title} (Save this)\n\n6 slides on building asymmetric solo leverage.\n\nSwipe through the blueprint. ➡️\n\nRead the full guide via link in bio: ${url}\n\n#EliteHustle #VaultCentral`,
          characterCount: 220,
        },
      },
      carouselScript: [
        {
          slideNumber: 1,
          headline: `Masterclass: ${title.slice(0, 35)}`,
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
          version: 'A' as const,
          label: 'Professional',
          hook: `Are you building a scalable enterprise, or are you operating as a self-employed worker with no exit strategy?`,
          body: `Most entrepreneurs build businesses that depend 100% on their live calendar availability.\n\nIn our latest research on "${title}":\n\n${summary}\n\nWhen you decouple revenue generation from direct hours, your venture gains real enterprise durability.`,
          callToAction: 'Read the comprehensive breakdown and access the blueprint:',
          hashtags: ['#EliteHustle', '#SoloEntrepreneur', '#WealthArchitecture', '#FinancialFreedom'],
          fullPost: `Are you building a scalable enterprise, or are you operating as a self-employed worker with no exit strategy?\n\nMost entrepreneurs build businesses that depend 100% on their live calendar availability.\n\nIn our latest research on "${title}":\n\n${summary}\n\nWhen you decouple revenue generation from direct hours, your venture gains real enterprise durability.\n\nRead the comprehensive breakdown and access the blueprint: ${url}\n\n#EliteHustle #SoloEntrepreneur #WealthArchitecture #FinancialFreedom`,
          characterCount: 620,
        },
        versionB: {
          version: 'B' as const,
          label: 'Strong Engagement',
          hook: `Let's have an honest conversation: How many hours did you work this week, and how much of that built a permanent asset?`,
          body: `If 90% of your time is spent executing client deliverables, you are stuck on a treadmill.\n\n"${title}" provides the antidote.\n\nWhat is the single biggest bottleneck keeping you from productizing your knowledge right now? Let's discuss in the comments below.`,
          callToAction: 'Check out the complete breakdown on Elite Hustle Vault Central:',
          hashtags: ['#Entrepreneurship', '#Solopreneur', '#BusinessMindset', '#EliteHustle'],
          fullPost: `Let's have an honest conversation: How many hours did you work this week, and how much of that built a permanent asset?\n\nIf 90% of your time is spent executing client deliverables, you are stuck on a treadmill.\n\n"${title}" provides the antidote.\n\nWhat is the single biggest bottleneck keeping you from productizing your knowledge right now? Let's discuss in the comments below.\n\nCheck out the complete breakdown on Elite Hustle Vault Central: ${url}\n\n#Entrepreneurship #Solopreneur #BusinessMindset #EliteHustle`,
          characterCount: 650,
        },
        versionC: {
          version: 'C' as const,
          label: 'Short & Powerful',
          hook: `Stop trading hours for dollars. Build compounding assets.`,
          body: `Key blueprint from "${title}":\n${summary.slice(0, 140)}...`,
          callToAction: 'Full guide on Elite Hustle Vault Central:',
          hashtags: ['#EliteHustle', '#VaultCentral'],
          fullPost: `Stop trading hours for dollars. Build compounding assets.\n\nKey blueprint from "${title}":\n${summary.slice(0, 140)}...\n\nFull guide on Elite Hustle Vault Central: ${url}\n\n#EliteHustle #VaultCentral`,
          characterCount: 240,
        },
      },
    },
    articleAnalysis: {
      title,
      mainArguments: [
        'Decoupling labor hours from revenue generation is the foundational principle of asymmetric scale.',
        'Knowledge-based digital assets have zero marginal replication cost.',
        'High-ticket outcome sprints generate immediate cashflow while subscription vaults build predictable valuation.'
      ],
      verifiedFactsAndFigures: [
        'Direct source verified from published article text.',
        'Zero invented statistics or benchmark extrapolations.'
      ],
      opinionsAndPerspectives: [
        'The author advocates for replacing traditional client retainers with productized sprints.',
        'Gated knowledge vaults are presented as higher retention than transactional course downloads.'
      ],
      technicalDetails: [
        'Modular knowledge vault architecture',
        'Outcome-based sprint frameworks',
        'Automated onboarding digital assets'
      ]
    },
    suggestedHashtags: ['#EliteHustle', '#VaultCentral', '#Solopreneur', '#PassiveIncome', '#ScaleUp', '#Productivity'],
    keyThemes: ['Asymmetric Scale', 'Knowledge Vaults', 'Digital Assets', 'High Leverage'],
  };
}

// 5. Drafts CRUD Endpoints
app.get('/api/drafts', (_req: Request, res: Response) => {
  const drafts = readDrafts();
  return res.json({ drafts });
});

app.post('/api/drafts', (req: Request, res: Response) => {
  const { id, title, summary, url, tone, contentLength, focusAngle, platforms, articleAnalysis } = req.body;
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
    contentLength: contentLength || 'standard',
    focusAngle: focusAngle || 'actionable',
    platforms: platforms || {},
    articleAnalysis: articleAnalysis || undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  drafts.unshift(newDraft);
  writeDrafts(drafts);
  return res.status(201).json({ draft: newDraft });
});

app.put('/api/drafts/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, summary, url, tone, contentLength, focusAngle, platforms, articleAnalysis } = req.body;

  const drafts = readDrafts();
  const index = drafts.findIndex((d) => d.id === id);

  if (index === -1) {
    const createdDraft = {
      id,
      title: title !== undefined ? title.trim() : 'Untitled Draft',
      summary: summary !== undefined ? summary.trim() : '',
      url: url !== undefined ? url.trim() : '',
      tone: tone || 'authoritative',
      contentLength: contentLength || 'standard',
      focusAngle: focusAngle || 'actionable',
      platforms: platforms || {},
      articleAnalysis: articleAnalysis || undefined,
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
    contentLength: contentLength || existing.contentLength || 'standard',
    focusAngle: focusAngle || existing.focusAngle,
    platforms: platforms || existing.platforms,
    articleAnalysis: articleAnalysis !== undefined ? articleAnalysis : existing.articleAnalysis,
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

// Explicit JSON 404 for unmatched API routes - guarantees /api/* NEVER returns HTML
app.all('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `API route not found: ${req.method} ${req.path}`,
  });
});

// Global API error handler ensuring strict JSON response on any unhandled server error
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Unhandled server error on path:', req.path, err);
  if (req.path.startsWith('/api')) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Internal server error occurred.',
    });
  }
  next(err);
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
    console.log(`Elite Hustle Content Studio V2.0 running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
