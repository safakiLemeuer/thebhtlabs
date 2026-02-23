// app/api/contact/route.js
import { NextResponse } from 'next/server';
const { getDb } = require('../../../lib/db');

function sanitize(str) {
  if (!str) return '';
  return String(str).replace(/<[^>]*>/g, '').trim().substring(0, 2000);
}

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

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, interest, message, website } = body;
    if (website) return NextResponse.json({ success: true });
    if (!name || !email) return NextResponse.json({ error: 'Name and email required' }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Invalid email' }, { status: 400 });

    const clean = { name: sanitize(name), email: sanitize(email), phone: sanitize(phone), company: sanitize(company), interest: sanitize(interest), message: sanitize(message) };
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';

    const db = getDb();
    const stmt = db.prepare('INSERT INTO contacts (name, email, phone, company, interest, message, source, ip_address) VALUES (?,?,?,?,?,?,?,?)');
    const result = stmt.run(clean.name, clean.email, clean.phone || '', clean.company || '', clean.interest || '', clean.message || '', 'contact_form', ip);
    const contactId = result.lastInsertRowid;

    try {
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + resendKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || 'TheBHTLabs <onboarding@resend.dev>',
            to: [process.env.CONTACT_EMAIL || 'info@bhtsolutions.com'],
            reply_to: clean.email,
            subject: 'New Inquiry: ' + clean.name + ' - ' + (clean.interest || 'General') + (clean.company ? ' / ' + clean.company : ''),
            html: '<div style="font-family:sans-serif;max-width:600px"><h2 style="color:#0D9488">New Contact</h2><table style="width:100%;border-collapse:collapse"><tr><td style="padding:6px 8px;font-weight:bold">Name</td><td style="padding:6px 8px">' + clean.name + '</td></tr><tr><td style="padding:6px 8px;font-weight:bold">Email</td><td style="padding:6px 8px"><a href="mailto:' + clean.email + '">' + clean.email + '</a></td></tr><tr><td style="padding:6px 8px;font-weight:bold">Phone</td><td style="padding:6px 8px">' + (clean.phone || 'N/A') + '</td></tr><tr><td style="padding:6px 8px;font-weight:bold">Company</td><td style="padding:6px 8px">' + (clean.company || 'N/A') + '</td></tr><tr><td style="padding:6px 8px;font-weight:bold">Interest</td><td style="padding:6px 8px">' + (clean.interest || 'N/A') + '</td></tr></table><div style="margin-top:12px;padding:12px;background:#F8FAFC;border-radius:8px"><p style="font-size:13px;color:#0F172A;line-height:1.6;margin:0">' + (clean.message || 'No message') + '</p></div><p style="margin-top:12px;color:#94A3B8;font-size:11px">Contact #' + contactId + '</p></div>'
          })
        });
      }
    } catch (e) { console.error('Contact BHT email error:', e); }

    // Confirmation email to USER with value
    try {
      const resendKey2 = process.env.RESEND_API_KEY;
      if (resendKey2) {
        const firstName = clean.name.split(' ')[0];
        const interest = (clean.interest || '').toLowerCase();
        let toolName = 'AI Readiness Assessment';
        let toolUrl = 'https://thebhtlabs.com/#assessment';
        let toolDesc = 'See where your organization stands across 7 AI readiness domains in just 5 minutes.';
        let tip = 'Organizations that assess their readiness before deploying AI tools are 2x more likely to achieve enterprise impact.';
        if (interest.includes('copilot') || interest.includes('automation')) {
          toolName = 'AI ROI Calculator';
          toolUrl = 'https://thebhtlabs.com/#roi';
          toolDesc = 'Quantify the potential savings from automating your most time-consuming workflows.';
          tip = 'The average Copilot Studio deployment saves 12x on document lookup time when properly grounded in SharePoint.';
        } else if (interest.includes('cmmc') || interest.includes('compliance')) {
          toolName = 'AI Policy Generator';
          toolUrl = 'https://thebhtlabs.com/#policy';
          toolDesc = 'Generate a customized AI Acceptable Use Policy in 2 minutes - the first step most auditors look for.';
          tip = 'EY found only 1 in 3 companies have proper AI governance despite broad adoption. Getting ahead of this is a competitive advantage.';
        } else if (interest.includes('training') || interest.includes('upskill')) {
          tip = 'BCG research shows AI success is 70% people and culture, only 10% algorithms. Training is the highest-leverage investment.';
        } else if (interest.includes('partner') || interest.includes('subcontract')) {
          tip = 'As an SBA 8(a) and EDWOSB certified firm, we can help primes meet small business subcontracting requirements while delivering technical depth.';
        }
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + resendKey2, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || 'TheBHTLabs <onboarding@resend.dev>',
            to: [clean.email],
            reply_to: process.env.CONTACT_EMAIL || 'info@bhtsolutions.com',
            subject: firstName + ', we received your inquiry - here is something useful while you wait',
            html: '<div style="font-family:sans-serif;max-width:600px;color:#0F172A">' +
              '<div style="padding:24px 28px;background:#0F172A;border-radius:12px 12px 0 0">' +
              '<div style="font-size:18px;font-weight:800;color:#fff">TheBHT<span style="color:#0D9488">Labs</span></div>' +
              '</div>' +
              '<div style="padding:28px;border:1px solid #E2E8F0;border-top:none;border-radius:0 0 12px 12px">' +
              '<h2 style="font-size:20px;margin:0 0 8px">' + firstName + ', thanks for reaching out.</h2>' +
              '<p style="color:#64748B;font-size:14px;line-height:1.7;margin:0 0 16px">We have received your message and will respond within 1 business day. In the meantime, here is something that might be useful:</p>' +
              '<div style="padding:16px;background:#F0FDFA;border-radius:10px;border:1px solid #CCFBF1;margin-bottom:16px">' +
              '<div style="font-size:11px;font-weight:700;color:#0D9488;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Free Tool</div>' +
              '<a href="' + toolUrl + '" style="font-size:15px;font-weight:700;color:#0F766E;text-decoration:none;display:block;margin-bottom:4px">' + toolName + ' &rarr;</a>' +
              '<p style="font-size:12px;color:#64748B;margin:0;line-height:1.5">' + toolDesc + '</p>' +
              '</div>' +
              '<div style="padding:12px 16px;background:#F8FAFC;border-radius:8px;border:1px solid #E2E8F0;margin-bottom:16px">' +
              '<p style="font-size:12px;color:#475569;margin:0;line-height:1.6;font-style:italic">' + tip + '</p>' +
              '</div>' +
              '<p style="font-size:13px;color:#64748B;line-height:1.7">Reply directly to this email if you have anything else to share before we connect. The more context we have, the more productive our conversation will be.</p>' +
              '<div style="margin-top:20px;padding-top:16px;border-top:1px solid #E2E8F0;font-size:12px;color:#94A3B8">' +
              '<strong style="color:#0F172A">BHT Solutions</strong> &middot; SBA 8(a) &middot; EDWOSB &middot; Azure Solutions Architect &middot; CyberAB RP<br>' +
              '<a href="https://thebhtlabs.com" style="color:#0D9488">thebhtlabs.com</a> &middot; <a href="mailto:info@bhtsolutions.com" style="color:#0D9488">info@bhtsolutions.com</a> &middot; (513) 638-1986' +
              '</div></div></div>'
          })
        });
      }
    } catch (e) { console.error('Contact user email error:', e); }

    return NextResponse.json({ success: true, contactId });
  } catch (e) {
    console.error('Contact error:', e.message);
    return NextResponse.json({ error: 'Failed. Email info@bhtsolutions.com directly.' }, { status: 500 });
  }
}

