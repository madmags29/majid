import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:latlong2/latlong.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/models/destination_model.dart';
import '../../../shared/providers/app_providers.dart';
import '../../../shared/widgets/wt_category_chip.dart';
import '../../../shared/widgets/wt_destination_card.dart';
import '../../../shared/widgets/wt_empty_state.dart';
import '../../../shared/widgets/wt_search_bar.dart';

/// Explore Screen with List/Map toggle and multifaceted filtering
class ExploreScreen extends ConsumerStatefulWidget {
  const ExploreScreen({super.key});

  @override
  ConsumerState<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends ConsumerState<ExploreScreen> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    final filter = ref.read(exploreFilterProvider);
    _searchController.text = filter.searchQuery;
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _showFilterSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => const _ExploreFilterBottomSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final filter = ref.watch(exploreFilterProvider);
    final filterNotifier = ref.read(exploreFilterProvider.notifier);
    final destinations = ref.watch(filteredDestinationsProvider);
    final locationState = ref.watch(userLocationProvider);
    final savedIds = ref.watch(savedDestinationsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Explore Destinations'),
        elevation: 0,
        actions: [
          // AI Assistant Search Trigger
          IconButton(
            icon: Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: AppColors.primaryContainer.withOpacity(0.6),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.auto_awesome_rounded,
                size: 18,
                color: AppColors.primary,
              ),
            ),
            tooltip: 'Search with AI Assistant',
            onPressed: () => context.push('/search'),
          ),
          // List / Map Toggle Button
          IconButton(
            icon: Icon(
              filter.isMapView ? Icons.view_agenda_outlined : Icons.map_rounded,
              color: AppColors.primary,
            ),
            tooltip: filter.isMapView ? 'Show List' : 'Show Map',
            onPressed: () => filterNotifier.toggleMapView(),
          ),
          IconButton(
            icon: const Icon(Icons.tune_rounded),
            tooltip: 'Filter',
            onPressed: () => _showFilterSheet(context),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Column(
        children: [
          // Search & Filter header
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 4, 20, 12),
            child: WTSearchBar(
              controller: _searchController,
              hintText: 'Search destinations, forts, hills, beaches...',
              onChanged: (val) => filterNotifier.setSearchQuery(val),
              onFilterTap: () => _showFilterSheet(context),
            ),
          ),

          // Horizontal Category Filter Chips
          SizedBox(
            height: 38,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 20),
              itemCount: AppConstants.discoveryChips.length + 1,
              itemBuilder: (context, index) {
                if (index == 0) {
                  return WTCategoryChip(
                    label: 'All',
                    isSelected: filter.selectedCategory == 'All',
                    onTap: () => filterNotifier.setCategory('All'),
                  );
                }
                final chip = AppConstants.discoveryChips[index - 1];
                return WTCategoryChip(
                  label: chip,
                  isSelected: filter.selectedCategory == chip,
                  onTap: () => filterNotifier.setCategory(chip),
                );
              },
            ),
          ),
          const SizedBox(height: 12),

          // Main View: Map or Responsive List
          Expanded(
            child: filter.isMapView
                ? _buildMapView(context, destinations, locationState.city)
                : _buildListView(context, destinations, locationState.city, savedIds),
          ),
        ],
      ),
    );
  }

  // List View
  Widget _buildListView(
    BuildContext context,
    List<DestinationModel> destinations,
    String originCity,
    List<String> savedIds,
  ) {
    if (destinations.isEmpty) {
      return WTEmptyState(
        icon: Icons.search_off_rounded,
        title: 'No destinations match your filters',
        description: 'Try resetting your distance, budget, or search query to discover more getaways.',
        buttonLabel: 'Reset Filters',
        onButtonPressed: () {
          ref.read(exploreFilterProvider.notifier).reset();
          _searchController.clear();
        },
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      physics: const BouncingScrollPhysics(),
      itemCount: destinations.length,
      itemBuilder: (context, index) {
        final dest = destinations[index];
        final isSaved = savedIds.contains(dest.id);

        return Container(
          margin: const EdgeInsets.only(bottom: 20),
          child: WTDestinationCard(
            destination: dest,
            originCity: originCity,
            isSaved: isSaved,
            width: double.infinity,
            height: 280,
            onTap: () => context.push('/destination/${dest.slug}'),
            onFavoriteToggle: () {
              ref.read(savedDestinationsProvider.notifier).toggleSaved(dest.id);
            },
          ),
        );
      },
    );
  }

  // OpenStreetMap View
  Widget _buildMapView(
    BuildContext context,
    List<DestinationModel> destinations,
    String originCity,
  ) {
    final markers = destinations.map((d) {
      return Marker(
        point: LatLng(d.lat, d.lng),
        width: 140,
        height: 65,
        child: GestureDetector(
          onTap: () => context.push('/destination/${d.slug}'),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.3),
                      blurRadius: 8,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.place_rounded, size: 14, color: Colors.white),
                    const SizedBox(width: 4),
                    Flexible(
                      child: Text(
                        d.name,
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.arrow_drop_down, color: AppColors.primary, size: 18),
            ],
          ),
        ),
      );
    }).toList();

    return FlutterMap(
      options: MapOptions(
        initialCenter: const LatLng(28.6139, 77.2090), // Delhi center
        initialZoom: 6.2,
      ),
      children: [
        TileLayer(
          urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          userAgentPackageName: 'com.weekendtravellers.app',
          fallbackUrl: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
          errorTileCallback: (tile, error, stackTrace) {},
        ),
        MarkerLayer(markers: markers),
      ],
    );
  }
}

/// Filter Bottom Sheet
class _ExploreFilterBottomSheet extends ConsumerWidget {
  const _ExploreFilterBottomSheet();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final filter = ref.watch(exploreFilterProvider);
    final notifier = ref.read(exploreFilterProvider.notifier);

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(AppTheme.radiusExtraLarge)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Filter Weekend Trips',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                ),
              ),
              TextButton(
                onPressed: () {
                  notifier.reset();
                  Navigator.pop(context);
                },
                child: const Text('Reset All', style: TextStyle(color: AppColors.accent)),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Distance Filters
          Text(
            'Maximum Distance from you',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: isDark ? AppColors.textMutedDark : AppColors.textSecondaryLight,
            ),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: [100, 200, 300, 500].map((km) {
              final isSel = filter.maxDistanceKm == km;
              return ChoiceChip(
                label: Text('< $km km'),
                selected: isSel,
                onSelected: (selected) => notifier.setDistance(selected ? km : null),
              );
            }).toList(),
          ),
          const SizedBox(height: 16),

          // Budget Filters
          Text(
            'Starting Budget',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: isDark ? AppColors.textMutedDark : AppColors.textSecondaryLight,
            ),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: [3000, 5000, 10000].map((b) {
              final isSel = filter.maxBudget == b;
              return ChoiceChip(
                label: Text('Under ₹$b'),
                selected: isSel,
                onSelected: (selected) => notifier.setBudget(selected ? b : null),
              );
            }).toList(),
          ),
          const SizedBox(height: 24),

          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () => Navigator.pop(context),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(AppTheme.radiusMedium),
                ),
              ),
              child: const Text('Apply Filters', style: TextStyle(fontWeight: FontWeight.w700)),
            ),
          ),
        ],
      ),
    );
  }
}
