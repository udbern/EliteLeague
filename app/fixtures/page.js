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
import "./loader.css";

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState([]);
  const [selectedRound, setSelectedRound] = useState("");
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
            <DropdownMenuTrigger className="px-3 py-1.5 bg-white text-[#36053A]/80 rounded-md border focus:outline-none hover:bg-gray-200 text-sm font-montserrat">
              {selectedRound || "Select Round"}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white rounded-md border border-[#36053A]/40 max-h-[320px] overflow-y-auto custom-scrollbar">
              {allRounds.map((round) => (
                <DropdownMenuItem 
                  key={round} 
                  onClick={() => setSelectedRound(round)} 
                  className="text-sm hover:bg-[#36053A]/20 font-semibold font-montserrat text-[#36053A]/80"
                >
                  {round}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-6">
            <span className="loader"></span>
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

const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #36053A40;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #36053A60;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = customScrollbarStyles;
  document.head.appendChild(styleSheet);
}
