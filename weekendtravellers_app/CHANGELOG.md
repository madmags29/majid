# Changelog

All notable changes to the **WeekendTravellers** mobile app will be documented in this file.

## [1.0.0] - 2026-10-22

### Added
- **Core Architecture**: Feature-based Clean Architecture with Riverpod state management and GoRouter declarative routing.
- **Brand Identity & Design Tokens**: Custom Material 3 theme inspired by modern travel editorial magazines.
  - Primary: Deep forest emerald (`#0F3E35`).
  - Secondary: Warm sand (`#F9F6F0`).
  - Accent: Sunset coral (`#FF6947`).
  - Complete Dark Theme (`#0C1311`) and Light Theme support.
- **Splash & Onboarding**:
  - Minimalist brand splash screen with subtle animation and auto-route detection.
  - 3-screen high-resolution editorial onboarding flow with Skip and Start Exploring actions.
- **City & GPS Location**:
  - Live GPS auto-detection with fallback to major Indian travel hubs (Delhi NCR, Mumbai, Bangalore, Jaipur, Chandigarh, Hyderabad, Kolkata, Pune).
  - Tappable modal location picker sheet.
- **Flagship Home Screen**:
  - Good morning / afternoon greeting with user name and location badge.
  - Conversational search bar.
  - Prominent "Plan My Weekend ✨" hero card.
  - Upcoming Indian long weekend detection banner with countdown and recommendations.
  - Horizontal discovery chips ("Nearby", "Under ₹5,000", "2 Days", "Couples ❤️", "Adventure ⛰️", "Mountains 🏔️", "Spiritual 🪔").
  - "Weekend escapes near you" horizontal cards with distance and travel time.
  - "Trending this weekend" and curated collections ("Perfect for couples ❤️", "Family escapes", "Mountain escapes").
- **Explore & OpenStreetMap**:
  - Dual List vs Map view toggle using `flutter_map` with interactive pins.
  - Multifaceted filters for distance (<100km, <200km, <300km, <500km) and budget (<₹3,000, <₹5,000, <₹10,000).
- **Destination Detail**:
  - Hero image viewport (~45%) with back, favorite, and share actions.
  - Why you'll love it editorial overview, weather & best time widget.
  - Verified attractions with ticket prices, hand-picked stays, top restaurants with must-try local specialties.
  - Sticky bottom "Plan This Trip ✨" CTA.
- **AI Weekend Planner Multi-Step Wizard**:
  - Progressive 6-step conversational flow: Origin -> Duration -> Budget -> Companions -> Vibe & Interests -> Transport & Travel Style.
  - Real-time animated AI generation progression with stage updates.
- **Trip Result & Management**:
  - Day-wise timeline tabs (Day 1, Day 2, Day 3) with activity cards, travel duration, and location pins.
  - Visual Smart Budget breakdown (Stay, Transport, Food, Activities, Tickets, Misc).
  - Checkable weekend packing list and trip checklist.
  - Deep-link sharing (`weekendtravellers.com/trip/{tripId}`) and Google Maps turn-by-turn navigation launch.
- **My Trips & Saved**:
  - Local caching with SharedPreferences for offline accessibility.
  - Save/delete trips and destinations.
- **Profile & Travel Personality**:
  - Travel personality badge generation ("Weekend Explorer 🌿").
  - Stats, travel preferences, theme mode toggle (Light/Dark/System), and support.
- **Conversational AI Assistant**:
  - "Ask WeekendTravellers AI" chat interface with quick suggestion chips.
- **Backend & Fallback Layer**:
  - Dio HTTP client with bearer authentication, timeouts, and error normalization.
  - Intelligent local database fallback so the app works seamlessly even offline.
- **Test Suite**:
  - Complete widget and domain tests passing with zero errors.
