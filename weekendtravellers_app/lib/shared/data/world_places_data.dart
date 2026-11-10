import 'dart:math' as math;
import 'package:dio/dio.dart';
import '../models/destination_model.dart';
import 'curated_destinations.dart';

/// Representation of any searchable place in the world
class WorldPlace {
  final String id;
  final String name;
  final String city;
  final String state;
  final String country;
  final String countryCode;
  final double lat;
  final double lng;
  final String description;
  final String category;
  final String imageUrl;
  final double rating;
  final int estimatedCost;
  final bool isCurated;
  final DestinationModel? curatedDestination;

  const WorldPlace({
    required this.id,
    required this.name,
    required this.city,
    required this.state,
    required this.country,
    required this.countryCode,
    required this.lat,
    required this.lng,
    required this.description,
    required this.category,
    required this.imageUrl,
    this.rating = 4.8,
    this.estimatedCost = 6500,
    this.isCurated = false,
    this.curatedDestination,
  });

  /// Calculate distance in km from given coordinates with tortuosity factor
  int getDistanceKm(double fromLat, double fromLng) {
    if (lat == 0.0 || lng == 0.0 || fromLat == 0.0 || fromLng == 0.0) return 250;
    final dLat = (lat - fromLat) * math.pi / 180.0;
    final dLng = (lng - fromLng) * math.pi / 180.0;
    final a = math.sin(dLat / 2) * math.sin(dLat / 2) +
        math.cos(fromLat * math.pi / 180.0) *
            math.cos(lat * math.pi / 180.0) *
            math.sin(dLng / 2) *
            math.sin(dLng / 2);
    final c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a));
    final km = (6371.0 * c * 1.25).round();
    return km > 0 ? km : 15;
  }

  /// Estimated travel time strictly via car
  String getTravelTimeEstimate(double fromLat, double fromLng) {
    final dist = getDistanceKm(fromLat, fromLng);
    final totalHours = dist / 55.0; // Average road travel speed including highway stops
    if (totalHours < 1.0) {
      final mins = (totalHours * 60).round().clamp(15, 59);
      return '${mins}m by car';
    }
    final h = totalHours.floor();
    final m = ((totalHours - h) * 60).round();
    return m > 5 ? '${h}h ${m}m by car' : '${h}h by car';
  }
}

/// Global repository of world places and nearest travel recommendations
class WorldPlacesData {
  WorldPlacesData._();

  static final Dio _dio = Dio(
    BaseOptions(
      connectTimeout: const Duration(milliseconds: 2500),
      receiveTimeout: const Duration(milliseconds: 2500),
      headers: {'User-Agent': 'WeekendTravellers-App/1.0'},
    ),
  );

