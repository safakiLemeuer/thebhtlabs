// app/api/assessment/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { email, score, level, domains } = await request.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE !== 'false',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    // Send to BHT (lead alert)
    await transporter.sendMail({
      from: `"TheBHTLabs" <${process.env.SMTP_USER || 'info@bhtsolutions.com'}>`,
      to: process.env.CONTACT_EMAIL || 'info@bhtsolutions.com',
      subject: `AI Assessment Lead: ${level} (${score}%) - ${email}`,
      html: `<h2>New AI Assessment Completed</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Score:</strong> ${score}%</p>
        <p><strong>Level:</strong> ${level}</p>
        <h3>Domain Scores:</h3>
        ${(domains || []).map(d => `<p>${d.name}: ${d.score}%</p>`).join('')}
        <hr><p style="color:#999">Lead from TheBHTLabs Assessment</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Assessment error:', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
