class FaqItem {
  final String question;
  final String answer;

  const FaqItem({required this.question, required this.answer});
}

class FaqCategory {
  final String category;
  final String icon;
  final List<FaqItem> items;

  const FaqCategory({
    required this.category,
    required this.icon,
    required this.items,
  });
}

class FaqData {
  FaqData._();

  static const List<FaqCategory> categories = [
    FaqCategory(
      category: 'General Information',
      icon: 'help_outline',
      items: [
        FaqItem(
          question: 'What is weekendtravellers.com and how does it help me?',
          answer: 'Weekendtravellers.com is an advanced AI-powered travel assistant meticulously designed for planning high-impact 2 to 4-day getaways. We solve the problem of "planning fatigue" by analyzing thousands of data points—from transit logistics to local weather—to give you a cohesive, expert-level itinerary in seconds. Our goal is to make every weekend feel like a luxury vacation.',
        ),
        FaqItem(
          question: 'How does the smart AI trip planner work for 2026?',
          answer: 'Our engine utilizes Large Language Models (LLMs) combined with real-time travel parameters. When you enter a destination, the AI cross-references current travel trends, popular hotspots, and hidden local secrets to create a balanced plan. It considers "vibe" matches, geographical proximity of activities, and optimal meal timings to ensure a stress-free experience.',
        ),
      ],
    ),
    FaqCategory(
      category: 'Planning & Customization',
      icon: 'explore',
      items: [
        FaqItem(
          question: 'Can I customize the generated AI itineraries?',
          answer: 'Absolutely. We understand that travel is personal. Once an itinerary is generated, you can use our built-in AI chat interface to request granular changes. For example, you can say "Add more kid-friendly spots", "Switch to a luxury budget", or "Make this more outdoorsy". The AI will instantly restructure your plan while maintaining logistical integrity.',
        ),
        FaqItem(
          question: 'What kind of travel logistics are included?',
          answer: 'Every itinerary includes suggested transport between points, walking/driving distances, and estimated costs. We also provide "Best Time to Start" suggestions for each day to help you avoid peak crowds at popular attractions.',
        ),
        FaqItem(
          question: 'How do I book the suggested hotels or activities?',
          answer: 'We connect directly to trusted partners like Agoda and Hotellook. Every hotel suggestion comes with real-time pricing and availability. We don\'t charge any extra fees, ensuring you always get the best market rates.',
        ),
      ],
    ),
    FaqCategory(
      category: 'Trust & Reliability',
      icon: 'shield',
      items: [
        FaqItem(
          question: 'Are the itineraries up to date for 2026?',
          answer: 'We prioritize current data. Our model is trained to recognize seasonal variations and current travel norms for 2026. While we recommend double-checking specific opening hours for very small local businesses, our primary attraction data is updated regularly.',
        ),
        FaqItem(
          question: 'Why should I create an account?',
          answer: 'An account acts as your digital travel vault. You can save unlimited itineraries, share them with friends via private links, and access your plans offline through our mobile-responsive interface. It also allows the AI to learn your preferences over time for even better recommendations.',
        ),
        FaqItem(
          question: 'How do you handle my personal data?',
          answer: 'Security and privacy are at our core. We use industry-standard encryption for all user data and never sell your personal information to third-party ad networks.',
        ),
      ],
    ),
    FaqCategory(
      category: 'Cost & Usage',
      icon: 'credit_card',
      items: [
        FaqItem(
          question: 'Is weekendtravellers.com really free to use?',
          answer: 'Yes, the core planning engine, AI chat customization, and itinerary saving features are completely free for our users. We strive to provide the best travel planning experience without any paywalls or hidden subscriptions for the basic traveler.',
        ),
        FaqItem(
          question: 'Do you offer premium or group planning?',
          answer: 'Currently, our standard service is robust enough for all types of weekend travel. We are exploring advanced group-syncing features for late 2026, which will allow multiple users to edit a single plan in real-time.',
        ),
      ],
    ),
  ];
}
