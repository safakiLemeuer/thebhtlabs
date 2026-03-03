// app/api/partner/route.js
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

// Partner qualification scoring (0-100)
// ── SHARK TANK PARTNER BENCHMARK (v2) ────────────────────────────────────────
// Rubric derived from investor kill criteria:
// 1. India Market Access — named CISO/CTO contacts who will take the call (25pts)
// 2. Delivery Independence — can run engagement without founder on every call (25pts)
// 3. Prior Compliance Experience — has delivered, not just studied (20pts)
// 4. Commitment Signal — 60-day target clients, skin in the game (15pts)
// 5. Revenue Credibility + Microsoft (15pts)
// Total: 100pts → Preferred (80+) / Active (60-79) / Developing (40-59) / Not Ready (<40)
function scorePartner(data) {
  let score = 0;
  const strengths = [];
  const gaps = [];

  // ── 1. INDIA MARKET ACCESS (0-25) ──────────────────────────────────────────
  const contacts = data.ciso_contacts || '';
  if (contacts === '10+')       { score += 25; strengths.push('10+ named CISO/CTO contacts'); }
  else if (contacts === '5-9')  { score += 18; strengths.push('5-9 named contacts'); }
  else if (contacts === '2-4')  { score += 10; }
  else if (contacts === '1')    { score += 5; gaps.push('Only 1 named contact — expand network before first pitch'); }
  else if (contacts === '0')    { score += 0; gaps.push('No named CISO/CTO contacts — critical gap: India buys on relationships'); }

  // City bonus: Mumbai/Bengaluru/Delhi/Hyderabad presence
  const city = (data.city || '').toLowerCase();
  const highValueCities = ['mumbai', 'bengaluru', 'bangalore', 'delhi', 'hyderabad', 'noida', 'gurgaon', 'gurugram', 'pune'];
  if (highValueCities.some(c => city.includes(c))) { score += 3; strengths.push('Based in target city'); }

  // ── 2. DELIVERY INDEPENDENCE (0-25) ────────────────────────────────────────
  const indep = data.delivery_independent || '';
  if (indep === 'yes')          { score += 25; strengths.push('Can deliver independently'); }
  else if (indep === 'partial') { score += 14; gaps.push('Needs support on first 2-3 engagements — factor into capacity'); }
  else if (indep === 'no')      { score += 3;  gaps.push('Cannot deliver independently — adds 8+ hrs BHT time per engagement'); }

  // Team size modifier
  const ts = data.delivery_team_size || '';
  if (ts.includes('25+'))  score += 3;
  else if (ts.includes('11-25')) score += 2;
  else if (ts.includes('6-10')) score += 1;

  // ── 3. COMPLIANCE DELIVERY EXPERIENCE (0-20) ───────────────────────────────
  const exp = data.compliance_experience || '';
  if (exp === 'multiple')       { score += 20; strengths.push('Multiple compliance engagements delivered'); }
  else if (exp === 'once')      { score += 13; strengths.push('1 prior compliance engagement'); }
  else if (exp === 'adjacent')  { score += 7;  gaps.push('Adjacent but not compliance-specific — first engagement needs close oversight'); }
  else if (exp === 'no')        { score += 0;  gaps.push('No compliance delivery experience — Quick Scan pilot only, no Sprints until reference exists'); }

  // References quality
  const refs = (data.client_references || '').trim();
  if (refs.length > 30)  { score += 3; strengths.push('Named references available'); }

  // ── 4. COMMITMENT SIGNAL (0-15) ────────────────────────────────────────────
  const target = data.target_clients_60d || '';
  if (target === '5+')          { score += 15; strengths.push('5+ Quick Scans targeted in 60 days'); }
  else if (target === '3-4')    { score += 11; strengths.push('3-4 Quick Scans targeted'); }
  else if (target === '1-2')    { score += 6; }
  else if (target === '0')      { score += 0; gaps.push('No 60-day commitment — low urgency signal'); }

  // Why partner quality as secondary signal
  const why = (data.why_partner || '').trim();
  if (why.length > 250) score += 2;
  else if (why.length > 100) score += 1;

  // ── 5. REVENUE CREDIBILITY + MICROSOFT (0-12) ──────────────────────────────
  const rev = data.annual_revenue || '';
  if (rev.includes('500 Cr'))      { score += 7; strengths.push('₹500Cr+ revenue — enterprise credibility'); }
  else if (rev.includes('50 Cr'))  { score += 6; }
  else if (rev.includes('10 Cr'))  { score += 5; strengths.push('₹10Cr+ revenue'); }
  else if (rev.includes('2 Cr'))   { score += 3; }
  else if (rev.includes('50L'))    { score += 1; }

  const ms = data.ms_partnership || '';
  if (ms.includes('Solutions Partner'))  { score += 5; strengths.push('MS Solutions Partner'); }
  else if (ms.includes('Action Pack'))   { score += 3; }

  // ── TIER + ADMIN NOTES ─────────────────────────────────────────────────────
  const final = Math.min(100, score);
  let tier, tierLabel;
  if (final >= 80)      { tier = 'Preferred Partner';   tierLabel = 'Priority onboarding — white-label rights, co-sell support, direct Nitin access'; }
  else if (final >= 60) { tier = 'Active Partner';      tierLabel = 'Standard agreement — full enablement package, monthly partner calls'; }
  else if (final >= 40) { tier = 'Developing Partner';  tierLabel = 'Conditional — 60-day pilot, Quick Scan only, milestone review at Day 60'; }
  else                  { tier = 'Not Ready';            tierLabel = 'Redirect to client track — recommend taking India AI assessment as buyer first'; }

  return {
    score: final,
    tier,
    tierLabel,
    strengths,
    gaps,
    adminNote: `Score: ${final}/100 | ${tier} | Strengths: ${strengths.join('; ')} | Gaps: ${gaps.join('; ')}`
  };
}

