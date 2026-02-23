// packages/shared/components.js — Shared UI primitives
import { C, F, BRAND } from './constants.js';

export const Tag = ({children, color = C.teal, bg}) => (
  <span style={{padding:"4px 12px",borderRadius:20,fontSize:12,fontWeight:600,fontFamily:F.h,
    background:bg||color+"0D",color:color,letterSpacing:".2px"}}>{children}</span>
);

export const Badge = ({children, color = C.teal}) => (
  <span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"3px 10px",borderRadius:20,
    fontSize:11,fontWeight:600,fontFamily:F.m,background:color+"0A",color:color}}>
    <span style={{width:6,height:6,borderRadius:"50%",background:color}}/>
    {children}
  </span>
);

export const SH = ({tag, title, desc, align="center"}) => (
  <div style={{textAlign:align,marginBottom:56,maxWidth:700,margin:align==="center"?"0 auto 56px":"0 0 56px"}}>
    {tag && <div style={{marginBottom:12}}><Tag>{tag}</Tag></div>}
    <h2 style={{color:C.navy,fontSize:"clamp(28px,3.5vw,42px)",fontWeight:800,fontFamily:F.h,lineHeight:1.12,letterSpacing:"-0.02em"}}>{title}</h2>
    {desc && <p style={{color:C.textMuted,fontSize:16,marginTop:14,lineHeight:1.7,fontFamily:F.b}}>{desc}</p>}
  </div>
);

export const BuiltByBadge = ({variant = "light"}) => {
  const isLight = variant === "light";
  return (
    <div style={{display:"flex",justifyContent:"center",marginTop:22}}>
      <div style={{display:"inline-flex",alignItems:"center",gap:10,padding:"8px 20px",borderRadius:40,
        background:isLight?"rgba(14,116,144,.04)":"rgba(94,234,212,.04)",
        border:`1px solid ${isLight?"rgba(14,116,144,.08)":"rgba(94,234,212,.08)"}`,backdropFilter:"blur(8px)"}}>
        <div style={{width:24,height:24,borderRadius:7,background:"linear-gradient(135deg,#0E7490,#155E75)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 6px rgba(14,116,144,.2)"}}>
          <span style={{color:"#fff",fontFamily:"monospace",fontWeight:800,fontSize:12}}>{"\u03bb"}</span>
        </div>
        <span style={{fontSize:11,fontFamily:F.m,color:isLight?C.textFaint:"#64748B"}}>Built by our in-house engineering lab</span>
        <div style={{width:1,height:14,background:isLight?C.borderLight:"#334155"}} />
        <span style={{fontSize:11,fontWeight:700,fontFamily:F.h,color:isLight?C.teal:"#5EEAD4",letterSpacing:"-0.01em"}}>TheBHT<span style={{color:isLight?C.navy:"#E2E8F0"}}>Labs</span></span>
      </div>
    </div>
  );
};

export const PoweredBy = () => (
  <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,flexWrap:"wrap",marginTop:16}}>
    <div style={{display:"inline-flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:6,background:"rgba(14,116,144,.04)",border:"1px solid rgba(14,116,144,.08)"}}>
      <span style={{fontSize:9,fontFamily:F.m,color:C.textFaint}}>Powered by</span>
      <span style={{fontSize:10,fontWeight:800,fontFamily:F.h,color:"#D97706"}}>Anthropic Claude</span>
    </div>
    <div style={{display:"inline-flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:6,background:"rgba(0,120,215,.04)",border:"1px solid rgba(0,120,215,.08)"}}>
      <span style={{fontSize:10,fontWeight:800,fontFamily:F.h,color:"#0078D7"}}>Microsoft</span>
      <span style={{fontSize:9,fontFamily:F.m,color:C.textFaint}}>ecosystem</span>
    </div>
  </div>
);

export const MiniFooter = ({showIP = false}) => (
  <footer style={{padding:"40px 24px",textAlign:"center",background:C.navy,color:"rgba(255,255,255,.5)",fontSize:11,fontFamily:F.m}}>
    <div style={{maxWidth:600,margin:"0 auto"}}>
      <div style={{fontSize:14,fontWeight:800,fontFamily:F.h,color:"#fff",marginBottom:8}}>TheBHT<span style={{color:C.teal}}>Labs</span></div>
      <p style={{lineHeight:1.6,marginBottom:12}}>{BRAND.email} &middot; {BRAND.phone}</p>
      <p style={{fontSize:9,color:"rgba(255,255,255,.25)"}}>
        &copy; {new Date().getFullYear()} {BRAND.legal} &middot; {BRAND.certs}
      </p>
      {showIP && <p style={{fontSize:8,color:"rgba(255,255,255,.15)",marginTop:8}}>ARIA Score&trade; is a trademark of BHT Solutions LLC. All content proprietary.</p>}
    </div>
  </footer>
);

export const fontLinks = `<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>`;
