import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:weekendtravellers_app/core/storage/local_storage_service.dart';
import 'package:weekendtravellers_app/main.dart';
import 'package:weekendtravellers_app/shared/data/curated_destinations.dart';
import 'package:weekendtravellers_app/shared/providers/app_providers.dart';

void main() {
  testWidgets('App renders splash and transitions cleanly', (WidgetTester tester) async {
    SharedPreferences.setMockInitialValues({
      'wt_has_seen_onboarding': true,
      'wt_origin_city': 'Delhi',
    });
    final storage = await LocalStorageService.init();

    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          localStorageProvider.overrideWithValue(storage),
        ],
        child: const WeekendTravellersApp(),
      ),
    );

    // Initial frame
    await tester.pump();
    expect(find.byType(WeekendTravellersApp), findsOneWidget);

    // Advance beyond splash delay timer (2200ms)
    await tester.pump(const Duration(milliseconds: 2600));
    await tester.pump();
  });

  test('Curated Destinations database is populated and searchable', () {
    final allDestinations = CuratedDestinationsData.destinations;
    expect(allDestinations.isNotEmpty, true);

    final rishikesh = CuratedDestinationsData.getBySlug('rishikesh');
    expect(rishikesh, isNotNull);
    expect(rishikesh!.name, 'Rishikesh');
    expect(rishikesh.rating >= 4.5, true);
    expect(rishikesh.attractions.isNotEmpty, true);
    expect(rishikesh.hotels.isNotEmpty, true);

    final searchResults = CuratedDestinationsData.search('Jaipur');
    expect(searchResults.any((d) => d.slug == 'jaipur'), true);

    final coupleDestinations = CuratedDestinationsData.filterBy(category: 'Couples');
    expect(coupleDestinations.isNotEmpty, true);
  });
}
