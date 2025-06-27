"use client";

import React, { useState, useEffect } from "react";
import { useCompetition } from "./CompetitionProvider";
import { useSeason } from "./SeasonProvider";
import { MatchCard } from "./MatchCard";
import client from "@/lib/sanityClient";
import { motion } from "framer-motion";
import Load from "@/assets/logo.png";
import Image from "next/image";
import { formatFixtureTime } from "@/lib/utils";
import "@/styles/scrollbar.css";

const CupStages = () => {
  const { selectedCompetition } = useCompetition();
  const { selectedSeason } = useSeason();
  const [fixtures, setFixtures] = useState({});
  const [loading, setLoading] = useState(true);
  const [stages, setStages] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);

  useEffect(() => {
    const fetchFixtures = async () => {
      if (!selectedCompetition?._id || !selectedSeason?._id) return;
      
      setLoading(true);
      try {
        const query = `
          *[_type == "fixture" && season._ref == $seasonId && competition._ref == $competitionId] | order(matchDate asc) {
            _id,
            matchDate,
            status,
            round,
            group,
            homeScore,
            awayScore,
            "homeTeam": homeTeam->{name, logo},
            "awayTeam": awayTeam->{name, logo}
          }
        `;
        
        const result = await client.fetch(query, { 
          seasonId: selectedSeason._id,
          competitionId: selectedCompetition._id 
        });
        
        // Group fixtures by round/stage and then by group if applicable
        const groupedFixtures = result.reduce((acc, fixture) => {
          const round = fixture.round || 'Unknown';
          
          if (!acc[round]) {
            acc[round] = {};
          }
          
          // For group stages, group by group name
          if (round.toLowerCase().includes('group') && fixture.group) {
            if (!acc[round][fixture.group]) {
              acc[round][fixture.group] = [];
            }
            acc[round][fixture.group].push(fixture);
          } else {
            // For non-group stages, use a default key
            if (!acc[round]['matches']) {
              acc[round]['matches'] = [];
            }
            acc[round]['matches'].push(fixture);
          }
          
          return acc;
        }, {});
        
        setFixtures(groupedFixtures);
        
        // Get stages from competition schema, sorted by order
        const competitionStages = (selectedCompetition.competitionStages || [])
          .sort((a, b) => a.order - b.order)
          .map(stage => ({
            name: stage.stageName,
            slug: stage.stageName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            type: stage.stageType
          }));
        
        setStages(competitionStages);
      } catch (error) {
        console.error("Error fetching fixtures:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFixtures();
  }, [selectedCompetition, selectedSeason]);

  // Separate useEffect to handle initial stage selection
  useEffect(() => {
    if (stages.length > 0 && !selectedStage) {
      setSelectedStage(stages[0]);
    }
  }, [stages, selectedStage]);

  const getStageColor = (stageName) => {
    const lowerStage = stageName.toLowerCase();
    if (lowerStage.includes('group')) return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
    if (lowerStage.includes('16')) return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
    if (lowerStage.includes('quarter')) return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
    if (lowerStage.includes('semi')) return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white';
    if (lowerStage.includes('final')) return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
    return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
  };

  const getStageBackground = (stageName) => {
    const lowerStage = stageName.toLowerCase();
    if (lowerStage.includes('group')) return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200';
    if (lowerStage.includes('16')) return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200';
    if (lowerStage.includes('quarter')) return 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200';
    if (lowerStage.includes('semi')) return 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200';
    if (lowerStage.includes('final')) return 'bg-gradient-to-br from-red-50 to-red-100 border-red-200';
    return 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Image src={Load} alt="Loading" className="animate-pulse object-center object-contain" width={30} height={30} />
      </div>
    );
  }

  if (!selectedCompetition || selectedCompetition.type !== 'cup') {
    return null;
  }

  if (stages.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 font-montserrat">No stages defined for this cup competition.</p>
        <p className="text-sm text-gray-400 font-montserrat mt-2">
          Please define competition stages in the Sanity Studio or add fixtures with round names.
        </p>
      </div>
    );
  }

  // Get fixtures for the selected stage
  const stageFixtures = fixtures[selectedStage?.name] || {};

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-gradient-to-br from-[#622085] via-[#A112BA] to-[#0f5c4f] p-6 rounded-xl shadow-lg">
        <h2 className=" text-xl md:text-3xl font-bold text-white font-montserrat">
          {selectedCompetition.name}
        </h2>
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
        </div>
      </div>

      <div className="w-full overflow-x-auto scrollbar-hide scroll-smooth">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-max min-w-full">
          {stages.map((stage) => (
            <button
              key={stage.slug}
              onClick={() => setSelectedStage(stage)}
              className={`relative px-4 shadow-none border-none py-2 rounded-md text-sm font-semibold transition-colors font-montserrat whitespace-nowrap flex-shrink-0 ${
                selectedStage?.slug === stage.slug
                  ? "text-[#36053A]"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <span className="hidden md:inline">{stage.name}</span>
              <span className="md:hidden">{stage.name.split(' ')[0]}</span>
              {selectedStage?.slug === stage.slug && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0  h-0.5 bg-[#3d0542]"
                  layoutId="activeStageTab"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Stage Content */}
      <div className="space-y-6">
        {selectedStage && (
          <>
            <div className="flex items-center justify-between bg-gradient-to-br from-[#622085] via-[#A112BA] to-[#0f5c4f] p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white font-montserrat">
                {selectedStage.name}
              </h3>
            </div>
            
            {Object.keys(stageFixtures).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(stageFixtures).map(([groupName, groupFixtures]) => (
                  <div key={groupName} className="space-y-3">
                    {groupName !== 'matches' && (
                      <h4 className="text-lg font-semibold text-[#36053A] font-montserrat">
                        {groupName}
                      </h4>
                    )}
                    <div className="grid gap-4">
                      {groupFixtures.map((fixture) => (
                        <MatchCard key={fixture._id} match={{
                          id: fixture._id,
                          date: fixture.matchDate,
                          time: formatFixtureTime(fixture.matchDate),
                          homeTeam: fixture.homeTeam?.name || "TBD",
                          homeLogo: fixture.homeTeam?.logo,
                          awayTeam: fixture.awayTeam?.name || "TBD",
                          awayLogo: fixture.awayTeam?.logo,
                          homeScore: fixture.homeScore,
                          awayScore: fixture.awayScore,
                          status: fixture.status,
                          round: fixture.round,
                        }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 font-montserrat">No fixtures available for {selectedStage.name}.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CupStages; 