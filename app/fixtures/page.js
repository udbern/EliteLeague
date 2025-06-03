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
import Load from "@/assets/logo.png";
import Image from "next/image";
import "@/styles/scrollbar.css";

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState([]);
  const [selectedRound, setSelectedRound] = useState("Round 1");
  const [loading, setLoading] = useState(true);
  const { selectedSeason } = useSeason();

  useEffect(() => {
    if (!selectedSeason?._id) return;

    const fetchFixtures = async () => {
      setLoading(true);
      const query = `*[_type == "fixture" && season._ref == $seasonId] | order(date asc) {
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
        setSelectedRound("Round 1");
      } catch (err) {
        console.error("Failed to fetch fixtures:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFixtures();
  }, [selectedSeason]);

  useEffect(() => {
    setSelectedRound("Round 1");
  }, [selectedSeason]);

  const allRounds = [...new Set(fixtures.map((f) => f.round))].sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ''));
    const numB = parseInt(b.replace(/\D/g, ''));
    return numA - numB;
  });
  const filteredMatches = fixtures.filter((m) => m.round === selectedRound);

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
