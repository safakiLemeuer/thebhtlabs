// app/api/discovery/route.js
import { NextResponse } from 'next/server';
const { getDb } = require('../../../lib/db');

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, phone, company, title, industry, employees, revenue,
            overallScore, stage, weakest1, weakest2, ariaScore, ariaTier, ariaMult,
            recPackage, recPrice } = data;
    if (!email || !name) return NextResponse.json({ error: 'Name and email required' }, { status: 400 });

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const firstName = name.split(' ')[0];

    // Save to contacts table as discovery request
    const db = getDb();
    const msg = 'Discovery call request from AI Assessment. Score: ' + overallScore + '% (' + stage + '). ARIA: ' + (ariaScore||'?') + '/30 (' + (ariaTier||'?') + '). Top gaps: ' + (weakest1||'N/A') + ', ' + (weakest2||'N/A') + '. Recommended: ' + (recPackage||'N/A') + ' at ' + (recPrice||'N/A') + '.';
    const stmt = db.prepare('INSERT INTO contacts (name, email, phone, company, interest, message, source, ip_address) VALUES (?,?,?,?,?,?,?,?)');
    const result = stmt.run(name, email, phone || '', company || '', 'Discovery Call - AI Assessment', msg, 'discovery_call', ip);
    const contactId = result.lastInsertRowid;

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return NextResponse.json({ success: true, contactId });

    // Quick-win tips based on weakest domain
    const w1 = (weakest1 || '').toLowerCase();
    let quickWin1 = 'Audit your SharePoint permissions - most organizations have 40%+ ungoverned files.';
    let quickWin2 = 'Run a sensitivity label check - are your classification policies actually applied?';
    let quickWin3 = 'Review your Conditional Access policies in Entra ID - one misconfiguration can expose your entire tenant.';
    let freeToolName = 'AI Readiness Assessment';
    let freeToolUrl = 'https://thebhtlabs.com/#assessment';
    if (w1.includes('governance')) {
      quickWin1 = 'Generate a free AI Acceptable Use Policy using our policy generator at thebhtlabs.com.';
      quickWin2 = 'Check if your Purview DLP policies cover AI tool usage - most organizations miss this.';
      quickWin3 = 'Inventory which AI tools employees are already using without IT approval.';
      freeToolName = 'AI Policy Generator';
      freeToolUrl = 'https://thebhtlabs.com/#policy';
    } else if (w1.includes('people') || w1.includes('culture')) {
      quickWin1 = 'Survey 5 team leads: "What takes you the most time each week?" - their answers reveal your best AI use cases.';
      quickWin2 = 'Identify 2-3 internal champions who are already experimenting with AI tools.';
      quickWin3 = 'Create a simple "AI wins" Slack/Teams channel to build momentum and reduce resistance.';
    } else if (w1.includes('process')) {
      quickWin1 = 'Map your top 3 most time-consuming workflows end-to-end. The bottlenecks are your AI opportunities.';
      quickWin2 = 'Calculate hours spent on your most manual process. Multiply by hourly cost. That is your automation ROI baseline.';
      quickWin3 = 'Try our free ROI Calculator at thebhtlabs.com to quantify potential savings.';
      freeToolName = 'AI ROI Calculator';
      freeToolUrl = 'https://thebhtlabs.com/#roi';
    } else if (w1.includes('tech')) {
      quickWin1 = 'Run Get-MsolAccountSku in PowerShell to find unused M365 licenses - most tenants have $20-50K in waste.';
      quickWin2 = 'Check your Azure AD sign-in logs for apps accessing data without Conditional Access policies.';
      quickWin3 = 'Verify your SharePoint search is returning accurate results - this is the foundation Copilot relies on.';
    } else if (w1.includes('strategy')) {
      quickWin1 = 'Pick ONE high-impact, low-risk process to pilot AI on. Breadth kills ROI; depth creates it.';
      quickWin2 = 'Define success metrics BEFORE deploying any AI tool. "Faster" is not a metric. "40% reduction in review time" is.';
      quickWin3 = 'Try our free ROI Calculator at thebhtlabs.com to build a business case your CFO will approve.';
      freeToolName = 'AI ROI Calculator';
      freeToolUrl = 'https://thebhtlabs.com/#roi';
    } else if (w1.includes('use case')) {
      quickWin1 = 'Interview 3 department heads: "If you could automate one thing tomorrow, what would it be?"';
      quickWin2 = 'Score each use case on: impact (1-5) x feasibility (1-5). Start with the highest product.';
      quickWin3 = 'Focus on use cases where you already have clean, structured data. AI amplifies data quality - good or bad.';
    }

    // 1. Email to BHT (lead alert)
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + resendKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'TheBHTLabs <onboarding@resend.dev>',
          to: [process.env.CONTACT_EMAIL || 'info@bhtsolutions.com'],
          reply_to: email,
          subject: 'Discovery Call Request: ' + name + ' at ' + company + ' - ' + stage + ' (' + overallScore + '%)',
          html: '<div style="font-family:sans-serif;max-width:600px"><h2 style="color:#7C3AED">Discovery Call Request</h2><table style="width:100%;border-collapse:collapse"><tr><td style="padding:6px 8px;font-weight:bold">Name</td><td>' + name + '</td></tr><tr><td style="padding:6px 8px;font-weight:bold">Email</td><td><a href="mailto:' + email + '">' + email + '</a></td></tr><tr><td style="padding:6px 8px;font-weight:bold">Phone</td><td>' + (phone || 'N/A') + '</td></tr><tr><td style="padding:6px 8px;font-weight:bold">Company</td><td>' + (company||'N/A') + ' / ' + (industry||'N/A') + '</td></tr><tr><td style="padding:6px 8px;font-weight:bold">Size</td><td>' + (employees||'?') + ' employees / ' + (revenue||'?') + '</td></tr><tr><td style="padding:6px 8px;font-weight:bold">Score</td><td><strong>' + overallScore + '% - ' + stage + '</strong></td></tr><tr><td style="padding:6px 8px;font-weight:bold">ARIA</td><td>' + (ariaScore||'?') + '/30 (' + (ariaTier||'?') + ', ' + (ariaMult||'?') + 'x)</td></tr><tr><td style="padding:6px 8px;font-weight:bold">Gaps</td><td>' + (weakest1||'N/A') + ', ' + (weakest2||'N/A') + '</td></tr><tr><td style="padding:6px 8px;font-weight:bold">Rec</td><td>' + (recPackage||'N/A') + ' at ' + (recPrice||'N/A') + '</td></tr></table><p style="margin-top:12px;color:#94A3B8;font-size:11px">Contact #' + contactId + ' / <a href="https://thebhtlabs.com/admin">Dashboard</a></p></div>'
        })
      });
    } catch (e) { console.error('Discovery BHT email error:', e); }

    // 2. Confirmation email to USER (with value)
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + resendKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'TheBHTLabs <onboarding@resend.dev>',
          to: [email],
          reply_to: process.env.CONTACT_EMAIL || 'info@bhtsolutions.com',
          subject: firstName + ', your discovery call is confirmed - ' + company + ' AI Readiness',
          html: '<div style="font-family:sans-serif;max-width:600px;color:#0F172A">' +
            '<div style="padding:24px 28px;background:#0F172A;border-radius:12px 12px 0 0">' +
            '<div style="font-size:18px;font-weight:800;color:#fff">TheBHT<span style="color:#0D9488">Labs</span></div>' +
            '</div>' +
            '<div style="padding:28px;border:1px solid #E2E8F0;border-top:none;border-radius:0 0 12px 12px">' +
            '<h2 style="font-size:20px;margin:0 0 8px;color:#0F172A">' + firstName + ', your discovery call request is confirmed.</h2>' +
            '<p style="color:#64748B;font-size:14px;line-height:1.7;margin:0 0 20px">We received your request and will reach out within 1 business day to schedule a 30-minute call. No pitch, no pressure - we will walk through your assessment results and share what we would prioritize.</p>' +
            '<div style="padding:16px;background:#F8FAFC;border-radius:10px;border:1px solid #E2E8F0;margin-bottom:20px">' +
            '<div style="font-size:12px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Your Results Snapshot</div>' +
            '<table style="width:100%;border-collapse:collapse;font-size:13px">' +
            '<tr><td style="padding:4px 0;font-weight:600">AI Readiness Score</td><td style="text-align:right;font-weight:800;color:' + (overallScore >= 65 ? '#0D9488' : overallScore >= 40 ? '#F97316' : '#E11D48') + '">' + overallScore + '% - ' + stage + '</td></tr>' +
            '<tr><td style="padding:4px 0;font-weight:600">Priority Gap #1</td><td style="text-align:right;color:#E11D48">' + (weakest1||'N/A') + '</td></tr>' +
            '<tr><td style="padding:4px 0;font-weight:600">Priority Gap #2</td><td style="text-align:right;color:#F97316">' + (weakest2||'N/A') + '</td></tr>' +
            '<tr><td style="padding:4px 0;font-weight:600">Complexity Tier</td><td style="text-align:right;color:#7C3AED">' + (ariaTier||'Standard') + ' (ARIA: ' + (ariaScore||'?') + '/30)</td></tr>' +
            '</table></div>' +
            '<div style="padding:16px;background:#F0FDFA;border-radius:10px;border:1px solid #CCFBF1;margin-bottom:20px">' +
            '<div style="font-size:13px;font-weight:700;color:#0F766E;margin-bottom:8px">While you wait: 3 things you can do today</div>' +
            '<div style="font-size:13px;color:#0F172A;line-height:1.8">' +
            '<div style="margin-bottom:6px"><strong style="color:#0D9488">1.</strong> ' + quickWin1 + '</div>' +
            '<div style="margin-bottom:6px"><strong style="color:#0D9488">2.</strong> ' + quickWin2 + '</div>' +
            '<div><strong style="color:#0D9488">3.</strong> ' + quickWin3 + '</div>' +
            '</div></div>' +
            '<div style="padding:14px;background:#F8FAFC;border-radius:10px;border:1px solid #E2E8F0;margin-bottom:20px">' +
            '<div style="font-size:12px;font-weight:600;color:#64748B;margin-bottom:4px">Free tool you might find useful:</div>' +
            '<a href="' + freeToolUrl + '" style="font-size:14px;font-weight:700;color:#0D9488;text-decoration:none">' + freeToolName + ' &rarr;</a>' +
            '</div>' +
            '<p style="font-size:13px;color:#64748B;line-height:1.7">If you want to get started before our call, reply to this email with any questions or context about your environment. The more we know going in, the more valuable the conversation.</p>' +
            '<div style="margin-top:20px;padding-top:16px;border-top:1px solid #E2E8F0;font-size:12px;color:#94A3B8">' +
            '<strong style="color:#0F172A">BHT Solutions</strong> &middot; SBA 8(a) &middot; EDWOSB &middot; Azure Solutions Architect &middot; CyberAB RP<br>' +
            '<a href="https://thebhtlabs.com" style="color:#0D9488">thebhtlabs.com</a> &middot; <a href="mailto:info@bhtsolutions.com" style="color:#0D9488">info@bhtsolutions.com</a> &middot; (513) 638-1986' +
            '</div></div></div>'
        })
      });
    } catch (e) { console.error('Discovery user email error:', e); }

    return NextResponse.json({ success: true, contactId });
  } catch (e) {
    console.error('Discovery error:', e.message);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
