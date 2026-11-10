import 'dart:async';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_constants.dart';
import '../../../shared/providers/app_providers.dart';

/// World-Class Professional Animated Brand Splash Screen
/// Features the new WeekendTravellers corporate brand logo with
/// elastic scale entrance, light-sweep shimmer, concentric radar waves,
/// dual-tone typography, and real-time AI readiness status ticker.
class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen>
    with TickerProviderStateMixin {
  late AnimationController _pulseController;
  late AnimationController _entranceController;
  late AnimationController _shimmerController;
  late AnimationController _radarController;

  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;
  late Animation<double> _shimmerAnimation;

  Timer? _navTimer;
  Timer? _tickerTimer;

  int _tickerIndex = 0;
  final List<String> _travelTickers = [
    'Scanning weekend getaways near you...',
    'Calculating best drive routes via car...',
    'Curating boutique stays & scenic viewpoints...',
    'Your AI travel assistant is ready ✨',
  ];

  @override
  void initState() {
    super.initState();

    // 1. Gentle breathing ambient pulse
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2400),
    )..repeat(reverse: true);

    // 2. Concentric radar wave expansion
    _radarController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 3200),
    )..repeat();

    // 3. Elastic entrance animation
    _entranceController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    );

    _fadeAnimation = CurvedAnimation(
      parent: _entranceController,
      curve: const Interval(0.0, 0.6, curve: Curves.easeIn),
    );

    _scaleAnimation = Tween<double>(begin: 0.72, end: 1.0).animate(
      CurvedAnimation(
        parent: _entranceController,
        curve: const Interval(0.0, 0.85, curve: Curves.easeOutBack),
      ),
    );

    // 4. Luminous light-sweep shimmer glides across the logo
    _shimmerController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1800),
    );

    _shimmerAnimation = Tween<double>(begin: -1.0, end: 2.0).animate(
      CurvedAnimation(
        parent: _shimmerController,
        curve: Curves.easeInOutCubic,
      ),
    );

    _entranceController.forward();
    Future.delayed(const Duration(milliseconds: 400), () {
      if (mounted) _shimmerController.forward();
    });

    _startTickerCycle();
    _navigateToNext();
  }

  void _startTickerCycle() {
    _tickerTimer = Timer.periodic(const Duration(milliseconds: 550), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }
      setState(() {
        _tickerIndex = (_tickerIndex + 1) % _travelTickers.length;
      });
    });
  }

  void _navigateToNext() {
    _navTimer = Timer(const Duration(milliseconds: 2200), () {
      if (!mounted) return;
      _proceed();
    });
  }

  void _proceed() {
    _navTimer?.cancel();
    _tickerTimer?.cancel();
    final storage = ref.read(localStorageProvider);
    final hasSeenOnboarding = storage.hasSeenOnboarding();
    if (hasSeenOnboarding) {
      context.go('/home');
    } else {
      context.go('/onboarding');
    }
  }

  @override
  void dispose() {
    _navTimer?.cancel();
    _tickerTimer?.cancel();
    _pulseController.dispose();
    _entranceController.dispose();
    _shimmerController.dispose();
    _radarController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF070C18),
      body: GestureDetector(
        onTap: _proceed,
        behavior: HitTestBehavior.opaque,
        child: Stack(
          fit: StackFit.expand,
          children: [
            // Layer 1: Luxury Deep Blue & Obsidian Aurora Background
            AnimatedBuilder(
              animation: _pulseController,
              builder: (context, child) {
                final pulse = _pulseController.value;
                return Container(
                  decoration: BoxDecoration(
                    gradient: RadialGradient(
                      center: const Alignment(0, -0.12),
                      radius: 1.15 + (pulse * 0.25),
                      colors: [
                        Color.lerp(
                          const Color(0xFF0D43B2),
                          const Color(0xFF1D5DE0),
                          pulse,
                        )!,
                        const Color(0xFF0A1E4A),
                        const Color(0xFF050811),
                      ],
                      stops: const [0.0, 0.55, 1.0],
                    ),
                  ),
                );
              },
            ),

            // Layer 2: Concentric Radar Discovery Waves
            AnimatedBuilder(
              animation: _radarController,
              builder: (context, child) {
                return CustomPaint(
                  painter: _RadarWavesPainter(progress: _radarController.value),
                );
              },
            ),

            // Layer 3: Ambient Floating Particles
            const Positioned.fill(
              child: _SplashParticlesWidget(),
            ),

            // Layer 4: Skip Button in Top Bar
            SafeArea(
              child: Align(
                alignment: Alignment.topRight,
                child: Padding(
                  padding: const EdgeInsets.only(top: 12, right: 16),
                  child: TextButton.icon(
                    onPressed: _proceed,
                    icon: const Icon(Icons.arrow_forward_rounded, size: 14, color: Colors.white70),
                    label: const Text(
                      'Skip',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.white70),
                    ),
                    style: TextButton.styleFrom(
                      backgroundColor: Colors.white.withOpacity(0.08),
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                  ),
                ),
              ),
            ),

            // Layer 5: Hero Central Logo and Brand Typography
            Center(
              child: FadeTransition(
                opacity: _fadeAnimation,
                child: ScaleTransition(
                  scale: _scaleAnimation,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // HERO LAUNCHER ICON with Soft Amber & Royal Blue Halo
                      SizedBox(
                        width: 170,
                        height: 170,
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            // 1. Breathing Glow Halo (Sunset Orange & Azure)
                            AnimatedBuilder(
                              animation: _pulseController,
                              builder: (context, child) {
                                final pulse = _pulseController.value;
                                return Container(
                                  width: 130 + (pulse * 24),
                                  height: 130 + (pulse * 24),
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(36),
                                    boxShadow: [
                                      BoxShadow(
                                        color: const Color(0xFFFF6A00).withOpacity(0.35 * (1 - pulse * 0.25)),
                                        blurRadius: 40,
                                        spreadRadius: 4,
                                      ),
                                      BoxShadow(
                                        color: const Color(0xFF2563EB).withOpacity(0.4 * pulse),
                                        blurRadius: 32,
                                        spreadRadius: 2,
                                      ),
                                    ],
                                  ),
                                );
                              },
                            ),

                            // 2. Master Squircle Icon Container
                            Container(
                              width: 124,
                              height: 124,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(28),
                                border: Border.all(
                                  color: Colors.white.withOpacity(0.7),
                                  width: 2.0,
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.45),
                                    blurRadius: 26,
                                    offset: const Offset(0, 10),
                                  ),
                                  BoxShadow(
                                    color: const Color(0xFF0D52D6).withOpacity(0.25),
                                    blurRadius: 18,
                                    offset: const Offset(0, 4),
                                  ),
                                ],
                              ),
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(26),
                                child: Stack(
                                  children: [
                                    // New Launcher Logo Image
                                    Image.asset(
                                      'assets/icons/app_icon.png',
                                      width: 124,
                                      height: 124,
                                      fit: BoxFit.cover,
                                    ),

                                    // Light-sweep shimmer overlay
                                    AnimatedBuilder(
                                      animation: _shimmerAnimation,
                                      builder: (context, child) {
                                        return Positioned.fill(
                                          child: ShaderMask(
                                            blendMode: BlendMode.srcATop,
                                            shaderCallback: (bounds) {
                                              return LinearGradient(
                                                begin: Alignment.topLeft,
                                                end: Alignment.bottomRight,
                                                colors: const [
                                                  Colors.transparent,
                                                  Colors.white30,
                                                  Colors.white70,
                                                  Colors.white30,
                                                  Colors.transparent,
                                                ],
                                                stops: const [0.0, 0.4, 0.5, 0.6, 1.0],
                                                transform: _SlideGradientTransform(_shimmerAnimation.value),
                                              ).createShader(bounds);
                                            },
                                            child: Container(color: Colors.transparent),
                                          ),
                                        );
                                      },
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 28),

                      // Brand Name with Metallic Gradient Mask
                      ShaderMask(
                        shaderCallback: (bounds) {
                          return const LinearGradient(
                            colors: [
                              Colors.white,
                              Color(0xFFE2E8F0),
                              Color(0xFFFF8533), // Warm Sunset Orange
                            ],
                            stops: [0.0, 0.6, 1.0],
                          ).createShader(bounds);
                        },
                        child: const Text(
                          AppConstants.appName,
                          style: TextStyle(
                            fontFamily: 'PlusJakartaSans',
                            fontSize: 30,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                            letterSpacing: -0.6,
                          ),
                        ),
                      ),

                      const SizedBox(height: 8),

                      // Brand Tagline with Clean Tracking
                      Text(
                        AppConstants.appTagline,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          color: Colors.white.withOpacity(0.8),
                          letterSpacing: 0.5,
                        ),
                      ),

                      const SizedBox(height: 16),

                      // Elegant Accent Divider Line
                      Container(
                        width: 48,
                        height: 3,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [
                              Color(0xFF0D52D6), // Royal Blue
                              Color(0xFFFF6A00), // Sunset Orange
                            ],
                          ),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // Layer 6: Bottom Status Pill with Live AI Readiness Ticker
            Positioned(
              left: 24,
              right: 24,
              bottom: 38,
              child: FadeTransition(
                opacity: _fadeAnimation,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.08),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: Colors.white12),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          // Live pulsating beacon
                          Container(
                            width: 8,
                            height: 8,
                            decoration: BoxDecoration(
                              color: const Color(0xFF10B981),
                              shape: BoxShape.circle,
                              boxShadow: [
                                BoxShadow(
                                  color: const Color(0xFF10B981).withOpacity(0.8),
                                  blurRadius: 6,
                                  spreadRadius: 1,
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 10),
                          Flexible(
                            child: AnimatedSwitcher(
                              duration: const Duration(milliseconds: 300),
                              child: Text(
                                _travelTickers[_tickerIndex],
                                key: ValueKey<int>(_tickerIndex),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w500,
                                  color: Colors.white70,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Elegant Progress Bar
                    Container(
                      width: 140,
                      height: 3,
                      clipBehavior: Clip.antiAlias,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(2),
                      ),
                      child: AnimatedBuilder(
                        animation: _pulseController,
                        builder: (context, child) {
                          return FractionallySizedBox(
                            alignment: Alignment.centerLeft,
                            widthFactor: 0.35 + (_pulseController.value * 0.65),
                            child: Container(
                              decoration: const BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [
                                    Color(0xFF0D52D6),
                                    Color(0xFFFF6A00),
                                  ],
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Concentric expanding radar wave painter
class _RadarWavesPainter extends CustomPainter {
  final double progress;

  _RadarWavesPainter({required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height * 0.42);

    for (int i = 0; i < 3; i++) {
      final waveProgress = (progress + (i * 0.33)) % 1.0;
      final radius = 70.0 + (waveProgress * 150.0);
      final alpha = ((1.0 - waveProgress) * 0.18).clamp(0.0, 1.0);

      final paint = Paint()
        ..color = (i % 2 == 0 ? const Color(0xFF0D52D6) : const Color(0xFFFF6A00)).withOpacity(alpha)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.4;

      canvas.drawCircle(center, radius, paint);
    }
  }

  @override
  bool shouldRepaint(covariant _RadarWavesPainter oldDelegate) =>
      oldDelegate.progress != progress;
}

/// Shimmer gradient sliding transform helper
class _SlideGradientTransform extends GradientTransform {
  final double slide;

  const _SlideGradientTransform(this.slide);

  @override
  Matrix4? transform(Rect bounds, {TextDirection? textDirection}) {
    return Matrix4.translationValues(bounds.width * slide, 0.0, 0.0);
  }
}

/// Floating fireflies / star particles in ambient background
class _SplashParticlesWidget extends StatefulWidget {
  const _SplashParticlesWidget();

  @override
  State<_SplashParticlesWidget> createState() => _SplashParticlesWidgetState();
}

class _SplashParticlesWidgetState extends State<_SplashParticlesWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  final List<Offset> _coords = [];

  @override
  void initState() {
    super.initState();
    final rand = math.Random(42);
    for (int i = 0; i < 28; i++) {
      _coords.add(Offset(rand.nextDouble(), rand.nextDouble()));
    }

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 8),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return CustomPaint(
          painter: _ParticlePainter(
            progress: _controller.value,
            coords: _coords,
          ),
        );
      },
    );
  }
}

class _ParticlePainter extends CustomPainter {
  final double progress;
  final List<Offset> coords;

  _ParticlePainter({required this.progress, required this.coords});

  @override
  void paint(Canvas canvas, Size size) {
    for (int i = 0; i < coords.length; i++) {
      final base = coords[i];
      final wobble = math.sin((progress * 2 * math.pi) + (i * 0.9)) * 6.0;
      final alpha = (0.2 + 0.45 * math.sin((progress * math.pi) + (i * 0.7))).clamp(0.08, 0.75);

      final paint = Paint()
        ..color = (i % 2 == 0 ? const Color(0xFFFF6A00) : const Color(0xFF2563EB)).withOpacity(alpha)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 2);

      canvas.drawCircle(
        Offset(base.dx * size.width + wobble, base.dy * size.height - wobble),
        i % 3 == 0 ? 3.0 : 1.8,
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant _ParticlePainter oldDelegate) =>
      oldDelegate.progress != progress;
}
