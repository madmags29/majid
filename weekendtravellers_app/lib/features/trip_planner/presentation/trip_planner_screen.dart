import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/providers/app_providers.dart';
import '../../../shared/widgets/wt_button.dart';
import '../../../shared/widgets/wt_location_picker_sheet.dart';
import '../../../shared/widgets/wt_network_image.dart';
import '../../../shared/data/world_places_data.dart';

/// Multi-step AI Weekend Planner Flow
class TripPlannerScreen extends ConsumerStatefulWidget {
  final String? initialDestination;

  const TripPlannerScreen({super.key, this.initialDestination});

  @override
  ConsumerState<TripPlannerScreen> createState() => _TripPlannerScreenState();
}

class _TripPlannerScreenState extends ConsumerState<TripPlannerScreen> {
  int _currentStep = 1;
  final int _totalSteps = 6;

  // Selected State
  late String _origin;
  String _destination = 'Rishikesh';
  int _durationDays = 2;
  int _budget = 7500;
  String _travellers = 'Couple';
  final List<String> _selectedInterests = ['Nature', 'Adventure', 'Food'];
  String _transport = 'Car';
  String _travelStyle = 'Balanced';

  final TextEditingController _destinationSearchController = TextEditingController();
  List<WorldPlace> _searchResults = [];
  bool _isSearchingWorld = false;

  @override
  void initState() {
    super.initState();
    final loc = ref.read(userLocationProvider);
    _origin = loc.city;
    if (widget.initialDestination != null && widget.initialDestination!.isNotEmpty) {
      _destination = widget.initialDestination!;
    } else {
      // Default to the closest top destination to user's location
      final nearest = WorldPlacesData.getTop6Nearby(
        userLat: loc.lat,
        userLng: loc.lng,
        userCity: loc.city,
      );
      if (nearest.isNotEmpty) {
        _destination = nearest.first.name;
      }
    }
  }

  @override
  void dispose() {
    _destinationSearchController.dispose();
    super.dispose();
  }

  Future<void> _onDestinationSearchChanged(String query) async {
    if (query.trim().isEmpty) {
      setState(() {
        _searchResults = [];
        _isSearchingWorld = false;
      });
      return;
    }

    setState(() => _isSearchingWorld = true);
    final loc = ref.read(userLocationProvider);
    final results = await WorldPlacesData.search(
      query,
      userLat: loc.lat,
      userLng: loc.lng,
    );

    if (mounted) {
      setState(() {
        _searchResults = results;
        _isSearchingWorld = false;
      });
    }
  }

  void _selectDestinationPlace(WorldPlace place) {
    setState(() {
      _destination = place.name;
      _destinationSearchController.text = place.name;
      _searchResults = [];
    });
    FocusScope.of(context).unfocus();
  }

  void _nextStep() {
    if (_currentStep < _totalSteps) {
      setState(() => _currentStep++);
    } else {
      _generateTrip();
    }
  }

  void _prevStep() {
    if (_currentStep > 1) {
      setState(() => _currentStep--);
    } else {
      if (context.canPop()) {
        context.pop();
      } else {
        context.go('/home');
      }
    }
  }

