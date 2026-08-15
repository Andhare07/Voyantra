import Link from "next/link";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/glass-card";

export default function HomePage() {
  return (
    <section className="page-container">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-balance">Your journey, intelligently planned</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Voyantra creates personalized day-by-day itineraries based on your
          destination, budget, travel style, and trip length.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild variant="accent" size="lg">
            <Link href="/sign-in">Plan your trip</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/sample">View sample itinerary</Link>
          </Button>
        </div>
      </div>
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          { title: "Tell us your trip", desc: "Destination, budget, days, and style." },
          { title: "AI builds your plan", desc: "Attractions, restaurants, hotels, and costs." },
          { title: "Save and revisit", desc: "Keep itineraries for when you travel." },
        ].map((step) => (
          <GlassCard key={step.title}>
            <h3 className="text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
