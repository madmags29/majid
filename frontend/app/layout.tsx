import type { Metadata } from "next";
import { Geist, Geist_Mono, Sacramento } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Suspense } from 'react';
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import AuthHandler from "@/components/AuthHandler";

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
    default: 'Weekend Trip Planner | Personalized Travel Guide & Itineraries',
    template: '%s | Weekend Travellers',
  },
  description: 'Plan your perfect weekend getaway with our smart trip planner. Get personalized 2 & 3 day itineraries, budget estimates, and hidden gems.',
  keywords: [
    'weekend travellers',
    'weekend trip planner 2026',
    'best AI travel planner',
    'personalized travel guide',
    'smart trip planner',
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
        className={`${geistSans.variable} ${geistMono.variable} ${cursive.variable} antialiased`}
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
          <Script id="travelpayouts-tracking" strategy="lazyOnload">
            {`
            (function () {
                var script = document.createElement("script");
                script.async = 1;
                script.src = 'https://emrld.ltd/NDk3Nzc5.js?t=497779';
                document.head.appendChild(script);
            })();
          `}
          </Script>
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "vjw5h56f3v");
            `}
          </Script>
          {children}
          <Suspense fallback={null}>
            <AuthHandler />
          </Suspense>
          <ScrollProgress />
          <Footer />
          <Toaster position="top-center" richColors toastOptions={{ className: '!z-[9999]' }} />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
