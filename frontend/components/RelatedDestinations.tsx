import Link from 'next/link';
import Image from 'next/image';
import { EXLPORE_DESTINATIONS, calculateDistance } from '@/lib/destinations';
import { MapPin } from 'lucide-react';

export default function RelatedDestinations({ currentId, lat, lng }: { currentId: string, lat: number, lng: number }) {
    // Find closest 3 destinations that are not the current one
    const related = EXLPORE_DESTINATIONS
        .filter(d => d.id !== currentId)
        .map(d => ({ ...d, distance: calculateDistance(lat, lng, d.lat, d.lng) }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);

    return (
        <div className="mt-20 border-t border-slate-800 pt-16">
            <h2 className="text-3xl font-black text-white mb-8 tracking-tight">Expand Your Trip: Nearby Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map(dest => (
                    <Link key={dest.id} href={`/explore/${dest.id}`} className="group block relative rounded-2xl overflow-hidden aspect-[4/3] border border-slate-800 hover:border-blue-500/50 transition-colors">
                        <Image src={dest.image} alt={dest.imageAlt || `${dest.name} Travel`} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                                {dest.name}
                            </h3>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-300 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-blue-400" /> {dest.country}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
