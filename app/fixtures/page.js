"use client";

import { useEffect, useState } from "react";
import { MatchCard } from "@/components/MatchCard";
import client from "@/lib/sanityClient";
import { useSeason } from "@/components/SeasonProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState([]);
  const [selectedRound, setSelectedRound] = useState("");
  const [loading, setLoading] = useState(true);
  const { selectedSeason } = useSeason();

  useEffect(() => {
    if (!selectedSeason?._id) return;

    const fetchFixtures = async () => {
      setLoading(true);
      const query = `*[_type == "fixture" && season._ref == $seasonId] | order(date asc)[0...50] {
        _id,
        date,
        status,
        round,
        homeScore,
        awayScore,
        "homeTeam": homeTeam->{name, "logo": logo.asset->url},
        "awayTeam": awayTeam->{name, "logo": logo.asset->url}
      }`;

      try {
        const result = await client.fetch(query, { seasonId: selectedSeason._id });
        setFixtures(result);
        if (result.length > 0) {
          setSelectedRound(result[0]?.round || "");
        }
      } catch (err) {
        console.error("Failed to fetch fixtures:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFixtures();
  }, [selectedSeason]);

  const allRounds = [...new Set(fixtures.map((f) => f.round))].sort((a, b) => a.localeCompare(b));
  const filteredMatches = fixtures.filter((m) => m.round === selectedRound);

  return (
    <div className="container mx-auto px-4 py-15 flex justify-center font-montserrat">
      <div className="bg-white rounded-[14px] w-full md:w-[50rem] p-4">
        <div className="flex justify-center items-center mb-10">
          <DropdownMenu className="">
            <DropdownMenuTrigger className="px-3 py-1.5 bg-white text-gray-700 rounded-md border hover:bg-gray-200 text-sm font-montserrat">
              {selectedRound || "Select Round"}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white rounded-md shadow-md">
              {allRounds.map((round) => (
                <DropdownMenuItem key={round} onClick={() => setSelectedRound(round)} className="text-sm font-montserrat">
                  {round}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-800"></div>
          </div>
        ) : filteredMatches.length > 0 ? (
          <div className="space-y-3">
            {filteredMatches.map((match) => (
              <MatchCard key={match._id} match={{
                id: match._id,
                date: match.date,
                time: new Date(match.date).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                homeTeam: match.homeTeam.name,
                homeLogo: match.homeTeam.logo,
                awayTeam: match.awayTeam.name,
                awayLogo: match.awayTeam.logo,
                homeScore: match.homeScore,
                awayScore: match.awayScore,
                status: match.status,
              }} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-6 text-sm font-montserrat">No matches found for this season.</p>
        )}
      </div>
    </div>
  );
}
