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
    default: 'Weekend Travellers | AI Travel Planner & Weekend Getaways in India',
    template: '%s | Weekend Travellers',
  },
  description: 'Plan your perfect weekend getaway in India with our AI trip planner. Customized 2-day itineraries from Delhi, Mumbai, Bangalore & more. Discover hidden gems and short road trips.',
  keywords: [
    'weekend travellers', 'AI trip planner India', 'weekend getaways from Delhi', 
    'short trips from Mumbai', 'weekend itineraries Bangalore', '2 day trip India', 
    'road trips in India', 'AI travel guide India', 'best weekend destinations India',
    'travel planner 2026', 'weekend escape India'
  ],
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
  authors: [{ name: 'Weekend Travellers Team' }],
  creator: 'Weekend Travellers',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://weekendtravellers.com',
    title: 'Weekend Travellers | AI Travel Planner & Weekend Getaways in India',
    description: 'Plan your perfect weekend getaway in India with our AI trip planner. Customized 2-day itineraries from Delhi, Mumbai, Bangalore & more.',
    siteName: 'Weekend Travellers',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Weekend Travellers India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Weekend Travellers | AI Travel Planner India',
    description: 'Plan your perfect weekend getaway in India with our AI trip planner.',
    images: ['/og-image.png'],
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
import CookieConsent from "@/components/CookieConsent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9460255466960810"
          crossOrigin="anonymous"
          strategy="lazyOnload"
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
