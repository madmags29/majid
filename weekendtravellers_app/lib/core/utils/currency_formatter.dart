import 'package:intl/intl.dart';

/// Formatter for Currency (INR and International)
class CurrencyFormatter {
  CurrencyFormatter._();

  static final NumberFormat _inrFormatter = NumberFormat.currency(
    locale: 'en_IN',
    symbol: '₹',
    decimalDigits: 0,
  );

  /// Format numeric amount as Indian Rupees (e.g. 7500 -> ₹7,500)
  static String formatInr(num amount) {
    try {
      return _inrFormatter.format(amount);
    } catch (_) {
      return '₹${amount.toInt()}';
    }
  }

  /// Format compact for chips/badges (e.g. 5000 -> ₹5K, 12500 -> ₹12.5K)
  static String formatCompactInr(num amount) {
    if (amount >= 10000000) {
      return '₹${(amount / 10000000).toStringAsFixed(1)}Cr';
    }
    if (amount >= 100000) {
      return '₹${(amount / 100000).toStringAsFixed(1)}L';
    }
    if (amount >= 1000) {
      final k = amount / 1000;
      return '₹${k % 1 == 0 ? k.toInt() : k.toStringAsFixed(1)}K';
    }
    return '₹$amount';
  }
}
