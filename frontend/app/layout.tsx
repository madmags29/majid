import type { Metadata } from "next";
import { Geist, Geist_Mono, Sacramento } from "next/font/google";
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

import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Weekend Travellers | Best AI-Powered Weekend Trip Planner 2025',
    template: '%s | Weekend Travellers',
  },
  description: 'Weekend Travellers is your best AI-powered companion for discovering and planning the perfect 2nd-day getaway in 2025. Get instant itineraries, driving routes, and budget estimates.',
  keywords: [
    'weekend travellers',
    'weekend trip planner 2025',
    'best AI travel planner',
    'AI itinerary generator',
    'short getaways',
    'road trip planner AI',
    'travel itinerary builder',
    'personalized weekend trip',
    'free AI travel assistant',
    'smart travel planning',
    'AI trip creator',
    'best weekend getaways 2025'
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
  },
};

import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from '@/lib/config';

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
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9460255466960810"
            crossOrigin="anonymous"
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
          {children}
          <Footer />
          <Toaster position="top-center" richColors />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
