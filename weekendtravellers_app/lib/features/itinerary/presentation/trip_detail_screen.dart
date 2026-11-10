import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/utils/currency_formatter.dart';
import '../../../shared/models/trip_model.dart';
import '../../../shared/providers/app_providers.dart';
import '../../../shared/widgets/wt_budget_card.dart';
import '../../../shared/widgets/wt_button.dart';
import '../../../shared/widgets/wt_itinerary_card.dart';
import '../../../shared/widgets/wt_network_image.dart';
import '../../trip_planner/presentation/ai_generation_screen.dart';

/// Complete Trip & Itinerary Management Screen
class TripDetailScreen extends ConsumerStatefulWidget {
  final String tripId;

  const TripDetailScreen({super.key, required this.tripId});

  @override
  ConsumerState<TripDetailScreen> createState() => _TripDetailScreenState();
}

class _TripDetailScreenState extends ConsumerState<TripDetailScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  int _selectedDayIndex = 0;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  TripModel? _resolveTrip() {
    // 1. Check active trip provider
    final active = ref.read(activeTripProvider);
    if (active != null && active.id == widget.tripId) return active;

    // 2. Check saved trips
    final savedTrips = ref.read(savedTripsProvider);
    try {
      return savedTrips.firstWhere((t) => t.id == widget.tripId);
    } catch (_) {
      return active ?? (savedTrips.isNotEmpty ? savedTrips.first : null);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final trip = _resolveTrip();

    if (trip == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Trip')),
        body: const Center(child: Text('Trip not found or expired.')),
      );
    }

    if (_tabController.length != trip.days.length) {
      _tabController = TabController(length: trip.days.length, vsync: this);
    }

