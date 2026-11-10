import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/utils/currency_formatter.dart';
import '../../../shared/data/curated_destinations.dart';
import '../../../shared/providers/app_providers.dart';
import '../../../shared/widgets/wt_destination_card.dart';
import '../../../shared/widgets/wt_empty_state.dart';

/// Saved Trips & Destinations Screen with Offline Support
class SavedScreen extends ConsumerWidget {
  const SavedScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final savedDestIds = ref.watch(savedDestinationsProvider);
    final savedTrips = ref.watch(savedTripsProvider);
    final locationState = ref.watch(userLocationProvider);

    final savedDestinations = CuratedDestinationsData.destinations
        .where((d) => savedDestIds.contains(d.id))
        .toList();

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Saved'),
          bottom: const TabBar(
            indicatorColor: AppColors.primary,
            labelColor: AppColors.primary,
            tabs: [
              Tab(text: 'Destinations'),
              Tab(text: 'Itineraries & Trips'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            // Tab 1: Saved Destinations
            savedDestinations.isEmpty
                ? WTEmptyState(
                    icon: Icons.favorite_border_rounded,
                    title: 'No saved destinations yet',
                    description: 'Explore breathtaking getaways near you and tap the heart icon to save them here.',
                    buttonLabel: 'Explore Destinations',
                    onButtonPressed: () => context.go('/explore'),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(20),
                    physics: const BouncingScrollPhysics(),
                    itemCount: savedDestinations.length,
                    itemBuilder: (context, index) {
                      final dest = savedDestinations[index];
                      return Container(
                        margin: const EdgeInsets.only(bottom: 20),
                        child: WTDestinationCard(
                          destination: dest,
                          originCity: locationState.city,
                          isSaved: true,
                          width: double.infinity,
                          height: 280,
                          onTap: () => context.push('/destination/${dest.slug}'),
                          onFavoriteToggle: () {
                            ref.read(savedDestinationsProvider.notifier).toggleSaved(dest.id);
                          },
                        ),
                      );
                    },
                  ),

            // Tab 2: Saved Trips
            savedTrips.isEmpty
                ? WTEmptyState(
                    icon: Icons.map_outlined,
                    title: 'No saved trips yet',
                    description: 'Plan your personalized weekend getaway with our AI planner and keep it handy offline.',
                    buttonLabel: 'Plan My Weekend',
                    onButtonPressed: () => context.push('/planner'),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(20),
                    physics: const BouncingScrollPhysics(),
                    itemCount: savedTrips.length,
                    itemBuilder: (context, index) {
                      final trip = savedTrips[index];
                      return Container(
                        margin: const EdgeInsets.only(bottom: 16),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
                          borderRadius: BorderRadius.circular(AppTheme.radiusLarge),
                          border: Border.all(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
                        ),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: AppColors.primaryContainer.withOpacity(0.5),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.explore_rounded, color: AppColors.primary),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
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
                                  const SizedBox(height: 3),
                                  Text(
                                    '${trip.durationDays} Days • ${CurrencyFormatter.formatInr(trip.totalBudget)}',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: isDark ? AppColors.textMutedDark : AppColors.textSecondaryLight,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.arrow_forward_ios_rounded, size: 16),
                              onPressed: () => context.push('/trip/${trip.id}'),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
          ],
        ),
      ),
    );
  }
}
