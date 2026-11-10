import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:weekendtravellers_app/shared/data/curated_blogs.dart';
import 'package:weekendtravellers_app/shared/data/curated_destinations.dart';
import 'package:weekendtravellers_app/shared/widgets/wt_network_image.dart';

void main() {
  group('WeekendTravellers Robustness & Reliability Tests', () {
    test('CuratedDestinationsData.getBySlug is case-insensitive and resilient', () {
      final destUpper = CuratedDestinationsData.getBySlug('RISHIKESH');
      expect(destUpper, isNotNull);
      expect(destUpper!.name.toLowerCase(), contains('rishikesh'));

      final destHyphen = CuratedDestinationsData.getBySlug('jim-corbett');
      expect(destHyphen, isNotNull);

      final destUnknown = CuratedDestinationsData.getBySlug('non-existent-city-xyz-123');
      expect(destUnknown, isNotNull); // Falls back safely instead of null crash
    });

    test('CuratedBlogsData.getBySlug is case-insensitive and resilient', () {
      final blogUpper = CuratedBlogsData.getBySlug('COORG');
      expect(blogUpper, isNotNull);
      expect(blogUpper!.destination.toLowerCase(), 'coorg');

      final blogUnknown = CuratedBlogsData.getBySlug('completely-unknown-guide-abc');
      expect(blogUnknown, isNotNull); // Safe fallback to first article
    });

    test('filterBy sorts destinations by proximity to user origin city', () {
      final delhiTrips = CuratedDestinationsData.filterBy(originCity: 'Delhi');
      final mumbaiTrips = CuratedDestinationsData.filterBy(originCity: 'Mumbai');
      final bangaloreTrips = CuratedDestinationsData.filterBy(originCity: 'Bangalore');

      // The top destination for Delhi should be closer to Delhi than Mumbai
      expect(delhiTrips.first.getDistanceKm('Delhi') <= delhiTrips.last.getDistanceKm('Delhi'), isTrue);

      // Top Mumbai trips should have small distance from Mumbai
      expect(mumbaiTrips.first.getDistanceKm('Mumbai') < 300, isTrue);

      // Top Bangalore trips should have small distance from Bangalore
      expect(bangaloreTrips.first.getDistanceKm('Bangalore') < 300, isTrue);
    });

    testWidgets('WTNetworkImage gracefully displays fallback on empty or malformed URL', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: WTNetworkImage(
              imageUrl: '',
              width: 100,
              height: 100,
            ),
          ),
        ),
      );

      // Verify that WTNetworkImage builds without throwing uncaught exceptions
      expect(find.byType(WTNetworkImage), findsOneWidget);
    });
  });
}
