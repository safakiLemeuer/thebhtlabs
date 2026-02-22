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
function scorePartner(data) {
  let score = 0;
  const notes = [];
  // Microsoft partnership (0-20)
  if ((data.ms_partnership || '').includes('Solutions Partner')) { score += 20; notes.push('MS Solutions Partner'); }
  else if ((data.ms_partnership || '').includes('Action Pack')) { score += 8; notes.push('MS Action Pack'); }
  // Certifications (0-20)
  const certs = (data.certifications || '').split(', ').filter(c => c && c !== 'None yet');
  score += Math.min(20, certs.length * 4);
  if (certs.length >= 3) notes.push(certs.length + ' certifications');
  // Team size (0-15)
  const ts = data.delivery_team_size || '';
  if (ts.includes('25+')) { score += 15; notes.push('25+ delivery team'); }
  else if (ts.includes('11-25')) { score += 13; notes.push('11-25 team'); }
  else if (ts.includes('6-10')) { score += 10; notes.push('6-10 team'); }
  else if (ts.includes('3-5')) { score += 7; notes.push('3-5 team'); }
  else if (ts.includes('1-2')) { score += 3; }
  // Years in business (0-10)
  const yrs = data.years_in_business || '';
  if (yrs.includes('10+')) { score += 10; notes.push('10+ years'); }
  else if (yrs.includes('5-10')) { score += 8; }
  else if (yrs.includes('3-5')) { score += 5; }
  else if (yrs.includes('1-3')) { score += 2; }
  // Revenue (0-10)
  const rev = data.annual_revenue || '';
  if (rev.includes('$50M')) score += 10;
  else if (rev.includes('$10M')) score += 8;
  else if (rev.includes('$2M')) { score += 6; notes.push(rev + ' revenue'); }
  else if (rev.includes('$500K')) score += 3;
  // Industries (0-10)
  const inds = (data.industries_served || '').split(', ').filter(Boolean);
  const highValue = ['Financial Services','Healthcare','Government/Defense','Insurance','Legal'];
  const hvCount = inds.filter(i => highValue.includes(i)).length;
  score += Math.min(10, hvCount * 3 + Math.min(4, inds.length));
  if (hvCount >= 2) notes.push(hvCount + ' regulated industries');
  // Company size (0-5)
  const cs = data.company_size || '';
  if (cs.includes('200') || cs.includes('1000')) score += 5;
  else if (cs.includes('51-200')) score += 4;
  else if (cs.includes('21-50')) score += 3;
  else if (cs.includes('6-20')) score += 2;
  // Why partner quality (0-10) - length as proxy for thoughtfulness
  const why = (data.why_partner || '').trim();
  if (why.length > 300) { score += 10; notes.push('Detailed application'); }
  else if (why.length > 150) score += 6;
  else if (why.length > 50) score += 3;

  const tier = score >= 70 ? 'Priority' : score >= 45 ? 'Qualified' : score >= 25 ? 'Developing' : 'Early Stage';
  return { score: Math.min(100, score), tier, notes };
}

export async function POST(request) {
  try {
    const data = await request.json();
    if (data.honeypot) return NextResponse.json({ success: true });
    const { name, email, phone, company, website_url, country, city, company_size, years_in_business,
      ms_partnership, certifications, industries_served, current_services, annual_revenue,
      why_partner, existing_clients, delivery_team_size } = data;
    if (!name || !email || !company) return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Invalid email' }, { status: 400 });

    const qual = scorePartner(data);
    const ip = request.headers.get('x-forwarded-for') || '';

    const db = getDb();
    const stmt = db.prepare('INSERT INTO partner_applications (name, email, phone, company, website_url, country, city, company_size, years_in_business, ms_partnership, certifications, industries_served, current_services, annual_revenue, why_partner, existing_clients, delivery_team_size, qualification_score, qualification_tier, ip_address) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    const r = stmt.run(name, email, phone||'', company, website_url||'', country||'', city||'', company_size||'', years_in_business||'', ms_partnership||'', certifications||'', industries_served||'', current_services||'', annual_revenue||'', why_partner||'', existing_clients||'', delivery_team_size||'', qual.score, qual.tier, ip);
    const appId = r.lastInsertRowid;

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      // Alert to BHT with qualification scoring
      try {
        const tierColor = qual.tier === 'Priority' ? '#7C3AED' : qual.tier === 'Qualified' ? '#0E7490' : qual.tier === 'Developing' ? '#F97316' : '#94A3B8';
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + resendKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || 'TheBHTLabs <onboarding@resend.dev>',
            to: [process.env.CONTACT_EMAIL || 'info@bhtsolutions.com'],
            reply_to: email,
            subject: '[' + qual.tier + ' ' + qual.score + '/100] Partner Application: ' + company + ' — ' + (country || 'Unknown'),
            html: '<div style="font-family:sans-serif;max-width:600px"><div style="padding:12px 16px;background:' + tierColor + ';border-radius:8px 8px 0 0;color:#fff"><strong>' + qual.tier + ' Partner</strong> · Score: ' + qual.score + '/100' + (qual.notes.length ? ' · ' + qual.notes.join(', ') : '') + '</div><table style="width:100%;border-collapse:collapse;font-size:13px"><tr style="background:#F8FAFC"><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">' + name + '</td></tr><tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px"><a href="mailto:' + email + '">' + email + '</a></td></tr><tr style="background:#F8FAFC"><td style="padding:8px;font-weight:bold">Company</td><td style="padding:8px">' + company + (website_url ? ' · <a href="' + website_url + '">' + website_url + '</a>' : '') + '</td></tr><tr><td style="padding:8px;font-weight:bold">Location</td><td style="padding:8px">' + (city || '') + ', ' + (country || '') + '</td></tr><tr style="background:#F8FAFC"><td style="padding:8px;font-weight:bold">Size/Age</td><td style="padding:8px">' + (company_size || '?') + ' people · ' + (years_in_business || '?') + ' · Revenue: ' + (annual_revenue || '?') + '</td></tr><tr><td style="padding:8px;font-weight:bold">MS Level</td><td style="padding:8px">' + (ms_partnership || 'None') + '</td></tr><tr style="background:#F8FAFC"><td style="padding:8px;font-weight:bold">Certs</td><td style="padding:8px">' + (certifications || 'None') + '</td></tr><tr><td style="padding:8px;font-weight:bold">Team</td><td style="padding:8px">' + (delivery_team_size || '?') + ' · ' + (existing_clients || '?') + ' clients</td></tr><tr style="background:#F8FAFC"><td style="padding:8px;font-weight:bold">Industries</td><td style="padding:8px">' + (industries_served || 'None specified') + '</td></tr><tr><td style="padding:8px;font-weight:bold">Services</td><td style="padding:8px">' + (current_services || '').substring(0, 300) + '</td></tr><tr style="background:#F0FDFA"><td style="padding:8px;font-weight:bold;color:#0E7490">Why BHT?</td><td style="padding:8px;color:#0E7490">' + (why_partner || '').substring(0, 500) + '</td></tr></table><p style="font-size:11px;color:#94A3B8;margin-top:12px">Application #' + appId + ' · <a href="https://thebhtlabs.com/admin">Dashboard</a></p></div>'
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
