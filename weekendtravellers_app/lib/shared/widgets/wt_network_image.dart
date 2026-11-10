import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import 'wt_skeleton.dart';

/// Resilient, high-performance Network Image for WeekendTravellers
/// Guarantees no uncaught network exceptions, beautiful shimmer, and graceful brand fallbacks
class WTNetworkImage extends StatelessWidget {
  final String imageUrl;
  final double? width;
  final double? height;
  final BoxFit fit;
  final BorderRadius? borderRadius;
  final IconData fallbackIcon;

  const WTNetworkImage({
    super.key,
    required this.imageUrl,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
    this.borderRadius,
    this.fallbackIcon = Icons.landscape_rounded,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    Widget imageWidget = CachedNetworkImage(
      imageUrl: imageUrl.trim().isNotEmpty
          ? imageUrl.trim()
          : 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      width: width,
      height: height,
      fit: fit,
      placeholder: (context, url) => WTSkeleton(
        width: width ?? double.infinity,
        height: height ?? double.infinity,
      ),
      errorWidget: (context, url, error) => Container(
        width: width,
        height: height,
        color: isDark ? const Color(0xFF14201D) : const Color(0xFFE8EFE9),
        alignment: Alignment.center,
        child: Icon(
          fallbackIcon,
          color: isDark ? AppColors.primary.withOpacity(0.5) : AppColors.primaryLight,
          size: (height != null && height! < 60) ? 22 : 36,
        ),
      ),
    );

    if (borderRadius != null) {
      imageWidget = ClipRRect(
        borderRadius: borderRadius!,
        child: imageWidget,
      );
    }

    return imageWidget;
  }
}
