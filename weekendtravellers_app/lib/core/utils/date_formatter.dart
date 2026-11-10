import 'package:intl/intl.dart';

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

  /// Check for upcoming long weekends in India (e.g. holiday adjacent to Friday or Monday)
  static Map<String, dynamic>? getUpcomingLongWeekend() {
    // Curated dynamic long weekends (holiday calendar model)
    final now = DateTime.now();
    final sampleLongWeekends = [
      {
        'title': 'Diwali Long Weekend',
        'start': DateTime(now.year, 11, 1),
        'end': DateTime(now.year, 11, 3),
        'days': 3,
        'tag': 'Festive Escape',
      },
      {
        'title': 'Republic Day Long Weekend',
        'start': DateTime(now.year + 1, 1, 24),
        'end': DateTime(now.year + 1, 1, 26),
        'days': 3,
        'tag': 'Winter Getaway',
      },
      {
        'title': 'Holi Long Weekend',
        'start': DateTime(now.year + 1, 3, 14),
        'end': DateTime(now.year + 1, 3, 16),
        'days': 3,
        'tag': 'Spring Escape',
      },
    ];

    for (final lw in sampleLongWeekends) {
      final start = lw['start'] as DateTime;
      if (start.isAfter(now)) {
        return lw;
      }
    }
    return null;
  }
}
