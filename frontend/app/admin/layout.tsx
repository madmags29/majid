import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Weekend Travellers | Admin Dashboard",
    description: "Production-ready management console for WeekendTravellers.com",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-slate-50 dark:bg-zinc-950`}>
                {children}
                <Toaster position="top-right" richColors />
            </body>
        </html>
    );
}
