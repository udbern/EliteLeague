import MatchStats from "@/components/MatchStats";
import { fetchFixtureById } from "@/lib/fetchFixtures";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default async function MatchStatsPage({ params }) {
  const { matchId } = params;
  const match = await fetchFixtureById(matchId);

  if (!match) {
    notFound();
  }

  return (
    <>
      {/* Header with match result */}
      <div className="bg-gray-100 rounded-lg  p-4 md:p-6 mb-2 flex flex-col items-center">
        <div className="flex items-center w-full justify-between ">
          <div className="flex flex-col  items-center flex-1">
            {match.homeTeam?.logo && (
              <Image
                src={match.homeTeam.logo}
                alt={match.homeTeam.name}
                width={48}
                height={48}
                className="max-w-10 max-h-10 rounded-full object-contain object-center mb-1"
              />
            )}
            <span className="text-[12px] md:text-sm font-semibold text-[#36053A] text-center">
              {match.homeTeam.name}
            </span>
          </div>
          <div className=" text-base  md:text-2xl font-bold text-[#36053A] mx-4">
            {match.homeScore} - {match.awayScore}
          </div>
          <div className="flex flex-col items-center flex-1">
            {match.awayTeam?.logo && (
              <Image
                src={match.awayTeam.logo}
                alt={match.awayTeam.name}
                width={48}
                height={48}
                className="max-w-10 max-h-10 rounded-full object-contain object-center mb-1"
              />
            )}
            <span className="text-[12px] md:text-sm font-semibold text-[#36053A] text-center">
              {match.awayTeam.name}
            </span>
          </div>
        </div>
        <div className="text-xs text-gray-500 text-center">
          {match.venue && `${match.venue}`}
        </div>
      </div>
      {/* Tabs */}
      <Tabs defaultValue="stats" className="w-full font-montserrat ">
        <TabsList className=" rounded-lg p-1 flex w-full">
          <TabsTrigger value="stats" className="flex-1 shadow-none font-bold  bg-gray-100  text-[#36053A]">
            Stats
          </TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <MatchStats match={match} />
        </TabsContent>
      </Tabs>
    </>
  );
} 