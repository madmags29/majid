import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import '../../core/constants/app_constants.dart';
import '../../core/network/api_client.dart';
import '../../core/storage/local_storage_service.dart';
import '../../features/trip_planner/data/trip_generator_service.dart';
import '../data/curated_destinations.dart';
import '../models/destination_model.dart';
import '../models/trip_model.dart';

// 1. STORAGE PROVIDER
final localStorageProvider = Provider<LocalStorageService>((ref) {
  throw UnimplementedError('Initialize localStorageProvider in main.dart');
});

// 2. API CLIENT PROVIDER
final apiClientProvider = Provider<ApiClient>((ref) {
  final storage = ref.watch(localStorageProvider);
  return ApiClient(storage);
});

// 3. TRIP GENERATOR SERVICE PROVIDER
final tripGeneratorServiceProvider = Provider<TripGeneratorService>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return TripGeneratorService(apiClient);
});

// 4. THEME MODE NOTIFIER (Riverpod Notifier)
class ThemeModeNotifier extends Notifier<ThemeMode> {
  @override
  ThemeMode build() {
    final storage = ref.watch(localStorageProvider);
    final modeStr = storage.getThemeMode();
    switch (modeStr) {
      case 'dark':
        return ThemeMode.dark;
      case 'system':
        return ThemeMode.system;
      default:
        return ThemeMode.light;
    }
  }

  void setThemeMode(ThemeMode mode) {
    state = mode;
    final storage = ref.read(localStorageProvider);
    final str = mode == ThemeMode.dark
        ? 'dark'
        : (mode == ThemeMode.light ? 'light' : 'system');
    storage.setThemeMode(str);
  }
}

final themeModeProvider = NotifierProvider<ThemeModeNotifier, ThemeMode>(ThemeModeNotifier.new);

// 5. USER ORIGIN LOCATION NOTIFIER
class UserLocationState {
  final String city;
  final double lat;
  final double lng;
  final bool isGpsLoading;
  final String? error;

  UserLocationState({
    required this.city,
    required this.lat,
    required this.lng,
    this.isGpsLoading = false,
    this.error,
  });

  UserLocationState copyWith({
    String? city,
    double? lat,
    double? lng,
    bool? isGpsLoading,
    String? error,
  }) {
    return UserLocationState(
      city: city ?? this.city,
      lat: lat ?? this.lat,
      lng: lng ?? this.lng,
      isGpsLoading: isGpsLoading ?? this.isGpsLoading,
      error: error,
    );
  }
}

class UserLocationNotifier extends Notifier<UserLocationState> {
  @override
  UserLocationState build() {
    final storage = ref.watch(localStorageProvider);
    return UserLocationState(
      city: storage.getOriginCity(),
      lat: storage.getOriginCoordinates().$1,
      lng: storage.getOriginCoordinates().$2,
    );
  }

  void setCity(String city, {double? lat, double? lng}) {
    state = state.copyWith(city: city, lat: lat, lng: lng);
    final storage = ref.read(localStorageProvider);
    storage.setOriginCity(city, lat: lat, lng: lng);
  }

  Future<void> detectGpsLocation() async {
    state = state.copyWith(isGpsLoading: true, error: null);
    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        state = state.copyWith(
          isGpsLoading: false,
          error: 'Location services are disabled on your device.',
        );
        return;
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          state = state.copyWith(
            isGpsLoading: false,
            error: 'Location permission denied. You can select your city manually.',
          );
          return;
        }
      }

      if (permission == LocationPermission.deniedForever) {
        state = state.copyWith(
          isGpsLoading: false,
          error: 'Location permission permanently denied.',
        );
        return;
      }

      final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.medium,
        timeLimit: const Duration(seconds: 8),
      );

      // Match closest Indian Hub
      String closestCity = 'Delhi';
      double minDistance = double.infinity;

      for (final hub in AppConstants.majorHubs) {
        final dist = Geolocator.distanceBetween(
          position.latitude,
          position.longitude,
          hub['lat'] as double,
          hub['lng'] as double,
        );
        if (dist < minDistance) {
          minDistance = dist;
          closestCity = hub['name'] as String;
        }
      }

      setCity(closestCity, lat: position.latitude, lng: position.longitude);
      state = state.copyWith(isGpsLoading: false);
    } catch (e) {
      state = state.copyWith(
        isGpsLoading: false,
        error: 'Unable to pinpoint GPS. Using current city.',
      );
    }
  }

  Future<void> autoDetectLocation() async {
    try {
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }
      if (permission == LocationPermission.whileInUse ||
          permission == LocationPermission.always) {
        await detectGpsLocation();
      }
    } catch (_) {}
  }
}

final userLocationProvider = NotifierProvider<UserLocationNotifier, UserLocationState>(UserLocationNotifier.new);

// 6. SAVED DESTINATIONS NOTIFIER
class SavedDestinationsNotifier extends Notifier<List<String>> {
  @override
  List<String> build() {
    final storage = ref.watch(localStorageProvider);
    return storage.getSavedDestinationIds();
  }

