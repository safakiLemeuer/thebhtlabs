// app/india/page.js — India subdomain entry point
import TheBHTLabsPlatform from '@/components/Platform';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://india.thebhtlabs.com",
  "name": "TheBHTLabs India — AI Readiness Assessment",
  "description": "35-point AI readiness assessment mapped to CERT-In, DPDP Act 2023, MeitY AI Guidelines, RBI FREE-AI, and NCIIPC.",
};

export const metadata = {
  title: 'India AI Readiness Assessment | TheBHTLabs',
  description: '35-point AI readiness assessment mapped to CERT-In, DPDP Act 2023, MeitY AI Guidelines, RBI FREE-AI, and NCIIPC. Free. Results in 5 minutes.',
  openGraph: {
    title: 'India AI Readiness Assessment | TheBHTLabs',
    description: 'Is your organization India AI-ready? Scored against CERT-In, DPDP Act 2023, MeitY AI Guidelines Nov 2025, and RBI FREE-AI.',
    url: 'https://india.thebhtlabs.com',
    siteName: 'TheBHTLabs India',
    locale: 'en_IN',
    type: 'website',
  },
  alternates: {
    canonical: 'https://india.thebhtlabs.com',
  },
};

export default function IndiaHome() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div id="seo-content" style={{position:'absolute',width:1,height:1,overflow:'hidden',clip:'rect(0,0,0,0)',whiteSpace:'nowrap'}} aria-hidden="false">
        <h1>TheBHTLabs India - AI Readiness Assessment mapped to CERT-In, DPDP Act 2023, and MeitY AI Guidelines</h1>
        <p>35-point assessment across 7 domains. Scored against CERT-In Directions 2022, DPDP Act 2023, DPDP Rules 2025, MeitY AI Governance Guidelines Nov 2025, RBI FREE-AI Aug 2025, IT Act 2000, NCIIPC Guidelines, IT (SGI) Amendment Rules 2026.</p>
      </div>
      <TheBHTLabsPlatform />
    </>
  );
}
