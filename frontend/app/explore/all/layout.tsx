import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'All Destinations | 50+ Curated Weekend Getaways | Weekend Travellers',
    description: 'Browse our complete directory of 50+ hand-picked travel destinations. From historical cities in Europe to tropical beaches in Asia, find your perfect weekend trip.',
    keywords: ['all destinations', 'travel directory', 'vacation spots list', 'global getaways', 'weekend travel locations', 'best weekend trips', 'AI travel generator', 'top 50 places to travel', 'holiday ideas', 'vacation planner'],
    openGraph: {
        title: 'All Destinations | 50+ Curated Weekend Getaways | Weekend Travellers',
        description: 'Browse our complete directory of 50+ hand-picked travel destinations. From historical cities in Europe to tropical beaches in Asia, find your perfect weekend trip.',
        type: 'website',
    },
    alternates: {
        canonical: '/explore/all',
    },
};

export default function ExploreAllLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
