import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/currency_formatter.dart';
import '../models/trip_model.dart';

/// Visual Smart Budget Card with category breakdown bars
class WTBudgetCard extends StatelessWidget {
  final SmartBudget budget;

  const WTBudgetCard({
    super.key,
    required this.budget,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
        borderRadius: BorderRadius.circular(AppTheme.radiusExtraLarge),
        border: Border.all(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
          width: 1,
        ),
        boxShadow: AppTheme.softShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Estimated Trip Budget',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      color: isDark ? AppColors.textMutedDark : AppColors.textSecondaryLight,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    CurrencyFormatter.formatInr(budget.total),
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.w800,
                      color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                      letterSpacing: -0.5,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: AppColors.primaryContainer.withOpacity(0.6),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  '${CurrencyFormatter.formatInr(budget.perPerson)} / person',
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: AppColors.onPrimaryContainer,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Stacked Horizontal Proportion Bar
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: SizedBox(
              height: 10,
              child: Row(
                children: [
                  Expanded(flex: budget.stay, child: Container(color: AppColors.primary)),
                  Expanded(flex: budget.transport, child: Container(color: AppColors.accent)),
                  Expanded(flex: budget.food, child: Container(color: Colors.amber.shade600)),
                  Expanded(flex: budget.activities, child: Container(color: Colors.teal.shade400)),
                  Expanded(flex: budget.miscellaneous + budget.tickets, child: Container(color: Colors.purple.shade400)),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Category items
          _buildBudgetItem(context, 'Stay / Hotels', budget.stay, AppColors.primary, Icons.hotel_rounded),
          _buildBudgetItem(context, 'Travel & Fuel', budget.transport, AppColors.accent, Icons.directions_car_rounded),
          _buildBudgetItem(context, 'Food & Cafes', budget.food, Colors.amber.shade700, Icons.restaurant_rounded),
          _buildBudgetItem(context, 'Sightseeing & Thrills', budget.activities, Colors.teal.shade500, Icons.local_activity_rounded),
          _buildBudgetItem(context, 'Tickets & Misc', budget.tickets + budget.miscellaneous, Colors.purple.shade400, Icons.confirmation_number_rounded),
        ],
      ),
    );
  }

  Widget _buildBudgetItem(BuildContext context, String title, int amount, Color color, IconData icon) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: color.withOpacity(0.12),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, size: 14, color: color),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              title,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: isDark ? AppColors.textSecondaryDark : AppColors.textPrimaryLight,
              ),
            ),
          ),
          Text(
            CurrencyFormatter.formatInr(amount),
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
            ),
          ),
        ],
      ),
    );
  }
}