  /// 150+ Top Worldwide Destinations Index
  static final List<WorldPlace> _expandedWorldCatalog = [
    // Pre-populate with all 68 Curated Destinations
    ...CuratedDestinationsData.destinations.where((d) => d.id != 'india' && d.id != 'europe').map((d) {
      return WorldPlace(
        id: d.id,
        name: d.name,
        city: d.city,
        state: d.state,
        country: d.country,
        countryCode: d.country.toLowerCase() == 'india' ? 'IN' : 'GLOBAL',
        lat: d.lat,
        lng: d.lng,
        description: d.shortDescription,
        category: d.categories.isNotEmpty ? d.categories.first : 'Getaway',
        imageUrl: d.images.isNotEmpty ? d.images.first : '',
        rating: d.rating,
        estimatedCost: d.estimatedCost,
        isCurated: true,
        curatedDestination: d,
      );
    }),

    // Additional Global Top Travel Hubs & Scenic Destinations
    const WorldPlace(
      id: 'zurich',
      name: 'Zurich',
      city: 'Zurich',
      state: 'Zurich',
      country: 'Switzerland',
      countryCode: 'CH',
      lat: 47.3769,
      lng: 8.5417,
      description: 'Picturesque alpine lake, historic old town and pristine Swiss mountain scenery.',
      category: 'Lakes & Mountains',
      imageUrl: 'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.9,
      estimatedCost: 18000,
    ),
    const WorldPlace(
      id: 'interlaken',
      name: 'Interlaken',
      city: 'Interlaken',
      state: 'Bern',
      country: 'Switzerland',
      countryCode: 'CH',
      lat: 46.6863,
      lng: 7.8632,
      description: 'Adventure capital of Europe surrounded by Lake Thun, Lake Brienz and Jungfrau.',
      category: 'Adventure & Snow',
      imageUrl: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.9,
      estimatedCost: 19500,
    ),
    const WorldPlace(
      id: 'nice',
      name: 'Nice',
      city: 'Nice',
      state: 'French Riviera',
      country: 'France',
      countryCode: 'FR',
      lat: 43.7102,
      lng: 7.2620,
      description: 'Promenade des Anglais, Mediterranean azure waters and charming pastel streets.',
      category: 'Coastal & Luxury',
      imageUrl: 'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.8,
      estimatedCost: 15000,
    ),
    const WorldPlace(
      id: 'madrid',
      name: 'Madrid',
      city: 'Madrid',
      state: 'Community of Madrid',
      country: 'Spain',
      countryCode: 'ES',
      lat: 40.4168,
      lng: -3.7038,
      description: 'Grand palaces, tapas boulevards, world-class art and energetic European nightlife.',
      category: 'Culture & Food',
      imageUrl: 'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.8,
      estimatedCost: 13500,
    ),
    const WorldPlace(
      id: 'berlin',
      name: 'Berlin',
      city: 'Berlin',
      state: 'Berlin',
      country: 'Germany',
      countryCode: 'DE',
      lat: 52.5200,
      lng: 13.4050,
      description: 'Historic landmarks, museum island, modern art scene and vibrant cafes.',
      category: 'History & Art',
      imageUrl: 'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.7,
      estimatedCost: 14000,
    ),
    const WorldPlace(
      id: 'toronto',
      name: 'Toronto',
      city: 'Toronto',
      state: 'Ontario',
      country: 'Canada',
      countryCode: 'CA',
      lat: 43.6532,
      lng: -79.3832,
      description: 'CN Tower skyline, Lake Ontario waterfront and gateway to Niagara Falls.',
      category: 'City & Nature',
      imageUrl: 'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.7,
      estimatedCost: 16000,
    ),
    const WorldPlace(
      id: 'chicago',
      name: 'Chicago',
      city: 'Chicago',
      state: 'Illinois',
      country: 'United States',
      countryCode: 'US',
      lat: 41.8781,
      lng: -87.6298,
      description: 'Millennium Park, architectural river cruises and famous deep-dish culinary culture.',
      category: 'Architecture & Dining',
      imageUrl: 'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.8,
      estimatedCost: 17500,
    ),
    const WorldPlace(
      id: 'kathmandu',
      name: 'Kathmandu',
      city: 'Kathmandu',
      state: 'Bagmati',
      country: 'Nepal',
      countryCode: 'NP',
      lat: 27.7172,
      lng: 85.3240,
      description: 'Himalayan mountain temples, ancient stupas, spiritual trails and valley trekking.',
      category: 'Himalayas & Spirituality',
      imageUrl: 'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.8,
      estimatedCost: 6500,
    ),
    const WorldPlace(
      id: 'pokhara',
      name: 'Pokhara',
      city: 'Pokhara',
      state: 'Gandaki',
      country: 'Nepal',
      countryCode: 'NP',
      lat: 28.2096,
      lng: 83.9856,
      description: 'Phewa Lake tranquility, Annapurna mountain views and paragliding thrills.',
      category: 'Lakes & Paragliding',
      imageUrl: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.9,
      estimatedCost: 7000,
    ),
    const WorldPlace(
      id: 'colombo',
      name: 'Colombo',
      city: 'Colombo',
      state: 'Western Province',
      country: 'Sri Lanka',
      countryCode: 'LK',
      lat: 6.9271,
      lng: 79.8612,
      description: 'Galle Face Green seaside, colonial Dutch heritage and spicy coastal seafood.',
      category: 'Coast & Heritage',
      imageUrl: 'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.7,
      estimatedCost: 7500,
    ),
    const WorldPlace(
      id: 'chiangmai',
      name: 'Chiang Mai',
      city: 'Chiang Mai',
      state: 'Chiang Mai',
      country: 'Thailand',
      countryCode: 'TH',
      lat: 18.7883,
      lng: 98.9853,
      description: 'Misty northern mountains, ancient golden wats, elephant sanctuaries and night bazaars.',
      category: 'Culture & Nature',
      imageUrl: 'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.8,
      estimatedCost: 8000,
    ),
    const WorldPlace(
      id: 'danang',
      name: 'Da Nang',
      city: 'Da Nang',
      state: 'South Central Coast',
      country: 'Vietnam',
      countryCode: 'VN',
      lat: 16.0544,
      lng: 108.2022,
      description: 'Golden Bridge in the clouds, Marble Mountains and long white sandy coastline.',
      category: 'Beach & Mountains',
      imageUrl: 'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.8,
      estimatedCost: 8500,
    ),
    const WorldPlace(
      id: 'muscat',
      name: 'Muscat',
      city: 'Muscat',
      state: 'Muscat',
      country: 'Oman',
      countryCode: 'OM',
      lat: 23.5880,
      lng: 58.3829,
      description: 'Sultan Qaboos Grand Mosque, dramatic fjords of Arabia and tranquil desert wadis.',
      category: 'Desert & Coast',
      imageUrl: 'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.8,
      estimatedCost: 11000,
    ),
    const WorldPlace(
      id: 'edinburgh',
      name: 'Edinburgh',
      city: 'Edinburgh',
      state: 'Scotland',
      country: 'United Kingdom',
      countryCode: 'GB',
      lat: 55.9533,
      lng: -3.1883,
      description: 'Ancient volcanic castle, Royal Mile cobbled closes and Arthur\'s Seat panoramic hikes.',
      category: 'Castle & Legends',
      imageUrl: 'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.9,
      estimatedCost: 15500,
    ),
  ];

