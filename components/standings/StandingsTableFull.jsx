"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import fetchStandings from "../../lib/fetchStandings";
import { urlFor } from "@/lib/sanityClient";
import { TableHeader, TableCell } from "./TableHelpers";
import { useSeason } from "@/components/SeasonProvider";
import "./loader.css";
import Load from "@/assets/logo.png"

const StandingsPage = () => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedSeason } = useSeason();

  useEffect(() => {
    const getStandings = async () => {
      if (!selectedSeason?._id) return;
      
      setLoading(true);
      try {
        const data = await fetchStandings(selectedSeason._id);
        setStandings(data);
      } catch (error) {
        console.error('Error fetching standings:', error);
      } finally {
        setLoading(false);
      }
    };
    getStandings();
  }, [selectedSeason]);

  // Helper: get image src (Sanity object, local string, or fallback)
  const getImageSrc = (logo) => {
    if (logo && logo.asset?._ref) {
      return urlFor(logo).url();
    } else if (typeof logo === "string") {
      return logo;
    } else {
      return "/placeholder.png";
    }
  };

  if (loading) {
    return (
      <section className="mb-[12px] pl-1 pr-1 pt-6 pb-[18px] md:pl-6 md:pr-6 bg-white rounded-[14px] overflow-hidden backdrop-blur-sm">
        <div className="flex justify-center items-center py-8">
        <Image src={Load} alt="Loading" className="animate-pulse object-center object-contain" width={30} height={30} />

        </div>
      </section>
    );
  }

  return <StandingsTableFull data={standings} title={`${selectedSeason?.name} Standings`} getImageSrc={getImageSrc} />;
};

const StandingsTableFull = ({ data, title, getImageSrc }) => {
  return (
    <section className="mb-[12px] pl-1 pr-1 pt-6 pb-[18px] md:pl-6 md:pr-6 bg-white rounded-[14px] overflow-hidden backdrop-blur-sm">
     
      <div className="overflow-x-auto">
        <table className="w-full font-montserrat font-semibold text-xs md:text-base">
          <thead>
            <tr>
              <TableHeader>Pos</TableHeader>
              <TableHeader className="text-left">Club</TableHeader>
              <TableHeader>P</TableHeader>
              <TableHeader>W</TableHeader>
              <TableHeader>D</TableHeader>
              <TableHeader>L</TableHeader>
              <TableHeader className="w-5">GF:GA</TableHeader>
              <TableHeader>GD</TableHeader>
              <TableHeader>Pts</TableHeader>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((team) => {
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
                        <span className="font-semibold text-[10px] md:text-base truncate max-w-[100px] md:max-w-full">{team.shortName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{team.played}</TableCell>
                    <TableCell>{team.wins}</TableCell>
                    <TableCell>{team.draws}</TableCell>
                    <TableCell>{team.losses}</TableCell>
                    <TableCell>{`${team.goalsFor}:${team.goalsAgainst}`}</TableCell>
                    <TableCell className={team.goalDifference > 0 ? 'text-green-600' : team.goalDifference < 0 ? 'text-red-600' : ''}>
                      {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                    </TableCell>
                    <TableCell className="font-bold">{team.points}</TableCell>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-500 text-xs md:text-base">
                  No standings data available for this season.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default StandingsPage;