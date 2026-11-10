import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/constants/app_constants.dart';
import 'core/storage/local_storage_service.dart';
import 'core/theme/app_theme.dart';
import 'routing/app_router.dart';
import 'shared/providers/app_providers.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Load .env configuration safely
  try {
    await dotenv.load(fileName: '.env');
  } catch (e) {
    debugPrint('[WeekendTravellers] Warning: Could not load .env file: $e');
  }

  // Initialize Local Storage
  final storageService = await LocalStorageService.init();

  runApp(
    ProviderScope(
      overrides: [
        localStorageProvider.overrideWithValue(storageService),
      ],
      child: const WeekendTravellersApp(),
    ),
  );
}

class WeekendTravellersApp extends ConsumerWidget {
  const WeekendTravellersApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeProvider);

    return MaterialApp.router(
      title: AppConstants.appName,
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: themeMode,
      routerConfig: AppRouter.router,
    );
  }
}
