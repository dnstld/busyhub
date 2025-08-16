import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'BusyHub — AI-Powered Calendar Insights',
  description:
    'Transform Google Calendar into AI-driven productivity analytics',
  keywords: [
    'calendar heatmap',
    'Google Calendar visualization',
    'productivity tracker',
    'calendar analytics',
    'busyhub',
    'calendar app for busy people',
    'AI productivity insights',
    'time management',
    'meeting optimization',
    'calendar productivity',
    'visualize calendar events',
    'calendar insights',
    'busy schedule management',
    'AI calendar assistant',
    'calendar heatmap app',
    'productivity analytics',
    'busyhub app',
    'calendar heatmap visualization',
    'calendar event analysis',
  ],
  metadataBase: new URL('https://www.busyhub.app'),
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
