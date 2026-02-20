'use client';
import { useState, useEffect, useRef } from "react";

/* ═══════════════ DESIGN SYSTEM — Warm / Premium Consulting Aesthetic ═══════════════ */
const C = {
  bg: "#FFFFFF", bgSoft: "#FAFAF9", bgMuted: "#F5F5F4",
  card: "#FFFFFF", cardHover: "#FEFEFE",
  navy: "#1C1917", navyLight: "#292524",
  text: "#1C1917", textSoft: "#44403C", textMuted: "#78716C", textFaint: "#A8A29E",
  teal: "#0E7490", tealLight: "#CFFAFE", tealDark: "#155E75", tealBg: "rgba(14,116,144,.04)",
  coral: "#EA580C", coralBg: "rgba(234,88,12,.04)",
  blue: "#2563EB", blueBg: "rgba(37,99,235,.04)",
  violet: "#7C3AED", violetBg: "rgba(124,58,237,.04)",
  rose: "#DC2626", roseBg: "rgba(220,38,38,.04)",
  border: "#E7E5E4", borderLight: "#F5F5F4",
  shadow: "0 1px 3px rgba(28,25,23,.05), 0 1px 2px rgba(28,25,23,.03)",
  shadowMd: "0 4px 16px rgba(28,25,23,.07), 0 2px 4px rgba(28,25,23,.04)",
  shadowLg: "0 12px 40px rgba(28,25,23,.1), 0 4px 12px rgba(28,25,23,.04)",
};
const F = {
  h: "'Poppins', sans-serif",
  m: "'DM Mono', monospace",
  b: "'Poppins', sans-serif",
};

/* ═══════════════ MICRO COMPONENTS ═══════════════ */
const Tag = ({children, color = C.teal, bg}) => (
  <span style={{padding:"4px 12px",borderRadius:20,fontSize:12,fontWeight:600,fontFamily:F.h,
    background:bg||color+"0D",color:color,letterSpacing:".2px"}}>{children}</span>
);
const Badge = ({children, color = C.teal}) => (
  <span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"3px 10px",borderRadius:20,
    fontSize:11,fontWeight:600,fontFamily:F.m,background:color+"0A",color:color}}>
    <span style={{width:6,height:6,borderRadius:"50%",background:color}}/>
    {children}
  </span>
);
const SH = ({tag, title, desc, align="center"}) => (
  <div style={{textAlign:align,marginBottom:56,maxWidth:700,margin:align==="center"?"0 auto 56px":"0 0 56px"}}>
    {tag && <div style={{marginBottom:12}}><Tag>{tag}</Tag></div>}
    <h2 style={{color:C.navy,fontSize:"clamp(28px,3.5vw,42px)",fontWeight:800,fontFamily:F.h,lineHeight:1.12,letterSpacing:"-0.02em"}}>{title}</h2>
    {desc && <p style={{color:C.textMuted,fontSize:16,marginTop:14,lineHeight:1.7,fontFamily:F.b}}>{desc}</p>}
  </div>
);

/* ═══════════════ DATA ═══════════════ */
const AQ = [
  {d:"Data Foundation",icon:"◈",q:["Is your business data centralized in a single system (CRM, ERP, cloud)?","Do you have clean, structured data that's less than 6 months old?","Are there defined data governance policies (who owns, accesses, updates)?","Can your data be exported in standard formats (CSV, API, database)?","Do you track customer interactions digitally (emails, calls, transactions)?"]},
  {d:"Process Maturity",icon:"⬡",q:["Are your core workflows documented and repeatable?","Do you have processes that involve repetitive manual data entry?","Are there bottlenecks where tasks wait on a single person?","Do you measure process cycle times and error rates?","Have you automated any workflows (email sequences, approvals, reports)?"]},
  {d:"Technology Readiness",icon:"△",q:["Are you using cloud-based tools (M365, Google Workspace, AWS)?","Can your systems integrate with third-party APIs?","Do you have a cybersecurity baseline (MFA, endpoint protection)?","Are your systems on supported/current software versions?","Do employees have access to collaboration tools (Teams, Slack)?"]},
  {d:"People & Culture",icon:"○",q:["Is leadership open to experimenting with AI tools?","Do employees currently use any AI tools (ChatGPT, Copilot)?","Is there budget allocated for technology training?","Would your team embrace AI assistance or resist change?","Do you have someone who understands AI basics?"]},
  {d:"Strategy & ROI",icon:"□",q:["Can you identify 3+ tasks consuming >5 hrs/week that are repetitive?","Do you have clear KPIs for operational efficiency?","Would saving 10-20 hrs/week per team member impact revenue?","Are competitors in your industry already adopting AI?","Do you have budget flexibility for a 3-6 month pilot?"]},
  {d:"Governance & Compliance",icon:"⬢",q:["Do you handle sensitive data (PII, PHI, financial)?","Are there industry compliance requirements you must meet?","Do you have data retention and privacy policies?","Would AI decisions need to be explainable or auditable?","Are you aware of AI regulations in your state/industry?"]},
  {d:"Use Case Clarity",icon:"◇",q:["Can you name a specific pain point AI could address today?","Have you evaluated any AI tools in the past 12 months?","Do you have 1-2 high-impact, low-risk AI use cases identified?","Would automating customer-facing tasks benefit you?","Are there reporting/analytics tasks that take too long?"]},
];
const CASES = [
  {client:"Defense Contractor",subtitle:"CMMC Level 2 Certification",industry:"Defense · 200 employees",color:C.teal,
    tags:["CMMC L2","GCC-High","Copilot Studio"],
    challenge:"Zero NIST 800-171 documentation, consumer M365 with mixed CUI data. Needed certification in 90 days to maintain DoD contract.",
    solution:"GCC-High tenant, Intune MDM (200+ devices), Purview DLP with CUI labels, Copilot Studio compliance agent, PowerShell continuous monitoring.",
    results:[{m:"90",u:"days",l:"To Certification"},{m:"110",u:"/110",l:"NIST Practices"},{m:"$2.1M",u:"",l:"Contract Saved"},{m:"0",u:"",l:"Audit Findings"}],
    refs:[{t:"NIST SP 800-171",u:"https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final"},{t:"CMMC Program",u:"https://dodcio.defense.gov/CMMC/"},{t:"M365 GCC-High",u:"https://learn.microsoft.com/en-us/office365/servicedescriptions/office-365-platform-service-description/office-365-us-government/gcc-high-and-dod"}]},
  {client:"Regional Logistics Co.",subtitle:"AI-Powered Operations",industry:"Small Business · 45 employees",color:C.coral,
    tags:["Copilot Studio","Power Automate","AI Readiness"],
    challenge:"3+ hrs/day on route emails, 200+ status calls/week, 2 FTEs for invoicing. Owner didn't know where to start.",
    solution:"35-Point Assessment → Copilot Studio customer agent → Power Automate invoice OCR → Copilot dispatch planning.",
    results:[{m:"67",u:"%",l:"Calls Deflected"},{m:"32",u:"hrs/wk",l:"Manual Work Cut"},{m:"$145K",u:"/yr",l:"Savings"},{m:"<6",u:"mo",l:"ROI Payback"}],
    refs:[{t:"Copilot Studio",u:"https://www.microsoft.com/en-us/microsoft-365-copilot/microsoft-copilot-studio/"},{t:"Power Automate",u:"https://learn.microsoft.com/en-us/power-automate/"},{t:"SBA AI Guide",u:"https://www.sba.gov/blog/how-small-businesses-can-harness-power-ai"}]},
  {client:"Healthcare Network",subtitle:"AI Governance Framework",industry:"Healthcare · 1,200 employees",color:C.rose,
    tags:["AI Governance","HIPAA","NIST AI RMF"],
    challenge:"23+ AI tools with zero governance. PHI in non-compliant systems. Pending audit.",
    solution:"AI inventory audit, NIST AI RMF risk assessment, governance council, 1,200-person training, Copilot Studio approval agent.",
    results:[{m:"23",u:"",l:"Tools Inventoried"},{m:"7",u:"",l:"Gaps Remediated"},{m:"100",u:"%",l:"Training Done"},{m:"Clean",u:"",l:"Audit Result"}],
    refs:[{t:"NIST AI RMF",u:"https://www.nist.gov/artificial-intelligence"},{t:"HIPAA",u:"https://www.hhs.gov/hipaa/index.html"}]},
  {client:"Energy Corporation",subtitle:"M&A Tenant Consolidation",industry:"Energy · 5,200 users",color:C.violet,
    tags:["M&A","Multi-Tenant","Entra ID"],
    challenge:"12 M365 tenants post-acquisition, inconsistent security, no unified identity for 5,200 users.",
    solution:"Phased cross-tenant migration, Entra policies, license reconciliation agent, Copilot Studio comms, Power BI dashboards.",
    results:[{m:"12→1",u:"",l:"Tenants"},{m:"5,200",u:"",l:"Users Migrated"},{m:"$800K",u:"/yr",l:"License Savings"},{m:"99.9",u:"%",l:"Success Rate"}],
    refs:[{t:"Cross-Tenant Migration",u:"https://learn.microsoft.com/en-us/microsoft-365/enterprise/cross-tenant-mailbox-migration"},{t:"Entra Cross-Tenant",u:"https://learn.microsoft.com/en-us/entra/external-id/cross-tenant-access-overview"}]},
];
const PKGS = [
  {name:"AI Discovery",price:"Free",per:"",color:C.teal,pop:false,desc:"30-min call. We review your assessment results and tell you what we'd do first.",feats:["Review your assessment results","2-3 priority recommendations","Honest fit assessment","Zero obligation"],cta:"Book Free Call"},
  {name:"AI Quick Scan",price:"$2,500",per:"/10 hrs",color:C.blue,pop:false,desc:"Our scripts on YOUR tenant. Real findings, not surveys.",feats:["Automated M365/Azure diagnostic","PowerShell tenant analysis","Ungoverned file & DLP gap report","License optimization findings","1-hour executive briefing","3 priority action items"],cta:"Start Scan"},
  {name:"AI Readiness Sprint",price:"$7,500",per:"/30 hrs",color:C.violet,pop:true,desc:"Full engagement. Stakeholder interviews to boardroom deliverable.",feats:["Everything in Quick Scan","Stakeholder interviews (3-5)","Process mapping (core workflows)","90-day prioritized roadmap","Executive presentation deck","Tool & vendor recommendations"],cta:"Start Sprint"},
  {name:"AI Launchpad",price:"$15,000",per:"/month",color:C.coral,pop:false,desc:"Implementation. Agents, automations, training, results.",feats:["Everything in Sprint","Copilot Studio agents (production)","Custom Power Automate workflows","Staff training (up to 20)","Monthly optimization reviews","Priority support + Slack channel"],cta:"Launch Now"},
];
const PROMPTS = [
  {cat:"Business",title:"AI Use Case Identifier",color:C.teal,prompt:"I run a [INDUSTRY] business with [X] employees. Top 3 time-consuming tasks: [list]. Current tools: [list]. Budget: [RANGE]. Identify top 5 AI use cases ranked by: (1) time savings, (2) difficulty, (3) 90-day ROI. For each, recommend specific tools and 2-sentence plan."},
  {cat:"Copilot",title:"IT Helpdesk Agent",color:C.blue,prompt:"You are an IT support agent for [Company]. Access: SharePoint KB, ServiceNow, Graph API, Intune. For each request: (1) classify P1-P4, (2) check KB, (3) attempt auto-resolution, (4) if unresolved create ticket with diagnostics, (5) provide ticket # and SLA."},
  {cat:"Career",title:"AI Skills Gap Analyzer",color:C.coral,prompt:"I am a [TITLE] with [X] years in [INDUSTRY]. Skills: [list]. Based on 2026 trends: (1) Rate my automation risk 1-10, (2) Top 5 AI skills by career impact, (3) For each: 1 free + 1 paid resource, (4) 90-day learning plan, (5) 3 AI-augmented job titles I could target."},
  {cat:"Governance",title:"AI Policy Generator",color:C.violet,prompt:"Draft an AI Acceptable Use Policy for a [SIZE] company in [INDUSTRY]. Include: (1) Approved tools, (2) Prohibited uses, (3) Data classification before AI processing, (4) Training requirements, (5) Incident reporting, (6) Vendor evaluation, (7) Annual review."},
  {cat:"Business",title:"AI Vendor Scorecard",color:C.teal,prompt:"Create a weighted scorecard for comparing AI vendors for [INDUSTRY]. Criteria: (1) Integration with [TOOLS], (2) Data security, (3) Scalability, (4) 12-month TCO, (5) Vendor stability, (6) Adoption difficulty, (7) Time to value. Weight each, 1-5 rubric."},
  {cat:"Copilot",title:"Weekly BI Report Agent",color:C.blue,prompt:"Every Monday 8 AM: (1) Pull last week's sales from [SOURCE], (2) Compare vs prior week + same week last year, (3) Top 3 and bottom 3 products, (4) Flag >20% deviations, (5) Generate exec summary, (6) Post to [Teams/email]. Clean HTML."},
];
const TRACKS = [
  {title:"AI for Business Leaders",level:"Beginner",dur:"4 weeks",color:C.teal,desc:"Understand what AI can and can't do. Evaluate vendors, avoid hype, make smart decisions.",skills:["AI landscape","Vendor evaluation","Business cases","Risk assessment"],stat:"62% of workers believe AI skills improve job security"},
  {title:"Copilot & Automation Mastery",level:"Intermediate",dur:"6 weeks",color:C.blue,desc:"Hands-on with M365 Copilot, Power Automate, and Copilot Studio. Build production agents.",skills:["M365 Copilot","Power Automate","Agent building","Teams integration"],stat:"29% of hiring managers only hire AI-proficient candidates"},
  {title:"AI Governance & Compliance",level:"Advanced",dur:"8 weeks",color:C.violet,desc:"NIST AI RMF, EU AI Act, state regulations. For CISOs, compliance officers, and IT leads.",skills:["NIST AI RMF","EU AI Act","Policy development","Bias auditing"],stat:"Companies with skills readiness 12x more likely to upskill"},
  {title:"Prompt Engineering & AI Tools",level:"All Levels",dur:"Self-paced",color:C.coral,desc:"Master getting great results from Claude, ChatGPT, Copilot, and more.",skills:["Advanced prompting","Chain-of-thought","System prompts","Multi-tool workflows"],stat:"3-6 months of consistent practice makes candidates job-ready"},
];


/* ═══════════════ RSS FEED ENGINE — Powers ALL dynamic sections ═══════════════ */
const P = "https://api.rss2json.com/v1/api.json?rss_url=";

// 15+ sources across 4 categories
const SOURCES = [
  // AI / Tech News
  {url:"https://techcrunch.com/category/artificial-intelligence/feed/",cat:"AI News",color:C.teal,type:"news"},
  {url:"https://feeds.feedburner.com/TheHackersNews",cat:"Cybersecurity",color:C.rose,type:"news"},
  {url:"https://www.wired.com/feed/tag/ai/latest/rss",cat:"AI/Wired",color:C.teal,type:"news"},
  {url:"https://venturebeat.com/category/ai/feed/",cat:"VentureBeat AI",color:C.teal,type:"news"},
  // Federal / Government
  {url:"https://federalnewsnetwork.com/category/technology/feed/",cat:"Federal IT",color:C.blue,type:"news"},
  {url:"https://fedscoop.com/feed/",cat:"FedScoop",color:C.blue,type:"news"},
  {url:"https://www.govtech.com/rss",cat:"GovTech",color:C.blue,type:"news"},
  {url:"https://www.nextgov.com/rss/all/",cat:"NextGov",color:C.blue,type:"news"},
  // Case Study / Business Analysis sources
  {url:"https://hbr.org/topic/technology.rss",cat:"HBR",color:C.coral,type:"case"},
  {url:"https://cloud.google.com/blog/topics/customers/rss",cat:"Google Cloud",color:C.teal,type:"case"},
  {url:"https://aws.amazon.com/blogs/machine-learning/feed/",cat:"AWS ML",color:C.coral,type:"case"},
  {url:"https://blogs.microsoft.com/blog/feed/",cat:"Microsoft",color:C.violet,type:"case"},
  {url:"https://www.mckinsey.com/featured-insights/artificial-intelligence/rss",cat:"McKinsey",color:C.coral,type:"case"},
  // Copilot / Microsoft
  {url:"https://www.microsoft.com/en-us/microsoft-copilot/blog/feed/",cat:"Copilot",color:C.violet,type:"news"},
  // Security
  {url:"https://krebsonsecurity.com/feed/",cat:"Krebs",color:C.rose,type:"news"},
  {url:"https://www.schneier.com/feed/",cat:"Schneier",color:C.rose,type:"news"},
];

// Keywords for AI-relevance filtering
const KW_NEWS = ['ai','artificial intelligence','copilot','automation','machine learning','agent','gpt','llm','claude','gemini','chatgpt','robot','neural','deepfake','generative','federal','government','cyber','compliance','breach','nist','zero trust','cmmc','fedramp','defense','pentagon','layoff','upskill','workforce','hiring'];
const KW_CASE = ['case study','implementation','deployed','saved','million','billion','reduced','improved','automated','transformed','roi','results','outcome','success','adoption','pilot','enterprise','agency','company','hospital','bank'];

