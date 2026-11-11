import 'package:intl/intl.dart';
import '../../shared/data/holiday_data.dart';

/// Formatter for travel dates and weekend calculations
class DateFormatter {
  DateFormatter._();

  static final DateFormat _tripDate = DateFormat('EEE, d MMM');

  /// Format date for trip display (e.g., "Sat, 25 Oct")
  static String formatTripDate(DateTime date) {
    return _tripDate.format(date);
  }

  /// Format date range (e.g. "25 - 26 Oct 2026")
  static String formatDateRange(DateTime start, DateTime end) {
    final startDay = DateFormat('d MMM').format(start);
    final endDay = DateFormat('d MMM yyyy').format(end);
    return '$startDay – $endDay';
  }

  /// Get the upcoming Saturday & Sunday dates
  static (DateTime, DateTime) getUpcomingWeekend() {
    final now = DateTime.now();
    final daysUntilSaturday = (DateTime.saturday - now.weekday + 7) % 7;
    final saturday = now.add(Duration(days: daysUntilSaturday == 0 ? 7 : daysUntilSaturday));
    final sunday = saturday.add(const Duration(days: 1));
    return (saturday, sunday);
  }

  /// Get next week's weekend
  static (DateTime, DateTime) getNextWeekend() {
    final (thisSat, _) = getUpcomingWeekend();
    final nextSat = thisSat.add(const Duration(days: 7));
    final nextSun = nextSat.add(const Duration(days: 1));
    return (nextSat, nextSun);
  }

  /// Check for upcoming long weekends in India & World (holiday adjacent to Friday or Monday)
  static Map<String, dynamic>? getUpcomingLongWeekend({String? regionPreference}) {
    final nextHoliday = HolidayData.getNextUpcomingHoliday(regionPreference: regionPreference);
    return nextHoliday?.toMap();
  }

  /// Get all upcoming curated holidays for India and World
  static List<Map<String, dynamic>> getAllUpcomingHolidays({String? regionPreference}) {
    final now = DateTime.now();
    List<HolidayModel> list;
    if (regionPreference == 'India') {
      list = HolidayData.indiaHolidays;
    } else if (regionPreference == 'World') {
      list = HolidayData.worldHolidays;
    } else {
      list = HolidayData.getAllHolidays();
    }
    return list
        .where((h) => h.end.isAfter(now))
        .map((h) => h.toMap())
        .toList();
  }
}
