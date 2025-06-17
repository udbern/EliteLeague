"use client";
import React, { useEffect, useState } from "react";
import fetchStandings from "../../lib/fetchStandings";
import { TableHeader, TableCell } from "../standings/TableHelpers";
import Image from "next/image";
import { urlFor } from "@/lib/sanityClient";
import { useSeason } from "@/components/SeasonProvider";
import { useCompetition } from "@/components/CompetitionProvider";
import Load from "@/assets/logo.png"

const Top3 = ({ title }) => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedSeason } = useSeason();
  const { selectedCompetition } = useCompetition();

  useEffect(() => {
    const getStandings = async () => {
      if (!selectedSeason?._id || !selectedCompetition?._id) return;
      
      setLoading(true);
      try {
        const data = await fetchStandings(selectedSeason._id, selectedCompetition._id);
        setStandings(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching standings:', error);
      } finally {
        setLoading(false);
      }
    };
    getStandings();
  }, [selectedSeason, selectedCompetition]);

  // Helper to get image URL from Sanity or fallback local / placeholder
  const getImageSrc = (logo) => {
    if (logo && logo.asset?._ref) {
      return urlFor(logo).url();
    } else if (typeof logo === "string") {
      return logo; // local path like "/teams/arsenal.png"
    } else {
      return "/placeholder.png"; // fallback image
    }
  };

  if (loading) {
    return (
      <section className="mb-[12px] font-montserrat pl-4 pr-4 pt-6 pb-[18px] md:pl-6 md:pr-6 bg-white rounded-[14px] overflow-hidden backdrop-blur-sm">
        <div className="flex justify-center items-center py-4">
          <Image src={Load} alt="Loading" className="animate-pulse object-center object-contain" width={30} height={30} />
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8 sm:mb-10 md:mb-12 font-montserrat p-4 bg-white rounded-lg overflow-hidden backdrop-blur-sm">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#36053A]/80 mb-4 sm:mb-5 md:mb-6 font-montserrat">
        Top 3
      </h2>
      <hr className="mb-2 text-[#36053A]/80" />
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/10">
            <tr>
              <TableHeader className="w-8 sm:w-10 md:w-12 text-center">Pos</TableHeader>
              <TableHeader className="text-start">Club</TableHeader>
              <TableHeader className="text-start">P</TableHeader>
              <TableHeader className="text-start">GD</TableHeader>
              <TableHeader className="text-start">Pts</TableHeader>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {standings.map((team) => {
              const logoUrl = getImageSrc(team.logo);
              return (
                <tr key={team.position} className="hover:bg-white/5 transition-colors">
                  <TableCell className="text-center font-bold">{team.position}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                      <Image
                        src={logoUrl}
                        alt={team.name}
                        width={24}
                        height={24}
                        className="object-contain object-center overflow-hidden rounded-full"
                      />
                      <span className="font-bold text-#36053A]/80 truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
                        {team.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-start  font-semibold">{team.played}</TableCell>
                  <TableCell className="text-start font-semibold">{team.goalDifference}</TableCell>
                  <TableCell className="text-start font-bold">{team.points}</TableCell>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Top3;
