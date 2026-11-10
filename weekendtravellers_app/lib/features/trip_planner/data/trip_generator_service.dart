import 'dart:convert';
import 'package:flutter/foundation.dart';
import '../../../core/network/api_client.dart';
import '../../../shared/data/curated_destinations.dart';
import '../../../shared/models/destination_model.dart';
import '../../../shared/models/trip_model.dart';

/// Service responsible for generating AI trips via Backend API or intelligent curated fallback.
class TripGeneratorService {
  final ApiClient _apiClient;

  TripGeneratorService(this._apiClient);

  Future<TripModel> generateTrip({
    required String origin,
    required String destination,
    required int durationDays,
    required String travellers,
    required int budget,
    required String transport,
    required List<String> interests,
    required String travelStyle,
  }) async {
    // 1. Try hitting the backend API
    try {
      final res = await _apiClient.post(
        '/api/search',
        data: {
          'destination': destination,
          'days': durationDays,
          'origin': origin,
          'interests': interests.join(', '),
          'budget': budget,
          'travellers': travellers,
          'transport': transport,
          'travelStyle': travelStyle,
        },
      );

      if (res.statusCode == 200 && res.data != null) {
        final data = res.data is String ? jsonDecode(res.data) : res.data;
        if (data is Map<String, dynamic> && data['days'] != null) {
          return _mapBackendResponseToTrip(
            data,
            origin: origin,
            destination: destination,
            durationDays: durationDays,
            travellers: travellers,
            budget: budget,
            transport: transport,
            interests: interests,
            travelStyle: travelStyle,
          );
        }
      }
    } catch (err) {
      debugPrint('[TripGenerator] Backend API call failed or unavailable ($err). Falling back to intelligent local generator.');
    }

    // 2. Fallback: Intelligent Grounded Itinerary Generation
    return _generateCuratedTrip(
      origin: origin,
      destinationName: destination,
      durationDays: durationDays,
      travellers: travellers,
      budget: budget,
      transport: transport,
      interests: interests,
      travelStyle: travelStyle,
    );
  }

  TripModel _mapBackendResponseToTrip(
    Map<String, dynamic> data, {
    required String origin,
    required String destination,
    required int durationDays,
    required String travellers,
    required int budget,
    required String transport,
    required List<String> interests,
    required String travelStyle,
  }) {
    final tripDetails = data['trip_details'] ?? {};
    final daysList = (data['days'] as List? ?? []).map((d) {
      final acts = (d['activities'] as List? ?? []).map((a) {
        return ItineraryActivity(
          time: a['time'] ?? '09:00 AM',
          title: a['title'] ?? a['location'] ?? 'Activity',
          description: a['description'] ?? '',
          location: a['location'] ?? destination,
          imageUrl: a['imageUrl'] ?? 'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg',
          estimatedCost: 350,
          duration: '2h',
        );
      }).toList();

      return ItineraryDay(
        day: d['day'] ?? 1,
        title: d['title'] ?? 'Day ${d['day'] ?? 1}',
        subtitle: 'Exploring highlights',
        activities: acts,
      );
    }).toList();

    return TripModel(
      id: 'trip_${DateTime.now().millisecondsSinceEpoch}',
      title: 'Your $durationDays-day $destination Escape',
      destination: destination,
      destinationSlug: destination.toLowerCase().replaceAll(' ', '-'),
      origin: origin,
      heroImage: 'https://images.pexels.com/photos/28570070/pexels-photo-28570070.jpeg?auto=compress&cs=tinysrgb&w=1200',
      durationDays: durationDays,
      travellers: travellers,
      totalBudget: budget,
      transport: transport,
      interests: interests,
      travelStyle: travelStyle,
      summary: data['summary'] ?? 'A hand-crafted weekend trip to $destination.',
      budget: SmartBudget(
        transport: (budget * 0.28).round(),
        stay: (budget * 0.35).round(),
        food: (budget * 0.20).round(),
        activities: (budget * 0.12).round(),
        tickets: (budget * 0.03).round(),
        miscellaneous: (budget * 0.02).round(),
        total: budget,
        perPerson: (budget / (travellers == 'Couple' ? 2 : 1)).round(),
      ),
      logistics: TripLogistics(
        distance: '${tripDetails['travel_logistics']?['car'] ?? '250 km'}',
        travelTime: '${tripDetails['travel_logistics']?['car'] ?? '4.5h drive'}',
        routeOverview: 'Highway via expressway from $origin',
        recommendedDeparture: '06:00 AM Saturday',
        returnDeparture: '04:30 PM Sunday',
      ),
      days: daysList,
      packingList: _generateDefaultPackingList(destination, interests),
      createdAt: DateTime.now(),
      startDate: DateTime.now().add(const Duration(days: 2)),
      endDate: DateTime.now().add(Duration(days: 2 + durationDays)),
    );
  }

