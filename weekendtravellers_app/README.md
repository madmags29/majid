# WeekendTravellers Mobile App

> **Your perfect weekend, planned by AI.**
> Production-ready cross-platform mobile application for [WeekendTravellers.com](https://weekendtravellers.com) built using Flutter, supporting both **Android** and **iOS** from a single codebase.

---

## 🌟 Overview & Proposition

WeekendTravellers empowers users to discover hidden and popular getaways near their city and instantly create personalized 1–3 day itineraries in under 60 seconds.

### Key Highlights
- **India-First Discovery Hub**: Tailored for Delhi NCR, Mumbai, Bangalore, Jaipur, Chandigarh, Hyderabad, Kolkata, Pune and all major Indian hubs with accurate drive times, road routes and Indian rupee (₹) pricing.
- **Multi-Step AI Trip Planner**: Guided conversational flow configuring starting city, duration (1–3 days), budget, companions (Solo, Couple, Family, Friends), vibes/interests, and transportation mode.
- **Dynamic AI Generation Engine**: Shows animated real-time progress while generating day-wise timelines, smart budget breakdowns, weather alerts, and packing lists.
- **Interactive OpenStreetMap**: OpenStreetMap integration via `flutter_map` with interactive markers, destination pins, and Google Maps external navigation.
- **Offline First**: All curated destinations, saved trips, and offline packing checklists remain accessible even without active internet connectivity.
- **Editorial Brand Design System**: Custom Material 3 theme inspired by modern travel magazines, deep emerald forest (`#0F3E35`), warm sand, and sunset coral (`#FF6947`) with full Light & Dark mode support.

---

## 📱 Architecture & Folder Structure

Built using feature-based **Clean Architecture** with **Riverpod**:

```text
weekendtravellers_app/
├── android/                   # Native Android host configuration
├── ios/                       # Native iOS host configuration
├── assets/                    # Assets (images, icons, .env)
├── lib/
│   ├── core/
│   │   ├── constants/         # AppColors, AppConstants
│   │   ├── network/           # ApiClient (Dio with token injection & logging)
│   │   ├── storage/           # LocalStorageService (SharedPreferences)
│   │   ├── theme/             # AppTheme (Material 3, GoogleFonts, light & dark)
│   │   └── utils/             # CurrencyFormatter (₹ INR), DateFormatter
│   ├── features/
│   │   ├── ai_chat/           # Conversational AI travel assistant
│   │   ├── destination/       # Destination detail screen & attractions/stays
│   │   ├── explore/           # Search, filters (<100km, <₹5K), Map/List toggle
│   │   ├── home/              # Discovery home, Near You, Collections, Long Weekend alert
│   │   ├── itinerary/         # Trip details, timeline cards, packing checklist
│   │   ├── my_trips/          # Upcoming & past trips management
│   │   ├── onboarding/        # Splash screen & 3-step visual onboarding
│   │   ├── profile/           # Travel personality badge ("Weekend Explorer 🌿"), settings
│   │   ├── saved/             # Saved destinations & trips
│   │   └── trip_planner/      # 6-step AI weekend planner & live generation
│   ├── routing/               # AppRouter (GoRouter with deep links)
│   ├── shared/
│   │   ├── data/              # CuratedDestinationsData (Rishikesh, Jaipur, Agra, Manali...)
│   │   ├── models/            # DestinationModel, TripModel, ItineraryDay, SmartBudget
│   │   ├── providers/         # Riverpod Notifiers (Location, Theme, Saved, Filter)
│   │   └── widgets/           # WTButton, WTDestinationCard, WTSearchBar, WTWeatherCard, WTBudgetCard...
│   └── main.dart              # App entrypoint
├── test/                      # Unit & Widget tests
├── .env                       # Environment configuration
├── .env.example
├── analysis_options.yaml
└── pubspec.yaml
```

---

## 🚀 Getting Started

### Prerequisites
- Flutter SDK `^3.13.0` (Dart `^3.0.0`)
- Android Studio / Xcode

### Installation
```bash
# Clone the repository and navigate to the flutter app
cd weekendtravellers_app

# Fetch dependencies
flutter pub get

# Run analyzer
flutter analyze

# Run test suite
flutter test

# Run application on simulator or connected device
flutter run
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Variables:
```ini
API_BASE_URL=https://api.weekendtravellers.com
LOCAL_API_BASE_URL=http://localhost:5000/api
APP_ENV=development
WEBSITE_URL=https://weekendtravellers.com
```

---

## 🗺️ Deep Linking

Supports universal and deep links matching the web application:
- `weekendtravellers.com/weekend-trips/:slug` -> Destination Detail
- `weekendtravellers.com/trip/:id` -> Itinerary View

---

## 🛡️ License

Copyright © 2026 WeekendTravellers. All rights reserved.
