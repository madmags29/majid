import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'All Destinations | 50+ Curated Weekend Getaways | Weekend Travellers',
    description: 'Browse our complete directory of 50+ hand-picked travel destinations. From historical cities in Europe to tropical beaches in Asia, find your perfect weekend trip.',
    keywords: ['all destinations', 'travel directory', 'vacation spots list', 'global getaways', 'weekend travel locations'],
    openGraph: {
        title: 'All Destinations | 50+ Curated Weekend Getaways | Weekend Travellers',
        description: 'Browse our complete directory of 50+ hand-picked travel destinations. From historical cities in Europe to tropical beaches in Asia, find your perfect weekend trip.',
        type: 'website',
    }
};

export default function ExploreAllLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
