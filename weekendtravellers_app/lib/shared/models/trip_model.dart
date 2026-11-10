/// Complete Trip & Itinerary Model
class TripModel {
  final String id;
  final String title;
  final String destination;
  final String destinationSlug;
  final String origin;
  final String heroImage;
  final int durationDays;
  final String travellers; // Solo, Couple, Family, Friends
  final int totalBudget;
  final String transport;
  final List<String> interests;
  final String travelStyle;
  final String summary;
  final SmartBudget budget;
  final TripLogistics logistics;
  final List<ItineraryDay> days;
  final List<TripPackingItem> packingList;
  final DateTime createdAt;
  final DateTime startDate;
  final DateTime endDate;
  final bool isSaved;

  TripModel({
    required this.id,
    required this.title,
    required this.destination,
    required this.destinationSlug,
    required this.origin,
    required this.heroImage,
    required this.durationDays,
    required this.travellers,
    required this.totalBudget,
    required this.transport,
    required this.interests,
    required this.travelStyle,
    required this.summary,
    required this.budget,
    required this.logistics,
    required this.days,
    required this.packingList,
    required this.createdAt,
    required this.startDate,
    required this.endDate,
    this.isSaved = false,
  });

  TripModel copyWith({
    String? id,
    String? title,
    String? destination,
    String? destinationSlug,
    String? origin,
    String? heroImage,
    int? durationDays,
    String? travellers,
    int? totalBudget,
    String? transport,
    List<String>? interests,
    String? travelStyle,
    String? summary,
    SmartBudget? budget,
    TripLogistics? logistics,
    List<ItineraryDay>? days,
    List<TripPackingItem>? packingList,
    DateTime? createdAt,
    DateTime? startDate,
    DateTime? endDate,
    bool? isSaved,
  }) {
    return TripModel(
      id: id ?? this.id,
      title: title ?? this.title,
      destination: destination ?? this.destination,
      destinationSlug: destinationSlug ?? this.destinationSlug,
      origin: origin ?? this.origin,
      heroImage: heroImage ?? this.heroImage,
      durationDays: durationDays ?? this.durationDays,
      travellers: travellers ?? this.travellers,
      totalBudget: totalBudget ?? this.totalBudget,
      transport: transport ?? this.transport,
      interests: interests ?? this.interests,
      travelStyle: travelStyle ?? this.travelStyle,
      summary: summary ?? this.summary,
      budget: budget ?? this.budget,
      logistics: logistics ?? this.logistics,
      days: days ?? this.days,
      packingList: packingList ?? this.packingList,
      createdAt: createdAt ?? this.createdAt,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      isSaved: isSaved ?? this.isSaved,
    );
  }

  factory TripModel.fromJson(Map<String, dynamic> json) {
    return TripModel(
      id: json['id']?.toString() ?? json['_id']?.toString() ?? DateTime.now().millisecondsSinceEpoch.toString(),
      title: json['title'] ?? 'Weekend in ${json['destination'] ?? 'India'}',
      destination: json['destination'] ?? '',
      destinationSlug: json['destinationSlug'] ?? (json['destination']?.toString().toLowerCase().replaceAll(' ', '-') ?? ''),
      origin: json['origin'] ?? 'Delhi',
      heroImage: json['heroImage'] ?? '',
      durationDays: json['durationDays'] ?? (json['days'] as List?)?.length ?? 2,
      travellers: json['travellers'] ?? 'Couple',
      totalBudget: (json['totalBudget'] as num?)?.toInt() ?? 7500,
      transport: json['transport'] ?? 'Car',
      interests: List<String>.from(json['interests'] ?? []),
      travelStyle: json['travelStyle'] ?? 'Balanced',
      summary: json['summary'] ?? '',
      budget: SmartBudget.fromJson(json['budget'] ?? {}),
      logistics: TripLogistics.fromJson(json['logistics'] ?? {}),
      days: (json['days'] as List? ?? []).map((d) => ItineraryDay.fromJson(d)).toList(),
      packingList: (json['packingList'] as List? ?? [])
          .map((p) => TripPackingItem.fromJson(p))
          .toList(),
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : DateTime.now(),
      startDate: json['startDate'] != null ? DateTime.parse(json['startDate']) : DateTime.now().add(const Duration(days: 2)),
      endDate: json['endDate'] != null ? DateTime.parse(json['endDate']) : DateTime.now().add(const Duration(days: 4)),
      isSaved: json['isSaved'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'destination': destination,
      'destinationSlug': destinationSlug,
      'origin': origin,
      'heroImage': heroImage,
      'durationDays': durationDays,
      'travellers': travellers,
      'totalBudget': totalBudget,
      'transport': transport,
      'interests': interests,
      'travelStyle': travelStyle,
      'summary': summary,
      'budget': budget.toJson(),
      'logistics': logistics.toJson(),
      'days': days.map((d) => d.toJson()).toList(),
      'packingList': packingList.map((p) => p.toJson()).toList(),
      'createdAt': createdAt.toIso8601String(),
      'startDate': startDate.toIso8601String(),
      'endDate': endDate.toIso8601String(),
      'isSaved': isSaved,
    };
  }
}

class SmartBudget {
  final int transport;
  final int stay;
  final int food;
  final int activities;
  final int tickets;
  final int miscellaneous;
  final int total;
  final int perPerson;