    return Scaffold(
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          // Hero Header SliverAppBar
          SliverAppBar(
            expandedHeight: 340,
            pinned: true,
            elevation: 0,
            backgroundColor: isDark ? AppColors.darkSurface : AppColors.lightSurface,
            leading: Container(
              margin: const EdgeInsets.only(left: 12),
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.4),
                shape: BoxShape.circle,
              ),
              child: IconButton(
                icon: const Icon(Icons.arrow_back_rounded, color: Colors.white, size: 20),
                onPressed: () {
                  if (context.canPop()) {
                    context.pop();
                  } else {
                    context.go('/home');
                  }
                },
              ),
            ),
            actions: [
              Container(
                margin: const EdgeInsets.only(right: 8),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.4),
                  shape: BoxShape.circle,
                ),
                child: IconButton(
                  icon: const Icon(Icons.share_rounded, color: Colors.white, size: 18),
                  onPressed: () {
                    Share.share(
                      'Check out my personalized ${trip.durationDays}-day ${trip.destination} trip planned with WeekendTravellers: https://weekendtravellers.com/trip/${trip.id}',
                    );
                  },
                ),
              ),
              Container(
                margin: const EdgeInsets.only(right: 12),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.4),
                  shape: BoxShape.circle,
                ),
                child: IconButton(
                  icon: const Icon(Icons.bookmark_added_rounded, color: AppColors.accent, size: 20),
                  onPressed: () {
                    ref.read(savedTripsProvider.notifier).saveTrip(trip);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Trip saved to My Trips')),
                    );
                  },
                ),
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  WTNetworkImage(
                    imageUrl: trip.heroImage,
                    fit: BoxFit.cover,
                  ),
                  Container(
                    decoration: const BoxDecoration(
                      gradient: AppColors.heroImageGradient,
                    ),
                  ),
                  Positioned(
                    bottom: 24,
                    left: 20,
                    right: 20,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.accent,
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.auto_awesome, size: 12, color: Colors.white),
                              SizedBox(width: 4),
                              Text(
                                'AI ITINERARY READY',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 10,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: 0.5,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          trip.title,
                          style: const TextStyle(
                            fontSize: 26,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                            letterSpacing: -0.4,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          trip.summary,
                          style: TextStyle(
                            fontSize: 13,
                            color: Colors.white.withOpacity(0.85),
                            height: 1.4,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Content Body
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 40),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 4 Summary Metrics Badges
                  Row(
                    children: [
                      Expanded(
                        child: _buildMetricTile(
                          context,
                          icon: Icons.calendar_today_rounded,
                          label: '${trip.durationDays} Days',
                          sub: 'Sat – Sun',
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _buildMetricTile(
                          context,
                          icon: Icons.directions_car_rounded,
                          label: trip.logistics.travelTime,
                          sub: trip.logistics.distance,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _buildMetricTile(
                          context,
                          icon: Icons.account_balance_wallet_rounded,
                          label: CurrencyFormatter.formatInr(trip.totalBudget),
                          sub: 'Total',
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _buildMetricTile(
                          context,
                          icon: Icons.wb_sunny_rounded,
                          label: '24°C',
                          sub: 'Sunny',
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // Start Trip & Share CTAs
                  Row(
                    children: [
                      Expanded(
                        child: WTPrimaryButton(
                          label: 'Start Navigation',
                          icon: Icons.navigation_rounded,
                          onPressed: () async {
                            final url = Uri.parse(
                              'https://www.google.com/maps/dir/?api=1&destination=${Uri.encodeComponent(trip.destination)}',
                            );
                            if (await canLaunchUrl(url)) {
                              await launchUrl(url, mode: LaunchMode.externalApplication);
                            }
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Container(
                        decoration: BoxDecoration(
                          color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
                          borderRadius: BorderRadius.circular(AppTheme.radiusMedium),
                          border: Border.all(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
                        ),
                        child: IconButton(
                          icon: const Icon(Icons.share_outlined, color: AppColors.primary),
                          onPressed: () {
                            Share.share(
                              'My Weekend Trip to ${trip.destination}: https://weekendtravellers.com/trip/${trip.id}',
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),

                  // Day-wise Itinerary Tabs
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Day-wise Itinerary',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                          color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                          letterSpacing: -0.4,
                        ),
                      ),
                      TextButton.icon(
                        onPressed: () => context.push('/ai-chat'),
                        icon: const Icon(Icons.auto_awesome, size: 14, color: AppColors.accent),
                        label: const Text('Edit with AI', style: TextStyle(color: AppColors.accent, fontSize: 13)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Day Pills
                  Row(
                    children: List.generate(trip.days.length, (index) {
                      final isSelected = _selectedDayIndex == index;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: ChoiceChip(
                          label: Text('Day ${index + 1}'),
                          selected: isSelected,
                          selectedColor: AppColors.primary,
                          labelStyle: TextStyle(
                            color: isSelected ? Colors.white : (isDark ? Colors.white70 : Colors.black87),
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                          ),
                          onSelected: (_) => setState(() => _selectedDayIndex = index),
                        ),
                      );
                    }),
                  ),
                  const SizedBox(height: 16),

                  // Activities Timeline for Selected Day
                  if (trip.days.isNotEmpty && _selectedDayIndex < trip.days.length) ...[
                    Text(
                      trip.days[_selectedDayIndex].subtitle,
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: isDark ? AppColors.textMutedDark : AppColors.textSecondaryLight,
                      ),
                    ),
                    const SizedBox(height: 16),
                    ...List.generate(
                      trip.days[_selectedDayIndex].activities.length,
                      (actIndex) {
                        final act = trip.days[_selectedDayIndex].activities[actIndex];
                        final isLast = actIndex == trip.days[_selectedDayIndex].activities.length - 1;
                        return WTItineraryCard(activity: act, isLast: isLast);
                      },
                    ),
                  ],

                  const SizedBox(height: 32),

                  // Smart Budget Breakdown
                  Text(
                    'Smart Budget Breakdown',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                      letterSpacing: -0.4,
                    ),
                  ),
                  const SizedBox(height: 12),
                  WTBudgetCard(budget: trip.budget),

                  const SizedBox(height: 32),

                  // Packing List
                  Text(
                    'Weekend Packing Checklist',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                      letterSpacing: -0.4,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
                      borderRadius: BorderRadius.circular(AppTheme.radiusLarge),
                      border: Border.all(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
                    ),
                    child: Column(
                      children: trip.packingList.map((item) {
                        return CheckboxListTile(
                          value: item.isChecked,
                          onChanged: (val) {
                            setState(() => item.isChecked = val ?? false);
                          },
                          dense: true,
                          contentPadding: EdgeInsets.zero,
                          title: Text(
                            item.item,
                            style: TextStyle(
                              fontSize: 13,
                              decoration: item.isChecked ? TextDecoration.lineThrough : null,
                              color: item.isChecked ? AppColors.textMutedDark : null,
                            ),
                          ),
                          subtitle: Text(item.category, style: const TextStyle(fontSize: 11)),
                          activeColor: AppColors.primary,
                        );
                      }).toList(),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetricTile(
    BuildContext context, {
    required IconData icon,
    required String label,
    required String sub,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
        borderRadius: BorderRadius.circular(AppTheme.radiusMedium),
        border: Border.all(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
      ),
      child: Column(
        children: [
          Icon(icon, size: 18, color: AppColors.primary),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          Text(
            sub,
            style: TextStyle(
              fontSize: 10,
              color: isDark ? AppColors.textMutedDark : AppColors.textSecondaryLight,
            ),
          ),
        ],
      ),
    );
  }
}
