"use client";

import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { MatchCard } from "@/components/MatchCard";
import client from "@/lib/sanityClient";
import { useSeason } from "@/components/SeasonProvider";

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
  const { selectedSeason } = useSeason();

  useEffect(() => {
    const fetchUpcomingMatches = async () => {
      if (!selectedSeason?._id) return;
      
      setLoading(true);
      const query = `*[_type == "fixture" && season._ref == $seasonId && status != "completed"] | order(date asc)[0...5] {
        _id,
        date,
        status,
        homeScore,
        awayScore,
        "homeTeam": homeTeam->{name, logo},
        "awayTeam": awayTeam->{name, logo}
      }`;

      try {
        const result = await client.fetch(query, { seasonId: selectedSeason._id });

        const mapped = result.map((match) => ({
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
        }));

        setMatches(mapped);
      } catch (error) {
        console.error("Failed to fetch upcoming matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingMatches();
  }, [selectedSeason]);

  if (loading) {
    return <LoadingSection />;
  }

  return (
    <section className="mb-8 bg-white rounded-[14px] p-6 font-montserrat">
      <h2 className="text-lg font-bold text-[#36053A]/80 mb-4 sm:mb-5 md:mb-6 font-montserrat">Upcoming Matches</h2>
      <hr className="mb-2 text-[#36053A]/80" />
      <div className="max-w-xl mx-auto">
        {matches.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No upcoming matches for this season.
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
            <CarouselPrevious className=" bg-gradient-to-br from-[#622085] ml-3 md:ml-0 via-[#A112BA] to-[#0f5c4f] hover:bg-white/20 text-white border-none size-10 md:size-14 text-sm" />
            <CarouselNext className=" bg-gradient-to-br from-[#622085] mr-3 md:mr-0 via-[#A112BA] to-[#0f5c4f] hover:bg-white/20 text-white border-none size-10 md:size-14 text-sm" />
          </Carousel>
        )}
      </div>
    </section>
  );
}
