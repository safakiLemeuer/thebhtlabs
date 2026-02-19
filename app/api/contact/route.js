// app/api/contact/route.js — Resend API (no SMTP headaches)
import { NextResponse } from 'next/server';

function sanitize(str) {
  if (!str) return '';
  return String(str).replace(/<[^>]*>/g, '').trim().substring(0, 1000);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, company, interest, message, website } = body;

    // Honeypot
    if (website) return NextResponse.json({ success: true });

    if (!name || !email) return NextResponse.json({ error: 'Name and email required' }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Invalid email' }, { status: 400 });

    const clean = { name: sanitize(name), email: sanitize(email), company: sanitize(company), interest: sanitize(interest), message: sanitize(message) };

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) { console.error('RESEND_API_KEY not set'); return NextResponse.json({ error: 'Mail not configured' }, { status: 500 }); }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'TheBHTLabs <onboarding@resend.dev>',
        to: [process.env.CONTACT_EMAIL || 'info@bhtsolutions.com'],
        reply_to: clean.email,
        subject: `TheBHTLabs Inquiry: ${clean.name} - ${clean.interest || 'General'}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#0D9488;padding:20px;border-radius:8px 8px 0 0"><h2 style="color:#fff;margin:0">New Inquiry from TheBHTLabs</h2></div>
          <div style="padding:24px;background:#f9fafb;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#6b7280;width:100px"><strong>Name:</strong></td><td>${clean.name}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280"><strong>Email:</strong></td><td><a href="mailto:${clean.email}">${clean.email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#6b7280"><strong>Company:</strong></td><td>${clean.company || 'Not provided'}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280"><strong>Interest:</strong></td><td>${clean.interest || 'Not specified'}</td></tr>
            </table>
            <div style="margin-top:16px;padding:16px;background:#fff;border:1px solid #e5e7eb;border-radius:6px">
              <p style="color:#6b7280;margin:0 0 8px"><strong>Message:</strong></p>
              <p style="margin:0;line-height:1.6">${clean.message || 'No message'}</p>
            </div>
            <p style="color:#9ca3af;font-size:12px;margin-top:20px">Sent from TheBHTLabs · ${new Date().toISOString()}</p>
          </div></div>`,
      }),
    });

    const result = await res.json();
    if (!res.ok) { console.error('Resend error:', JSON.stringify(result)); return NextResponse.json({ error: 'Send failed. Email info@bhtsolutions.com directly.' }, { status: 500 }); }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Contact error:', e.message);
    return NextResponse.json({ error: 'Send failed. Email info@bhtsolutions.com directly.' }, { status: 500 });
  }
}
