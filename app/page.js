"use client";

import TopScorers from "@/components/scorers/TopScorers";
import UpcomingMatches from "@/components/matches/UpcomingMatches";
import Top3 from "@/components/Top 3/Top3";
import { useCompetition } from "@/components/CompetitionProvider";
import { useSeason } from "@/components/SeasonProvider";

export default function HomePage() {
  const { selectedCompetition } = useCompetition();
  const { selectedSeason } = useSeason();

  if (!selectedSeason) {
    return (
      <div className="container mx-auto px-2  py-10 flex justify-center font-semibold font-montserrat">
        <div className="bg-white rounded-[14px] w-full md:w-[50rem] p-4">
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 font-montserrat">
              Select a Season
            </h3>
            <p className="text-gray-500 font-montserrat">
              Please select a season to view the overview.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedCompetition) {
    return (
      <div className="container mx-auto px-2 py-6 flex justify-center font-semibold font-montserrat">
        <div className="bg-white rounded-[14px] w-full md:w-[50rem] p-4">
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 font-montserrat">
              Select a Competition
            </h3>
            <p className="text-gray-500 font-montserrat">
              Please select a competition from the dropdown in the navigation to view the overview.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 flex justify-center font-semibold font-montserrat">
      <div className=" rounded-[14px]  w-full md:w-[50rem] p-2">
        <div className="mb-8 relative">
          {/* Explicitly set showFull to false */}
          <Top3 />
          <div className="absolute top-4 right-4">
          </div>
        </div>
        <TopScorers />
        <UpcomingMatches />
      </div>
    </div>
  );
}
