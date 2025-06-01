"use client";
import React, { useState, useEffect } from "react";
import mockStandings from "../data/mockStandings";
import StandingsTableFull from "./StandingsTableFull";
import StandingsTableShort from "./StandingsTableShort";
import StandingsTableForm from "./StandingsTableForm";

export default function StandingsTable({ showFull = false, view = "full" }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const displayData = showFull ? mockStandings : mockStandings.slice(0, 3);

  if (!isMounted) {
    return (
      <section className="mb-[12px]  ">
        <div className="bg-white rounded-lg  overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full ">
              <thead className="bg-white/10 font-montserrat">
                <tr>
                  <th className="px-2 py-2 text-left">Pos</th>
                  <th className="px-2 py-2 text-left">Club</th>
                  <th className="px-2 py-2 text-left">P</th>
                  <th className="px-2 py-2 text-left">GD</th>
                  <th className="px-2 py-2 text-left">Pts</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }

  switch (view) {
    case "form":
      return <StandingsTableForm data={displayData} />;
    case "short":
      return <StandingsTableShort data={displayData} />;
    case "full":
    default:
      return <StandingsTableFull data={displayData} />;
  }
}
