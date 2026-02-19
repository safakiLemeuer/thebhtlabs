'use client';
import { useState, useEffect, useCallback } from 'react';

const C = { teal:'#0D9488', navy:'#0F172A', bg:'#FFFFFF', bgSoft:'#F8FAFC', border:'#E2E8F0', text:'#0F172A', textMuted:'#64748B', red:'#EF4444', green:'#10B981' };

export default function AdminPortal() {
  const [token, setToken] = useState(null);
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [tab, setTab] = useState('leads');

  useEffect(() => {
    const t = typeof window !== 'undefined' && sessionStorage.getItem('bht_admin');
    if (t) setToken(t);
  }, []);

  const login = async () => {
    setErr('');
    const r = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pass }) });
    const d = await r.json();
    if (r.ok) { setToken(d.token); sessionStorage.setItem('bht_admin', d.token); }
    else setErr(d.error || 'Login failed');
  };

  const logout = () => { setToken(null); sessionStorage.removeItem('bht_admin'); };
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  if (!token) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bgSoft, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, padding: 40, width: 400, textAlign: 'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.navy, marginBottom: 8 }}>TheBHT<span style={{ color: C.teal }}>Labs</span> Admin</h1>
        <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 24 }}>Enter admin password</p>
        {err && <p style={{ color: C.red, fontSize: 13, marginBottom: 12 }}>{err}</p>}
        <input type="password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()}
          placeholder="Password" style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, marginBottom: 12, outline: 'none', boxSizing: 'border-box' }} />
        <button onClick={login} style={{ width: '100%', padding: 12, borderRadius: 10, border: 'none', background: C.teal, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Login</button>
      </div>
    </div>
  );

  const tabs = [
    { id: 'leads', label: 'Leads & Analytics', icon: '🎯' },
    { id: 'contacts', label: 'Contacts', icon: '📞' },
    { id: 'posts', label: 'Blog Posts', icon: '📝' },
    { id: 'cases', label: 'Case Studies', icon: '📋' },
    { id: 'comments', label: 'Comments', icon: '💬' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: C.bgSoft, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      {/* Top bar */}
      <div style={{ background: C.navy, color: '#fff', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontWeight: 800, fontSize: 16 }}>TheBHT<span style={{ color: C.teal }}>Labs</span> CMS</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  background: tab === t.id ? 'rgba(255,255,255,.15)' : 'transparent', color: tab === t.id ? '#fff' : 'rgba(255,255,255,.6)' }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/" target="_blank" style={{ color: C.teal, fontSize: 12, fontWeight: 600 }}>View Site ↗</a>
          <button onClick={logout} style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid rgba(255,255,255,.2)', background: 'none', color: '#fff', fontSize: 12, cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        {tab === 'leads' && <LeadsManager headers={headers} token={token} />}
        {tab === 'contacts' && <ContactsManager headers={headers} />}
        {tab === 'posts' && <BlogManager headers={headers} />}
        {tab === 'cases' && <CaseManager headers={headers} />}
        {tab === 'comments' && <CommentManager headers={headers} />}
      </div>
    </div>
  );
}

