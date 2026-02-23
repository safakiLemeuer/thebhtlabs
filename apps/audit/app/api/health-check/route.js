// app/api/health-check/route.js — AI Bot Auditor
import { NextResponse } from 'next/server';
const { getDb } = require('../../../lib/db');

function verifyAdmin(request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  const adminPass = process.env.ADMIN_PASSWORD;
  if (!adminPass) return false;
  if (token === adminPass) return true;
  try {
    const idx = token.lastIndexOf('.');
    if (idx > 0) {
      const t = token.substring(0, idx);
      const sig = token.substring(idx + 1);
      const crypto = require('crypto');
      const expected = crypto.createHmac('sha256', adminPass).update(t).digest('hex');
      if (sig === expected) return true;
    }
  } catch (e) {}
  return false;
}

const BOT_SIGNATURES = [
  {pattern:'intercom',name:'Intercom',type:'support_chat'},
  {pattern:'drift',name:'Drift',type:'sales_chat'},
  {pattern:'zendesk',name:'Zendesk',type:'support_chat'},
  {pattern:'tidio',name:'Tidio',type:'support_chat'},
  {pattern:'crisp.chat',name:'Crisp',type:'support_chat'},
  {pattern:'hubspot',name:'HubSpot',type:'sales_chat'},
  {pattern:'freshdesk',name:'Freshdesk',type:'support_chat'},
  {pattern:'freshchat',name:'Freshchat',type:'support_chat'},
  {pattern:'livechat',name:'LiveChat',type:'support_chat'},
  {pattern:'tawk.to',name:'Tawk.to',type:'support_chat'},
  {pattern:'olark',name:'Olark',type:'support_chat'},
  {pattern:'chatbot.com',name:'ChatBot.com',type:'ai_chat'},
  {pattern:'botpress',name:'Botpress',type:'ai_chat'},
  {pattern:'voiceflow',name:'Voiceflow',type:'ai_chat'},
  {pattern:'dialogflow',name:'Dialogflow',type:'ai_chat'},
  {pattern:'ada.cx',name:'Ada',type:'ai_chat'},
  {pattern:'kommunicate',name:'Kommunicate',type:'ai_chat'},
  {pattern:'landbot',name:'Landbot',type:'ai_chat'},
  {pattern:'manychat',name:'ManyChat',type:'ai_chat'},
  {pattern:'customerly',name:'Customerly',type:'support_chat'},
  {pattern:'gorgias',name:'Gorgias',type:'support_chat'},
  {pattern:'chatwoot',name:'Chatwoot',type:'support_chat'},
  {pattern:'webchat.botframework',name:'MS Bot Framework',type:'ai_chat'},
];

