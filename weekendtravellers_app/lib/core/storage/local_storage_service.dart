import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/app_constants.dart';

/// Centralized Local Storage Service using SharedPreferences
class LocalStorageService {
  final SharedPreferences _prefs;

  LocalStorageService(this._prefs);

  static Future<LocalStorageService> init() async {
    final prefs = await SharedPreferences.getInstance();
    return LocalStorageService(prefs);
  }

  // Onboarding
  bool hasSeenOnboarding() {
    return _prefs.getBool(AppConstants.keyHasSeenOnboarding) ?? false;
  }

  Future<void> setHasSeenOnboarding(bool value) async {
    await _prefs.setBool(AppConstants.keyHasSeenOnboarding, value);
  }

  // Origin Location
  String getOriginCity() {
    return _prefs.getString(AppConstants.keyUserOriginCity) ?? AppConstants.defaultCity;
  }

  Future<void> setOriginCity(String city, {double? lat, double? lng}) async {
    await _prefs.setString(AppConstants.keyUserOriginCity, city);
    if (lat != null && lng != null) {
      await _prefs.setDouble(AppConstants.keyUserOriginLat, lat);
      await _prefs.setDouble(AppConstants.keyUserOriginLng, lng);
    }
  }

  (double, double) getOriginCoordinates() {
    final lat = _prefs.getDouble(AppConstants.keyUserOriginLat) ?? AppConstants.defaultLat;
    final lng = _prefs.getDouble(AppConstants.keyUserOriginLng) ?? AppConstants.defaultLng;
    return (lat, lng);
  }

  // Auth / Guest
  bool isGuest() {
    return _prefs.getBool(AppConstants.keyIsGuest) ?? true;
  }

  Future<void> setGuest(bool isGuest) async {
    await _prefs.setBool(AppConstants.keyIsGuest, isGuest);
  }

  String? getUserToken() {
    return _prefs.getString(AppConstants.keyUserToken);
  }

  Future<void> setUserToken(String? token) async {
    if (token == null) {
      await _prefs.remove(AppConstants.keyUserToken);
    } else {
      await _prefs.setString(AppConstants.keyUserToken, token);
    }
  }

  Map<String, dynamic>? getUserData() {
    final str = _prefs.getString(AppConstants.keyUserData);
    if (str == null) return null;
    try {
      return jsonDecode(str) as Map<String, dynamic>;
    } catch (_) {
      return null;
    }
  }

  Future<void> setUserData(Map<String, dynamic>? data) async {
    if (data == null) {
      await _prefs.remove(AppConstants.keyUserData);
    } else {
      await _prefs.setString(AppConstants.keyUserData, jsonEncode(data));
    }
  }

  // Recent Searches
  List<String> getRecentSearches() {
    return _prefs.getStringList(AppConstants.keyRecentSearches) ??
        ['Rishikesh', 'Jaipur', 'Agra', 'Manali'];
  }

  Future<void> addRecentSearch(String query) async {
    final list = getRecentSearches();
    list.removeWhere((item) => item.toLowerCase() == query.toLowerCase());
    list.insert(0, query);
    if (list.length > 8) list.removeLast();
    await _prefs.setStringList(AppConstants.keyRecentSearches, list);
  }

  // Saved Destinations
  List<String> getSavedDestinationIds() {
    return _prefs.getStringList(AppConstants.keySavedDestinations) ?? [];
  }

  Future<bool> toggleSavedDestination(String destinationId) async {
    final list = getSavedDestinationIds();
    final isSaved = list.contains(destinationId);
    if (isSaved) {
      list.remove(destinationId);
    } else {
      list.add(destinationId);
    }
    await _prefs.setStringList(AppConstants.keySavedDestinations, list);
    return !isSaved;
  }

  bool isDestinationSaved(String destinationId) {
    return getSavedDestinationIds().contains(destinationId);
  }

  // Offline Saved Trips
  List<Map<String, dynamic>> getSavedTrips() {
    final raw = _prefs.getStringList(AppConstants.keySavedTrips) ?? [];
    return raw.map((item) {
      try {
        return jsonDecode(item) as Map<String, dynamic>;
      } catch (_) {
        return <String, dynamic>{};
      }
    }).where((item) => item.isNotEmpty).toList();
  }

  Future<void> saveTripLocally(Map<String, dynamic> trip) async {
    final trips = getSavedTrips();
    final id = trip['id'] ?? trip['_id'];
    trips.removeWhere((t) => (t['id'] ?? t['_id']) == id);
    trips.insert(0, trip);
    final raw = trips.map((t) => jsonEncode(t)).toList();
    await _prefs.setStringList(AppConstants.keySavedTrips, raw);
  }

  Future<void> deleteTripLocally(String tripId) async {
    final trips = getSavedTrips();
    trips.removeWhere((t) => (t['id'] ?? t['_id']) == tripId);
    final raw = trips.map((t) => jsonEncode(t)).toList();
    await _prefs.setStringList(AppConstants.keySavedTrips, raw);
  }

  // Theme Mode
  String getThemeMode() {
    return _prefs.getString(AppConstants.keyThemeMode) ?? 'light';
  }

  Future<void> setThemeMode(String mode) async {
    await _prefs.setString(AppConstants.keyThemeMode, mode);
  }
}
