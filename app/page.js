"use client";

import TopScorers from "@/components/scorers/TopScorers";
import UpcomingMatches from "@/components/matches/UpcomingMatches";
import Top3 from "@/components/Top 3/Top3";

export default function HomePage() {
  return (
    <main className="mt-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8 relative">
          {/* Explicitly set showFull to false */}
          <Top3 />
          <div className="absolute top-4 right-4">
          </div>
        </div>
        <TopScorers />
        <UpcomingMatches />
      </div>
    </main>
  );
}
