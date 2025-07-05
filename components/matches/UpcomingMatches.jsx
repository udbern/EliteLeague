"use client";

import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { MatchCard } from "@/components/MatchCard";
import client from "@/lib/sanityClient";
import { useSeason } from "@/components/SeasonProvider";
import { useCompetition } from "@/components/CompetitionProvider";
import { formatFixtureTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const LoadingCard = () => (
  <div className="bg-white rounded-lg shadow p-4 animate-pulse font-montserrat">
    <div className="flex items-center justify-between mb-4">
      <div className="h-4 w-32 bg-gray-200 rounded"></div>
      <div className="h-4 w-16 bg-gray-200 rounded"></div>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex flex-col items-center w-1/3">
        <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
      </div>
      <div className="h-6 w-12 bg-gray-200 rounded"></div>
      <div className="flex flex-col items-center w-1/3">
        <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

const LoadingSection = () => (
  <section className="mb-8 bg-white rounded-lg shadow p-6 font-montserrat">
    <h2 className="text-xl font-bold  mb-4">Upcoming Matches</h2>
    <div className="max-w-xl mx-auto">
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {[1, 2, 3].map((index) => (
            <CarouselItem key={index} className="basis-full">
              <LoadingCard />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-gray-100 hover:bg-gray-200" />
        <CarouselNext className="bg-gray-100 hover:bg-gray-200" />
      </Carousel>
    </div>
  </section>
);

export default function UpcomingMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentRound, setCurrentRound] = useState("");
  const { selectedSeason } = useSeason();
  const { selectedCompetition } = useCompetition();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUpcomingMatches = async () => {
      if (!selectedSeason?._id || !selectedCompetition?._id) return;
      
      setLoading(true);
      
      try {
        // First, get all fixtures to determine the next available round
        const allFixturesQuery = `*[_type == "fixture" && season._ref == $seasonId && competition._ref == $competitionId] | order(round asc, matchDate asc) {
          _id,
          round,
          status,
          matchDate
        }`;
        
        const allFixtures = await client.fetch(allFixturesQuery, { 
          seasonId: selectedSeason._id,
          competitionId: selectedCompetition._id 
        });
        
        // Group fixtures by round and check completion status
        const roundStatus = {};
        allFixtures.forEach(fixture => {
          if (!roundStatus[fixture.round]) {
            roundStatus[fixture.round] = {
              total: 0,
              completed: 0,
              fixtures: []
            };
          }
          roundStatus[fixture.round].total++;
          roundStatus[fixture.round].fixtures.push(fixture);
          if (fixture.status === 'completed') {
            roundStatus[fixture.round].completed++;
          }
        });
        
        // Find the next available round (first round that's not fully completed)
        const rounds = Object.keys(roundStatus).sort((a, b) => {
          const numA = parseInt(a.replace(/\D/g, ''));
          const numB = parseInt(b.replace(/\D/g, ''));
          return numA - numB;
        });
        
        let nextRound = null;
        for (const round of rounds) {
          if (roundStatus[round].completed < roundStatus[round].total) {
            nextRound = round;
            break;
          }
        }
        
        // If all rounds are completed, show the last round
        if (!nextRound && rounds.length > 0) {
          nextRound = rounds[rounds.length - 1];
        }
        
        setCurrentRound(nextRound || "");
        
        if (!nextRound) {
          setMatches([]);
          setLoading(false);
          return;
        }
        
        // Fetch upcoming matches for the next available round
        const upcomingQuery = `*[_type == "fixture" && season._ref == $seasonId && competition._ref == $competitionId && round == $round && status != "completed"] | order(matchDate asc)[0...5] {
          _id,
          matchDate,
          status,
          round,
          homeScore,
          awayScore,
          "homeTeam": homeTeam->{name, logo},
          "awayTeam": awayTeam->{name, logo}
        }`;

        const result = await client.fetch(upcomingQuery, { 
          seasonId: selectedSeason._id,
          competitionId: selectedCompetition._id,
          round: nextRound
        });

        const mapped = result.map((match) => ({
          id: match._id,
          date: match.matchDate,
          time: formatFixtureTime(match.matchDate),
          homeTeam: match.homeTeam.name,
          homeLogo: match.homeTeam.logo,
          awayTeam: match.awayTeam.name,
          awayLogo: match.awayTeam.logo,
          homeScore: match.homeScore,
          awayScore: match.awayScore,
          status: match.status,
          round: match.round,
        }));

        setMatches(mapped);
      } catch (error) {
        console.error("Failed to fetch upcoming matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingMatches();
  }, [selectedSeason, selectedCompetition]);

  if (loading) {
    return <LoadingSection />;
  }

  return (
    <section className="mb-8 bg-white rounded-[14px] p-6 font-montserrat">
      <h2 className="text-lg font-bold text-[#36053A]/80 mb-4 sm:mb-5 md:mb-6 font-montserrat">
       Upcoming Matches 
      </h2>
      <hr className="mb-2 text-[#36053A]/80" />
      <div className="max-w-xl mx-auto">
        {matches.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No matches
          </p>
        ) : (
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {matches.map((match) => (
                <CarouselItem key={match.id} className="basis-full">
                  <MatchCard match={match} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className=" cursor-pointer ml-3 md:ml-0 custom-gradient-3 hover:bg-white/20 text-white border-none size-10 md:size-12 text-2xl" />
            <CarouselNext className="  cursor-pointer mr-3 md:mr-0  custom-gradient-3  hover:bg-white/20 text-white border-none size-10 md:size-12 text-2xl" />
          </Carousel>
        )}
      </div>
    </section>
  );
}
