import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../shared/models/trip_model.dart';
import '../../../shared/providers/app_providers.dart';

class ActiveTripNotifier extends Notifier<TripModel?> {
  @override
  TripModel? build() => null;

  void setTrip(TripModel? trip) => state = trip;
}

// Provider to hold the currently generated active trip
final activeTripProvider = NotifierProvider<ActiveTripNotifier, TripModel?>(ActiveTripNotifier.new);

/// Signature AI Trip Generation Experience Screen
class AiGenerationScreen extends ConsumerStatefulWidget {
  final String origin;
  final String destination;
  final int duration;
  final int budget;
  final String travellers;
  final String transport;
  final String travelStyle;
  final List<String> interests;

  const AiGenerationScreen({
    super.key,
    required this.origin,
    required this.destination,
    required this.duration,
    required this.budget,
    required this.travellers,
    required this.transport,
    required this.travelStyle,
    required this.interests,
  });

  @override
  ConsumerState<AiGenerationScreen> createState() => _AiGenerationScreenState();
}

class _AiGenerationScreenState extends ConsumerState<AiGenerationScreen> {
  int _currentStage = 0;

  final List<String> _stages = [
    'Finding the best destination...',
    'Checking travel distance & road routes...',
    'Finding top places to visit & activities...',
    'Checking the weekend weather forecast...',
    'Building your day-wise itinerary...',
    'Calculating your smart budget...',
    'Your weekend is ready 🎉',
  ];

  @override
  void initState() {
    super.initState();
    _startGeneration();
  }

  Future<void> _startGeneration() async {
    // 1. Kick off async generation service
    final generator = ref.read(tripGeneratorServiceProvider);
    final tripFuture = generator.generateTrip(
      origin: widget.origin,
      destination: widget.destination,
      durationDays: widget.duration,
      travellers: widget.travellers,
      budget: widget.budget,
      transport: widget.transport,
      interests: widget.interests,
      travelStyle: widget.travelStyle,
    );

    // 2. Play through stage transitions for visual excitement and real-time feel
    for (int i = 0; i < _stages.length - 1; i++) {
      await Future.delayed(const Duration(milliseconds: 650));
      if (!mounted) return;
      setState(() => _currentStage = i + 1);
    }

    final trip = await tripFuture;
    if (!mounted) return;

    // Save locally into user's trips list
    ref.read(savedTripsProvider.notifier).saveTrip(trip);
    ref.read(activeTripProvider.notifier).setTrip(trip);

    await Future.delayed(const Duration(milliseconds: 600));
    if (!mounted) return;

    // Transition to Trip Result Screen
    context.pushReplacement('/trip/${trip.id}');
  }

  @override
  Widget build(BuildContext context) {
    final progress = (_currentStage + 1) / _stages.length;

    return Scaffold(
      backgroundColor: AppColors.darkBg,
      body: Stack(
        fit: StackFit.expand,
        children: [
          // Radiant Background
          Container(
            decoration: const BoxDecoration(
              gradient: RadialGradient(
                center: Alignment(0, -0.2),
                radius: 1.1,
                colors: [
                  Color(0xFF0D52D6),
                  Color(0xFF093994),
                  Color(0xFF0A0F1D),
                ],
              ),
            ),
          ),

          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Spacer(flex: 2),

                  // Sparkle AI Icon Container
                  Container(
                    width: 90,
                    height: 90,
                    decoration: BoxDecoration(
                      color: AppColors.primaryLight.withOpacity(0.3),
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white24, width: 1.5),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.primary.withOpacity(0.4),
                          blurRadius: 30,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: const Center(
                      child: Icon(
                        Icons.auto_awesome_rounded,
                        size: 42,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  const SizedBox(height: 36),

                  // Animated Stage Message
                  AnimatedSwitcher(
                    duration: const Duration(milliseconds: 300),
                    child: Text(
                      _stages[_currentStage],
                      key: ValueKey<int>(_currentStage),
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontFamily: 'PlusJakartaSans',
                        fontSize: 22,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                        letterSpacing: -0.4,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),

                  Text(
                    'Crafting a ${widget.duration}-day trip from ${widget.origin} for ₹${widget.budget}',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.white.withOpacity(0.7),
                    ),
                  ),

                  const SizedBox(height: 48),

                  // Progress Bar
                  ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: SizedBox(
                      height: 6,
                      child: LinearProgressIndicator(
                        value: progress,
                        backgroundColor: Colors.white12,
                        valueColor: const AlwaysStoppedAnimation<Color>(AppColors.accent),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),

                  Text(
                    '${(progress * 100).toInt()}% Completed',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Colors.white.withOpacity(0.5),
                    ),
                  ),

                  const Spacer(flex: 3),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
