"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanityClient";

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
    const dateString = new Date(match.date).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    setFormattedDate(dateString);
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
    { key: 'shotsOnGoal', label: 'Shots on target', highlightHigher: true },
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
    <div className="max-w-5xl md:max-w-4xl  mx-auto py-6 px-2 md:px-6 font-montserrat bg-gray-200 min-h-screen">
      <div className=" rounded-lg  p-4 md:p-6">
        {/* Match Header */}
        <div className=" rounded-lg p-2 md:p-4 mb-6">
          <div className="text-center mb-4 relative">
            <p className="text-sm text-gray-600">
            {formattedDate} • {match.time}
            </p>
            <p className="text-xs text-gray-500 mb-2">
              {match.venue && `${match.venue}`}
              {match.attendance && ` • Attendance: ${match.attendance.toLocaleString()}`}
            </p>
            {match.status && (
              <span className={`text-[10px] sm:text-xs px-2 py-1 font-semibold  text-[#36053A]/80 rounded-full ${getStatusStyle(match.status)}`}>
                {match.status.toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center flex-1">
              {match.homeTeam?.logo && (
                <Image
                  src={getImageSrc(match.homeTeam.logo)}
                  alt={match.homeTeam.name}
                  width={60}
                  height={60}
                  className="w-16 h-16 sm:w-15 sm:h-15 rounded-full  object-center  object-contain mb-2"
                />
              )}
              <span className="text-sm font-semibold text-[#36053A] text-center">
                {match.homeTeam.name}
              </span>
            </div>

            <div className="text-2xl font-bold text-[#36053A] mx-4">
              {match.homeScore} - {match.awayScore}
            </div>

            <div className="flex flex-col items-center flex-1">
              {match.awayTeam?.logo && (
                <Image
                  src={getImageSrc(match.awayTeam.logo)}
                  alt={match.awayTeam.name}
                  width={60}
                  height={60}
                  className="w-16 h-16 sm:w-15 sm:h-15 rounded-full  object-center object-contain mb-2"
                />
              )}
              <span className="text-sm font-semibold text-[#36053A] text-center">
                {match.awayTeam.name}
              </span>
            </div>
          </div>
        </div>

        {/* Match Facts Section */}
        {match.homeTeamStats && match.awayTeamStats && (
          <div className=" rounded-lg p-4 mb-6 ">
            <h3 className="text-lg font-bold text-[#36053A] mb-4 text-center">
              Match Facts
            </h3>
            
            {/* Possession Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-semibold mb-1 text-gray-700">
                <span>{match.homeTeamStats.possession}%</span>
                <span>{match.awayTeamStats.possession}%</span>
              </div>
              <div className="flex h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#622085]" 
                  style={{ width: `${match.homeTeamStats.possession}%` }}
                ></div>
                <div 
                  className="bg-[#A112BA]" 
                  style={{ width: `${match.awayTeamStats.possession}%` }}
                ></div>
              </div>
            </div>

            {/* Individual Stats */}
            <div className="space-y-3">
              {statDefinitions.map((stat, index) => {
                const homeValue = match.homeTeamStats[stat.key] || 0;
                const awayValue = match.awayTeamStats[stat.key] || 0;
                
                let homeBadgeClass = "bg-gray-200 text-gray-800";
                let awayBadgeClass = "bg-gray-200 text-gray-800";

                if (homeValue === awayValue) {
                  // If values are equal, both use the specified colors
                  homeBadgeClass = "bg-[#622085] text-white";
                  awayBadgeClass = "bg-[#A112BA] text-white";
                } else if (stat.highlightHigher) {
                  if (homeValue > awayValue) {
                    homeBadgeClass = "bg-[#622085] text-white";
                    awayBadgeClass = "bg-[#A112BA] text-white";
                  } else {
                    homeBadgeClass = "bg-[#A112BA] text-white";
                    awayBadgeClass = "bg-[#622085] text-white";
                  }
                } else { // highlightHigher is false, so highlight lower value
                  if (homeValue < awayValue) {
                    homeBadgeClass = "bg-[#622085] text-white";
                    awayBadgeClass = "bg-[#A112BA] text-white";
                  } else {
                    homeBadgeClass = "bg-[#A112BA] text-white";
                    awayBadgeClass = "bg-[#622085] text-white";
                  }
                }

                return (
                  <div key={index} className="flex items-center justify-between">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${homeBadgeClass}`}>
                      {homeValue}
                    </span>
                    <span className="flex-1 text-center text-sm font-semibold text-[#36053A] mx-2">
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
            <h3 className="text-lg font-bold text-[#36053A] mb-4 text-center">Match Events</h3>
            <div className="space-y-4">
              {match.matchEvents
                .sort((a, b) => a.time - b.time)
                .map((event, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-700">
                    <span className="w-10 text-right font-semibold text-[#36053A]">{event.time}'</span>
                    <div className="flex-1 mx-2 flex items-center">
                      <span className="mr-2 text-base align-middle">
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