import { Metadata } from 'next';
import { EXLPORE_DESTINATIONS, DestinationOption } from '@/lib/destinations';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowLeft, Search } from 'lucide-react';
import InnerHeader from '@/components/InnerHeader';

import ExploreItineraryButton from '@/components/ExploreItineraryButton';

interface Props {
    params: { slug: string };
}

// Generate static params for all hardcoded destinations to pre-render them
export async function generateStaticParams() {
    return EXLPORE_DESTINATIONS.map((dest) => ({
        slug: dest.id,
    }));
}

// Generate Dynamic SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const destination = EXLPORE_DESTINATIONS.find((d) => d.id === slug);

    if (!destination) {
        return {
            title: 'Destination Not Found | Weekend Travellers',
            description: 'The requested destination could not be found.'
        };
    }

    const titleName = destination.name;
    const title = `Explore ${titleName}, ${destination.country} | Weekend Travellers`;
    const description = `Discover the best 3-day weekend itineraries and things to do in ${titleName}, ${destination.country}. Plan your perfect trip with AI-powered suggestions.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [{ url: destination.image, width: 1200, height: 630, alt: titleName }],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [destination.image],
        }
    };
}

export default async function DestinationPage({ params }: Props) {
    const { slug } = await params;
    const destination = EXLPORE_DESTINATIONS.find((d) => d.id === slug);

    if (!destination) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
                <InnerHeader title="Not Found" subtitle="Destination" showBack backHref="/explore" />
                <h1 className="text-4xl font-bold mb-4 text-slate-300">Destination Not Found</h1>
                <Link href="/explore" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Explore
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
            <InnerHeader title={destination.name} subtitle="Curated Destination" showBack backHref="/explore" />
            <main>
                {/* Hero Section */}
                <section className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={destination.image}
                            alt={destination.name}
                            fill
                            priority
                            className="object-cover"
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/20 to-slate-950 opacity-90" />
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
                    </div>

                    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 animate-fade-in-up">
                            <MapPin className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-bold tracking-widest uppercase text-slate-200">
                                {destination.country}
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl tracking-tight">
                            {destination.name}
                        </h1>
                        <div className="flex flex-wrap justify-center gap-3 mb-10">
                            {destination.tags.map((tag) => (
                                <span key={tag} className="px-3 py-1 bg-slate-800/60 backdrop-blur border border-slate-700 rounded-lg text-sm font-medium text-slate-300">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <ExploreItineraryButton destinationName={destination.name} />
                    </div>
                </section>

                <section className="max-w-4xl mx-auto px-4 py-20 text-center">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400 mb-6">
                        Why visit {destination.name}?
                    </h2>
                    <p className="text-xl text-slate-400 leading-relaxed font-light">
                        {destination.name} is one of our hand-picked curated destinations. Known for its incredible scenery, authentic culture, and unforgettable experiences, it's the perfect spot for a weekend getaway. Click the button above to generate a highly detailed, personalized AI itinerary complete with recommended flights, hotels, and daily activities.
                    </p>
                </section>
            </main>
        </div>
    );
}
