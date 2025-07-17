"use client";

import React, { useState, useEffect } from "react";
import fetchStandings from "@/lib/fetchStandings";
import { useSeason } from "@/components/SeasonProvider";
import { useCompetition } from "@/components/CompetitionProvider";
import TeamLogo from "@/components/ui/TeamLogo";
import { urlFor } from "@/lib/sanityClient";

const MatchStandings = () => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedSeason } = useSeason();
  const { selectedCompetition } = useCompetition();

  useEffect(() => {
    const getStandings = async () => {
      if (!selectedSeason?._id || !selectedCompetition?._id) {
        setStandings([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const data = await fetchStandings(selectedSeason._id, selectedCompetition._id);
        setStandings(data);
      } catch (error) {
        console.error('Error fetching standings:', error);
        setStandings([]);
      } finally {
        setLoading(false);
      }
    };
    getStandings();
  }, [selectedSeason, selectedCompetition]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#36053A]"></div>
      </div>
    );
  }

  if (!selectedSeason || !selectedCompetition) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 font-montserrat">Please select a season and competition to view standings.</p>
      </div>
    );
  }

  if (standings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 font-montserrat">No standings data available for {selectedCompetition.name}.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full font-montserrat text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-2 font-semibold text-[#36053A]">Pos</th>
            <th className="text-left py-3 px-2 font-semibold text-[#36053A]">Club</th>
            <th className="text-center py-3 px-2 font-semibold text-[#36053A]">P</th>
            <th className="text-center py-3 px-2 font-semibold text-[#36053A]">W</th>
            <th className="text-center py-3 px-2 font-semibold text-[#36053A]">D</th>
            <th className="text-center py-3 px-2 font-semibold text-[#36053A]">L</th>
            <th className="text-center py-3 px-2 font-semibold text-[#36053A]">GF</th>
            <th className="text-center py-3 px-2 font-semibold text-[#36053A]">GA</th>
            <th className="text-center py-3 px-2 font-semibold text-[#36053A]">GD</th>
            <th className="text-center py-3 px-2 font-semibold text-[#36053A]">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, index) => (
            <tr key={team._id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-2 font-bold text-[#36053A]">{team.position}</td>
              <td className="py-3 px-2">
                <div className="flex items-center gap-2">
                  {team.logo && (
                    <TeamLogo
                      logo={team.logo}
                      alt={team.name}
                      size={24}
                      className="w-6 h-6"
                    />
                  )}
                  <span className="font-semibold text-[#36053A]">{team.name}</span>
                </div>
              </td>
              <td className="py-3 px-2 text-center font-semibold">{team.played}</td>
              <td className="py-3 px-2 text-center font-semibold">{team.won}</td>
              <td className="py-3 px-2 text-center font-semibold">{team.drawn}</td>
              <td className="py-3 px-2 text-center font-semibold">{team.lost}</td>
              <td className="py-3 px-2 text-center font-semibold">{team.goalsFor}</td>
              <td className="py-3 px-2 text-center font-semibold">{team.goalsAgainst}</td>
              <td className="py-3 px-2 text-center font-semibold">{team.goalDifference}</td>
              <td className="py-3 px-2 text-center font-bold text-[#36053A]">{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatchStandings; 