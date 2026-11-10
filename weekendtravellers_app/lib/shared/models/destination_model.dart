import 'dart:math' as math;

/// Full Destination Model supporting India & Global destinations
class DestinationModel {
  final String id;
  final String name;
  final String slug;
  final String city;
  final String state;
  final String country;
  final double lat;
  final double lng;
  final String description;
  final String shortDescription;
  final String bestTimeToVisit;
  final String famousFor;
  final List<String> idealFor;
  final List<String> categories;
  final int estimatedCost;
  final int minBudget;
  final int maxBudget;
  final int recommendedDurationDays;
  final Map<String, int> distanceFromMajorCities; // e.g. {'Delhi': 250, 'Mumbai': 1600}
  final String travelTimeFromDelhi;
  final double rating;
  final int reviewCount;
  final double smartRankingScore;
  final List<String> images;
  final List<PlaceAttraction> attractions;
  final List<HotelRecommendation> hotels;
  final List<RestaurantRecommendation> restaurants;
  final List<String> activities;
  final WeatherInfo? weather;

  DestinationModel({
    required this.id,
    required this.name,
    required this.slug,
    required this.city,
    required this.state,
    required this.country,
    required this.lat,
    required this.lng,
    required this.description,
    required this.shortDescription,
    required this.bestTimeToVisit,
    required this.famousFor,
    required this.idealFor,
    required this.categories,
    required this.estimatedCost,
    required this.minBudget,
    required this.maxBudget,
    required this.recommendedDurationDays,
    required this.distanceFromMajorCities,
    required this.travelTimeFromDelhi,
    required this.rating,
    required this.reviewCount,
    required this.smartRankingScore,
    required this.images,
    required this.attractions,
    required this.hotels,
    required this.restaurants,
    required this.activities,
    this.weather,
  });

  String get heroImage => images.isNotEmpty
      ? images.first
      : 'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg';

  static const Map<String, (double, double)> _cityCoordinates = {
    'delhi': (28.6139, 77.2090),
    'new delhi': (28.6139, 77.2090),
    'mumbai': (19.0760, 72.8777),
    'bombay': (19.0760, 72.8777),
    'bangalore': (12.9716, 77.5946),
    'bengaluru': (12.9716, 77.5946),
    'hyderabad': (17.3850, 78.4867),
    'chennai': (13.0827, 80.2707),
    'kolkata': (22.5726, 88.3639),
    'pune': (18.5204, 73.8567),
    'jaipur': (26.9124, 75.7873),
    'chandigarh': (30.7333, 76.7794),
    'ahmedabad': (23.0225, 72.5714),
    'dehradun': (30.3165, 78.0322),
    'goa': (15.2993, 74.1240),
    'kochi': (9.9312, 76.2673),
    'lucknow': (26.8467, 80.9462),
    'indore': (22.7196, 75.8577),
    'bhopal': (23.2599, 77.4126),
    'bhubaneswar': (20.2961, 85.8245),
    'guwahati': (26.1445, 91.7362),
    'amritsar': (31.6340, 74.8723),
    'shimla': (31.1048, 77.1734),
    'coimbatore': (11.0168, 76.9558),
    'visakhapatnam': (17.6868, 83.2185),
    'varanasi': (25.3176, 82.9739),
    'surat': (21.1702, 72.8311),
  };

