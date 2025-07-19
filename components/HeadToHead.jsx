"use client";

import React, { useState, useEffect } from "react";
import { fetchHeadToHead } from "@/lib/fetchHeadToHead";
import { useSeason } from "@/components/SeasonProvider";
import { useCompetition } from "@/components/CompetitionProvider";
import TeamLogo from "@/components/ui/TeamLogo";
import { formatFixtureDate } from "@/lib/utils";

const HeadToHead = ({ homeTeam, awayTeam }) => {
  const [headToHeadData, setHeadToHeadData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { selectedSeason } = useSeason();
  const { selectedCompetition } = useCompetition();

  useEffect(() => {
    const getHeadToHead = async () => {
      if (!selectedSeason?._id || !selectedCompetition?._id || !homeTeam?._id || !awayTeam?._id) {
        setHeadToHeadData(null);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const data = await fetchHeadToHead(
          homeTeam._id, 
          awayTeam._id, 
          selectedSeason._id, 
          selectedCompetition._id
        );
        setHeadToHeadData(data);
      } catch (error) {
        console.error('Error fetching head-to-head data:', error);
        setHeadToHeadData(null);
      } finally {
        setLoading(false);
      }
    };
    getHeadToHead();
  }, [selectedSeason, selectedCompetition, homeTeam, awayTeam]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#36053A]"></div>
      </div>
    );
  }

  if (!headToHeadData || headToHeadData.stats.totalMatches === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 font-montserrat">No head-to-head matches found between these teams in this competition.</p>
      </div>
    );
  }

  const { stats, matches } = headToHeadData;

  return (
    <div className="space-y-6">
      {/* Head-to-Head Summary */}
      <div className="bg-white rounded-[15px] p-4">
        <h4 className="text-lg font-bold text-[#36053A] mb-4 text-center">Head-to-Head Summary</h4>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col items-center flex-1">
            <TeamLogo
              logo={homeTeam.logo}
              alt={homeTeam.name}
              size={48}
              className="mb-2"
            />
            <span className="text-sm font-semibold text-[#36053A] text-center">{homeTeam.name}</span>
          </div>
          
          <div className="flex flex-col items-center mx-4">
            <div className="text-2xl font-bold text-[#36053A]">{stats.team1Wins}</div>
            <div className="text-xs text-gray-500">Wins</div>
          </div>
          
          <div className="flex flex-col items-center mx-2">
            <div className="text-lg font-bold text-[#36053A]">{stats.draws}</div>
            <div className="text-xs text-gray-500">Draws</div>
          </div>
          
          <div className="flex flex-col items-center mx-4">
            <div className="text-2xl font-bold text-[#36053A]">{stats.team2Wins}</div>
            <div className="text-xs text-gray-500">Wins</div>
          </div>
          
          <div className="flex flex-col items-center flex-1">
            <TeamLogo
              logo={awayTeam.logo}
              alt={awayTeam.name}
              size={48}
              className="mb-2"
            />
            <span className="text-sm font-semibold text-[#36053A] text-center">{awayTeam.name}</span>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-600">
          Total matches: {stats.totalMatches} • {homeTeam.name} goals: {stats.team1Goals} • {awayTeam.name} goals: {stats.team2Goals}
        </div>
      </div>

      {/* Previous Matches */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h4 className="text-lg font-bold text-[#36053A] mb-4">Previous Matches</h4>
        
        <div className="space-y-3">
          {matches.map((match, index) => (
            <div key={match._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 flex-1">
                <div className="text-xs text-gray-500 w-16">
                  {formatFixtureDate(match.matchDate)}
                </div>
                <div className="text-xs text-gray-500">
                  {match.round}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <TeamLogo
                    logo={match.isTeam1Home ? match.homeTeam.logo : match.awayTeam.logo}
                    alt={match.isTeam1Home ? match.homeTeam.name : match.awayTeam.name}
                    size={24}
                    className="w-6 h-6"
                  />
                  <span className="text-sm font-semibold text-[#36053A]">
                    {match.isTeam1Home ? match.homeTeam.name : match.awayTeam.name}
                  </span>
                </div>
                
                <div className="text-lg font-bold text-[#36053A]">
                  {match.team1Score} - {match.team2Score}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#36053A]">
                    {match.isTeam1Home ? match.awayTeam.name : match.homeTeam.name}
                  </span>
                  <TeamLogo
                    logo={match.isTeam1Home ? match.awayTeam.logo : match.homeTeam.logo}
                    alt={match.isTeam1Home ? match.awayTeam.name : match.homeTeam.name}
                    size={24}
                    className="w-6 h-6"
                  />
                </div>
              </div>
              
              <div className="ml-4">
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  match.result === 'team1' 
                    ? 'bg-green-100 text-green-800' 
                    : match.result === 'team2' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {match.result === 'team1' ? homeTeam.name : match.result === 'team2' ? awayTeam.name : 'Draw'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeadToHead; 