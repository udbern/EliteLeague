"use client";
import React, { useEffect, useState } from "react";
import { urlFor } from "@/lib/sanityClient";
import { formatFixtureDate } from "@/lib/utils";
import Link from "next/link";
import TeamLogo from "@/components/ui/TeamLogo";

export const MatchCard = ({ match }) => {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setFormattedDate(formatFixtureDate(match.date));
  }, [match.date]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "live":
        return "bg-red-100 text-red-800";
      case "upcoming":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // Helper: Get image src from Sanity or fallback local
  const getImageSrc = (logo) => {
    if (logo && logo.asset?._ref) {
      return urlFor(logo).url();
    } else if (typeof logo === "string") {
      return logo; // assumes it's a local path like /teams/arsenal.png
    } else {
      return "/placeholder.png"; // fallback image
    }
  };

  const isClickable = match.status === "completed";

  return (
    <Link
      href={isClickable ? `/matches/${match.id}` : "#"}
      className={`block bg-white rounded-lg p-4 font-montserrat ${
        isClickable
          ? "cursor-pointer"
          : ""
      }`}
    >
      <div className="flex items-center  justify-between mb-1.5 font-montserrat">
        <div className="text-[10px] sm:text-sm text-[#36053A]/50 font-semibold font-montserrat">
          {formattedDate} • {match.time}
        </div>
        {match.status && (
          <span
            className={`text-[8px] sm:text-xs px-2 py-0.5  font-semibold  text-[#36053A]/80 rounded-full font-montserrat ${getStatusStyle(
              match.status
            )}`}
          >
            {match.status.toUpperCase()}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between  px-1 font-montserrat">
        <div className="flex flex-col items-center  w-1/3  p-2 font-montserrat">
          <TeamLogo
            logo={match.homeLogo}
            alt={match.homeTeam}
            size={30}
            className="mb-1"
          />
          <span className="text-[10px] sm:text-sm text-[#36053A]/80 text-center font-semibold font-montserrat">
            {match.homeTeam}
          </span>
        </div>

        <div className="text-sm sm:text-xl font-semibold text-[#36053A]/80 font-montserrat">
          {match.status === "completed" &&
          match.homeScore != null &&
          match.awayScore != null
            ? `${match.homeScore} - ${match.awayScore}`
            : "VS"}
        </div>

        <div className="flex flex-col items-center w-1/3 font-montserrat">
          <TeamLogo
            logo={match.awayLogo}
            alt={match.awayTeam}
            size={30}
            className="mb-1"
          />
          <span className="text-[10px] sm:text-sm font-semibold text-[#36053A]/80 text-center font-montserrat">
            {match.awayTeam}
          </span>
        </div>
      </div>
    </Link>
  );
};
