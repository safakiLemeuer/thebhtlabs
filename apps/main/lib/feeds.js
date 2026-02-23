// lib/feeds.js
// Server-side RSS feed aggregator with caching
// Fetches from multiple sources, categorizes, and caches for 15 min

const RSS_SOURCES = [
  { url: 'https://federalnewsnetwork.com/category/technology/feed/', category: 'Federal IT', color: '#38BDF8' },
  { url: 'https://www.nextgov.com/rss/all/', category: 'Federal Tech', color: '#38BDF8' },
  { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', category: 'AI News', color: '#00E8B8' },
  { url: 'https://www.microsoft.com/en-us/microsoft-copilot/blog/feed/', category: 'Copilot & Microsoft', color: '#8B5CF6' },
  { url: 'https://blogs.microsoft.com/blog/feed/', category: 'Microsoft', color: '#8B5CF6' },
  { url: 'https://www.govtech.com/rss', category: 'GovTech', color: '#06B6D4' },
  { url: 'https://feeds.feedburner.com/TheHackersNews', category: 'Cybersecurity', color: '#F43F5E' },
  { url: 'https://www.schneier.com/feed/', category: 'Security', color: '#F43F5E' },
];

// In-memory cache
let feedCache = null;
let lastFetch = 0;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// AI-related keyword filter
const AI_KEYWORDS = [
  'artificial intelligence', 'ai ', 'machine learning', 'copilot', 'chatgpt', 'claude',
  'automation', 'generative ai', 'llm', 'large language', 'neural', 'deep learning',
  'gpt', 'openai', 'anthropic', 'microsoft 365', 'azure', 'cybersecurity', 'cmmc',
  'fedramp', 'compliance', 'governance', 'nist', 'federal', 'government tech',
  'agentic', 'agent', 'copilot studio', 'power platform', 'power automate',
  'data breach', 'ransomware', 'zero trust', 'cloud security', 'layoff', 'upskill',
];

function isRelevant(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  return AI_KEYWORDS.some(kw => text.includes(kw));
}

// Simple RSS XML parser (no external dependency needed at runtime)
function parseRSSXml(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const get = (tag) => {
      const m = itemXml.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?(.*?)(?:\\]\\]>)?<\\/${tag}>`, 's'));
      return m ? m[1].trim() : '';
    };
    items.push({
      title: get('title').replace(/<[^>]+>/g, ''),
      link: get('link'),
      description: get('description').replace(/<[^>]+>/g, '').substring(0, 300),
      pubDate: get('pubDate'),
      creator: get('dc:creator') || get('author'),
    });
  }
  return items;
}

export async function fetchFeeds() {
  const now = Date.now();
  if (feedCache && (now - lastFetch) < CACHE_TTL) {
    return feedCache;
  }

  const allItems = [];

  const results = await Promise.allSettled(
    RSS_SOURCES.map(async (source) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const res = await fetch(source.url, {
          signal: controller.signal,
          headers: { 'User-Agent': 'TheBHTLabs/1.0 (RSS Aggregator)' },
        });
        clearTimeout(timeout);

        if (!res.ok) return [];
        const xml = await res.text();
        const items = parseRSSXml(xml);
        
        return items.slice(0, 10).map(item => ({
          ...item,
          category: source.category,
          color: source.color,
          source: source.url.match(/\/\/(?:www\.)?([^/]+)/)?.[1] || source.url,
        }));
      } catch (e) {
        console.warn(`RSS fetch failed for ${source.url}:`, e.message);
        return [];
      }
    })
  );

  for (const result of results) {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value);
    }
  }

  // Filter for relevance and sort by date
  const filtered = allItems
    .filter(item => isRelevant(item.title, item.description))
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .slice(0, 30);

  feedCache = filtered;
  lastFetch = now;
  return filtered;
}

// Fallback static data in case all feeds fail
export const FALLBACK_FEED = [
  { title: "White House Accelerates AI Deployment Across Federal Agencies", category: "Federal AI", color: "#38BDF8", source: "washingtonpost.com", pubDate: new Date().toISOString(), link: "https://www.washingtonpost.com/technology/2026/02/09/trump-administration-ai-push/", description: "New OMB directives remove barriers to AI adoption in government operations across policing, healthcare, defense, and science." },
  { title: "Copilot Studio Gets Claude 4.5, GPT-5.2 & Computer-Using Agents", category: "Copilot & Microsoft", color: "#8B5CF6", source: "microsoft.com", pubDate: new Date().toISOString(), link: "https://www.microsoft.com/en-us/microsoft-copilot/blog/copilot-studio/", description: "Microsoft's agent platform now supports Anthropic and OpenAI's latest models with new CUA capability for desktop automation." },
  { title: "60% of AI Projects Will Be Abandoned Without Governance by 2026", category: "AI Governance", color: "#F59E0B", source: "gartner.com", pubDate: new Date().toISOString(), link: "https://www.gartner.com/reviews/market/ai-governance-platforms", description: "Gartner predicts organizations without AI governance frameworks face significant project abandonment risks." },
  { title: "CMMC Phased Rollout Becoming Barrier for Defense Contracts", category: "Compliance", color: "#F43F5E", source: "federalnewsnetwork.com", pubDate: new Date().toISOString(), link: "https://federalnewsnetwork.com", description: "Industry experts predict CMMC compliance will increasingly determine contract eligibility through 2026." },
  { title: "29% of Hiring Managers Now Require AI Proficiency", category: "Career & AI", color: "#F43F5E", source: "nexford.edu", pubDate: new Date().toISOString(), link: "https://www.nexford.edu/research/surviving-ai-layoffs-reskilling-strategies-for-a-future-proof-career", description: "Survey: nearly 1 in 3 hiring managers only hire AI-proficient candidates. 62% of workers pursuing AI upskilling." },
  { title: "Colorado AI Act Delayed to June 2026; Federal Preemption Accelerates", category: "AI Regulation", color: "#8B5CF6", source: "kslaw.com", pubDate: new Date().toISOString(), link: "https://www.kslaw.com", description: "Colorado enforcement delayed as federal executive order signals intent to preempt state AI laws deemed overly burdensome." },
];
