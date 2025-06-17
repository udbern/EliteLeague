"use client";
import React, { useEffect, useState } from "react";
import { urlFor } from "@/lib/sanityClient";
import Image from "next/image";
import Link from "next/link";

export const MatchCard = ({ match }) => {
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
      <div className="flex items-center justify-between mb-4 font-montserrat">
        <div className="text-xs sm:text-sm text-[#36053A]/50 font-semibold font-montserrat">
          {formattedDate} • {match.time}
        </div>
        {match.status && (
          <span
            className={`text-[10px] sm:text-xs px-2 py-1 font-semibold  text-[#36053A]/80 rounded-full font-montserrat ${getStatusStyle(
              match.status
            )}`}
          >
            {match.status.toUpperCase()}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between  mb-5 font-montserrat">
        <div className="flex flex-col items-center w-1/3  p-2 font-montserrat">
          <Image
            src={getImageSrc(match.homeLogo)}
            alt={match.homeTeam}
            width={48}
            height={48}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full  object-center  object-cover  mb-2"
          />
          <span className="text-xs sm:text-sm text-[#36053A]/80 text-center font-semibold font-montserrat">
            {match.homeTeam}
          </span>
        </div>

        <div className="text-lg sm:text-xl font-semibold text-[#36053A]/80 font-montserrat">
          {match.status === "completed" &&
          match.homeScore != null &&
          match.awayScore != null
            ? `${match.homeScore} - ${match.awayScore}`
            : "VS"}
        </div>

        <div className="flex flex-col items-center w-1/3 font-montserrat">
          <Image
            src={getImageSrc(match.awayLogo)}
            alt={match.awayTeam}
            width={48}
            height={48}
            className="w-10 h-10 sm:w-12 sm:h-12  rounded-full overflow-hidden object-center  object-cover  mb-2"
          />
          <span className="text-xs sm:text-sm font-semibold text-[#36053A]/80 text-center font-montserrat">
            {match.awayTeam}
          </span>
        </div>
      </div>
    </Link>
  );
};
