"use client";

import React, { useState } from "react";
import {
  Bookmark,
  Calendar,
  Clock,
  DollarSign,
  Hotel as HotelIcon,
  MapPin,
  Utensils,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Star,
  Compass,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/glass-card";
import type { GenerateTripResponse, GenerateTripRequest } from "@/types/api";

interface ItineraryViewProps {
  data: GenerateTripResponse;
  originalRequest: GenerateTripRequest;
  onSave: () => Promise<void>;
  onEdit: () => void;
  isSaving: boolean;
}

export function ItineraryView({
  data,
  originalRequest,
  onSave,
  onEdit,
  isSaving,
}: ItineraryViewProps) {
  const { itinerary, costSummary, meta } = data;
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const currentDayPlan =
    itinerary.days.find((d) => d.dayNumber === selectedDay) || itinerary.days[0];

  const isUnderBudget = !meta.overBudget && meta.budgetDelta <= 0;
  const absDelta = Math.abs(meta.budgetDelta);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 slide-in-from-bottom-2 duration-300 min-w-0">
      {/* Top Banner & Primary Actions */}
      <GlassCard className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2 min-w-0">
            <div className="inline-flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-ocean/10 px-2.5 sm:px-3 py-0.5 sm:py-1 text-xs font-semibold uppercase tracking-wider text-ocean">
                <Compass className="h-3.5 w-3.5 shrink-0" />
                {originalRequest.travelStyle} Style
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 sm:px-3 py-0.5 sm:py-1 text-xs font-medium text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                {originalRequest.days} {originalRequest.days === 1 ? "Day" : "Days"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground break-words">
              {itinerary.destination}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Personalized AI itinerary preview curated for a planned budget of $
              {originalRequest.budgetUsd.toLocaleString()} USD.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={onEdit}
              disabled={isSaving}
              className="w-full sm:w-auto gap-2 justify-center"
            >
              <ArrowLeft className="h-4 w-4" />
              Modify Inputs
            </Button>
            <Button
              type="button"
              variant="accent"
              onClick={onSave}
              disabled={isSaving}
              className="w-full sm:w-auto gap-2 shadow-[var(--shadow-soft)] font-semibold justify-center"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Trip...
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4" />
                  Save to My Trips
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Budget Comparison Metric Strip */}
        <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-4 border-t border-border/70 pt-4 sm:pt-6 sm:grid-cols-4">
          <div className="space-y-0.5 sm:space-y-1 min-w-0">
            <p className="text-[11px] sm:text-xs text-muted-foreground">Planned Budget</p>
            <p className="text-lg sm:text-xl font-bold tabular-nums text-foreground truncate">
              ${originalRequest.budgetUsd.toLocaleString()}
            </p>
          </div>

          <div className="space-y-0.5 sm:space-y-1 min-w-0">
            <p className="text-[11px] sm:text-xs text-muted-foreground">Estimated Total</p>
            <p className="text-lg sm:text-xl font-bold tabular-nums text-ocean truncate">
              ${costSummary.total.toLocaleString()}
            </p>
          </div>

          <div className="space-y-0.5 sm:space-y-1 min-w-0">
            <p className="text-[11px] sm:text-xs text-muted-foreground">Budget Variance</p>
            <div className="flex items-center gap-1 sm:gap-1.5">
              {isUnderBudget ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-emerald-600 truncate">
                    ${absDelta.toLocaleString()} under
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-coral shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-coral truncate">
                    ${absDelta.toLocaleString()} over
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-0.5 sm:space-y-1 min-w-0">
            <p className="text-[11px] sm:text-xs text-muted-foreground">Generation Time</p>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
              {meta.generationDurationMs
                ? `${(meta.generationDurationMs / 1000).toFixed(1)}s`
                : "AI Verified"}
            </p>
          </div>
        </div>

        {/* Over-budget or custom warnings */}
        {meta.warnings && meta.warnings.length > 0 && (
          <div className="mt-4 rounded-xl border border-coral/30 bg-coral/5 p-3 text-xs text-coral-light font-medium space-y-1">
            {meta.warnings.map((w, idx) => (
              <p key={idx} className="flex items-center gap-1.5 break-words">
                <AlertTriangle className="h-4 w-4 shrink-0 text-coral" />
                <span>{w}</span>
              </p>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Main Content Layout: Day-by-Day Timeline + Cost Summary */}
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Day Navigation & Activity Timeline */}
        <div className="space-y-6 lg:col-span-2 min-w-0">
          {/* Day Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {itinerary.days.map((day) => {
              const isCurrent = day.dayNumber === selectedDay;
              return (
                <button
                  key={day.dayNumber}
                  type="button"
                  onClick={() => setSelectedDay(day.dayNumber)}
                  className={`flex shrink-0 items-center gap-1.5 sm:gap-2 rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                    isCurrent
                      ? "bg-ocean text-white shadow-md"
                      : "border border-border bg-white/80 text-muted-foreground hover:bg-white hover:text-foreground"
                  }`}
                >
                  <span>Day {day.dayNumber}</span>
                </button>
              );
            })}
          </div>

          {/* Current Day Content */}
          {currentDayPlan && (
            <div className="space-y-6 min-w-0">
              {/* Day Theme Title */}
              {currentDayPlan.theme && (
                <div className="rounded-xl border border-border bg-white/50 px-3.5 sm:px-4 py-2.5 sm:py-3">
                  <h3 className="text-sm sm:text-base font-semibold text-ocean break-words">
                    Day {currentDayPlan.dayNumber}: {currentDayPlan.theme}
                  </h3>
                </div>
              )}

              {/* Day Activities */}
              <div className="space-y-3.5 sm:space-y-4">
                <h4 className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-ocean shrink-0" />
                  Scheduled Activities
                </h4>

                <div className="space-y-3">
                  {currentDayPlan.slots.map((slot, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-border bg-white/80 p-3.5 sm:p-4 shadow-sm transition-all hover:bg-white min-w-0"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <span className="rounded-md bg-mist/20 px-2 py-0.5 text-[11px] font-semibold uppercase text-ocean">
                              {slot.period}
                            </span>
                            {slot.activity.durationHours && (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 shrink-0" />
                                {slot.activity.durationHours}h
                              </span>
                            )}
                          </div>
                          <h5 className="text-sm sm:text-base font-semibold text-foreground break-words">
                            {slot.activity.name}
                          </h5>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed break-words">
                            {slot.activity.description}
                          </p>
                          {slot.activity.location && (
                            <p className="flex items-center gap-1 text-xs text-slate pt-1 break-words">
                              <MapPin className="h-3 w-3 text-mist shrink-0" />
                              <span className="break-words">{slot.activity.location}</span>
                            </p>
                          )}
                        </div>

                        <div className="shrink-0 text-right">
                          <span className="inline-block rounded-lg bg-surface px-2 sm:px-2.5 py-1 text-xs font-bold tabular-nums text-ocean">
                            {slot.activity.estimatedCostUSD === 0
                              ? "Free"
                              : `$${slot.activity.estimatedCostUSD}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dining & Meals for this day */}
              <div className="space-y-3.5 sm:space-y-4 pt-2">
                <h4 className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  <Utensils className="h-4 w-4 text-ocean shrink-0" />
                  Culinary Recommendations
                </h4>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {currentDayPlan.meals.map((meal, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col justify-between rounded-2xl border border-border bg-white/80 p-3.5 sm:p-4 shadow-sm min-w-0"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold uppercase text-coral">
                            {meal.type}
                          </span>
                          <span className="text-xs font-bold tabular-nums text-foreground">
                            ${meal.restaurant.estimatedCostUSD}
                          </span>
                        </div>
                        <h6 className="font-semibold text-xs sm:text-sm text-foreground leading-snug break-words">
                          {meal.restaurant.name}
                        </h6>
                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed break-words">
                          {meal.restaurant.description}
                        </p>
                      </div>

                      {meal.restaurant.cuisine && (
                        <p className="mt-2 text-[11px] text-slate italic break-words">
                          {meal.restaurant.cuisine}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recommended Hotels Section */}
          {itinerary.hotels && itinerary.hotels.length > 0 && (
            <div className="space-y-3.5 sm:space-y-4 pt-4">
              <h4 className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">
                <HotelIcon className="h-4 w-4 text-ocean shrink-0" />
                Recommended Accommodations
              </h4>

              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                {itinerary.hotels.map((hotel, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-between rounded-2xl border border-border bg-white/80 p-3.5 sm:p-4 shadow-sm min-w-0"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-md bg-ocean/10 px-2 py-0.5 text-[11px] font-semibold uppercase text-ocean">
                          {hotel.priceTier || "Recommended"}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                          {hotel.rating && (
                            <>
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                              <span>{hotel.rating}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <h5 className="mt-2 text-sm sm:text-base font-semibold text-foreground break-words">
                        {hotel.name}
                      </h5>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed break-words">
                        {hotel.description}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                      <span className="text-xs text-muted-foreground">
                        Estimated / night
                      </span>
                      <span className="text-sm font-bold tabular-nums text-ocean">
                        ${hotel.estimatedCostUSD}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Column: Sticky Estimated Cost Breakdown Card */}
        <div className="space-y-6 lg:col-span-1 min-w-0">
          <GlassCard className="p-4 sm:p-6 space-y-5 sm:space-y-6 lg:sticky lg:top-20">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                Estimated Cost Breakdown
              </h3>
              <p className="text-xs text-muted-foreground">
                Estimated USD totals across all {originalRequest.days} days.
              </p>
            </div>

            <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground flex items-center gap-2 truncate">
                  <HotelIcon className="h-4 w-4 text-mist shrink-0" />
                  Lodging
                </span>
                <span className="font-semibold tabular-nums">
                  ${costSummary.lodging.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground flex items-center gap-2 truncate">
                  <Utensils className="h-4 w-4 text-mist shrink-0" />
                  Food & Dining
                </span>
                <span className="font-semibold tabular-nums">
                  ${costSummary.food.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground flex items-center gap-2 truncate">
                  <Sparkles className="h-4 w-4 text-mist shrink-0" />
                  Activities & Tours
                </span>
                <span className="font-semibold tabular-nums">
                  ${costSummary.activities.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground flex items-center gap-2 truncate">
                  <MapPin className="h-4 w-4 text-mist shrink-0" />
                  Local Transport
                </span>
                <span className="font-semibold tabular-nums">
                  ${costSummary.transport.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground flex items-center gap-2 truncate">
                  <DollarSign className="h-4 w-4 text-mist shrink-0" />
                  Miscellaneous
                </span>
                <span className="font-semibold tabular-nums">
                  ${costSummary.misc.toLocaleString()}
                </span>
              </div>

              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between text-sm sm:text-base">
                  <span className="font-bold text-foreground">Estimated Total</span>
                  <span className="font-bold text-ocean tabular-nums">
                    ${costSummary.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="button"
                variant="accent"
                size="lg"
                onClick={onSave}
                disabled={isSaving}
                className="w-full gap-2 font-semibold shadow-[var(--shadow-soft)] min-h-[44px] justify-center"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving Trip...
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" />
                    Save This Itinerary
                  </>
                )}
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