/* ═══════════════ LEADS & ANALYTICS DASHBOARD ═══════════════ */
function LeadsManager({ headers, token }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [filter, setFilter] = useState({ industry: '', minScore: '', maxScore: '', tier: '' });
  const [view, setView] = useState('dashboard'); // dashboard, leads, lead-detail

  const load = useCallback(async () => {
    setLoading(true);
    try {
      let url = '/api/assessment?limit=200';
      if (filter.industry) url += `&industry=${filter.industry}`;
      if (filter.minScore) url += `&minScore=${filter.minScore}`;
      if (filter.maxScore) url += `&maxScore=${filter.maxScore}`;
      const r = await fetch(url, { headers });
      if (r.ok) setData(await r.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [headers, filter]);

  useEffect(() => { load(); }, [load]);

  const exportCSV = async () => {
    try {
      const r = await fetch('/api/assessment?format=csv&limit=500', { headers });
      if (!r.ok) { alert('Export failed'); return; }
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'bht-leads.csv'; a.click();
      URL.revokeObjectURL(url);
    } catch (e) { alert('Export failed'); }
  };

  const tierColor = (t) => t === 'Enterprise' ? '#7C3AED' : t === 'Professional' ? '#3B82F6' : '#0D9488';
  const stageColor = (s) => s === 'AI-Leading' ? '#0D9488' : s === 'AI-Ready' ? '#3B82F6' : s === 'AI-Building' ? '#F97316' : '#E11D48';

  // AI Intelligence - generate approach recommendation
  const aiIntel = (lead) => {
    const pains = (() => { try { return JSON.parse(lead.pains || '[]'); } catch { return []; } })();
    const weakest = [
      { name: 'Data Foundation', score: lead.domain_foundation },
      { name: 'Process Maturity', score: lead.domain_process },
      { name: 'Technology', score: lead.domain_tech },
      { name: 'People & Culture', score: lead.domain_people },
      { name: 'Strategy & ROI', score: lead.domain_strategy },
      { name: 'Governance', score: lead.domain_governance },
      { name: 'Use Case Clarity', score: lead.domain_usecase },
    ].sort((a, b) => a.score - b.score);

    const tier = lead.aria_tier || 'Standard';
    const isReg = ['Financial Services', 'Healthcare', 'Government / Defense', 'Insurance / Benefits', 'Legal', 'Energy / Utilities'].includes(lead.industry_label);

    let approach = `**${lead.name}** (${lead.title || 'Executive'}) at **${lead.company}** · ${lead.industry_label} · ${lead.employees} employees`;
    approach += `\n\nScore: ${lead.overall_score}% (${lead.stage}) · ARIA: ${lead.aria_score || '?'}/30 (${tier})`;
    approach += `\n\n**Biggest gaps:** ${weakest[0].name} (${weakest[0].score}%), ${weakest[1].name} (${weakest[1].score}%)`;

    if (pains.length) approach += `\n**Self-reported pains:** ${pains.join(', ')}`;

    approach += '\n\n**Recommended approach:**\n';

    if (lead.overall_score < 40) {
      approach += `→ This is a foundational engagement. Lead with empathy — they know they're behind. Open with: "Your ${weakest[0].name} score tells us exactly where to focus first."`;
      approach += `\n→ Recommend: AI Quick Scan to show them real findings from their environment.`;
      if (isReg) approach += `\n→ Compliance angle: Their Governance score is ${lead.domain_governance}% — in ${lead.industry_label}, this is a risk vector. Reference EY stat (1 in 3 companies lack proper AI governance).`;
      if (pains.includes('Compliance or governance gaps')) approach += `\n→ They self-identified compliance as a pain. Lead with CMMC/governance conversation.`;
    } else if (lead.overall_score < 65) {
      approach += `→ Mid-range — they have some foundation but gaps are blocking deployment. Position Sprint as the path to a boardroom-ready plan.`;
      approach += `\n→ Lead with: "You're ahead of ${lead.overall_score > 52 ? 'most' : 'some'} ${lead.industry_label} organizations. The gaps in ${weakest[0].name} and ${weakest[1].name} are what's keeping you from production AI."`;
      if (pains.includes('AI tools deployed but not delivering ROI')) approach += `\n→ They have AI tools that aren't working. This is a remediation play — Copilot Studio diagnostic, SharePoint grounding fix.`;
    } else {
      approach += `→ High-readiness — they're ready to deploy. Position Launchpad as implementation. They don't need assessment, they need execution.`;
      approach += `\n→ Lead with: "You've done the hard work on foundations. Let's pick 1-2 high-impact use cases and build production agents."`;
    }

    if (tier === 'Enterprise') approach += `\n\n**Pricing note:** Enterprise tier (${lead.aria_score}/30). This is a $7,500+ Quick Scan or $22,500+ Sprint. Scope carefully — there's real margin here.`;
    else if (tier === 'Professional') approach += `\n\n**Pricing note:** Professional tier (${lead.aria_score}/30). Quick Scan at $4,500, Sprint at $13,500.`;

    return approach;
  };

  const card = { background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, };
  const stat = (label, value, color) => (
    <div style={{ ...card, textAlign: 'center', flex: 1, minWidth: 120 }}>
      <div style={{ fontSize: 28, fontWeight: 800, color: color || C.navy, fontFamily: "'IBM Plex Mono',monospace" }}>{value}</div>
      <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
    </div>
  );

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>Loading leads...</div>;
  if (!data) return <div style={{ padding: 40, textAlign: 'center', color: C.red }}>Failed to load data. Check API auth.</div>;

  const { analytics, leads } = data;

  // Lead detail view
  if (view === 'lead-detail' && selectedLead) {
    const l = selectedLead;
    const pains = (() => { try { return JSON.parse(l.pains || '[]'); } catch { return []; } })();
    const domains = [
      { name: 'Data Foundation', score: l.domain_foundation },
      { name: 'Process Maturity', score: l.domain_process },
      { name: 'Technology Readiness', score: l.domain_tech },
      { name: 'People & Culture', score: l.domain_people },
      { name: 'Strategy & ROI', score: l.domain_strategy },
      { name: 'Governance & Compliance', score: l.domain_governance },
      { name: 'Use Case Clarity', score: l.domain_usecase },
    ];

    return (
      <div>
        <button onClick={() => { setView('leads'); setSelectedLead(null); }}
          style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: C.textMuted, marginBottom: 16 }}>
          ← Back to Leads
        </button>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Left: Profile */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginBottom: 4 }}>{l.name}</h2>
                <p style={{ fontSize: 13, color: C.textMuted }}>{l.title || 'N/A'} · {l.company}</p>
                <p style={{ fontSize: 12, color: C.textMuted }}>{l.industry_label} · {l.employees} employees · {l.revenue}</p>
                <a href={`mailto:${l.email}`} style={{ fontSize: 13, color: C.teal, fontWeight: 600 }}>{l.email}</a>
                {l.phone && <div><a href={`tel:${l.phone}`} style={{ fontSize: 13, color: C.navy, fontWeight: 600 }}>📞 {l.phone}</a></div>}
              </div>
              <div style={{ textAlign: 'right' }}>
                {l.suspicious ? <div style={{ fontSize: 10, fontWeight: 700, color: '#E11D48', marginBottom: 4 }}>⚠️ RUSHED ({l.time_spent}s)</div> : null}
                <div style={{ fontSize: 32, fontWeight: 800, color: stageColor(l.stage), fontFamily: "'IBM Plex Mono',monospace" }}>{l.overall_score}%</div>
                <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: stageColor(l.stage) + '15', color: stageColor(l.stage) }}>{l.stage}</span>
              </div>
            </div>
            {/* ARIA */}
            {l.aria_score > 0 && (
              <div style={{ padding: 12, borderRadius: 10, background: tierColor(l.aria_tier) + '08', border: `1px solid ${tierColor(l.aria_tier)}20`, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: tierColor(l.aria_tier) }}>ARIA: {l.aria_score}/30 · {l.aria_tier}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.textMuted }}>{l.aria_mult}x multiplier</span>
                </div>
              </div>
            )}
            {/* Domains */}
            <h4 style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginTop: 8 }}>Domain Scores</h4>
            {domains.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.navy, flex: 1 }}>{d.name}</span>
                <div style={{ width: 120, height: 5, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${d.score}%`, height: '100%', borderRadius: 3, background: d.score >= 65 ? '#0D9488' : d.score >= 40 ? '#F97316' : '#E11D48' }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", width: 32, textAlign: 'right', color: d.score >= 65 ? '#0D9488' : d.score >= 40 ? '#F97316' : '#E11D48' }}>{d.score}%</span>
              </div>
            ))}
            {/* Pains */}
            {pains.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Pain Points</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {pains.map(p => <span key={p} style={{ padding: '4px 10px', borderRadius: 6, background: '#FFF7ED', border: '1px solid #FDBA7433', fontSize: 10, fontWeight: 600, color: '#9A3412' }}>{p}</span>)}
                </div>
              </div>
            )}
            <p style={{ fontSize: 10, color: C.textMuted, marginTop: 12 }}>Submitted: {new Date(l.created_at).toLocaleString()}</p>
          </div>
          {/* Right: AI Intelligence */}
          <div style={{ ...card, background: '#FAFBFF', borderColor: '#7C3AED20' }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#7C3AED', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>🧠 AI Sales Intelligence</h3>
            <pre style={{ fontSize: 12, color: C.navy, lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: "'Plus Jakarta Sans',sans-serif", margin: 0 }}>{aiIntel(l)}</pre>
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <a href={`mailto:${l.email}?subject=Your AI Readiness Results — ${l.company}&body=Hi ${l.name.split(' ')[0]},%0A%0AThank you for completing the AI Readiness Assessment. I reviewed your results and wanted to share a few observations...`}
                style={{ padding: '8px 16px', borderRadius: 8, background: C.teal, color: '#fff', fontSize: 12, fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }}>
                📧 Email {l.name.split(' ')[0]}
              </a>
              <button onClick={() => navigator.clipboard.writeText(aiIntel(l))}
                style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: C.textMuted }}>
                📋 Copy Intel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard + Leads list view
  return (
    <div>
      {/* View toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {['dashboard', 'leads'].map(v => (
            <button key={v} onClick={() => setView(v)}
              style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${view === v ? C.teal : C.border}`, background: view === v ? C.teal + '0D' : C.bg, cursor: 'pointer', fontSize: 12, fontWeight: 700, color: view === v ? C.teal : C.textMuted }}>
              {v === 'dashboard' ? '📊 Analytics' : '👤 All Leads'}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={load} style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: C.textMuted }}>🔄 Refresh</button>
          <button onClick={exportCSV} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: C.teal, cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#fff' }}>📥 Export CSV</button>
        </div>
      </div>

      {view === 'dashboard' && (
        <>
          {/* KPI cards */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            {stat('Total Leads', analytics.total, C.teal)}
            {stat('Avg Score', analytics.avgScore + '%', analytics.avgScore >= 65 ? '#0D9488' : analytics.avgScore >= 40 ? '#F97316' : '#E11D48')}
            {stat('This Week', leads.filter(l => new Date(l.created_at) > new Date(Date.now() - 7 * 86400000)).length, C.navy)}
            {stat('Enterprise', leads.filter(l => l.aria_tier === 'Enterprise').length, '#7C3AED')}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            {/* By Stage */}
            <div style={card}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 12 }}>By Readiness Stage</h4>
              {(analytics.byStage || []).map(s => (
                <div key={s.stage} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, background: stageColor(s.stage) + '15', color: stageColor(s.stage), minWidth: 80, textAlign: 'center' }}>{s.stage}</span>
                  <div style={{ flex: 1, height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${analytics.total ? (s.count / analytics.total * 100) : 0}%`, height: '100%', background: stageColor(s.stage), borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: C.navy, fontFamily: "'IBM Plex Mono',monospace", minWidth: 24 }}>{s.count}</span>
                </div>
              ))}
            </div>
            {/* By Industry */}
            <div style={card}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 12 }}>By Industry</h4>
              {(analytics.byIndustry || []).slice(0, 8).map(i => (
                <div key={i.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: `1px solid ${C.border}22` }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{i.label}</span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: C.textMuted }}>{i.avg}% avg</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: C.teal, fontFamily: "'IBM Plex Mono',monospace" }}>{i.count}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Top Pain Points */}
            <div style={card}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 12 }}>Top Pain Points</h4>
              {(analytics.painRanking || []).slice(0, 8).map((p, i) => (
                <div key={p.pain} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: `1px solid ${C.border}22` }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>{i + 1}. {p.pain}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#F97316', fontFamily: "'IBM Plex Mono',monospace" }}>{p.count}</span>
                </div>
              ))}
            </div>
            {/* By Company Size */}
            <div style={card}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 12 }}>By Company Size</h4>
              {(analytics.byEmployees || []).map(e => (
                <div key={e.employees} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: `1px solid ${C.border}22` }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{e.employees} employees</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: C.teal, fontFamily: "'IBM Plex Mono',monospace" }}>{e.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent leads quick view */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Recent Leads</h4>
              <button onClick={() => setView('leads')} style={{ fontSize: 11, color: C.teal, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>View All →</button>
            </div>
            {leads.slice(0, 5).map(l => (
              <div key={l.id} onClick={() => { setSelectedLead(l); setView('lead-detail'); }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${C.border}22`, cursor: 'pointer' }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{l.name}</span>
                  <span style={{ fontSize: 12, color: C.textMuted, marginLeft: 8 }}>{l.company} · {l.industry_label}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {l.aria_tier && <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700, background: tierColor(l.aria_tier) + '15', color: tierColor(l.aria_tier) }}>{l.aria_tier}</span>}
                  <span style={{ fontSize: 14, fontWeight: 800, color: stageColor(l.stage), fontFamily: "'IBM Plex Mono',monospace" }}>{l.overall_score}%</span>
                  <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700, background: stageColor(l.stage) + '15', color: stageColor(l.stage) }}>{l.stage}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {view === 'leads' && (
        <>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <select value={filter.industry} onChange={e => setFilter(f => ({ ...f, industry: e.target.value }))}
              style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, background: C.bg }}>
              <option value="">All Industries</option>
              {(analytics.byIndustry || []).map(i => <option key={i.label} value={i.label}>{i.label} ({i.count})</option>)}
            </select>
            <select value={filter.minScore} onChange={e => setFilter(f => ({ ...f, minScore: e.target.value }))}
              style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, background: C.bg }}>
              <option value="">Min Score</option>
              {[0, 20, 40, 60, 80].map(s => <option key={s} value={s}>{s}%+</option>)}
            </select>
            <button onClick={load} style={{ padding: '6px 14px', borderRadius: 8, background: C.teal, border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Apply</button>
            {(filter.industry || filter.minScore) && <button onClick={() => { setFilter({ industry: '', minScore: '', maxScore: '', tier: '' }); }} style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, fontSize: 12, cursor: 'pointer', color: C.textMuted }}>Clear</button>}
          </div>
          {/* Leads table */}
          <div style={card}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                    {['Name', 'Company', 'Industry', 'Size', 'Score', 'Stage', 'ARIA', 'Date', ''].map(h => (
                      <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700, color: C.textMuted, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map(l => (
                    <tr key={l.id} onClick={() => { setSelectedLead(l); setView('lead-detail'); }}
                      style={{ borderBottom: `1px solid ${C.border}22`, cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '10px' }}>
                        <div style={{ fontWeight: 700, color: C.navy }}>{l.name}</div>
                        <div style={{ fontSize: 10, color: C.textMuted }}>{l.email}</div>
                      </td>
                      <td style={{ padding: '10px', fontWeight: 600, color: C.navy }}>{l.company}</td>
                      <td style={{ padding: '10px', color: C.textMuted }}>{l.industry_label}</td>
                      <td style={{ padding: '10px', color: C.textMuted }}>{l.employees}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{ fontWeight: 800, color: stageColor(l.stage), fontFamily: "'IBM Plex Mono',monospace" }}>{l.overall_score}%</span>
                      </td>
                      <td style={{ padding: '10px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700, background: stageColor(l.stage) + '15', color: stageColor(l.stage) }}>{l.stage}</span>
                      </td>
                      <td style={{ padding: '10px' }}>
                        {l.aria_tier && <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700, background: tierColor(l.aria_tier) + '15', color: tierColor(l.aria_tier) }}>{l.aria_score} · {l.aria_tier}</span>}
                      </td>
                      <td style={{ padding: '10px', color: C.textMuted, fontSize: 10 }}>{new Date(l.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{ color: C.teal, fontWeight: 700, fontSize: 11 }}>View →</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {leads.length === 0 && <p style={{ textAlign: 'center', color: C.textMuted, padding: 40 }}>No leads yet. Assessment submissions will appear here.</p>}
          </div>
        </>
      )}
    </div>
  );
}

/* ═══════════════ CONTACTS MANAGER ═══════════════ */
function ContactsManager({ headers }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      let url = '/api/contact?limit=200';
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (statusFilter) url += `&status=${statusFilter}`;
      const r = await fetch(url, { headers });
      if (r.ok) setData(await r.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [headers, search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    await fetch('/api/contact', { method: 'PATCH', headers, body: JSON.stringify({ id, status }) });
    setData(d => ({ ...d, contacts: d.contacts.map(c => c.id === id ? { ...c, status } : c) }));
  };

  const saveNote = async (id) => {
    await fetch('/api/contact', { method: 'PATCH', headers, body: JSON.stringify({ id, notes: noteText }) });
    setData(d => ({ ...d, contacts: d.contacts.map(c => c.id === id ? { ...c, notes: noteText } : c) }));
    setEditingNote(null);
  };

  const exportCSV = async () => {
    try {
      const r = await fetch('/api/contact?format=csv&limit=500', { headers });
      if (!r.ok) return;
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'bht-contacts.csv'; a.click();
      URL.revokeObjectURL(url);
    } catch (e) { console.error(e); }
  };

  const statusColors = { new: '#3B82F6', contacted: '#F97316', qualified: '#0D9488', closed: '#7C3AED', spam: '#94A3B8' };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>Loading contacts...</div>;
  if (!data) return <div style={{ padding: 40, textAlign: 'center', color: C.red }}>Failed to load.</div>;

  const { analytics, contacts } = data;
  let sorted = [...contacts];
  if (sortBy === 'name') sorted.sort((a, b) => sortDir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
  else if (sortBy === 'status') sorted.sort((a, b) => sortDir === 'asc' ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status));

  return (
    <div>
      {/* KPIs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        {[{ l: 'Total', v: analytics.total, c: C.navy }, ...(analytics.byStatus || []).map(s => ({ l: s.status, v: s.count, c: statusColors[s.status] || C.textMuted }))].map(s => (
          <div key={s.l} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 20px', textAlign: 'center', minWidth: 90 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.c, fontFamily: "'IBM Plex Mono',monospace" }}>{s.v}</div>
            <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>
      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()}
          placeholder="Search name, email, company, message..." style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, flex: 1, minWidth: 200 }} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12 }}>
          <option value="">All Status</option>
          {['new', 'contacted', 'qualified', 'closed', 'spam'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={load} style={{ padding: '6px 14px', borderRadius: 8, background: C.teal, border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Search</button>
        <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
          {['date', 'name', 'status'].map(s => (
            <button key={s} onClick={() => { if (sortBy === s) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortBy(s); setSortDir('desc'); } }}
              style={{ padding: '4px 10px', borderRadius: 6, border: `1px solid ${sortBy === s ? C.teal : C.border}`, background: sortBy === s ? C.teal + '0D' : C.bg, fontSize: 10, fontWeight: 700, cursor: 'pointer', color: sortBy === s ? C.teal : C.textMuted }}>
              {s} {sortBy === s ? (sortDir === 'asc' ? '↑' : '↓') : ''}
            </button>
          ))}
        </div>
        <button onClick={exportCSV} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: C.teal, cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#fff' }}>📥 CSV</button>
      </div>
      {/* Cards */}
      <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
        {sorted.length === 0 && <p style={{ textAlign: 'center', color: C.textMuted, padding: 40 }}>No contacts yet. Form submissions will appear here.</p>}
        {sorted.map(c => (
          <div key={c.id} style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}22` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{c.name}</span>
                  <a href={`mailto:${c.email}`} style={{ fontSize: 12, color: C.teal, fontWeight: 600 }}>{c.email}</a>
                  {c.phone && <a href={`tel:${c.phone}`} style={{ fontSize: 12, color: C.navy, fontWeight: 600 }}>📞 {c.phone}</a>}
                  {c.company && <span style={{ fontSize: 11, color: C.textMuted }}>· {c.company}</span>}
                  {c.source === 'discovery_call' && <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700, background: '#7C3AED15', color: '#7C3AED' }}>Discovery Call</span>}
                  {c.source === 'contact_form' && <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700, background: '#3B82F615', color: '#3B82F6' }}>Contact Form</span>}
                </div>
                {c.interest && c.interest !== "I'm interested in..." && <span style={{ fontSize: 11, color: C.textMuted, display: 'block', marginTop: 2 }}>Interest: {c.interest}</span>}
                {c.message && <p style={{ fontSize: 12, color: C.navy, lineHeight: 1.6, marginTop: 6, padding: 10, background: '#F8FAFC', borderRadius: 8, border: `1px solid ${C.border}22` }}>{c.message}</p>}
                {editingNote === c.id ? (
                  <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                    <input value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Internal note..."
                      style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 11 }} />
                    <button onClick={() => saveNote(c.id)} style={{ padding: '6px 12px', borderRadius: 6, background: C.teal, border: 'none', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Save</button>
                    <button onClick={() => setEditingNote(null)} style={{ padding: '6px 12px', borderRadius: 6, border: `1px solid ${C.border}`, background: C.bg, fontSize: 11, cursor: 'pointer' }}>Cancel</button>
                  </div>
                ) : (
                  <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {c.notes && <span style={{ fontSize: 11, color: '#7C3AED', fontStyle: 'italic' }}>📝 {c.notes}</span>}
                    <button onClick={() => { setEditingNote(c.id); setNoteText(c.notes || ''); }}
                      style={{ fontSize: 10, color: C.textMuted, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                      {c.notes ? 'edit' : '+ note'}
                    </button>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                <select value={c.status} onChange={e => updateStatus(c.id, e.target.value)}
                  style={{ padding: '3px 8px', borderRadius: 6, border: `1px solid ${statusColors[c.status] || C.border}30`, background: (statusColors[c.status] || C.textMuted) + '10', color: statusColors[c.status] || C.textMuted, fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>
                  {['new', 'contacted', 'qualified', 'closed', 'spam'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <span style={{ fontSize: 10, color: C.textMuted }}>{new Date(c.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════ BLOG MANAGER ═══════════════ */
function BlogManager({ headers }) {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null); // null = list, 'new' or post object
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch('/api/blog?admin=1', { headers });
    const d = await r.json();
    setPosts(d.posts || []);
    setLoading(false);
  }, [headers]);

  useEffect(() => { load(); }, [load]);

  if (editing) return <BlogEditor post={editing === 'new' ? null : editing} headers={headers} onSave={() => { setEditing(null); load(); }} onCancel={() => setEditing(null)} />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.navy }}>Blog Posts ({posts.length})</h2>
        <button onClick={() => setEditing('new')} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: C.teal, color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>+ New Post</button>
      </div>
      {loading ? <p style={{ color: C.textMuted }}>Loading...</p> :
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {posts.map(p => (
            <div key={p.id} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.status === 'published' ? C.green : '#F59E0B' }} />
                  <span style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>{p.status}</span>
                  {p.featured ? <span style={{ fontSize: 10, background: '#FEF3C7', color: '#92400E', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>FEATURED</span> : null}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{p.title}</h3>
                <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                  {p.tags.map(t => <span key={t} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: C.teal + '15', color: C.teal, fontWeight: 600 }}>{t}</span>)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button onClick={() => setEditing(p)} style={{ padding: '6px 14px', borderRadius: 6, border: `1px solid ${C.border}`, background: C.bg, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Edit</button>
                <button onClick={async () => { if (confirm('Delete this post?')) { await fetch(`/api/blog/${p.id}`, { method: 'DELETE', headers }); load(); } }}
                  style={{ padding: '6px 14px', borderRadius: 6, border: `1px solid ${C.red}33`, background: C.red + '08', color: C.red, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}

/* ═══════════════ BLOG EDITOR — Markdown + Live Preview ═══════════════ */
function BlogEditor({ post, headers, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: post?.title || '', body: post?.body || '', excerpt: post?.excerpt || '',
    tags: post?.tags?.join(', ') || '', status: post?.status || 'draft',
    featured: post?.featured || false, read_time: post?.read_time || '2 min'
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      featured: form.featured,
    };
    const url = post ? `/api/blog/${post.id}` : '/api/blog';
    const method = post ? 'PUT' : 'POST';
    await fetch(url, { method, headers, body: JSON.stringify(payload) });
    setSaving(false);
    onSave();
  };

  // Simple markdown to HTML preview
  const renderMd = (md) => {
    if (!md) return '';
    return md
      .replace(/^### (.*$)/gm, '<h3 style="font-size:16px;font-weight:700;margin:16px 0 8px">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 style="font-size:18px;font-weight:700;margin:16px 0 8px">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 style="font-size:22px;font-weight:800;margin:16px 0 8px">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code style="background:#F1F5F9;padding:2px 6px;border-radius:4px;font-size:13px">$1</code>')
      .replace(/\n\n/g, '</p><p style="margin:0 0 12px;line-height:1.7">')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.navy }}>{post ? 'Edit Post' : 'New Post'}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onCancel} style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Cancel</button>
          <button onClick={save} disabled={saving || !form.title || !form.body}
            style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: C.teal, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Meta fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, marginBottom: 16 }}>
        <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Post title *"
          style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, outline: 'none', gridColumn: '1/3' }} />
        <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="Tags (comma-separated)"
          style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, outline: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
            style={{ padding: '10px 12px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, outline: 'none' }}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <input value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Excerpt (auto-generated if empty)"
          style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, outline: 'none' }} />
        <input value={form.read_time} onChange={e => setForm({ ...form, read_time: e.target.value })} placeholder="Read time"
          style={{ width: 100, padding: '10px 14px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, outline: 'none' }} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: C.textMuted, cursor: 'pointer' }}>
          <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
          Featured
        </label>
      </div>

      {/* Markdown editor + preview side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, height: 'calc(100vh - 300px)', minHeight: 400 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Markdown Editor</div>
          <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })}
            placeholder="Write your post in Markdown..."
            style={{ flex: 1, padding: 16, borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "'IBM Plex Mono',monospace", lineHeight: 1.7, resize: 'none', outline: 'none', background: '#FAFBFC' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Live Preview</div>
          <div style={{ flex: 1, padding: 16, borderRadius: 10, border: `1px solid ${C.border}`, overflowY: 'auto', background: C.bg, fontSize: 14, lineHeight: 1.7, color: C.text }}
            dangerouslySetInnerHTML={{ __html: `<p style="margin:0 0 12px;line-height:1.7">${renderMd(form.body)}</p>` }} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ CASE STUDY MANAGER ═══════════════ */
function CaseManager({ headers }) {
  const [cases, setCases] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch('/api/cases?admin=1', { headers });
    const d = await r.json();
    setCases(d.cases || []);
    setLoading(false);
  }, [headers]);

  useEffect(() => { load(); }, [load]);

  if (editing) return <CaseEditor cs={editing === 'new' ? null : editing} headers={headers} onSave={() => { setEditing(null); load(); }} onCancel={() => setEditing(null)} />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.navy }}>Case Studies ({cases.length})</h2>
        <button onClick={() => setEditing('new')} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: C.teal, color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>+ New Case Study</button>
      </div>
      {loading ? <p style={{ color: C.textMuted }}>Loading...</p> :
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {cases.map(c => (
            <div key={c.id} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.status === 'published' ? C.green : '#F59E0B' }} />
                  <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 700 }}>{c.status.toUpperCase()}</span>
                  <span style={{ fontSize: 11, color: C.textMuted }}>Order: {c.sort_order}</span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{c.title}</h3>
                <p style={{ fontSize: 12, color: C.textMuted }}>{c.client} · {c.industry}</p>
                {c.pdf_path && <span style={{ fontSize: 10, color: C.teal, fontWeight: 700 }}>📄 PDF attached</span>}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setEditing(c)} style={{ padding: '6px 14px', borderRadius: 6, border: `1px solid ${C.border}`, background: C.bg, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Edit</button>
                <button onClick={async () => { if (confirm('Delete?')) { await fetch(`/api/cases/${c.id}`, { method: 'DELETE', headers }); load(); } }}
                  style={{ padding: '6px 14px', borderRadius: 6, border: `1px solid ${C.red}33`, background: C.red + '08', color: C.red, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}

/* ═══════════════ CASE STUDY EDITOR ═══════════════ */
function CaseEditor({ cs, headers, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: cs?.title || '', subtitle: cs?.subtitle || '', client: cs?.client || '',
    industry: cs?.industry || '', tags: cs?.tags?.join(', ') || '',
    challenge: cs?.challenge || '', solution: cs?.solution || '', results: cs?.results || '',
    metrics: cs?.metrics || [], color: cs?.color || '#0D9488',
    sort_order: cs?.sort_order || 0, status: cs?.status || 'draft', pdf_path: cs?.pdf_path || '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const save = async () => {
    setSaving(true);
    const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), sort_order: parseInt(form.sort_order) };
    const url = cs ? `/api/cases/${cs.id}` : '/api/cases';
    const method = cs ? 'PUT' : 'POST';
    await fetch(url, { method, headers, body: JSON.stringify(payload) });
    setSaving(false);
    onSave();
  };

  const uploadPdf = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const r = await fetch('/api/upload', { method: 'POST', headers: { 'Authorization': headers.Authorization }, body: fd });
    const d = await r.json();
    if (d.path) setForm({ ...form, pdf_path: d.path });
    setUploading(false);
  };

  const addMetric = () => setForm({ ...form, metrics: [...form.metrics, { label: '', value: '' }] });
  const updateMetric = (i, k, v) => { const m = [...form.metrics]; m[i] = { ...m[i], [k]: v }; setForm({ ...form, metrics: m }); };
  const removeMetric = (i) => { const m = [...form.metrics]; m.splice(i, 1); setForm({ ...form, metrics: m }); };

  const I = ({ label, field, area }) => (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</label>
      {area ? <textarea value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} rows={3}
        style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, outline: 'none', resize: 'vertical', marginTop: 4, boxSizing: 'border-box' }} />
        : <input value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
          style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, outline: 'none', marginTop: 4, boxSizing: 'border-box' }} />
      }
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.navy }}>{cs ? 'Edit Case Study' : 'New Case Study'}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onCancel} style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: C.teal, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
      <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <I label="Title *" field="title" />
          <I label="Subtitle" field="subtitle" />
          <I label="Client *" field="client" />
          <I label="Industry" field="industry" />
          <I label="Tags (comma-separated)" field="tags" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Color</label>
              <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} style={{ width: '100%', height: 36, border: 'none', marginTop: 4, cursor: 'pointer' }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Order</label>
              <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, outline: 'none', marginTop: 4, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, outline: 'none', marginTop: 4 }}>
                <option value="draft">Draft</option><option value="published">Published</option>
              </select>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
          <I label="Challenge" field="challenge" area />
          <I label="Solution" field="solution" area />
          <I label="Results" field="results" area />
        </div>
        {/* Metrics */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Key Metrics</label>
            <button onClick={addMetric} style={{ fontSize: 12, color: C.teal, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>+ Add Metric</button>
          </div>
          {form.metrics.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
              <input value={m.label} onChange={e => updateMetric(i, 'label', e.target.value)} placeholder="Label" style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12, outline: 'none' }} />
              <input value={m.value} onChange={e => updateMetric(i, 'value', e.target.value)} placeholder="Value" style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12, outline: 'none' }} />
              <button onClick={() => removeMetric(i)} style={{ color: C.red, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>×</button>
            </div>
          ))}
        </div>
        {/* PDF Upload */}
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>PDF Attachment</label>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 6 }}>
            <input type="file" accept=".pdf" onChange={uploadPdf} style={{ fontSize: 13 }} />
            {uploading && <span style={{ fontSize: 12, color: C.teal }}>Uploading...</span>}
            {form.pdf_path && <a href={form.pdf_path} target="_blank" rel="noopener" style={{ fontSize: 12, color: C.teal, fontWeight: 700 }}>📄 {form.pdf_path}</a>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ COMMENT MANAGER ═══════════════ */
function CommentManager({ headers }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch('/api/blog/comments?admin=1', { headers });
    const d = await r.json();
    setComments(d.comments || []);
    setLoading(false);
  }, [headers]);

  useEffect(() => { load(); }, [load]);

  const approve = async (id, approved) => {
    await fetch('/api/blog/comments', { method: 'PUT', headers, body: JSON.stringify({ id, approved }) });
    load();
  };

  const del = async (id) => {
    await fetch(`/api/blog/comments?id=${id}`, { method: 'DELETE', headers });
    load();
  };

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginBottom: 20 }}>Comments ({comments.length})</h2>
      {loading ? <p style={{ color: C.textMuted }}>Loading...</p> :
        comments.length === 0 ? <p style={{ color: C.textMuted }}>No comments yet</p> :
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {comments.map(c => (
              <div key={c.id} style={{ background: C.bg, border: `1px solid ${c.approved ? C.green + '33' : '#F59E0B33'}`, borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{c.name}</span>
                    {c.email && <span style={{ fontSize: 11, color: C.textMuted, marginLeft: 8 }}>{c.email}</span>}
                    <span style={{ fontSize: 10, color: C.textMuted, marginLeft: 8 }}>on "{c.post_title}"</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {!c.approved && <button onClick={() => approve(c.id, true)} style={{ padding: '4px 10px', borderRadius: 4, border: 'none', background: C.green, color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Approve</button>}
                    {c.approved && <button onClick={() => approve(c.id, false)} style={{ padding: '4px 10px', borderRadius: 4, border: `1px solid ${C.border}`, background: C.bg, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Unapprove</button>}
                    <button onClick={() => del(c.id)} style={{ padding: '4px 10px', borderRadius: 4, border: 'none', background: C.red + '15', color: C.red, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: C.text, marginTop: 8, lineHeight: 1.6 }}>{c.body}</p>
              </div>
            ))}
          </div>
      }
    </div>
  );
}
