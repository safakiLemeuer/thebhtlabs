// app/api/chat/route.js — Secure server-side Anthropic proxy
import { NextResponse } from 'next/server';

const RATE_LIMIT = new Map();
const MAX_REQUESTS = 8;
const WINDOW_MS = 60000;

export async function POST(request) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const window = RATE_LIMIT.get(ip) || { count: 0, start: now };
  if (now - window.start > WINDOW_MS) {
    window.count = 0;
    window.start = now;
  }
  window.count++;
  RATE_LIMIT.set(ip, window);
  if (window.count > MAX_REQUESTS) {
    return NextResponse.json({ content: "You're asking great questions! To continue, email us at info@bhtsolutions.com or book a free call." }, { status: 429 });
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ content: "Chat is being configured. Email us at info@bhtsolutions.com — we respond within 2 hours." });
  }

  try {
    const { messages } = await request.json();
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: `You are the AI assistant for TheBHTLabs, the skunkworks R&D division of BHT Solutions (Bluebery Hawaii Technology Solutions LLC). 
BHT is SBA 8(a), EDWOSB, WOSB certified. Microsoft Certified Azure Solutions Architect. CyberAB Registered Practitioner. SAFe 5 Agile. Wiz-certified cloud security. CAGE: 7DBB9, UEI: ZW6GMVL368J6.
Specialties: Azure Government Cloud, M365 GCC/GCC-High, CMMC Level 2, Copilot Studio, AI governance.
Keep answers concise (2-3 sentences). Direct people to the assessment, packages, or contact form when appropriate.
If asked about pricing: Free Discovery, AI Sprint ($2,500), AI Launchpad ($7,500/mo), AI Transformation (custom).`,
        messages: messages.slice(-6),
      }),
    });
    const data = await res.json();
    const content = data.content?.[0]?.text || "Connection issue. Email info@bhtsolutions.com";
    return NextResponse.json({ content });
  } catch (e) {
    return NextResponse.json({ content: "Connection issue. Reach us at info@bhtsolutions.com" });
  }
}