  /// Get the top 6 travel places nearest to the user's origin location
  static List<WorldPlace> getTop6Nearby({
    required double userLat,
    required double userLng,
    String? userCity,
  }) {
    final list = _expandedWorldCatalog.where((place) {
      // Exclude origin city itself or very close spots (< 30km)
      if (userCity != null && place.name.toLowerCase() == userCity.toLowerCase()) {
        return false;
      }
      final dist = place.getDistanceKm(userLat, userLng);
      return dist > 30;
    }).toList();

    // Sort by proximity ascending (closest first)
    list.sort((a, b) => a.getDistanceKm(userLat, userLng).compareTo(b.getDistanceKm(userLat, userLng)));

    // Return the top 6
    return list.take(6).toList();
  }

  /// Search across all world places with instant local index and live Nominatim fallback
  static Future<List<WorldPlace>> search(String query, {double? userLat, double? userLng}) async {
    final clean = query.trim().toLowerCase();
    if (clean.isEmpty) return [];

    // 1. Fast local match
    final localMatches = _expandedWorldCatalog.where((p) {
      return p.name.toLowerCase().contains(clean) ||
          p.city.toLowerCase().contains(clean) ||
          p.state.toLowerCase().contains(clean) ||
          p.country.toLowerCase().contains(clean) ||
          p.category.toLowerCase().contains(clean);
    }).toList();

    // Sort local matches by exact prefix and proximity if coords provided
    localMatches.sort((a, b) {
      final aExact = a.name.toLowerCase().startsWith(clean);
      final bExact = b.name.toLowerCase().startsWith(clean);
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      if (userLat != null && userLng != null) {
        return a.getDistanceKm(userLat, userLng).compareTo(b.getDistanceKm(userLat, userLng));
      }
      return 0;
    });

    if (localMatches.length >= 5) {
      return localMatches.take(12).toList();
    }

    // 2. Dynamic Worldwide Geocoding Fallback via OpenStreetMap Nominatim
    try {
      final response = await _dio.get(
        'https://nominatim.openstreetmap.org/search',
        queryParameters: {
          'q': query,
          'format': 'json',
          'addressdetails': 1,
          'limit': 5,
        },
      );

      if (response.statusCode == 200 && response.data is List) {
        final List data = response.data;
        final List<WorldPlace> remotePlaces = [];

        for (final item in data) {
          final displayName = item['display_name'] as String? ?? query;
          final name = item['name'] as String? ?? query;
          final lat = double.tryParse(item['lat']?.toString() ?? '0') ?? 0.0;
          final lon = double.tryParse(item['lon']?.toString() ?? '0') ?? 0.0;
          final address = item['address'] as Map<String, dynamic>? ?? {};
          final country = address['country'] as String? ?? 'World';
          final state = address['state'] as String? ?? address['region'] as String? ?? country;
          final city = address['city'] as String? ?? address['town'] as String? ?? name;

          // Avoid duplicates with local matches
          final exists = localMatches.any((m) => m.name.toLowerCase() == name.toLowerCase());
          if (!exists && lat != 0.0 && lon != 0.0) {
            remotePlaces.add(
              WorldPlace(
                id: 'world_${name.toLowerCase().replaceAll(RegExp(r'[^a-z0-9]'), '_')}',
                name: name.isNotEmpty ? name : city,
                city: city,
                state: state,
                country: country,
                countryCode: address['country_code']?.toString().toUpperCase() ?? 'GLOBAL',
                lat: lat,
                lng: lon,
                description: displayName,
                category: 'Global Destination',
                imageUrl: 'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800',
                rating: 4.8,
                estimatedCost: 9000,
              ),
            );
          }
        }

        final combined = [...localMatches, ...remotePlaces];
        return combined.take(12).toList();
      }
    } catch (_) {
      // Quietly fall back to local matches
    }

    // If query has no matches at all, provide a customizable generic world place
    if (localMatches.isEmpty && query.length >= 2) {
      return [
        WorldPlace(
          id: 'custom_${query.toLowerCase()}',
          name: query.split(' ').map((w) => w.isNotEmpty ? '${w[0].toUpperCase()}${w.substring(1)}' : '').join(' '),
          city: query,
          state: 'Global',
          country: 'Worldwide Destination',
          countryCode: 'GLOBAL',
          lat: userLat ?? 28.6139,
          lng: userLng ?? 77.2090,
          description: 'Personalized AI trip to $query tailored for this weekend.',
          category: 'Custom Escape',
          imageUrl: 'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800',
          rating: 4.8,
          estimatedCost: 8000,
        ),
      ];
    }

    return localMatches;
  }
}
