import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });
import Script from "next/script";

export const metadata: Metadata = {
    title: "Weekend Travellers | Admin Dashboard",
    description: "Production-ready management console for WeekendTravellers.com",
    other: {
        'agd-partner-manual-verification': '',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-slate-50 dark:bg-zinc-950`}>
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
                <Toaster position="top-right" richColors />
            </body>
        </html>
    );
}
