export const metadata = {
  metadataBase: new URL('https://thebhtlabs.com'),
  title: {
    default: 'TheBHTLabs — AI Governance, Readiness & Federal Compliance | BHT Solutions',
    template: '%s | TheBHTLabs'
  },
  description: 'Free AI Bot Governance Auditor and 35-point readiness assessment. SBA 8(a) sole-source eligible. M-25-21 compliance. Azure Gov, CMMC, M365 GCC-High.',
  keywords: [
    'AI governance', 'AI readiness assessment', 'AI bot auditor', 'CMMC compliance',
    'Azure Government Cloud', 'Microsoft 365 GCC-High', 'Copilot Studio',
    'NIST AI RMF', 'M-25-21', 'M-25-22', 'federal AI adoption',
    'SBA 8(a)', 'EDWOSB', 'federal IT consulting', 'AI compliance',
    'EU AI Act', 'NIST 800-171', 'FedRAMP', 'AI risk management',
  ],
  authors: [{ name: 'BHT Solutions', url: 'https://bhtsolutions.com' }],
  creator: 'BHT Solutions',
  publisher: 'BHT Solutions',
  alternates: { canonical: 'https://thebhtlabs.com' },
  openGraph: {
    type: 'website', locale: 'en_US', url: 'https://thebhtlabs.com', siteName: 'TheBHTLabs',
    title: 'TheBHTLabs — Your AI Is Live. Is It Governed?',
    description: 'Free AI Bot Governance Auditor. 35-point assessment. SBA 8(a) sole-source to $4.5M. M-25-21 compliance.',
    images: [{ url: '/og', width: 1200, height: 630, alt: 'TheBHTLabs — AI Governance & Federal Compliance' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TheBHTLabs — AI Governance & Federal Compliance',
    description: 'Free AI bot auditor. 35-point assessment. SBA 8(a). M-25-21 compliant.',
    images: ['/og'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  category: 'technology',
  other: { 'msapplication-TileColor': '#0D9488', 'theme-color': '#FFFFFF' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="author" content="TheBHTLabs — Bluebery Hawaii Technology Solutions LLC" />
        <meta name="copyright" content="© 2024-2026 BHT Solutions LLC. All rights reserved. ARIA Score™ is a trademark." />
        <style dangerouslySetInnerHTML={{__html: `
          body{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}
          input,textarea,select,button,[contenteditable]{-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;user-select:text}
          img{-webkit-user-drag:none;-khtml-user-drag:none;-moz-user-drag:none;user-drag:none;pointer-events:none}
          @media print{body::before{content:"CONFIDENTIAL — TheBHTLabs.com — Unauthorized reproduction prohibited";display:block;text-align:center;font-size:14px;color:#DC2626;padding:20px;font-weight:700}body{opacity:.3!important}}
        `}} />
        <script dangerouslySetInnerHTML={{__html: `
          (function(){
            document.addEventListener('contextmenu',function(e){if(!e.target.closest('input,textarea,[contenteditable]'))e.preventDefault()});
            document.addEventListener('copy',function(e){
              e.preventDefault();
              var t='\\n© TheBHTLabs.com — Proprietary content. Unauthorized copying prohibited.\\nhttps://thebhtlabs.com\\n';
              if(e.clipboardData)e.clipboardData.setData('text/plain',t);
            });
            document.addEventListener('keydown',function(e){
              if((e.ctrlKey||e.metaKey)&&(e.key==='u'||e.key==='s'||e.key==='p')&&!e.target.closest('input,textarea,[contenteditable]')){e.preventDefault()}
              if(e.key==='F12'){e.preventDefault()}
              if((e.ctrlKey||e.metaKey)&&e.shiftKey&&(e.key==='I'||e.key==='J'||e.key==='C')){e.preventDefault()}
            });
            document.addEventListener('dragstart',function(e){e.preventDefault()});
          })();
        `}} />
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
