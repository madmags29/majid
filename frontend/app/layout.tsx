import type { Metadata } from "next";
import { Geist, Geist_Mono, Sacramento, Playfair_Display, Lora } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cursive = Sacramento({
  variable: "--font-cursive",
  weight: "400",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

import Script from "next/script";

import { GOOGLE_CLIENT_ID, SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Weekend Trip Planner | Best AI Itinerary Generator for 2 & 3 Day Trips',
    template: '%s | Weekend Travellers',
  },
  description: 'AI-powered weekend trip planner for custom 2 & 3 day itineraries. Get instant travel budgets, routes, and hidden gems for your next short getaway.',
  keywords: [
    'weekend travellers',
    'weekend trip planner 2026',
    'best AI travel planner',
    'AI itinerary generator',
    'short getaways',
    'road trip planner AI',
    'travel itinerary builder',
    'personalized weekend trip',
    'free AI travel assistant',
    'smart travel planning',
    'AI trip creator',
    '2 day trip itineraries',
    '3 day holiday planner',
    'best weekend getaways 2026'
  ],
  authors: [{ name: 'Weekend Travellers Team' }],
  creator: 'Weekend Travellers',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://weekendtravellers.com',
    title: 'Weekend Travellers | Best AI-Powered Weekend Trip Planner 2025',
    description: 'Weekend Travellers is your best AI-powered companion for discovering and planning the perfect 2nd-day getaway in 2025.',
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
    title: 'Weekend Travellers | Best AI-Powered Weekend Trip Planner 2025',
    description: 'Weekend Travellers is your best AI-powered companion for discovering and planning the perfect 2nd-day getaway in 2025.',
    images: ['/icon.svg'],
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
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
    'google-adsense-account': 'ca-pub-9460255466960810',
    'agd-partner-manual-verification': '',
  },
};

import { GoogleOAuthProvider } from '@react-oauth/google';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cursive.variable} ${playfair.variable} ${lora.variable} antialiased`}
        suppressHydrationWarning
      >
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <Script
            id="adsense-init"
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
          <Script id="travelpayouts-tracking" strategy="afterInteractive" data-noptimize="1" data-cfasync="false" data-wpfc-render="false">
            {`
            (function () {
                var script = document.createElement("script");
                script.async = 1;
                script.src = 'https://emrld.ltd/NDk3Nzc5.js?t=497779';
                document.head.appendChild(script);
            })();
          `}
          </Script>
          {children}
          <Footer />
          <Toaster position="top-center" richColors toastOptions={{ className: '!z-[9999]' }} />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