  void _generateTrip() {
    // Navigate to AI Generation progress screen with parameters
    final params = Uri(
      path: '/ai-generation',
      queryParameters: {
        'origin': _origin,
        'destination': _destination,
        'duration': _durationDays.toString(),
        'budget': _budget.toString(),
        'travellers': _travellers,
        'transport': _transport,
        'travelStyle': _travelStyle,
        'interests': _selectedInterests.join(','),
      },
    );
    context.push(params.toString());
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: _prevStep,
        ),
        title: Text(
          'Step $_currentStep of $_totalSteps',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: isDark ? AppColors.textMutedDark : AppColors.textSecondaryLight,
          ),
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(4),
          child: LinearProgressIndicator(
            value: _currentStep / _totalSteps,
            backgroundColor: isDark ? AppColors.darkBorder : AppColors.lightBorder,
            valueColor: const AlwaysStoppedAnimation<Color>(AppColors.primary),
            minHeight: 3.5,
          ),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.all(24),
                child: _buildCurrentStepContent(context, isDark),
              ),
            ),

            // Bottom Navigation CTA
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
                border: Border(
                  top: BorderSide(
                    color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                  ),
                ),
              ),
              child: WTPrimaryButton(
                label: _currentStep == _totalSteps ? 'Create My Trip ✨' : 'Continue',
                icon: _currentStep == _totalSteps ? Icons.auto_awesome_rounded : Icons.arrow_forward_rounded,
                onPressed: _nextStep,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCurrentStepContent(BuildContext context, bool isDark) {
    switch (_currentStep) {
      case 1:
        return _buildStep1Origin(context, isDark);
      case 2:
        return _buildStep2Duration(context, isDark);
      case 3:
        return _buildStep3Budget(context, isDark);
      case 4:
        return _buildStep4Travellers(context, isDark);
      case 5:
        return _buildStep5Interests(context, isDark);
      case 6:
        return _buildStep6Transport(context, isDark);
      default:
        return const SizedBox.shrink();
    }
  }

  // STEP 1: Destination Search & Top 6 Nearby Places
  Widget _buildStep1Origin(BuildContext context, bool isDark) {
    final locationState = ref.watch(userLocationProvider);
    final top6 = WorldPlacesData.getTop6Nearby(
      userLat: locationState.lat,
      userLng: locationState.lng,
      userCity: _origin,
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildStepHeader(
          title: 'Where do you want to escape?',
          subtitle: 'Search any worldwide destination or pick from the top 6 escapes near you.',
        ),
        const SizedBox(height: 16),

        // Starting Point (Origin) Card
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
            borderRadius: BorderRadius.circular(AppTheme.radiusMedium),
            border: Border.all(
              color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
            ),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppColors.accent.withOpacity(0.12),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.my_location_rounded, color: AppColors.accent, size: 18),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Starting from (Your Location):',
                      style: TextStyle(fontSize: 11, color: AppColors.textMutedDark),
                    ),
                    Text(
                      _origin,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                      ),
                    ),
                  ],
                ),
              ),
              TextButton.icon(
                onPressed: () async {
                  await WTLocationPickerSheet.show(context);
                  setState(() {
                    _origin = ref.read(userLocationProvider).city;
                  });
                },
                icon: const Icon(Icons.edit_location_alt_outlined, size: 16, color: AppColors.primary),
                label: const Text('Change', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.primary)),
                style: TextButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  backgroundColor: AppColors.primaryContainer.withOpacity(0.5),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // Worldwide Place Search Bar
        Text(
          'Search All World Places 🌍',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
          ),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _destinationSearchController,
          onChanged: _onDestinationSearchChanged,
          decoration: InputDecoration(
            hintText: 'Search any world place (e.g. Paris, Manali, Tokyo, Goa, Bali...)',
            hintStyle: TextStyle(
              fontSize: 13,
              color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
            ),
            prefixIcon: const Icon(Icons.search_rounded, color: AppColors.primary),
            suffixIcon: _isSearchingWorld
                ? const Padding(
                    padding: EdgeInsets.all(12),
                    child: SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary),
                    ),
                  )
                : (_destinationSearchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear_rounded, size: 18),
                        onPressed: () {
                          _destinationSearchController.clear();
                          _onDestinationSearchChanged('');
                        },
                      )
                    : null),
            filled: true,
            fillColor: isDark ? AppColors.darkSurfaceSubtle : AppColors.lightSurfaceSubtle,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppTheme.radiusMedium),
              borderSide: BorderSide(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppTheme.radiusMedium),
              borderSide: const BorderSide(color: AppColors.primary, width: 2),
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          ),
        ),

        // Live Search Results Dropdown/List
        if (_searchResults.isNotEmpty) ...[
          const SizedBox(height: 12),
          Container(
            constraints: const BoxConstraints(maxHeight: 260),
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
              borderRadius: BorderRadius.circular(AppTheme.radiusMedium),
              border: Border.all(color: AppColors.primary.withOpacity(0.4)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.08),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: ListView.separated(
              shrinkWrap: true,
              itemCount: _searchResults.length,
              separatorBuilder: (context, _) => Divider(height: 1, color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
              itemBuilder: (context, i) {
                final place = _searchResults[i];
                final dist = place.getDistanceKm(locationState.lat, locationState.lng);
                final travelTime = place.getTravelTimeEstimate(locationState.lat, locationState.lng);
                final isSelected = _destination.toLowerCase() == place.name.toLowerCase();

                return ListTile(
                  dense: true,
                  leading: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppColors.primaryContainer.withOpacity(0.6),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.public_rounded, size: 18, color: AppColors.primary),
                  ),
                  title: Row(
                    children: [
                      Expanded(
                        child: Text(
                          place.name,
                          style: TextStyle(
                            fontWeight: FontWeight.w700,
                            fontSize: 14,
                            color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.accent.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          place.country,
                          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.accentDark),
                        ),
                      ),
                    ],
                  ),
                  subtitle: Text(
                    '${place.category} • $dist km from $_origin ($travelTime)',
                    style: TextStyle(
                      fontSize: 11,
                      color: isDark ? AppColors.textMutedDark : AppColors.textSecondaryLight,
                    ),
                  ),
                  trailing: isSelected
                      ? const Icon(Icons.check_circle_rounded, color: AppColors.primary, size: 20)
                      : const Icon(Icons.arrow_forward_ios_rounded, size: 12, color: Colors.grey),
                  onTap: () => _selectDestinationPlace(place),
                );
              },
            ),
          ),
        ],

        const SizedBox(height: 24),

        // Currently Selected Destination Callout
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                AppColors.primary.withOpacity(0.1),
                AppColors.accent.withOpacity(0.1),
              ],
            ),
            borderRadius: BorderRadius.circular(AppTheme.radiusMedium),
            border: Border.all(color: AppColors.primary, width: 1.5),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: const BoxDecoration(
                  color: AppColors.primary,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.check_rounded, color: Colors.white, size: 16),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Selected Destination:',
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.primary),
                    ),
                    Text(
                      _destination,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w900,
                        color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        const Icon(Icons.directions_car_rounded, size: 13, color: AppColors.accentDark),
                        const SizedBox(width: 4),
                        Text(
                          'Travel time via car from $_origin',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: isDark ? AppColors.textMutedDark : AppColors.textSecondaryLight,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.accent,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Text(
                  'Selected',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white),
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 28),

        // TOP 6 PLACES NEAR YOUR LOCATION SECTION
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Text(
                      'Top 6 Escapes Near You',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                      decoration: BoxDecoration(
                        color: AppColors.accent,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Text(
                        'TOP 6',
                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.white),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  'Closest getaways ranked by real-time travel distance from $_origin',
                  style: TextStyle(
                    fontSize: 12,
                    color: isDark ? AppColors.textMutedDark : AppColors.textSecondaryLight,
                  ),
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: 16),

        // 6 Top Places Grid
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: top6.length,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 12,
            mainAxisSpacing: 14,
            childAspectRatio: 0.76,
          ),
          itemBuilder: (context, index) {
            final place = top6[index];
            final dist = place.getDistanceKm(locationState.lat, locationState.lng);
            final travelTime = place.getTravelTimeEstimate(locationState.lat, locationState.lng);
            final isSelected = _destination.toLowerCase() == place.name.toLowerCase();

            return InkWell(
              onTap: () => _selectDestinationPlace(place),
              borderRadius: BorderRadius.circular(AppTheme.radiusMedium),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                decoration: BoxDecoration(
                  color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
                  borderRadius: BorderRadius.circular(AppTheme.radiusMedium),
                  border: Border.all(
                    color: isSelected ? AppColors.primary : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
                    width: isSelected ? 2.5 : 1.0,
                  ),
                  boxShadow: isSelected
                      ? [
                          BoxShadow(
                            color: AppColors.primary.withOpacity(0.25),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ]
                      : [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.04),
                            blurRadius: 6,
                            offset: const Offset(0, 2),
                          ),
                        ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Destination Image with Rank & Distance Badges
                    Stack(
                      children: [
                        ClipRRect(
                          borderRadius: const BorderRadius.vertical(top: Radius.circular(AppTheme.radiusMedium - 2)),
                          child: WTNetworkImage(
                            imageUrl: place.imageUrl,
                            height: 110,
                            width: double.infinity,
                            fit: BoxFit.cover,
                          ),
                        ),
                        // Rank Badge (#1, #2...)
                        Positioned(
                          top: 8,
                          left: 8,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                            decoration: BoxDecoration(
                              color: index == 0 ? AppColors.accent : Colors.black.withOpacity(0.75),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              '#${index + 1} Nearest',
                              style: const TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ),
                        // Distance Tag
                        Positioned(
                          bottom: 8,
                          right: 8,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.black.withOpacity(0.7),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.directions_car_rounded, size: 10, color: Colors.white),
                                const SizedBox(width: 3),
                                Text(
                                  '$dist km',
                                  style: const TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        // Selection Checkmark
                        if (isSelected)
                          Positioned(
                            top: 8,
                            right: 8,
                            child: Container(
                              padding: const EdgeInsets.all(4),
                              decoration: const BoxDecoration(
                                color: AppColors.primary,
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.check, color: Colors.white, size: 14),
                            ),
                          ),
                      ],
                    ),

                    // Destination Info
                    Padding(
                      padding: const EdgeInsets.all(10),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            place.name,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w800,
                              color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '${place.state}, ${place.country}',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontSize: 11,
                              color: isDark ? AppColors.textMutedDark : AppColors.textSecondaryLight,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  const Icon(Icons.star_rounded, size: 14, color: Colors.amber),
                                  const SizedBox(width: 2),
                                  Text(
                                    place.rating.toString(),
                                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
                                  ),
                                ],
                              ),
                              Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(Icons.directions_car_rounded, size: 12, color: AppColors.accentDark),
                                  const SizedBox(width: 3),
                                  Text(
                                    travelTime,
                                    style: const TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.accentDark,
                                    ),
                                  ),
                                ],
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
      ],
    );
  }

  // STEP 2: Duration
  Widget _buildStep2Duration(BuildContext context, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildStepHeader(
          title: 'How much time do you have?',
          subtitle: 'Choose your trip length for this upcoming weekend.',
        ),
        const SizedBox(height: 24),
        _buildSelectableCard(
          isDark: isDark,
          title: '1 Day Escape',
          subtitle: 'Same-day morning-to-night road trip without overnight stay',
          icon: Icons.wb_sunny_outlined,
          isSelected: _durationDays == 1,
          onTap: () => setState(() => _durationDays = 1),
        ),
        const SizedBox(height: 12),
        _buildSelectableCard(
          isDark: isDark,
          title: '2 Days Weekend Trip (Recommended)',
          subtitle: 'Saturday morning departure & Sunday evening return',
          icon: Icons.calendar_today_rounded,
          isSelected: _durationDays == 2,
          onTap: () => setState(() => _durationDays = 2),
        ),
        const SizedBox(height: 12),
        _buildSelectableCard(
          isDark: isDark,
          title: '3 Days Long Weekend',
          subtitle: 'Friday to Sunday or holiday extension for deep exploration',
          icon: Icons.date_range_rounded,
          isSelected: _durationDays == 3,
          onTap: () => setState(() => _durationDays = 3),
        ),
      ],
    );
  }

  // STEP 3: Budget
  Widget _buildStep3Budget(BuildContext context, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildStepHeader(
          title: 'What is your estimated total budget?',
          subtitle: 'Covers travel fuel/fare, hotel stay, food and activities.',
        ),
        const SizedBox(height: 24),
        Center(
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
            decoration: BoxDecoration(
              color: AppColors.primaryContainer.withOpacity(0.5),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              '₹$_budget',
              style: const TextStyle(
                fontSize: 34,
                fontWeight: FontWeight.w900,
                color: AppColors.primary,
                letterSpacing: -1,
              ),
            ),
          ),
        ),
        const SizedBox(height: 24),
        Slider(
          value: _budget.toDouble(),
          min: 2500,
          max: 25000,
          divisions: 45,
          activeColor: AppColors.primary,
          inactiveColor: isDark ? AppColors.darkBorder : AppColors.lightBorder,
          onChanged: (val) => setState(() => _budget = val.round()),
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _buildBudgetPresetBtn('₹3,500', 3500),
            _buildBudgetPresetBtn('₹5,000', 5000),
            _buildBudgetPresetBtn('₹7,500', 7500),
            _buildBudgetPresetBtn('₹12,000', 12000),
          ],
        ),
      ],
    );
  }

  Widget _buildBudgetPresetBtn(String label, int val) {
    final isSel = _budget == val;
    return OutlinedButton(
      onPressed: () => setState(() => _budget = val),
      style: OutlinedButton.styleFrom(
        backgroundColor: isSel ? AppColors.primary : Colors.transparent,
        foregroundColor: isSel ? Colors.white : AppColors.primary,
        side: BorderSide(color: AppColors.primary.withOpacity(0.5)),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      ),
      child: Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
    );
  }

  // STEP 4: Travellers
  Widget _buildStep4Travellers(BuildContext context, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildStepHeader(
          title: 'Who is joining this journey?',
          subtitle: 'We tailor the pacing, stays, and activities for your group.',
        ),
        const SizedBox(height: 24),
        _buildSelectableCard(
          isDark: isDark,
          title: 'Solo Explorer 🎒',
          subtitle: 'Peaceful, budget-conscious, flexible and self-paced',
          icon: Icons.person_rounded,
          isSelected: _travellers == 'Solo',
          onTap: () => setState(() => _travellers = 'Solo'),
        ),
        const SizedBox(height: 12),
        _buildSelectableCard(
          isDark: isDark,
          title: 'Couple ❤️',
          subtitle: 'Romantic dining, scenic viewpoints and boutique stays',
          icon: Icons.favorite_rounded,
          isSelected: _travellers == 'Couple',
          onTap: () => setState(() => _travellers = 'Couple'),
        ),
        const SizedBox(height: 12),
        _buildSelectableCard(
          isDark: isDark,
          title: 'Family 👨‍👩‍👧',
          subtitle: 'Comfortable road access, kid-friendly spots and clean stays',
          icon: Icons.family_restroom_rounded,
          isSelected: _travellers == 'Family',
          onTap: () => setState(() => _travellers = 'Family'),
        ),
        const SizedBox(height: 12),
        _buildSelectableCard(
          isDark: isDark,
          title: 'Friends Squad ⛺',
          subtitle: 'Thrills, adventure sports, bonfires and late night cafes',
          icon: Icons.groups_rounded,
          isSelected: _travellers == 'Friends',
          onTap: () => setState(() => _travellers = 'Friends'),
        ),
      ],
    );
  }

  // STEP 5: Interests & Vibe
  Widget _buildStep5Interests(BuildContext context, bool isDark) {
    final vibes = [
      {'name': 'Nature 🌿', 'id': 'Nature'},
      {'name': 'Adventure ⛰️', 'id': 'Adventure'},
      {'name': 'Food & Cafes 🍜', 'id': 'Food'},
      {'name': 'History & Forts 🏰', 'id': 'History'},
      {'name': 'Relaxation & Spa 🧘', 'id': 'Relaxation'},
      {'name': 'Spiritual 🪔', 'id': 'Spiritual'},
      {'name': 'Photography 📸', 'id': 'Photography'},
      {'name': 'Rivers & Lakes 🌊', 'id': 'Water'},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildStepHeader(
          title: 'What is your weekend vibe?',
          subtitle: 'Select 1 or more themes you want in your personalized itinerary.',
        ),
        const SizedBox(height: 24),
        Wrap(
          spacing: 10,
          runSpacing: 10,
          children: vibes.map((vibe) {
            final id = vibe['id']!;
            final name = vibe['name']!;
            final isSelected = _selectedInterests.contains(id);

            return FilterChip(
              label: Text(name),
              selected: isSelected,
              selectedColor: AppColors.primary,
              checkmarkColor: Colors.white,
              labelStyle: TextStyle(
                color: isSelected ? Colors.white : (isDark ? Colors.white70 : Colors.black87),
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
              ),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              onSelected: (selected) {
                setState(() {
                  if (selected) {
                    _selectedInterests.add(id);
                  } else {
                    _selectedInterests.remove(id);
                  }
                });
              },
            );
          }).toList(),
        ),
      ],
    );
  }

  // STEP 6: Transport & Travel Style
  Widget _buildStep6Transport(BuildContext context, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildStepHeader(
          title: 'How will you travel?',
          subtitle: 'Choose your transport mode and travel comfort style.',
        ),
        const SizedBox(height: 20),
        Text(
          'Transport Mode',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
          ),
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _buildTransportOption(Icons.directions_car_rounded, 'Car', isDark),
            _buildTransportOption(Icons.two_wheeler_rounded, 'Bike', isDark),
            _buildTransportOption(Icons.train_rounded, 'Train', isDark),
            _buildTransportOption(Icons.directions_bus_rounded, 'Bus', isDark),
          ],
        ),
        const SizedBox(height: 28),
        Text(
          'Travel Style',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
          ),
        ),
        const SizedBox(height: 12),
        _buildSelectableCard(
          isDark: isDark,
          title: 'Balanced (Smart & Popular)',
          subtitle: 'Best blend of quality homestays/resorts, local dining & comfort',
          icon: Icons.balance_rounded,
          isSelected: _travelStyle == 'Balanced',
          onTap: () => setState(() => _travelStyle = 'Balanced'),
        ),
        const SizedBox(height: 10),
        _buildSelectableCard(
          isDark: isDark,
          title: 'Budget Friendly',
          subtitle: 'Hostels, scenic viewpoints, dhabas and cost-efficient routes',
          icon: Icons.savings_outlined,
          isSelected: _travelStyle == 'Budget',
          onTap: () => setState(() => _travelStyle = 'Budget'),
        ),
        const SizedBox(height: 10),
        _buildSelectableCard(
          isDark: isDark,
          title: 'Premium Luxury',
          subtitle: 'Heritage fort palaces, 5-star river resorts and fine dining',
          icon: Icons.diamond_outlined,
          isSelected: _travelStyle == 'Premium',
          onTap: () => setState(() => _travelStyle = 'Premium'),
        ),
      ],
    );
  }

  Widget _buildTransportOption(IconData icon, String label, bool isDark) {
    final isSel = _transport == label;
    return GestureDetector(
      onTap: () => setState(() => _transport = label),
      child: Container(
        width: 72,
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: isSel ? AppColors.primary : (isDark ? AppColors.darkSurface : AppColors.lightSurface),
          borderRadius: BorderRadius.circular(AppTheme.radiusMedium),
          border: Border.all(
            color: isSel ? AppColors.primary : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
            width: 1.5,
          ),
        ),
        child: Column(
          children: [
            Icon(icon, color: isSel ? Colors.white : AppColors.primary, size: 24),
            const SizedBox(height: 6),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: isSel ? FontWeight.w700 : FontWeight.w500,
                color: isSel ? Colors.white : (isDark ? Colors.white70 : Colors.black87),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStepHeader({required String title, required String subtitle}) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w800,
            color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
            letterSpacing: -0.5,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          subtitle,
          style: TextStyle(
            fontSize: 14,
            color: isDark ? AppColors.textMutedDark : AppColors.textSecondaryLight,
            height: 1.4,
          ),
        ),
      ],
    );
  }

  Widget _buildSelectableCard({
    required bool isDark,
    required String title,
    required String subtitle,
    required IconData icon,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppTheme.radiusLarge),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected
              ? (isDark ? AppColors.primaryLight.withOpacity(0.2) : AppColors.primaryContainer.withOpacity(0.5))
              : (isDark ? AppColors.darkSurface : AppColors.lightSurface),
          borderRadius: BorderRadius.circular(AppTheme.radiusLarge),
          border: Border.all(
            color: isSelected ? AppColors.primary : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: isSelected ? AppColors.primary : (isDark ? AppColors.darkSurfaceSubtle : AppColors.lightSurfaceSubtle),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: isSelected ? Colors.white : AppColors.primary, size: 22),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontSize: 12,
                      color: isDark ? AppColors.textMutedDark : AppColors.textSecondaryLight,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              isSelected ? Icons.check_circle_rounded : Icons.radio_button_unchecked,
              color: isSelected ? AppColors.primary : Colors.grey.shade400,
              size: 20,
            ),
          ],
        ),
      ),
    );
  }
}
