import { Metadata } from 'next';
import SuspendedSearchClient from './SearchClient';

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const params = await searchParams;
    const destination = params.destination;

    const title = destination
        ? decodeURIComponent(destination as string)
        : 'Plan Your Perfect Escape | Smart Weekend Itineraries';

    const description = destination
        ? `Plan your perfect weekend trip to ${decodeURIComponent(destination as string)} with our smart itinerary planner. Get custom itineraries, budget estimates, and hidden gems.`
        : 'Instant AI-generated weekend itineraries tailored to your style. Explore driving routes, best hotels, and curated travel plans for the perfect 2-day trip.';

    return {
        title,
        description,
    };
}

export default function SearchPage() {
    return <SuspendedSearchClient />;
}
