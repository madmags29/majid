/// Curated Collections matching weekendtravellers.com/inspiration-trip
class InspirationCollection {
  final String title;
  final String description;
  final String icon;
  final List<String> destinations;
  final String heroImage;

  const InspirationCollection({
    required this.title,
    required this.description,
    required this.icon,
    required this.destinations,
    required this.heroImage,
  });
}

class CuratedCollectionsData {
  CuratedCollectionsData._();

  static const List<InspirationCollection> collections = [
    InspirationCollection(
      title: 'Mountain Retreats',
      description: 'Escape to the peaks for serene views and crisp mountain air.',
      icon: '⛰️',
      destinations: ['Manali', 'Shimla', 'Munnar', 'Darjeeling', 'Ooty', 'Nainital', 'Kodaikanal', 'McLeod Ganj'],
      heroImage: 'https://images.pexels.com/photos/12366139/pexels-photo-12366139.jpeg?auto=compress&cs=tinysrgb&w=800',
    ),
    InspirationCollection(
      title: 'Coastal Getaways',
      description: 'Sun, sand, and relaxing ocean sounds along pristine coastlines.',
      icon: '🌊',
      destinations: ['Goa', 'Andaman', 'Gokarna', 'Pondicherry', 'Varkala', 'Tarkarli', 'South Goa', 'Alleppey'],
      heroImage: 'https://images.pexels.com/photos/28368721/pexels-photo-28368721.jpeg?auto=compress&cs=tinysrgb&w=800',
    ),
    InspirationCollection(
      title: 'Cultural Explorations',
      description: 'Dive deep into royal heritage, ancient temples, and vibrant history.',
      icon: '🏛️',
      destinations: ['Jaipur', 'Varanasi', 'Hampi', 'Agra', 'Mysore', 'Khajuraho', 'Udaipur', 'Kolkata'],
      heroImage: 'https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=800',
    ),
    InspirationCollection(
      title: 'Wildlife Safaris',
      description: 'Spot majestic tigers, elephants, and wildlife in their natural habitat.',
      icon: '🐅',
      destinations: ['Ranthambore', 'Jim Corbett', 'Bandhavgarh', 'Kaziranga', 'Kanha', 'Gir', 'Wayanad'],
      heroImage: 'https://images.pexels.com/photos/145939/pexels-photo-145939.jpeg?auto=compress&cs=tinysrgb&w=800',
    ),
    InspirationCollection(
      title: 'Desert Escapes',
      description: 'Experience golden dunes, camel safaris, and starry desert skies.',
      icon: '🐪',
      destinations: ['Jaisalmer', 'Pushkar', 'Bikaner', 'Jodhpur', 'Barmer', 'Khimsar'],
      heroImage: 'https://images.pexels.com/photos/11029107/pexels-photo-11029107.jpeg?auto=compress&cs=tinysrgb&w=800',
    ),
  ];
}
