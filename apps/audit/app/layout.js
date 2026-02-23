export const metadata = {
  metadataBase: new URL('https://audit.thebhtlabs.com'),
  title: 'AI Bot Governance Auditor — Free Instant Scan | TheBHTLabs',
  description: 'Enter any website. We detect AI chatbots and score their governance against EU AI Act, NIST AI RMF, GDPR, and ISO 42001 in 10 seconds. Free, no signup required.',
  keywords: ['AI bot audit', 'chatbot governance', 'EU AI Act compliance', 'AI transparency', 'bot detection', 'NIST AI RMF'],
  openGraph: {
    type: 'website', locale: 'en_US', url: 'https://audit.thebhtlabs.com',
    siteName: 'TheBHTLabs AI Bot Auditor',
    title: 'Is your AI bot governed? Find out in 10 seconds.',
    description: 'Free AI chatbot governance scanner. 8 checks. EU AI Act, NIST, GDPR, ISO 42001.',
    images: [{ url: '/og', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'AI Bot Governance Auditor — TheBHTLabs' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#0E7490" />
      </head>
      <body style={{ margin: 0, background: '#FFFFFF' }}>{children}</body>
    </html>
  );
}