  TripModel _generateCuratedTrip({
    required String origin,
    required String destinationName,
    required int durationDays,
    required String travellers,
    required int budget,
    required String transport,
    required List<String> interests,
    required String travelStyle,
  }) {
    DestinationModel? dest = CuratedDestinationsData.getBySlug(destinationName.toLowerCase().trim());
    dest ??= CuratedDestinationsData.destinations.first;

    final distance = dest.getDistanceKm(origin);
    final driveHours = distance / 55.0;
    final h = driveHours.floor();
    final m = ((driveHours - h) * 60).round();
    final travelTime = driveHours < 1.0 
        ? '${(driveHours * 60).round().clamp(15, 59)}m by car'
        : (m > 5 ? '${h}h ${m}m by car' : '${h}h by car');
    final totalSpent = (budget > 0) ? budget : dest.estimatedCost;

    // Build day-wise itinerary
    final List<ItineraryDay> generatedDays = [];

    // Day 1: Arrival, iconic sights, evening sunset/aarti
    generatedDays.add(
      ItineraryDay(
        day: 1,
        title: 'Arrival & Iconic Highlights',
        subtitle: 'Settle in, explore signature landmarks and evening vibe',
        activities: [
          ItineraryActivity(
            time: '06:30 AM – 11:30 AM',
            title: 'Scenic Journey to ${dest.name}',
            description: 'Departure from $origin via comfortable $transport. Enjoy scenic vistas and breakfast along highway dhaba stops.',
            location: 'Route to ${dest.name}',
            imageUrl: 'https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=800',
            estimatedCost: (totalSpent * 0.15).round(),
            duration: '5 hrs',
          ),
          ItineraryActivity(
            time: '12:00 PM – 01:30 PM',
            title: 'Hotel Check-in & Refreshment',
            description: 'Check in at your stay, unpack and savor a fresh welcome drink with local delicacies.',
            location: dest.hotels.isNotEmpty ? dest.hotels.first.name : '${dest.name} Riverside Resort',
            imageUrl: dest.hotels.isNotEmpty ? dest.hotels.first.imageUrl : dest.heroImage,
            estimatedCost: 0,
            duration: '1.5 hrs',
          ),
          ItineraryActivity(
            time: '02:00 PM – 04:30 PM',
            title: dest.attractions.isNotEmpty ? dest.attractions.first.name : 'Explore Central Landmarks',
            description: dest.attractions.isNotEmpty
                ? dest.attractions.first.description
                : 'Walk through historic streets, ancient monuments, and picturesque alleys.',
            location: dest.attractions.isNotEmpty ? dest.attractions.first.name : dest.name,
            imageUrl: dest.attractions.isNotEmpty ? dest.attractions.first.imageUrl : dest.heroImage,
            estimatedCost: 200,
            duration: '2.5 hrs',
          ),
          ItineraryActivity(
            time: '05:30 PM – 07:30 PM',
            title: 'Golden Hour Sunset & Evening Experience',
            description: 'Watch the sun dip behind the ridges while soaking in the spiritual or riverside ambiance.',
            location: '${dest.name} Sunset Point',
            imageUrl: dest.images.length > 1 ? dest.images[1] : dest.heroImage,
            estimatedCost: 150,
            duration: '2 hrs',
          ),
          ItineraryActivity(
            time: '08:30 PM – 10:00 PM',
            title: 'Dinner at ${dest.restaurants.isNotEmpty ? dest.restaurants.first.name : 'Local Cafe'}',
            description: 'Indulge in authentic local culinary specialties and relaxed music.',
            location: dest.restaurants.isNotEmpty ? dest.restaurants.first.name : 'Traditional Restaurant',
            imageUrl: dest.restaurants.isNotEmpty ? dest.restaurants.first.imageUrl : dest.heroImage,
            estimatedCost: 650,
            duration: '1.5 hrs',
          ),
        ],
      ),
    );

    // Day 2: Adventure/Nature & Sightseeing
    if (durationDays >= 2) {
      generatedDays.add(
        ItineraryDay(
          day: 2,
          title: 'Adventures, Nature & Return Journey',
          subtitle: 'Outdoor experiences, vibrant markets and return drive',
          activities: [
            ItineraryActivity(
              time: '07:30 AM – 09:30 AM',
              title: 'Morning Sunrise Walk & Breakfast',
              description: 'Fresh mountain breeze or morning heritage stroll followed by hearty breakfast.',
              location: '${dest.name} Viewpoint',
              imageUrl: dest.heroImage,
              estimatedCost: 250,
              duration: '2 hrs',
            ),
            ItineraryActivity(
              time: '10:00 AM – 01:00 PM',
              title: dest.attractions.length > 1 ? dest.attractions[1].name : 'Local Adventure Activity',
              description: dest.attractions.length > 1
                  ? dest.attractions[1].description
                  : 'Engage in signature thrills, nature walks, or craft shopping.',
              location: dest.attractions.length > 1 ? dest.attractions[1].name : dest.name,
              imageUrl: dest.attractions.length > 1 ? dest.attractions[1].imageUrl : dest.heroImage,
              estimatedCost: 600,
              duration: '3 hrs',
            ),
            ItineraryActivity(
              time: '01:30 PM – 02:45 PM',
              title: 'Farewell Lunch at ${dest.restaurants.length > 1 ? dest.restaurants[1].name : 'Boutique Bistro'}',
              description: 'Enjoy a farewell feast before packing and beginning the pleasant return ride.',
              location: dest.name,
              imageUrl: dest.restaurants.length > 1 ? dest.restaurants[1].imageUrl : dest.heroImage,
              estimatedCost: 500,
              duration: '1.2 hrs',
            ),
            ItineraryActivity(
              time: '04:00 PM – 09:00 PM',
              title: 'Smooth Return Journey to $origin',
              description: 'Head back home refreshed with unforgettable memories and stories to share.',
              location: 'Enroute to $origin',
              imageUrl: 'https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=800',
              estimatedCost: (totalSpent * 0.12).round(),
              duration: '5 hrs',
            ),
          ],
        ),
      );
    }

    // Day 3 if requested
    if (durationDays >= 3) {
      generatedDays.insert(
        2,
        ItineraryDay(
          day: 3,
          title: 'Hidden Trails & Deep Exploration',
          subtitle: 'Offbeat temples, waterfalls, and peaceful retreats',
          activities: [
            ItineraryActivity(
              time: '08:30 AM – 12:30 PM',
              title: 'Secret Waterfall Hike & Forest Trail',
              description: 'Trek through pristine green paths to a secluded waterfall pool.',
              location: '${dest.name} Outskirts',
              imageUrl: dest.heroImage,
              estimatedCost: 400,
              duration: '4 hrs',
            ),
            ItineraryActivity(
              time: '01:00 PM – 03:00 PM',
              title: 'Artisan Village & Souvenir Shopping',
              description: 'Pick up handmade crafts, spices, and unique gifts directly from local artisans.',
              location: '${dest.name} Craft Market',
              imageUrl: dest.images.first,
              estimatedCost: 700,
              duration: '2 hrs',
            ),
          ],
        ),
      );
    }

    final personDivisor = (travellers.toLowerCase() == 'couple') ? 2 : (travellers.toLowerCase() == 'family' ? 3 : 1);

    return TripModel(
      id: 'trip_${DateTime.now().millisecondsSinceEpoch}',
      title: 'Your $durationDays-day ${dest.name} Escape',
      destination: dest.name,
      destinationSlug: dest.slug,
      origin: origin,
      heroImage: dest.heroImage,
      durationDays: durationDays,
      travellers: travellers,
      totalBudget: totalSpent,
      transport: transport,
      interests: interests.isNotEmpty ? interests : ['Nature', 'Adventure', 'Food'],
      travelStyle: travelStyle,
      summary: 'A curated $durationDays-day $travelStyle weekend retreat to ${dest.name} from $origin, featuring hand-picked stays, iconic landmarks, and authentic culinary dining.',
      budget: SmartBudget(
        transport: (totalSpent * 0.28).round(),
        stay: (totalSpent * 0.35).round(),
        food: (totalSpent * 0.20).round(),
        activities: (totalSpent * 0.12).round(),
        tickets: (totalSpent * 0.03).round(),
        miscellaneous: (totalSpent * 0.02).round(),
        total: totalSpent,
        perPerson: (totalSpent / personDivisor).round(),
      ),
      logistics: TripLogistics(
        distance: '$distance km',
        travelTime: travelTime,
        routeOverview: 'Smooth highway drive from $origin to ${dest.name}',
        recommendedDeparture: '06:00 AM Saturday',
        returnDeparture: '04:00 PM Sunday',
      ),
      days: generatedDays,
      packingList: _generateDefaultPackingList(dest.name, interests),
      createdAt: DateTime.now(),
      startDate: DateTime.now().add(const Duration(days: 2)),
      endDate: DateTime.now().add(Duration(days: 2 + durationDays)),
    );
  }

