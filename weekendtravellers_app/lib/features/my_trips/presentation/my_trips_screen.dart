import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/utils/currency_formatter.dart';
import '../../../shared/providers/app_providers.dart';
import '../../../shared/widgets/wt_empty_state.dart';
import '../../../shared/widgets/wt_network_image.dart';

/// My Trips Management Screen
class MyTripsScreen extends ConsumerWidget {
  const MyTripsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final trips = ref.watch(savedTripsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Weekend Trips'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_rounded),
            tooltip: 'Plan New Trip',
            onPressed: () => context.push('/planner'),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: trips.isEmpty
          ? WTEmptyState(
              icon: Icons.luggage_outlined,
              title: 'Your next adventure starts here',
              description: 'You haven\'t planned any weekend getaways yet. Let AI generate your complete personalized itinerary in seconds.',
              buttonLabel: 'Plan My Weekend ✨',
              onButtonPressed: () => context.push('/planner'),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(20),
              physics: const BouncingScrollPhysics(),
              itemCount: trips.length,
              itemBuilder: (context, index) {
                final trip = trips[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
                    borderRadius: BorderRadius.circular(AppTheme.radiusExtraLarge),
                    border: Border.all(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
                    boxShadow: AppTheme.softShadow,
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(AppTheme.radiusExtraLarge),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Hero Thumbnail Banner
                        Stack(
                          children: [
                            SizedBox(
                              height: 120,
                              width: double.infinity,
                              child: WTNetworkImage(
                                imageUrl: trip.heroImage,
                                fit: BoxFit.cover,
                              ),
                            ),
                            Container(
                              height: 120,
                              decoration: const BoxDecoration(
                                gradient: LinearGradient(
                                  begin: Alignment.topCenter,
                                  end: Alignment.bottomCenter,
                                  colors: [Colors.transparent, Colors.black87],
                                ),
                              ),
                            ),
                            Positioned(
                              top: 12,
                              left: 12,
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: AppColors.primary,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text(
                                  '${trip.durationDays} Days',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ),
                            Positioned(
                              bottom: 12,
                              left: 16,
                              child: Text(
                                trip.destination,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 20,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ),
                          ],
                        ),

                        // Details
                        Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                trip.title,
                                style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w700,
                                  color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                                ),
                              ),
                              const SizedBox(height: 6),
                              Row(
                                children: [
                                  Icon(Icons.directions_car_outlined, size: 14, color: isDark ? AppColors.textMutedDark : AppColors.textSecondaryLight),
                                  const SizedBox(width: 4),
                                  Text(
                                    trip.logistics.distance,
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: isDark ? AppColors.textMutedDark : AppColors.textSecondaryLight,
                                    ),
                                  ),
                                  const SizedBox(width: 16),
                                  Icon(Icons.account_balance_wallet_outlined, size: 14, color: isDark ? AppColors.textMutedDark : AppColors.textSecondaryLight),
                                  const SizedBox(width: 4),
                                  Text(
                                    CurrencyFormatter.formatInr(trip.totalBudget),
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: isDark ? AppColors.textMutedDark : AppColors.textSecondaryLight,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 16),

                              // Action Row
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  TextButton.icon(
                                    onPressed: () {
                                      ref.read(savedTripsProvider.notifier).deleteTrip(trip.id);
                                    },
                                    icon: const Icon(Icons.delete_outline, size: 16, color: Colors.redAccent),
                                    label: const Text('Delete', style: TextStyle(color: Colors.redAccent, fontSize: 12)),
                                  ),
                                  ElevatedButton(
                                    onPressed: () => context.push('/trip/${trip.id}'),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: AppColors.primary,
                                      foregroundColor: Colors.white,
                                      elevation: 0,
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                    ),
                                    child: const Text('View Itinerary', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
