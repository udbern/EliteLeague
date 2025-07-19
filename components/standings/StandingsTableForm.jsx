"use client";
import React from "react";
import { TableHeader, TableCell, FormIndicator } from "./TableHelpers";
import TeamLogo from "@/components/ui/TeamLogo";

const StandingsTableForm = ({ data, title }) => {
  if (!data || data.length === 0) {
    return (
      <section className="mb-[12px] pl-1 pr-1 pt-6 pb-[18px] md:pl-6 md:pr-6 bg-white rounded-[14px] overflow-hidden backdrop-blur-sm">
        <div className="text-center py-8">
          <p className="text-gray-500 font-montserrat">No standings data available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-[12px] font-montserrat  pl-1 pr-1 pt-6 pb-[18px] md:pl-6 md:pr-6 bg-white rounded-[14px] overflow-hidden backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full font-montserrat font-semibold text-[10px] sm:text-xs md:text-sm">
          <thead>
            <tr>
              <TableHeader className="text-center">Pos</TableHeader>
              <TableHeader className="text-start">Club</TableHeader>
              <TableHeader className="text-start">Last 10 Matches</TableHeader>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((team, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <TableCell className="text-center font-bold">
                  {team.position}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 md:gap-2">
                    {team.logo && (
                      <TeamLogo
                        logo={team.logo}
                        alt={team.name}
                        size={24}
                        className="w-[16px] h-[16px] md:w-[24px] md:h-[24px]"
                      />
                    )}
                    <span className="font-semibold text-[10px] md:text-sm truncate max-w-[100px] md:max-w-full">{team.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {team.form?.slice().reverse().map((result, index) => (
                      <FormIndicator key={index} result={result} />
                    ))}
                  </div>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default StandingsTableForm;
