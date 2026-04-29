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
import { GoogleAnalytics } from "@next/third-parties/google";

import { GOOGLE_CLIENT_ID, SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Weekend Travellers | Global AI Travel Planner & Weekend Getaways',
    template: '%s | Weekend Travellers',
  },
  description: 'Plan your perfect weekend getaway globally with our AI trip planner. Generate customized travel itineraries, discover hidden gems, and explore worldwide destinations seamlessly.',
  keywords: [
        'AI travel planner', 'AI trip planner', 'best AI travel planner', 'vacation itinerary generator', 'custom travel itineraries', 'holiday planner AI', 'weekend getaway planner', 'weekend trip generator', 'global travel planner', 'AI travel guide', 'free AI travel planner', 'weekend travellers', 'road trip planner AI', 'AI travel assistant', 'smart travel itinerary', 'travel planner 2026', 'best travel destinations globally', 'AI trip planner destinations', 'top vacation spots worldwide', 'global weekend getaways'
    ],
  authors: [{ name: 'Weekend Travellers Team' }],
  creator: 'Weekend Travellers',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://weekendtravellers.com',
    title: 'Weekend Travellers | Global AI Travel Planner & Weekend Getaways',
    description: 'Plan your perfect weekend getaway globally with our AI trip planner. Generate customized travel itineraries and discover hidden gems worldwide.',
    siteName: 'Weekend Travellers',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Weekend Travellers Global',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Weekend Travellers | Global AI Travel Planner',
    description: 'Plan your perfect weekend getaway globally with our AI trip planner.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
import CookieConsent from "@/components/CookieConsent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9460255466960810"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cursive.variable} antialiased`}
        suppressHydrationWarning
      >
        <GoogleAnalytics gaId="G-4FBK6YT104" />

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
          <CookieConsent />
        </SmoothScroll>
        <Toaster position="top-center" richColors toastOptions={{ className: '!z-[9999]' }} />
      </body>
    </html>
  );
}
