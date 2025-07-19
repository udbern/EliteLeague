"use client";

import MatchStats from "@/components/MatchStats";
import { fetchFixtureById } from "@/lib/fetchFixtures";
import { notFound } from "next/navigation";
import TeamLogo from "@/components/ui/TeamLogo";
import MatchStandings from "@/components/MatchStandings";
import HeadToHead from "@/components/HeadToHead";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import Load from "@/assets/logo.png";

export default function MatchStatsPage({ params }) {
  const { matchId } = params;
  const [match, setMatch] = useState(null);
  const [activeTab, setActiveTab] = useState("stats");

  // Fetch match data
  useEffect(() => {
    const fetchMatch = async () => {
      const matchData = await fetchFixtureById(matchId);
      if (!matchData) {
        notFound();
      }
      setMatch(matchData);
    };
    fetchMatch();
  }, [matchId]);

  if (!match) {
    return (
      <section className="mb-[12px] font-montserrat pl-4 pr-4 pt-6 pb-[18px] md:pl-6 md:pr-6 bg-white rounded-[14px] overflow-hidden backdrop-blur-sm">
        <div className="flex justify-center items-center py-4">
          <Image src={Load} alt="Loading" className="animate-pulse object-center object-contain" width={30} height={30} />
        </div>
      </section>
    );
  }

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Full Time";
      case "in-progress":
        return "Live";
      case "scheduled":
        return "Scheduled";
      case "postponed":
        return "Postponed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-300";
      case "in-progress":
        return "text-red-30";
      case "scheduled":
        return "text-yellow-300";
      case "postponed":
        return "text-orange-30";
      case "cancelled":
        return "text-red-30";
      default:
        return "text-gray-30";
    }
  };

  const TABS = [
    { name: "Stats", value: "stats" },
    { name: "Standings", value: "standings" },
    { name: "Head to Head", value: "headtohead" },
  ];

  return (
    <>
      {/* Back Navigation */}

      {/* Header with match result */}
      <div className=" custom-gradient-4 rounded-b-[8px]  max-w-4xl mx-auto p-3 pt-5 flex flex-col items-center">
        <div className="flex items-center w-full justify-between">
          <div className="flex flex-col items-center flex-1">
            {match.homeTeam?.logo && (
              <TeamLogo
                logo={match.homeTeam.logo}
                alt={match.homeTeam.name}
                size={48}
                className="mb-1"
              />
            )}
            <span className="text-[12px] md:text-sm font-semibold text-gray-300">
              {match.homeTeam.name}
            </span>
          </div>
          <div className="text-base md:text-2xl font-bold text-gray-300 mx-4">
            {match.homeScore} - {match.awayScore}
          </div>
          <div className="flex flex-col items-center flex-1">
            {match.awayTeam?.logo && (
              <TeamLogo
                logo={match.awayTeam.logo}
                alt={match.awayTeam.name}
                size={48}
                className="mb-1"
              />
            )}
            <span className="text-[12px] md:text-sm font-semibold text-gray-300">
              {match.awayTeam.name}
            </span>
          </div>
        </div>

        {/* Match Status */}
        <div className="">
          <span
            className={`text-xs font-semibold ${getStatusColor(match.status)}`}
          >
            {getStatusText(match.status)}
          </span>
        </div>

        {/* Goal Scorers Section */}
        {(match.homeGoalScorers?.length > 0 ||
          match.awayGoalScorers?.length > 0) && (
          <div className="mt-1 w-full  max-w-lg mx-auto">
            <div className="flex justify-between   gap-2">
              {/* Home Team Goal Scorers */}
              <div className="flex-1">
                {match.homeGoalScorers?.length > 0 && (
                  <div className="space-y-1">
                    {match.homeGoalScorers.map((scorer, index) => (
                      <div
                        key={index}
                        className="flex items-center font-montserrat justify-between  text-xs text-gray-300"
                      >
                        <span className="font-medium">{scorer.playerName}</span>
                        <span className="font-bold">{scorer.goals}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Away Team Goal Scorers */}
              <div className="flex-1">
                {match.awayGoalScorers?.length > 0 && (
                  <div className="space-y-1">
                    {match.awayGoalScorers.map((scorer, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-xs px-6 text-gray-300"
                      >
                        <span className="font-medium">{scorer.playerName}</span>
                        <span className="font-bold">{scorer.goals}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tabs - Inside the scores container */}
        <div className="w-full  ">
          <nav className="flex items-center space-x-1.5 md:space-x-4 font-montserrat py-1">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`relative whitespace-nowrap px-1 py-2 text-sm font-bold transition-colors cursor-pointer
                    ${
                      isActive
                        ? "text-white"
                        : "text-white/60 hover:text-white/80"
                    }`}
                >
                  {tab.name}
                  {isActive && (
                    <motion.div
                      className="absolute w-full  border left-0 -bottom-0.5"
                      layoutId="activeTab"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content Containers - Outside the scores container */}
      <div className="  md:max-w-4xl  mx-auto  md:p-1  rounded-lg p-2 ">
        {activeTab === "stats" && (
          <div className="mt-0">
            <MatchStats match={match} />
          </div>
        )}

        {activeTab === "standings" && (
          <div className="mt-0">
            <MatchStandings />
          </div>
        )}

        {activeTab === "headtohead" && (
          <div className="mt-0">
            <HeadToHead homeTeam={match.homeTeam} awayTeam={match.awayTeam} />
          </div>
        )}
      </div>
    </>
  );
}
