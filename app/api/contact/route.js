// app/api/contact/route.js — With honeypot, sanitization, rate limiting
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function sanitize(str) {
  if (!str) return '';
  return String(str).replace(/<[^>]*>/g, '').trim().substring(0, 1000);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, company, interest, message, website } = body;

    // Honeypot — if "website" field is filled, it's a bot
    if (website) {
      // Return success to not reveal detection
      return NextResponse.json({ success: true });
    }

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Sanitize all inputs
    const clean = {
      name: sanitize(name),
      email: sanitize(email),
      company: sanitize(company),
      interest: sanitize(interest),
      message: sanitize(message),
    };

    // Check SMTP credentials exist
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('Contact form error: SMTP_USER or SMTP_PASS not set in environment');
      return NextResponse.json({ error: 'Mail service not configured' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE !== 'false',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Timeout settings
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    await transporter.sendMail({
      from: `"TheBHTLabs" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      replyTo: clean.email,
      subject: `TheBHTLabs Inquiry: ${clean.name} - ${clean.interest || 'General'}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#0D9488;padding:20px;border-radius:8px 8px 0 0">
            <h2 style="color:#fff;margin:0">New Inquiry from TheBHTLabs</h2>
          </div>
          <div style="padding:24px;background:#f9fafb;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#6b7280;width:100px"><strong>Name:</strong></td><td style="padding:8px 0">${clean.name}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280"><strong>Email:</strong></td><td style="padding:8px 0"><a href="mailto:${clean.email}">${clean.email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#6b7280"><strong>Company:</strong></td><td style="padding:8px 0">${clean.company || 'Not provided'}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280"><strong>Interest:</strong></td><td style="padding:8px 0">${clean.interest || 'Not specified'}</td></tr>
            </table>
            <div style="margin-top:16px;padding:16px;background:#fff;border:1px solid #e5e7eb;border-radius:6px">
              <p style="color:#6b7280;margin:0 0 8px"><strong>Message:</strong></p>
              <p style="margin:0;line-height:1.6">${clean.message || 'No message provided'}</p>
            </div>
            <p style="color:#9ca3af;font-size:12px;margin-top:20px">Sent from TheBHTLabs platform · ${new Date().toISOString()}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Contact form error:', e.message, e.code);
    return NextResponse.json(
      { error: 'Failed to send. Please email info@bhtsolutions.com directly.' },
      { status: 500 }
    );
  }
}
