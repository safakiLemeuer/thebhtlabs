// app/api/contact/route.js — Save to DB + Resend email
import { NextResponse } from 'next/server';
const { getDb } = require('../../../lib/db');

function sanitize(str) {
  if (!str) return '';
  return String(str).replace(/<[^>]*>/g, '').trim().substring(0, 2000);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, interest, message, website } = body;

    // Honeypot
    if (website) return NextResponse.json({ success: true });
    if (!name || !email) return NextResponse.json({ error: 'Name and email required' }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Invalid email' }, { status: 400 });

    const clean = { name: sanitize(name), email: sanitize(email), phone: sanitize(phone), company: sanitize(company), interest: sanitize(interest), message: sanitize(message) };
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';

    // Save to database
    const db = getDb();
    const stmt = db.prepare(`INSERT INTO contacts (name, email, phone, company, interest, message, source, ip_address) VALUES (?,?,?,?,?,?,?,?)`);
    const result = stmt.run(clean.name, clean.email, clean.phone || '', clean.company || '', clean.interest || '', clean.message || '', 'contact_form', ip);
    const contactId = result.lastInsertRowid;

    // Send via Resend
    try {
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || 'TheBHTLabs <onboarding@resend.dev>',
            to: [process.env.CONTACT_EMAIL || 'info@bhtsolutions.com'],
            reply_to: clean.email,
            subject: `New Inquiry: ${clean.name} — ${clean.interest || 'General'}${clean.company ? ' · ' + clean.company : ''}`,
            html: `<div style="font-family:sans-serif;max-width:600px">
              <h2 style="color:#0D9488">New Contact Inquiry</h2>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:6px 8px;font-weight:bold;width:100px">Name</td><td style="padding:6px 8px">${clean.name}</td></tr>
                <tr><td style="padding:6px 8px;font-weight:bold">Email</td><td style="padding:6px 8px"><a href="mailto:${clean.email}">${clean.email}</a></td></tr>
                <tr><td style="padding:6px 8px;font-weight:bold">Phone</td><td style="padding:6px 8px">${clean.phone ? '<a href="tel:' + clean.phone + '">' + clean.phone + '</a>' : 'N/A'}</td></tr>
                <tr><td style="padding:6px 8px;font-weight:bold">Company</td><td style="padding:6px 8px">${clean.company || 'N/A'}</td></tr>
                <tr><td style="padding:6px 8px;font-weight:bold">Interest</td><td style="padding:6px 8px">${clean.interest || 'N/A'}</td></tr>
              </table>
              <div style="margin-top:12px;padding:12px;background:#F8FAFC;border-radius:8px;border:1px solid #E2E8F0">
                <p style="font-size:13px;color:#0F172A;line-height:1.6;margin:0">${clean.message || 'No message'}</p>
              </div>
              <p style="margin-top:12px;color:#94A3B8;font-size:11px">Contact #${contactId} · <a href="https://thebhtlabs.com/admin">View in Dashboard</a></p>
            </div>`
          })
        });
      }
    } catch (e) { console.error('Contact email error:', e); }

    return NextResponse.json({ success: true, contactId });
  } catch (e) {
    console.error('Contact error:', e.message);
    return NextResponse.json({ error: 'Failed. Email info@bhtsolutions.com directly.' }, { status: 500 });
  }
}

// GET — Admin: list contacts with search/filter
export async function GET(request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  const adminPass = process.env.ADMIN_PASSWORD;

  let authed = false;
  if (token === adminPass) { authed = true; }
  else {
    const [t, sig] = token.split('.');
    if (t && sig && adminPass) {
      const crypto = require('crypto');
      const expected = crypto.createHmac('sha256', adminPass).update(t).digest('hex');
      if (sig === expected) authed = true;
    }
  }
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const url = new URL(request.url);
  const search = url.searchParams.get('search') || '';
  const status = url.searchParams.get('status') || '';
  const format = url.searchParams.get('format');
  const limit = parseInt(url.searchParams.get('limit') || '200');

  let query = 'SELECT * FROM contacts WHERE 1=1';
  const params = [];
  if (search) { query += ' AND (name LIKE ? OR email LIKE ? OR company LIKE ? OR message LIKE ?)'; const s = `%${search}%`; params.push(s, s, s, s); }
  if (status) { query += ' AND status = ?'; params.push(status); }
  query += ' ORDER BY created_at DESC LIMIT ?'; params.push(limit);
  const rows = db.prepare(query).all(...params);

  if (format === 'csv') {
    const h = ['id','name','email','phone','company','interest','message','status','notes','created_at'];
    const csv = [h.join(','), ...rows.map(r => h.map(k => { let v=String(r[k]||''); return v.includes(',')||v.includes('"')||v.includes('\n')?`"${v.replace(/"/g,'""')}"`:v; }).join(','))].join('\n');
    return new Response(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename=bht-contacts.csv' } });
  }

  const total = db.prepare('SELECT COUNT(*) as c FROM contacts').get().c;
  const byStatus = db.prepare('SELECT status, COUNT(*) as count FROM contacts GROUP BY status').all();
  const byInterest = db.prepare('SELECT interest, COUNT(*) as count FROM contacts WHERE interest != "" AND interest != "I\'m interested in..." GROUP BY interest ORDER BY count DESC').all();

  return NextResponse.json({ analytics: { total, byStatus, byInterest }, contacts: rows });
}

// PATCH — Update contact status/notes
export async function PATCH(request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  const adminPass = process.env.ADMIN_PASSWORD;

  let authed = false;
  if (token === adminPass) { authed = true; }
  else {
    const [t, sig] = token.split('.');
    if (t && sig && adminPass) {
      const crypto = require('crypto');
      const expected = crypto.createHmac('sha256', adminPass).update(t).digest('hex');
      if (sig === expected) authed = true;
    }
  }
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, status, notes } = await request.json();
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const db = getDb();
  if (status) db.prepare('UPDATE contacts SET status = ? WHERE id = ?').run(status, id);
  if (notes !== undefined) db.prepare('UPDATE contacts SET notes = ? WHERE id = ?').run(notes, id);

  return NextResponse.json({ success: true });
}
