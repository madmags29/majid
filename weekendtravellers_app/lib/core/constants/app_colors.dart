import 'package:flutter/material.dart';

/// WeekendTravellers Brand & UI Color System
/// Color Theme: Electric Royal Blue & Energetic Sunset Orange
class AppColors {
  AppColors._();

  // Primary: Electric Royal Blue
  static const Color primary = Color(0xFF0D52D6); // Electric Royal Blue
  static const Color primaryLight = Color(0xFF2563EB); // Radiant Azure Blue
  static const Color primaryDark = Color(0xFF093994); // Deep Midnight Navy
  static const Color primaryContainer = Color(0xFFEBF2FE); // Soft Ice / Sky Blue
  static const Color onPrimaryContainer = Color(0xFF06215C); // Deep Blue Text

  // Accent: Energetic Sunset Orange
  static const Color accent = Color(0xFFFF6A00); // Energetic Sunset Orange
  static const Color accentLight = Color(0xFFFF8533); // Radiant Warm Orange
  static const Color accentDark = Color(0xFFD95300); // Deep Sunset Amber
  static const Color accentContainer = Color(0xFFFFF2E8); // Soft Peach Orange
  static const Color onAccentContainer = Color(0xFF662400); // Deep Orange Text

  // Secondary Highlight: Warm Coral
  static const Color crimson = Color(0xFFFF4D30); // Warm Coral
  static const Color crimsonLight = Color(0xFFFF6B52);
  static const Color crimsonDark = Color(0xFFD63116);
  static const Color crimsonContainer = Color(0xFFFFECE8);
  static const Color onCrimsonContainer = Color(0xFF5E0F03);

  // Secondary Warm Sand / Slate
  static const Color sand = Color(0xFFF8FAFC);
  static const Color sandDark = Color(0xFFE2E8F0);
  static const Color warmCream = Color(0xFFFFFFFF);

  // Light Theme Surfaces & Neutrals
  static const Color lightBg = Color(0xFFF8FAFC);
  static const Color lightSurface = Color(0xFFFFFFFF);
  static const Color lightSurfaceSubtle = Color(0xFFF1F5F9);
  static const Color lightBorder = Color(0xFFE2E8F0);
  static const Color lightBorderSubtle = Color(0xFFEDF2F7);

  static const Color textPrimaryLight = Color(0xFF0F172A);
  static const Color textSecondaryLight = Color(0xFF334155);
  static const Color textMutedLight = Color(0xFF64748B);

  // Dark Theme Surfaces & Neutrals (Deep Midnight Navy)
  static const Color darkBg = Color(0xFF0A0F1D);
  static const Color darkSurface = Color(0xFF111827);
  static const Color darkSurfaceSubtle = Color(0xFF1E293B);
  static const Color darkBorder = Color(0xFF334155);
  static const Color darkBorderSubtle = Color(0xFF1E293B);

  static const Color textPrimaryDark = Color(0xFFF8FAFC);
  static const Color textSecondaryDark = Color(0xFFCBD5E1);
  static const Color textMutedDark = Color(0xFF94A3B8);

  // Semantic Colors
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
  static const Color info = Color(0xFF0D52D6);

  // Tag / Chip Colors
  static const Color chipNature = Color(0xFFEBF2FE);
  static const Color chipAdventure = Color(0xFFFFF2E8);
  static const Color chipRomance = Color(0xFFFFECE8);
  static const Color chipSpiritual = Color(0xFFF3E8FF);

  // Overlay Gradients
  static const LinearGradient heroImageGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [
      Colors.transparent,
      Colors.black26,
      Colors.black87,
    ],
    stops: [0.3, 0.65, 1.0],
  );

  static const LinearGradient cardGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [
      Colors.transparent,
      Color(0x33000000),
      Color(0xD9000000),
    ],
    stops: [0.4, 0.7, 1.0],
  );

  // Brand Gradients: Electric Royal Blue & Sunset Orange
  static const LinearGradient blueGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0xFF0D52D6),
      Color(0xFF2563EB),
    ],
  );

  static const LinearGradient orangeGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0xFFFF6A00),
      Color(0xFFFF8533),
    ],
  );

  // Backward-compatibility aliases
  static const LinearGradient oliveGradient = blueGradient;
  static const LinearGradient emeraldGradient = blueGradient;
  static const LinearGradient rustOrangeGradient = orangeGradient;
  static const LinearGradient sunsetGradient = orangeGradient;
  static const LinearGradient crimsonGradient = orangeGradient;

  // Hero Gradient: Electric Blue -> Azure Blue -> Sunset Orange
  static const LinearGradient triadHeroGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0xFF0D52D6),
      Color(0xFF2563EB),
      Color(0xFFFF6A00),
    ],
  );
}
