"use client";

import { useEffect, useState } from "react";
import { MatchCard } from "@/components/MatchCard";
import CupStages from "@/components/CupStages";
import { fetchFixtures as fetchAllFixtures } from "@/lib/fetchFixtures";
import { useSeason } from "@/components/SeasonProvider";
import { useCompetition } from "@/components/CompetitionProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Load from "@/assets/logo.png";
import Image from "next/image";
import "@/styles/scrollbar.css";

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState([]);
  const [selectedRound, setSelectedRound] = useState("Round 1");
  const [loading, setLoading] = useState(true);
  const { selectedSeason } = useSeason();
  const { selectedCompetition } = useCompetition();

  useEffect(() => {
    if (!selectedSeason?._id || !selectedCompetition?._id) {
      return;
    }

    const getFixtures = async () => {
      setLoading(true);
      try {
        const result = await fetchAllFixtures(
          selectedSeason._id,
          selectedCompetition._id
        );
        setFixtures(result);
        setSelectedRound("Round 1");
      } catch (err) {
        console.error("Failed to fetch fixtures:", err);
      } finally {
        setLoading(false);
      }
    };

    getFixtures();
  }, [selectedSeason, selectedCompetition]);

  useEffect(() => {
    setSelectedRound("Round 1");
  }, [selectedSeason, selectedCompetition]);

  const allRounds = [...new Set(fixtures.map((f) => f.round))].sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ''));
    const numB = parseInt(b.replace(/\D/g, ''));
    return numA - numB;
  });
  const filteredMatches = fixtures.filter((m) => m.round === selectedRound);

  if (!selectedSeason) {
    return (
      <div className="container mx-auto px-4 py-15 flex justify-center font-semibold font-montserrat">
        <div className="bg-white rounded-[14px] w-full md:w-[50rem] p-4">
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 font-montserrat">
              Select a Season
            </h3>
            <p className="text-gray-500 font-montserrat">
              Please select a season to view fixtures.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedCompetition) {
    return (
      <div className="container mx-auto px-4 py-15 flex justify-center font-semibold font-montserrat">
        <div className="bg-white rounded-[14px] w-full md:w-[50rem] p-4">
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 font-montserrat">
              Select a Competition
            </h3>
            <p className="text-gray-500 font-montserrat">
              Please select a competition from the dropdown in the navigation to view its fixtures.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show CupStages component for cup competitions
  if (selectedCompetition.type === 'cup') {
    return (
      <div className="container mx-auto px-4 py-15 flex justify-center font-semibold font-montserrat">
        <div className="bg-white rounded-[14px] w-full md:w-[50rem] p-4">
          <CupStages />
        </div>
      </div>
    );
  }

  // Regular fixtures view for league and other competitions
  return (
    <div className="container mx-auto px-4 py-15 flex justify-center font-semibold font-montserrat">
      <div className="bg-white rounded-[14px] w-full md:w-[50rem] p-4">
        <div className="flex justify-center items-center mt-10 mb-10">
          <DropdownMenu className="">
            <DropdownMenuTrigger className="px-5 py-1 bg-white text-[#36053A]/80 rounded-md border focus:outline-none hover:bg-gray-200 text-sm font-montserrat">
              {selectedRound || "Select Round"}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white rounded-md border border-[#36053A]/40 max-h-[320px] overflow-y-auto custom-scrollbar smooth-scroll">
              {allRounds.map((round) => (
                <DropdownMenuItem 
                  key={round} 
                  onClick={() => setSelectedRound(round)} 
                  className="text-sm hover:bg-[#36053A]/20  font-semibold font-montserrat text-[#36053A]/80"
                >
                  {round}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-6">
                      <Image src={Load} alt="Loading" className="animate-pulse object-center object-contain" width={30} height={30} />

          </div>
        ) : filteredMatches.length > 0 ? (
          <div className="space-y-3 overflow-y-auto custom-scrollbar smooth-scroll">
            {filteredMatches.map((match) => {
              // Defensive: ensure match.date is valid
              let time = '';
              if (match.date && !isNaN(Date.parse(match.date))) {
                time = new Date(match.date).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
              }
              return (
                <MatchCard key={match._id} match={{
                  id: match._id,
                  date: match.date,
                  time,
                  homeTeam: match.homeTeam.name,
                  homeLogo: match.homeTeam.logo,
                  awayTeam: match.awayTeam.name,
                  awayLogo: match.awayTeam.logo,
                  homeScore: match.homeScore,
                  awayScore: match.awayScore,
                  status: match.status,
                  venue: match.venue,
                  attendance: match.attendance,
                  referee: match.referee,
                  round: match.round,
                  homeTeamStats: match.homeTeamStats,
                  awayTeamStats: match.awayTeamStats,
                  matchEvents: match.matchEvents,
                }} />
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-6 text-sm font-montserrat">No matches found for this competition.</p>
        )}
      </div>
    </div>
  );
}