export async function GET(request) {
  if (!verifyAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const url = new URL(request.url);
  const search = url.searchParams.get('search') || '';
  const statusF = url.searchParams.get('status') || '';
  const format = url.searchParams.get('format');
  const limit = parseInt(url.searchParams.get('limit') || '200');

  let query = 'SELECT * FROM contacts WHERE 1=1';
  const params = [];
  if (search) {
    const s = '%' + search + '%';
    query += ' AND (name LIKE ? OR email LIKE ? OR company LIKE ? OR message LIKE ?)';
    params.push(s, s, s, s);
  }
  if (statusF) { query += ' AND status = ?'; params.push(statusF); }
  query += ' ORDER BY created_at DESC LIMIT ?';
  params.push(limit);

  let rows = [];
  try { rows = db.prepare(query).all(...params); } catch (e) { console.error('Contacts query error:', e.message); }

  if (format === 'csv') {
    const h = ['id','name','email','phone','company','interest','message','status','notes','created_at'];
    const csv = [h.join(','), ...rows.map(r => h.map(k => { let v = String(r[k] || ''); return (v.includes(',') || v.includes('"') || v.includes('\n')) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(','))].join('\n');
    return new Response(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename=bht-contacts.csv' } });
  }

  let total = 0, byStatus = [], byInterest = [];
  try { total = db.prepare('SELECT COUNT(*) as c FROM contacts').get().c; } catch (e) {}
  try { byStatus = db.prepare('SELECT status, COUNT(*) as count FROM contacts GROUP BY status').all(); } catch (e) {}
  try { byInterest = db.prepare("SELECT interest, COUNT(*) as count FROM contacts WHERE length(interest) > 3 GROUP BY interest ORDER BY count DESC").all(); } catch (e) {}

  return NextResponse.json({ analytics: { total, byStatus, byInterest }, contacts: rows });
}

export async function PATCH(request) {
  if (!verifyAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, status, notes } = await request.json();
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const db = getDb();
  try {
    if (status) db.prepare('UPDATE contacts SET status = ? WHERE id = ?').run(status, id);
    if (notes !== undefined) db.prepare('UPDATE contacts SET notes = ? WHERE id = ?').run(notes, id);
  } catch (e) { console.error('Contact update error:', e.message); }

  return NextResponse.json({ success: true });
}
