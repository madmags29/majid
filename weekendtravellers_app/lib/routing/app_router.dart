import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../features/about/presentation/about_screen.dart';
import '../features/ai_chat/presentation/ai_chat_screen.dart';
import '../features/blog/presentation/blog_detail_screen.dart';
import '../features/blog/presentation/blog_screen.dart';
import '../features/destination/presentation/destination_detail_screen.dart';
import '../features/explore/presentation/ai_search_screen.dart';
import '../features/explore/presentation/explore_screen.dart';
import '../features/faq/presentation/faq_screen.dart';
import '../features/home/presentation/home_screen.dart';
import '../features/home/presentation/main_navigation_shell.dart';
import '../features/inspiration/presentation/inspiration_trip_screen.dart';
import '../features/itinerary/presentation/trip_detail_screen.dart';
import '../features/my_trips/presentation/my_trips_screen.dart';
import '../features/onboarding/presentation/onboarding_screen.dart';
import '../features/onboarding/presentation/splash_screen.dart';
import '../features/profile/presentation/profile_screen.dart';
import '../features/saved/presentation/saved_screen.dart';
import '../features/trip_planner/presentation/ai_generation_screen.dart';
import '../features/trip_planner/presentation/trip_planner_screen.dart';

final GlobalKey<NavigatorState> _rootNavigatorKey = GlobalKey<NavigatorState>(debugLabel: 'root');

/// GoRouter Configuration for WeekendTravellers
class AppRouter {
  AppRouter._();

  static final GoRouter router = GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/splash',
    routes: [
      // Splash
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),

      // Onboarding
      GoRoute(
        path: '/onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),

      // Main Navigation Shell (5 Bottom Tabs)
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return MainNavigationShell(navigationShell: navigationShell);
        },
        branches: [
          // Branch 0: Home
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/home',
                builder: (context, state) => const HomeScreen(),
              ),
            ],
          ),
          // Branch 1: Explore
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/explore',
                builder: (context, state) => const ExploreScreen(),
              ),
            ],
          ),
          // Branch 2: Trips
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/trips',
                builder: (context, state) => const MyTripsScreen(),
              ),
            ],
          ),
          // Branch 3: Saved
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/saved',
                builder: (context, state) => const SavedScreen(),
              ),
            ],
          ),
          // Branch 4: Profile
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/profile',
                builder: (context, state) => const ProfileScreen(),
              ),
            ],
          ),
        ],
      ),

      // Destination Detail (also supports web /weekend-trips/:slug deep link)
      GoRoute(
        path: '/destination/:slug',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) {
          final slug = state.pathParameters['slug'] ?? 'rishikesh';
          return DestinationDetailScreen(slug: slug);
        },
      ),
      GoRoute(
        path: '/weekend-trips/:slug',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) {
          final slug = state.pathParameters['slug'] ?? 'rishikesh';
          return DestinationDetailScreen(slug: slug);
        },
      ),

      // AI Planner Wizard
      GoRoute(
        path: '/planner',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) {
          final destination = state.uri.queryParameters['destination'];
          return TripPlannerScreen(initialDestination: destination);
        },
      ),

      // AI Generation Screen
      GoRoute(
        path: '/ai-generation',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) {
          final params = state.uri.queryParameters;
          return AiGenerationScreen(
            origin: params['origin'] ?? 'Delhi',
            destination: params['destination'] ?? 'Rishikesh',
            duration: int.tryParse(params['duration'] ?? '2') ?? 2,
            budget: int.tryParse(params['budget'] ?? '7500') ?? 7500,
            travellers: params['travellers'] ?? 'Couple',
            transport: params['transport'] ?? 'Car',
            travelStyle: params['travelStyle'] ?? 'Balanced',
            interests: (params['interests'] ?? 'Nature,Adventure,Food').split(','),
          );
        },
      ),

      // Trip Result & Itinerary
      GoRoute(
        path: '/trip/:id',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) {
          final tripId = state.pathParameters['id'] ?? '';
          return TripDetailScreen(tripId: tripId);
        },
      ),

      // AI Chat
      GoRoute(
        path: '/ai-chat',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const AiChatScreen(),
      ),

      // AI Search Assistant (matches weekendtravellers.com/search)
      GoRoute(
        path: '/search',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) {
          final q = state.uri.queryParameters['q'];
          return AiSearchScreen(initialQuery: q);
        },
      ),
      GoRoute(
        path: '/ai-search',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) {
          final q = state.uri.queryParameters['q'];
          return AiSearchScreen(initialQuery: q);
        },
      ),

      // Trip Inspiration (matches weekendtravellers.com/inspiration-trip)
      GoRoute(
        path: '/inspiration-trip',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const InspirationTripScreen(),
      ),

      // Travel Blog & Guides (matches weekendtravellers.com/blog)
      GoRoute(
        path: '/blog',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const BlogScreen(),
      ),
      GoRoute(
        path: '/blog/:slug',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) {
          final slug = state.pathParameters['slug'] ?? '';
          return BlogDetailScreen(slug: slug);
        },
      ),

      // FAQ Screen (matches weekendtravellers.com/faq)
      GoRoute(
        path: '/faq',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const FaqScreen(),
      ),

      // About Screen (matches weekendtravellers.com/about)
      GoRoute(
        path: '/about',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const AboutScreen(),
      ),
    ],
  );
}