  SmartBudget({
    required this.transport,
    required this.stay,
    required this.food,
    required this.activities,
    required this.tickets,
    required this.miscellaneous,
    required this.total,
    required this.perPerson,
  });

  factory SmartBudget.fromJson(Map<String, dynamic> json) {
    final t = (json['transport'] as num?)?.toInt() ?? 2000;
    final s = (json['stay'] as num?)?.toInt() ?? 2500;
    final f = (json['food'] as num?)?.toInt() ?? 1500;
    final a = (json['activities'] as num?)?.toInt() ?? 1000;
    final tk = (json['tickets'] as num?)?.toInt() ?? 300;
    final m = (json['miscellaneous'] as num?)?.toInt() ?? 200;
    final sum = t + s + f + a + tk + m;
    return SmartBudget(
      transport: t,
      stay: s,
      food: f,
      activities: a,
      tickets: tk,
      miscellaneous: m,
      total: (json['total'] as num?)?.toInt() ?? sum,
      perPerson: (json['perPerson'] as num?)?.toInt() ?? (sum ~/ 2),
    );
  }

  Map<String, dynamic> toJson() => {
    'transport': transport,
    'stay': stay,
    'food': food,
    'activities': activities,
    'tickets': tickets,
    'miscellaneous': miscellaneous,
    'total': total,
    'perPerson': perPerson,
  };
}

class TripLogistics {
  final String distance;
  final String travelTime;
  final String routeOverview;
  final String recommendedDeparture;
  final String returnDeparture;

  TripLogistics({
    required this.distance,
    required this.travelTime,
    required this.routeOverview,
    required this.recommendedDeparture,
    required this.returnDeparture,
  });

  factory TripLogistics.fromJson(Map<String, dynamic> json) {
    return TripLogistics(
      distance: json['distance'] ?? '250 km',
      travelTime: json['travelTime'] ?? '5h drive',
      routeOverview: json['routeOverview'] ?? 'NH-334 via Meerut Expressway',
      recommendedDeparture: json['recommendedDeparture'] ?? '06:00 AM Saturday',
      returnDeparture: json['returnDeparture'] ?? '04:00 PM Sunday',
    );
  }

  Map<String, dynamic> toJson() => {
    'distance': distance,
    'travelTime': travelTime,
    'routeOverview': routeOverview,
    'recommendedDeparture': recommendedDeparture,
    'returnDeparture': returnDeparture,
  };
}

class ItineraryDay {
  final int day;
  final String title;
  final String subtitle;
  final List<ItineraryActivity> activities;

  ItineraryDay({
    required this.day,
    required this.title,
    required this.subtitle,
    required this.activities,
  });

  factory ItineraryDay.fromJson(Map<String, dynamic> json) {
    return ItineraryDay(
      day: json['day'] ?? 1,
      title: json['title'] ?? 'Day ${json['day'] ?? 1}',
      subtitle: json['subtitle'] ?? '',
      activities: (json['activities'] as List? ?? [])
          .map((a) => ItineraryActivity.fromJson(a))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() => {
    'day': day,
    'title': title,
    'subtitle': subtitle,
    'activities': activities.map((a) => a.toJson()).toList(),
  };
}

class ItineraryActivity {
  final String time;
  final String title;
  final String description;
  final String location;
  final String imageUrl;
  final int estimatedCost;
  final String duration;
  final double? lat;
  final double? lng;

  ItineraryActivity({
    required this.time,
    required this.title,
    required this.description,
    required this.location,
    required this.imageUrl,
    required this.estimatedCost,
    required this.duration,
    this.lat,
    this.lng,
  });

  factory ItineraryActivity.fromJson(Map<String, dynamic> json) {
    return ItineraryActivity(
      time: json['time'] ?? '09:00 AM',
      title: json['title'] ?? json['name'] ?? '',
      description: json['description'] ?? '',
      location: json['location'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
      estimatedCost: (json['estimatedCost'] as num?)?.toInt() ?? 0,
      duration: json['duration'] ?? '1.5 hrs',
      lat: (json['lat'] as num?)?.toDouble(),
      lng: (json['lng'] as num?)?.toDouble(),
    );
  }

  Map<String, dynamic> toJson() => {
    'time': time,
    'title': title,
    'description': description,
    'location': location,
    'imageUrl': imageUrl,
    'estimatedCost': estimatedCost,
    'duration': duration,
    'lat': lat,
    'lng': lng,
  };
}

class TripPackingItem {
  final String item;
  final String category;
  bool isChecked;

  TripPackingItem({
    required this.item,
    required this.category,
    this.isChecked = false,
  });

  factory TripPackingItem.fromJson(Map<String, dynamic> json) {
    return TripPackingItem(
      item: json['item'] ?? '',
      category: json['category'] ?? 'Essentials',
      isChecked: json['isChecked'] ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
    'item': item,
    'category': category,
    'isChecked': isChecked,
  };
}