/* ═══════════════ MAIN EXPORT ═══════════════ */
export default function TheBHTLabs() {
  const [nav, setNav] = useState("assess");
  // All RSS data
  const [newsItems, setNewsItems] = useState([]);
  const [caseItems, setCaseItems] = useState([]);
  const [feedStatus, setFeedStatus] = useState({live:false,loading:true,count:0,lastUpdate:null});

  // ═══ MASTER RSS LOADER ═══
  useEffect(() => {
    let cancelled = false;
    async function loadAllFeeds() {
      const news = [], cases = [];
      let loaded = 0;

      const promises = SOURCES.map(async (src) => {
        try {
          const r = await fetch(P + encodeURIComponent(src.url));
          const d = await r.json();
          if (d.status === "ok" && d.items) {
            loaded++;
            d.items.slice(0, 10).forEach(item => {
              const title = (item.title || "").replace(/<[^>]+>/g, "").trim();
              const desc = (item.description || "").replace(/<[^>]+>/g, "").substring(0, 220).trim();
              const txt = (title + " " + desc).toLowerCase();
              const entry = {
                title, link: item.link, desc,
                date: item.pubDate || new Date().toISOString(),
                dateFmt: item.pubDate ? new Date(item.pubDate).toLocaleDateString("en-US",{month:"short",day:"numeric"}) : "Recent",
                cat: src.cat, color: src.color,
                source: (() => { try { return new URL(item.link || src.url).hostname.replace("www.",""); } catch(e) { return src.cat; } })(),
              };
              // Route to news or case study based on source type + keywords
              if (src.type === "case" || KW_CASE.some(k => txt.includes(k))) {
                cases.push(entry);
              }
              if (src.type === "news" || KW_NEWS.some(k => txt.includes(k))) {
                news.push(entry);
              }
            });
          }
        } catch(e) { /* skip failed */ }
      });

      await Promise.allSettled(promises);
      if (cancelled) return;

      // Sort by date
      news.sort((a,b) => new Date(b.date) - new Date(a.date));
      cases.sort((a,b) => new Date(b.date) - new Date(a.date));

      setNewsItems(news.slice(0, 30));
      setCaseItems(cases.slice(0, 20));
      setFeedStatus({live: news.length > 0, loading: false, count: loaded, lastUpdate: new Date().toISOString()});
    }
    loadAllFeeds();
    const iv = setInterval(loadAllFeeds, 10 * 60 * 1000); // refresh every 10 min
    return () => { cancelled = true; clearInterval(iv); };
  }, []);

  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); setNav(id); };

  return (
    <div style={{background:C.bg,color:C.text,fontFamily:F.b,lineHeight:1.6,WebkitFontSmoothing:"antialiased"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        ::selection{background:rgba(13,148,136,.15)}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#F8FAFC}::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:2px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        @media(max-width:900px){.g4{grid-template-columns:1fr 1fr!important}.g3{grid-template-columns:1fr!important}.g2{grid-template-columns:1fr!important}}
        @media(max-width:540px){.g4{grid-template-columns:1fr!important}.snav{display:none!important}.hero-t{font-size:34px!important}}
      `}</style>
      <Hero scrollTo={scrollTo} nav={nav} />
      <FreeValueStack />
      <ValueProps />
      <Assessment id="assess" />
      <LiveCaseStudies id="cases" items={caseItems} loading={feedStatus.loading} />
      <ROICalculator id="roi" />
      <PolicyGenerator id="policy" />
      <ComplianceCountdown />
      <Packages id="packages" />
      <Learning id="learn" />
      <AIRiskChecker />
      <TheBuilder id="builder" />
      <HowWeWork />
      <FieldNotes id="notes" />
      <Radar id="insights" items={newsItems} status={feedStatus} />
      <OpsDashboard status={feedStatus} newsCount={newsItems.length} caseCount={caseItems.length} />
      <Partner id="partner" />
      <FAQ id="faq" />
      <ProofBar />
      <Footer />
      <ChatWidget />
      <CookieNotice />
    </div>
  );
}
/* ═══════════════ CLIENT TICKER — Scrolling logos by industry ═══════════════ */
const CLIENTS = [
  // Technology
  {n:"Microsoft",u:"https://www.microsoft.com",cat:"Technology",cc:"#00A4EF"},
  {n:"IBM",u:"https://www.ibm.com",cat:"Technology",cc:"#0530AD"},
  {n:"NTT Data",u:"https://www.nttdata.com",cat:"Technology",cc:"#0072C6"},
  {n:"Hitachi",u:"https://www.hitachiconsulting.com",cat:"Technology",cc:"#E60012"},
  {n:"HID Global",u:"https://www.hidglobal.com",cat:"Technology",cc:"#003DA5"},
  {n:"iRobot",u:"https://www.irobot.com",cat:"Technology",cc:"#8BC540"},
  {n:"Parex Technology",u:"https://www.parextechnologies.com",cat:"Technology",cc:"#0072C6"},
  // Consulting
  {n:"Ernst & Young",u:"https://www.ey.com",cat:"Consulting",cc:"#FFE600"},
  {n:"PwC",u:"https://www.pwc.com",cat:"Consulting",cc:"#EB8C00"},
  {n:"Bain & Company",u:"https://www.bain.com",cat:"Consulting",cc:"#CC0000"},
  // Financial Services
  {n:"Bank of America",u:"https://www.bankofamerica.com",cat:"Financial",cc:"#012169"},
  {n:"SWBC",u:"https://www.swbc.com",cat:"Financial",cc:"#003366"},
  {n:"Standard Insurance",u:"https://www.standard.com",cat:"Financial",cc:"#00539B"},
  // Energy
  {n:"bp",u:"https://www.bp.com",cat:"Energy",cc:"#009B3A"},
  {n:"Devon Energy",u:"https://www.devonenergy.com",cat:"Energy",cc:"#00843D"},
  {n:"Phillips 66",u:"https://www.phillips66.com",cat:"Energy",cc:"#D71920"},
  {n:"CenterPoint Energy",u:"https://www.centerpointenergy.com",cat:"Energy",cc:"#00A94F"},
  {n:"Consolidated Edison",u:"https://www.coned.com",cat:"Energy",cc:"#0066B3"},
  {n:"Speedway",u:"https://www.speedway.com",cat:"Energy",cc:"#ED1C24"},
  {n:"NOV",u:"https://www.nov.com",cat:"Energy",cc:"#005DA6"},
  {n:"Apache",u:"https://www.apachecorp.com",cat:"Energy",cc:"#CE1126"},
  // Healthcare
  {n:"Eli Lilly",u:"https://www.lilly.com",cat:"Healthcare",cc:"#D52B1E"},
  {n:"McKesson",u:"https://www.mckesson.com",cat:"Healthcare",cc:"#0072CE"},
  {n:"Healthcare Assoc. of Hawaii",u:"https://www.hah.org",cat:"Healthcare",cc:"#00AEEF"},
  // Retail & Industrial
  {n:"Kroger",u:"https://www.kroger.com",cat:"Retail",cc:"#0033A0"},
  {n:"GE Power",u:"https://www.ge.com",cat:"Industrial",cc:"#3B73B9"},
  {n:"Foodland",u:"https://www.foodland.com",cat:"Retail",cc:"#E31837"},
  // Nonprofit
  {n:"Bill & Melinda Gates Foundation",u:"https://www.gatesfoundation.org",cat:"Nonprofit",cc:"#1D6FA5"},
  // Federal
  {n:"U.S. Department of Justice",u:"https://www.justice.gov",cat:"Federal",cc:"#002F6C"},
  {n:"U.S. SEC",u:"https://www.sec.gov",cat:"Federal",cc:"#002868"},
  {n:"U.S. DHS",u:"https://www.dhs.gov",cat:"Federal",cc:"#003366"},
  // State & Local
  {n:"State of Hawaii",u:"https://www.hawaii.gov",cat:"State Gov",cc:"#003DA5"},
  {n:"Arkansas Dept. of Education",u:"https://dese.ade.arkansas.gov",cat:"State Gov",cc:"#C41230"},
  {n:"City of San Diego",u:"https://www.sandiego.gov",cat:"State Gov",cc:"#00457C"},
];

const CAT_COLORS = {Technology:"#0072C6",Consulting:"#EB8C00",Financial:"#012169",Energy:"#00843D",Healthcare:"#D52B1E",Retail:"#0033A0",Industrial:"#3B73B9",Nonprofit:"#1D6FA5",Federal:"#002F6C","State Gov":"#C41230"};

function ClientTicker() {
  const [hovered, setHovered] = useState(false);
  const items = [...CLIENTS, ...CLIENTS];
  return (
    <div style={{overflow:"hidden",position:"relative",width:"100%",maskImage:"linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)"}}>
      <div onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
        style={{display:"flex",gap:6,animation:"tickerScroll 80s linear infinite",animationPlayState:hovered?"paused":"running",width:"max-content"}}>
        {items.map((c,i)=>(
          <a key={c.n+i} href={c.u} target="_blank" rel="noopener noreferrer" title={`${c.n} — ${c.cat}`}
            style={{display:"inline-flex",alignItems:"center",gap:7,flexShrink:0,padding:"7px 14px",borderRadius:8,textDecoration:"none",transition:"all .15s",
              background:"transparent",border:`1px solid transparent`}}
            onMouseEnter={e=>{e.currentTarget.style.background=c.cc+"0A";e.currentTarget.style.borderColor=c.cc+"20"}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor="transparent"}}>
            <div style={{width:20,height:20,borderRadius:5,background:c.cc+"15",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:9,fontWeight:800,color:c.cc,fontFamily:F.m}}>{c.n.replace(/^U\.S\.\s/,"").charAt(0)}</span>
            </div>
            <span style={{fontSize:12,fontWeight:600,fontFamily:F.h,color:C.textMuted,whiteSpace:"nowrap"}}>{c.n}</span>
            <span style={{fontSize:8,fontWeight:700,fontFamily:F.m,color:CAT_COLORS[c.cat]||C.textFaint,opacity:.5,textTransform:"uppercase",letterSpacing:.5}}>{c.cat}</span>
          </a>
        ))}
      </div>
      <style>{`@keyframes tickerScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

function Hero({scrollTo, nav}) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(()=>{
    const h=()=>setScrolled(window.scrollY>50);
    window.addEventListener("scroll",h,{passive:true});
    return ()=>window.removeEventListener("scroll",h);
  },[]);
  const navItems = [{id:"assess",l:"Assessment"},{id:"cases",l:"Results"},{id:"roi",l:"ROI Calc"},{id:"policy",l:"AI Policy"},{id:"packages",l:"Packages"},{id:"notes",l:"Field Notes"},{id:"builder",l:"The Builder"},{id:"partner",l:"Work With Us"}];

  /* Unique logo — lambda inside hexagonal shape */
  const Logo = () => (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="36" y2="36">
          <stop offset="0%" stopColor={C.teal}/>
          <stop offset="100%" stopColor={C.tealDark}/>
        </linearGradient>
      </defs>
      <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" fill="url(#logoGrad)" rx="2"/>
      <text x="18" y="23" textAnchor="middle" fill="#fff" fontFamily="'DM Mono',monospace" fontWeight="800" fontSize="18">λ</text>
    </svg>
  );

  return (
    <>
      {/* Sticky Navigation */}
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:999,
        background:scrolled?"rgba(255,255,255,.92)":C.bg,
        backdropFilter:scrolled?"blur(20px) saturate(180%)":"none",
        WebkitBackdropFilter:scrolled?"blur(20px) saturate(180%)":"none",
        borderBottom:`1px solid ${scrolled?C.border:"transparent"}`,
        boxShadow:scrolled?"0 1px 8px rgba(15,23,42,.06)":"none",
        transition:"all .3s ease",
      }}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:scrolled?"10px 24px":"16px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"padding .3s ease"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>
            <Logo />
            <div>
              <span style={{fontWeight:800,fontSize:17,fontFamily:F.h,color:C.navy}}>TheBHT<span style={{color:C.teal}}>Labs</span></span>
              <a href="https://www.bhtsolutions.com" target="_blank" rel="noopener noreferrer"
                style={{display:"block",fontSize:10,color:C.textFaint,fontFamily:F.m,letterSpacing:1,textDecoration:"none",transition:"color .15s"}}
                onMouseEnter={e=>e.target.style.color=C.teal} onMouseLeave={e=>e.target.style.color=C.textFaint}>
                SKUNKWORKS · BHT SOLUTIONS ↗
              </a>
            </div>
          </div>
          <div className="snav" style={{display:"flex",gap:2}}>
            {navItems.map(n=>(
              <button key={n.id} onClick={()=>scrollTo(n.id)} style={{padding:"7px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:F.h,border:"none",transition:"all .15s",
                background:nav===n.id?C.tealBg:"transparent",color:nav===n.id?C.tealDark:C.textMuted}}>{n.l}</button>
            ))}
          </div>
          <button onClick={()=>scrollTo("assess")} style={{padding:"9px 20px",borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:F.h,border:"none",background:C.teal,color:"#fff",boxShadow:`0 2px 8px ${C.teal}33`,transition:"all .2s"}}>
            Free Assessment →
          </button>
        </div>
      </nav>

      {/* Hero content — with top padding for sticky nav */}
      <header style={{borderBottom:`1px solid ${C.border}`,background:`linear-gradient(180deg, ${C.bg} 0%, ${C.bgSoft} 100%)`,paddingTop:80}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"60px 24px 48px",textAlign:"center"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:20,background:"rgba(220,38,38,.06)",border:"1px solid rgba(220,38,38,.12)",marginBottom:20}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:C.rose,animation:"pulse 2s infinite"}} />
            <span style={{fontSize:12,fontWeight:700,fontFamily:F.m,color:C.rose}}>Only 1 in 3 companies have proper AI governance controls — EY 2025 Responsible AI Pulse</span>
          </div>
          <h1 className="hero-t" style={{fontSize:"clamp(36px,5vw,58px)",fontWeight:800,fontFamily:F.h,lineHeight:1.08,color:C.navy,letterSpacing:"-0.03em",maxWidth:800,margin:"0 auto"}}>
            AI-ready in weeks.<br/><span style={{color:C.teal}}>Not quarters.</span>
          </h1>
          <p style={{color:C.textMuted,fontSize:18,lineHeight:1.7,maxWidth:620,margin:"20px auto 14px",fontFamily:F.b}}>
            20 years of Fortune 500 and federal IT. We built the tools, frameworks, and cleared team to take your organization from evaluation to production — with compliance baked in from day one.
          </p>
          <p style={{color:C.textFaint,fontSize:13,fontFamily:F.m,maxWidth:500,margin:"0 auto 32px"}}>
            CAGE: 7DBB9 · UEI: ZW6GMVL368J6 · SBA 8(a) · EDWOSB · CyberAB RP
          </p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>scrollTo("assess")} style={{padding:"14px 32px",borderRadius:12,cursor:"pointer",fontSize:15,fontWeight:700,fontFamily:F.h,border:"none",background:C.teal,color:"#fff",boxShadow:`0 4px 16px ${C.teal}33`,transition:"all .2s"}}>
              Take the 35-Point Assessment
            </button>
            <button onClick={()=>scrollTo("cases")} style={{padding:"14px 32px",borderRadius:12,cursor:"pointer",fontSize:15,fontWeight:700,fontFamily:F.h,border:`1.5px solid ${C.border}`,background:"transparent",color:C.navy,transition:"all .2s"}}>
              See What We've Shipped
            </button>
          </div>
          {/* Client logos — animated ticker */}
          <div style={{marginTop:40,paddingTop:28,borderTop:`1px solid ${C.borderLight}`}}>
            <p style={{color:C.textFaint,fontSize:11,fontFamily:F.m,textTransform:"uppercase",letterSpacing:1.5,marginBottom:14}}>Trusted by teams across industries</p>
            <ClientTicker />
          </div>
          {/* Outcome metrics bar — all verifiable from case studies */}
          <div style={{marginTop:28,display:"flex",justifyContent:"center",gap:40,flexWrap:"wrap"}}>
            {[
              {v:"110/110",l:"NIST 800-171 practices",sub:"90-day CMMC engagement"},
              {v:"87%",l:"Faster document processing",sub:"Insurance broker deployment"},
              {v:"$145K",l:"Annual savings from automation",sub:"PowerShell + Power Automate"},
              {v:"Zero",l:"Downtime on GCC-High migration",sub:"150-employee federal sub"},
            ].map(m=>(
              <div key={m.l} style={{textAlign:"center"}}>
                <div style={{fontSize:22,fontWeight:800,fontFamily:F.m,color:C.teal,lineHeight:1}}>{m.v}</div>
                <div style={{fontSize:11,fontWeight:600,fontFamily:F.h,color:C.navy,marginTop:4}}>{m.l}</div>
                <div style={{fontSize:9,fontFamily:F.m,color:C.textFaint,marginTop:2}}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </header>
    </>
  );
}

/* ═══════════════ FREE VALUE STACK — What visitors get at $0 ═══════════════ */
function FreeValueStack() {
  const tools = [
    {icon:"◈",t:"35-Point AI Readiness Assessment",d:"7 domains, 35 questions, personalized score. Downloadable PDF report with gap analysis and 90-day action plan.",val:"Consultants charge $5-10K for this",c:C.teal},
    {icon:"⬡",t:"AI ROI Calculator",d:"Input your team size, salaries, and hours on repetitive tasks. Get projected 1-3 year savings with executive-ready numbers.",val:"Know your business case in 60 seconds",c:C.blue},
    {icon:"△",t:"AI Policy Generator",d:"Select industry, compliance requirements, and use cases. Get a production-ready AI acceptable use policy in 30 seconds.",val:"Legal teams charge $3-8K for this",c:C.violet},
    {icon:"□",t:"Compliance Countdown",d:"Live tracker for CMMC 2.0 phases, EU AI Act deadlines, NIST AI RMF updates, and state AI regulations. Never miss a deadline.",val:"Updated in real time",c:C.coral},
    {icon:"○",t:"AI Career Risk Assessment",d:"Enter your job title, get an honest analysis of AI automation impact on your role with personalized upskilling recommendations.",val:"Based on industry research",c:C.tealDark},
    {icon:"◇",t:"Curated Learning Paths",d:"Hand-picked free courses from Microsoft, Harvard, Google, NIST, and Anthropic. Organized by role: leaders, builders, compliance.",val:"50+ hours of free training",c:C.navy},
  ];
  return (
    <section style={{padding:"64px 0 48px",background:`linear-gradient(180deg,${C.bgSoft} 0%,${C.bg} 100%)`}}>
      <div style={{maxWidth:1000,margin:"0 auto",padding:"0 24px"}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"5px 14px",borderRadius:20,background:C.teal+"0A",border:`1px solid ${C.teal}15`,marginBottom:14}}>
            <span style={{fontSize:11,fontWeight:800,fontFamily:F.m,color:C.teal,textTransform:"uppercase",letterSpacing:1}}>$0 · No Account · No Catch</span>
          </div>
          <h2 style={{fontSize:"clamp(24px,3.5vw,36px)",fontWeight:800,fontFamily:F.h,color:C.navy,lineHeight:1.15,marginBottom:8}}>
            Everything below is free.<br/><span style={{color:C.teal}}>Right now.</span>
          </h2>
          <p style={{color:C.textMuted,fontSize:15,fontFamily:F.b,maxWidth:560,margin:"0 auto"}}>
            Most firms gate this behind a sales call. We built it because the best way to earn trust is to give value first.
          </p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}} className="g3">
          {tools.map(t=>(
            <div key={t.t} style={{padding:"22px 20px",borderRadius:14,background:C.bg,border:`1px solid ${C.border}`,transition:"all .2s",cursor:"default",position:"relative",overflow:"hidden"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=t.c+"30";e.currentTarget.style.boxShadow=`0 4px 20px ${t.c}08`}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="none"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:32,height:32,borderRadius:8,background:t.c+"0A",display:"flex",alignItems:"center",justifyContent:"center",color:t.c,fontSize:15,fontWeight:700,flexShrink:0}}>{t.icon}</div>
                <h3 style={{fontSize:14,fontWeight:700,fontFamily:F.h,color:C.navy,lineHeight:1.25}}>{t.t}</h3>
              </div>
              <p style={{fontSize:12,lineHeight:1.6,color:C.textSoft,fontFamily:F.b,marginBottom:10}}>{t.d}</p>
              <div style={{fontSize:10,fontWeight:700,fontFamily:F.m,color:t.c,textTransform:"uppercase",letterSpacing:.5}}>{t.val}</div>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:24}}>
          <p style={{fontSize:12,color:C.textFaint,fontFamily:F.m}}>All tools run in your browser. We don't store your data. No account required. No email gate. Just use them.</p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ VALUE PROPS ═══════════════ */