export async function POST(request) {
  try {
    const data = await request.json();
    if (data.honeypot) return NextResponse.json({ success: true });
    const { name, email, phone, company, website_url, country, city, company_size, years_in_business,
      ms_partnership, certifications, industries_served, current_services, annual_revenue,
      why_partner, existing_clients, delivery_team_size,
      delivery_independent, ciso_contacts, compliance_experience, target_clients_60d, client_references,
      client_industry, client_size, compliance_needs, client_budget, client_contact_title, expected_timeline } = data;
    if (!name || !email || !company) return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Invalid email' }, { status: 400 });

    const qual = scorePartner(data);
    const ip = request.headers.get('x-forwarded-for') || '';

    const db = getDb();
    const stmt = db.prepare('INSERT INTO partner_applications (name, email, phone, company, website_url, country, city, company_size, years_in_business, ms_partnership, certifications, industries_served, current_services, annual_revenue, why_partner, existing_clients, delivery_team_size, qualification_score, qualification_tier, notes, ip_address) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    const r = stmt.run(
      name, email, phone||'', company, website_url||'', country||'', city||'',
      company_size||'', years_in_business||'', ms_partnership||'', certifications||'',
      industries_served||'', current_services||'', annual_revenue||'', why_partner||'',
      existing_clients||'', delivery_team_size||'',
      qual.score, qual.tier,
      // Store new fields in notes JSON
      JSON.stringify({ delivery_independent, ciso_contacts, compliance_experience, target_clients_60d, client_references, client_industry, client_size, compliance_needs, client_budget, client_contact_title, expected_timeline, adminNote: qual.adminNote }),
      ip
    );
    const appId = r.lastInsertRowid;

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      // Alert to BHT with qualification scoring
      try {
        const tierColor = qual.tier === 'Preferred Partner' ? '#059669' : qual.tier === 'Active Partner' ? '#0E7490' : qual.tier === 'Developing Partner' ? '#D97706' : '#DC2626';
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + resendKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || 'TheBHTLabs <onboarding@resend.dev>',
            to: [process.env.CONTACT_EMAIL || 'info@bhtsolutions.com'],
            reply_to: email,
            subject: '[' + qual.tier + ' ' + qual.score + '/100] India Partner: ' + company + ' — ' + (city || country || 'Unknown'),
            html: '<div style="font-family:sans-serif;max-width:600px"><div style="padding:12px 16px;background:' + tierColor + ';border-radius:8px 8px 0 0;color:#fff"><strong>' + qual.tier + ' Partner</strong> · Score: ' + qual.score + '/100' + (qual.strengths && qual.strengths.length ? ' · ' + qual.strengths.join(', ') : '') + (qual.gaps && qual.gaps.length ? '<br><small style="color:#fca5a5">Gaps: ' + qual.gaps.join(' · ') + '</small>' : '') + '</div><table style="width:100%;border-collapse:collapse;font-size:13px"><tr style="background:#F8FAFC"><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">' + name + '</td></tr><tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px"><a href="mailto:' + email + '">' + email + '</a></td></tr><tr style="background:#F8FAFC"><td style="padding:8px;font-weight:bold">Company</td><td style="padding:8px">' + company + (website_url ? ' · <a href="' + website_url + '">' + website_url + '</a>' : '') + '</td></tr><tr><td style="padding:8px;font-weight:bold">Location</td><td style="padding:8px">' + (city || '') + ', ' + (country || '') + '</td></tr><tr style="background:#F8FAFC"><td style="padding:8px;font-weight:bold">Size/Age</td><td style="padding:8px">' + (company_size || '?') + ' people · ' + (years_in_business || '?') + ' · Revenue: ' + (annual_revenue || '?') + '</td></tr><tr><td style="padding:8px;font-weight:bold">MS Level</td><td style="padding:8px">' + (ms_partnership || 'None') + '</td></tr><tr style="background:#F8FAFC"><td style="padding:8px;font-weight:bold">Certs</td><td style="padding:8px">' + (certifications || 'None') + '</td></tr><tr><td style="padding:8px;font-weight:bold">Team</td><td style="padding:8px">' + (delivery_team_size || '?') + ' · ' + (existing_clients || '?') + ' clients</td></tr><tr style="background:#F8FAFC"><td style="padding:8px;font-weight:bold">Industries</td><td style="padding:8px">' + (industries_served || 'None specified') + '</td></tr><tr><td style="padding:8px;font-weight:bold">Services</td><td style="padding:8px">' + (current_services || '').substring(0, 300) + '</td></tr><tr style="background:#F0FDFA"><td style="padding:8px;font-weight:bold;color:#0E7490">Why BHT?</td><td style="padding:8px;color:#0E7490">' + (why_partner || '').substring(0, 500) + '</td></tr></table><p style="font-size:11px;color:#94A3B8;margin-top:12px">Application #' + appId + ' · <a href="https://thebhtlabs.com/admin">Dashboard</a></p></div>'
          })
        });
      } catch (e) { console.error('Partner BHT email error:', e); }

      // Confirmation to applicant
      try {
        const firstName = name.split(' ')[0];
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + resendKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || 'TheBHTLabs <onboarding@resend.dev>',
            to: [email],
            reply_to: process.env.CONTACT_EMAIL || 'info@bhtsolutions.com',
            subject: firstName + ', your partner application is received — BHT Labs',
            html: '<div style="font-family:sans-serif;max-width:600px;color:#1C1917"><div style="padding:24px 28px;background:#1C1917;border-radius:12px 12px 0 0"><div style="font-size:18px;font-weight:800;color:#fff">TheBHT<span style="color:#0E7490">Labs</span></div></div><div style="padding:28px;border:1px solid #E7E5E4;border-top:none;border-radius:0 0 12px 12px"><h2 style="font-size:20px;margin:0 0 8px">' + firstName + ', thanks for your interest in partnering.</h2><p style="color:#78716C;font-size:14px;line-height:1.7;margin:0 0 20px">We received your application for ' + company + '. Our team reviews partner applications within 5 business days. Qualified candidates will receive an invitation for a 45-minute introductory call.</p><div style="padding:16px;background:#FAFAF9;border-radius:10px;border:1px solid #E7E5E4;margin-bottom:16px"><div style="font-size:12px;font-weight:700;color:#0E7490;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">What We Look For</div><div style="font-size:13px;color:#44403C;line-height:1.8"><strong>1.</strong> Microsoft ecosystem expertise (M365, Azure, Power Platform)<br><strong>2.</strong> Experience in regulated industries<br><strong>3.</strong> Minimum 3-person delivery team<br><strong>4.</strong> Commitment to quality over volume<br><strong>5.</strong> Existing client base to deliver value immediately</div></div><div style="padding:14px;background:#F0FDFA;border-radius:10px;border:1px solid #CCFBF1;margin-bottom:16px"><div style="font-size:11px;font-weight:700;color:#0E7490;margin-bottom:4px">While you wait</div><p style="font-size:12px;color:#44403C;margin:0;line-height:1.6">Explore our assessment platform at <a href="https://thebhtlabs.com/#assessment" style="color:#0E7490;font-weight:700">thebhtlabs.com</a> — it is the core of the partner delivery model. Understanding the assessment experience will make our introductory conversation much more productive.</p></div><p style="font-size:13px;color:#78716C;line-height:1.7">Reply to this email if you have questions or additional context to share.</p><div style="margin-top:20px;padding-top:16px;border-top:1px solid #E7E5E4;font-size:12px;color:#A8A29E"><strong style="color:#1C1917">BHT Solutions</strong> &middot; SBA 8(a) &middot; EDWOSB &middot; Azure Solutions Architect &middot; CyberAB RP<br><a href="https://thebhtlabs.com" style="color:#0E7490">thebhtlabs.com</a> &middot; <a href="mailto:info@bhtsolutions.com" style="color:#0E7490">info@bhtsolutions.com</a></div></div></div>'
          })
        });
      } catch (e) { console.error('Partner user email error:', e); }
    }

    return NextResponse.json({ success: true, applicationId: appId, qualificationTier: qual.tier });
  } catch (e) {
    console.error('Partner error:', e.message);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function GET(request) {
  if (!verifyAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = getDb();
  let apps = [];
  try { apps = db.prepare('SELECT * FROM partner_applications ORDER BY created_at DESC').all(); } catch (e) {}
  let total = 0, byTier = [];
  try { total = db.prepare('SELECT COUNT(*) as c FROM partner_applications').get().c; } catch (e) {}
  try { byTier = db.prepare('SELECT qualification_tier, COUNT(*) as count FROM partner_applications GROUP BY qualification_tier ORDER BY count DESC').all(); } catch (e) {}
  return NextResponse.json({ analytics: { total, byTier }, applications: apps });
}

export async function PATCH(request) {
  if (!verifyAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, status, notes } = await request.json();
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  const db = getDb();
  try {
    if (status) db.prepare('UPDATE partner_applications SET status = ? WHERE id = ?').run(status, id);
    if (notes !== undefined) db.prepare('UPDATE partner_applications SET notes = ? WHERE id = ?').run(notes, id);
  } catch (e) {}
  return NextResponse.json({ success: true });
}
