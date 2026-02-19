// app/api/assessment/route.js — Save assessment + send lead alert via Resend
import { NextResponse } from 'next/server';
const { getDb } = require('../../../lib/db');

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, title, company, industry, industryLabel, employees, revenue, pains, phone,
            overallScore, stage, domains, rawAnswers, ariaScore, ariaTier, ariaMult, ariaPricing,
            timeSpent, suspicious } = data;
    if (!email || !name || !company) return NextResponse.json({ error: 'Name, email, company required' }, { status: 400 });

    const db = getDb();
    const domainMap = {};
    (domains || []).forEach(d => {
      const key = d.name.toLowerCase();
      if (key.includes('data')) domainMap.foundation = d.score;
      else if (key.includes('process')) domainMap.process = d.score;
      else if (key.includes('tech')) domainMap.tech = d.score;
      else if (key.includes('people')) domainMap.people = d.score;
      else if (key.includes('strategy')) domainMap.strategy = d.score;
      else if (key.includes('governance')) domainMap.governance = d.score;
      else if (key.includes('use')) domainMap.usecase = d.score;
    });

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const ua = request.headers.get('user-agent') || '';

    const stmt = db.prepare(`INSERT INTO assessments 
      (name, email, title, company, industry, industry_label, employees, revenue, pains,
       overall_score, stage, domain_data, domain_foundation, domain_process, domain_tech,
       domain_people, domain_strategy, domain_governance, domain_usecase, raw_answers,
       aria_score, aria_tier, aria_mult, aria_pricing, phone, time_spent, suspicious, ip_address, user_agent)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);

    const result = stmt.run(
      name, email, title || '', company, industry || '', industryLabel || '', employees || '', revenue || '',
      JSON.stringify(pains || []), overallScore || 0, stage || '', JSON.stringify(domains || []),
      domainMap.foundation||0, domainMap.process||0, domainMap.tech||0,
      domainMap.people||0, domainMap.strategy||0, domainMap.governance||0, domainMap.usecase||0,
      JSON.stringify(rawAnswers || {}),
      ariaScore||0, ariaTier||'', ariaMult||1.0, JSON.stringify(ariaPricing||{}),
      phone||'', timeSpent||0, suspicious?1:0,
      ip, ua
    );
    const leadId = result.lastInsertRowid;

    // Send lead alert via Resend
    try {
      const painList = (pains || []).map(p => `&bull; ${p}`).join('<br>');
      const domainList = (domains || []).map(d => `<tr><td style="padding:4px 8px;border-bottom:1px solid #eee">${d.name}</td><td style="padding:4px 8px;border-bottom:1px solid #eee;font-weight:bold;color:${d.score>=65?'#0D9488':d.score>=40?'#F97316':'#E11D48'}">${d.score}%</td></tr>`).join('');
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.RESEND_API_KEY}` },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'TheBHTLabs <onboarding@resend.dev>',
          to: process.env.CONTACT_EMAIL || 'info@bhtsolutions.com',
          subject: `New Lead: ${name} at ${company} — ${stage} (${overallScore}%) · ARIA: ${ariaTier || 'N/A'}`,
          html: `<div style="font-family:sans-serif;max-width:600px"><h2 style="color:#0D9488">New Assessment Lead</h2>
            <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
              <tr><td style="padding:6px 8px;font-weight:bold;width:100px">Name</td><td style="padding:6px 8px">${name}</td></tr>
              <tr><td style="padding:6px 8px;font-weight:bold">Email</td><td style="padding:6px 8px"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding:6px 8px;font-weight:bold">Title</td><td style="padding:6px 8px">${title || 'N/A'}</td></tr>
              <tr><td style="padding:6px 8px;font-weight:bold">Company</td><td style="padding:6px 8px">${company}</td></tr>
              <tr><td style="padding:6px 8px;font-weight:bold">Industry</td><td style="padding:6px 8px">${industryLabel || industry}</td></tr>
              <tr><td style="padding:6px 8px;font-weight:bold">Size</td><td style="padding:6px 8px">${employees || '?'} employees · ${revenue || '?'} revenue</td></tr>
              <tr><td style="padding:6px 8px;font-weight:bold">Phone</td><td style="padding:6px 8px"><a href="tel:${phone}">${phone || 'N/A'}</a></td></tr>
              <tr><td style="padding:6px 8px;font-weight:bold;color:#7C3AED">ARIA Score</td><td style="padding:6px 8px;font-weight:bold">${ariaScore||'?'}/30 — ${ariaTier||'?'} (${ariaMult||1}x)</td></tr>
              ${suspicious ? '<tr><td style="padding:6px 8px;font-weight:bold;color:#E11D48">⚠️ FLAG</td><td style="padding:6px 8px;color:#E11D48">Completed in ' + timeSpent + 's — possibly rushed</td></tr>' : ''}
            </table>
            <h3 style="color:#0F172A">Score: ${overallScore}% — ${stage}</h3>
            <table style="width:100%;border-collapse:collapse;margin-bottom:16px">${domainList}</table>
            <h3 style="color:#0F172A">Pain Points</h3><p style="background:#FFF7ED;padding:12px;border-radius:8px;font-size:13px">${painList || 'None selected'}</p>
            <p style="margin-top:16px;color:#64748B;font-size:12px">Lead #${leadId} · <a href="https://thebhtlabs.com/admin">View Dashboard</a></p></div>`
        })
      });
    } catch (e) { console.error('Lead email error:', e); }

    return NextResponse.json({ success: true, leadId });
  } catch (e) {
    console.error('Assessment save error:', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function GET(request) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.ADMIN_PASSWORD}`) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = getDb();
  const url = new URL(request.url);
  const format = url.searchParams.get('format');
  const industry = url.searchParams.get('industry');
  const minScore = url.searchParams.get('minScore');
  const maxScore = url.searchParams.get('maxScore');
  const limit = parseInt(url.searchParams.get('limit') || '200');

  let query = 'SELECT * FROM assessments WHERE 1=1';
  const params = [];
  if (industry) { query += ' AND industry = ?'; params.push(industry); }
  if (minScore) { query += ' AND overall_score >= ?'; params.push(parseInt(minScore)); }
  if (maxScore) { query += ' AND overall_score <= ?'; params.push(parseInt(maxScore)); }
  query += ' ORDER BY created_at DESC LIMIT ?'; params.push(limit);
  const rows = db.prepare(query).all(...params);

  if (format === 'csv') {
    const h = ['id','name','email','phone','title','company','industry_label','employees','revenue','pains','overall_score','stage',
      'aria_score','aria_tier','aria_mult','time_spent','suspicious',
      'domain_foundation','domain_process','domain_tech','domain_people','domain_strategy','domain_governance','domain_usecase','created_at'];
    const csv = [h.join(','), ...rows.map(r => h.map(k => { let v=String(r[k]||''); return v.includes(',')?`"${v.replace(/"/g,'""')}"`:v; }).join(','))].join('\n');
    return new Response(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename=bht-leads.csv' } });
  }

  const total = db.prepare('SELECT COUNT(*) as c FROM assessments').get().c;
  const avgScore = Math.round(db.prepare('SELECT AVG(overall_score) as a FROM assessments').get().a || 0);
  const byIndustry = db.prepare('SELECT industry_label as label, COUNT(*) as count, ROUND(AVG(overall_score)) as avg FROM assessments WHERE industry_label != "" GROUP BY industry_label ORDER BY count DESC').all();
  const byStage = db.prepare('SELECT stage, COUNT(*) as count FROM assessments WHERE stage != "" GROUP BY stage').all();
  const byEmployees = db.prepare('SELECT employees, COUNT(*) as count FROM assessments WHERE employees != "" GROUP BY employees ORDER BY count DESC').all();
  const topPains = {};
  rows.forEach(r => { try { JSON.parse(r.pains||'[]').forEach(p => { topPains[p]=(topPains[p]||0)+1; }); } catch(e){} });
  const painRanking = Object.entries(topPains).sort((a,b)=>b[1]-a[1]).map(([pain,count])=>({pain,count}));
  const recent = rows.slice(0, 30);

  return NextResponse.json({ analytics: { total, avgScore, byIndustry, byStage, byEmployees, painRanking }, leads: recent });
}
