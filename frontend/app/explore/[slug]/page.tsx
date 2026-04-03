import { Metadata } from 'next';
import { EXLPORE_DESTINATIONS } from '@/lib/destinations';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowLeft } from 'lucide-react';
import InnerHeader from '@/components/InnerHeader';
import DirectItineraryDisplay from '@/components/DirectItineraryDisplay';
import ItineraryDisplay from '@/components/ItineraryDisplay';
import RelatedDestinations from '@/components/RelatedDestinations';

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
    const title = `${titleName}, ${destination.country} Perfect Weekend Guide & Itinerary | Weekend Travellers`;
    const description = `Looking for the best things to do in ${titleName}? Explore our expert AI-generated 2-day weekend itinerary for ${titleName}, ${destination.country}, including top attractions, budget estimates, flights, and hidden gems.`;

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
        },
        alternates: {
            canonical: `/explore/${slug}`,
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

    // SSR Fetch Itinerary
    let itinerary = null;
    try {
        const { API_URL, IS_BUILD } = require('@/lib/config');

        // During build, if pointing to local, skip fetching to avoid ECONNREFUSED/timeout
        if (IS_BUILD && (API_URL.includes('localhost') || API_URL.includes('127.0.0.1'))) {
            console.log(`Skipping itinerary fetch for ${destination.name} during build...`);
        } else {
            const response = await fetch(`${API_URL}/api/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    destination: destination.name,
                    days: 2,
                }),
                next: { revalidate: 604800 }
            });
            if (response.ok) {
                itinerary = await response.json();
            }
        }
    } catch (e) {
        console.error("Failed to SSR itinerary", e);
    }

    const destinationSchema = {
        '@context': 'https://schema.org',
        '@type': 'TouristDestination',
        name: destination.name,
        description: `Explore our expert AI-generated 2-day weekend itinerary for ${destination.name}, ${destination.country}, including top attractions, budget estimates, flights, and hidden gems.`,
        image: destination.image,
        address: {
            '@type': 'PostalAddress',
            addressCountry: destination.country
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: destination.lat,
            longitude: destination.lng
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationSchema) }}
            />
            <InnerHeader title={destination.name} subtitle="Curated Destination" showBack backHref="/explore" />
            <main>
                {/* Hero Section */}
                <section className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={destination.image}
                            alt={destination.imageAlt || `${destination.name}, ${destination.country} Travel Destination`}
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
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 drop-shadow-2xl tracking-tight leading-tight">
                            {destination.name} <span className="block text-2xl md:text-3xl text-slate-300 font-bold mt-2">Travel Guide: Weekend Itinerary & Top Things to Do</span>
                        </h1>
                        <div className="flex flex-wrap justify-center gap-3 mb-10">
                            {destination.tags.map((tag) => (
                                <span key={tag} className="px-3 py-1 bg-slate-800/60 backdrop-blur border border-slate-700 rounded-lg text-sm font-medium text-slate-300">
                                    {tag}
                                </span>
                            ))}
                        </div>

                    </div>
                </section>

                <section className="max-w-4xl mx-auto px-4 py-20">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight uppercase italic">
                            Experience {destination.name}
                        </h2>
                        <p className="text-xl text-slate-400 leading-relaxed font-light">
                            {destination.name} is a premier destination curated by our expert travel team. Known for its distinct {destination.tags.join(', ')} vibes, it offers a perfect blend of relaxation and discovery for those seeking a premium weekend break in 2026.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 text-left">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-blue-400">Why It&apos;s a Weekend Favorite</h3>
                            <p className="text-slate-300 leading-relaxed">
                                {destination.name} excels as a short-stay destination due to its accessibility and high density of attractions. Whether you&apos;re a solo traveler, a couple on a romantic escape, or a family looking for a quick adventure, the city provides a diverse range of activities that can be comfortably covered in a 2 to 3-day window.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-purple-400">Cultural Context & Local Vibe</h3>
                            <p className="text-slate-300 leading-relaxed">
                                Visiting {destination.name} is about more than just sightseeing; it&apos;s about soaking in the unique local atmosphere. From the traditional architecture to the modern culinary scene, every corner tells a story. Our AI-curated plan below ensures you hit the most authentic spots that represent the true heart of {destination.country}.
                            </p>
                        </div>
                    </div>

                    <div className="mt-16 p-8 rounded-3xl bg-slate-900/50 border border-slate-800 grid md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Best Time to Visit</div>
                            <div className="text-lg font-bold text-white">Spring & Autumn</div>
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Top Highlight</div>
                            <div className="text-lg font-bold text-white">Authentic {destination.tags[0]}</div>
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Travel Style</div>
                            <div className="text-lg font-bold text-white">Premium/Boutique</div>
                        </div>
                    </div>
                </section>

                <section className="max-w-6xl mx-auto px-4 pb-24">
                    {itinerary ? (
                        <div className="mt-12 bg-slate-900/40 rounded-3xl p-6 md:p-10 border border-slate-800 shadow-2xl text-left">
                            <h2 className="text-3xl font-black text-white mb-10 text-center tracking-tight">Your 2-Day AI Itinerary</h2>
                            <ItineraryDisplay itinerary={itinerary} />
                        </div>
                    ) : (
                        <DirectItineraryDisplay destinationName={destination.name} />
                    )}
                </section>

                <section className="max-w-6xl mx-auto px-4 pb-20">
                    <RelatedDestinations currentId={destination.id} lat={destination.lat} lng={destination.lng} />
                </section>
            </main>
        </div>
    );
}