  int getDistanceKm(String originCity, [double? userLat, double? userLng]) {
    final oCity = originCity.toLowerCase().trim();
    if (name.toLowerCase() == oCity || city.toLowerCase() == oCity) {
      return 15;
    }

    double? oLat = userLat;
    double? oLng = userLng;

    if (oLat == null || oLng == null) {
      final coords = _cityCoordinates[oCity];
      if (coords != null) {
        oLat = coords.$1;
        oLng = coords.$2;
      }
    }

    if (oLat != null && oLng != null && lat != 0.0 && lng != 0.0) {
      final dLat = (lat - oLat) * math.pi / 180.0;
      final dLng = (lng - oLng) * math.pi / 180.0;
      final a = math.sin(dLat / 2) * math.sin(dLat / 2) +
          math.cos(oLat * math.pi / 180.0) *
              math.cos(lat * math.pi / 180.0) *
              math.sin(dLng / 2) *
              math.sin(dLng / 2);
      final c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a));
      final km = (6371.0 * c * 1.25).round();
      return km > 0 ? km : 15;
    }

    if (distanceFromMajorCities.containsKey(originCity)) {
      return distanceFromMajorCities[originCity]!;
    }
    for (final entry in distanceFromMajorCities.entries) {
      if (entry.key.toLowerCase() == oCity) {
        return entry.value;
      }
    }
    return distanceFromMajorCities['Delhi'] ?? 280;
  }

  /// Calculates real-time travel duration strictly via car
  String getCarTravelTime([String originCity = 'Delhi', double? userLat, double? userLng]) {
    final dist = getDistanceKm(originCity, userLat, userLng);
    final totalHours = dist / 55.0;
    if (totalHours < 1.0) {
      final mins = (totalHours * 60).round().clamp(15, 59);
      return '${mins}m by car';
    }
    final h = totalHours.floor();
    final m = ((totalHours - h) * 60).round();
    return m > 5 ? '${h}h ${m}m by car' : '${h}h by car';
  }

  factory DestinationModel.fromJson(Map<String, dynamic> json) {
    return DestinationModel(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      slug: json['slug'] ?? (json['id']?.toString() ?? ''),
      city: json['city'] ?? '',
      state: json['state'] ?? '',
      country: json['country'] ?? 'India',
      lat: (json['lat'] as num?)?.toDouble() ?? 0.0,
      lng: (json['lng'] as num?)?.toDouble() ?? 0.0,
      description: json['description'] ?? '',
      shortDescription: json['shortDescription'] ?? '',
      bestTimeToVisit: json['bestTimeToVisit'] ?? 'Oct – Mar',
      famousFor: json['famousFor'] ?? '',
      idealFor: List<String>.from(json['idealFor'] ?? []),
      categories: List<String>.from(json['categories'] ?? []),
      estimatedCost: json['estimatedCost'] ?? 5000,
      minBudget: json['minBudget'] ?? 3500,
      maxBudget: json['maxBudget'] ?? 8000,
      recommendedDurationDays: json['recommendedDurationDays'] ?? 2,
      distanceFromMajorCities: Map<String, int>.from(json['distanceFromMajorCities'] ?? {}),
      travelTimeFromDelhi: json['travelTimeFromDelhi'] ?? '5h drive',
      rating: (json['rating'] as num?)?.toDouble() ?? 4.6,
      reviewCount: json['reviewCount'] ?? 120,
      smartRankingScore: (json['smartRankingScore'] as num?)?.toDouble() ?? 92.0,
      images: List<String>.from(json['images'] ?? []),
      attractions: (json['attractions'] as List? ?? [])
          .map((item) => PlaceAttraction.fromJson(item))
          .toList(),
      hotels: (json['hotels'] as List? ?? [])
          .map((item) => HotelRecommendation.fromJson(item))
          .toList(),
      restaurants: (json['restaurants'] as List? ?? [])
          .map((item) => RestaurantRecommendation.fromJson(item))
          .toList(),
      activities: List<String>.from(json['activities'] ?? []),
      weather: json['weather'] != null ? WeatherInfo.fromJson(json['weather']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'slug': slug,
      'city': city,
      'state': state,
      'country': country,
      'lat': lat,
      'lng': lng,
      'description': description,
      'shortDescription': shortDescription,
      'bestTimeToVisit': bestTimeToVisit,
      'famousFor': famousFor,
      'idealFor': idealFor,
      'categories': categories,
      'estimatedCost': estimatedCost,
      'minBudget': minBudget,
      'maxBudget': maxBudget,
      'recommendedDurationDays': recommendedDurationDays,
      'distanceFromMajorCities': distanceFromMajorCities,
      'travelTimeFromDelhi': travelTimeFromDelhi,
      'rating': rating,
      'reviewCount': reviewCount,
      'smartRankingScore': smartRankingScore,
      'images': images,
      'attractions': attractions.map((a) => a.toJson()).toList(),
      'hotels': hotels.map((h) => h.toJson()).toList(),
      'restaurants': restaurants.map((r) => r.toJson()).toList(),
      'activities': activities,
      'weather': weather?.toJson(),
    };
  }
}