function evaluateGovernance(html) {
  const lower = html.toLowerCase();
  const checks = [];

  const hasAIDisclosure = lower.includes('powered by ai') || lower.includes('ai assistant') || lower.includes('ai-powered') ||
    lower.includes('artificial intelligence') || lower.includes('chatbot') || lower.includes('virtual assistant') ||
    (lower.includes('automated') && (lower.includes('chat') || lower.includes('assistant')));
  checks.push({
    id:'ai_disclosure', name:'AI Transparency Disclosure',
    regulation:'EU AI Act Art. 50 \u00b7 NIST AI RMF MAP 1.6',
    description:'Does the website disclose that users may interact with an AI system?',
    status: hasAIDisclosure ? 'pass' : 'fail',
    detail: hasAIDisclosure ? 'AI/chatbot disclosure language detected on the page.' : 'No visible AI disclosure found. The EU AI Act requires providers to ensure persons are informed they are interacting with an AI system.',
    weight:20, score: hasAIDisclosure ? 20 : 0,
  });

  const hasPrivacy = lower.includes('privacy policy') || lower.includes('privacy notice') || lower.includes('data protection') || lower.includes('/privacy');
  const hasAIPrivacy = hasPrivacy && (lower.includes('ai') || lower.includes('chatbot') || lower.includes('automated'));
  checks.push({
    id:'privacy_notice', name:'AI-Specific Privacy Notice',
    regulation:'GDPR Art. 13-14 \u00b7 DPDPA Sec. 6 \u00b7 UAE PDPL Art. 12',
    description:'Is there a privacy notice that addresses AI/chatbot data processing?',
    status: hasAIPrivacy ? 'pass' : hasPrivacy ? 'warn' : 'fail',
    detail: hasAIPrivacy ? 'Privacy notice found with AI/chatbot data processing references.' : hasPrivacy ? 'General privacy notice found but no specific AI data processing disclosure.' : 'No privacy notice detected.',
    weight:20, score: hasAIPrivacy ? 20 : hasPrivacy ? 10 : 0,
  });

  const hasEscalation = (lower.includes('talk to') && (lower.includes('human') || lower.includes('agent') || lower.includes('person'))) ||
    lower.includes('speak to') || lower.includes('contact us') || lower.includes('live agent') || lower.includes('live chat') || lower.includes('customer service');
  checks.push({
    id:'human_escalation', name:'Human Escalation Path',
    regulation:'NIST AI RMF GOVERN 1.2 \u00b7 EU AI Act Art. 14 \u00b7 ISO 42001',
    description:'Is there a visible path for users to reach a human?',
    status: hasEscalation ? 'pass' : 'fail',
    detail: hasEscalation ? 'Human escalation option detected.' : 'No visible human escalation path found. Users interacting with AI should always have an option to reach a human.',
    weight:15, score: hasEscalation ? 15 : 0,
  });

  const hasCookieConsent = (lower.includes('cookie') && (lower.includes('consent') || lower.includes('accept'))) ||
    lower.includes('cookiebot') || lower.includes('onetrust') || lower.includes('trustarc');
  checks.push({
    id:'cookie_consent', name:'Tracking & Cookie Consent',
    regulation:'ePrivacy Directive \u00b7 GDPR Art. 7',
    description:'Does the site have a cookie consent mechanism?',
    status: hasCookieConsent ? 'pass' : 'warn',
    detail: hasCookieConsent ? 'Cookie consent mechanism detected.' : 'No cookie consent mechanism detected. If the chatbot tracks interactions, explicit consent may be required.',
    weight:10, score: hasCookieConsent ? 10 : 3,
  });

  const hasTerms = lower.includes('terms of service') || lower.includes('terms of use') || lower.includes('acceptable use') || lower.includes('/terms');
  const hasAITerms = hasTerms && (lower.includes('ai') || lower.includes('automated') || lower.includes('chatbot'));
  checks.push({
    id:'ai_terms', name:'AI Acceptable Use Policy',
    regulation:'NIST AI RMF GOVERN 1.1 \u00b7 ISO 42001',
    description:'Are there terms addressing AI-generated content limitations?',
    status: hasAITerms ? 'pass' : hasTerms ? 'warn' : 'fail',
    detail: hasAITerms ? 'Terms found with AI provisions.' : hasTerms ? 'General terms exist but no AI-specific provisions.' : 'No terms of service found.',
    weight:15, score: hasAITerms ? 15 : hasTerms ? 7 : 0,
  });

  const hasGovPage = lower.includes('responsible ai') || lower.includes('ai governance') || lower.includes('ai ethics') || lower.includes('ai principles') || lower.includes('trustworthy ai');
  checks.push({
    id:'ai_governance', name:'Published AI Governance Framework',
    regulation:'NIST AI RMF \u00b7 EU AI Act \u00b7 ISO 42001',
    description:'Does the organization publicly communicate an AI governance framework?',
    status: hasGovPage ? 'pass' : 'fail',
    detail: hasGovPage ? 'AI governance language found on the page.' : 'No public AI governance framework detected.',
    weight:10, score: hasGovPage ? 10 : 0,
  });

  const hasAccessibility = lower.includes('aria-label') || lower.includes('role="dialog"') || lower.includes('aria-live');
  checks.push({
    id:'accessibility', name:'Chat Widget Accessibility',
    regulation:'WCAG 2.1 \u00b7 ADA \u00b7 EU Accessibility Act',
    description:'Does the chat interface include accessibility attributes?',
    status: hasAccessibility ? 'pass' : 'warn',
    detail: hasAccessibility ? 'Accessibility attributes (ARIA) detected in page markup.' : 'Limited accessibility attributes detected. Chat widgets should be keyboard-navigable and screen-reader compatible.',
    weight:10, score: hasAccessibility ? 10 : 3,
  });

  const totalScore = checks.reduce((s,c) => s + c.score, 0);
  const maxScore = checks.reduce((s,c) => s + c.weight, 0);
  return { checks, totalScore, maxScore, percentage: Math.round((totalScore / maxScore) * 100) };
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { domain, action, name, email, company, industry, employees, locale, botsFound, score } = data;

    if (action === 'save-pdf') {
      if (!email || !name) return NextResponse.json({ error: 'Required' }, { status: 400 });
      const db = getDb();
      try {
        db.prepare('INSERT INTO health_checks (domain, name, email, company, industry, employees, locale, action, score, provider) VALUES (?,?,?,?,?,?,?,?,?,?)').run(
          domain||'', name, email, company||'', industry||'', employees||'', locale||'us', 'pdf_download', score||0, botsFound||''
        );
      } catch (e) {}
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        try {
          await fetch('https://api.resend.com/emails', {
            method:'POST', headers:{'Authorization':'Bearer '+resendKey,'Content-Type':'application/json'},
            body: JSON.stringify({
              from: process.env.RESEND_FROM || 'TheBHTLabs <onboarding@resend.dev>',
              to: [process.env.CONTACT_EMAIL || 'info@bhtsolutions.com'],
              reply_to: email,
              subject: 'Bot Audit PDF ['+(score||0)+'%]: '+name+' \u2014 '+domain,
              html: '<div style="font-family:sans-serif"><h2>AI Bot Audit PDF Downloaded</h2><p><strong>'+name+'</strong> ('+email+') at '+(company||domain)+'</p><p>Domain: '+domain+' | Score: '+(score||0)+'% | Bots: '+(botsFound||'None')+'</p></div>'
            })
          });
        } catch(e){}
      }
      return NextResponse.json({ success: true });
    }

    if (!domain || !domain.includes('.')) return NextResponse.json({ error: 'Valid domain required' }, { status: 400 });
    const cleanDomain = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].trim();

    let html = '';
    try {
      const r = await fetch('https://'+cleanDomain, { signal: AbortSignal.timeout(8000),
        headers: {'User-Agent':'Mozilla/5.0 (compatible; BHTLabsBot/1.0; +https://thebhtlabs.com/bot-audit)'} });
      html = await r.text();
    } catch(e) {
      try {
        const r2 = await fetch('http://'+cleanDomain, { signal: AbortSignal.timeout(8000),
          headers: {'User-Agent':'Mozilla/5.0 (compatible; BHTLabsBot/1.0; +https://thebhtlabs.com/bot-audit)'} });
        html = await r2.text();
      } catch(e2) {
        return NextResponse.json({ error: 'Could not reach '+cleanDomain }, { status: 400 });
      }
    }

    const lower = html.toLowerCase();
    const botsDetected = BOT_SIGNATURES.filter(sig => lower.includes(sig.pattern));
    const genericIndicators = [];
    if (lower.includes('chat-widget')||lower.includes('chatwidget')) genericIndicators.push('Chat widget');
    if (lower.includes('data-chat')||lower.includes('chat-bubble')) genericIndicators.push('Chat bubble');
    if (lower.includes('webchat')||lower.includes('web-chat')) genericIndicators.push('Web chat');
    const hasChatbot = botsDetected.length > 0 || genericIndicators.length > 0;
    const governance = evaluateGovernance(html);

    const db = getDb();
    try {
      const botNames = botsDetected.map(b=>b.name).join(', ') || (genericIndicators.length>0?'Generic widget':'None');
      db.prepare('INSERT INTO health_checks (domain,score,provider,spf_status,dmarc_status,dkim_status,has_m365,locale,action) VALUES (?,?,?,?,?,?,?,?,?)').run(
        cleanDomain, governance.percentage, botNames, hasChatbot?'chatbot':'no_chatbot',
        governance.checks.filter(c=>c.status==='pass').length+'/'+governance.checks.length,
        governance.checks.filter(c=>c.status==='fail').length+' fails', hasChatbot?1:0, locale||'us', 'scan'
      );
    } catch(e){}

    return NextResponse.json({
      domain: cleanDomain, hasChatbot,
      bots: botsDetected.map(b=>({name:b.name,type:b.type})),
      genericIndicators, governance,
      disclaimer: 'This analysis examines publicly visible website content only, equivalent to viewing the site in a web browser. No systems were accessed, tested, or penetrated. This is not a security audit, penetration test, or compliance certification.'
    });
  } catch(e) {
    return NextResponse.json({ error: 'Analysis failed.' }, { status: 500 });
  }
}

export async function GET(request) {
  if (!verifyAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = getDb();
  let scans=[], pdfs=[], stats={};
  try { scans = db.prepare("SELECT * FROM health_checks WHERE action='scan' ORDER BY created_at DESC LIMIT 200").all(); } catch(e){}
  try { pdfs = db.prepare("SELECT * FROM health_checks WHERE action='pdf_download' ORDER BY created_at DESC LIMIT 200").all(); } catch(e){}
  try {
    stats = {
      total: db.prepare('SELECT COUNT(*) as c FROM health_checks').get()?.c||0,
      pdfDownloads: db.prepare("SELECT COUNT(*) as c FROM health_checks WHERE action='pdf_download'").get()?.c||0,
      withBots: db.prepare("SELECT COUNT(*) as c FROM health_checks WHERE has_m365=1 AND action='scan'").get()?.c||0,
      avgScore: Math.round(db.prepare("SELECT AVG(score) as a FROM health_checks WHERE action='scan' AND score>0").get()?.a||0),
    };
  } catch(e){}
  return NextResponse.json({ stats, scans, pdfDownloads: pdfs });
}
