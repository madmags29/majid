import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EXLPORE_DESTINATIONS } from '@/lib/destinations';
import { getDestinationEditorialMeta, getDestinationRegion, REGION_HUBS } from '@/lib/destinationMetadata';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, Wallet, Users, Plane, Train, Car, ShieldAlert, Utensils, BookOpen } from 'lucide-react';
import InnerHeader from '@/components/InnerHeader';
import ShareTripButton from '@/components/ShareTripButton';
import DirectItineraryDisplay from '@/components/DirectItineraryDisplay';
import ItineraryDisplay from '@/components/ItineraryDisplay';
import RelatedDestinations from '@/components/RelatedDestinations';
import { IS_BUILD } from '@/lib/config';
import Breadcrumbs from '@/components/Breadcrumbs';

interface Props {
    params: Promise<{ slug: string }>;
}

// Generate static params for destinations + regional category hubs
export async function generateStaticParams() {
    const destParams = EXLPORE_DESTINATIONS.map((dest) => ({ slug: dest.id }));
    const hubParams = Object.keys(REGION_HUBS)
        .filter(id => !EXLPORE_DESTINATIONS.some(d => d.id === id))
        .map(id => ({ slug: id }));
    return [...destParams, ...hubParams];
}

// Generate Dynamic SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const hub = REGION_HUBS[slug];
    const destination = EXLPORE_DESTINATIONS.find((d) => d.id === slug);

    if (hub && (!destination || slug === 'india' || slug === 'europe')) {
        return {
            title: hub.title,
            description: hub.description,
            alternates: { canonical: `/explore/${slug}` },
        };
    }

    if (!destination) {
        return {
            title: 'Destination Not Found | Weekend Travellers',
            description: 'The requested destination could not be found.',
        };
    }

    const titleName = destination.name;
    const title = `${titleName}, ${destination.country} Weekend Travel Guide & Itinerary`;
    const description = `Practical 2-to-3 day weekend travel guide for ${titleName}, ${destination.country}: best season, transport routes, estimated daily budget, and day-by-day itinerary.`;

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
    const hub = REGION_HUBS[slug];
    const destination = EXLPORE_DESTINATIONS.find((d) => d.id === slug);

    // Render Regional Category Hub for india, europe, asia, americas, middle-east
    if (hub && (!destination || slug === 'india' || slug === 'europe')) {
        const regionalDestinations = EXLPORE_DESTINATIONS.filter(
            d => d.id !== slug && getDestinationRegion(d) === hub.regionKey
        );

        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <InnerHeader title={hub.name} subtitle="Regional Hub" showBack backHref="/explore" />
                <div className="max-w-6xl mx-auto px-6 pt-6">
                    <Breadcrumbs
                        items={[
                            { label: 'Explore', href: '/explore' },
                            { label: hub.name, href: `/explore/${hub.id}`, active: true },
                        ]}
                    />
                </div>

                <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
                    <header className="space-y-4 max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">{hub.title}</h1>
                        <p className="text-lg text-slate-300 leading-relaxed">{hub.description}</p>
                        <ul className="flex flex-wrap gap-3 pt-2">
                            {hub.highlights.map(h => (
                                <li key={h} className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                                    {h}
                                </li>
                            ))}
                        </ul>
                    </header>

                    <section aria-label={`${hub.name} destinations`}>
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Curated {hub.name} Guides ({regionalDestinations.length})
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {regionalDestinations.map(dest => {
                                const meta = getDestinationEditorialMeta(dest);
                                return (
                                    <Link
                                        key={dest.id}
                                        href={`/explore/${dest.id}`}
                                        className="group relative h-80 rounded-3xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all shadow-xl block"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent z-10" />
                                        <Image
                                            src={dest.image}
                                            alt={dest.imageAlt || `${dest.name}, ${dest.country}`}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                        <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                                            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{dest.country}</span>
                                            <h3 className="text-2xl font-black text-white mt-1 mb-1">{dest.name}</h3>
                                            <p className="text-xs text-slate-300 mb-3">{meta.bestTime.split('(')[0].trim()} &bull; {meta.budgetTier}</p>
                                            <span className="inline-block bg-white text-slate-950 rounded-full font-bold px-4 py-1.5 text-xs group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                                View Guide
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                </main>
            </div>
        );
    }

    if (!destination) {
        notFound();
    }

    const editorialMeta = getDestinationEditorialMeta(destination);

    // SSR Fetch Deep Explore Content (includes itinerary and long-form SEO text)
    let exploreData = null;
    const rawBackendUrl = process.env.BACKEND_URL
        || process.env.NEXT_PUBLIC_API_URL
        || 'https://backend-flax-eight-93.vercel.app';
    const backendUrl = rawBackendUrl.replace('localhost', '127.0.0.1');
    const fallbackUrl = 'https://backend-flax-eight-93.vercel.app';

    if (!(IS_BUILD && (backendUrl.includes('localhost') || backendUrl.includes('127.0.0.1')))) {
        for (const url of [backendUrl, ...(backendUrl !== fallbackUrl ? [fallbackUrl] : [])]) {
            try {
                const response = await fetch(`${url}/api/explore?slug=${encodeURIComponent(destination.id)}`, {
                    next: { revalidate: 604800 },
                    signal: AbortSignal.timeout(4000),
                });
                if (response.ok) {
                    exploreData = await response.json();
                    break;
                }
            } catch {
                // Fall back to production backend or client-side DirectItineraryDisplay
            }
        }
    }

    const itinerary = exploreData?.days || exploreData?.itinerary;
    const deepContent = exploreData?.deep_content;

    // Safety check for trip_details during build/SSR to prevent "Cannot read properties of undefined (reading 'estimated_budget')"
    const tripDetails = exploreData?.trip_details || {
        estimated_budget: 'Moderate',
        currency: 'USD',
        best_time_to_visit: 'Year-round',
        destination_coordinates: { lat: destination.lat, lng: destination.lng },
        hotel_suggestions: []
    };

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
        },
        touristType: ['Weekend Travelers', 'Backpackers', 'Couples', 'Solo Travelers'],
        speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['h1', '.destination-summary-text']
        }
    };

    const tripSchema = {
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: `Weekend Trip to ${destination.name}`,
        description: `Customized 2-3 day weekend travel itinerary for ${destination.name}, ${destination.country}.`,
        touristType: 'Weekend Trip',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: tripDetails.currency || 'USD'
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(tripSchema) }}
            />
            <InnerHeader 
                title={destination.name} 
                subtitle="Curated Destination" 
                showBack 
                backHref="/explore" 
                actions={<ShareTripButton destination={destination.name} variant="header" />}
            />
            
            <div className="max-w-6xl mx-auto px-4 pt-4">
                <Breadcrumbs 
                    items={[
                        { label: 'Explore', href: '/explore' },
                        { label: destination.name, href: `/explore/${destination.id}`, active: true }
                    ]} 
                />
            </div>
            
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
                                {destination.name} excels as a short-stay destination due to its accessibility and high density of attractions. Whether you&rsquo;re a solo traveler, a couple on a romantic escape, or a family looking for a quick adventure, the city provides a diverse range of activities that can be comfortably covered in a 2 to 3-day window.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-purple-400">Cultural Context & Local Vibe</h3>
                            <p className="text-slate-300 leading-relaxed">
                                Visiting {destination.name} is about more than just sightseeing; it&apos;s about soaking in the unique local atmosphere. From the traditional architecture to the modern culinary scene, every corner tells a story. Our AI-curated plan below ensures you hit the most authentic spots that represent the true heart of {destination.country}.
                            </p>
                        </div>
                    </div>

                    {/* Dynamic Deep Content (SEO Rich Text) */}
                    {deepContent && (
                        <div 
                            className="mt-20 prose prose-invert max-w-none 
                            prose-h2:text-3xl prose-h2:font-black prose-h2:text-blue-400 prose-h2:italic prose-h2:uppercase
                            prose-p:text-slate-400 prose-p:leading-relaxed"
                            dangerouslySetInnerHTML={{ 
                                __html: deepContent.replace(/<br\/><br\/>/g, '<div class="h-4"></div>') 
                            }} 
                        />
                    )}

                    <div className="mt-16 p-8 rounded-3xl bg-slate-900/50 border border-slate-800 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                        <div className="space-y-1.5">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-blue-400" /> Best Time to Visit
                            </div>
                            <div className="text-sm font-semibold text-white">{editorialMeta.bestTime}</div>
                        </div>
                        <div className="space-y-1.5">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Wallet className="w-3.5 h-3.5 text-emerald-400" /> Est. Daily Budget
                            </div>
                            <div className="text-sm font-semibold text-white">{editorialMeta.dailyBudgetEstimate}</div>
                        </div>
                        <div className="space-y-1.5">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-purple-400" /> Who Should Visit
                            </div>
                            <div className="text-sm font-semibold text-white">{editorialMeta.suitability.join(', ')}</div>
                        </div>
                        <div className="space-y-1.5">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-amber-400" /> Ideal Duration
                            </div>
                            <div className="text-sm font-semibold text-white">{editorialMeta.idealDuration}</div>
                        </div>
                    </div>

                    {/* Structured Practical Planning Guide */}
                    <div className="mt-12 grid md:grid-cols-3 gap-6 text-left">
                        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
                            <h3 className="font-bold text-white flex items-center gap-2 text-base">
                                <Plane className="w-4 h-4 text-blue-400" /> By Air
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">{editorialMeta.howToReach.air}</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
                            <h3 className="font-bold text-white flex items-center gap-2 text-base">
                                <Train className="w-4 h-4 text-purple-400" /> By Rail
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">{editorialMeta.howToReach.rail}</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
                            <h3 className="font-bold text-white flex items-center gap-2 text-base">
                                <Car className="w-4 h-4 text-emerald-400" /> By Road
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">{editorialMeta.howToReach.road}</p>
                        </div>
                    </div>

                    <div className="mt-6 grid md:grid-cols-2 gap-6 text-left">
                        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
                            <h3 className="font-bold text-white flex items-center gap-2 text-base">
                                <Utensils className="w-4 h-4 text-amber-400" /> Local Food Highlights
                            </h3>
                            <p className="text-sm text-slate-300 leading-relaxed">{editorialMeta.localFood}</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
                            <h3 className="font-bold text-white flex items-center gap-2 text-base">
                                <ShieldAlert className="w-4 h-4 text-rose-400" /> Safety &amp; Accessibility
                            </h3>
                            <p className="text-sm text-slate-300 leading-relaxed">{editorialMeta.safetyAndAccessibility}</p>
                        </div>
                    </div>
                </section>

                <section className="max-w-6xl mx-auto px-4 pb-24">
                    {itinerary ? (
                        <div className="mt-12 bg-slate-900/40 rounded-3xl p-6 md:p-10 border border-slate-800 shadow-2xl text-left">
                            <h2 className="text-3xl font-black text-white mb-10 text-center tracking-tight">Your 2-Day Weekend Itinerary</h2>
                            <ItineraryDisplay itinerary={{ ...exploreData, days: itinerary, trip_details: tripDetails }} />
                        </div>
                    ) : (
                        <DirectItineraryDisplay destinationName={destination.name} />
                    )}
                </section>

                <section className="max-w-6xl mx-auto px-4 pb-20">
                    <RelatedDestinations currentId={destination.id} lat={destination.lat} lng={destination.lng} />
                </section>

                {/* Editorial Transparency & Sources Box */}
                <section className="container mx-auto px-4 py-12 lg:max-w-4xl border-t border-white/5">
                    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                        <div className="space-y-2">
                            <div className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5" /> Editorial Notes &amp; Estimates
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                                Compiled by the <Link href="/authors" className="text-slate-200 underline">Weekend Travellers Editorial Team</Link>. Budget ranges and drive times are planning estimates—not live quotes. Check our{' '}
                                <Link href="/editorial-policy" className="text-blue-400 hover:underline">Editorial Policy</Link>,{' '}
                                <Link href="/disclaimer" className="text-blue-400 hover:underline">Disclaimer</Link>, or{' '}
                                <Link href="/corrections-policy" className="text-blue-400 hover:underline">report an update</Link>.
                            </p>
                        </div>
                        <Link href="/tools" className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shrink-0">
                            Open Budget Calculator
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
