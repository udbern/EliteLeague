"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanityClient";
import { formatFixtureDate } from "@/lib/utils";

const MatchStats = ({ match }) => {
  if (!match) return null;

  // Helper: Get image src from Sanity or fallback local
  const getImageSrc = (logo) => {
    if (logo && logo.asset?._ref) {
      return urlFor(logo).url();
    } else if (typeof logo === "string") {
      return logo;
    } else {
      return "/placeholder.png";
    }
  };

  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setFormattedDate(formatFixtureDate(match.date));
  }, [match.date]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "live":
        return "bg-red-100 text-red-800 animate-pulse";
      case "upcoming":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'goal':
        return '⚽';
      case 'yellow_card':
        return '🟨';
      case 'red_card':
        return '🟥';
      case 'substitution':
        return '🔄';
      case 'penalty':
        return '⚽';
      case 'free_kick':
        return '🎯';
      case 'corner':
        return '🏁';
      case 'offside':
        return '🚩';
      case 'foul':
        return '⚠️';
      default:
        return '•';
    }
  };

  const getEventColor = (eventType, team) => {
    const isHome = team === 'home';
    const baseColor = isHome ? 'text-blue-600' : 'text-red-600';
    
    switch (eventType) {
      case 'goal':
        return 'text-green-600 font-bold';
      case 'yellow_card':
        return 'text-yellow-600';
      case 'red_card':
        return 'text-red-600 font-bold';
      default:
        return baseColor;
    }
  };

  const statDefinitions = [
    { key: 'shots', label: 'Total Shots', highlightHigher: true },
    { key: 'shotsOnTarget', label: 'Shots on target', highlightHigher: true },
    { key: 'fouls', label: 'Fouls', highlightHigher: false },
    { key: 'offsides', label: 'Offsides', highlightHigher: false },
    { key: 'corners', label: 'Corner Kicks', highlightHigher: false },
    { key: 'freeKicks', label: 'Free Kicks', highlightHigher: true },
    { key: 'passes', label: 'Passes', highlightHigher: true },
    { key: 'successfulPass', label: 'Successful Passes', highlightHigher: true },
    { key: 'crosses', label: 'Crosses', highlightHigher: false },
    { key: 'interceptions', label: 'Interceptions', highlightHigher: false },
    { key: 'tackles', label: 'Tackles', highlightHigher: false },
    { key: 'saves', label: 'Saves', highlightHigher: false },
  ];

  return (
    <div className="max-w-5xl md:max-w-4xl  mx-auto py-6 px-2 md:px-6 font-montserrat bg-gray-100 rounded-[15px] min-h-screen">
      <div className=" rounded-lg  p-4 md:p-6">
        

        {/* Match Facts Section */}
        {match.homeTeamStats && match.awayTeamStats && (
          <div className=" rounded-lg p-4 mb-6 ">
            <h3 className="text-base font-bold text-[#36053A] mb-4 text-center font-montserrat">
              Match Facts
            </h3>
            
            {/* Possession Bar */}
            <div className="mb-6">
              {/* New Possession Bar with values inside */}
              <div className="flex h-7 rounded-full overflow-hidden w-full text-xs font-bold font-montserrat">
                {(() => {
                  const home = match.homeTeamStats.possession || 0;
                  const away = match.awayTeamStats.possession || 0;
                  const homeIsHigher = home > away;
                  const homeColor = 'bg-[#453DE4]/80 text-white';
                  const awayColor = 'bg-[#A723EE]/100 text-white';
                  return <>
                    <div
                      className={`flex items-center justify-center transition-all duration-300 ${homeColor}`}
                      style={{ width: `${home}%` }}
                    >
                      {home > 0 && <span className="w-full text-center">{home}%</span>}
                    </div>
                    <div
                      className={`flex items-center justify-center transition-all duration-300 ${awayColor}`}
                      style={{ width: `${away}%` }}
                    >
                      {away > 0 && <span className="w-full text-center">{away}%</span>}
                    </div>
                  </>;
                })()}
              </div>
            </div>

            {/* Individual Stats */}
            <div className="space-y-3">
              {statDefinitions.map((stat, index) => {
                const homeValue = match.homeTeamStats[stat.key] || 0;
                const awayValue = match.awayTeamStats[stat.key] || 0;
                // Home: always bg-[#453DE4]/80, always text-white
                const homeBadgeClass = `bg-[#453DE4]/80 text-white`;
                // Away: keep as before but always text-white
                const awayBadgeClass = 'bg-[#A723EE]/100 text-white';
                return (
                  <div key={index} className="flex items-center justify-between">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${homeBadgeClass}`}>
                      {homeValue}
                    </span>
                    <span className="flex-1 text-center text-xs font-semibold text-[#36053A] mx-2 font-montserrat">
                      {stat.label}
                    </span>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${awayBadgeClass}`}>
                      {awayValue}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Match Events Timeline */}
        {match.matchEvents?.length > 0 && (
          <div className=" rounded-lg p-4 shadow-sm border border-gray-100">
            <h3 className="text-base font-bold text-[#36053A] mb-4 text-center font-montserrat">Match Events</h3>
            <div className="space-y-4">
              {match.matchEvents
                .sort((a, b) => a.time - b.time)
                .map((event, index) => (
                  <div key={index} className="flex items-center text-xs text-gray-700 font-montserrat">
                    <span className="w-10 text-right font-semibold text-[#36053A]">{event.time}'</span>
                    <div className="flex-1 mx-2 flex items-center">
                      <span className="mr-2 text-sm align-middle">
                        {getEventIcon(event.type)}
                      </span>
                      <span className={`${getEventColor(event.type, event.team)}`}>
                        {event.description}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchStats; 