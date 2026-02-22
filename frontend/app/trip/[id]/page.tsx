import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, Calendar, Clock, Share2 } from 'lucide-react';
import ItineraryDisplay from '@/components/ItineraryDisplay';
import InnerHeader from '@/components/InnerHeader';

interface Props {
    params: { id: string };
}

async function getTrip(id: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
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

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30 pb-20">
            <InnerHeader
                title={destination}
                subtitle="Curated Trip"
                showBack
                backHref="/explore"
                actions={
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-full text-sm font-bold transition-colors">
                        <Share2 className="w-4 h-4" /> Share Trip
                    </button>
                }
            />

            <main className="pt-16">
                {/* Immersive Hero Header */}
                <div className="relative h-[50vh] min-h-[400px] w-full">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={heroImage}
                            alt={destination}
                            fill
                            priority
                            className="object-cover"
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90" />
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-10 max-w-5xl mx-auto xl:px-0">
                        <div className="flex flex-wrap items-center gap-3 mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 backdrop-blur-md border border-blue-500/30 rounded-lg text-xs font-bold text-blue-300 uppercase tracking-widest">
                                <MapPin className="w-3.5 h-3.5" /> Destination
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-lg text-xs font-bold text-slate-300 uppercase tracking-widest">
                                <Calendar className="w-3.5 h-3.5" /> {itinerary.days?.length || 2} Days
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            {destination}
                        </h1>

                        <div className="flex items-center gap-4 text-sm text-slate-400 font-medium animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 opacity-70" /> Generated on {createdDate}
                            </span>
                            {itinerary.budget && (
                                <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                                    <span className="capitalize">{itinerary.budget} Budget</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Itinerary Content Engine */}
                <div className="max-w-5xl mx-auto px-4 lg:px-8 mt-12">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8">
                        <ItineraryDisplay itinerary={itinerary} />
                    </div>
                </div>
            </main>
        </div>
    );
}