class PlaceAttraction {
  final String name;
  final String description;
  final String category;
  final String imageUrl;
  final double rating;
  final String ticketPrice;

  PlaceAttraction({
    required this.name,
    required this.description,
    required this.category,
    required this.imageUrl,
    required this.rating,
    required this.ticketPrice,
  });

  factory PlaceAttraction.fromJson(Map<String, dynamic> json) {
    return PlaceAttraction(
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      category: json['category'] ?? 'Sightseeing',
      imageUrl: json['imageUrl'] ?? '',
      rating: (json['rating'] as num?)?.toDouble() ?? 4.5,
      ticketPrice: json['ticketPrice'] ?? 'Free',
    );
  }

  Map<String, dynamic> toJson() => {
    'name': name,
    'description': description,
    'category': category,
    'imageUrl': imageUrl,
    'rating': rating,
    'ticketPrice': ticketPrice,
  };
}

class HotelRecommendation {
  final String name;
  final String tier; // Budget, Mid, Luxury
  final String priceRange;
  final double rating;
  final String imageUrl;
  final List<String> amenities;
  final String bookingUrl;

  HotelRecommendation({
    required this.name,
    required this.tier,
    required this.priceRange,
    required this.rating,
    required this.imageUrl,
    required this.amenities,
    required this.bookingUrl,
  });

  factory HotelRecommendation.fromJson(Map<String, dynamic> json) {
    return HotelRecommendation(
      name: json['name'] ?? '',
      tier: json['tier'] ?? 'Mid-range',
      priceRange: json['priceRange'] ?? '₹2,500/night',
      rating: (json['rating'] as num?)?.toDouble() ?? 4.3,
      imageUrl: json['imageUrl'] ?? '',
      amenities: List<String>.from(json['amenities'] ?? ['Wi-Fi', 'Breakfast', 'AC']),
      bookingUrl: json['bookingUrl'] ?? 'https://weekendtravellers.com/hotels',
    );
  }

  Map<String, dynamic> toJson() => {
    'name': name,
    'tier': tier,
    'priceRange': priceRange,
    'rating': rating,
    'imageUrl': imageUrl,
    'amenities': amenities,
    'bookingUrl': bookingUrl,
  };
}

class RestaurantRecommendation {
  final String name;
  final String cuisine;
  final String priceRange;
  final double rating;
  final String mustTry;
  final String imageUrl;

  RestaurantRecommendation({
    required this.name,
    required this.cuisine,
    required this.priceRange,
    required this.rating,
    required this.mustTry,
    required this.imageUrl,
  });

  factory RestaurantRecommendation.fromJson(Map<String, dynamic> json) {
    return RestaurantRecommendation(
      name: json['name'] ?? '',
      cuisine: json['cuisine'] ?? 'Local & Indian',
      priceRange: json['priceRange'] ?? '₹₹',
      rating: (json['rating'] as num?)?.toDouble() ?? 4.4,
      mustTry: json['mustTry'] ?? 'Local Thali',
      imageUrl: json['imageUrl'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'name': name,
    'cuisine': cuisine,
    'priceRange': priceRange,
    'rating': rating,
    'mustTry': mustTry,
    'imageUrl': imageUrl,
  };
}

class WeatherInfo {
  final double temperature;
  final String condition;
  final int rainProbability;
  final String advice;

  WeatherInfo({
    required this.temperature,
    required this.condition,
    required this.rainProbability,
    required this.advice,
  });

  factory WeatherInfo.fromJson(Map<String, dynamic> json) {
    return WeatherInfo(
      temperature: (json['temperature'] as num?)?.toDouble() ?? 24.0,
      condition: json['condition'] ?? 'Sunny & Pleasant',
      rainProbability: json['rainProbability'] ?? 10,
      advice: json['advice'] ?? 'Great weather for outdoor exploration!',
    );
  }

  Map<String, dynamic> toJson() => {
    'temperature': temperature,
    'condition': condition,
    'rainProbability': rainProbability,
    'advice': advice,
  };
}
