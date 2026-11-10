import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/utils/currency_formatter.dart';
import '../../../shared/models/trip_model.dart';
import '../../../shared/providers/app_providers.dart';
import '../../../shared/widgets/wt_network_image.dart';
import '../../trip_planner/presentation/ai_generation_screen.dart';

class AiSearchMessage {
  final String role; // 'user' or 'assistant'
  final String text;
  final TripModel? itinerary;
  final bool isLoading;

  AiSearchMessage({
    required this.role,
    required this.text,
    this.itinerary,
    this.isLoading = false,
  });

  AiSearchMessage copyWith({
    String? role,
    String? text,
    TripModel? itinerary,
    bool? isLoading,
  }) {
    return AiSearchMessage(
      role: role ?? this.role,
      text: text ?? this.text,
      itinerary: itinerary ?? this.itinerary,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

/// AI Assistant Search Screen matching weekendtravellers.com/search
class AiSearchScreen extends ConsumerStatefulWidget {
  final String? initialQuery;

  const AiSearchScreen({super.key, this.initialQuery});

  @override
  ConsumerState<AiSearchScreen> createState() => _AiSearchScreenState();
}

class _AiSearchScreenState extends ConsumerState<AiSearchScreen> {
  final TextEditingController _queryController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<AiSearchMessage> _messages = [];
  bool _isSearching = false;

  final List<String> _quickSuggestions = [
    '2 days in Rishikesh for couples',
    'Weekend road trip near Delhi under ₹5,000',
    'Royal 2-day escape in Jaipur',
    'Adventure trips with river rafting',
    '3 days Manali mountain retreat',
  ];

  @override
  void initState() {
    super.initState();
    if (widget.initialQuery != null && widget.initialQuery!.isNotEmpty) {
      _queryController.text = widget.initialQuery!;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _handleSearch(widget.initialQuery!);
      });
    } else {
      _messages.add(
        AiSearchMessage(
          role: 'assistant',
          text: 'Where do you want to go this weekend? You can type any destination, budget, or travel style — I\'ll create a personalized trip for you in seconds!',
        ),
      );
    }
  }

  @override
  void dispose() {
    _queryController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _handleSearch(String query) async {
    final cleanQuery = query.trim();
    if (cleanQuery.isEmpty) return;

    _queryController.clear();

    setState(() {
      _messages.add(AiSearchMessage(role: 'user', text: cleanQuery));
      _messages.add(
        AiSearchMessage(
          role: 'assistant',
          text: 'Planning your trip... Analyzing best routes & weather...',
          isLoading: true,
        ),
      );
      _isSearching = true;
    });

    _scrollToBottom();

    // Parse user intent
    final lower = cleanQuery.toLowerCase();
    String destination = 'Rishikesh';
    if (lower.contains('jaipur')) {
      destination = 'Jaipur';
    } else if (lower.contains('agra')) {
      destination = 'Agra';
    } else if (lower.contains('manali')) {
      destination = 'Manali';
    } else if (lower.contains('udaipur')) {
      destination = 'Udaipur';
    } else if (lower.contains('neemrana')) {
      destination = 'Neemrana';
    }

    int days = 2;
    if (lower.contains('1 day')) {
      days = 1;
    } else if (lower.contains('3 day') || lower.contains('long weekend')) {
      days = 3;
    }

    int budget = 7500;
    if (lower.contains('3500')) {
      budget = 3500;
    } else if (lower.contains('5000') || lower.contains('5k')) {
      budget = 5000;
    } else if (lower.contains('10000') || lower.contains('10k')) {
      budget = 10000;
    }

    String travellers = 'Couple';
    if (lower.contains('solo')) {
      travellers = 'Solo';
    } else if (lower.contains('family')) {
      travellers = 'Family';
    } else if (lower.contains('friends') || lower.contains('squad')) {
      travellers = 'Friends';
    }

    final origin = ref.read(userLocationProvider).city;
    final tripGenerator = ref.read(tripGeneratorServiceProvider);

    try {
      final trip = await tripGenerator.generateTrip(
        origin: origin,
        destination: destination,
        durationDays: days,
        travellers: travellers,
        budget: budget,
        transport: 'Car',
        interests: ['Nature', 'Adventure', 'Food'],
        travelStyle: 'Balanced',
      );

      if (!mounted) return;

      setState(() {
        _isSearching = false;
        // Replace loading message with generated itinerary card
        _messages.removeLast();
        _messages.add(
          AiSearchMessage(
            role: 'assistant',
            text: 'I have planned your ${trip.durationDays}-day $destination getaway! Here is your personalized itinerary with routes and verified budget:',
            itinerary: trip,
          ),
        );
      });

      _scrollToBottom();
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _isSearching = false;
        _messages.removeLast();
        _messages.add(
          AiSearchMessage(
            role: 'assistant',
            text: 'I encountered an issue generating your trip. Let me know which city you would like to visit!',
          ),
        );
      });
      _scrollToBottom();
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/home');
            }
          },
        ),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: AppColors.primaryContainer.withOpacity(0.5),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.auto_awesome_rounded, color: AppColors.primary, size: 18),
            ),
            const SizedBox(width: 10),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'AI Search & Plan',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                ),
                Text(
                  'weekendtravellers.com AI',
                  style: TextStyle(fontSize: 11, color: Colors.grey),
                ),
              ],
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          // Message stream
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(20),
              physics: const BouncingScrollPhysics(),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final message = _messages[index];
                return _buildMessageItem(context, message, isDark);
              },
            ),
          ),

          // Quick Suggestion Chips
          SizedBox(
            height: 38,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _quickSuggestions.length,
              itemBuilder: (context, index) {
                final suggestion = _quickSuggestions[index];
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ActionChip(
                    label: Text(suggestion, style: const TextStyle(fontSize: 12)),
                    onPressed: _isSearching ? null : () => _handleSearch(suggestion),
                    backgroundColor: isDark ? AppColors.darkSurfaceSubtle : AppColors.lightSurfaceSubtle,
                    side: BorderSide(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 8),

          // Search Input Bar
          Container(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
              border: Border(
                top: BorderSide(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _queryController,
                    onSubmitted: _isSearching ? null : _handleSearch,
                    decoration: const InputDecoration(
                      hintText: 'e.g., 2 days in Manali under ₹8,000...',
                      border: InputBorder.none,
                      enabledBorder: InputBorder.none,
                      focusedBorder: InputBorder.none,
                      contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    ),
                  ),
                ),
                _isSearching
                    ? const Padding(
                        padding: EdgeInsets.all(8),
                        child: SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary),
                        ),
                      )
                    : IconButton(
                        icon: const Icon(Icons.arrow_upward_rounded, color: Colors.white),
                        style: IconButton.styleFrom(
                          backgroundColor: AppColors.accent, // Energetic Rust Orange
                          shape: const CircleBorder(),
                        ),
                        onPressed: () => _handleSearch(_queryController.text),
                      ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageItem(BuildContext context, AiSearchMessage msg, bool isDark) {
    final isUser = msg.role == 'user';

    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * (msg.itinerary != null ? 0.92 : 0.82),
        ),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: isUser
              ? AppColors.primary
              : (isDark ? AppColors.darkSurface : AppColors.lightSurface),
          borderRadius: BorderRadius.circular(AppTheme.radiusLarge),
          border: Border.all(
            color: isUser
                ? AppColors.primary
                : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
          ),
          boxShadow: AppTheme.softShadow,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Message text
            Row(
              children: [
                if (!isUser) ...[
                  const Icon(Icons.auto_awesome, size: 14, color: AppColors.accent),
                  const SizedBox(width: 6),
                ],
                Expanded(
                  child: Text(
                    msg.text,
                    style: TextStyle(
                      fontSize: 14,
                      height: 1.4,
                      color: isUser
                          ? Colors.white
                          : (isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight),
                    ),
                  ),
                ),
              ],
            ),

            // If loading indicator
            if (msg.isLoading) ...[
              const SizedBox(height: 10),
              LinearProgressIndicator(
                backgroundColor: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                valueColor: const AlwaysStoppedAnimation<Color>(AppColors.accent),
              ),
            ],

            // If an itinerary is generated, display rich preview card
            if (msg.itinerary != null) ...[
              const SizedBox(height: 14),
              _buildItineraryPreviewCard(context, msg.itinerary!, isDark),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildItineraryPreviewCard(BuildContext context, TripModel trip, bool isDark) {
    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkSurfaceSubtle : AppColors.lightSurfaceSubtle,
        borderRadius: BorderRadius.circular(AppTheme.radiusMedium),
        border: Border.all(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Hero Thumbnail
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(AppTheme.radiusMedium)),
            child: WTNetworkImage(
              imageUrl: trip.heroImage,
              height: 140,
              width: double.infinity,
              fit: BoxFit.cover,
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      trip.destination,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                      ),
                    ),
                    Text(
                      CurrencyFormatter.formatInr(trip.totalBudget),
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: AppColors.accent,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  '${trip.durationDays} Days • ${trip.logistics.distance} from ${trip.origin}',
                  style: TextStyle(
                    fontSize: 12,
                    color: isDark ? AppColors.textMutedDark : AppColors.textSecondaryLight,
                  ),
                ),
                const SizedBox(height: 10),

                // Highlights
                Wrap(
                  spacing: 6,
                  children: trip.interests.take(3).map((interest) {
                    return Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppColors.primaryContainer.withOpacity(0.5),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        interest,
                        style: const TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          color: AppColors.onPrimaryContainer,
                        ),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 14),

                // CTA
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          ref.read(savedTripsProvider.notifier).saveTrip(trip);
                          ref.read(activeTripProvider.notifier).setTrip(trip);
                          context.push('/trip/${trip.id}');
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 10),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text('View Complete Itinerary', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                            SizedBox(width: 6),
                            Icon(Icons.arrow_forward_rounded, size: 14),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
