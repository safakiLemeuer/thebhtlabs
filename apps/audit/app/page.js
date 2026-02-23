'use client';
import { useState } from 'react';

const C = {
  bg:"#FFFFFF",bgSoft:"#FAFAF9",bgMuted:"#F5F5F4",navy:"#1C1917",
  text:"#1C1917",textSoft:"#44403C",textMuted:"#78716C",textFaint:"#A8A29E",
  teal:"#0E7490",tealDark:"#155E75",coral:"#EA580C",rose:"#DC2626",
  violet:"#7C3AED",border:"#E7E5E4",borderLight:"#F5F5F4",
  shadow:"0 1px 3px rgba(28,25,23,.05)",shadowMd:"0 4px 16px rgba(28,25,23,.07)",
};
const F = { h:"'Poppins',sans-serif", m:"'DM Mono',monospace", b:"'Poppins',sans-serif" };

export default function AuditPage() {
  const [domain, setDomain] = useState("");
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [gateForm, setGateForm] = useState({name:"",email:"",company:""});
  const [gateSaving, setGateSaving] = useState(false);
  const [gateDone, setGateDone] = useState(false);

  const runScan = async () => {
    if (!domain || !consent) return;
    setScanning(true); setError(""); setResults(null);
    try {
      const r = await fetch("/api/health-check", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({domain:domain.trim()})});
      const d = await r.json();
      if (r.ok) setResults(d); else setError(d.error || "Analysis failed");
    } catch (e) { setError("Network error. Please try again."); }
    setScanning(false);
  };

  const requestPDF = async () => {
    if (!gateForm.name||!gateForm.email) return;
    setGateSaving(true);
    try { await fetch("/api/health-check", {method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({action:"save-pdf",domain,name:gateForm.name,email:gateForm.email,company:gateForm.company,score:results?.governance?.percentage,botsFound:results?.bots?.map(b=>b.name).join(', ')})}); } catch(e){}
    setGateDone(true); setGateSaving(false);
    setTimeout(()=>{
      const w = window.open('','_blank'); if(!w) return;
      const g = results.governance;
      const si2 = (s) => s==='pass'?'PASS':s==='warn'?'WARN':'FAIL';
      w.document.write(`<!DOCTYPE html><html><head><title>AI Bot Governance Audit — ${domain} — TheBHTLabs</title><style>@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=DM+Mono:wght@400&display=swap");*{margin:0;padding:0;box-sizing:border-box}body{font-family:"Poppins",sans-serif;color:#1C1917;padding:40px;max-width:800px;margin:0 auto}@media print{body{padding:20px}button,.no-print{display:none!important}}.card{padding:14px;border-radius:10px;border:1px solid #E7E5E4;margin-bottom:10px}</style></head><body>`+
      `<div style="background:#1C1917;color:#fff;padding:10px 16px;border-radius:8px;margin-bottom:16px;font-size:9px;line-height:1.6"><strong>CONFIDENTIAL</strong> — Prepared for ${gateForm.name} at ${gateForm.company||domain}. This analysis examines publicly visible website content only. ARIA Score\u2122 methodology is proprietary to BHT Solutions LLC. Report ID: BHT-BA-${Date.now().toString(36).toUpperCase()}</div>`+
      `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;padding-bottom:12px;border-bottom:2px solid #0E7490"><div><h1 style="font-size:24px;font-weight:800">AI Bot Governance Audit</h1><p style="color:#78716C;font-size:13px;margin-top:4px">${domain} \u00b7 ${new Date().toLocaleDateString()}</p></div><div style="text-align:right"><div style="font-weight:800;font-size:15px">TheBHT<span style="color:#0E7490">Labs</span></div><div style="font-size:9px;color:#78716C">audit.thebhtlabs.com</div></div></div>`+
      `<div style="text-align:center;padding:24px;background:#FAFAF9;border-radius:14px;margin-bottom:20px"><div style="font-size:48px;font-weight:800;color:${g.percentage>=70?'#0E7490':g.percentage>=40?'#F97316':'#DC2626'};font-family:DM Mono,monospace">${g.percentage}/100</div><div style="font-size:14px;font-weight:700;margin-top:4px">AI Governance Score</div><div style="font-size:12px;color:#78716C;margin-top:4px">${results.hasChatbot?'Chatbot: '+results.bots.map(b=>b.name).join(', '):'No chatbot detected'}</div></div>`+
      g.checks.map(c=>`<div class="card"><div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="font-size:18px">${si2(c.status)}</span><span style="font-size:13px;font-weight:700">${c.name}</span><span style="margin-left:auto;font-size:11px;color:#78716C">${c.score}/${c.weight}</span></div><p style="font-size:11px;color:#78716C;line-height:1.5">${c.detail}</p><p style="font-size:9px;color:#A8A29E;font-style:italic">${c.regulation}</p></div>`).join('')+
      `<div style="padding:16px;background:#F0FDFA;border-radius:12px;border:1px solid #CCFBF1;margin-top:20px"><p style="font-size:12px;color:#0F766E;line-height:1.7"><strong>This scanned your homepage only.</strong> Our full AI Agent Audit tests actual chatbot responses: prompt injection, hallucination, PII leakage, and 30+ behavioral checks.</p><p style="font-size:13px;font-weight:700;color:#0E7490;margin-top:8px">thebhtlabs.com \u00b7 info@bhtsolutions.com</p></div>`+
      `<div style="margin-top:16px;padding:12px;background:#FAFAF9;border-radius:8px;font-size:8px;color:#A8A29E;line-height:1.6"><strong>Legal Disclaimer:</strong> This report analyzes publicly visible website content only. No systems were accessed or tested. ARIA Score\u2122 is a trademark of BHT Solutions LLC. \u00a9 ${new Date().getFullYear()} Bluebery Hawaii Technology Solutions LLC.</div>`+
      `<div style="text-align:center;margin-top:16px" class="no-print"><button onclick="window.print()" style="padding:12px 28px;border-radius:10px;border:none;background:#0E7490;color:#fff;font-weight:700;cursor:pointer">Save as PDF</button></div></body></html>`);
      w.document.close();
    }, 300);
  };

  const si = (s) => s==='pass'?{color:C.teal,bg:'#F0FDFA',label:'PASS'}:s==='warn'?{color:'#EA580C',bg:'#FFF7ED',label:'WARN'}:{color:C.rose,bg:'#FEF2F2',label:'FAIL'};

  const reset = () => { setResults(null);setDomain("");setConsent(false);setShowGate(false);setGateDone(false);setGateForm({name:"",email:"",company:""}); };

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      {/* Nav */}
      <nav style={{padding:"12px 24px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <a href="https://thebhtlabs.com" style={{textDecoration:"none",display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#0E7490,#155E75)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{color:"#fff",fontFamily:"monospace",fontWeight:800,fontSize:14}}>{"\u03bb"}</span>
          </div>
          <span style={{fontSize:15,fontWeight:800,fontFamily:F.h,color:C.navy}}>TheBHT<span style={{color:C.teal}}>Labs</span></span>
        </a>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <a href="https://assess.thebhtlabs.com" style={{fontSize:12,fontWeight:600,fontFamily:F.h,color:C.textMuted,textDecoration:"none"}}>ARIA Assessment</a>
          <a href="https://thebhtlabs.com#packages" style={{padding:"6px 16px",borderRadius:8,fontSize:12,fontWeight:700,fontFamily:F.h,background:C.teal,color:"#fff",textDecoration:"none"}}>Get Started</a>
        </div>
      </nav>

      <main style={{flex:1,maxWidth:900,margin:"0 auto",padding:"0 24px",width:"100%"}}>
        {/* Hero */}
        <div style={{textAlign:"center",padding:"60px 0 40px"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"4px 14px",borderRadius:20,background:C.rose+"0D",marginBottom:16}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:C.rose}} />
            <span style={{fontSize:11,fontWeight:700,fontFamily:F.m,color:C.rose}}>67% of AI chatbots fail basic governance checks</span>
          </div>
          <h1 style={{fontSize:"clamp(32px,5vw,52px)",fontWeight:800,fontFamily:F.h,lineHeight:1.08,color:C.navy,letterSpacing:"-0.03em"}}>
            Is your AI bot <span style={{color:C.teal}}>governed?</span>
          </h1>
          <p style={{color:C.textMuted,fontSize:17,lineHeight:1.7,maxWidth:560,margin:"16px auto 0",fontFamily:F.b}}>
            Enter any website. We detect chatbots and score their AI governance against EU AI Act, NIST, GDPR, and ISO 42001. Takes 10 seconds.
          </p>
        </div>

        {/* Scanner */}
        {!results ? (
          <div style={{maxWidth:560,margin:"0 auto",marginBottom:60}}>
            <div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:20,padding:32,boxShadow:C.shadowMd}}>
              <div style={{display:"flex",gap:8,marginBottom:16}}>
                <input value={domain} onChange={e=>setDomain(e.target.value)} onKeyDown={e=>e.key==='Enter'&&consent&&runScan()}
                  placeholder="yourcompany.com" style={{flex:1,padding:"14px 18px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:15,fontFamily:F.b,outline:"none"}} />
                <button onClick={runScan} disabled={scanning||!consent||!domain}
                  style={{padding:"14px 28px",borderRadius:12,border:"none",background:scanning?C.textMuted:C.teal,color:"#fff",fontSize:14,fontWeight:700,fontFamily:F.h,cursor:scanning?"wait":"pointer",whiteSpace:"nowrap"}}>
                  {scanning?"Scanning...":"Audit \u2192"}
                </button>
              </div>
              <label style={{display:"flex",gap:8,alignItems:"flex-start",cursor:"pointer",marginBottom:16}} onClick={()=>setConsent(!consent)}>
                <div style={{width:18,height:18,borderRadius:4,border:`2px solid ${consent?C.teal:C.border}`,background:consent?C.teal:"transparent",flexShrink:0,marginTop:1,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}>
                  {consent&&<span style={{color:"#fff",fontSize:11,fontWeight:800}}>{"\u2713"}</span>}
                </div>
                <span style={{fontSize:11,color:C.textMuted,lineHeight:1.5}}>I confirm I am authorized to analyze this website and understand this examines publicly visible content only.</span>
              </label>
              {error&&<p style={{color:C.rose,fontSize:13,marginTop:8}}>{error}</p>}
              <div style={{padding:12,background:C.bgSoft,borderRadius:10,marginTop:8}}>
                <p style={{fontSize:10,color:C.textFaint,lineHeight:1.6,margin:0}}>
                  <strong style={{color:C.textMuted}}>What we check:</strong> AI disclosures, privacy notices, human escalation paths, cookie consent, AI terms of use, governance frameworks, accessibility. 8 checks mapped to EU AI Act, NIST AI RMF, GDPR, and ISO 42001.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div style={{marginBottom:60}}>
            {/* Score header */}
            <div style={{textAlign:"center",padding:32,background:C.bgSoft,borderRadius:20,border:`1px solid ${C.border}`,marginBottom:24}}>
              <div style={{fontSize:64,fontWeight:900,fontFamily:F.m,color:results.governance.percentage>=70?C.teal:results.governance.percentage>=40?C.coral:C.rose,lineHeight:1}}>
                {results.governance.percentage}<span style={{fontSize:28,color:C.textFaint}}>/100</span>
              </div>
              <div style={{fontSize:18,fontWeight:700,fontFamily:F.h,color:C.navy,marginTop:8}}>AI Governance Score — {domain}</div>
              <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:10,flexWrap:"wrap"}}>
                {results.hasChatbot ? results.bots.map(b=>(
                  <span key={b.name} style={{padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:600,fontFamily:F.m,background:C.violet+"0D",color:C.violet}}>{b.name}</span>
                )) : <span style={{fontSize:12,color:C.textFaint}}>No chatbot detected</span>}
              </div>
            </div>

            {/* Checks */}
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
              {results.governance.checks.map(c => {
                const s = si(c.status);
                return (
                  <div key={c.id} style={{padding:"16px 20px",borderRadius:14,border:`1px solid ${C.border}`,background:s.bg}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                      <span style={{fontSize:11,fontWeight:800,fontFamily:F.m,color:s.color,padding:"2px 8px",borderRadius:4,background:s.color+"15"}}>{s.label}</span>
                      <span style={{fontSize:14,fontWeight:700,fontFamily:F.h,color:C.navy}}>{c.name}</span>
                      <span style={{marginLeft:"auto",fontSize:12,fontWeight:700,fontFamily:F.m,color:s.color}}>{c.score}/{c.weight}</span>
                    </div>
                    <p style={{fontSize:12,color:C.textMuted,lineHeight:1.6,marginBottom:4}}>{c.detail}</p>
                    <p style={{fontSize:10,color:C.textFaint,fontStyle:"italic"}}>{c.regulation}</p>
                  </div>
                );
              })}
            </div>

            {/* Benchmark */}
            <div style={{padding:24,borderRadius:16,background:C.bgSoft,border:`1px solid ${C.border}`,marginBottom:24}}>
              <div style={{fontSize:12,fontWeight:700,color:C.violet,textTransform:"uppercase",letterSpacing:1,fontFamily:F.m,marginBottom:12}}>How You Compare</div>
              <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:8}}>
                <div style={{flex:1,height:28,background:C.bgMuted,borderRadius:8,position:"relative",overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${results.governance.percentage}%`,background:results.governance.percentage>=70?C.teal:results.governance.percentage>=40?C.coral:C.rose,borderRadius:8,transition:"width 1s ease"}} />
                  <div style={{position:"absolute",top:0,left:"31%",height:"100%",width:2,background:C.navy}} />
                </div>
                <span style={{fontSize:15,fontWeight:800,fontFamily:F.m,color:C.navy}}>{results.governance.percentage}%</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.textFaint,fontFamily:F.m}}>
                <span>Most sites: 15-35%</span><span style={{color:C.navy,fontWeight:700}}>Avg: 31%</span><span>Top 10%: 72%+</span>
              </div>
            </div>

            {/* CTAs */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
              <div style={{padding:20,borderRadius:14,background:C.bg,border:`1px solid ${C.border}`,boxShadow:C.shadow}}>
                <div style={{fontSize:14,fontWeight:700,fontFamily:F.h,color:C.navy,marginBottom:8}}>Download Audit Report (PDF)</div>
                <p style={{fontSize:12,color:C.textMuted,lineHeight:1.6,marginBottom:12}}>Detailed findings with regulatory citations.</p>
                {!gateDone ? (!showGate ? (
                  <button onClick={()=>setShowGate(true)} style={{padding:"10px 20px",borderRadius:10,border:"none",background:C.teal,color:"#fff",fontSize:13,fontWeight:700,fontFamily:F.h,cursor:"pointer",width:"100%"}}>Download PDF Report</button>
                ) : (
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    <input value={gateForm.name} onChange={e=>setGateForm({...gateForm,name:e.target.value})} placeholder="Your name *" style={{padding:"10px 14px",borderRadius:8,border:`1px solid ${C.border}`,fontSize:13,fontFamily:F.b}} />
                    <input value={gateForm.email} onChange={e=>setGateForm({...gateForm,email:e.target.value})} placeholder="Work email *" style={{padding:"10px 14px",borderRadius:8,border:`1px solid ${C.border}`,fontSize:13,fontFamily:F.b}} />
                    <input value={gateForm.company} onChange={e=>setGateForm({...gateForm,company:e.target.value})} placeholder="Company (optional)" style={{padding:"10px 14px",borderRadius:8,border:`1px solid ${C.border}`,fontSize:13,fontFamily:F.b}} />
                    <button onClick={requestPDF} disabled={gateSaving||!gateForm.name||!gateForm.email}
                      style={{padding:"10px",borderRadius:8,border:"none",background:C.teal,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:F.h}}>{gateSaving?"Generating...":"Generate & Download"}</button>
                  </div>
                )) : (
                  <div style={{textAlign:"center",color:C.teal,fontSize:13,fontWeight:600,padding:"10px",background:C.teal+"0A",borderRadius:8}}>{"\u2713"} PDF generated</div>
                )}
              </div>
              <div style={{padding:20,borderRadius:14,background:"#F0FDFA",border:"1px solid #CCFBF1"}}>
                <div style={{fontSize:14,fontWeight:700,fontFamily:F.h,color:"#0F766E",marginBottom:8}}>Want the full picture?</div>
                <p style={{fontSize:12,color:"#0F766E",lineHeight:1.7,marginBottom:12}}>This scanned HTML. Our full AI Agent Audit tests actual chatbot responses: prompt injection, hallucination, PII leakage, and 30+ behavioral controls.</p>
                <a href="https://assess.thebhtlabs.com" style={{display:"block",padding:"10px 20px",borderRadius:10,border:"none",background:"#0F766E",color:"#fff",fontSize:13,fontWeight:700,fontFamily:F.h,textAlign:"center",textDecoration:"none"}}>Take 35-Point Assessment {"\u2192"}</a>
              </div>
            </div>

            <div style={{textAlign:"center",marginTop:16}}>
              <button onClick={reset} style={{padding:"8px 20px",borderRadius:8,border:`1px solid ${C.border}`,background:C.bg,color:C.textMuted,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:F.h}}>Audit Another Site</button>
            </div>

            <div style={{marginTop:20,padding:14,background:C.bgSoft,borderRadius:10}}>
              <p style={{fontSize:9,color:C.textFaint,lineHeight:1.7,margin:0}}>
                <strong style={{color:C.textMuted}}>Legal Disclaimer:</strong> This analysis examines publicly visible website content only. No systems were accessed, tested, or penetrated. Governance scores reflect surface-level HTML indicators. ARIA Score{"\u2122"} is a trademark of BHT Solutions LLC. {"\u00a9"} {new Date().getFullYear()} Bluebery Hawaii Technology Solutions LLC.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{padding:"32px 24px",textAlign:"center",background:C.navy,color:"rgba(255,255,255,.5)",fontSize:11,fontFamily:F.m}}>
        <div style={{fontSize:14,fontWeight:800,fontFamily:F.h,color:"#fff",marginBottom:8}}>TheBHT<span style={{color:C.teal}}>Labs</span></div>
        <div style={{display:"flex",justifyContent:"center",gap:16,marginBottom:12,flexWrap:"wrap"}}>
          <a href="https://thebhtlabs.com" style={{color:"rgba(255,255,255,.6)",textDecoration:"none",fontSize:12}}>Home</a>
          <a href="https://assess.thebhtlabs.com" style={{color:"rgba(255,255,255,.6)",textDecoration:"none",fontSize:12}}>ARIA Assessment</a>
          <a href="https://fed.thebhtlabs.com" style={{color:"rgba(255,255,255,.6)",textDecoration:"none",fontSize:12}}>Federal Hub</a>
          <a href="https://thebhtlabs.com/blog" style={{color:"rgba(255,255,255,.6)",textDecoration:"none",fontSize:12}}>Blog</a>
        </div>
        <p style={{fontSize:12,marginBottom:6}}>info@bhtsolutions.com &middot; (513) 638-1986</p>
        <p style={{fontSize:9,color:"rgba(255,255,255,.25)"}}>&copy; {new Date().getFullYear()} Bluebery Hawaii Technology Solutions LLC &middot; SBA 8(a) &middot; EDWOSB</p>
      </footer>
    </div>
  );
}
