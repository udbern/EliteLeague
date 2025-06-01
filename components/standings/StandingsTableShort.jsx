"use client";
import React, { useEffect, useState } from "react";
import fetchStandings from "../../lib/fetchStandings";
import { TableHeader, TableCell } from "./TableHelpers";
import Image from "next/image";
import { urlFor } from "@/lib/sanityClient";
import { useSeason } from "@/components/SeasonProvider";

const StandingsTableShort = ({ title }) => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedSeason } = useSeason();

  useEffect(() => {
    const getStandings = async () => {
      if (!selectedSeason?._id) return;
      
      setLoading(true);
      try {
        const data = await fetchStandings(selectedSeason._id);
        // Only show top 5 teams
        setStandings(data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching standings:', error);
      } finally {
        setLoading(false);
      }
    };
    getStandings();
  }, [selectedSeason]);

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
      <section className="mb-[12px] pl-1 pr-1 pt-6 pb-[18px] md:pl-6 md:pr-6 bg-white rounded-[14px] overflow-hidden backdrop-blur-sm">
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#36053A]"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-[12px] font-montserrat pl-1 pr-1 pt-6 pb-[18px] md:pl-6 md:pr-6 bg-white rounded-[14px] overflow-hidden backdrop-blur-sm">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#36053A]/80 mb-[12px] text-center">
        {title}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full font-montserrat font-semibold text-[10px] sm:text-xs md:text-sm">
          <thead>
            <tr>
              <TableHeader className="text-center font-semibold w-4 sm:w-10 md:w-12">Pos</TableHeader>
              <TableHeader className="text-left">Club</TableHeader>
              <TableHeader className="text-center">P</TableHeader>
              <TableHeader className="text-center">GD</TableHeader>
              <TableHeader className="text-center">Pts</TableHeader>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {standings.map((team) => {
              const logoUrl = getImageSrc(team.logo);
              return (
                <tr key={team.position} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="text-center font-bold">{team.position}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 md:gap-2">
                      <Image
                        src={logoUrl}
                        alt={team.name}
                        width={20}
                        height={20}
                        className="rounded-full object-contain w-[16px] h-[16px] md:w-[24px] md:h-[24px]"
                      />
                      <span className="font-semibold text-[10px] md:text-sm truncate max-w-[100px] md:max-w-full">{team.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{team.played}</TableCell>
                  <TableCell>{team.goalDifference}</TableCell>
                  <TableCell className="font-bold">{team.points}</TableCell>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default StandingsTableShort;
