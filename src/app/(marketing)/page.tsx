import Link from "next/link";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/glass-card";

export default function HomePage() {
  return (
    <section className="page-container">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-balance text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          Your journey, intelligently planned
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground">
          Voyantra creates personalized day-by-day itineraries based on your
          destination, budget, travel style, and trip length.
        </p>
        <div className="mt-8 flex flex-col items-stretch sm:items-center justify-center gap-3 sm:flex-row max-w-xs sm:max-w-none mx-auto">
          <Button asChild variant="accent" size="lg" className="w-full sm:w-auto">
            <Link href="/sign-in">Plan your trip</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/sample">View sample itinerary</Link>
          </Button>
        </div>
      </div>
      <div className="mt-12 sm:mt-16 grid gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3">
        {[
          { title: "Tell us your trip", desc: "Destination, budget, days, and style." },
          { title: "AI builds your plan", desc: "Attractions, restaurants, hotels, and costs." },
          { title: "Save and revisit", desc: "Keep itineraries for when you travel." },
        ].map((step) => (
          <GlassCard key={step.title} className="p-5 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">{step.desc}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
