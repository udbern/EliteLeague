"use client";

import React, { useEffect, useState } from "react";

const TableHeader = ({ children, className = "" }) => (
  <th
    className={`px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm md:text-base font-semibold text-[#36053A]/80 ${className}`}
  >
    {children}
  </th>
);

const TableCell = ({ children, className = "" }) => (
  <td
    className={`px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base text-[#36053A]/80 ${className}`}
  >
    {children}
  </td>
);

// Mock data - Replace with API data
const standingsData = [
  {
    position: 1,
    team: "Arsenal",
    played: 28,
    goalDifference: 46,
    points: 64,
    logo: "/teams/arsenal.png",
  },
  {
    position: 2,
    team: "Liverpool",
    played: 28,
    goalDifference: 39,
    points: 64,
    logo: "/teams/liverpool.png",
  },
  {
    position: 3,
    team: "Manchester City",
    played: 28,
    goalDifference: 35,
    points: 63,
    logo: "/teams/mancity.png",
  },
];

export default function StandingsTable() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <section className="mb-8 sm:mb-10 md:mb-12">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#36053A]/80 mb-4 sm:mb-5 md:mb-6 font-montserrat">
          Top 3
        </h2>
        <div className="bg-white rounded-lg overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <TableHeader className="w-8 sm:w-10 md:w-12 text-center">
                    Pos
                  </TableHeader>
                  <TableHeader>Club</TableHeader>
                  <TableHeader className="text-start">P</TableHeader>
                  <TableHeader className="text-start">GD</TableHeader>
                  <TableHeader className="text-start">Pts</TableHeader>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr>
                  <TableCell colSpan={5} className="text-center py-4">
                    Loading...
                  </TableCell>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8 sm:mb-10 md:mb-12 p-4 bg-white rounded-lg overflow-hidden backdrop-blur-sm">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#36053A]/80 mb-4 sm:mb-5 md:mb-6 font-montserrat">
        Top 3
      </h2>
      <div className="">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <TableHeader className="w-8 sm:w-10 md:w-12 text-center">
                  Pos
                </TableHeader>
                <TableHeader>Club</TableHeader>
                <TableHeader className="text-start">P</TableHeader>
                <TableHeader className="text-start">GD</TableHeader>
                <TableHeader className="text-start">Pts</TableHeader>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {standingsData.map((team) => (
                <tr
                  key={team.position}
                  className="hover:bg-white/5 transition-colors"
                >
                  <TableCell className="text-center font-bold">
                    {team.position}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 relative">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-700 rounded-full" />
                      </div>
                      <span className="font-medium text-[#36053A]/80 truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
                        {team.team}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-start">{team.played}</TableCell>
                  <TableCell className="text-start">
                    {team.goalDifference}
                  </TableCell>
                  <TableCell className="text-start font-bold">
                    {team.points}
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
