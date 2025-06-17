"use client";
import React, { useState, useEffect } from "react";
import fetchStandings from "../../lib/fetchStandings";
import { useSeason } from "@/components/SeasonProvider";
import { useCompetition } from "@/components/CompetitionProvider";
import StandingsTableFull from "./StandingsTableFull";
import StandingsTableShort from "./StandingsTableShort";
import StandingsTableForm from "./StandingsTableForm";
import Image from "next/image";
import Load from "@/assets/logo.png";

export default function StandingsTable({ showFull = false, view = "full" }) {
  const [isMounted, setIsMounted] = useState(false);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedSeason } = useSeason();
  const { selectedCompetition } = useCompetition();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const getStandings = async () => {
      if (!selectedSeason?._id || !selectedCompetition?._id) {
        setStandings([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const data = await fetchStandings(selectedSeason._id, selectedCompetition._id);
        setStandings(data);
      } catch (error) {
        console.error('Error fetching standings:', error);
        setStandings([]);
      } finally {
        setLoading(false);
      }
    };
    getStandings();
  }, [selectedSeason, selectedCompetition]);

  const displayData = showFull ? standings : standings.slice(0, 3);
  const title = selectedCompetition ? `${selectedCompetition.name} Standings` : "Standings";

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

  if (loading) {
    return (
      <section className="mb-[12px] pl-1 pr-1 pt-6 pb-[18px] md:pl-6 md:pr-6 bg-white rounded-[14px] overflow-hidden backdrop-blur-sm">
        <div className="flex justify-center items-center py-8">
          <Image src={Load} alt="Loading" className="animate-pulse object-center object-contain" width={30} height={30} />
        </div>
      </section>
    );
  }

  if (!selectedSeason) {
    return (
      <section className="mb-[12px] pl-1 pr-1 pt-6 pb-[18px] md:pl-6 md:pr-6 bg-white rounded-[14px] overflow-hidden backdrop-blur-sm">
        <div className="text-center py-8">
          <p className="text-gray-500 font-montserrat">Please select a season to view standings.</p>
        </div>
      </section>
    );
  }

  if (!selectedCompetition) {
    return (
      <section className="mb-[12px] pl-1 pr-1 pt-6 pb-[18px] md:pl-6 md:pr-6 bg-white rounded-[14px] overflow-hidden backdrop-blur-sm">
        <div className="text-center py-8">
          <p className="text-gray-500 font-montserrat">Please select a competition to view standings.</p>
        </div>
      </section>
    );
  }

  if (standings.length === 0) {
    return (
      <section className="mb-[12px] pl-1 pr-1 pt-6 pb-[18px] md:pl-6 md:pr-6 bg-white rounded-[14px] overflow-hidden backdrop-blur-sm">
        <div className="text-center py-8">
          <p className="text-gray-500 font-montserrat">No standings data available for {selectedCompetition.name}.</p>
        </div>
      </section>
    );
  }

  switch (view) {
    case "form":
      return <StandingsTableForm data={displayData} title={title} />;
    case "short":
      return <StandingsTableShort data={displayData} title={title} />;
    case "full":
    default:
      return <StandingsTableFull data={displayData} title={title} />;
  }
}