  List<TripPackingItem> _generateDefaultPackingList(String destination, List<String> interests) {
    return [
      TripPackingItem(item: 'Valid Government Photo ID', category: 'Essentials', isChecked: true),
      TripPackingItem(item: 'Mobile Phone Charger & Fast Power Bank', category: 'Electronics', isChecked: true),
      TripPackingItem(item: 'Breathable walking & trekking shoes', category: 'Clothing', isChecked: false),
      TripPackingItem(item: 'Light rain jacket or windcheater', category: 'Clothing', isChecked: false),
      TripPackingItem(item: 'Sunglasses & Sunscreen (SPF 50+)', category: 'Personal Care', isChecked: false),
      TripPackingItem(item: 'Personal First-Aid & Motion Sickness meds', category: 'Health', isChecked: false),
      TripPackingItem(item: 'Reusable water bottle', category: 'Essentials', isChecked: false),
      if (interests.any((i) => i.toLowerCase().contains('adventure')))
        TripPackingItem(item: 'Quick-dry clothes & waterproof bag', category: 'Adventure', isChecked: false),
      if (interests.any((i) => i.toLowerCase().contains('spiritual')))
        TripPackingItem(item: 'Modest temple attire & scarf', category: 'Clothing', isChecked: false),
    ];
  }
}
