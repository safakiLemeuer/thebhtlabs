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
  title: 'TheBHTLabs — AI Readiness, Automation & Upskilling | BHT Solutions',
  description: 'Free 35-point AI readiness assessment, ROI calculator, AI policy generator, compliance tracker. By BHT Solutions, SBA 8(a) certified.',
  keywords: 'AI readiness assessment, Copilot Studio, Microsoft 365, CMMC compliance, AI automation, small business AI, federal IT, AI governance, AI upskilling, ROI calculator, AI policy',
  openGraph: {
    title: 'TheBHTLabs — Stop talking about AI. Start shipping it.',
    description: 'Free AI readiness tools: 35-point assessment with PDF report, ROI calculator, AI policy generator, compliance countdown. By BHT Solutions.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${ibmMono.variable}`}>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
