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
  metadataBase: new URL('https://weekendtravellers.com'), // Replace with actual domain when deployed
  title: {
    default: 'Weekend Travellers',
    template: '%s | Weekend Travellers',
  },
  description: 'Discover your perfect weekend getaway. Plan, save, and share your adventures with ease using our AI-powered travel companion.',
  keywords: ['weekend trip', 'travel planner', 'getaway', 'vacation', 'AI travel', 'road trip', 'adventure', 'weekend travellers'],
  authors: [{ name: 'Weekend Travellers Team' }],
  creator: 'Weekend Travellers',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://weekendtravellers.com',
    title: 'Weekend Travellers - Your AI Weekend Trip Planner',
    description: 'Discover your perfect weekend getaway. Plan, save, and share your adventures with ease.',
    siteName: 'Weekend Travellers',
    images: [
      {
        url: '/og-image.jpg', // We should add an actual OG image later
        width: 1200,
        height: 630,
        alt: 'Weekend Travellers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Weekend Travellers - Your AI Weekend Trip Planner',
    description: 'Discover your perfect weekend getaway. Plan, save, and share your adventures with ease.',
    images: ['/twitter-image.jpg'],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cursive.variable} antialiased`}
      >
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
      </body>
    </html>
  );
}
