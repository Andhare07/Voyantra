"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Compass, Loader2 } from "lucide-react";

import { TripForm } from "@/components/trips/trip-form";
import { ItineraryView } from "@/components/itinerary/itinerary-view";
import { GlassCard } from "@/components/shared/glass-card";
import type {
  GenerateTripRequest,
  GenerateTripResponse,
  CreateTripRequest,
  CreateTripResponse,
  ApiErrorResponse,
} from "@/types/api";

export default function NewTripPage() {
  const router = useRouter();

  const [formValues, setFormValues] = useState<GenerateTripRequest | null>(null);
  const [generatedData, setGeneratedData] =
    useState<GenerateTripResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string[]>([]);

  // Step 1: Handle AI Itinerary Generation
  const handleGenerate = async (request: GenerateTripRequest) => {
    setIsLoading(true);
    setErrorMessage(null);
    setErrorDetails([]);
    setFormValues(request);

    try {
      const response = await fetch("/api/trips/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as ApiErrorResponse;
        const mainMsg =
          errorData.error?.message || "Failed to generate itinerary. Please try again.";
        setErrorMessage(mainMsg);

        if (errorData.error?.details && errorData.error.details.length > 0) {
          setErrorDetails(
            errorData.error.details.map((d) =>
              d.field ? `${d.field}: ${d.message}` : d.message
            )
          );
        }
        return;
      }

      setGeneratedData(data as GenerateTripResponse);
    } catch (err) {
      console.error("Error submitting trip generation request:", err);
      setErrorMessage("Network error occurred. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Handle Persisting Trip to Supabase
  const handleSaveTrip = async () => {
    if (!generatedData || !formValues) return;

    setIsSaving(true);
    setErrorMessage(null);
    setErrorDetails([]);

    try {
      const payload: CreateTripRequest = {
        destination: formValues.destination,
        budgetUsd: formValues.budgetUsd,
        days: formValues.days,
        travelStyle: formValues.travelStyle,
        interests: formValues.interests,
        title: `${formValues.destination} — ${formValues.days} ${
          formValues.days === 1 ? "day" : "days"
        }`,
        itinerary: generatedData.itinerary,
        costSummary: generatedData.costSummary,
        promptVersion: generatedData.meta.promptVersion || "itinerary-v1",
      };

      const response = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as ApiErrorResponse;
        setErrorMessage(
          errorData.error?.message || "Failed to save trip to your account."
        );
        return;
      }

      const createdTrip = data as CreateTripResponse;
      if (createdTrip.trip?.id) {
        router.push(`/trips`);
      } else {
        router.push("/trips");
      }
    } catch (err) {
      console.error("Error saving trip:", err);
      setErrorMessage("Network error occurred while saving. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Global Error Banner */}
      {errorMessage && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-destructive shadow-sm animate-in fade-in-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <p className="font-semibold">{errorMessage}</p>
              {errorDetails.length > 0 && (
                <ul className="list-inside list-disc space-y-0.5 text-xs">
                  {errorDetails.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay / Progress state */}
      {isLoading && (
        <GlassCard className="p-8 text-center space-y-4 animate-pulse">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ocean/10 text-ocean">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground">
              Synthesizing Your Custom Itinerary
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Our AI engine is balancing activities, dining, and hotel recommendations to match your target budget.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-medium text-ocean bg-surface px-3 py-1 rounded-full border border-mist/30">
            <Compass className="h-3.5 w-3.5 animate-spin" />
            Crafting daily schedule...
          </div>
        </GlassCard>
      )}

      {/* State A: Form Input */}
      {!generatedData && !isLoading && (
        <TripForm
          onSubmit={handleGenerate}
          isLoading={isLoading}
          initialValues={formValues || undefined}
        />
      )}

      {/* State B: Generated Itinerary Preview */}
      {generatedData && formValues && !isLoading && (
        <ItineraryView
          data={generatedData}
          originalRequest={formValues}
          onSave={handleSaveTrip}
          onEdit={() => setGeneratedData(null)}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
