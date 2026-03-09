import type { Metadata } from "next";
import { Geist, Geist_Mono, Sacramento } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Suspense } from 'react';
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import AuthHandler from "@/components/AuthHandler";
import SmoothScroll from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

const cursive = Sacramento({
  variable: "--font-cursive",
  weight: "400",
  subsets: ["latin"],
  display: 'swap',
});



import Script from "next/script";

import { GOOGLE_CLIENT_ID, SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Weekend Travellers | Smart AI Travel Planner & Weekend Getaway Itineraries',
    template: '%s | Weekend Travellers',
  },
  description: 'Plan your perfect weekend getaway with our AI trip planner. Discover personalized 2-day and 3-day travel itineraries, road trips, and hidden gems tailored just for you.',
  keywords: [
    'weekend travellers',
    'weekend trip planner',
    'best AI travel planner 2026',
    'personalized travel guide',
    'short getaways',
    'road trip planner AI',
    'travel itinerary builder',
    'vacation planner',
    'AI trip creator',
    '2 day trip itineraries',
    '3 day holiday planner',
    'best weekend getaways',
    'weekend trip ideas'
  ],
  authors: [{ name: 'Weekend Travellers Team' }],
  creator: 'Weekend Travellers',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://weekendtravellers.com',
    title: 'Weekend Travellers | Smart AI Travel Planner & Weekend Getaway Itineraries',
    description: 'Plan your perfect short getaway with Weekend Travellers. Get instant personalized 2-to-3 day itineraries using our intelligent travel guide AI.',
    siteName: 'Weekend Travellers',
    images: [
      {
        url: '/icon.svg',
        width: 1200,
        height: 630,
        alt: 'Weekend Travellers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Weekend Travellers | Smart AI Travel Planner & Weekend Getaway Itineraries',
    description: 'Plan your perfect short getaway with Weekend Travellers. Get instant personalized 2-to-3 day itineraries using our intelligent travel guide AI.',
    images: ['/icon.svg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.svg',
  },
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
  other: {
    'agd-partner-manual-verification': '',
    'google-adsense-account': 'ca-pub-9460255466960810',
  },
  alternates: {
    canonical: '/',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Weekend Travellers',
  url: 'https://weekendtravellers.com',
  logo: 'https://weekendtravellers.com/icon.svg',
  description: 'AI-powered personalized weekend trip planner for curated 2-3 day itineraries.',
  sameAs: [
    'https://instagram.com/weekendtravellers.official',
    'https://youtube.com/@weekendtravellers.official'
  ]
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Weekend Travellers',
  url: 'https://weekendtravellers.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://weekendtravellers.com/search?destination={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cursive.variable} antialiased`}
        suppressHydrationWarning
      >
        <script
          src="https://quge5.com/88/tag.min.js"
          data-zone="217835"
          data-cfasync="false"
          async
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9460255466960810"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4FBK6YT104"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-4FBK6YT104');
        `}
        </Script>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <SmoothScroll>
          {children}
          <Suspense fallback={null}>
            <AuthHandler />
          </Suspense>
          <ScrollProgress />
          <Footer />
        </SmoothScroll>
        <Toaster position="top-center" richColors toastOptions={{ className: '!z-[9999]' }} />
      </body>
    </html>
  );
}
