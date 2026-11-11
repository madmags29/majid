import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/utils/date_formatter.dart';
import '../../../shared/data/curated_blogs.dart';
import '../../../shared/data/curated_destinations.dart';
import '../../../shared/providers/app_providers.dart';
import '../../../shared/widgets/wt_category_chip.dart';
import '../../../shared/widgets/wt_destination_card.dart';
import '../../../shared/widgets/wt_location_picker_sheet.dart';
import '../../../shared/widgets/wt_network_image.dart';
import '../../../shared/widgets/wt_search_bar.dart';
import '../../../shared/widgets/wt_section_header.dart';

/// Editorial Home Discovery Screen matching weekendtravellers.com
class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  String _selectedChip = 'Nearby';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(userLocationProvider.notifier).autoDetectLocation();
    });
  }

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final locationState = ref.watch(userLocationProvider);
    final savedIds = ref.watch(savedDestinationsProvider);
    final upcomingLongWeekend = DateFormatter.getUpcomingLongWeekend();

    // Filter destinations for active chip, sorted by proximity to user location
    final destinations = CuratedDestinationsData.filterBy(
      category: _selectedChip,
      originCity: locationState.city,
      userLat: locationState.lat,
      userLng: locationState.lng,
    );

    return Scaffold(
      drawer: _buildAppDrawer(context, isDark),
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          // Top Editorial App Bar
          SliverAppBar(
            floating: true,
            pinned: false,
            snap: true,
            backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
            elevation: 0,
            toolbarHeight: 70,
            titleSpacing: 0,
            leading: Builder(
              builder: (ctx) => IconButton(
                icon: const Icon(Icons.menu_rounded),
                tooltip: 'Navigation Menu',
                onPressed: () => Scaffold.of(ctx).openDrawer(),
              ),
            ),
            title: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        '${_getGreeting()}, Majid',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          color: isDark ? AppColors.textMutedDark : AppColors.textSecondaryLight,
                        ),
                      ),
                      const SizedBox(height: 2),
                      // Tappable Origin City Badge
                      InkWell(
                        onTap: () => WTLocationPickerSheet.show(context),
                        borderRadius: BorderRadius.circular(12),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(vertical: 2),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              if (locationState.isGpsLoading)
                                const SizedBox(
                                  width: 14,
                                  height: 14,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: AppColors.accent,
                                  ),
                                )
                              else
                                const Icon(
                                  Icons.location_on_rounded,
                                  size: 15,
                                  color: AppColors.accent,
                                ),
                              const SizedBox(width: 4),
                              Flexible(
                                child: Text(
                                  locationState.city,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w800,
                                    color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 2),
                              Icon(
                                Icons.keyboard_arrow_down_rounded,
                                size: 16,
                                color: isDark ? AppColors.textMutedDark : AppColors.textSecondaryLight,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                // AI Travel Assistant Quick Action
                IconButton(
                  onPressed: () => context.push('/search'),
                  icon: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppColors.primaryContainer.withOpacity(0.6),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.auto_awesome_rounded,
                      color: AppColors.primary,
                      size: 20,
                    ),
                  ),
                  tooltip: 'Search with AI Assistant',
                ),
              ],
            ),
          ),

          // Body Content
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Website Hero Headline matching HomeClient.tsx
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 4, 20, 8),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Discover Your Perfect\nWeekend Getaway',
                        style: TextStyle(
                          fontSize: 26,
                          fontWeight: FontWeight.w900,
                          color: isDark ? Colors.white : const Color(0xFF0F172A),
                          letterSpacing: -0.6,
                          height: 1.2,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Just tell us where you want to go, or let us surprise you.',
                        style: TextStyle(
                          fontSize: 13,
                          color: isDark ? AppColors.textMutedDark : AppColors.textSecondaryLight,
                        ),
                      ),
                    ],
                  ),
                ),

                // Conversational Search Bar
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 8, 20, 16),
                  child: WTSearchBar(
                    readOnly: true,
                    hintText: 'Where to? (e.g. Paris, Rishikesh, Goa)',
                    onTap: () => context.push('/search'),
                    onFilterTap: () => context.push('/search'),
                  ),
                ),

                // Category Banner matching CategoryBanner.tsx
                _buildCategoryBanner(context, isDark),

                const SizedBox(height: 16),

                // AI Planner Hero Entry Card
                _buildAiPlannerHeroCard(context, isDark),

                // Long Weekend Alert Banner (if applicable)
                if (upcomingLongWeekend != null)
                  _buildLongWeekendBanner(context, upcomingLongWeekend, isDark),

                const SizedBox(height: 20),

                // Quick Discovery Chips
                SizedBox(
                  height: 40,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    itemCount: AppConstants.discoveryChips.length,
                    itemBuilder: (context, index) {
                      final chip = AppConstants.discoveryChips[index];
                      return WTCategoryChip(
                        label: chip,
                        isSelected: _selectedChip == chip,
                        onTap: () => setState(() => _selectedChip = chip),
                      );
                    },
                  ),
                ),

                const SizedBox(height: 20),

                // Section 1: Near You
                WTSectionHeader(
                  title: 'Weekend escapes near ${locationState.city}',
                  subtitle: 'Top places reachable within 2–5 hours',
                  actionLabel: 'See all',
                  onActionTap: () => context.go('/explore'),
                ),
                const SizedBox(height: 8),

                // Near You Horizontal Cards
                SizedBox(
                  height: 310,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    physics: const BouncingScrollPhysics(),
                    itemCount: destinations.length,
                    itemBuilder: (context, index) {
                      final dest = destinations[index];
                      final isSaved = savedIds.contains(dest.id);

                      return WTDestinationCard(
                        destination: dest,
                        originCity: locationState.city,
                        isSaved: isSaved,
                        onTap: () => context.push('/destination/${dest.slug}'),
                        onFavoriteToggle: () {
                          ref.read(savedDestinationsProvider.notifier).toggleSaved(dest.id);
                        },
                      );
                    },
                  ),
                ),

                const SizedBox(height: 28),

                // Section 2: Trending Travel Blog Guides (matching /blog)
                WTSectionHeader(
                  title: 'Weekend Itinerary Guides 📖',
                  subtitle: 'Curated 2–4 day plans with budgets & routes',
                  actionLabel: 'All guides',
                  onActionTap: () => context.push('/blog'),
                ),
                const SizedBox(height: 8),

                _buildBlogStoriesCarousel(context, isDark),

                const SizedBox(height: 28),

                // Section 3: Perfect for Couples
                WTSectionHeader(
                  title: 'Perfect for couples ❤️',
                  subtitle: 'Romantic retreats, sunsets and scenic stays',
                  actionLabel: 'View list',
                  onActionTap: () {
                    ref.read(exploreFilterProvider.notifier).setCategory('Couples');
                    context.go('/explore');
                  },
                ),
                const SizedBox(height: 8),

                SizedBox(
                  height: 310,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    physics: const BouncingScrollPhysics(),
                    itemCount: CuratedDestinationsData.filterBy(
                      category: 'Couples',
                      originCity: locationState.city,
                      userLat: locationState.lat,
                      userLng: locationState.lng,
                    ).length,
                    itemBuilder: (context, index) {
                      final dest = CuratedDestinationsData.filterBy(
                        category: 'Couples',
                        originCity: locationState.city,
                        userLat: locationState.lat,
                        userLng: locationState.lng,
                      )[index];
                      final isSaved = savedIds.contains(dest.id);

                      return WTDestinationCard(
                        destination: dest,
                        originCity: locationState.city,
                        isSaved: isSaved,
                        onTap: () => context.push('/destination/${dest.slug}'),
                        onFavoriteToggle: () {
                          ref.read(savedDestinationsProvider.notifier).toggleSaved(dest.id);
                        },
                      );
                    },
                  ),
                ),

                const SizedBox(height: 28),

                // Section 4: How Our AI Travel Engine Works (E-E-A-T AdSense Section from website)
                _buildHowAiWorksCard(context, isDark),

                const SizedBox(height: 40),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // Category Banner matching CategoryBanner.tsx on the website
  Widget _buildCategoryBanner(BuildContext context, bool isDark) {
    final categories = [
      {'name': 'Budget travel', 'icon': Icons.account_balance_wallet_outlined, 'color': const Color(0xFF4ADE80)},
      {'name': 'Road trips', 'icon': Icons.directions_car_outlined, 'color': const Color(0xFF60A5FA)},
      {'name': 'Hidden gems', 'icon': Icons.diamond_outlined, 'color': const Color(0xFFC084FC)},
      {'name': 'Monsoon trips', 'icon': Icons.water_drop_outlined, 'color': const Color(0xFF38BDF8)},
      {'name': 'Winter trips', 'icon': Icons.ac_unit_outlined, 'color': const Color(0xFF818CF8)},
    ];

    return SizedBox(
      height: 44,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 20),
        itemCount: categories.length,
        itemBuilder: (context, index) {
          final cat = categories[index];
          final color = cat['color'] as Color;
          final icon = cat['icon'] as IconData;
          final name = cat['name'] as String;

          return Padding(
            padding: const EdgeInsets.only(right: 10),
            child: InkWell(
              onTap: () => context.push('/search?q=$name'),
              borderRadius: BorderRadius.circular(14),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF14201D) : Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: isDark ? const Color(0xFF1F352F) : const Color(0xFFE2E8F0),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.04),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(icon, size: 16, color: color),
                    const SizedBox(width: 6),
                    Text(
                      name,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: isDark ? Colors.white : Colors.black87,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  // Blog Stories Horizontal Carousel
  Widget _buildBlogStoriesCarousel(BuildContext context, bool isDark) {
    final posts = CuratedBlogsData.posts.take(5).toList();

    return SizedBox(
      height: 220,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 20),
        itemCount: posts.length,
        itemBuilder: (context, index) {
          final post = posts[index];

          return Container(
            width: 260,
            margin: const EdgeInsets.only(right: 14),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF14201D) : Colors.white,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(
                color: isDark ? const Color(0xFF1F352F) : const Color(0xFFE2E8F0),
              ),
            ),
            child: InkWell(
              onTap: () => context.push('/blog/${post.slug}'),
              borderRadius: BorderRadius.circular(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ClipRRect(
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
                    child: SizedBox(
                      height: 110,
                      width: double.infinity,
                      child: WTNetworkImage(
                        imageUrl: post.heroImage,
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              post.duration,
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: AppColors.accent,
                              ),
                            ),
                            const Spacer(),
                            Text(
                              post.budget,
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: isDark ? Colors.white60 : Colors.black54,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          post.title,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                            color: isDark ? Colors.white : Colors.black87,
                            height: 1.25,
                          ),
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

  // How AI Travel Engine Works card matching website
  Widget _buildHowAiWorksCard(BuildContext context, bool isDark) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF14201D) : const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: isDark ? const Color(0xFF1F352F) : const Color(0xFFE2E8F0),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 4,
                height: 20,
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                'How Our AI Travel Engine Works',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                  color: isDark ? Colors.white : Colors.black87,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            'Planning a weekend should be the start of your relaxation, not an administrative chore. Our AI transforms flight/train timings, hotel options, and local reviews into a single cohesive weekend itinerary in under 60 seconds.',
            style: TextStyle(
              fontSize: 13,
              height: 1.5,
              color: isDark ? Colors.white70 : Colors.black54,
            ),
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              TextButton.icon(
                onPressed: () => context.push('/about'),
                icon: const Icon(Icons.arrow_forward, size: 14, color: AppColors.primary),
                label: const Text(
                  'Read our E-E-A-T story',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.primary),
                ),
              ),
              const Spacer(),
              TextButton(
                onPressed: () => context.push('/faq'),
                child: const Text(
                  'View FAQs',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.accent),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // Side Drawer matching RightMenu.tsx
  Widget _buildAppDrawer(BuildContext context, bool isDark) {
    return Drawer(
      backgroundColor: isDark ? const Color(0xFF0C1311) : Colors.white,
      child: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) => SingleChildScrollView(
            child: ConstrainedBox(
              constraints: BoxConstraints(minHeight: constraints.maxHeight),
              child: IntrinsicHeight(
                child: Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(20),
                      child: Row(
                        children: [
                          Container(
                            width: 44,
                            height: 44,
                            decoration: const BoxDecoration(
                              color: AppColors.primaryContainer,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.explore_rounded, color: AppColors.primary, size: 26),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'weekendtravellers.com',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w800,
                                    color: isDark ? Colors.white : Colors.black87,
                                  ),
                                ),
                                Text(
                                  'AI Weekend Travel Companion',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: isDark ? Colors.white60 : Colors.black54,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const Divider(height: 1),
                    _buildDrawerTile(context, Icons.auto_awesome, 'AI Chat Planner', () {
                      Navigator.pop(context);
                      context.push('/search');
                    }),
                    _buildDrawerTile(context, Icons.map_outlined, 'Your Trips', () {
                      Navigator.pop(context);
                      context.go('/trips');
                    }),
                    _buildDrawerTile(context, Icons.auto_awesome, 'Inspirational Trip', () {
                      Navigator.pop(context);
                      context.push('/inspiration-trip');
                    }),
                    _buildDrawerTile(context, Icons.explore_outlined, 'Explore Destinations', () {
                      Navigator.pop(context);
                      context.go('/explore');
                    }),
                    _buildDrawerTile(context, Icons.menu_book_rounded, 'Travel Blog & Guides', () {
                      Navigator.pop(context);
                      context.push('/blog');
                    }),
                    _buildDrawerTile(context, Icons.help_outline_rounded, 'FAQ & Help', () {
                      Navigator.pop(context);
                      context.push('/faq');
                    }),
                    _buildDrawerTile(context, Icons.info_outline_rounded, 'About Us & E-E-A-T', () {
                      Navigator.pop(context);
                      context.push('/about');
                    }),
                    const Spacer(),
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Text(
                        '© 2026 Weekend Travellers\nweekendtravellers.com',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 11,
                          color: isDark ? Colors.white38 : Colors.black38,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDrawerTile(BuildContext context, IconData icon, String title, VoidCallback onTap) {
    return ListTile(
      leading: Icon(icon, size: 20, color: AppColors.primary),
      title: Text(
        title,
        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
      ),
      onTap: onTap,
    );
  }

  // Hero AI Planner Card
  Widget _buildAiPlannerHeroCard(BuildContext context, bool isDark) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 6),
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        gradient: AppColors.emeraldGradient,
        borderRadius: BorderRadius.circular(AppTheme.radiusExtraLarge),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.auto_awesome, size: 13, color: Colors.white),
                    SizedBox(width: 4),
                    Text(
                      'AI TRIP PLANNER',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Text(
            'Plan My Weekend ✨',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.w800,
              color: Colors.white,
              letterSpacing: -0.4,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Tell us your mood, budget, or companions. Our AI builds a personalized 2–3 day itinerary in 60 seconds.',
            style: TextStyle(
              fontSize: 13,
              color: Colors.white.withOpacity(0.85),
              height: 1.4,
            ),
          ),
          const SizedBox(height: 18),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () => context.push('/planner'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.accent, // Energetic Rust Orange
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(AppTheme.radiusMedium),
                ),
                elevation: 2,
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Generate Weekend Trip',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  SizedBox(width: 6),
                  Icon(Icons.arrow_forward_rounded, size: 18),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Long Weekend Banner
  Widget _buildLongWeekendBanner(
    BuildContext context,
    Map<String, dynamic> lw,
    bool isDark,
  ) {
    return InkWell(
      onTap: () => _showHolidaysBottomSheet(context, isDark),
      borderRadius: BorderRadius.circular(AppTheme.radiusLarge),
      child: Container(
        margin: const EdgeInsets.fromLTRB(20, 10, 20, 4),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
          borderRadius: BorderRadius.circular(AppTheme.radiusLarge),
          border: Border.all(
            color: AppColors.crimson.withOpacity(0.35),
            width: 1.2,
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.crimson.withOpacity(0.15),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.calendar_month_rounded,
                color: AppColors.crimson,
                size: 22,
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        '${lw['flag'] ?? '🇮🇳'} ${lw['days']} Days Available',
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                          color: AppColors.accent,
                          letterSpacing: 0.3,
                        ),
                      ),
                      const SizedBox(width: 6),
                      Container(
                        width: 4,
                        height: 4,
                        decoration: const BoxDecoration(
                          color: AppColors.accent,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          lw['tag'] as String,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w500,
                            color: isDark ? AppColors.textMutedDark : AppColors.textSecondaryLight,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    lw['title'] as String,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 10),
            ElevatedButton(
              onPressed: () => context.push('/planner'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.accent,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: const Text('Plan', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
            ),
          ],
        ),
      ),
    );
  }

  void _showHolidaysBottomSheet(BuildContext context, bool isDark) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return DefaultTabController(
          length: 2,
          child: Container(
            height: MediaQuery.of(context).size.height * 0.75,
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
            ),
            child: Column(
              children: [
                const SizedBox(height: 12),
                Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: isDark ? Colors.white24 : Colors.black12,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Holidays & Long Weekends',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w800,
                              color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '2026 – 2027 Calendar for India & World',
                            style: TextStyle(
                              fontSize: 12,
                              color: isDark ? AppColors.textMutedDark : AppColors.textSecondaryLight,
                            ),
                          ),
                        ],
                      ),
                      IconButton(
                        icon: const Icon(Icons.close_rounded),
                        onPressed: () => Navigator.pop(ctx),
                      ),
                    ],
                  ),
                ),
                TabBar(
                  indicatorColor: AppColors.primary,
                  labelColor: AppColors.primary,
                  unselectedLabelColor: isDark ? AppColors.textMutedDark : AppColors.textSecondaryLight,
                  tabs: const [
                    Tab(text: '🇮🇳 India Holidays'),
                    Tab(text: '🌍 World Holidays'),
                  ],
                ),
                Expanded(
                  child: TabBarView(
                    children: [
                      _buildHolidaysList(DateFormatter.getAllUpcomingHolidays(regionPreference: 'India'), isDark),
                      _buildHolidaysList(DateFormatter.getAllUpcomingHolidays(regionPreference: 'World'), isDark),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildHolidaysList(List<Map<String, dynamic>> holidays, bool isDark) {
    if (holidays.isEmpty) {
      return const Center(child: Text('No upcoming holidays found.'));
    }
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: holidays.length,
      separatorBuilder: (_, _) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final h = holidays[index];
        final start = h['start'] as DateTime;
        final end = h['end'] as DateTime;
        final dateStr = DateFormatter.formatDateRange(start, end);
        final recs = (h['recommendedDestinations'] as List<String>?) ?? [];

        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isDark ? AppColors.darkBg : AppColors.lightBg,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
              width: 1,
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Text(h['flag'] ?? '', style: const TextStyle(fontSize: 18)),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          '${h['days']} Days Break',
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            color: AppColors.primary,
                          ),
                        ),
                      ),
                    ],
                  ),
                  Text(
                    dateStr,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: isDark ? AppColors.textMutedDark : AppColors.textSecondaryLight,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                h['title'] as String,
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                h['description'] as String,
                style: TextStyle(
                  fontSize: 12,
                  color: isDark ? AppColors.textMutedDark : AppColors.textSecondaryLight,
                ),
              ),
              if (recs.isNotEmpty) ...[
                const SizedBox(height: 10),
                Wrap(
                  spacing: 6,
                  runSpacing: 4,
                  children: recs.map((dest) {
                    return Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(
                          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                          width: 0.8,
                        ),
                      ),
                      child: Text(
                        dest,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w500,
                          color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ],
          ),
        );
      },
    );
  }
}
