import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';

/// About Us Screen matching weekendtravellers.com/about
class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('About Us'),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/home');
            }
          },
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(20, 16, 20, 40),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Title Header
            Text(
              'OUR STORY',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: AppColors.accent,
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Redefining Weekend Travel',
              style: TextStyle(
                fontSize: 26,
                fontWeight: FontWeight.w900,
                color: isDark ? Colors.white : Colors.black87,
                letterSpacing: -0.6,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Redefining the way you experience short getaways through the power of Artificial Intelligence and local passion.',
              style: TextStyle(
                fontSize: 14,
                height: 1.5,
                color: isDark ? Colors.white70 : Colors.black54,
              ),
            ),

            const SizedBox(height: 24),

            // The Problem We Solve
            _buildSectionCard(
              title: 'The Problem We Solve',
              content: 'Planning a 2-week vacation is exciting, but planning a 2-day weekend getaway often feels like more work than it\'s worth. Between finding the right destination, coordinating travel timings, and vetting restaurant reviews, hours are wasted on research.\n\nIn 2024, a group of dedicated travelers and data scientists asked: "What if you could plan a perfect weekend in under 60 seconds?" That question led to the birth of Weekend Travellers.',
              isDark: isDark,
              borderColor: AppColors.primary,
            ),

            const SizedBox(height: 20),

            // Mission & Vision Dual Cards
            Row(
              children: [
                Expanded(
                  child: _buildMiniCard(
                    icon: Icons.public,
                    title: 'Our Mission',
                    desc: 'To democratize travel planning. We believe everyone deserves a rejuvenating break without the administrative burden.',
                    isDark: isDark,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildMiniCard(
                    icon: Icons.favorite,
                    title: 'Our Vision',
                    desc: 'To become the world\'s most trusted travel companion for spontaneous, stress-free micro-vacations.',
                    isDark: isDark,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // E-E-A-T Section
            _buildSectionCard(
              title: 'Why Trust Us? (E-E-A-T Methodology)',
              content: 'In 2026, the internet is flooded with unverified travel lists and automated content. At Weekend Travellers, we strictly adhere to Google\'s E-E-A-T guidelines (Experience, Expertise, Authoritativeness, and Trustworthiness).\n\nWe don\'t just generate text; we curate verified, actionable experiences. Our AI engine is trained on thousands of hours of local travel journalism, user-verified reviews, and real-time transit data.',
              isDark: isDark,
              borderColor: AppColors.accent,
            ),

            const SizedBox(height: 20),

            // Data Sourcing & Editorial
            _buildSectionCard(
              title: 'Algorithmic Transparency & Human Curation',
              content: 'Our engine uses a proprietary "Weekend Viability" ranking score. It scores factors such as airport/highway proximity to downtown cores, density of top-rated local dining, and average transit time versus exploration time.\n\nWhile AI provides the data backbone, our destination editors regularly audit itineraries to ensure recommendations are authentic, safe, and culturally respectful.',
              isDark: isDark,
              borderColor: const Color(0xFF2DD4BF),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionCard({
    required String title,
    required String content,
    required bool isDark,
    required Color borderColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF14201D) : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: isDark ? const Color(0xFF1F352F) : const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(width: 4, height: 18, color: borderColor),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  title,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: isDark ? Colors.white : Colors.black87,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            content,
            style: TextStyle(
              fontSize: 13,
              height: 1.6,
              color: isDark ? Colors.white70 : Colors.black87,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMiniCard({
    required IconData icon,
    required String title,
    required String desc,
    required bool isDark,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF14201D) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: isDark ? const Color(0xFF1F352F) : const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: AppColors.primary, size: 24),
          const SizedBox(height: 8),
          Text(
            title,
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w800,
              color: isDark ? Colors.white : Colors.black87,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            desc,
            style: TextStyle(
              fontSize: 12,
              height: 1.4,
              color: isDark ? Colors.white60 : Colors.black54,
            ),
          ),
        ],
      ),
    );
  }
}
