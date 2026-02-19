import { Plus_Jakarta_Sans, IBM_Plex_Mono } from 'next/font/google';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const ibmMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://thebhtlabs.com'),
  title: {
    default: 'TheBHTLabs — AI Readiness, Automation & Upskilling | BHT Solutions',
    template: '%s | TheBHTLabs'
  },
  description: 'Free 35-point AI readiness assessment, ROI calculator, AI policy generator, compliance countdown. SBA 8(a) certified IT consulting for Azure Gov, CMMC, M365 GCC-High.',
  keywords: [
    'AI readiness assessment', 'CMMC compliance', 'Azure Government Cloud', 'Microsoft 365 GCC-High',
    'Copilot Studio', 'AI governance', 'NIST 800-171', 'FedRAMP advisory', 'AI ROI calculator',
    'AI policy generator', 'SBA 8(a)', 'EDWOSB', 'federal IT consulting', 'defense contractor IT',
    'Power Platform', 'Entra ID', 'AI automation', 'small business AI', 'AI upskilling',
    'compliance countdown', 'CMMC Level 2', 'AI acceptable use policy'
  ],
  authors: [{ name: 'BHT Solutions', url: 'https://bhtsolutions.com' }],
  creator: 'BHT Solutions',
  publisher: 'BHT Solutions',

  // Canonical
  alternates: {
    canonical: 'https://thebhtlabs.com',
  },

  // Open Graph (Facebook, LinkedIn)
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://thebhtlabs.com',
    siteName: 'TheBHTLabs',
    title: 'TheBHTLabs — Stop talking about AI. Start shipping it.',
    description: 'Free AI readiness tools: 35-point assessment with PDF report, ROI calculator, AI policy generator, compliance countdown. SBA 8(a) · EDWOSB · ISO 27001 · CMMI ML3.',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'TheBHTLabs — AI Readiness & Automation Tools by BHT Solutions',
    }],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'TheBHTLabs — AI Readiness, Automation & Upskilling',
    description: 'Free 35-point AI assessment, ROI calculator, policy generator. SBA 8(a) certified. Azure Gov · CMMC · M365 GCC-High.',
    images: ['/og-image.png'],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification (add your IDs after setting up)
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },

  // Category
  category: 'technology',

  // Other
  other: {
    'msapplication-TileColor': '#0D9488',
    'theme-color': '#FFFFFF',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${ibmMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
