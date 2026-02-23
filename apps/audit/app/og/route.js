import { ImageResponse } from 'next/og';
export const runtime = 'edge';
export async function GET() {
  return new ImageResponse(
    (
      <div style={{width:1200,height:630,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#0F172A 0%,#1E293B 100%)',fontFamily:'sans-serif'}}>
        <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:24}}>
          <div style={{width:48,height:48,borderRadius:14,background:'linear-gradient(135deg,#0E7490,#155E75)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <span style={{color:'#fff',fontSize:28,fontWeight:800}}>λ</span>
          </div>
          <span style={{fontSize:32,fontWeight:800,color:'#fff'}}>TheBHT<span style={{color:'#0E7490'}}>Labs</span></span>
        </div>
        <div style={{fontSize:56,fontWeight:800,color:'#F8FAFC',textAlign:'center',lineHeight:1.1,marginBottom:16}}>
          Is your AI bot governed?
        </div>
        <div style={{fontSize:24,color:'#94A3B8',textAlign:'center',maxWidth:800}}>
          Free AI chatbot governance scanner. 8 checks. EU AI Act, NIST, GDPR, ISO 42001.
        </div>
        <div style={{marginTop:32,padding:'14px 40px',borderRadius:14,background:'#0E7490',color:'#fff',fontSize:22,fontWeight:700}}>
          Scan any website in 10 seconds →
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
