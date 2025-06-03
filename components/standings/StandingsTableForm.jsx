"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import fetchStandings from "../../lib/fetchStandings";
import { TableHeader, TableCell, FormIndicator } from "./TableHelpers";
import { urlFor } from "@/lib/sanityClient";
import { useSeason } from "@/components/SeasonProvider";
import "./loader.css";
import Load from "@/assets/logo.png"

const StandingsTableForm = ({ title }) => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedSeason } = useSeason();

  useEffect(() => {
    const getStandings = async () => {
      if (!selectedSeason?._id) return;
      
      setLoading(true);
      try {
        const data = await fetchStandings(selectedSeason._id);
        setStandings(data);
      } catch (error) {
        console.error('Error fetching standings:', error);
      } finally {
        setLoading(false);
      }
    };
    getStandings();
  }, [selectedSeason]);

  if (loading) {
    return (
      <section className="mb-[12px] pl-2 pr-2 pt-6 pb-[18px] md:pl-6 md:pr-6 bg-white rounded-[14px] font-montserrat overflow-hidden backdrop-blur-sm">
        <div className="flex justify-center items-center py-4">
        <Image src={Load} alt="Loading" className="animate-pulse object-center object-contain" width={30} height={30} />

        </div>
      </section>
    );
  }

  return (
    <section className="mb-[12px] font-montserrat pl-1 pr-1 pt-6 pb-[18px] md:pl-6 md:pr-6 bg-white rounded-[14px] overflow-hidden backdrop-blur-sm">
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
            {standings.map((team, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <TableCell className="text-center font-bold">
                  {team.position}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 md:gap-2">
                    {team.logo && (
                      <Image
                        src={urlFor(team.logo).width(40).height(40).url()}
                        alt={team.name}
                        width={20}
                        height={20}
                        className="rounded-full object-contain w-[16px] h-[16px] md:w-[24px] md:h-[24px]"
                      />
                    )}
                    <span className="font-semibold text-[10px] md:text-sm truncate max-w-[100px] md:max-w-full">{team.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {team.form?.map((result, index) => (
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
