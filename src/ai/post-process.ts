import type { CostSummary, TripItinerary } from "@/types/itinerary";
import type { GenerateTripResponse } from "@/types/api";

export function postProcessItinerary(params: {
  itinerary: TripItinerary;
  costSummary: CostSummary;
  budgetUsd: number;
  promptVersion: string;
  durationMs: number;
}): GenerateTripResponse {
  const { itinerary, costSummary, budgetUsd, promptVersion, durationMs } = params;

  // Strict server-side recalculation to ensure math consistency:
  // lodging + food + activities + transport + misc = total
  const lodging = Math.max(0, Math.round(Number(costSummary.lodging) || 0));
  const food = Math.max(0, Math.round(Number(costSummary.food) || 0));
  const activities = Math.max(0, Math.round(Number(costSummary.activities) || 0));
  const transport = Math.max(0, Math.round(Number(costSummary.transport) || 0));
  const misc = Math.max(0, Math.round(Number(costSummary.misc) || 0));

  const total = lodging + food + activities + transport + misc;

  const normalizedCostSummary: CostSummary = {
    lodging,
    food,
    activities,
    transport,
    misc,
    total,
  };

  const budgetDelta = total - budgetUsd;
  const overBudget = total > budgetUsd;
  const warnings: string[] = [];

  if (overBudget) {
    warnings.push(
      `Estimated trip cost ($${total.toLocaleString()}) exceeds your planned budget of $${budgetUsd.toLocaleString()} by $${budgetDelta.toLocaleString()}.`
    );
  }

  return {
    itinerary,
    costSummary: normalizedCostSummary,
    meta: {
      promptVersion,
      budgetDelta,
      overBudget,
      warnings,
      placesEnriched: false,
      generationDurationMs: durationMs,
    },
  };
}
