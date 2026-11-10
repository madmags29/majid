/// WeekendTravellers App-wide Constants
class AppConstants {
  AppConstants._();

  static const String appName = 'WeekendTravellers';
  static const String appTagline = 'Your perfect weekend, planned by AI.';
  static const String appDescription = 'Discover amazing places near you and instantly create a personalized 2–3 day weekend trip.';
  static const String websiteUrl = 'https://weekendtravellers.com';
  
  // Storage Keys
  static const String keyUserToken = 'wt_user_token';
  static const String keyUserData = 'wt_user_data';
  static const String keyIsGuest = 'wt_is_guest';
  static const String keyHasSeenOnboarding = 'wt_has_seen_onboarding';
  static const String keyUserOriginCity = 'wt_origin_city';
  static const String keyUserOriginLat = 'wt_origin_lat';
  static const String keyUserOriginLng = 'wt_origin_lng';
  static const String keySavedTrips = 'wt_saved_trips';
  static const String keySavedDestinations = 'wt_saved_destinations';
  static const String keyRecentSearches = 'wt_recent_searches';
  static const String keyThemeMode = 'wt_theme_mode';

  // Default Fallback Origin
  static const String defaultCity = 'Delhi';
  static const double defaultLat = 28.6139;
  static const double defaultLng = 77.2090;

  // Major Indian Hubs
  static const List<Map<String, dynamic>> majorHubs = [
    {'name': 'Delhi', 'state': 'Delhi NCR', 'lat': 28.6139, 'lng': 77.2090},
    {'name': 'Mumbai', 'state': 'Maharashtra', 'lat': 19.0760, 'lng': 72.8777},
    {'name': 'Bangalore', 'state': 'Karnataka', 'lat': 12.9716, 'lng': 77.5946},
    {'name': 'Hyderabad', 'state': 'Telangana', 'lat': 17.3850, 'lng': 78.4867},
    {'name': 'Chennai', 'state': 'Tamil Nadu', 'lat': 13.0827, 'lng': 80.2707},
    {'name': 'Kolkata', 'state': 'West Bengal', 'lat': 22.5726, 'lng': 88.3639},
    {'name': 'Pune', 'state': 'Maharashtra', 'lat': 18.5204, 'lng': 73.8567},
    {'name': 'Jaipur', 'state': 'Rajasthan', 'lat': 26.9124, 'lng': 75.7873},
    {'name': 'Chandigarh', 'state': 'Punjab/Haryana', 'lat': 30.7333, 'lng': 76.7794},
    {'name': 'Ahmedabad', 'state': 'Gujarat', 'lat': 23.0225, 'lng': 72.5714},
    {'name': 'Dehradun', 'state': 'Uttarakhand', 'lat': 30.3165, 'lng': 78.0322},
    {'name': 'Goa', 'state': 'Goa', 'lat': 15.2993, 'lng': 74.1240},
    {'name': 'Kochi', 'state': 'Kerala', 'lat': 9.9312, 'lng': 76.2673},
    {'name': 'Lucknow', 'state': 'Uttar Pradesh', 'lat': 26.8467, 'lng': 80.9462},
    {'name': 'Indore', 'state': 'Madhya Pradesh', 'lat': 22.7196, 'lng': 75.8577},
    {'name': 'Bhopal', 'state': 'Madhya Pradesh', 'lat': 23.2599, 'lng': 77.4126},
    {'name': 'Bhubaneswar', 'state': 'Odisha', 'lat': 20.2961, 'lng': 85.8245},
    {'name': 'Guwahati', 'state': 'Assam', 'lat': 26.1445, 'lng': 91.7362},
    {'name': 'Amritsar', 'state': 'Punjab', 'lat': 31.6340, 'lng': 74.8723},
    {'name': 'Shimla', 'state': 'Himachal Pradesh', 'lat': 31.1048, 'lng': 77.1734},
    {'name': 'Coimbatore', 'state': 'Tamil Nadu', 'lat': 11.0168, 'lng': 76.9558},
    {'name': 'Visakhapatnam', 'state': 'Andhra Pradesh', 'lat': 17.6868, 'lng': 83.2185},
    {'name': 'Varanasi', 'state': 'Uttar Pradesh', 'lat': 25.3176, 'lng': 82.9739},
    {'name': 'Surat', 'state': 'Gujarat', 'lat': 21.1702, 'lng': 72.8311},
    {'name': 'Dubai', 'state': 'UAE', 'lat': 25.2048, 'lng': 55.2708},
    {'name': 'London', 'state': 'United Kingdom', 'lat': 51.5074, 'lng': -0.1278},
    {'name': 'Singapore', 'state': 'Singapore', 'lat': 1.3521, 'lng': 103.8198},
    {'name': 'Paris', 'state': 'France', 'lat': 48.8566, 'lng': 2.3522},
    {'name': 'New York', 'state': 'United States', 'lat': 40.7128, 'lng': -74.0060},
    {'name': 'Tokyo', 'state': 'Japan', 'lat': 35.6762, 'lng': 139.6503},
    {'name': 'Bangkok', 'state': 'Thailand', 'lat': 13.7563, 'lng': 100.5018},
    {'name': 'Sydney', 'state': 'Australia', 'lat': -33.8688, 'lng': 151.2093},
    {'name': 'Zurich', 'state': 'Switzerland', 'lat': 47.3769, 'lng': 8.5417},
    {'name': 'Toronto', 'state': 'Canada', 'lat': 43.6532, 'lng': -79.3832},
  ];

  // Quick Discovery Chips
  static const List<String> discoveryChips = [
    'Nearby',
    'Under ₹5,000',
    '2 Days',
    '3 Days',
    'Couples ❤️',
    'Adventure ⛰️',
    'Family 👨‍👩‍👧',
    'Nature 🌿',
    'Road Trips 🚗',
    'Mountains 🏔️',
    'Spiritual 🪔',
  ];

  // Travel Styles
  static const List<String> travelStyles = [
    'Budget',
    'Balanced',
    'Premium',
  ];

  // Transport Modes
  static const List<String> transportModes = [
    'Car',
    'Bike',
    'Train',
    'Bus',
    'Flight',
  ];

  // Companion Types
  static const List<String> companionTypes = [
    'Solo',
    'Couple',
    'Family',
    'Friends',
  ];

  // Durations
  static const List<String> durations = [
    '1 Day',
    '2 Days',
    '3 Days',
  ];

  // Budget Options (INR)
  static const List<int> budgetPresets = [
    2500,
    5000,
    10000,
    20000,
  ];
}
