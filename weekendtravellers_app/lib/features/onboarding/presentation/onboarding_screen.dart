import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../shared/providers/app_providers.dart';
import '../../../shared/widgets/wt_button.dart';
import '../../../shared/widgets/wt_network_image.dart';

/// 3-Screen Editorial Onboarding Experience
class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<Map<String, String>> _onboardingData = [
    {
      'image': 'https://images.pexels.com/photos/12366139/pexels-photo-12366139.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'headline': 'Discover weekends worth remembering.',
      'description': 'Find beautiful hidden places that fit your time, budget and travel mood in under 60 seconds.',
    },
    {
      'image': 'https://images.pexels.com/photos/28570070/pexels-photo-28570070.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'headline': 'Tell us what you love.',
      'description': 'Mountains, peaceful riverbanks, royal forts, adventure thrills or cozy cafes—we personalize every detail.',
    },
    {
      'image': 'https://images.pexels.com/photos/3310574/pexels-photo-3310574.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'headline': 'Your weekend. Planned by AI.',
      'description': 'Get a complete hour-by-hour itinerary, verified budget, route and packing list instantly.',
    },
  ];

  Future<void> _completeOnboarding() async {
    final storage = ref.read(localStorageProvider);
    await storage.setHasSeenOnboarding(true);
    if (!mounted) return;
    context.go('/home');
  }

  void _onNext() {
    if (_currentPage < _onboardingData.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 350),
        curve: Curves.easeInOut,
      );
    } else {
      _completeOnboarding();
    }
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // Background PageView with cross-fading hero images
          PageView.builder(
            controller: _pageController,
            onPageChanged: (idx) => setState(() => _currentPage = idx),
            itemCount: _onboardingData.length,
            itemBuilder: (context, index) {
              final item = _onboardingData[index];
              return Stack(
                fit: StackFit.expand,
                children: [
                  WTNetworkImage(
                    imageUrl: item['image']!,
                    fit: BoxFit.cover,
                  ),
                  // Dark Vignette Gradient
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.black.withOpacity(0.3),
                          Colors.transparent,
                          Colors.black.withOpacity(0.7),
                          Colors.black.withOpacity(0.95),
                        ],
                        stops: const [0.0, 0.25, 0.65, 1.0],
                      ),
                    ),
                  ),
                ],
              );
            },
          ),

          // Top Skip Button
          Positioned(
            top: MediaQuery.of(context).padding.top + 12,
            right: 20,
            child: TextButton(
              onPressed: _completeOnboarding,
              style: TextButton.styleFrom(
                foregroundColor: Colors.white70,
                backgroundColor: Colors.black38,
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
              ),
              child: const Text(
                'Skip',
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
              ),
            ),
          ),

          // Bottom Content & Navigation
          Positioned(
            left: 24,
            right: 24,
            bottom: MediaQuery.of(context).padding.bottom + 24,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                // Page Indicator Dots
                Row(
                  children: List.generate(
                    _onboardingData.length,
                    (i) => AnimatedContainer(
                      duration: const Duration(milliseconds: 300),
                      margin: const EdgeInsets.only(right: 6),
                      width: _currentPage == i ? 24 : 7,
                      height: 7,
                      decoration: BoxDecoration(
                        color: _currentPage == i ? AppColors.accent : Colors.white38,
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Headline
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  child: Text(
                    _onboardingData[_currentPage]['headline']!,
                    key: ValueKey<int>(_currentPage),
                    style: const TextStyle(
                      fontFamily: 'PlusJakartaSans',
                      fontSize: 30,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                      height: 1.2,
                      letterSpacing: -0.8,
                    ),
                  ),
                ),
                const SizedBox(height: 12),

                // Description
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  child: Text(
                    _onboardingData[_currentPage]['description']!,
                    key: ValueKey<String>('desc_$_currentPage'),
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w400,
                      color: Colors.white.withOpacity(0.8),
                      height: 1.45,
                    ),
                  ),
                ),
                const SizedBox(height: 32),

                // Primary Action Button
                WTPrimaryButton(
                  label: _currentPage == _onboardingData.length - 1
                      ? 'Start Exploring'
                      : 'Continue',
                  icon: _currentPage == _onboardingData.length - 1
                      ? Icons.explore_rounded
                      : Icons.arrow_forward_rounded,
                  onPressed: _onNext,
                  backgroundColor: AppColors.primary,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
