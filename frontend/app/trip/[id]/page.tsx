import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, Calendar, Clock, Sparkles } from 'lucide-react';
import ItineraryDisplay from '@/components/ItineraryDisplay';
import InnerHeader from '@/components/InnerHeader';
import ShareTripButton from '@/components/ShareTripButton';
import Breadcrumbs from '@/components/Breadcrumbs';

interface Props {
    params: { id: string };
}

async function getTrip(id: string) {
    const apiUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'https://backend-flax-eight-93.vercel.app';
    const res = await fetch(`${apiUrl}/api/trips/${id}`, { next: { revalidate: 3600 } });

    if (!res.ok) {
        return null;
    }
    return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const trip = await getTrip(id);

    if (!trip || !trip.itinerary) {
        return {
            title: 'Trip Not Found | Weekend Travellers',
            description: 'This itinerary does not exist or has been removed.'
        };
    }

    const { destination, itinerary } = trip;
    const heroImage = itinerary.heroImage?.url || itinerary.days?.[0]?.activities?.[0]?.imageUrl || 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1200';
    const title = `${destination} Weekend Trip | Weekend Travellers`;
    const description = itinerary.summary || `Discover a complete AI-generated itinerary for ${destination}.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [{ url: heroImage, width: 1200, height: 630, alt: destination }],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [heroImage],
        }
    };
}

export default async function TripPage({ params }: Props) {
    const { id } = await params;
    const trip = await getTrip(id);

    if (!trip || !trip.itinerary) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
                <InnerHeader showBack backHref="/explore" />
                <h1 className="text-4xl font-bold mb-4 text-slate-300">Itinerary Not Found</h1>
                <p className="text-slate-500 mb-8">This trip may have been deleted or never existed.</p>
                <Link href="/explore" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center shadow-lg shadow-blue-500/20">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Explore
                </Link>
            </div>
        );
    }

    const { destination, itinerary, createdAt } = trip;
    const createdDate = new Date(createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const heroImage = itinerary.heroImage?.url || itinerary.days?.[0]?.activities?.[0]?.imageUrl || 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1200';

    const tripSchema = {
        '@context': 'https://schema.org',
        '@type': 'Trip',
        name: `${destination} Weekend Getaway Itinerary`,
        description: itinerary.summary || `Personalized AI weekend itinerary for ${destination}.`,
        itinerary: {
            '@type': 'ItemList',
            numberOfItems: itinerary.days?.length || 2,
            itemListElement: itinerary.days?.map((day: any, idx: number) => ({
                '@type': 'ListItem',
                position: idx + 1,
                name: `Day ${day.day || idx + 1}: ${day.title || destination}`,
                description: day.summary || day.activities?.map((a: any) => a.title).join(', ')
            }))
        },
        touristType: ['Weekend Traveler', 'Vacationer'],
        provider: {
            '@type': 'Organization',
            name: 'Weekend Travellers',
            url: 'https://weekendtravellers.com'
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30 pb-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(tripSchema) }}
            />
            <InnerHeader
                title={destination}
                subtitle="Curated Trip"
                showBack
                backHref="/explore"
                actions={<ShareTripButton destination={destination} variant="header" />}
            />

            <div className="max-w-5xl mx-auto px-4 lg:px-8 pt-4">
                <Breadcrumbs
                    items={[
                        { label: 'Explore', href: '/explore' },
                        { label: `${destination} Trip`, href: `/trip/${id}`, active: true }
                    ]}
                />
            </div>

            <main className="pt-4">
                {/* Immersive Hero Header */}
                <div className="max-w-5xl mx-auto px-4 lg:px-8">
                    <div className="relative h-[48vh] min-h-[380px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                        <div className="absolute inset-0 z-0">
                            <Image
                                src={heroImage}
                                alt={destination}
                                fill
                                priority
                                className="object-cover"
                                sizes="(max-width: 1200px) 100vw, 1024px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-95" />
                        </div>

                        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 z-10">
                            <div className="flex flex-wrap items-center gap-2.5 mb-3 animate-fade-in-up">
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/25 backdrop-blur-md border border-blue-400/30 rounded-full text-xs font-bold text-blue-300 uppercase tracking-wider">
                                    <MapPin className="w-3.5 h-3.5" /> Destination
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-full text-xs font-bold text-slate-200 uppercase tracking-wider">
                                    <Calendar className="w-3.5 h-3.5" /> {itinerary.days?.length || 2} Days
                                </span>
                                {itinerary.budget && (
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-full text-xs font-bold text-emerald-300 uppercase tracking-wider capitalize">
                                        <Sparkles className="w-3.5 h-3.5" /> {itinerary.budget}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-2xl">
                                        {destination}
                                    </h1>
                                    <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-400 font-medium mt-2">
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 opacity-70" /> Generated on {createdDate}
                                        </span>
                                    </div>
                                </div>

                                <div className="shrink-0 flex items-center gap-2">
                                    <ShareTripButton destination={destination} variant="outline" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Itinerary Content Engine */}
                <div className="max-w-5xl mx-auto px-4 lg:px-8 mt-8">
                    <div className="bg-slate-900/90 border border-slate-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8">
                        <ItineraryDisplay itinerary={itinerary} />
                    </div>
                </div>
            </main>
        </div>
    );
}
