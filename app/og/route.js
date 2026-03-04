import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div style={{display:'flex',flexDirection:'column',width:'100%',height:'100%',background:'linear-gradient(135deg,#FAFAF9,#F5F5F4)',padding:'60px 80px',fontFamily:'sans-serif'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'40px'}}>
          <div style={{width:'40px',height:'40px',background:'#0E7490',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'22px',fontWeight:800}}>λ</div>
          <span style={{fontSize:'24px',fontWeight:800,color:'#1C1917'}}>TheBHTLabs</span>
        </div>
        <div style={{display:'flex',flexDirection:'column',flex:1,justifyContent:'center'}}>
          <div style={{fontSize:'58px',fontWeight:800,color:'#1C1917',lineHeight:1.1}}>We Govern AI.</div>
          <div style={{fontSize:'58px',fontWeight:800,color:'#0E7490',lineHeight:1.1,marginTop:'8px'}}>Then We Build It Right.</div>
          <div style={{fontSize:'22px',color:'#78716C',marginTop:'24px'}}>AI Governance + Engineering + Federal Compliance</div>
          <div style={{fontSize:'16px',color:'#A8A29E',marginTop:'12px'}}>SBA 8(a) | EDWOSB | Azure Architect | Clearance-Eligible</div>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
          <div style={{background:'#0E7490',color:'#fff',padding:'14px 32px',borderRadius:'12px',fontSize:'18px',fontWeight:700}}>Run the Audit</div>
          <div style={{fontSize:'14px',color:'#A8A29E'}}>thebhtlabs.com</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
