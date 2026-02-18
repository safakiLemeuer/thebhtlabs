// app/api/contact/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { name, email, company, interest, message } = await request.json();
    if (!name || !email) return NextResponse.json({ error: 'Name and email required' }, { status: 400 });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE !== 'false',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"TheBHTLabs" <${process.env.SMTP_USER || 'info@bhtsolutions.com'}>`,
      to: process.env.CONTACT_EMAIL || 'info@bhtsolutions.com',
      subject: `TheBHTLabs Inquiry: ${name} - ${interest || 'General'}`,
      html: `<h2>New Inquiry from TheBHTLabs</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'Not provided'}</p>
        <p><strong>Interest:</strong> ${interest || 'Not specified'}</p>
        <p><strong>Message:</strong> ${message || 'No message'}</p>
        <hr><p style="color:#999">Sent from TheBHTLabs platform</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Contact form error:', e);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
