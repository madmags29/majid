export interface DestinationOption {
    id: string;
    name: string;
    country: string;
    image: string;
    imageAlt?: string;
    lat: number;
    lng: number;
    tags: string[];
}

export const EXLPORE_DESTINATIONS: DestinationOption[] = [
    // India
    { id: 'india', name: 'India', country: 'India', image: 'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Exploring the rich cultural heritage, ancient monuments, and vibrant streets of Incredible India', lat: 20.5937, lng: 78.9629, tags: ['Culture', 'Heritage', 'Nature', 'Spiritual'] },
    { id: 'manali', name: 'Manali', country: 'India', image: 'https://images.pexels.com/photos/12366139/pexels-photo-12366139.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Snow capped Himalayan mountains and pine forests in Manali valley', lat: 32.2396, lng: 77.1887, tags: ['Mountains', 'Snow', 'Adventure', 'Nature'] },
    { id: 'shimla', name: 'Shimla', country: 'India', image: 'https://images.pexels.com/photos/10323348/pexels-photo-10323348.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Colonial architecture and scenic mountain views of Shimla hill station', lat: 31.1048, lng: 77.1734, tags: ['Mountains', 'Heritage', 'Nature'] },
    { id: 'goa', name: 'Goa', country: 'India', image: 'https://images.pexels.com/photos/28368721/pexels-photo-28368721.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Palm trees, sandy beaches, and vibrant sunset coastline in Goa, India', lat: 15.2993, lng: 74.1240, tags: ['Beaches', 'Nightlife', 'Relaxation'] },
    { id: 'mumbai', name: 'Mumbai', country: 'India', image: 'https://images.pexels.com/photos/8218461/pexels-photo-8218461.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Gateway of India and the bustling marine drive skyline in Mumbai city', lat: 19.0760, lng: 72.8777, tags: ['City', 'Culture', 'Food'] },
    { id: 'delhi', name: 'New Delhi', country: 'India', image: 'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Historic India Gate monument surrounded by New Delhi capital architecture', lat: 28.6139, lng: 77.2090, tags: ['City', 'History', 'Food'] },
    { id: 'jaipur', name: 'Jaipur', country: 'India', image: 'https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Hawa Mahal Palace of Winds with pink sandstone architecture in Jaipur Rajasthan', lat: 26.9124, lng: 75.7873, tags: ['Heritage', 'Culture', 'Architecture'] },
    { id: 'udaipur', name: 'Udaipur', country: 'India', image: 'https://images.pexels.com/photos/3310574/pexels-photo-3310574.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Romantic City Palace floating on Lake Pichola in Udaipur, Rajasthan', lat: 24.5854, lng: 73.7125, tags: ['Heritage', 'Lakes', 'Romance'] },
    { id: 'munnar', name: 'Munnar', country: 'India', image: 'https://images.pexels.com/photos/13691355/pexels-photo-13691355.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Lush green tea plantations and rolling hills in Munnar, Kerala', lat: 10.0889, lng: 77.0595, tags: ['Nature', 'Tea Gardens', 'Hills'] },
    { id: 'varanasi', name: 'Varanasi', country: 'India', image: 'https://images.pexels.com/photos/11050519/pexels-photo-11050519.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Spiritual prayers and wooden boats along the sacred Ganges river ghats in Varanasi', lat: 25.3176, lng: 82.9739, tags: ['Spiritual', 'Culture', 'Ghats'] },
    { id: 'andaman', name: 'Andaman', country: 'India', image: 'https://images.pexels.com/photos/15852923/pexels-photo-15852923.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Crystal clear blue waters and pristine white sand beaches of the Andaman Islands', lat: 11.6234, lng: 92.7265, tags: ['Beaches', 'Islands', 'Scuba'] },
    { id: 'leh', name: 'Leh Ladakh', country: 'India', image: 'https://images.pexels.com/photos/8991448/pexels-photo-8991448.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Rugged high-altitude mountain desert landscape and monasteries in Leh Ladakh', lat: 34.1526, lng: 77.5771, tags: ['Mountains', 'Adventure', 'Road Trip'] },
    { id: 'rishikesh', name: 'Rishikesh', country: 'India', image: 'https://images.pexels.com/photos/28570070/pexels-photo-28570070.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Lakshman Jhula suspension bridge over the Ganges river in Rishikesh India', lat: 30.0869, lng: 78.2676, tags: ['Spiritual', 'Yoga', 'Rafting'] },
    { id: 'agra', name: 'Agra', country: 'India', image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Beautiful white marble Taj Mahal monument reflecting in the water at sunrise, Agra', lat: 27.1767, lng: 78.0081, tags: ['Heritage', 'Taj Mahal', 'History'] },
    { id: 'darjeeling', name: 'Darjeeling', country: 'India', image: 'https://images.pexels.com/photos/3321415/pexels-photo-3321415.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Toy train passing through misty mountains and terraced tea gardens in Darjeeling', lat: 27.0360, lng: 88.2627, tags: ['Mountains', 'Tea Gardens', 'Nature'] },
    { id: 'gokarna', name: 'Gokarna', country: 'India', image: 'https://images.pexels.com/photos/5472473/pexels-photo-5472473.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Quiet secluded beaches and rocky cliff sides along the Arabian Sea in Gokarna', lat: 14.5500, lng: 74.3183, tags: ['Beaches', 'Spiritual', 'Backpacking'] },

    // Middle East
    { id: 'dubai', name: 'Dubai', country: 'UAE', image: 'https://images.pexels.com/photos/32870/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Futuristic Burj Khalifa and illuminated Dubai Marina skyline at night', lat: 25.2048, lng: 55.2708, tags: ['City', 'Luxury', 'Shopping'] },
    { id: 'abudhabi', name: 'Abu Dhabi', country: 'UAE', image: 'https://images.pexels.com/photos/5713365/pexels-photo-5713365.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Stunning white domes of the Sheikh Zayed Grand Mosque in Abu Dhabi, UAE', lat: 24.4539, lng: 54.3773, tags: ['City', 'Culture', 'Luxury'] },
    { id: 'doha', name: 'Doha', country: 'Qatar', image: 'https://images.pexels.com/photos/4015822/pexels-photo-4015822.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Modern skyscrapers and traditional dhow boats along the Doha Corniche bay in Qatar', lat: 25.2854, lng: 51.5310, tags: ['City', 'Architecture', 'Culture'] },

    // Europe
    { id: 'europe', name: 'Europe', country: 'Global', image: 'https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Montage of classic European cobblestone streets, castles, and historic landmarks', lat: 48.8566, lng: 2.3522, tags: ['History', 'Culture', 'Architecture', 'City'] },
    { id: 'paris', name: 'Paris', country: 'France', image: 'https://images.pexels.com/photos/1308940/pexels-photo-1308940.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Eiffel Tower soaring above classic Parisian apartment rooftops at sunset in France', lat: 48.8566, lng: 2.3522, tags: ['City', 'Romance', 'Art'] },
    { id: 'london', name: 'London', country: 'UK', image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Iconic red double-decker bus passing by Big Ben and Parliament in London, UK', lat: 51.5072, lng: -0.1276, tags: ['City', 'History', 'Culture'] },
    { id: 'rome', name: 'Rome', country: 'Italy', image: 'https://images.pexels.com/photos/1701595/pexels-photo-1701595.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Ancient ruins of the Roman Colosseum catching golden hour sunlight in Italy', lat: 41.9028, lng: 12.4964, tags: ['City', 'History', 'Food'] },
    { id: 'venice', name: 'Venice', country: 'Italy', image: 'https://images.pexels.com/photos/2800366/pexels-photo-2800366.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Gondola navigating the romantic Grand Canal waterways of Venice, Italy', lat: 45.4408, lng: 12.3155, tags: ['City', 'Water', 'Romance'] },
    { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', image: 'https://images.pexels.com/photos/208736/pexels-photo-208736.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Bicycles parked along a picturesque bridge over an Amsterdam canal in the Netherlands', lat: 52.3676, lng: 4.9041, tags: ['City', 'Canals', 'Culture'] },
    { id: 'barcelona', name: 'Barcelona', country: 'Spain', image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Intricate spires of the Sagrada Familia basilica towering over Barcelona, Spain', lat: 41.3851, lng: 2.1734, tags: ['City', 'Architecture', 'Beaches'] },
    { id: 'santorini', name: 'Santorini', country: 'Greece', image: 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Whitewashed villas with vibrant blue domes overlooking the Aegean Sea in Santorini', lat: 36.3932, lng: 25.4615, tags: ['Islands', 'Romance', 'Beaches'] },

    // Asia
    { id: 'tokyo', name: 'Tokyo', country: 'Japan', image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Neon illuminated streets and bustling pedestrian crossings in Shinjuku, Tokyo, Japan', lat: 35.6762, lng: 139.6503, tags: ['City', 'Culture', 'Technology'] },
    { id: 'bali', name: 'Bali', country: 'Indonesia', image: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Verdant green terraced rice fields and ancient Hindu temples in beautiful Bali', lat: -8.4095, lng: 115.1889, tags: ['Nature', 'Beaches', 'Spiritual'] },
    { id: 'thailand-bangkok', name: 'Bangkok', country: 'Thailand', image: 'https://images.pexels.com/photos/1682748/pexels-photo-1682748.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Vibrant floating markets and ornate Buddhist temple architecture in Bangkok, Thailand', lat: 13.7563, lng: 100.5018, tags: ['City', 'Street Food', 'Culture'] },
    { id: 'phuket', name: 'Phuket', country: 'Thailand', image: 'https://images.pexels.com/photos/16844991/pexels-photo-16844991.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Towering limestone karst islands rising from turquoise ocean waters in Phuket', lat: 7.8804, lng: 98.3923, tags: ['Beaches', 'Nightlife', 'Resorts'] },
    { id: 'singapore', name: 'Singapore', country: 'Singapore', image: 'https://images.pexels.com/photos/3152125/pexels-photo-3152125.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Futuristic Supertree Grove at Gardens by the Bay glowing at night in Singapore', lat: 1.3521, lng: 103.8198, tags: ['City', 'Luxury', 'Clean'] },

    // Americas
    { id: 'newyork', name: 'New York', country: 'USA', image: 'https://images.pexels.com/photos/219692/pexels-photo-219692.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Iconic yellow taxis driving down avenues with the New York City Manhattan skyline', lat: 40.7128, lng: -74.0060, tags: ['City', 'Nightlife', 'Shopping'] },
    { id: 'losangeles', name: 'Los Angeles', country: 'USA', image: 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Los Angeles cityscape with palm trees silhouetted against a California sunset', lat: 34.0522, lng: -118.2437, tags: ['City', 'Beaches', 'Entertainment'] },
    { id: 'cancun', name: 'Cancún', country: 'Mexico', image: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Pristine Caribbean white sand beach and luxury ocean front resorts in Cancun, Mexico', lat: 21.1619, lng: -86.8515, tags: ['Beaches', 'Resorts', 'Nightlife'] },
    { id: 'riodejaneiro', name: 'Rio de Janeiro', country: 'Brazil', image: 'https://images.pexels.com/photos/2868242/pexels-photo-2868242.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Christ the Redeemer statue overlooking Sugarloaf Mountain and Rio de Janeiro bay', lat: -22.9068, lng: -43.1729, tags: ['Beaches', 'Culture', 'Nature'] },
    { id: 'vancouver', name: 'Vancouver', country: 'Canada', image: 'https://images.pexels.com/photos/29072584/pexels-photo-29072584.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Sleek glassy skyscrapers reflecting the surrounding ocean and mountains in Vancouver', lat: 49.2827, lng: -123.1207, tags: ['City', 'Mountains', 'Nature'] },

    // India Expansion
    { id: 'hyderabad', name: 'Hyderabad', country: 'India', image: 'https://images.pexels.com/photos/11029124/pexels-photo-11029124.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Charminar monument and bustling night markets in the old city of Hyderabad', lat: 17.3850, lng: 78.4867, tags: ['Heritage', 'Food', 'City'] },
    { id: 'kochi', name: 'Kochi', country: 'India', image: 'https://images.pexels.com/photos/10323330/pexels-photo-10323330.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Chinese fishing nets at sunset in Fort Kochi, Kerala', lat: 9.9312, lng: 76.2673, tags: ['Coastal', 'History', 'Culture'] },
    { id: 'pondicherry', name: 'Pondicherry', country: 'India', image: 'https://images.pexels.com/photos/13444075/pexels-photo-13444075.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'French colonial villas and quiet lanes in the White Town area of Pondicherry', lat: 11.9416, lng: 79.8083, tags: ['Beaches', 'French Heritage'] },
    { id: 'mysore', name: 'Mysore', country: 'India', image: 'https://images.pexels.com/photos/10323307/pexels-photo-10323307.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Illuminated Mysore Palace during the Dasara festival in Karnataka', lat: 12.2958, lng: 76.6394, tags: ['Palaces', 'Heritage'] },
    { id: 'amritsar', name: 'Amritsar', country: 'India', image: 'https://images.pexels.com/photos/10041499/pexels-photo-10041499.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Golden Temple (Harmandir Sahib) reflecting in the sacred pool at night in Amritsar', lat: 31.6200, lng: 74.8765, tags: ['Spiritual', 'History'] },
    { id: 'hampi', name: 'Hampi', country: 'India', image: 'https://images.pexels.com/photos/11029114/pexels-photo-11029114.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Stone chariot and ancient ruins of the Vijayanagara Empire in Hampi', lat: 15.3350, lng: 76.4600, tags: ['Ancient History', 'Boulders', 'Adventure'] },
    { id: 'coorg', name: 'Coorg', country: 'India', image: 'https://images.pexels.com/photos/13442385/pexels-photo-13442385.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Lush coffee plantations and misty green hills of Madikeri, Coorg', lat: 12.4244, lng: 75.7382, tags: ['Nature', 'Coffee', 'Mountains'] },
    { id: 'alleppey', name: 'Alleppey', country: 'India', image: 'https://images.pexels.com/photos/9349641/pexels-photo-9349641.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Traditional wooden houseboats floating through the calm backwaters of Alleppey, Kerala', lat: 9.4981, lng: 76.3388, tags: ['Backwaters', 'Houseboats', 'Nature'] },
    { id: 'jodhpur', name: 'Jodhpur', country: 'India', image: 'https://images.pexels.com/photos/11029107/pexels-photo-11029107.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'View of the Blue City and Mehrangarh Fort towering above Jodhpur, Rajasthan', lat: 26.2389, lng: 73.0243, tags: ['Heritage', 'Blue City', 'History'] },

    // Asia Expansion
    { id: 'seoul', name: 'Seoul', country: 'South Korea', image: 'https://images.pexels.com/photos/2085350/pexels-photo-2085350.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Night view of the N Seoul Tower and futuristic skyline of Seoul city', lat: 37.5665, lng: 126.9780, tags: ['City', 'Technology', 'Food'] },
    { id: 'kyoto', name: 'Kyoto', country: 'Japan', image: 'https://images.pexels.com/photos/161401/fushimi-inari-taisha-shrine-kyoto-japan-temple-161401.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Iconic orange Torii gates path of the Fushimi Inari Shrine in Kyoto, Japan', lat: 35.0116, lng: 135.7681, tags: ['Tradition', 'Temples', 'History'] },
    { id: 'bangkok-old', name: 'Old Bangkok', country: 'Thailand', image: 'https://images.pexels.com/photos/1350117/pexels-photo-1350117.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Grand Palace and Wat Phra Kaew gleaming with gold in Bangkok, Thailand', lat: 13.7500, lng: 100.4900, tags: ['Temples', 'Culture', 'History'] },
    { id: 'singapore-marina', name: 'Marina Bay', country: 'Singapore', image: 'https://images.pexels.com/photos/1010639/pexels-photo-1010639.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Marina Bay Sands hotel and skyline reflection in Singapore bay', lat: 1.2867, lng: 103.8544, tags: ['Luxury', 'Modern Architecture'] },

    // Europe Expansion
    { id: 'prague', name: 'Prague', country: 'Czech Republic', image: 'https://images.pexels.com/photos/1234398/pexels-photo-1234398.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Gothic spires of Prague Castle and the Vltava River bridge in the Czech Republic', lat: 50.0755, lng: 14.4378, tags: ['Architecture', 'History', 'City'] },
    { id: 'lisbon', name: 'Lisbon', country: 'Portugal', image: 'https://images.pexels.com/photos/3313204/pexels-photo-3313204.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Yellow tram climbing the steep cobblestone streets of Alfama in Lisbon, Portugal', lat: 38.7223, lng: -9.1393, tags: ['Coastal', 'Tram', 'City'] },
    { id: 'athens', name: 'Athens', country: 'Greece', image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'The Parthenon temple atop the Acropolis hill overlooking Athens, Greece', lat: 37.9838, lng: 23.7275, tags: ['Ancient History', 'Ruins'] },
    { id: 'vienna', name: 'Vienna', country: 'Austria', image: 'https://images.pexels.com/photos/2091176/pexels-photo-2091176.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Classic Imperial architecture of the Schonbrunn Palace in Vienna, Austria', lat: 48.2082, lng: 16.3738, tags: ['Classical', 'Music', 'History'] },
    { id: 'budapest', name: 'Budapest', country: 'Hungary', image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Hungarian Parliament reflected in the Danube River at night in Budapest', lat: 47.4979, lng: 19.0402, tags: ['River', 'Architecture', 'City'] },
    { id: 'florence', name: 'Florence', country: 'Italy', image: 'https://images.pexels.com/photos/1271109/pexels-photo-1271109.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Red-tiled Duomo of Florence Cathedral soaring above the Renaissance city skyline in Italy', lat: 43.7696, lng: 11.2558, tags: ['Art', 'Renaissance', 'History'] },

    // Americas Expansion
    { id: 'san-francisco', name: 'San Francisco', country: 'USA', image: 'https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Golden Gate Bridge emerging from San Francisco fog on a clear California day', lat: 37.7749, lng: -122.4194, tags: ['Bridges', 'City', 'Technology'] },
    { id: 'mexico-city', name: 'Mexico City', country: 'Mexico', image: 'https://images.pexels.com/photos/2443048/pexels-photo-2443048.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Metropolitan Cathedral and the vast Zócalo square in Mexico City', lat: 19.4326, lng: -99.1332, tags: ['Culture', 'History', 'Food'] },
    { id: 'buenos-aires', name: 'Buenos Aires', country: 'Argentina', image: 'https://images.pexels.com/photos/1534417/pexels-photo-1534417.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Colorful buildings of Caminito Street in La Boca, Buenos Aires, Argentina', lat: -34.6037, lng: -58.3816, tags: ['Tango', 'Culture', 'City'] },

    // Africa/Middle-East Expansion
    { id: 'cairo', name: 'Cairo', country: 'Egypt', image: 'https://images.pexels.com/photos/11029094/pexels-photo-11029094.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Great Pyramids of Giza silhouetted against a golden desert sunset in Cairo, Egypt', lat: 30.0444, lng: 31.2357, tags: ['Pyramids', 'Ancient', 'History'] },
    { id: 'marrakesh', name: 'Marrakesh', country: 'Morocco', image: 'https://images.pexels.com/photos/11264871/pexels-photo-11264871.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Intricate archways and tiled courtyards of a traditional Moroccan riad in Marrakesh', lat: 31.6295, lng: -7.9811, tags: ['Markets', 'Culture', 'History'] },
    { id: 'capetown', name: 'Cape Town', country: 'South Africa', image: 'https://images.pexels.com/photos/3313205/pexels-photo-3313205.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Table Mountain looming over the vibrant V&A Waterfront in Cape Town', lat: -33.9249, lng: 18.4241, tags: ['Mountains', 'Nature', 'City'] },

    // Oceania
    { id: 'sydney', name: 'Sydney', country: 'Australia', image: 'https://images.pexels.com/photos/995765/pexels-photo-995765.jpeg?auto=compress&cs=tinysrgb&w=800', imageAlt: 'Iconic Sydney Opera House and Harbour Bridge catching the sunrise in Australia', lat: -33.8688, lng: 151.2093, tags: ['Harbour', 'City', 'Modern'] },
];

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}