  Future<void> toggleSaved(String destinationId) async {
    final updatedState = List<String>.from(state);
    if (updatedState.contains(destinationId)) {
      updatedState.remove(destinationId);
    } else {
      updatedState.add(destinationId);
    }
    state = updatedState;
    final storage = ref.read(localStorageProvider);
    await storage.toggleSavedDestination(destinationId);
  }

  bool isSaved(String destinationId) => state.contains(destinationId);
}

final savedDestinationsProvider = NotifierProvider<SavedDestinationsNotifier, List<String>>(SavedDestinationsNotifier.new);

// 7. SAVED TRIPS NOTIFIER
class SavedTripsNotifier extends Notifier<List<TripModel>> {
  @override
  List<TripModel> build() {
    final storage = ref.watch(localStorageProvider);
    final raw = storage.getSavedTrips();
    return raw.map((t) => TripModel.fromJson(t)).toList();
  }

  Future<void> saveTrip(TripModel trip) async {
    final updated = trip.copyWith(isSaved: true);
    final list = List<TripModel>.from(state);
    list.removeWhere((t) => t.id == updated.id);
    list.insert(0, updated);
    state = list;
    final storage = ref.read(localStorageProvider);
    await storage.saveTripLocally(updated.toJson());
  }

  Future<void> deleteTrip(String tripId) async {
    final list = List<TripModel>.from(state);
    list.removeWhere((t) => t.id == tripId);
    state = list;
    final storage = ref.read(localStorageProvider);
    await storage.deleteTripLocally(tripId);
  }
}

final savedTripsProvider = NotifierProvider<SavedTripsNotifier, List<TripModel>>(SavedTripsNotifier.new);

// 8. EXPLORE FILTER STATE
class ExploreFilterState {
  final String selectedCategory;
  final int? maxDistanceKm;
  final int? maxBudget;
  final String searchQuery;
  final bool isMapView;

  ExploreFilterState({
    this.selectedCategory = 'All',
    this.maxDistanceKm,
    this.maxBudget,
    this.searchQuery = '',
    this.isMapView = false,
  });

  ExploreFilterState copyWith({
    String? selectedCategory,
    int? maxDistanceKm,
    int? maxBudget,
    String? searchQuery,
    bool? isMapView,
  }) {
    return ExploreFilterState(
      selectedCategory: selectedCategory ?? this.selectedCategory,
      maxDistanceKm: maxDistanceKm ?? this.maxDistanceKm,
      maxBudget: maxBudget ?? this.maxBudget,
      searchQuery: searchQuery ?? this.searchQuery,
      isMapView: isMapView ?? this.isMapView,
    );
  }
}

class ExploreFilterNotifier extends Notifier<ExploreFilterState> {
  @override
  ExploreFilterState build() => ExploreFilterState();

  void setCategory(String category) {
    state = state.copyWith(selectedCategory: category);
  }

  void setDistance(int? maxDistanceKm) {
    state = state.copyWith(maxDistanceKm: maxDistanceKm);
  }

  void setBudget(int? maxBudget) {
    state = state.copyWith(maxBudget: maxBudget);
  }

  void setSearchQuery(String query) {
    state = state.copyWith(searchQuery: query);
  }

  void toggleMapView() {
    state = state.copyWith(isMapView: !state.isMapView);
  }

  void reset() {
    state = ExploreFilterState();
  }
}

final exploreFilterProvider = NotifierProvider<ExploreFilterNotifier, ExploreFilterState>(ExploreFilterNotifier.new);

// 9. FILTERED DESTINATIONS PROVIDER
final filteredDestinationsProvider = Provider<List<DestinationModel>>((ref) {
  final filter = ref.watch(exploreFilterProvider);
  final location = ref.watch(userLocationProvider);

  var list = CuratedDestinationsData.destinations;

  if (filter.searchQuery.isNotEmpty) {
    list = CuratedDestinationsData.search(filter.searchQuery);
  }

  if (filter.selectedCategory != 'All' && !filter.selectedCategory.contains('Nearby')) {
    list = list.where((d) {
      return d.categories.any((c) => c.toLowerCase().contains(filter.selectedCategory.toLowerCase())) ||
          d.idealFor.any((i) => i.toLowerCase().contains(filter.selectedCategory.toLowerCase()));
    }).toList();
  }

  if (filter.maxDistanceKm != null) {
    list = list.where((d) => d.getDistanceKm(location.city, location.lat, location.lng) <= filter.maxDistanceKm!).toList();
  }

  if (filter.maxBudget != null) {
    list = list.where((d) => d.minBudget <= filter.maxBudget!).toList();
  }

  // Sort by proximity to user current location
  final sortedList = List<DestinationModel>.from(list);
  sortedList.sort((a, b) => a.getDistanceKm(location.city, location.lat, location.lng)
      .compareTo(b.getDistanceKm(location.city, location.lat, location.lng)));

  return sortedList;
});