function ValueProps() {
  const items = [
    {icon:"◈",t:"Assess",d:"35-point AI readiness evaluation across 7 domains. Know exactly where you stand.",color:C.teal},
    {icon:"⬡",t:"Build",d:"Production Copilot Studio agents and Power Automate workflows. Not demos — real ROI.",color:C.blue},
    {icon:"△",t:"Learn",d:"Career-proof AI skills. Prompts, governance, automation — real mastery in weeks.",color:C.violet},
    {icon:"○",t:"Govern",d:"AI compliance frameworks, acceptable use policies, CMMC & FedRAMP readiness.",color:C.coral},
  ];
  return (
    <section style={{padding:"72px 0",background:C.bg}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px"}}>
        <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20}}>
          {items.map(v => (
            <div key={v.t} style={{padding:28,borderRadius:16,border:`1px solid ${C.border}`,background:C.bg,transition:"all .2s",cursor:"default"}}>
              <div style={{width:44,height:44,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",background:v.color+"0A",color:v.color,fontSize:20,fontWeight:700,marginBottom:16}}>{v.icon}</div>
              <h3 style={{fontSize:18,fontWeight:700,fontFamily:F.h,color:C.navy,marginBottom:6}}>{v.t}</h3>
              <p style={{color:C.textMuted,fontSize:14,lineHeight:1.6}}>{v.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ ASSESSMENT ═══════════════ */
const INDUSTRIES = [
  {v:"financial",l:"Financial Services",avg:61},{v:"healthcare",l:"Healthcare",avg:54},
  {v:"professional",l:"Professional Services",avg:58},{v:"manufacturing",l:"Manufacturing",avg:49},
  {v:"legal",l:"Legal",avg:44},{v:"govdef",l:"Government / Defense",avg:52},
  {v:"technology",l:"Technology",avg:67},{v:"retail",l:"Retail / Distribution",avg:51},
  {v:"energy",l:"Energy / Utilities",avg:53},{v:"education",l:"Education",avg:48},
  {v:"insurance",l:"Insurance / Benefits",avg:56},{v:"construction",l:"Construction / Engineering",avg:45},
  {v:"nonprofit",l:"Nonprofit",avg:46},{v:"other",l:"Other",avg:52},
];
const JOB_TITLES = ["CIO","CTO","VP of IT","Director of IT","IT Manager","VP of Operations","COO","CEO / Founder","CISO","Other"];
const EMP_RANGES = ["1-10","11-50","51-200","201-500","501-1,000","1,001-5,000","5,001-10,000","10,000+"];
const REV_RANGES = ["< $1M","$1M - $5M","$5M - $25M","$25M - $100M","$100M - $500M","$500M+","Prefer not to say"];
const PAIN_POINTS = [
  "Manual processes consuming too many hours",
  "Data scattered across multiple systems",
  "Compliance or governance gaps",
  "Employees resistant to new technology",
  "AI tools deployed but not delivering ROI",
  "No clear AI strategy or roadmap",
  "Difficulty measuring operational efficiency",
  "Cybersecurity or data privacy concerns",
  "Talent shortage or skills gaps",
  "Competitor pressure to adopt AI faster",
];

/* ═══════════════ ARIA SCORE — AI Readiness & Implementation Assessment ═══════════════ */
// 6 dimensions, each 1-5, total 6-30 → 3 complexity tiers → pricing multiplier
const ARIA_REG_INDUSTRIES = ["financial","healthcare","govdef","insurance","legal","energy"]; // regulated
const calcARIA = (intake, domainScores) => {
  // D1: Org Size (employees)
  const empMap = {"1-10":1,"11-50":1,"51-200":2,"201-500":3,"501-1,000":4,"1,001-5,000":4,"5,001-10,000":5,"10,000+":5};
  const d1 = empMap[intake.employees] || 2;
  // D2: Revenue Scale
  const revMap = {"< $1M":1,"$1M - $5M":1,"$5M - $25M":2,"$25M - $100M":3,"$100M - $500M":4,"$500M+":5,"Prefer not to say":2};
  const d2 = revMap[intake.revenue] || 2;
  // D3: Regulatory Exposure (industry + governance score)
  const isReg = ARIA_REG_INDUSTRIES.includes(intake.industry);
  const govScore = domainScores?.governance ?? 50;
  const d3 = isReg ? (govScore < 30 ? 5 : govScore < 50 ? 4 : 3) : (govScore < 30 ? 3 : govScore < 50 ? 2 : 1);
  // D4: Tech Footprint (tech readiness inversely = more complex if low)
  const techScore = domainScores?.tech ?? 50;
  const d4 = techScore < 20 ? 5 : techScore < 40 ? 4 : techScore < 60 ? 3 : techScore < 80 ? 2 : 1;
  // D5: Data Sensitivity (regulated industry + data foundation gaps)
  const dataScore = domainScores?.data ?? 50;
  const d5 = isReg ? (dataScore < 40 ? 5 : dataScore < 60 ? 4 : 3) : (dataScore < 40 ? 3 : dataScore < 60 ? 2 : 1);
  // D6: AI Adoption Scope (use case clarity + strategy maturity)
  const ucScore = domainScores?.usecase ?? 50;
  const stratScore = domainScores?.strategy ?? 50;
  const aiMaturity = (ucScore + stratScore) / 2;
  const d6 = aiMaturity >= 80 ? 5 : aiMaturity >= 60 ? 4 : aiMaturity >= 40 ? 3 : aiMaturity >= 20 ? 2 : 1;

  const total = d1 + d2 + d3 + d4 + d5 + d6;
  const tier = total >= 21 ? "enterprise" : total >= 13 ? "professional" : "standard";
  const mult = tier === "enterprise" ? 3.0 : tier === "professional" ? 1.8 : 1.0;
  const tierLabel = tier === "enterprise" ? "Enterprise" : tier === "professional" ? "Professional" : "Standard";
  const tierColor = tier === "enterprise" ? "#7C3AED" : tier === "professional" ? "#3B82F6" : "#0D9488";

  return {
    dimensions: [
      {name:"Organizational Size",score:d1,max:5},
      {name:"Revenue Scale",score:d2,max:5},
      {name:"Regulatory Exposure",score:d3,max:5},
      {name:"Technical Footprint",score:d4,max:5},
      {name:"Data Sensitivity",score:d5,max:5},
      {name:"AI Adoption Scope",score:d6,max:5},
    ],
    total, tier, mult, tierLabel, tierColor,
    pricing: {
      scan: {base:2500, adjusted:Math.round(2500*mult/100)*100, hours:Math.round(10*mult)},
      sprint: {base:7500, adjusted:Math.round(7500*mult/100)*100, hours:Math.round(30*mult)},
      launchpad: {base:15000, adjusted:Math.round(15000*mult/100)*100, hours:Math.round(60*mult)},
    }
  };
};

function Assessment({id}) {
  const [phase, setPhase] = useState("landing"); // landing, intake, questions, results
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [intake, setIntake] = useState({name:"",email:"",title:"",company:"",industry:"",employees:"",revenue:"",phone:"",pains:[]});
  const [intakeErr, setIntakeErr] = useState("");
  const [startTime, setStartTime] = useState(null); // time gate
  const [companySuggest, setCompanySuggest] = useState("");
  const upI = (k,v) => setIntake(p=>({...p,[k]:v}));
  const togglePain = (p) => setIntake(prev => ({...prev, pains: prev.pains.includes(p) ? prev.pains.filter(x=>x!==p) : prev.pains.length < 3 ? [...prev.pains, p] : prev.pains}));

  const cur = AQ[step], total = 35, answered = Object.keys(ans).length;
  const ds = (di) => { let y=0; for(let q=0;q<5;q++){const v=ans[di+"-"+q]; if(v==="yes")y++; else if(v==="partial")y+=.5} return Math.round((y/5)*100); };
  const overall = () => { let y=0; Object.values(ans).forEach(v=>{if(v==="yes")y++;else if(v==="partial")y+=.5}); return Math.round((y/total)*100); };
  const lvl = (s) => s>=80?{l:"AI-Leading",c:C.teal}:s>=65?{l:"AI-Ready",c:C.blue}:s>=40?{l:"AI-Building",c:C.coral}:{l:"AI-Unready",c:C.rose};
  const indObj = INDUSTRIES.find(i=>i.v===intake.industry) || {l:"your industry",avg:52};

  const getCTA = (s, domains, aria) => {
    const sorted = [...domains].sort((a,b)=>a.score-b.score);
    const low1 = sorted[0], low2 = sorted[1];
    const co = intake.company || "Your organization";
    const domainInsight = (name, score) => {
      if(name==="Data Foundation"&&score<40) return "Gartner reports 85% of AI projects fail due to poor data quality. This is your highest-leverage fix.";
      if(name==="Process Maturity"&&score<40) return "McKinsey found organizations with redesigned workflows are 2x more likely to achieve AI returns.";
      if(name==="People & Culture"&&score<50) return "BCG: AI success is 70% people/culture, only 10% algorithms. Change management is critical.";
      if(name==="Governance & Compliance"&&score<50) return "EY found only 1 in 3 companies have proper AI governance despite broad adoption.";
      if(name==="Technology Readiness"&&score<50) return "Not about buying more tools — it's ensuring your existing stack is configured and AI-ready.";
      if(name==="Strategy & ROI"&&score<50) return "Only 39% report enterprise EBIT impact from AI (McKinsey 2025). A structured strategy changes that.";
      if(name==="Use Case Clarity"&&score<50) return "Start with 1-2 high-impact, low-risk use cases. Breadth kills ROI; depth creates it.";
      return "Targeted improvements here will unlock measurable AI capabilities.";
    };
    const ap = aria.pricing;
    const pkg = s>=80
      ? {name:"AI Launchpad",price:`$${ap.launchpad.adjusted.toLocaleString()}/mo`,hours:`${ap.launchpad.hours} hrs/mo`,what:"Implementation: Copilot Studio agents, custom automations, staff training, monthly optimization reviews.",value:"Avg client sees 87% faster processing, $145K+ annual savings"}
      : s>=65
      ? {name:"AI Readiness Sprint",price:`$${ap.sprint.adjusted.toLocaleString()}`,hours:`${ap.sprint.hours} hrs`,what:`${ap.sprint.hours}-hour engagement: stakeholder interviews, M365/Azure tenant diagnostic, process mapping, 90-day roadmap, executive deck.`,value:"Clients typically identify $50-150K in optimization opportunities in the first audit"}
      : {name:"AI Quick Scan",price:`$${ap.scan.adjusted.toLocaleString()}`,hours:`${ap.scan.hours} hrs`,what:`${ap.scan.hours}-hour engagement: automated tenant diagnostic with our PowerShell scripts on YOUR systems, scored report with actual findings, executive briefing with priority recommendations.`,value:"Moves you from self-reported survey to evidence-based findings from your actual environment"};
    return {low1,low2,domainInsight,pkg,
      honest: s>=80
        ? `${co} scored ${s}% — AI-Leading. Ahead of most ${indObj.l} organizations (industry avg: ${indObj.avg}%). Foundations are strong. Focus on scaling and governance.`
        : s>=65
        ? `${co} scored ${s}% — AI-Ready, above the ${indObj.l} average of ${indObj.avg}%. Gaps in ${low1.name} (${low1.score}%) and ${low2.name} (${low2.score}%) are the last barriers to production deployment.`
        : s>=40
        ? `${co} scored ${s}% — AI-Building. This is ${s>indObj.avg?'above':'below'} the ${indObj.l} average of ${indObj.avg}%. Critical gaps: ${low1.name} (${low1.score}%) and ${low2.name} (${low2.score}%). These two domains drive the majority of AI deployment failures.`
        : `${co} scored ${s}% — AI-Unready. The ${indObj.l} average is ${indObj.avg}%. ${low1.name} (${low1.score}%) and ${low2.name} (${low2.score}%) need foundational work before AI tools will deliver returns.`,
      practical: s>=65
        ? `Organizations that deploy AI into prepared workflows see results in 60-90 days. Companies redesigning workflows first are 2x more likely to achieve enterprise impact (McKinsey 2025).`
        : `42% of companies abandoned most AI initiatives in 2025 — up from 17% prior year (S&P Global) — because they deployed tools before data and processes were ready.`,
    };
  };

  const saveResults = async () => {
    setSaving(true);
    const domains = AQ.map((d,i)=>({name:d.d,score:ds(i)}));
    const dScores = {data:ds(0),process:ds(1),tech:ds(2),people:ds(3),strategy:ds(4),governance:ds(5),usecase:ds(6)};
    const aria = calcARIA(intake, dScores);
    const elapsed = startTime ? Math.round((Date.now() - startTime) / 1000) : 999;
    try {
      await fetch("/api/assessment", {method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({...intake, industryLabel:indObj.l, overallScore:overall(), stage:lvl(overall()).l, domains, rawAnswers:ans,
          ariaScore:aria.total, ariaTier:aria.tierLabel, ariaMult:aria.mult, ariaPricing:aria.pricing,
          timeSpent:elapsed, suspicious:elapsed<60})});
      setSaved(true);
    } catch(e) { console.error(e); setSaved(true); }
    setSaving(false);
  };

  const [discoveryStatus, setDiscoveryStatus] = useState(""); // "", sending, sent, error

  const bookDiscovery = async () => {
    if(discoveryStatus === "sent" || discoveryStatus === "sending") return;
    setDiscoveryStatus("sending");
    const domains = AQ.map((d,i)=>({name:d.d,score:ds(i)}));
    const dScores = {data:ds(0),process:ds(1),tech:ds(2),people:ds(3),strategy:ds(4),governance:ds(5),usecase:ds(6)};
    const aria = calcARIA(intake, dScores);
    const sorted = [...domains].sort((a,b)=>a.score-b.score);
    try {
      const r = await fetch("/api/discovery", {method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          name:intake.name, email:intake.email, phone:intake.phone, company:intake.company,
          title:intake.title, industry:indObj.l, employees:intake.employees, revenue:intake.revenue,
          overallScore:overall(), stage:lvl(overall()).l,
          weakest1:sorted[0]?.name+" ("+sorted[0]?.score+"%)", weakest2:sorted[1]?.name+" ("+sorted[1]?.score+"%)",
          ariaScore:aria.total, ariaTier:aria.tierLabel, ariaMult:aria.mult,
          recPackage:getCTA(overall(), domains, aria).pkg.name,
          recPrice:getCTA(overall(), domains, aria).pkg.price
        })});
      if(r.ok) setDiscoveryStatus("sent");
      else setDiscoveryStatus("error");
    } catch(e) { setDiscoveryStatus("error"); }
  };

  const generatePDF = () => {
    if(!saved) saveResults();
    const s = overall(), lv = lvl(s);
    const domains = AQ.map((d,i)=>({name:d.d,score:ds(i)}));
    const dScores = {data:ds(0),process:ds(1),tech:ds(2),people:ds(3),strategy:ds(4),governance:ds(5),usecase:ds(6)};
    const aria = calcARIA(intake, dScores);
    const cta = getCTA(s, domains, aria);
    const co = intake.company || "Organization";
    const w = window.open('','_blank');
    w.document.write(`<!DOCTYPE html><html><head><title>AI Readiness Report — ${co} — TheBHTLabs</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
      *{margin:0;padding:0;box-sizing:border-box}body{font-family:'Poppins',sans-serif;color:#1C1917;padding:40px;max-width:800px;margin:0 auto}
      @media print{body{padding:20px}button,.no-print{display:none!important}.page-break{page-break-before:always}}
      h1{font-size:26px;font-weight:800;letter-spacing:-0.03em}h2{font-size:17px;font-weight:700;margin:24px 0 12px}
      .card{padding:16px;border-radius:12px;border:1px solid #E2E8F0}
      .insight{font-size:13px;color:#475569;line-height:1.7;margin-bottom:8px}
    </style></head><body>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:12px;border-bottom:2px solid #0D9488">
      <div><h1>${co} — AI Readiness Report</h1>
      <p style="color:#64748B;font-size:12px;margin-top:4px">Prepared for ${intake.name}${intake.title?' · '+intake.title:''} · ${new Date().toLocaleDateString()}</p>
      <p style="color:#94A3B8;font-size:11px">${indObj.l}${intake.employees?' · '+intake.employees+' employees':''}${intake.revenue&&intake.revenue!=='Prefer not to say'?' · '+intake.revenue:''}</p></div>
      <div style="text-align:right"><div style="font-weight:800;font-size:15px;color:#0F172A">TheBHT<span style="color:#0D9488">Labs</span></div>
      <div style="font-size:10px;color:#94A3B8;font-family:'DM Mono',monospace">thebhtlabs.com</div></div>
    </div>
    <div style="display:flex;gap:24px;align-items:center;margin:24px 0;padding:20px;background:#F8FAFC;border-radius:14px">
      <div style="width:100px;height:100px;border-radius:50%;background:${lv.c}11;border:3px solid ${lv.c};display:flex;align-items:center;justify-content:center;flex-direction:column;flex-shrink:0">
        <div style="font-size:32px;font-weight:800;color:${lv.c};font-family:'DM Mono',monospace">${s}%</div>
        <div style="font-size:10px;font-weight:700;color:${lv.c}">${lv.l}</div>
      </div>
      <div style="flex:1">
        <div style="font-size:14px;font-weight:600;color:#0F172A;margin-bottom:6px">Industry Benchmark: ${indObj.l} average is ${indObj.avg}%</div>
        <div style="height:24px;background:#E2E8F0;border-radius:6px;position:relative;overflow:hidden">
          <div style="height:100%;width:${s}%;background:${lv.c};border-radius:6px"></div>
          <div style="position:absolute;left:${indObj.avg}%;top:0;height:100%;width:2px;background:#0F172A"></div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:4px;font-size:10px;color:#94A3B8">
          <span>You: ${s}%</span><span>${indObj.l} avg: ${indObj.avg}%</span>
        </div>
      </div>
    </div>
    <h2>Domain Breakdown</h2>
    ${domains.map(d=>`<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;margin-bottom:3px">
      <span style="font-size:12px;font-weight:600">${d.name}</span>
      <span style="font-size:12px;font-weight:700;color:${d.score>=80?'#0D9488':d.score>=65?'#3B82F6':d.score>=40?'#F97316':'#E11D48'};font-family:'DM Mono',monospace">${d.score}%</span></div>
      <div style="height:16px;background:#F1F5F9;border-radius:4px;overflow:hidden">
      <div style="height:100%;width:${d.score}%;background:${d.score>=80?'#0D9488':d.score>=65?'#3B82F6':d.score>=40?'#F97316':'#E11D48'};border-radius:4px"></div></div></div>`).join('')}
    ${intake.pains.length?`<h2>Business Pains Identified</h2><div style="display:flex;flex-wrap:wrap;gap:6px">${intake.pains.map(p=>`<span style="padding:5px 12px;border-radius:8px;background:#FFF7ED;border:1px solid #FDBA7433;font-size:11px;font-weight:600;color:#9A3412">${p}</span>`).join('')}</div>`:''}
    <h2>ARIA Score — Engagement Complexity</h2>
    <div style="padding:16px;border-radius:12px;background:#F8FAFC;border:1px solid #E2E8F0;margin-bottom:16px">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:12px">
        <div style="width:56px;height:56px;border-radius:50%;background:${aria.tierColor}15;border:2px solid ${aria.tierColor};display:flex;align-items:center;justify-content:center;flex-direction:column;flex-shrink:0">
          <div style="font-size:20px;font-weight:800;color:${aria.tierColor};font-family:'DM Mono',monospace">${aria.total}</div>
          <div style="font-size:7px;font-weight:700;color:${aria.tierColor}">/30</div>
        </div>
        <div>
          <div style="font-size:14px;font-weight:700;color:${aria.tierColor}">${aria.tierLabel} Complexity</div>
          <div style="font-size:11px;color:#64748B">AI Readiness & Implementation Assessment · Pricing multiplier: ${aria.mult}x</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px">
        ${aria.dimensions.map(d=>`<div style="padding:6px 8px;border-radius:6px;background:#fff;border:1px solid #E2E8F0">
          <div style="font-size:9px;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:.5px">${d.name}</div>
          <div style="font-size:14px;font-weight:700;color:#0F172A;font-family:'DM Mono',monospace">${d.score}<span style="font-size:10px;color:#94A3B8">/${d.max}</span></div>
        </div>`).join('')}
      </div>
      <p style="font-size:10px;color:#94A3B8;margin-top:8px;line-height:1.5">ARIA Score determines engagement scope and pricing based on organizational complexity. Dimensions: size, revenue, regulatory exposure, technical footprint, data sensitivity, AI adoption scope. Methodology informed by NIST AI RMF principles and enterprise AI adoption research.</p>
    </div>
    <h2>Priority Gap Analysis</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
    ${[...domains].sort((a,b)=>a.score-b.score).slice(0,3).map((d,i)=>`<div class="card">
      <div style="font-size:10px;font-weight:700;color:#E11D48;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Priority ${i+1}</div>
      <div style="font-size:14px;font-weight:700;margin-bottom:6px">${d.name} · ${d.score}%</div>
      <p style="font-size:11px;color:#64748B;line-height:1.6">${cta.domainInsight(d.name, d.score)}</p></div>`).join('')}
    </div>
    <div class="page-break"></div>
    <h2>The Honest Assessment</h2>
    <div style="padding:20px;border-radius:14px;background:#F8FAFC;border:1px solid #E2E8F0;margin-bottom:16px">
      <p class="insight">${cta.honest}</p><p class="insight">${cta.practical}</p>
    </div>
    <h2>Recommended Next Step</h2>
    <div style="padding:20px;border-radius:14px;background:#F0FDFA;border:1px solid #CCFBF1">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <div><div style="font-size:16px;font-weight:700;color:#0F766E">${cta.pkg.name}</div>
        <div style="font-size:13px;color:#0D9488;font-weight:600;font-family:'DM Mono',monospace">${cta.pkg.price}</div></div></div>
      <p class="insight">${cta.pkg.what}</p>
      <p style="font-size:12px;color:#0F766E;font-weight:600;margin-top:8px;padding:10px;background:#ECFDF5;border-radius:8px">${cta.pkg.value}</p>
      <div style="margin-top:14px;padding:14px;background:#fff;border-radius:10px;border:1px solid #E2E8F0">
        <div style="font-size:14px;font-weight:700;color:#0F172A;margin-bottom:4px">What the free assessment told you vs. what a Quick Scan reveals:</div>
        <table style="width:100%;border-collapse:collapse;font-size:12px;margin-top:8px">
          <tr style="border-bottom:1px solid #eee"><td style="padding:6px;font-weight:600;color:#94A3B8;width:40%"></td><td style="padding:6px;font-weight:700;color:#94A3B8">Free Assessment</td><td style="padding:6px;font-weight:700;color:#0D9488">Quick Scan ($2,500)</td></tr>
          <tr style="border-bottom:1px solid #eee"><td style="padding:6px;font-weight:600">Method</td><td style="padding:6px;color:#64748B">Self-reported survey</td><td style="padding:6px;color:#0F172A">Our scripts on your tenant</td></tr>
          <tr style="border-bottom:1px solid #eee"><td style="padding:6px;font-weight:600">Data Finding</td><td style="padding:6px;color:#64748B">"Data Foundation: ${domains.find(d=>d.name==='Data Foundation')?.score||0}%"</td><td style="padding:6px;color:#0F172A">"14K ungoverned files, 3 DLP gaps, $47K unused licenses"</td></tr>
          <tr><td style="padding:6px;font-weight:600">Deliverable</td><td style="padding:6px;color:#64748B">This PDF</td><td style="padding:6px;color:#0F172A">Evidence-based report + exec briefing</td></tr>
        </table>
      </div>
      <div style="margin-top:14px;padding:14px;background:#fff;border-radius:10px;border:1px solid #E2E8F0">
        <div style="font-size:13px;font-weight:700;color:#0F172A;margin-bottom:4px">The next step costs nothing.</div>
        <p style="font-size:12px;color:#64748B;line-height:1.6">30-minute discovery call. We walk through this report together. No pitch, no commitment.</p>
        <div style="margin-top:8px;font-size:13px;font-weight:700;color:#0D9488">Schedule → thebhtlabs.com · info@bhtsolutions.com · (513) 638-1986</div>
      </div>
    </div>
    <div style="margin-top:20px;padding:16px;background:#F8FAFC;border-radius:12px;border:1px solid #E2E8F0">
      <div style="font-size:11px;font-weight:700;margin-bottom:6px">About BHT Solutions</div>
      <p style="font-size:10px;color:#64748B;line-height:1.5">SBA 8(a) · EDWOSB · WOSB · MS Azure Solutions Architect · CyberAB RP · Wiz Certified · CAGE: 7DBB9 · UEI: ZW6GMVL368J6 · Active clearance, Secret eligible</p>
      <p style="font-size:10px;color:#64748B;line-height:1.5;margin-top:4px">Azure Gov · M365 GCC/GCC-High · CMMC L2 · FedRAMP Advisory · Copilot Studio · Power Platform · AI Governance (NIST RMF)</p>
      <p style="font-size:8px;color:#94A3B8;font-style:italic;margin-top:6px">Results vary. Industry stats from McKinsey (2025), Gartner (2024), S&P Global (2025), EY (2025), BCG (2024). Pricing illustrative.</p>
    </div>
    <div style="text-align:center;margin-top:20px" class="no-print">
      <button onclick="window.print()" style="padding:12px 28px;border-radius:10px;border:none;background:#0D9488;color:#fff;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit">Save as PDF (Ctrl+P)</button>
    </div></body></html>`);
    w.document.close();
  };

  // ═══ LANDING ═══
  if (phase==="landing") return (
    <section id={id} style={{padding:"80px 0",background:C.bgSoft}}>
      <div style={{maxWidth:720,margin:"0 auto",padding:"0 24px",textAlign:"center"}}>
        <SH tag="Takes 5 minutes · Used by 200+ organizations" title="Is your business AI-ready?" desc="7 domains · 35 questions · Personalized report with industry benchmarks, gap analysis, and recommended next step." />
        <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:20,padding:"48px 40px",boxShadow:C.shadowMd}}>
          <div style={{fontSize:48,marginBottom:16}}>◈</div>
          <h3 style={{fontSize:22,fontWeight:800,fontFamily:F.h,color:C.navy,marginBottom:10}}>35-Point AI Readiness Assessment</h3>
          <div style={{display:"flex",justifyContent:"center",gap:16,flexWrap:"wrap",marginBottom:20}}>
            {["Personalized score vs industry peers","Priority gap analysis with cited research","Recommended engagement + pricing","Downloadable PDF for your leadership team"].map(b=>(
              <div key={b} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:C.textMuted,fontFamily:F.b}}>
                <span style={{color:C.teal,fontWeight:800}}>✓</span>{b}
              </div>
            ))}
          </div>
          <p style={{color:C.textFaint,fontSize:11,fontFamily:F.m,marginBottom:24}}>Free · No credit card · Results in 5 minutes · PDF you can share with your board</p>
          <button onClick={()=>setPhase("intake")} style={{padding:"14px 40px",borderRadius:12,cursor:"pointer",fontSize:16,fontWeight:700,fontFamily:F.h,border:"none",background:C.teal,color:"#fff",boxShadow:`0 4px 16px ${C.teal}33`}}>
            Start Assessment →
          </button>
        </div>
      </div>
    </section>
  );

  // ═══ INTAKE FORM ═══
  if (phase==="intake") {
    const DISPOSABLE = /mailinator|guerrillamail|tempmail|throwaway|fakeinbox|yopmail|sharklasers|trashmail|maildrop|dispostable|getnada|10minutemail|temp-mail/i;
    const validate = () => {
      const n = intake.name.trim();
      if(!n) return "Your full name is required";
      if(n.split(/\s+/).length < 2) return "Please enter your full name (first and last)";
      if(n.length < 4) return "Please enter your real name";
      if(/^(test|asdf|aaa|xxx|abc|fake|none|na|n\/a)/i.test(n)) return "Please enter your real name for a personalized report";
      const em = intake.email.trim().toLowerCase();
      if(!em || !em.includes("@") || !em.includes(".")) return "Valid business email required";
      if(em.match(/@(gmail|yahoo|hotmail|outlook|aol|icloud|protonmail|zoho|mail|yandex|live|msn|comcast|att|verizon|cox)\./i)) return "Please use your work email so we can personalize your report to your organization";
      if(DISPOSABLE.test(em)) return "Disposable email addresses are not accepted";
      const domain = em.split("@")[1]?.split(".")[0];
      if(domain && domain.length < 3) return "Please use a valid business email";
      const co = intake.company.trim();
      if(!co) return "Company name is required";
      if(co.length < 2) return "Please enter your real company name";
      if(/^(test|asdf|aaa|xxx|abc|fake|none|na|n\/a|company|my company)/i.test(co)) return "Please enter your real company name for accurate benchmarking";
      if(!intake.industry) return "Select your industry for benchmark comparison";
      if(!intake.employees) return "Select employee range";
      const ph = intake.phone.replace(/\D/g,'');
      if(!ph || ph.length < 10) return "Valid phone number required (10+ digits) — we'll use it to walk through your results";
      return "";
    };
    // Auto-suggest company from email domain
    const onEmailBlur = () => {
      const em = intake.email.trim().toLowerCase();
      if(em.includes("@") && !intake.company.trim()) {
        const domain = em.split("@")[1]?.split(".")[0];
        if(domain && domain.length >= 3 && !/gmail|yahoo|hotmail|outlook|aol/i.test(domain)) {
          const suggested = domain.charAt(0).toUpperCase() + domain.slice(1);
          setCompanySuggest(suggested);
        }
      }
    };
    const acceptSuggest = () => { upI("company", companySuggest); setCompanySuggest(""); };
    const proceed = () => { const err = validate(); if(err){setIntakeErr(err);return;} setIntakeErr(""); setStartTime(Date.now()); setPhase("questions"); };
    const formatPhone = (v) => {
      const d = v.replace(/\D/g,'').slice(0,11);
      if(d.length<=3) return d;
      if(d.length<=6) return `(${d.slice(0,3)}) ${d.slice(3)}`;
      return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
    };
    const inp = {padding:"10px 14px",borderRadius:10,border:`1px solid ${C.border}`,fontSize:13,fontFamily:F.b,outline:"none",width:"100%",background:C.bg,color:C.text};
    const sel = {...inp, cursor:"pointer"};
    const lbl = {fontSize:11,fontWeight:700,fontFamily:F.m,color:C.textFaint,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:4};
    return (
      <section id={id} style={{padding:"80px 0",background:C.bgSoft}}>
        <div style={{maxWidth:640,margin:"0 auto",padding:"0 24px"}}>
          <SH tag="Step 1 of 2 — About You" title="Tell us about your organization" desc="So we can benchmark your results against industry peers and personalize your report." />
          <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:20,padding:"32px",boxShadow:C.shadowMd}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div><label style={lbl}>Full Name *</label>
                <input value={intake.name} onChange={e=>upI("name",e.target.value)} placeholder="Jane Smith" style={inp}/></div>
              <div><label style={lbl}>Business Email *</label>
                <input type="email" value={intake.email} onChange={e=>upI("email",e.target.value)} onBlur={onEmailBlur} placeholder="jane@company.com" style={inp}/></div>
              <div><label style={lbl}>Job Title</label>
                <select value={intake.title} onChange={e=>upI("title",e.target.value)} style={sel}>
                  <option value="">Select title...</option>{JOB_TITLES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
              <div><label style={lbl}>Direct Phone *</label>
                <input type="tel" value={intake.phone} onChange={e=>upI("phone",formatPhone(e.target.value))} placeholder="(555) 123-4567" style={inp}/>
                <span style={{fontSize:9,color:C.textFaint,fontFamily:F.m,marginTop:2,display:"block"}}>For your report walkthrough — we don't cold call</span></div>
              <div style={{position:"relative"}}>
                <label style={lbl}>Company *</label>
                <input value={intake.company} onChange={e=>{upI("company",e.target.value);setCompanySuggest("");}} placeholder="Acme Corp" style={inp}/>
                {companySuggest && !intake.company && (
                  <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:10,marginTop:2}}>
                    <button onClick={acceptSuggest} style={{width:"100%",padding:"8px 14px",borderRadius:8,border:`1px solid ${C.teal}33`,background:C.tealBg,fontSize:12,fontWeight:600,color:C.teal,cursor:"pointer",textAlign:"left",fontFamily:F.h}}>
                      Did you mean <strong>{companySuggest}</strong>?
                    </button>
                  </div>
                )}
              </div>
              <div><label style={lbl}>Industry *</label>
                <select value={intake.industry} onChange={e=>upI("industry",e.target.value)} style={sel}>
                  <option value="">Select industry...</option>{INDUSTRIES.map(i=><option key={i.v} value={i.v}>{i.l}</option>)}</select></div>
              <div><label style={lbl}>Employees *</label>
                <select value={intake.employees} onChange={e=>upI("employees",e.target.value)} style={sel}>
                  <option value="">Select range...</option>{EMP_RANGES.map(r=><option key={r} value={r}>{r}</option>)}</select></div>
              <div><label style={lbl}>Annual Revenue</label>
                <select value={intake.revenue} onChange={e=>upI("revenue",e.target.value)} style={sel}>
                  <option value="">Select range (optional)...</option>{REV_RANGES.map(r=><option key={r} value={r}>{r}</option>)}</select></div>
            </div>
            <div style={{marginTop:20}}>
              <label style={{...lbl,marginBottom:8}}>Top Business Pains (select up to 3)</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {PAIN_POINTS.map(p=>(
                  <button key={p} onClick={()=>togglePain(p)}
                    style={{padding:"7px 14px",borderRadius:8,fontSize:11,fontWeight:600,fontFamily:F.h,cursor:"pointer",transition:"all .15s",
                      background:intake.pains.includes(p)?C.teal+"0D":"transparent",color:intake.pains.includes(p)?C.teal:C.textMuted,
                      border:`1px solid ${intake.pains.includes(p)?C.teal+"33":C.border}`}}>{p}</button>
                ))}
              </div>
            </div>
            {intakeErr && <div style={{marginTop:12,padding:"10px 14px",borderRadius:8,background:C.rose+"08",border:`1px solid ${C.rose}20`}}>
              <p style={{color:C.rose,fontSize:12,fontWeight:600,fontFamily:F.m,margin:0}}>{intakeErr}</p>
            </div>}
            <div style={{marginTop:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <button onClick={()=>setPhase("landing")} style={{padding:"10px 20px",borderRadius:10,border:`1px solid ${C.border}`,background:C.bg,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:F.h,color:C.textMuted}}>← Back</button>
              <button onClick={proceed} style={{padding:"12px 32px",borderRadius:10,border:"none",background:C.teal,color:"#fff",cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:F.h}}>
                Continue to Assessment →
              </button>
            </div>
            <p style={{fontSize:10,color:C.textFaint,fontFamily:F.m,marginTop:12,textAlign:"center"}}>Your data is used only to personalize your report. We don't sell or share your information.</p>
          </div>
        </div>
      </section>
    );
  }

  // ═══ RESULTS ═══
  if (phase==="results") {
    const sc = overall(), lv = lvl(sc);
    const domainResults = AQ.map((d,i)=>({name:d.d,score:ds(i)}));
    const dScores = {data:ds(0),process:ds(1),tech:ds(2),people:ds(3),strategy:ds(4),governance:ds(5),usecase:ds(6)};
    const aria = calcARIA(intake, dScores);
    const cta = getCTA(sc, domainResults, aria);
    const sorted = [...domainResults].sort((a,b)=>a.score-b.score);
    if(!saved && !saving) saveResults(); // auto-save on results view
    return (
      <section id={id} style={{padding:"80px 0",background:C.bgSoft}}>
        <div style={{maxWidth:800,margin:"0 auto",padding:"0 24px"}}>
          <SH tag={`Results for ${intake.company}`} title="AI Readiness Score" />
          <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:20,overflow:"hidden",boxShadow:C.shadowMd}}>
            {/* Score + Industry benchmark */}
            <div style={{padding:"32px 40px",borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:28,flexWrap:"wrap",justifyContent:"center"}}>
                <div style={{textAlign:"center"}}>
                  <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:110,height:110,borderRadius:"50%",background:`conic-gradient(${lv.c} ${sc*3.6}deg, ${C.bgMuted} 0deg)`,position:"relative"}}>
                    <div style={{width:88,height:88,borderRadius:"50%",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
                      <span style={{color:lv.c,fontSize:32,fontWeight:800,fontFamily:F.m}}>{sc}</span>
                      <span style={{color:C.textFaint,fontSize:10,fontFamily:F.m}}>/100</span>
                    </div>
                  </div>
                  <div style={{marginTop:8}}><Tag color={lv.c}>{lv.l}</Tag></div>
                </div>
                <div style={{flex:1,minWidth:240}}>
                  <p style={{fontSize:13,fontWeight:600,color:C.navy,marginBottom:8}}>{intake.company} vs. {indObj.l} average</p>
                  <div style={{position:"relative",height:28,background:C.bgMuted,borderRadius:8,overflow:"visible"}}>
                    <div style={{height:"100%",width:`${sc}%`,background:lv.c,borderRadius:8,transition:"width .6s"}} />
                    <div style={{position:"absolute",left:`${indObj.avg}%`,top:-4,height:36,width:2,background:C.navy,borderRadius:1}} />
                    <span style={{position:"absolute",left:`${indObj.avg}%`,top:-18,transform:"translateX(-50%)",fontSize:9,fontWeight:700,fontFamily:F.m,color:C.navy,whiteSpace:"nowrap"}}>Industry: {indObj.avg}%</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
                    <span style={{fontSize:11,fontWeight:600,color:lv.c,fontFamily:F.m}}>You: {sc}%</span>
                    <span style={{fontSize:11,color:C.textFaint,fontFamily:F.m}}>{sc>=indObj.avg?"Above average":"Below average"}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Domain breakdown */}
            <div style={{padding:28}}>
              <h4 style={{fontSize:13,fontWeight:700,fontFamily:F.m,color:C.textFaint,textTransform:"uppercase",letterSpacing:1,marginBottom:16}}>Domain Breakdown</h4>
              {AQ.map((d,i) => {
                const s = ds(i), c = s>=80?C.teal:s>=65?C.blue:s>=40?C.coral:C.rose;
                return (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"10px 0",borderBottom:i<6?`1px solid ${C.borderLight}`:"none"}}>
                    <span style={{fontSize:14,fontWeight:600,color:C.navy,flex:1,fontFamily:F.h}}>{d.d}</span>
                    <div style={{width:160,height:6,background:C.bgMuted,borderRadius:3,overflow:"hidden"}}>
                      <div style={{width:`${s}%`,height:"100%",borderRadius:3,background:c,transition:"width .6s ease"}} />
                    </div>
                    <span style={{color:c,fontSize:14,fontWeight:700,fontFamily:F.m,width:40,textAlign:"right"}}>{s}%</span>
                  </div>
                );
              })}
              {/* ARIA Score — Engagement Complexity */}
              <div style={{marginTop:24,padding:20,borderRadius:14,background:`${aria.tierColor}05`,border:`1px solid ${aria.tierColor}20`}}>
                <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}>
                  <div style={{width:52,height:52,borderRadius:"50%",background:`${aria.tierColor}12`,border:`2px solid ${aria.tierColor}`,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",flexShrink:0}}>
                    <span style={{fontSize:18,fontWeight:800,color:aria.tierColor,fontFamily:F.m}}>{aria.total}</span>
                    <span style={{fontSize:8,fontWeight:700,color:aria.tierColor}}>/30</span>
                  </div>
                  <div>
                    <h4 style={{fontSize:14,fontWeight:700,fontFamily:F.h,color:aria.tierColor}}>ARIA Score: {aria.tierLabel} Complexity</h4>
                    <p style={{fontSize:11,color:C.textMuted,fontFamily:F.m}}>AI Readiness & Implementation Assessment · Pricing scaled to your environment</p>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
                  {aria.dimensions.map(d=>(
                    <div key={d.name} style={{padding:"6px 8px",borderRadius:8,background:C.bg,border:`1px solid ${C.border}`}}>
                      <div style={{fontSize:9,color:C.textFaint,fontWeight:600,textTransform:"uppercase",letterSpacing:.5,fontFamily:F.m}}>{d.name}</div>
                      <div style={{display:"flex",alignItems:"baseline",gap:2}}>
                        <span style={{fontSize:16,fontWeight:800,color:C.navy,fontFamily:F.m}}>{d.score}</span>
                        <span style={{fontSize:10,color:C.textFaint,fontFamily:F.m}}>/{d.max}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pricing tiers */}
                <div style={{marginTop:12,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                  {[
                    {n:"Quick Scan",p:aria.pricing.scan,h:aria.pricing.scan.hours,rec:sc<65},
                    {n:"Readiness Sprint",p:aria.pricing.sprint,h:aria.pricing.sprint.hours,rec:sc>=65&&sc<80},
                    {n:"Launchpad",p:aria.pricing.launchpad,h:aria.pricing.launchpad.hours,rec:sc>=80,mo:true},
                  ].map(t=>(
                    <div key={t.n} style={{padding:12,borderRadius:10,background:t.rec?C.teal+"08":C.bg,border:`1px solid ${t.rec?C.teal+"30":C.border}`,textAlign:"center"}}>
                      {t.rec && <div style={{fontSize:8,fontWeight:800,color:C.teal,textTransform:"uppercase",letterSpacing:1,marginBottom:4,fontFamily:F.m}}>Recommended</div>}
                      <div style={{fontSize:11,fontWeight:700,color:C.navy,fontFamily:F.h}}>{t.n}</div>
                      <div style={{fontSize:16,fontWeight:800,color:t.rec?C.teal:C.navy,fontFamily:F.m}}>${t.p.adjusted.toLocaleString()}{t.mo?"/mo":""}</div>
                      <div style={{fontSize:10,color:C.textFaint,fontFamily:F.m}}>{t.h} hours</div>
                    </div>
                  ))}
                </div>
                <p style={{fontSize:9,color:C.textFaint,fontFamily:F.m,marginTop:8,lineHeight:1.5}}>Pricing based on ARIA Score ({aria.total}/30, {aria.mult}x multiplier). Final scope confirmed in discovery call. Framework informed by NIST AI RMF principles and enterprise AI adoption research.</p>
              </div>

              {/* Honest Assessment */}
              <div style={{marginTop:24,padding:20,borderRadius:14,background:C.bgSoft,border:`1px solid ${C.border}`}}>
                <h4 style={{fontSize:14,fontWeight:700,fontFamily:F.h,color:C.navy,marginBottom:8}}>The Honest Assessment</h4>
                <p style={{fontSize:13,color:C.textMuted,lineHeight:1.7,marginBottom:8}}>{cta.honest}</p>
                <p style={{fontSize:12,color:C.textSoft,lineHeight:1.7}}>{cta.practical}</p>
              </div>
              {/* Priority Gaps */}
              <div style={{marginTop:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {sorted.slice(0,2).map((d,i)=>(
                  <div key={d.name} style={{padding:16,borderRadius:12,border:`1px solid ${d.score<40?C.rose+"30":C.coral+"30"}`,background:d.score<40?C.rose+"05":C.coral+"05"}}>
                    <div style={{fontSize:10,fontWeight:700,fontFamily:F.m,color:C.rose,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Priority {i+1}</div>
                    <div style={{fontSize:14,fontWeight:700,fontFamily:F.h,color:C.navy,marginBottom:6}}>{d.name} · {d.score}%</div>
                    <p style={{fontSize:11,color:C.textMuted,lineHeight:1.6}}>{cta.domainInsight(d.name, d.score)}</p>
                  </div>
                ))}
              </div>
              {/* Recommended + Value justification */}
              <div style={{marginTop:16,padding:20,borderRadius:14,background:C.tealBg,border:`1px solid ${C.teal}15`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:8}}>
                  <div>
                    <h4 style={{fontSize:14,fontWeight:700,fontFamily:F.h,color:C.tealDark}}>Recommended: {cta.pkg.name}</h4>
                    <span style={{fontSize:13,fontWeight:600,fontFamily:F.m,color:C.teal}}>{cta.pkg.price}</span>
                  </div>
                </div>
                <p style={{fontSize:12,color:C.textMuted,lineHeight:1.7,marginBottom:8}}>{cta.pkg.what}</p>
                <p style={{fontSize:11,fontWeight:600,color:C.tealDark,padding:"8px 12px",background:C.teal+"08",borderRadius:8}}>{cta.pkg.value}</p>
                {/* Free vs Paid comparison */}
                <div style={{marginTop:12,padding:14,borderRadius:10,background:C.bg,border:`1px solid ${C.border}`}}>
                  <p style={{fontSize:12,fontWeight:700,color:C.navy,marginBottom:8}}>What this assessment told you vs. what a Quick Scan reveals:</p>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:0,fontSize:11}}>
                    <div style={{padding:6,fontWeight:700,color:C.textFaint}}></div>
                    <div style={{padding:6,fontWeight:700,color:C.textFaint,borderBottom:`1px solid ${C.border}`}}>Free (this)</div>
                    <div style={{padding:6,fontWeight:700,color:C.teal,borderBottom:`1px solid ${C.border}`}}>Quick Scan</div>
                    <div style={{padding:6,fontWeight:600,borderBottom:`1px solid ${C.borderLight}`}}>Method</div>
                    <div style={{padding:6,color:C.textSoft,borderBottom:`1px solid ${C.borderLight}`}}>Self-reported survey</div>
                    <div style={{padding:6,color:C.navy,fontWeight:600,borderBottom:`1px solid ${C.borderLight}`}}>Our scripts on your systems</div>
                    <div style={{padding:6,fontWeight:600,borderBottom:`1px solid ${C.borderLight}`}}>Finding</div>
                    <div style={{padding:6,color:C.textSoft,borderBottom:`1px solid ${C.borderLight}`}}>"Data Foundation: {domainResults.find(d=>d.name==='Data Foundation')?.score||0}%"</div>
                    <div style={{padding:6,color:C.navy,fontWeight:600,borderBottom:`1px solid ${C.borderLight}`}}>"14K files, 3 DLP gaps, $47K savings"</div>
                    <div style={{padding:6,fontWeight:600}}>Output</div>
                    <div style={{padding:6,color:C.textSoft}}>PDF report</div>
                    <div style={{padding:6,color:C.navy,fontWeight:600}}>Evidence + exec briefing</div>
                  </div>
                </div>
                <div style={{marginTop:12,padding:14,borderRadius:10,background:C.bg,border:`1px solid ${C.border}`}}>
                  <p style={{fontSize:13,fontWeight:700,color:C.navy,marginBottom:4}}>The next step costs nothing.</p>
                  <p style={{fontSize:12,color:C.textSoft,lineHeight:1.6}}>30-minute discovery call. We walk through this report and tell you what we'd prioritize. No pitch.</p>
                </div>
              </div>
              {/* Action buttons */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:16}}>
                <button onClick={()=>{setPhase("landing");setStep(0);setAns({});setSaved(false);}}
                  style={{padding:"10px",borderRadius:10,border:`1px solid ${C.border}`,background:C.bg,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:F.h,color:C.textMuted}}>Retake</button>
                <button onClick={generatePDF}
                  style={{padding:"10px",borderRadius:10,border:"none",background:C.teal,cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:F.h,color:"#fff"}}>📄 Download PDF</button>
                <button onClick={bookDiscovery} disabled={discoveryStatus==="sent"||discoveryStatus==="sending"}
                  style={{padding:"10px",borderRadius:10,border:"none",background:discoveryStatus==="sent"?"#10B981":C.violetBg,cursor:discoveryStatus==="sent"?"default":"pointer",fontSize:13,fontWeight:600,fontFamily:F.h,
                    color:discoveryStatus==="sent"?"#fff":C.violet}}>
                  {discoveryStatus===""?"Book Discovery Call →":discoveryStatus==="sending"?"Sending...":discoveryStatus==="sent"?"✓ Request Sent — Check Email":"Try Again"}
                </button>
              </div>
              <p style={{fontSize:9,color:C.textFaint,fontFamily:F.m,marginTop:12,lineHeight:1.5,fontStyle:"italic"}}>Results vary. Stats from McKinsey (2025), Gartner (2024), S&P Global (2025), EY (2025), BCG (2024). Pricing illustrative.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ═══ QUESTIONS ═══
  return (
    <section id={id} style={{padding:"80px 0",background:C.bgSoft}}>
      <div style={{maxWidth:800,margin:"0 auto",padding:"0 24px"}}>
        <SH tag={`Step 2 of 2 — ${intake.company}`} title="AI Readiness Questions" />
        <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:20,overflow:"hidden",boxShadow:C.shadowMd}}>
          <div style={{padding:"14px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <Tag color={C.teal}>Domain {step+1}/7</Tag>
              <span style={{fontSize:15,fontWeight:700,fontFamily:F.h,color:C.navy}}>{cur.d}</span>
            </div>
            <span style={{color:C.textFaint,fontSize:12,fontFamily:F.m}}>{answered}/{total}</span>
          </div>
          <div style={{height:3,background:C.bgMuted}}>
            <div style={{height:"100%",background:`linear-gradient(90deg,${C.teal},${C.blue})`,width:`${(step/7)*100}%`,transition:"width .3s"}} />
          </div>
          <div style={{padding:"20px 24px"}}>
            {cur.q.map((q, qi) => {
              const val = ans[step+"-"+qi];
              return (
                <div key={qi} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 0",borderBottom:qi<4?`1px solid ${C.borderLight}`:"none",gap:12,flexWrap:"wrap"}}>
                  <span style={{color:C.text,fontSize:14,flex:1,lineHeight:1.5,minWidth:200}}>{q}</span>
                  <div style={{display:"flex",gap:6,flexShrink:0}}>
                    {[{l:"Yes",v:"yes",c:C.teal},{l:"Partial",v:"partial",c:C.coral},{l:"No",v:"no",c:C.rose}].map(o => (
                      <button key={o.v} onClick={()=>setAns(p=>({...p,[step+"-"+qi]:o.v}))}
                        style={{padding:"7px 16px",borderRadius:8,fontSize:12,cursor:"pointer",fontFamily:F.m,fontWeight:600,transition:"all .15s",
                          background:val===o.v?o.c+"12":"transparent",color:val===o.v?o.c:C.textFaint,
                          border:`1px solid ${val===o.v?o.c+"33":"transparent"}`}}>{o.l}</button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{padding:"14px 24px",display:"flex",justifyContent:"space-between",borderTop:`1px solid ${C.border}`}}>
            <button disabled={step===0} onClick={()=>step===0?setPhase("intake"):setStep(step-1)}
              style={{padding:"10px 22px",borderRadius:10,border:`1px solid ${C.border}`,background:C.bg,cursor:step===0?"default":"pointer",fontSize:13,fontWeight:600,fontFamily:F.h,color:C.textMuted,opacity:step===0?.4:1}}>
              ← Back
            </button>
            {step < 6 ? (
              <button onClick={()=>setStep(step+1)}
                style={{padding:"10px 28px",borderRadius:10,border:"none",background:C.teal,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:F.h}}>
                Next Domain →
              </button>
            ) : (
              <button onClick={()=>setPhase("results")}
                style={{padding:"10px 28px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.teal},${C.blue})`,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:F.h}}>
                See My Results →
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ═══════════════ CASE STUDIES — YOUR WORK FIRST ═══════════════ */
function LiveCaseStudies({id, items, loading}) {
  const [open, setOpen] = useState(null);
  const [showIndustry, setShowIndustry] = useState(false);
  const [cases, setCases] = useState([]);
  const [casesLoading, setCasesLoading] = useState(true);

  useEffect(()=>{
    fetch('/api/cases').then(r=>r.json()).then(d=>{setCases(d.cases||[]);setCasesLoading(false)}).catch(()=>setCasesLoading(false));
  },[]);

  return (
    <section id={id} style={{padding:"80px 0",background:C.bg}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px"}}>
        <SH tag="Real Engagements · Verifiable Results" title="What we've built" desc="Not hypotheticals — real implementations with measurable outcomes. Click to expand challenge, solution, and results." />

        {casesLoading ? <p style={{color:C.textFaint,textAlign:"center",padding:40,fontFamily:F.m}}>Loading case studies...</p> :
        <div className="g2" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:20}}>
          {cases.map((c, i) => (
            <div key={c.id} onClick={()=>setOpen(open===c.id?null:c.id)} style={{background:C.bg,border:`1px solid ${open===c.id?c.color+"44":C.border}`,borderRadius:16,overflow:"hidden",cursor:"pointer",transition:"all .2s",boxShadow:open===c.id?C.shadowMd:C.shadow}}>
              <div style={{padding:24}}>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
                  {c.tags.map(t => <Tag key={t} color={c.color}>{t}</Tag>)}
                </div>
                <h3 style={{fontSize:18,fontWeight:700,fontFamily:F.h,color:C.navy,marginBottom:2}}>{c.title}</h3>
                <p style={{color:C.textMuted,fontSize:13,marginBottom:2}}>{c.subtitle}</p>
                <p style={{color:C.textFaint,fontSize:12,fontFamily:F.m}}>{c.client} · {c.industry}</p>
                {c.metrics.length>0 && <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(c.metrics.length,4)},1fr)`,gap:8,marginTop:16}}>
                  {c.metrics.map(m => (
                    <div key={m.label} style={{textAlign:"center",padding:"10px 4px",borderRadius:10,background:c.color+"06"}}>
                      <div style={{color:c.color,fontSize:18,fontWeight:800,fontFamily:F.m,lineHeight:1}}>{m.value}</div>
                      <div style={{color:C.textFaint,fontSize:10,fontFamily:F.m,marginTop:4}}>{m.label}</div>
                    </div>
                  ))}
                </div>}
              </div>
              {open === c.id && (
                <div style={{padding:"0 24px 24px",borderTop:`1px solid ${C.borderLight}`,paddingTop:16}}>
                  {c.challenge && <p style={{color:C.textSoft,fontSize:13,lineHeight:1.7,marginBottom:8}}><strong style={{color:C.navy}}>Challenge: </strong>{c.challenge}</p>}
                  {c.solution && <p style={{color:C.textSoft,fontSize:13,lineHeight:1.7,marginBottom:8}}><strong style={{color:C.navy}}>Solution: </strong>{c.solution}</p>}
                  {c.results && <p style={{color:C.textSoft,fontSize:13,lineHeight:1.7,marginBottom:14}}><strong style={{color:C.navy}}>Results: </strong>{c.results}</p>}
                  {c.pdf_path && <a href={c.pdf_path} target="_blank" rel="noopener" onClick={e=>e.stopPropagation()}
                    style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:10,background:c.color+"0D",color:c.color,fontSize:13,fontWeight:700,fontFamily:F.m,border:`1px solid ${c.color}22`,textDecoration:"none"}}>
                    📄 Download Case Study PDF ↗
                  </a>}
                </div>
              )}
            </div>
          ))}
        </div>}

        {/* INDUSTRY AI NEWS — RSS powered */}
        <div style={{marginTop:56}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div>
              <h3 style={{fontSize:20,fontWeight:800,fontFamily:F.h,color:C.navy}}>AI in the Wild</h3>
              <p style={{color:C.textMuted,fontSize:13}}>Curated industry case studies and implementations — from HBR, McKinsey, Google Cloud, AWS, and Microsoft.</p>
            </div>
            <button onClick={()=>setShowIndustry(!showIndustry)} style={{padding:"8px 18px",borderRadius:10,border:`1px solid ${C.border}`,background:C.bg,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:F.h,color:C.textMuted,flexShrink:0}}>
              {showIndustry ? "Hide" : `Show ${items.length || 0} stories`}
            </button>
          </div>
          {showIndustry && (loading ? (
            <p style={{color:C.textFaint,fontSize:13,fontFamily:F.m,animation:"pulse 1.5s infinite",padding:20,textAlign:"center"}}>Loading live feeds...</p>
          ) : items.length > 0 ? (
            <div className="g2" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
              {items.filter((v,i,a)=>a.findIndex(t=>t.title===v.title)===i).slice(0,8).map((c,i) => (
                <a key={i} href={c.link} target="_blank" rel="noopener" style={{display:"flex",gap:12,padding:16,borderRadius:12,background:C.bgSoft,border:`1px solid ${C.borderLight}`,textDecoration:"none",color:"inherit",transition:"all .15s"}}>
                  <div style={{width:3,borderRadius:2,background:c.color,flexShrink:0}} />
                  <div style={{minWidth:0}}>
                    <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
                      <Tag color={c.color}>{c.cat}</Tag>
                      <span style={{color:C.textFaint,fontSize:10,fontFamily:F.m}}>{c.dateFmt}</span>
                    </div>
                    <h4 style={{fontSize:13,fontWeight:700,fontFamily:F.h,color:C.navy,lineHeight:1.35,marginBottom:2}}>{c.title}</h4>
                    <span style={{color:C.textFaint,fontSize:10,fontFamily:F.m}}>{c.source} ↗</span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p style={{color:C.textFaint,fontSize:13,textAlign:"center",padding:20}}>No industry stories loaded yet. Refresh to try again.</p>
          ))}
        </div>
      </div>
    </section>
  );
}
/* ═══════════════ AI POLICY GENERATOR — The $10K tool, free ═══════════════ */
function PolicyGenerator({id}) {
  const [inputs, setInputs] = useState({size:"",industry:"",tools:"",concerns:[]});
  const [policy, setPolicy] = useState(null);
  const set = (k,v) => setInputs(p=>({...p,[k]:v}));
  const toggle = (c) => setInputs(p=>({...p,concerns:p.concerns.includes(c)?p.concerns.filter(x=>x!==c):[...p.concerns,c]}));

  const generate = () => {
    const {size,industry,concerns} = inputs;
    const co = size || "[Your Company]";
    const ind = industry || "technology";
    const hasHIPAA = concerns.includes("HIPAA") || ind.toLowerCase().includes("health");
    const hasCMMC = concerns.includes("CMMC") || ind.toLowerCase().includes("defense");
    const hasPII = concerns.includes("PII");
    const hasSOX = concerns.includes("SOX") || ind.toLowerCase().includes("financ");

    const doc = `AI ACCEPTABLE USE POLICY
${co} · Effective: ${new Date().toLocaleDateString()}
Industry: ${ind}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. PURPOSE
This policy governs the acceptable use of artificial intelligence (AI) tools by all employees, contractors, and third-party partners of ${co}. It establishes guidelines to maximize AI's productivity benefits while managing risks to data security, compliance, and organizational reputation.

2. SCOPE
Applies to all AI tools including but not limited to: generative AI (ChatGPT, Claude, Gemini, Copilot), AI-powered automation (Power Automate, Copilot Studio), AI analytics, and any third-party AI services accessed through company devices or accounts.

3. APPROVED AI TOOLS
Tier 1 (Unrestricted for business use):
• Microsoft 365 Copilot (within licensed tenant)
• Microsoft Copilot Studio (approved agents only)
• Power Automate AI Builder
${hasCMMC?'• Azure Government Cloud AI services (GCC-High approved)':'• Azure OpenAI Service (enterprise tenant)'}

Tier 2 (Permitted with restrictions — no sensitive data):
• ChatGPT (via business/enterprise account only)
• Claude (via Anthropic business account)
• Gemini (via Google Workspace enterprise)

Tier 3 (Prohibited — not approved for any business use):
• Free-tier or personal accounts of any AI service
• Open-source AI models on personal hardware
• Any AI tool not listed in Tier 1 or 2

4. PROHIBITED USES
Employees must NOT use AI tools to:
• Process, input, or analyze ${hasHIPAA?'Protected Health Information (PHI), ':''}${hasPII?'Personally Identifiable Information (PII), ':''}${hasCMMC?'Controlled Unclassified Information (CUI), ':''}${hasSOX?'non-public financial data, ':''}or any data classified as Confidential or above
• Generate official communications without human review and approval
• Make autonomous decisions affecting employment, credit, or legal outcomes
• Create deepfakes, misleading content, or impersonate individuals
• Bypass security controls, access restrictions, or compliance requirements
• Share proprietary business logic, source code, or trade secrets

5. DATA CLASSIFICATION BEFORE AI USE
Before using any AI tool, employees must classify data according to:
□ Public — safe for any AI tool (Tier 1, 2, or 3)
□ Internal — Tier 1 tools only, within company tenant
□ Confidential — Tier 1 tools only, with manager approval
□ Restricted — NO AI processing permitted
${hasHIPAA?'\n□ PHI — NO AI processing unless tool has BAA on file':''}
${hasCMMC?'\n□ CUI — ONLY Azure Government (GCC-High) AI services':''}

6. REVIEW & APPROVAL PROCESS
• All AI-generated content for external use must be reviewed by a human before distribution
• AI agents deployed in production require approval from IT and the relevant department head
• New AI tool requests must be submitted to IT for security review (allow 5 business days)
• AI-generated code must pass standard code review process before deployment

7. TRAINING REQUIREMENTS
• All employees: Complete AI Awareness training within 30 days of hire/policy effective date
• AI tool users: Complete tool-specific training before access is provisioned
• Managers: Complete AI governance training annually
• IT staff: Complete AI security and compliance training quarterly

8. INCIDENT REPORTING
Report immediately to IT Security if:
• Sensitive data was inadvertently shared with an AI tool
• AI output contains potentially harmful, biased, or inaccurate information used in a decision
• An AI tool behaves unexpectedly or produces concerning outputs
• A data breach or unauthorized access involving AI systems is suspected

Report to: [IT Security Team Email] · Response SLA: 4 hours for data incidents

9. ANNUAL REVIEW
This policy will be reviewed and updated at minimum annually, or whenever:
• New AI tools are adopted or existing tools are deprecated
• Regulatory requirements change${hasCMMC?' (CMMC assessment cycle)':''}${hasHIPAA?' (HIPAA audit cycle)':''}
• A significant AI-related incident occurs
• Industry best practices evolve materially

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated by TheBHTLabs · thebhtlabs.com
This is a starting template. Consult legal counsel before finalizing.
CAGE: 7DBB9 · info@bhtsolutions.com`;

    setPolicy(doc);
  };

  return (
    <section id={id} style={{padding:"80px 0",background:C.bg}}>
      <div style={{maxWidth:900,margin:"0 auto",padding:"0 24px"}}>
        <SH tag="Consultants charge $5-10K for this" title="AI Policy Generator" desc="Get a ready-to-customize AI Acceptable Use Policy in 30 seconds. Tailored to your industry and compliance needs. Free." />
        <div style={{display:"grid",gridTemplateColumns:policy?"1fr 1fr":"1fr",gap:24}} className="g2">
          <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:18,padding:28,boxShadow:C.shadowMd}}>
            <h3 style={{fontSize:16,fontWeight:700,fontFamily:F.h,color:C.navy,marginBottom:20}}>Your organization</h3>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div>
                <label style={{fontSize:12,fontWeight:600,fontFamily:F.m,color:C.textMuted,marginBottom:4,display:"block"}}>Company / Org name</label>
                <input value={inputs.size} onChange={e=>set("size",e.target.value)} placeholder="Acme Corp"
                  style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`1px solid ${C.border}`,fontSize:14,fontFamily:F.b}} />
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:600,fontFamily:F.m,color:C.textMuted,marginBottom:4,display:"block"}}>Industry</label>
                <select value={inputs.industry} onChange={e=>set("industry",e.target.value)}
                  style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`1px solid ${C.border}`,fontSize:14,fontFamily:F.b,background:C.bg}}>
                  {["Select...","Healthcare","Defense / GovCon","Financial Services","Legal","Technology","Manufacturing","Energy","Education","Retail","Other"].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:600,fontFamily:F.m,color:C.textMuted,marginBottom:6,display:"block"}}>Compliance requirements (select all)</label>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {["HIPAA","CMMC","PII","SOX","FedRAMP","GDPR","State AI Laws"].map(c=>(
                    <button key={c} onClick={()=>toggle(c)} style={{padding:"6px 14px",borderRadius:8,fontSize:12,fontWeight:600,fontFamily:F.m,cursor:"pointer",
                      background:inputs.concerns.includes(c)?C.tealBg:C.bgSoft,color:inputs.concerns.includes(c)?C.tealDark:C.textMuted,
                      border:`1px solid ${inputs.concerns.includes(c)?C.teal+"33":C.border}`}}>{c}</button>
                  ))}
                </div>
              </div>
              <button onClick={generate} style={{padding:"14px",borderRadius:12,border:"none",cursor:"pointer",fontSize:15,fontWeight:700,fontFamily:F.h,background:C.teal,color:"#fff",boxShadow:`0 4px 16px ${C.teal}33`,marginTop:4}}>
                Generate My Policy →
              </button>
            </div>
          </div>
          {policy && (
            <div style={{background:C.bg,border:`1.5px solid ${C.teal}22`,borderRadius:18,overflow:"hidden",boxShadow:C.shadowMd,display:"flex",flexDirection:"column"}}>
              <div style={{padding:"12px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:12,fontWeight:700,fontFamily:F.m,color:C.teal}}>YOUR AI POLICY DRAFT</span>
                <button onClick={()=>{navigator.clipboard?.writeText(policy)}} style={{padding:"5px 14px",borderRadius:8,border:`1px solid ${C.border}`,background:C.bg,cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:F.m,color:C.textMuted}}>
                  📋 Copy All
                </button>
              </div>
              <div style={{flex:1,padding:20,overflow:"auto",maxHeight:500,fontFamily:F.m,fontSize:12,color:C.textSoft,lineHeight:1.7,whiteSpace:"pre-wrap"}}>
                {policy}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ COMPLIANCE COUNTDOWN — Nobody aggregates this ═══════════════ */
function ComplianceCountdown() {
  const deadlines = [
    {name:"CMMC 2.0 — Phase 1 Enforcement",date:"2025-12-16",cat:"Defense",color:C.teal,desc:"Self-assessments required for Level 1. New DoD contracts will require CMMC."},
    {name:"EU AI Act — Prohibited AI Practices",date:"2025-02-02",cat:"Global",color:C.violet,desc:"Ban on social scoring, real-time biometric surveillance, and manipulative AI."},
    {name:"EU AI Act — Full High-Risk Compliance",date:"2026-08-02",cat:"Global",color:C.violet,desc:"Full obligations for high-risk AI systems including conformity assessments."},
    {name:"CMMC 2.0 — Phase 2 (C3PAO Assessments)",date:"2026-12-16",cat:"Defense",color:C.teal,desc:"Third-party assessments required for Level 2 certification."},
    {name:"NIST AI RMF — Updated Guidelines",date:"2026-03-01",cat:"Federal",color:C.blue,desc:"Expected updates incorporating agentic AI governance and privacy frameworks."},
    {name:"CMMC 2.0 — Phase 3 (Full Enforcement)",date:"2027-12-16",cat:"Defense",color:C.teal,desc:"Level 3 assessments by DIBCAC. All DoD contracts require appropriate CMMC level."},
    {name:"Federal AI Budget — $3.5B+",date:"2026-10-01",cat:"Federal",color:C.blue,desc:"FY2026 federal AI R&D budget projected to exceed $3.5 billion."},
  ];
  const now = Date.now();
  const active = deadlines.map(d=>({...d,daysLeft:Math.ceil((new Date(d.date)-now)/86400000)})).sort((a,b)=>a.daysLeft-b.daysLeft);

  return (
    <section style={{padding:"48px 0",background:C.bgSoft}}>
      <div style={{maxWidth:1000,margin:"0 auto",padding:"0 24px"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <span style={{fontSize:12,fontWeight:700,fontFamily:F.m,color:C.rose,textTransform:"uppercase",letterSpacing:2}}>⏱ COMPLIANCE COUNTDOWN</span>
          <h3 style={{fontSize:22,fontWeight:800,fontFamily:F.h,color:C.navy,marginTop:6}}>Key deadlines you can't miss</h3>
        </div>
        <div style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:8}}>
          {active.map((d,i)=>(
            <div key={i} style={{minWidth:220,padding:18,borderRadius:14,background:C.bg,border:`1px solid ${d.daysLeft<=90?d.color+"33":C.border}`,boxShadow:d.daysLeft<=90?`0 0 12px ${d.color}11`:C.shadow,flexShrink:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <Tag color={d.color}>{d.cat}</Tag>
                <span style={{fontSize:18,fontWeight:800,fontFamily:F.m,color:d.daysLeft<=0?C.rose:d.daysLeft<=90?C.coral:d.daysLeft<=180?C.blue:C.textFaint}}>
                  {d.daysLeft<=0?"PAST DUE":d.daysLeft+"d"}
                </span>
              </div>
              <h4 style={{fontSize:13,fontWeight:700,fontFamily:F.h,color:C.navy,lineHeight:1.3,marginBottom:4}}>{d.name}</h4>
              <p style={{fontSize:11,color:C.textFaint,lineHeight:1.5}}>{d.desc}</p>
              <div style={{fontSize:10,fontFamily:F.m,color:C.textFaint,marginTop:6}}>{new Date(d.date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Packages({id}) {
  return (
    <section id={id} style={{padding:"80px 0",background:C.bgSoft}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px"}}>
        <SH tag="Transparent Pricing" title="Choose your AI journey" desc="Start small, prove value, scale with confidence. No lock-ins." />
        <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
          {PKGS.map((p, i) => (
            <div key={i} style={{background:C.bg,border:`1px solid ${p.pop?p.color+"33":C.border}`,borderRadius:18,padding:28,position:"relative",display:"flex",flexDirection:"column",boxShadow:p.pop?C.shadowMd:C.shadow,transition:"all .2s"}}>
              {p.pop && <div style={{position:"absolute",top:-1,left:"50%",transform:"translateX(-50%)",padding:"4px 16px",borderRadius:"0 0 10px 10px",background:p.color,color:"#fff",fontSize:11,fontWeight:700,fontFamily:F.m}}>MOST POPULAR</div>}
              <Tag color={p.color}>{p.name}</Tag>
              <div style={{marginTop:16,marginBottom:8}}>
                <span style={{fontSize:32,fontWeight:800,fontFamily:F.m,color:C.navy}}>{p.price}</span>
                <span style={{color:C.textFaint,fontSize:13,fontFamily:F.m}}>{p.per}</span>
              </div>
              <p style={{color:C.textMuted,fontSize:13,lineHeight:1.6,marginBottom:20}}>{p.desc}</p>
              <div style={{display:"flex",flexDirection:"column",gap:8,flex:1}}>
                {p.feats.map(f => (
                  <div key={f} style={{display:"flex",alignItems:"flex-start",gap:8}}>
                    <span style={{color:p.color,fontSize:12,marginTop:2,flexShrink:0}}>✓</span>
                    <span style={{color:C.textSoft,fontSize:13,lineHeight:1.5}}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={()=>document.getElementById("partner")?.scrollIntoView({behavior:"smooth"})}
                style={{marginTop:20,width:"100%",padding:"12px",borderRadius:12,cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:F.h,transition:"all .2s",textAlign:"center",
                  background:p.pop?p.color:"transparent",color:p.pop?"#fff":p.color,border:p.pop?"none":`1.5px solid ${p.color}33`,
                  boxShadow:p.pop?`0 4px 12px ${p.color}22`:"none"}}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ LEARNING — REAL RESOURCES, NOT EMPTY PROMISES ═══════════════ */
function Learning({id}) {
  const tracks = [
    {title:"AI for Business Leaders",level:"Start Here",dur:"Self-paced",color:C.teal,
      desc:"You don't need to code. You need to decide. Understand what AI can and can't do, evaluate vendors without the hype, and make smart bets.",
      resources:[
        {t:"Microsoft AI Business School",u:"https://learn.microsoft.com/en-us/training/topics/ai-business-school",free:true},
        {t:"Harvard CS50: Intro to AI",u:"https://pll.harvard.edu/course/cs50s-introduction-artificial-intelligence-python",free:true},
        {t:"Google AI Essentials",u:"https://grow.google/ai-essentials/",free:true},
      ],
      stat:"84% of C-suite leaders view AI as critical for competitiveness — PwC 2025"},
    {title:"Copilot & Automation Mastery",level:"Hands-On",dur:"6 weeks",color:C.blue,
      desc:"Build production agents. M365 Copilot, Copilot Studio, Power Automate — the Microsoft AI stack end to end. This is what we deploy for clients.",
      resources:[
        {t:"Copilot Studio Docs",u:"https://learn.microsoft.com/en-us/microsoft-copilot-studio/",free:true},
        {t:"Power Automate Learning Path",u:"https://learn.microsoft.com/en-us/training/powerplatform/power-automate",free:true},
        {t:"MS-4009: Copilot Cert",u:"https://learn.microsoft.com/en-us/credentials/certifications/exams/ms-4009/",free:false},
      ],
      stat:"29% of hiring managers exclusively hire AI-proficient candidates"},
    {title:"AI Governance & Compliance",level:"Advanced",dur:"8 weeks",color:C.violet,
      desc:"NIST AI RMF, EU AI Act, state regulations, policy development. For CISOs, compliance officers, and anyone who owns risk.",
      resources:[
        {t:"NIST AI Risk Management Framework",u:"https://www.nist.gov/artificial-intelligence/executive-order-safe-secure-and-trustworthy-artificial-intelligence",free:true},
        {t:"CISA AI Security Guide",u:"https://www.cisa.gov/ai",free:true},
        {t:"EU AI Act Explorer",u:"https://artificialintelligenceact.eu/",free:true},
      ],
      stat:"Federal AI use cases doubled to 1,110 in 2024 — GAO"},
    {title:"Prompt Engineering & AI Tools",level:"All Levels",dur:"Self-paced",color:C.coral,
      desc:"Stop getting mediocre outputs. Master Claude, ChatGPT, Copilot, and multi-tool workflows. This is the skill that 10x's everything else.",
      resources:[
        {t:"Anthropic Prompt Engineering",u:"https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview",free:true},
        {t:"OpenAI Prompt Guide",u:"https://platform.openai.com/docs/guides/prompt-engineering",free:true},
        {t:"DeepLearning.AI: ChatGPT Course",u:"https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/",free:true},
      ],
      stat:"3-6 months of consistent practice makes candidates job-ready"},
  ];
  return (
    <section id={id} style={{padding:"80px 0",background:C.bg}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px"}}>
        <SH tag="Free Resources · Real Skills · No BS" title="Upskill or get left behind." desc="Every resource linked here is real and most are free. We curated the best so you don't waste time on garbage courses." />
        <div className="g2" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:20}}>
          {tracks.map((t, i) => (
            <div key={i} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:16,padding:28,boxShadow:C.shadow}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <h3 style={{fontSize:18,fontWeight:700,fontFamily:F.h,color:C.navy}}>{t.title}</h3>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                <Tag color={t.color}>{t.level}</Tag>
                <Tag color={C.textFaint}>{t.dur}</Tag>
              </div>
              <p style={{color:C.textMuted,fontSize:14,lineHeight:1.6,marginBottom:16}}>{t.desc}</p>
              {/* Real linked resources */}
              <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14}}>
                {t.resources.map(r=>(
                  <a key={r.t} href={r.u} target="_blank" rel="noopener"
                    style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",borderRadius:8,background:C.bgSoft,border:`1px solid ${C.borderLight}`,textDecoration:"none",fontSize:13,color:C.navy,fontWeight:600,fontFamily:F.h}}>
                    <span>{r.t}</span>
                    <span style={{fontSize:10,fontFamily:F.m,color:r.free?C.teal:C.coral,fontWeight:700}}>{r.free?"FREE":"PAID"} ↗</span>
                  </a>
                ))}
              </div>
              <div style={{padding:"10px 14px",borderRadius:10,background:t.color+"06",border:`1px solid ${t.color}10`}}>
                <p style={{color:t.color,fontSize:12,fontWeight:600,fontFamily:F.m}}>📊 {t.stat}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ═══════════════ AI ROI CALCULATOR — The signature tool ═══════════════ */
function ROICalculator({id}) {
  const [inputs, setInputs] = useState({industry:"",teamSize:10,hoursWasted:15,avgSalary:65000,tasks:""});
  const [result, setResult] = useState(null);
  const set = (k,v) => setInputs(p=>({...p,[k]:v}));

  const calculate = () => {
    const {teamSize,hoursWasted,avgSalary} = inputs;
    const hourlyRate = avgSalary / 2080;
    const weeklyWaste = teamSize * hoursWasted * hourlyRate;
    const annualWaste = weeklyWaste * 50;
    const aiSavings = annualWaste * 0.55; // AI typically automates 40-70%
    const implCost = teamSize < 20 ? 7500 : teamSize < 100 ? 25000 : 75000;
    const monthlySubscription = teamSize * 30; // ~$30/user/mo for Copilot
    const annualToolCost = monthlySubscription * 12;
    const netSavings = aiSavings - annualToolCost - implCost;
    const breakEvenMonths = Math.ceil(implCost / ((aiSavings - annualToolCost) / 12));
    const fteEquivalent = (teamSize * hoursWasted * 0.55 / 40).toFixed(1);
    setResult({
      annualWaste: Math.round(annualWaste),
      aiSavings: Math.round(aiSavings),
      implCost, annualToolCost: Math.round(annualToolCost),
      netSavings: Math.round(netSavings),
      breakEvenMonths: Math.max(1, breakEvenMonths),
      fteEquivalent,
      hourlyRate: Math.round(hourlyRate),
      weeklyHoursRecovered: Math.round(teamSize * hoursWasted * 0.55),
    });
  };

  const fmt = (n) => "$" + Math.abs(n).toLocaleString();

  return (
    <section id={id} style={{padding:"80px 0",background:C.bgSoft}}>
      <div style={{maxWidth:900,margin:"0 auto",padding:"0 24px"}}>
        <SH tag="Interactive · Instant · Free" title="AI ROI Calculator" desc="Stop guessing. Enter your numbers and see exactly what AI automation would save your organization. Share the results with your boss." />
        <div style={{display:"grid",gridTemplateColumns:result?"1fr 1fr":"1fr",gap:24}} className="g2">
          {/* Input side */}
          <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:18,padding:28,boxShadow:C.shadowMd}}>
            <h3 style={{fontSize:16,fontWeight:700,fontFamily:F.h,color:C.navy,marginBottom:20}}>Your numbers</h3>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <div>
                <label style={{fontSize:12,fontWeight:600,fontFamily:F.m,color:C.textMuted,marginBottom:4,display:"block"}}>Industry</label>
                <select value={inputs.industry} onChange={e=>set("industry",e.target.value)}
                  style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`1px solid ${C.border}`,fontSize:14,fontFamily:F.b,background:C.bg}}>
                  {["Select your industry...","Healthcare","Defense / GovCon","Financial Services","Logistics / Supply Chain","Technology / SaaS","Manufacturing","Energy / Oil & Gas","Legal","Real Estate","Education","Retail","Other"].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:600,fontFamily:F.m,color:C.textMuted,marginBottom:4,display:"block"}}>Team size (people doing repetitive work)</label>
                <input type="number" value={inputs.teamSize} onChange={e=>set("teamSize",+e.target.value)}
                  style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`1px solid ${C.border}`,fontSize:14,fontFamily:F.b}} />
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:600,fontFamily:F.m,color:C.textMuted,marginBottom:4,display:"block"}}>Hours/week each person spends on repetitive tasks</label>
                <input type="range" min={1} max={40} value={inputs.hoursWasted} onChange={e=>set("hoursWasted",+e.target.value)}
                  style={{width:"100%"}} />
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontFamily:F.m,color:C.textFaint}}>
                  <span>1 hr</span><span style={{fontWeight:700,color:C.teal,fontSize:14}}>{inputs.hoursWasted} hrs/week</span><span>40 hrs</span>
                </div>
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:600,fontFamily:F.m,color:C.textMuted,marginBottom:4,display:"block"}}>Average annual salary</label>
                <input type="number" value={inputs.avgSalary} onChange={e=>set("avgSalary",+e.target.value)} step={5000}
                  style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`1px solid ${C.border}`,fontSize:14,fontFamily:F.b}} />
              </div>
              <button onClick={calculate} style={{padding:"14px",borderRadius:12,border:"none",cursor:"pointer",fontSize:15,fontWeight:700,fontFamily:F.h,background:C.teal,color:"#fff",boxShadow:`0 4px 16px ${C.teal}33`}}>
                Calculate My ROI →
              </button>
            </div>
          </div>

          {/* Results side */}
          {result && (
            <div style={{background:C.bg,border:`1.5px solid ${C.teal}22`,borderRadius:18,padding:28,boxShadow:C.shadowMd}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:C.teal,boxShadow:`0 0 8px ${C.teal}`}} />
                <span style={{fontSize:12,fontWeight:700,fontFamily:F.m,color:C.teal}}>YOUR AI ROI ANALYSIS</span>
              </div>
              {/* Hero stat */}
              <div style={{textAlign:"center",padding:20,borderRadius:14,background:`linear-gradient(135deg,${C.tealBg},${C.teal}08)`,marginBottom:16}}>
                <div style={{fontSize:11,fontFamily:F.m,color:C.textFaint,textTransform:"uppercase",letterSpacing:1}}>Net Annual Savings</div>
                <div style={{fontSize:40,fontWeight:800,fontFamily:F.m,color:result.netSavings>0?C.teal:C.rose,letterSpacing:"-0.02em"}}>{fmt(result.netSavings)}</div>
                <div style={{fontSize:13,color:C.textMuted}}>per year after implementation costs</div>
              </div>
              {/* Metrics grid */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                {[
                  {l:"Current waste",v:fmt(result.annualWaste)+"/yr",c:C.rose},
                  {l:"AI recovers",v:fmt(result.aiSavings)+"/yr",c:C.teal},
                  {l:"Break-even",v:result.breakEvenMonths+" months",c:C.blue},
                  {l:"FTEs equivalent",v:result.fteEquivalent+" people",c:C.violet},
                  {l:"Hours recovered",v:result.weeklyHoursRecovered+"/week",c:C.teal},
                  {l:"Implementation",v:fmt(result.implCost)+" one-time",c:C.textFaint},
                ].map(m=>(
                  <div key={m.l} style={{padding:12,borderRadius:10,background:C.bgSoft}}>
                    <div style={{fontSize:10,fontFamily:F.m,color:C.textFaint,textTransform:"uppercase",letterSpacing:0.5}}>{m.l}</div>
                    <div style={{fontSize:16,fontWeight:700,fontFamily:F.m,color:m.c,marginTop:2}}>{m.v}</div>
                  </div>
                ))}
              </div>
              {/* CTA */}
              <div style={{padding:"14px 16px",borderRadius:12,background:C.tealBg,border:`1px solid ${C.teal}15`,textAlign:"center"}}>
                <p style={{fontSize:13,color:C.tealDark,fontWeight:600,fontFamily:F.m,marginBottom:6}}>Want the full analysis?</p>
                <button onClick={()=>document.getElementById("assess")?.scrollIntoView({behavior:"smooth"})}
                  style={{padding:"10px 24px",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:F.h,background:C.teal,color:"#fff"}}>
                  Take the 35-Point Assessment →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ "AM I GETTING REPLACED?" — Viral career tool ═══════════════ */
function AIRiskChecker() {
  const [role, setRole] = useState("");
  const [result, setResult] = useState(null);

  const roles = {
    "accountant":{risk:6,timeline:"2-4 years",safe:["Complex tax strategy","Client advisory","Forensic accounting","Compliance judgment"],threatened:["Data entry","Basic bookkeeping","Standard tax prep","Routine reconciliation"],skills:["AI-assisted audit tools","Data analytics","Advisory consulting","Prompt engineering for financial analysis"],verdict:"Routine accounting is being automated fast. But complex advisory, judgment calls, and client relationships? AI makes you MORE valuable if you level up."},
    "project manager":{risk:4,timeline:"3-5 years",safe:["Stakeholder management","Risk judgment","Team leadership","Political navigation"],threatened:["Status reporting","Schedule tracking","Resource allocation math","Meeting scheduling"],skills:["AI project tools (Copilot, Asana AI)","Data-driven decision making","Prompt engineering","Change management for AI adoption"],verdict:"PM is fundamentally a people job. AI handles the tracking and reporting — freeing you for the strategic work that actually matters. Embrace it."},
    "software developer":{risk:5,timeline:"1-3 years",safe:["System architecture","Complex debugging","Business logic design","Code review judgment"],threatened:["Boilerplate code","Unit test writing","Documentation","Simple CRUD apps"],skills:["AI-assisted coding (Copilot, Cursor)","Prompt engineering for code","AI agent development","Architecture for AI systems"],verdict:"Junior dev tasks are getting automated. Senior dev tasks are getting amplified. The gap between developers who use AI and those who don't will be 10x in 2 years."},
    "marketing manager":{risk:5,timeline:"1-2 years",safe:["Brand strategy","Customer insight","Campaign strategy","Relationship building"],threatened:["Content drafting","Social media posts","Basic analytics","Email sequences"],skills:["AI content tools","Data analytics","Prompt engineering for marketing","AI-powered personalization"],verdict:"Content creation is already AI-assisted. Strategy and customer understanding? Still irreplaceably human. Learn the tools or get outpaced by someone who did."},
    "lawyer":{risk:3,timeline:"5-7 years",safe:["Courtroom advocacy","Client counseling","Complex negotiation","Legal strategy"],threatened:["Document review","Contract analysis","Legal research","Routine drafting"],skills:["AI legal research tools","Contract AI platforms","Prompt engineering for legal","AI governance expertise"],verdict:"AI is transforming legal research and document review. But judgment, advocacy, and counsel? Deeply human. Lawyers who use AI will replace lawyers who don't."},
    "nurse":{risk:2,timeline:"7+ years",safe:["Patient care","Clinical judgment","Emotional support","Emergency response"],threatened:["Documentation","Scheduling","Routine monitoring","Admin paperwork"],skills:["AI-assisted diagnostics","Health informatics","Telehealth technology","AI documentation tools"],verdict:"Healthcare is one of the safest fields. AI handles paperwork so you can focus on patients. The human element in nursing is irreplaceable."},
    "data analyst":{risk:7,timeline:"1-2 years",safe:["Business context","Stakeholder communication","Insight storytelling","Strategic recommendations"],threatened:["SQL queries","Dashboard building","Routine reporting","Data cleaning"],skills:["AI analytics (Copilot, Claude)","Advanced visualization","Business strategy","AI model interpretation"],verdict:"The most impacted role on this list. AI can already write SQL, build dashboards, and generate insights. Your survival skill? Knowing which questions to ask and translating data into business action."},
    "hr manager":{risk:4,timeline:"3-5 years",safe:["Employee relations","Culture building","Complex negotiations","Strategic workforce planning"],threatened:["Resume screening","Benefits admin","Policy FAQ","Onboarding logistics"],skills:["AI recruiting tools","People analytics","AI policy development","Change management"],verdict:"Transactional HR is being automated. Strategic HR — culture, development, organizational design — becomes more important as AI transforms how people work."},
    "sales representative":{risk:4,timeline:"2-4 years",safe:["Relationship building","Complex negotiations","Account strategy","Enterprise deals"],threatened:["Cold outreach","CRM updates","Lead qualification","Follow-up emails"],skills:["AI sales tools (Gong, Outreach)","Data-driven prospecting","Prompt engineering for outreach","AI-powered deal analysis"],verdict:"Transactional sales are shrinking. Consultative, relationship-based sales are growing. AI handles the grunt work — you handle the human connection."},
    "executive assistant":{risk:7,timeline:"1-3 years",safe:["Executive relationship","Judgment calls","Complex coordination","Confidential matters"],threatened:["Scheduling","Email drafting","Travel booking","Meeting notes"],skills:["AI productivity tools","Copilot mastery","Prompt engineering","AI workflow automation"],verdict:"The most immediately impacted role. Copilot already does scheduling, drafting, and summarizing. The EAs who survive will be strategic partners, not task managers."},
  };

  const check = () => {
    const key = role.toLowerCase().trim();
    const match = Object.entries(roles).find(([k]) => key.includes(k) || k.includes(key));
    if (match) { setResult({role:role,...match[1]}); }
    else { setResult({role,risk:5,timeline:"2-4 years",safe:["Domain expertise","Client relationships","Creative problem-solving","Strategic thinking"],threatened:["Routine tasks","Data processing","Standard reporting","Repetitive workflows"],skills:["AI tools for your field","Prompt engineering","Data literacy","Automation fundamentals"],verdict:"We don't have specific data for this role yet, but the pattern is universal: routine tasks get automated, judgment and relationships don't. The professionals who learn AI tools will replace those who refuse to."}); }
  };

  return (
    <section style={{padding:"60px 0",background:C.bg}}>
      <div style={{maxWidth:800,margin:"0 auto",padding:"0 24px"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <span style={{fontSize:28}}>🤖</span>
          <h2 style={{fontSize:24,fontWeight:800,fontFamily:F.h,color:C.navy,marginTop:8}}>Am I getting replaced?</h2>
          <p style={{color:C.textMuted,fontSize:14}}>Enter your job title. Get an honest answer.</p>
        </div>
        <div style={{display:"flex",gap:10,maxWidth:480,margin:"0 auto",marginBottom:24}}>
          <input value={role} onChange={e=>setRole(e.target.value)} onKeyDown={e=>e.key==="Enter"&&check()} placeholder="e.g. Data Analyst, Project Manager, Nurse..."
            style={{flex:1,padding:"12px 16px",borderRadius:12,border:`1px solid ${C.border}`,fontSize:14,fontFamily:F.b,outline:"none"}} />
          <button onClick={check} disabled={!role.trim()} style={{padding:"12px 24px",borderRadius:12,border:"none",cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:F.h,
            background:role.trim()?C.teal:C.bgMuted,color:role.trim()?"#fff":C.textFaint}}>Check →</button>
        </div>
        {result && (
          <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:18,overflow:"hidden",boxShadow:C.shadowMd}}>
            {/* Risk meter */}
            <div style={{padding:24,textAlign:"center",background:`linear-gradient(135deg,${result.risk>=7?C.rose:result.risk>=5?C.coral:C.teal}06,${C.bgSoft})`}}>
              <div style={{fontSize:12,fontFamily:F.m,color:C.textFaint,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>AI Automation Risk</div>
              <div style={{display:"flex",justifyContent:"center",gap:4,marginBottom:8}}>
                {Array.from({length:10}).map((_,i)=>(
                  <div key={i} style={{width:24,height:24,borderRadius:4,background:i<result.risk?(result.risk>=7?C.rose:result.risk>=5?C.coral:C.teal):C.bgMuted,transition:"all .3s",transitionDelay:`${i*50}ms`}} />
                ))}
              </div>
              <div style={{fontSize:20,fontWeight:800,fontFamily:F.m,color:result.risk>=7?C.rose:result.risk>=5?C.coral:C.teal}}>{result.risk}/10</div>
              <div style={{fontSize:12,color:C.textFaint,fontFamily:F.m}}>Estimated timeline: {result.timeline}</div>
            </div>
            {/* Details */}
            <div style={{padding:24}}>
              <p style={{fontSize:14,color:C.textSoft,lineHeight:1.7,marginBottom:20,fontStyle:"italic",borderLeft:`3px solid ${C.teal}`,paddingLeft:14}}>
                {result.verdict}
              </p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}} className="g2">
                <div>
                  <h4 style={{fontSize:12,fontWeight:700,fontFamily:F.m,color:C.teal,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>✅ Safe (AI can't do this)</h4>
                  {result.safe.map(s=><div key={s} style={{fontSize:13,color:C.textSoft,padding:"4px 0",borderBottom:`1px solid ${C.borderLight}`}}>{s}</div>)}
                </div>
                <div>
                  <h4 style={{fontSize:12,fontWeight:700,fontFamily:F.m,color:C.rose,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>⚠️ At risk</h4>
                  {result.threatened.map(s=><div key={s} style={{fontSize:13,color:C.textSoft,padding:"4px 0",borderBottom:`1px solid ${C.borderLight}`}}>{s}</div>)}
                </div>
              </div>
              <div style={{marginTop:20}}>
                <h4 style={{fontSize:12,fontWeight:700,fontFamily:F.m,color:C.blue,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>🎯 Skills to learn NOW</h4>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {result.skills.map(s=>(
                    <span key={s} style={{padding:"6px 12px",borderRadius:8,background:C.tealBg,color:C.tealDark,fontSize:12,fontWeight:600,fontFamily:F.m,border:`1px solid ${C.teal}15`}}>{s}</span>
                  ))}
                </div>
              </div>
              <button onClick={()=>document.getElementById("learn")?.scrollIntoView({behavior:"smooth"})}
                style={{marginTop:16,width:"100%",padding:"12px",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:F.h,background:C.teal,color:"#fff"}}>
                Start upskilling now →
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════ RADAR — AI Intelligence Feed (tight, tactical) ═══════════════ */
function Radar({id, items, status}) {
  const [filter, setFilter] = useState("All");
  const unique = items.filter((v,i,a) => a.findIndex(t => t.title === v.title) === i);
  const cats = ["All", ...new Set(unique.map(n => n.cat))];
  const filtered = filter === "All" ? unique : unique.filter(n => n.cat === filter);

  return (
    <section id={id} style={{padding:"80px 0",background:C.bgSoft}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,marginBottom:10}}>
            {status.live && <div style={{width:8,height:8,borderRadius:"50%",background:C.teal,boxShadow:`0 0 8px ${C.teal}`}} />}
            <span style={{fontSize:12,fontWeight:700,fontFamily:F.m,color:C.teal,textTransform:"uppercase",letterSpacing:2}}>
              {status.live ? `RADAR · ${status.count} FEEDS · LIVE` : "RADAR · LOADING"}
            </span>
          </div>
          <h2 style={{fontSize:28,fontWeight:800,fontFamily:F.h,color:C.navy,lineHeight:1.15,letterSpacing:"-0.02em"}}>
            We read {status.count || 16} sources so you don't have to.
          </h2>
        </div>
        {/* Category filter */}
        {cats.length > 2 && <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap",marginBottom:24}}>
          {cats.map(c => (
            <button key={c} onClick={()=>setFilter(c)} style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${filter===c?C.teal+"44":C.border}`,
              background:filter===c?C.tealBg:C.bg,color:filter===c?C.tealDark:C.textMuted,fontSize:12,fontWeight:600,fontFamily:F.h,cursor:"pointer"}}>{c}</button>
          ))}
        </div>}
        {status.loading ? (
          <div style={{textAlign:"center",padding:48}}>
            <p style={{color:C.textFaint,fontSize:14,fontFamily:F.m,animation:"pulse 1.5s infinite"}}>Scanning feeds...</p>
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}} className="g3">
            {filtered.slice(0, 12).map((n, i) => (
              <a key={i} href={n.link} target="_blank" rel="noopener"
                style={{display:"block",padding:16,borderRadius:12,background:C.bg,border:`1px solid ${C.border}`,textDecoration:"none",color:"inherit",transition:"all .15s",boxShadow:C.shadow}}>
                <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:6}}>
                  <Tag color={n.color}>{n.cat}</Tag>
                  <span style={{color:C.textFaint,fontSize:10,fontFamily:F.m}}>{n.dateFmt}</span>
                </div>
                <h4 style={{fontSize:13,fontWeight:700,fontFamily:F.h,color:C.navy,lineHeight:1.35,overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{n.title}</h4>
                <span style={{color:C.textFaint,fontSize:10,fontFamily:F.m,marginTop:6,display:"inline-block"}}>{n.source} ↗</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════ OPS DASHBOARD — Mission Control ═══════════════ */
function OpsDashboard({status, newsCount, caseCount}) {
  const [uptime] = useState(()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')} local`});
  return (
    <section style={{padding:"40px 0",background:C.bg}}>
      <div style={{maxWidth:1000,margin:"0 auto",padding:"0 24px"}}>
        <div style={{background:C.bgSoft,border:`1px solid ${C.border}`,borderRadius:16,padding:"20px 28px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:status.live?C.teal:C.textFaint,boxShadow:status.live?`0 0 10px ${C.teal}`:"none"}} />
              <div>
                <span style={{fontSize:12,fontWeight:700,fontFamily:F.m,color:C.navy,textTransform:"uppercase",letterSpacing:1}}>THEBHTLABS OPS</span>
                <div style={{fontSize:10,fontFamily:F.m,color:C.textFaint}}>All systems operational · {uptime}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
              {[
                {l:"Feeds active",v:status.count||"...",c:status.live?C.teal:C.textFaint},
                {l:"Articles processed",v:newsCount||"...",c:C.blue},
                {l:"Case studies tracked",v:caseCount||"...",c:C.violet},
                {l:"Assessment engine",v:"Online",c:C.teal},
                {l:"Chat AI",v:"Active",c:C.teal},
              ].map(s=>(
                <div key={s.l} style={{textAlign:"center"}}>
                  <div style={{fontSize:16,fontWeight:800,fontFamily:F.m,color:s.c}}>{s.v}</div>
                  <div style={{fontSize:9,fontFamily:F.m,color:C.textFaint,textTransform:"uppercase",letterSpacing:0.5}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
/* ═══════════════ PARTNER / CONTACT ═══════════════ */
function Partner({id}) {
  const [form, setForm] = useState({name:"",email:"",phone:"",company:"",interest:"",message:"",website:""});
  const [status, setStatus] = useState("");
  const [touched, setTouched] = useState({});
  const markTouched = (k) => setTouched(p=>({...p,[k]:true}));
  const isValid = (k) => { if(k==="email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form[k]); return form[k].trim().length>0; };
  const inputStyle = (k, req) => ({
    padding:"12px 16px",borderRadius:10,fontSize:14,fontFamily:F.b,outline:"none",transition:"border-color .2s, box-shadow .2s",
    border:`1.5px solid ${touched[k]&&req&&!isValid(k)?C.rose:C.border}`,
    boxShadow:touched[k]&&req&&!isValid(k)?`0 0 0 3px ${C.rose}15`:"none",
    background:C.bg
  });
  const labelStyle = {fontSize:12,fontWeight:600,fontFamily:F.h,color:C.textMuted,marginBottom:4,display:"block"};
  const submit = async (e) => {
    e.preventDefault();
    setTouched({name:true,email:true,message:true});
    if(!form.name.trim()||!form.email.trim()||!form.message.trim()){setStatus("fill");return}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)){setStatus("email");return}
    setStatus("sending");
    try {
      const r = await fetch("/api/contact", {method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify(form)});
      if(r.ok){setStatus("success");setForm({name:"",email:"",phone:"",company:"",interest:"",message:"",website:""});setTouched({});}
      else {const d=await r.json().catch(()=>({}));setStatus("error");console.error("Contact API error:",d);}
    } catch(e) {setStatus("error");console.error("Contact fetch error:",e);}
  };
  const cards = [
    {icon:"◈",t:"Hire Us",d:"AI, cloud, security expertise. 2-week sprints to 12-month engagements. Cleared resources.",c:C.teal},
    {icon:"⬡",t:"Partner",d:"Prime contractors: SBA 8(a), EDWOSB, WOSB certified. Cleared resources. Let's team.",c:C.violet},
    {icon:"△",t:"Assess",d:"35-point AI evaluation. Cloud readiness. Security posture. Executive briefing.",c:C.blue},
    {icon:"○",t:"Train",d:"Custom AI, cloud, security training for 5-200 people. In-person or virtual.",c:C.coral},
  ];
  return (
    <section id={id} style={{padding:"80px 0",background:C.bgSoft}}>
      <div style={{maxWidth:1000,margin:"0 auto",padding:"0 24px"}}>
        <SH tag="Let's Build Together" title="Partner with TheBHTLabs" desc="Whether you're a 5-person startup or defense prime — we meet you where you are." />
        <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
          <form onSubmit={submit} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:18,padding:28,boxShadow:C.shadowMd}}>
            <h3 style={{fontSize:20,fontWeight:700,fontFamily:F.h,color:C.navy,marginBottom:20}}>Get in touch</h3>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {[{l:"Full Name",p:"Your full name",k:"name",req:true},{l:"Email Address",p:"you@company.com",k:"email",req:true},{l:"Phone",p:"(555) 123-4567",k:"phone",req:false},{l:"Company",p:"Company name (optional)",k:"company",req:false}].map(f=>(
                <div key={f.k}>
                  <label style={labelStyle}>{f.l} {f.req&&<span style={{color:C.rose}}>*</span>}</label>
                  <input value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})} onBlur={()=>f.req&&markTouched(f.k)}
                    placeholder={f.p} required={f.req}
                    style={{...inputStyle(f.k,f.req),width:"100%",boxSizing:"border-box"}} />
                  {touched[f.k]&&f.req&&!isValid(f.k)&&<span style={{fontSize:11,color:C.rose,marginTop:2,display:"block"}}>{f.k==="email"?"Please enter a valid email":"This field is required"}</span>}
                </div>
              ))}
              <div>
                <label style={labelStyle}>I'm interested in</label>
                <select value={form.interest} onChange={e=>setForm({...form,interest:e.target.value})}
                  style={{...inputStyle("interest",false),width:"100%",boxSizing:"border-box",color:form.interest&&form.interest!=="I'm interested in..."?C.text:C.textFaint,cursor:"pointer"}}>
                  {["I'm interested in...","AI Readiness Assessment","Copilot Studio / Automation","CMMC / Compliance","AI Upskilling / Training","Partnership / Subcontracting","Hiring BHT","Just Exploring"].map(o=>(
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Tell us about your project <span style={{color:C.rose}}>*</span></label>
                <textarea rows={6} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} onBlur={()=>markTouched("message")}
                  placeholder="Describe your project, goals, timeline, or any questions you have. The more detail you share, the better we can help..."
                  required
                  style={{...inputStyle("message",true),width:"100%",boxSizing:"border-box",resize:"vertical",minHeight:120,lineHeight:1.6}} />
                {touched.message&&!isValid("message")&&<span style={{fontSize:11,color:C.rose,marginTop:2,display:"block"}}>Please describe your project</span>}
              </div>
              {/* Honeypot — hidden from humans, bots fill it */}
              <div style={{position:'absolute',left:'-9999px',opacity:0,height:0,overflow:'hidden'}} aria-hidden="true">
                <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={e=>setForm({...form,website:e.target.value})} />
              </div>
              <button type="submit" disabled={status==="sending"}
                style={{padding:"14px",borderRadius:12,border:"none",cursor:status==="sending"?"wait":"pointer",fontSize:15,fontWeight:700,fontFamily:F.h,
                  background:status==="sending"?C.textMuted:C.teal,color:"#fff",boxShadow:`0 4px 14px ${C.teal}22`,textAlign:"center",transition:"background .2s",marginTop:4}}>
                {status==="sending" ? "Sending..." : "Book a Discovery Call →"}
              </button>
              {status===""&&<p style={{color:C.textFaint,fontSize:11,fontFamily:F.m,marginTop:8,textAlign:"center"}}>We respond within 1 business day. 30-min call, no pitch, no commitment.</p>}
              {status==="success"&&<div style={{textAlign:"center",color:C.teal,fontSize:14,fontWeight:600,padding:"10px 16px",background:C.teal+"0A",borderRadius:10,border:`1px solid ${C.teal}20`}}>✓ Sent! We'll respond within 24 hours.</div>}
              {status==="fill"&&<p style={{textAlign:"center",color:C.rose,fontSize:13}}>Please fill in all required fields.</p>}
              {status==="email"&&<p style={{textAlign:"center",color:C.rose,fontSize:13}}>Please enter a valid email address.</p>}
              {status==="error"&&<div style={{textAlign:"center",fontSize:13}}>
                <p style={{color:C.rose,marginBottom:4}}>Something went wrong.</p>
                <p style={{color:C.textMuted}}>Email us directly at <a href="mailto:info@bhtsolutions.com" style={{color:C.teal,fontWeight:600}}>info@bhtsolutions.com</a></p>
              </div>}
            </div>
          </form>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {cards.map(c => (
              <div key={c.t} style={{display:"flex",gap:16,padding:20,borderRadius:14,background:C.bg,border:`1px solid ${C.border}`,boxShadow:C.shadow}}>
                <div style={{width:40,height:40,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:c.c+"0A",color:c.c,fontSize:18,flexShrink:0}}>{c.icon}</div>
                <div>
                  <h4 style={{fontSize:15,fontWeight:700,fontFamily:F.h,color:C.navy,marginBottom:3}}>{c.t}</h4>
                  <p style={{color:C.textMuted,fontSize:13,lineHeight:1.6}}>{c.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ PROOF BAR ═══════════════ */
function ProofBar() {
  const stats = [
    {v:"20+",l:"Years Experience"},{v:"7DBB9",l:"CAGE Code"},{v:"9",l:"Certifications"},{v:"SBA 8(a)",l:"Set-Aside Eligible"},
    {v:"34+",l:"Enterprise Clients"},{v:"11+",l:"NAICS Codes"},{v:"CyberAB",l:"Registered Practitioner"},{v:"20+",l:"Years Enterprise IT"},
  ];
  return (
    <section style={{padding:"48px 0",borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,background:C.bg}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px",display:"flex",justifyContent:"center",gap:40,flexWrap:"wrap"}}>
        {stats.map(s => (
          <div key={s.l} style={{textAlign:"center"}}>
            <div style={{color:C.teal,fontSize:22,fontWeight:800,fontFamily:F.m}}>{s.v}</div>
            <div style={{color:C.textFaint,fontSize:10,marginTop:3,textTransform:"uppercase",letterSpacing:1,fontFamily:F.m}}>{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════ THE BUILDER — Musk-style founder credibility ═══════════════ */
function TheBuilder({id}) {
  const [showNaics, setShowNaics] = useState(false);
  const [showCreds, setShowCreds] = useState(false);
  const naics = [
    {c:"541512",d:"Computer Systems Design Services (Primary)"},{c:"541511",d:"Custom Computer Programming Services"},
    {c:"541513",d:"Computer Facilities Management Services"},{c:"541519",d:"Other Computer Related Services"},
    {c:"541611",d:"Admin & General Management Consulting"},{c:"541330",d:"Engineering Services"},
    {c:"541614",d:"Process & Logistics Consulting"},{c:"541618",d:"Other Management Consulting Services"},
    {c:"541690",d:"Scientific & Technical Consulting"},{c:"519190",d:"All Other Information Services"},
    {c:"611420",d:"Computer Training"},
  ];
  const timeline = [
    {y:"2004",t:"Started building enterprise systems at scale — Microsoft stack from day one"},
    {y:"2008",t:"Led architecture for Fortune 500 clients: bp, Eli Lilly, GE Power, Kroger"},
    {y:"2014",t:"Moved into federal IT — Azure Gov, GCC-High, classified environments"},
    {y:"2019",t:"Founded BHT Solutions — SBA 8(a), EDWOSB, WOSB certified"},
    {y:"2023",t:"API Bluewave Supplier Development Program Graduate"},
    {y:"2024",t:"TX ITSAC Contract Holder (DIR-CPO-5626) · Launched TheBHTLabs"},
    {y:"2025",t:"Building AI agents, governance frameworks, and the tools you see on this site"},
  ];
  return (
    <section id={id} style={{padding:"100px 0",background:C.bg}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px"}}>

        {/* Header — Not "About Us". This is a statement. */}
        <div style={{textAlign:"center",marginBottom:60}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:20,background:C.navy+"08",border:`1px solid ${C.navy}12`,marginBottom:16}}>
            <span style={{fontSize:12,fontWeight:700,fontFamily:F.m,color:C.navy,letterSpacing:".5px"}}>THE BUILDER</span>
          </div>
          <h2 style={{fontSize:"clamp(28px,3.5vw,40px)",fontWeight:800,fontFamily:F.h,color:C.navy,lineHeight:1.1,letterSpacing:"-0.03em"}}>
            Every tool on this site was built by someone<br/>who spent 20 years inside the systems it assesses.
          </h2>
        </div>

        {/* Founder card — the centerpiece */}
        <div style={{display:"grid",gridTemplateColumns:"340px 1fr",gap:40,alignItems:"start"}} className="g2">

          {/* Left: Photo + identity */}
          <div>
            <div style={{background:C.bgSoft,border:`1px solid ${C.border}`,borderRadius:20,overflow:"hidden",boxShadow:C.shadowMd}}>
              {/* Photo — uses LinkedIn profile image via proxy, or placeholder */}
              <div style={{width:"100%",aspectRatio:"1/1",background:`linear-gradient(135deg,${C.navy} 0%,${C.tealDark} 100%)`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                <img
                  src="/nitin-pro.jpg"
                  alt="Nitin Nagar — Founder, BHT Solutions"
                  style={{width:"100%",height:"100%",objectFit:"cover"}}
                />
              </div>
              <div style={{padding:24,textAlign:"center"}}>
                <h3 style={{fontSize:22,fontWeight:800,fontFamily:F.h,color:C.navy,marginBottom:2}}>Nitin Nagar</h3>
                <p style={{color:C.teal,fontSize:13,fontWeight:700,fontFamily:F.m,marginBottom:12}}>Founder & Principal Architect</p>
                <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:16}}>
                  {["Cleared","20+ Years","SBA 8(a)"].map(t=>(
                    <span key={t} style={{padding:"4px 10px",borderRadius:8,background:C.teal+"0A",border:`1px solid ${C.teal}15`,fontSize:11,fontWeight:700,fontFamily:F.m,color:C.tealDark}}>{t}</span>
                  ))}
                </div>
                <a href="https://www.linkedin.com/in/nitin-nagar-22004b4/" target="_blank" rel="noopener noreferrer"
                  style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"12px 24px",borderRadius:12,background:C.navy,color:"#fff",fontSize:14,fontWeight:700,fontFamily:F.h,textDecoration:"none",boxShadow:`0 4px 16px ${C.navy}22`,transition:"all .2s",width:"100%"}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Connect on LinkedIn
                </a>
              </div>
            </div>

            {/* Quick stats */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:12}}>
              {[{v:"7DBB9",l:"CAGE"},{v:"ZW6GMVL368J6",l:"UEI"},{v:"9",l:"Certifications"},{v:"11",l:"NAICS Codes"}].map(s=>(
                <div key={s.l} style={{textAlign:"center",padding:12,borderRadius:10,background:C.bgSoft,border:`1px solid ${C.borderLight}`}}>
                  <div style={{color:C.teal,fontSize:16,fontWeight:800,fontFamily:F.m}}>{s.v}</div>
                  <div style={{color:C.textFaint,fontSize:9,fontFamily:F.m,textTransform:"uppercase",letterSpacing:1,marginTop:2}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: The story + proof */}
          <div>
            {/* The narrative — not a bio, a manifesto */}
            <div style={{marginBottom:32}}>
              <p style={{fontSize:18,lineHeight:1.8,color:C.text,fontFamily:F.b,marginBottom:16}}>
                Most consulting firms hand you a PowerPoint and disappear. We thought that was broken, so we built something different.
              </p>
              <p style={{fontSize:15,lineHeight:1.8,color:C.textSoft,fontFamily:F.b,marginBottom:16}}>
                TheBHTLabs is the R&D arm of <strong style={{color:C.navy}}>Bluebery Hawaii Technology Solutions</strong>. Every assessment, calculator, policy generator, and compliance tracker on this site exists because we got tired of watching organizations spend six figures on consulting engagements that could have started with a free diagnostic.
              </p>
              <p style={{fontSize:15,lineHeight:1.8,color:C.textSoft,fontFamily:F.b,marginBottom:16}}>
                The tools here aren't demos. They're the same frameworks we deploy for defense contractors, federal agencies, and Fortune 500 companies — just made available to everyone. Our philosophy: if a tool can be automated, it should be free. If it requires human judgment, that's where we come in.
              </p>
              <p style={{fontSize:15,lineHeight:1.8,color:C.textSoft,fontFamily:F.b}}>
                We specialize in the hard stuff — Azure Government Cloud, GCC-High migrations, CMMC Level 2 certification, AI governance for regulated industries. The kind of work where getting it wrong means losing your clearance, not just your budget.
              </p>
            </div>

            {/* Timeline — proof of work, not claims */}
            <div style={{marginBottom:28}}>
              <h4 style={{fontSize:12,fontWeight:700,fontFamily:F.m,color:C.textFaint,textTransform:"uppercase",letterSpacing:1.5,marginBottom:16}}>The Journey</h4>
              <div style={{borderLeft:`2px solid ${C.teal}22`,paddingLeft:20,display:"flex",flexDirection:"column",gap:0}}>
                {timeline.map((e,i)=>(
                  <div key={i} style={{position:"relative",paddingBottom:i<timeline.length-1?16:0}}>
                    <div style={{position:"absolute",left:-26,top:4,width:10,height:10,borderRadius:"50%",background:i===timeline.length-1?C.teal:C.bg,border:`2px solid ${C.teal}`,boxShadow:i===timeline.length-1?`0 0 0 4px ${C.teal}15`:""}} />
                    <div style={{display:"flex",gap:12,alignItems:"baseline"}}>
                      <span style={{fontSize:13,fontWeight:800,fontFamily:F.m,color:C.teal,flexShrink:0,width:40}}>{e.y}</span>
                      <span style={{fontSize:14,color:C.textSoft,lineHeight:1.5}}>{e.t}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Past performance — names that matter */}
            <div style={{marginBottom:24}}>
              <h4 style={{fontSize:12,fontWeight:700,fontFamily:F.m,color:C.textFaint,textTransform:"uppercase",letterSpacing:1.5,marginBottom:12}}>Built Systems For</h4>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {CLIENTS.filter((v,i,a)=>a.findIndex(t=>t.n===v.n)===i).map(c=>(
                  <a key={c.n} href={c.u} target="_blank" rel="noopener" title={c.cat}
                    style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:10,background:C.navy+"06",border:`1px solid ${C.navy}0A`,fontSize:12,fontWeight:600,fontFamily:F.h,color:C.navy,textDecoration:"none",transition:"all .15s"}}
                    onMouseEnter={e=>{e.currentTarget.style.background=C.teal+"0D";e.currentTarget.style.borderColor=C.teal+"22"}}
                    onMouseLeave={e=>{e.currentTarget.style.background=C.navy+"06";e.currentTarget.style.borderColor=C.navy+"0A"}}>
                    <div style={{width:12,height:12,borderRadius:3,background:(c.cc||C.teal)+"20",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span style={{fontSize:7,fontWeight:800,color:c.cc||C.teal,fontFamily:F.m}}>{c.n.replace(/^U\.S\.\s/,"").charAt(0)}</span>
                    </div>
                    {c.n}
                  </a>
                ))}
              </div>
            </div>

            {/* Certifications + NAICS — expandable */}
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
              <button onClick={()=>setShowCreds(!showCreds)}
                style={{padding:"8px 16px",borderRadius:10,border:`1px solid ${C.border}`,background:C.bg,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:F.m,color:C.textMuted,transition:"all .15s"}}>
                {showCreds?"Hide":"Show"} 9 Certifications
              </button>
              <button onClick={()=>setShowNaics(!showNaics)}
                style={{padding:"8px 16px",borderRadius:10,border:`1px solid ${C.border}`,background:C.bg,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:F.m,color:C.textMuted,transition:"all .15s"}}>
                {showNaics?"Hide":"Show"} 11 NAICS Codes
              </button>
              <a href="https://bhtsolutions.com/capability-statement/" target="_blank" rel="noopener"
                style={{display:"inline-flex",alignItems:"center",gap:4,padding:"8px 16px",borderRadius:10,background:C.teal+"0A",border:`1px solid ${C.teal}15`,fontSize:12,fontWeight:700,fontFamily:F.m,color:C.tealDark,textDecoration:"none"}}>
                Full Capability Statement ↗
              </a>
            </div>
            {showCreds && <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:16,animation:"fadeUp .3s ease"}} className="g2">
              {[
                {l:"SBA 8(a)",d:"Small Business Administration"},{l:"EDWOSB",d:"Econ. Disadvantaged Women-Owned"},
                {l:"WOSB",d:"Women-Owned Small Business"},{l:"Cleared",d:"Public Trust + Secret Eligible"},
                {l:"CyberAB RP",d:"Registered Practitioner"},{l:"Wiz Certified",d:"Cloud Security Delivery"},
                {l:"SAFe 5",d:"Agile Practitioner"},{l:"ITIL v3",d:"IT Service Management"},
              ].map(c=>(
                <div key={c.l} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:8,background:C.bgSoft,border:`1px solid ${C.borderLight}`}}>
                  <span style={{color:C.teal,fontSize:10}}>◆</span>
                  <div><div style={{fontSize:13,fontWeight:700,fontFamily:F.h,color:C.navy}}>{c.l}</div><div style={{fontSize:10,color:C.textFaint}}>{c.d}</div></div>
                </div>
              ))}
            </div>}
            {showNaics && <div style={{display:"grid",gap:3,marginBottom:16,animation:"fadeUp .3s ease"}}>
              {naics.map(n=>(
                <div key={n.c} style={{display:"flex",gap:10,fontSize:12,fontFamily:F.m,padding:"5px 0",borderBottom:`1px solid ${C.borderLight}`}}>
                  <span style={{fontWeight:700,color:C.teal,width:56,flexShrink:0}}>{n.c}</span><span style={{color:C.textMuted}}>{n.d}</span>
                </div>
              ))}
            </div>}

            {/* Core capabilities — what we actually do */}
            <div>
              <h4 style={{fontSize:12,fontWeight:700,fontFamily:F.m,color:C.textFaint,textTransform:"uppercase",letterSpacing:1.5,marginBottom:10}}>Core Capabilities</h4>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}} className="g3">
                {["Azure Government Cloud","M365 GCC / GCC-High","CMMC Level 2","FedRAMP Advisory","Copilot Studio Agents","Power Platform","AI Governance (NIST RMF)","Cybersecurity Ops","Cloud Migration","Staff Augmentation","IAM / Entra ID","DevSecOps"].map(s=>(
                  <div key={s} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:C.textSoft,fontFamily:F.m}}>
                    <span style={{color:C.teal,fontSize:8}}>◆</span>{s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ HOW WE WORK — Engagement pathway ═══════════════ */
function HowWeWork() {
  const steps = [
    {n:"01",t:"Discovery",time:"Week 1",d:"30-minute call. We listen, ask the hard questions, and give you an honest assessment of whether AI makes sense for your situation right now. If it doesn't, we'll tell you.",del:"Fit assessment + 2-3 use case recommendations",c:C.teal},
    {n:"02",t:"Assessment",time:"Weeks 2-3",d:"Full 35-point evaluation across 7 domains — data, process, technology, people, strategy, governance, and use cases. Not a survey. A diagnostic.",del:"Executive briefing + scored report + prioritized roadmap",c:C.blue},
    {n:"03",t:"Build",time:"Weeks 4-8",d:"We implement the highest-ROI use case first. Production Copilot agents, Power Automate workflows, governance frameworks — whatever the roadmap calls for.",del:"Working solution + documentation + staff training",c:C.violet},
    {n:"04",t:"Operate",time:"Ongoing",d:"Monthly reviews, performance tracking, and iteration. We stay until the solution runs without us — then we hand you the keys.",del:"Monthly report + optimization + knowledge transfer",c:C.coral},
  ];
  return (
    <section style={{padding:"80px 0",background:C.bg}}>
      <div style={{maxWidth:1000,margin:"0 auto",padding:"0 24px"}}>
        <SH tag="Predictable Process · Defined Deliverables" title="How we work" desc="Every engagement follows the same structure. No scope creep, no surprise invoices, no PowerPoint-and-disappear." />
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:2,position:"relative"}} className="g1">
          {steps.map((s,i)=>(
            <div key={s.n} style={{position:"relative",padding:"28px 20px",background:C.bgSoft,borderRadius:i===0?"16px 0 0 16px":i===3?"0 16px 16px 0":"0"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                <span style={{fontSize:24,fontWeight:800,fontFamily:F.m,color:s.c,opacity:.35}}>{s.n}</span>
                <div>
                  <div style={{fontSize:16,fontWeight:800,fontFamily:F.h,color:C.navy}}>{s.t}</div>
                  <div style={{fontSize:11,fontFamily:F.m,color:s.c,fontWeight:700}}>{s.time}</div>
                </div>
              </div>
              <p style={{fontSize:13,lineHeight:1.65,color:C.textSoft,fontFamily:F.b,marginBottom:14}}>{s.d}</p>
              <div style={{padding:"8px 12px",borderRadius:8,background:s.c+"08",border:`1px solid ${s.c}15`}}>
                <div style={{fontSize:9,fontWeight:700,fontFamily:F.m,color:s.c,textTransform:"uppercase",letterSpacing:1,marginBottom:2}}>You receive</div>
                <div style={{fontSize:12,fontWeight:600,fontFamily:F.h,color:C.navy}}>{s.del}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:28}}>
          <p style={{fontSize:13,color:C.textFaint,fontFamily:F.m}}>Most clients go from Discovery to working solution in under 30 days. Every engagement has a defined scope, timeline, and exit criteria.</p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ FIELD NOTES — Dynamic blog from API ═══════════════ */
function FieldNotes({id}) {
  const [posts, setPosts] = useState([]);
  const [tagCloud, setTagCloud] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [activeTag, setActiveTag] = useState(null);
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [comment, setComment] = useState({name:'',body:'',website:''});
  const [commentPost, setCommentPost] = useState(null);
  const [commentMsg, setCommentMsg] = useState('');
  const [comments, setComments] = useState({});
  const tagColors = [C.teal,C.blue,C.violet,C.coral,C.rose];

  useEffect(()=>{
    const q = new URLSearchParams();
    if(activeTag) q.set('tag',activeTag);
    if(search) q.set('q',search);
    fetch(`/api/blog?${q.toString()}`).then(r=>r.json()).then(d=>{
      setPosts(d.posts||[]);
      setTagCloud(d.tagCloud||{});
    }).catch(()=>{});
  },[activeTag,search]);

  const loadComments = async(postId)=>{
    const r = await fetch(`/api/blog/comments?post_id=${postId}`);
    const d = await r.json();
    setComments(prev=>({...prev,[postId]:d.comments||[]}));
  };

  const submitComment = async(postId)=>{
    if(!comment.name||!comment.body) return;
    if(comment.website) return; // honeypot
    await fetch('/api/blog/comments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...comment,post_id:postId})});
    setComment({name:'',body:'',website:''});
    setCommentMsg('Comment submitted for review!');
    setTimeout(()=>setCommentMsg(''),3000);
  };

  const shareLinkedIn = (post)=>{
    const url = `https://thebhtlabs.com/#notes`;
    const text = `${post.title}\n\n${post.excerpt||post.body.substring(0,200)}\n\nRead more at TheBHTLabs.com`;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`,'_blank');
  };

  const displayed = showAll ? posts : posts.slice(0,3);
  const sortedTags = Object.entries(tagCloud).sort((a,b)=>b[1]-a[1]);

  return (
    <section id={id} style={{padding:"100px 0",background:C.bgSoft}}>
      <div style={{maxWidth:900,margin:"0 auto",padding:"0 24px"}}>
        {/* Header */}
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:20,background:C.teal+"0A",border:`1px solid ${C.teal}15`,marginBottom:16}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:C.teal}} />
            <span style={{fontSize:12,fontWeight:700,fontFamily:F.m,color:C.tealDark,letterSpacing:".5px"}}>FIELD NOTES</span>
          </div>
          <h2 style={{fontSize:"clamp(28px,3.5vw,40px)",fontWeight:800,fontFamily:F.h,color:C.navy,lineHeight:1.1,letterSpacing:"-0.03em"}}>
            Dispatches from the field.
          </h2>
          <p style={{color:C.textMuted,fontSize:16,marginTop:14,lineHeight:1.7,fontFamily:F.b,maxWidth:600,margin:"14px auto 0"}}>
            Real problems. Real solutions. No thought leadership fluff.
          </p>
        </div>

        {/* Word Cloud + Search */}
        <div style={{marginBottom:32}}>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:16}}>
            <input value={search} onChange={e=>{setSearch(e.target.value);setActiveTag(null)}} placeholder="Search field notes..."
              style={{padding:"8px 16px",borderRadius:10,border:`1px solid ${C.border}`,fontSize:13,fontFamily:F.b,outline:"none",width:220}} />
            {activeTag && <button onClick={()=>setActiveTag(null)} style={{padding:"4px 12px",borderRadius:8,border:`1px solid ${C.red}33`,background:C.roseBg,color:C.rose,fontSize:11,fontWeight:700,fontFamily:F.m,cursor:"pointer"}}>✕ {activeTag}</button>}
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {sortedTags.map(([tag,count],i)=>(
              <button key={tag} onClick={()=>{setActiveTag(activeTag===tag?null:tag);setSearch('')}}
                style={{padding:"5px 14px",borderRadius:20,border:"none",cursor:"pointer",transition:"all .15s",
                  fontSize:Math.min(14,10+count*2),fontWeight:activeTag===tag?700:500,fontFamily:F.h,
                  background:activeTag===tag?tagColors[i%tagColors.length]:tagColors[i%tagColors.length]+"0D",
                  color:activeTag===tag?"#fff":tagColors[i%tagColors.length]}}>
                {tag} <span style={{fontSize:9,opacity:.7}}>({count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Posts feed */}
        {displayed.length===0 && <p style={{textAlign:"center",color:C.textMuted,padding:40}}>No posts found.</p>}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {displayed.map((note)=>{
            const isOpen = expanded === note.id;
            const postComments = comments[note.id] || [];
            const dateStr = note.published_at ? new Date(note.published_at).toLocaleDateString('en-US',{month:'short',year:'numeric'}) : '';
            return (
              <article key={note.id} style={{background:C.bg,border:`1px solid ${isOpen?C.teal+"33":C.border}`,borderRadius:16,overflow:"hidden",transition:"all .2s",boxShadow:isOpen?C.shadowMd:C.shadow}}>
                <div onClick={()=>{setExpanded(isOpen?null:note.id);if(!isOpen)loadComments(note.id)}}
                  style={{padding:"24px 28px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,flexWrap:"wrap"}}>
                      {note.tags.map((t,i)=><Tag key={t} color={tagColors[i%tagColors.length]}>{t}</Tag>)}
                      <span style={{fontSize:12,color:C.textFaint,fontFamily:F.m}}>{dateStr}</span>
                      <span style={{fontSize:11,color:C.textFaint,fontFamily:F.m}}>· {note.read_time} read</span>
                    </div>
                    <h3 style={{fontSize:18,fontWeight:700,fontFamily:F.h,color:C.navy,lineHeight:1.35}}>{note.title}</h3>
                    {!isOpen && <p style={{color:C.textMuted,fontSize:14,marginTop:8,lineHeight:1.6}}>{(note.excerpt||note.body.substring(0,160)).trim()}...</p>}
                  </div>
                  <div style={{flexShrink:0,width:32,height:32,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",background:C.bgSoft,color:C.textMuted,fontSize:16,transition:"transform .2s",transform:isOpen?"rotate(180deg)":""}}>▾</div>
                </div>
                {isOpen && (
                  <div style={{padding:"0 28px 28px",animation:"fadeUp .3s ease"}}>
                    <div style={{borderTop:`1px solid ${C.borderLight}`,paddingTop:20}}>
                      {note.body.split("\n\n").map((p,j)=>(
                        <p key={j} style={{fontSize:15,lineHeight:1.8,color:C.textSoft,marginBottom:16,fontFamily:F.b}}>{p}</p>
                      ))}
                    </div>
                    {/* Author + share */}
                    <div style={{marginTop:16,paddingTop:16,borderTop:`1px solid ${C.borderLight}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${C.navy},${C.tealDark})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:800,fontFamily:F.h}}>NN</div>
                        <div><div style={{fontSize:13,fontWeight:700,fontFamily:F.h,color:C.navy}}>Nitin Nagar</div><div style={{fontSize:11,color:C.textFaint,fontFamily:F.m}}>Founder, BHT Solutions</div></div>
                      </div>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        <button onClick={(e)=>{e.stopPropagation();shareLinkedIn(note)}}
                          style={{display:"inline-flex",alignItems:"center",gap:5,padding:"7px 12px",borderRadius:8,background:"#0A66C2",color:"#fff",fontSize:11,fontWeight:700,fontFamily:F.m,border:"none",cursor:"pointer"}}
                          title="Share on LinkedIn">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                          LinkedIn
                        </button>
                        <button onClick={(e)=>{e.stopPropagation();const t=encodeURIComponent(note.title+' — '+note.excerpt?.substring(0,100));window.open(`https://x.com/intent/tweet?text=${t}&url=${encodeURIComponent('https://thebhtlabs.com/#notes')}`,'_blank')}}
                          style={{display:"inline-flex",alignItems:"center",gap:5,padding:"7px 12px",borderRadius:8,background:C.navy,color:"#fff",fontSize:11,fontWeight:700,fontFamily:F.m,border:"none",cursor:"pointer"}}
                          title="Share on X">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                          X
                        </button>
                        <button onClick={(e)=>{e.stopPropagation();navigator.clipboard?.writeText(`${note.title}\n\n${(note.excerpt||'').substring(0,200)}\n\nhttps://thebhtlabs.com/#notes`);alert('Copied to clipboard! Paste into Instagram.')}}
                          style={{display:"inline-flex",alignItems:"center",gap:5,padding:"7px 12px",borderRadius:8,background:"linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",color:"#fff",fontSize:11,fontWeight:700,fontFamily:F.m,border:"none",cursor:"pointer"}}
                          title="Copy for Instagram">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                          Instagram
                        </button>
                        <a href="https://www.linkedin.com/in/nitin-nagar-22004b4/" target="_blank" rel="noopener"
                          style={{display:"inline-flex",alignItems:"center",gap:5,padding:"7px 12px",borderRadius:8,background:C.bgSoft,color:C.navy,fontSize:11,fontWeight:700,fontFamily:F.m,textDecoration:"none",border:`1px solid ${C.border}`}}>Follow ↗</a>
                      </div>
                    </div>
                    {/* Comments */}
                    <div style={{marginTop:20,paddingTop:16,borderTop:`1px solid ${C.borderLight}`}}>
                      <h4 style={{fontSize:13,fontWeight:700,fontFamily:F.h,color:C.navy,marginBottom:12}}>Comments {postComments.length>0&&`(${postComments.length})`}</h4>
                      {postComments.map(c=>(
                        <div key={c.id} style={{padding:"10px 14px",borderRadius:10,background:C.bgSoft,marginBottom:8}}>
                          <div style={{fontSize:12,fontWeight:700,color:C.navy}}>{c.name} <span style={{fontWeight:400,color:C.textFaint,fontSize:10}}>{new Date(c.created_at).toLocaleDateString()}</span></div>
                          <p style={{fontSize:13,color:C.textSoft,marginTop:4,lineHeight:1.5}}>{c.body}</p>
                        </div>
                      ))}
                      {commentPost===note.id ? (
                        <div style={{display:"flex",flexDirection:"column",gap:8}} onClick={e=>e.stopPropagation()}>
                          <input value={comment.name} onChange={e=>setComment({...comment,name:e.target.value})} placeholder="Your name *"
                            style={{padding:"8px 12px",borderRadius:8,border:`1px solid ${C.border}`,fontSize:13,outline:"none"}} />
                          <textarea value={comment.body} onChange={e=>setComment({...comment,body:e.target.value})} placeholder="Your comment *" rows={3}
                            style={{padding:"8px 12px",borderRadius:8,border:`1px solid ${C.border}`,fontSize:13,outline:"none",resize:"vertical"}} />
                          <div style={{position:"absolute",left:"-9999px"}}><input value={comment.website} onChange={e=>setComment({...comment,website:e.target.value})} tabIndex={-1} /></div>
                          {commentMsg && <p style={{color:C.teal,fontSize:12,fontWeight:600}}>{commentMsg}</p>}
                          <div style={{display:"flex",gap:8}}>
                            <button onClick={()=>submitComment(note.id)} style={{padding:"8px 16px",borderRadius:8,border:"none",background:C.teal,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>Submit</button>
                            <button onClick={()=>setCommentPost(null)} style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${C.border}`,background:C.bg,fontSize:12,fontWeight:600,cursor:"pointer"}}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={(e)=>{e.stopPropagation();setCommentPost(note.id)}}
                          style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${C.border}`,background:C.bg,fontSize:12,fontWeight:600,cursor:"pointer",color:C.textMuted}}>
                          💬 Leave a comment
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Show all / CTA */}
        <div style={{textAlign:"center",marginTop:32}}>
          {posts.length>3 && !showAll && <button onClick={()=>setShowAll(true)}
            style={{padding:"12px 28px",borderRadius:12,border:`1px solid ${C.border}`,background:C.bg,fontSize:14,fontWeight:700,fontFamily:F.h,cursor:"pointer",color:C.navy,marginBottom:16}}>
            Show all {posts.length} posts
          </button>}
          <div style={{marginTop:16}}>
            <a href="https://www.linkedin.com/in/nitin-nagar-22004b4/" target="_blank" rel="noopener"
              style={{display:"inline-flex",alignItems:"center",gap:8,padding:"14px 32px",borderRadius:12,background:C.navy,color:"#fff",fontSize:15,fontWeight:700,fontFamily:F.h,textDecoration:"none",boxShadow:`0 4px 16px ${C.navy}22`}}>
              Follow Nitin on LinkedIn
            </a>
            <p style={{color:C.textFaint,fontSize:12,fontFamily:F.m,marginTop:10}}>New field notes posted weekly from active engagements</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ FAQ ═══════════════ */
function FAQ({id}) {
  const [open, setOpen] = useState(null);
  const faqs = [
    {q:"What is TheBHTLabs?",a:"The skunkworks lab of BHT Solutions. We build AI readiness tools that most consultants charge $25K for — and give them away free. Every tool here was built from real client problems, not a whiteboard. Parent company: Bluebery Hawaii Technology Solutions LLC, Houston, TX. SBA 8(a) certified. Active security clearance."},
    {q:"What does it cost?",a:"The tools on this site — Assessment, ROI Calculator, Policy Generator, Compliance Tracker — are free. Zero. No trial, no credit card, no \"book a demo\" gate. If you want us to implement solutions, engagements start at $2,500 for an AI Sprint and scale based on scope. We publish our packages transparently on this site."},
    {q:"Is my data safe?",a:"All tools run in your browser. Nothing is sent to our servers unless you explicitly submit the contact form. We use no tracking cookies, no Google Analytics, no ad pixels, no third-party data sharing. The chatbot routes through a secure server-side proxy — your API keys are never exposed. Full details in our Privacy Policy."},
    {q:"Who is behind this?",a:"Nitin Nagar — 20+ years in enterprise IT. MS in Computer Science (University of Nevada Reno). Microsoft Certified Azure Solutions Architect. CyberAB Registered Practitioner. SAFe 5 Agile. Wiz-certified cloud security. Founded BHT Solutions in 2016. SBA 8(a), EDWOSB, WOSB. Active T4 Public Trust clearance, Secret eligible. CAGE: 7DBB9, UEI: ZW6GMVL368J6. Client portfolio includes DOJ, DHS, U.S. Army, McKesson, EY, PwC, IBM, Microsoft, Stryker, Bill & Melinda Gates Foundation."},
    {q:"What industries do you actually serve?",a:"Defense contractors, federal agencies, and regulated industries — insurance, legal, healthcare, financial services. If you handle CUI, need CMMC, operate in GCC-High, or have compliance requirements that keep your CISO up at night, we're built for you."},
    {q:"How fast can you deliver?",a:"Discovery call: 30 minutes. AI Sprint (assessment + roadmap): 2-3 weeks. Full implementation: 1-3 months. CMMC Level 2 certification: 90 days — we've done it, 110/110 NIST 800-171 practices, first-attempt C3PAO pass. We don't bill by the hour with an incentive to drag things out."},
    {q:"Do you work with small businesses?",a:"Yes. Our 8(a) certification exists because we are a small business. The free tools are built specifically for organizations that can't afford a Big 4 consulting engagement. We've worked with 5-person startups and 500-person defense primes. Same rigor, scaled to your reality."},
    {q:"What's your tech stack?",a:"Microsoft ecosystem: Azure, M365, Entra ID, Purview, Copilot Studio, Power Platform, GCC-High, Azure Government. We also work with Azure AI Foundry, Teams AI SDK, SharePoint, and PowerShell automation. If it's Microsoft and enterprise, we've deployed it."},
    {q:"Can I use the assessment results commercially?",a:"The assessment report is yours. Use it internally, share it with your board, include it in your SSP documentation. We retain no rights to your inputs or outputs. If you want to cite TheBHTLabs as the source, we appreciate it but don't require it."},
    {q:"How do I get started?",a:"Take the free AI Readiness Assessment — 10 minutes, 35 questions, 7 domains. You'll get a score, a gap analysis, and a clear next step. Or skip straight to the contact form and tell us what you need. No sales pitch. We'll tell you honestly if we're the right fit."},
  ];
  return (
    <section id={id} style={{padding:"80px 0",background:C.bg}}>
      <div style={{maxWidth:800,margin:"0 auto",padding:"0 24px"}}>
        <SH tag="Common Questions" title="Frequently Asked Questions" desc="Everything you need to know about TheBHTLabs and BHT Solutions." />
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {faqs.map((f,i)=>{
            const isOpen = open===i;
            return (
              <div key={i} style={{border:`1px solid ${isOpen?C.teal+"33":C.border}`,borderRadius:14,overflow:"hidden",transition:"all .2s",background:C.bg}}>
                <button onClick={()=>setOpen(isOpen?null:i)}
                  style={{width:"100%",padding:"18px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"none",border:"none",cursor:"pointer",textAlign:"left"}}>
                  <span style={{fontSize:15,fontWeight:700,fontFamily:F.h,color:C.navy,paddingRight:16}}>{f.q}</span>
                  <span style={{flexShrink:0,fontSize:18,color:C.textMuted,transition:"transform .2s",transform:isOpen?"rotate(45deg)":""}}>+</span>
                </button>
                {isOpen && <div style={{padding:"0 24px 18px",animation:"fadeUp .2s ease"}}>
                  <p style={{fontSize:14,lineHeight:1.7,color:C.textSoft,fontFamily:F.b}}>{f.a}</p>
                </div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ SOCIAL ICONS SVGs ═══════════════ */
const SocialIcons = {
  linkedin: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  x: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  facebook: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  youtube: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  whatsapp: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  email: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>,
};

/* ═══════════════ COOKIE NOTICE ═══════════════ */
function CookieNotice() {
  const [show, setShow] = useState(false);
  useEffect(()=>{
    try { if(!localStorage.getItem("bht_cookie_ack")) setShow(true); } catch(e){ setShow(true); }
  },[]);
  const accept = () => { try { localStorage.setItem("bht_cookie_ack","1"); } catch(e){} setShow(false); };
  if(!show) return null;
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:998,background:C.navy,color:"#fff",padding:"14px 24px",display:"flex",justifyContent:"center",alignItems:"center",gap:16,flexWrap:"wrap",fontSize:13,fontFamily:F.b}}>
      <p style={{maxWidth:600,lineHeight:1.5,margin:0}}>
        We use only essential cookies for basic site functionality. No tracking, no ads, no third-party cookies. <span style={{opacity:.6}}>See our Privacy Policy for details.</span>
      </p>
      <button onClick={accept} style={{padding:"8px 20px",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:F.h,background:C.teal,color:"#fff",flexShrink:0}}>Got it</button>
    </div>
  );
}

/* ═══════════════ FOOTER ═══════════════ */
function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const socials = [
    {name:"LinkedIn",icon:SocialIcons.linkedin,url:"https://www.linkedin.com/company/bht-solutions-llc",color:"#0A66C2"},
    {name:"X (Twitter)",icon:SocialIcons.x,url:"https://x.com/bhtsolutions",color:C.navy},
    {name:"Facebook",icon:SocialIcons.facebook,url:"https://www.facebook.com/bhtsolutions",color:"#1877F2"},
    {name:"YouTube",icon:SocialIcons.youtube,url:"https://www.youtube.com/@bhtsolutions",color:"#FF0000"},
    {name:"WhatsApp",icon:SocialIcons.whatsapp,url:"https://wa.me/15136381986",color:"#25D366"},
    {name:"Email",icon:SocialIcons.email,url:"mailto:info@bhtsolutions.com",color:C.teal},
  ];
  return (
    <footer style={{padding:"60px 0 36px",background:C.navy,color:"#fff"}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px"}}>
        {/* Top: Logo + links + social */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:40,marginBottom:40}} className="g4">
          {/* Brand */}
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none"><path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" fill={C.teal}/><text x="18" y="23" textAnchor="middle" fill="#fff" fontFamily="monospace" fontWeight="800" fontSize="18">λ</text></svg>
              <span style={{fontWeight:800,fontSize:17,fontFamily:F.h}}>TheBHT<span style={{color:C.teal}}>Labs</span></span>
            </div>
            <p style={{fontSize:13,lineHeight:1.7,color:"rgba(255,255,255,.6)",marginBottom:16}}>
              The skunkworks innovation lab of BHT Solutions. Free AI readiness tools built from 20+ years of enterprise IT experience.
            </p>
            <a href="https://www.bhtsolutions.com" target="_blank" rel="noopener" style={{color:C.teal,fontSize:13,fontWeight:600,fontFamily:F.m,textDecoration:"none"}}>
              bhtsolutions.com ↗
            </a>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{fontSize:11,fontWeight:700,fontFamily:F.m,textTransform:"uppercase",letterSpacing:1.5,color:"rgba(255,255,255,.4)",marginBottom:16}}>Tools</h4>
            {[{l:"AI Assessment",id:"assess"},{l:"ROI Calculator",id:"roi"},{l:"AI Policy Generator",id:"policy"},{l:"Compliance Countdown",id:"packages"},{l:"Field Notes",id:"notes"}].map(l=>(
              <button key={l.id} onClick={()=>document.getElementById(l.id)?.scrollIntoView({behavior:"smooth"})}
                style={{display:"block",background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,.7)",fontSize:13,fontFamily:F.b,padding:"4px 0",transition:"color .15s"}}
                onMouseEnter={e=>e.target.style.color=C.teal} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.7)"}>{l.l}</button>
            ))}
          </div>

          {/* Company */}
          <div>
            <h4 style={{fontSize:11,fontWeight:700,fontFamily:F.m,textTransform:"uppercase",letterSpacing:1.5,color:"rgba(255,255,255,.4)",marginBottom:16}}>Company</h4>
            {[
              {l:"The Builder",id:"builder"},{l:"Packages",id:"packages"},{l:"FAQ",id:"faq"},
            ].map(l=>(
              <button key={l.id} onClick={()=>document.getElementById(l.id)?.scrollIntoView({behavior:"smooth"})}
                style={{display:"block",background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,.7)",fontSize:13,fontFamily:F.b,padding:"4px 0",transition:"color .15s"}}
                onMouseEnter={e=>e.target.style.color=C.teal} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.7)"}>{l.l}</button>
            ))}
            <button onClick={()=>setShowPrivacy(true)}
              style={{display:"block",background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,.7)",fontSize:13,fontFamily:F.b,padding:"4px 0",transition:"color .15s"}}
              onMouseEnter={e=>e.target.style.color=C.teal} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.7)"}>Privacy Policy</button>
            <a href="https://bhtsolutions.com/capability-statement/" target="_blank" rel="noopener"
              style={{display:"block",color:"rgba(255,255,255,.7)",fontSize:13,fontFamily:F.b,padding:"4px 0",textDecoration:"none",transition:"color .15s"}}
              onMouseEnter={e=>e.target.style.color=C.teal} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.7)"}>Capability Statement ↗</a>
          </div>

          {/* Connect */}
          <div>
            <h4 style={{fontSize:11,fontWeight:700,fontFamily:F.m,textTransform:"uppercase",letterSpacing:1.5,color:"rgba(255,255,255,.4)",marginBottom:16}}>Connect With Us</h4>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
              {socials.map(s=>(
                <a key={s.name} href={s.url} target={s.url.startsWith("mailto")?"_self":"_blank"} rel="noopener noreferrer" title={s.name}
                  style={{width:40,height:40,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,.08)",color:"rgba(255,255,255,.7)",transition:"all .15s",textDecoration:"none"}}
                  onMouseEnter={e=>{e.currentTarget.style.background=s.color;e.currentTarget.style.color="#fff"}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.08)";e.currentTarget.style.color="rgba(255,255,255,.7)"}}>
                  {s.icon}
                </a>
              ))}
            </div>
            <p style={{fontSize:12,color:"rgba(255,255,255,.5)",fontFamily:F.m,lineHeight:1.6}}>
              info@bhtsolutions.com<br/>
              Cypress, TX 77433
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{borderTop:"1px solid rgba(255,255,255,.1)",paddingTop:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <span style={{color:"rgba(255,255,255,.35)",fontSize:10,fontFamily:F.m}}>CAGE: 7DBB9 · UEI: ZW6GMVL368J6 · DUNS: 801352894 · FEIN: 26-0374906 · Primary NAICS: 541512</span>
            <span style={{color:"rgba(255,255,255,.35)",fontSize:10,fontFamily:F.m}}>© {new Date().getFullYear()} Bluebery Hawaii Technology Solutions LLC · SBA 8(a) · EDWOSB · WOSB · Houston, TX</span>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={()=>setShowPrivacy(false)}>
          <div style={{background:C.bg,borderRadius:20,maxWidth:640,width:"100%",maxHeight:"80vh",overflow:"auto",padding:32,boxShadow:C.shadowLg,color:C.text}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h2 style={{fontSize:22,fontWeight:800,fontFamily:F.h,color:C.navy}}>Privacy Policy</h2>
              <button onClick={()=>setShowPrivacy(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:C.textMuted}}>✕</button>
            </div>
            <div style={{fontSize:13,color:C.textSoft,lineHeight:1.8,fontFamily:F.b}}>
              <p style={{marginBottom:12}}><strong style={{color:C.navy}}>Effective Date:</strong> January 1, 2026 · <strong style={{color:C.navy}}>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
              <p style={{marginBottom:12}}>Bluebery Hawaii Technology Solutions LLC ("BHT Solutions", "we", "us") operates TheBHTLabs.com. This policy explains how we handle information when you use our site and tools.</p>
              <h3 style={{fontSize:15,fontWeight:700,color:C.navy,marginTop:20,marginBottom:8}}>Information We Collect</h3>
              <p style={{marginBottom:8}}><strong>Voluntarily Provided:</strong> When you submit the contact form or assessment, we collect information you provide: name, email, company name, and assessment responses.</p>
              <p style={{marginBottom:8}}><strong>Automatically Collected:</strong> Standard web analytics (page views, referral source). We do not use third-party tracking cookies or sell data to advertisers.</p>
              <p style={{marginBottom:8}}><strong>Tools (ROI Calculator, Policy Generator, Assessment):</strong> All calculations run in your browser. We do not store your inputs or outputs unless you explicitly submit them via the contact/assessment form.</p>
              <h3 style={{fontSize:15,fontWeight:700,color:C.navy,marginTop:20,marginBottom:8}}>Cookies</h3>
              <p style={{marginBottom:8}}>We use only essential cookies required for basic site functionality. We do not use third-party tracking cookies, advertising cookies, or analytics cookies that track individual users. No data is sold or shared with third parties.</p>
              <h3 style={{fontSize:15,fontWeight:700,color:C.navy,marginTop:20,marginBottom:8}}>How We Use Information</h3>
              <p style={{marginBottom:8}}>We use voluntarily provided information solely to: respond to your inquiry, deliver assessment results, and follow up on requested consultations. We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
              <h3 style={{fontSize:15,fontWeight:700,color:C.navy,marginTop:20,marginBottom:8}}>Data Security</h3>
              <p style={{marginBottom:8}}>We implement industry-standard security measures. Our chatbot uses server-side API routing — no API keys or sensitive credentials are exposed client-side. Contact form submissions are transmitted via encrypted SMTP.</p>
              <h3 style={{fontSize:15,fontWeight:700,color:C.navy,marginTop:20,marginBottom:8}}>AI Chatbot</h3>
              <p style={{marginBottom:8}}>Our AI chatbot is powered by Anthropic's Claude. Conversations are processed through our secure server-side proxy. Do not share sensitive personal, financial, or health information in the chat. Chat conversations are not stored permanently.</p>
              <h3 style={{fontSize:15,fontWeight:700,color:C.navy,marginTop:20,marginBottom:8}}>Your Rights</h3>
              <p style={{marginBottom:8}}>You may request deletion of any personal information we hold by emailing info@bhtsolutions.com. We will respond within 30 days. California residents: We do not sell or share personal information as defined by the CCPA/CPRA.</p>
              <h3 style={{fontSize:15,fontWeight:700,color:C.navy,marginTop:20,marginBottom:8}}>Contact</h3>
              <p>Bluebery Hawaii Technology Solutions LLC · 20223 Granite Birch Ln, Cypress, TX 77433 · info@bhtsolutions.com</p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

/* ═══════════════ CHATBOT ═══════════════ */
function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{r:"a",c:"Hey! I'm the TheBHTLabs AI advisor. I can help with:\n\n• Is AI right for your business?\n• Which package fits your needs?\n• Copilot Studio & automation questions\n• Compliance (CMMC, FedRAMP)\n• Career & upskilling guidance\n\nWhat's on your mind?"}]);
  const [inp, setInp] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({behavior:"smooth"}); }, [msgs]);

  const send = async () => {
    if(!inp.trim()||loading)return;
    const msg = inp.trim(); setInp(""); setMsgs(p=>[...p,{r:"u",c:msg}]); setLoading(true);
    try {
      const history = msgs.filter(m=>m.r!=="a"||msgs.indexOf(m)>0).slice(-6).map(m=>({role:m.r==="u"?"user":"assistant",content:m.c}));
      history.push({role:"user",content:msg});
      const r = await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({messages:history})});
      const d = await r.json();
      setMsgs(p=>[...p,{r:"a",c:d.content||"Connection issue. Email info@bhtsolutions.com"}]);
    } catch(e) { setMsgs(p=>[...p,{r:"a",c:"Connection issue. Reach us at info@bhtsolutions.com"}]); }
    setLoading(false);
  };

  if (!open) return (
    <button onClick={()=>setOpen(true)} style={{position:"fixed",bottom:24,right:24,zIndex:1000,width:56,height:56,borderRadius:16,background:C.teal,border:"none",cursor:"pointer",boxShadow:`0 4px 20px ${C.teal}33`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:22,transition:"all .2s"}}>
      💬
    </button>
  );

  return (
    <div style={{position:"fixed",bottom:24,right:24,zIndex:1000,width:380,maxWidth:"calc(100vw - 48px)",height:520,background:C.bg,border:`1px solid ${C.border}`,borderRadius:20,boxShadow:C.shadowLg,display:"flex",flexDirection:"column"}}>
      <div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Badge color={C.teal}>Online</Badge>
          <span style={{fontWeight:700,fontFamily:F.h,fontSize:14,color:C.navy}}>TheBHTLabs AI</span>
        </div>
        <button onClick={()=>setOpen(false)} style={{background:"none",border:"none",cursor:"pointer",color:C.textMuted,fontSize:18}}>✕</button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:12,display:"flex",flexDirection:"column",gap:8}}>
        {msgs.map((m,i) => (
          <div key={i} style={{display:"flex",justifyContent:m.r==="u"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"80%",padding:"10px 14px",borderRadius:14,fontSize:13,lineHeight:1.6,whiteSpace:"pre-wrap",
              background:m.r==="u"?C.teal:C.bgMuted,color:m.r==="u"?"#fff":C.text,
              borderBottomRightRadius:m.r==="u"?4:14,borderBottomLeftRadius:m.r==="u"?14:4}}>{m.c}</div>
          </div>
        ))}
        {loading && <div style={{padding:8}}><span style={{color:C.teal,fontSize:13,fontFamily:F.m}}>Thinking...</span></div>}
        <div ref={endRef} />
      </div>
      <div style={{padding:10,borderTop:`1px solid ${C.border}`,display:"flex",gap:8}}>
        <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask anything..."
          style={{flex:1,padding:"10px 14px",borderRadius:10,border:`1px solid ${C.border}`,fontSize:13,fontFamily:F.b,outline:"none"}} />
        <button onClick={send} style={{width:38,height:38,borderRadius:10,border:"none",cursor:"pointer",
          background:inp.trim()?C.teal:C.bgMuted,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:15,transition:"all .15s"}}>→</button>
      </div>
    </div>
  );
}
