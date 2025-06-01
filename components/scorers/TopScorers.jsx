"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchTopScorers } from "../../lib/fetchScorers";
import { urlFor } from "../../lib/sanityClient";
import Image from "next/image";
import { useSeason } from "@/components/SeasonProvider";
import { Button } from "@/components/ui/button";

const TableHeader = ({ children, className = "" }) => (
  <th
    className={`px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm md:text-base font-montserrat font-semibold text-[#36053A]/80 ${className}`}
  >
    {children}
  </th>
);

const TableCell = ({ children, className = "" }) => (
  <td
    className={`px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base font-bold text-[#36053A]/80 ${className}`}
  >
    {children}
  </td>
);

const rowVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const avatarVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24, delay: 0.2 },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24, delay: 0.3 },
  },
  hover: {
    scale: 1.02,
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
  tap: {
    scale: 0.98,
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
};

const AnimatedScorerRow = ({ player }) => (
  <motion.tr
    key={player.position}
    variants={rowVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    layout
    className="font-montserrat"
  >
    <TableCell className="w-8 sm:w-10 md:w-12 text-center font-bold">
      {player.position}
    </TableCell>
    <TableCell>
      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
        <Image
          src={
            player.teamLogo
              ? urlFor(player.teamLogo).url()
              : "/default-logo.png"
          }
          alt={player.team}
          width={24}
          height={24}
          className="object-contain object-center rounded-full"
        />
        <span className="font-bold text-[#36053A]/80 truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
          {player.player}
        </span>
      </div>
    </TableCell>
    <TableCell className="text-[#36053A]/80 truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
      {player.team}
    </TableCell>
    <TableCell className="text-start font-bold text-[#36053A]/80">
      {player.goals}
    </TableCell>
  </motion.tr>
);

export default function TopScorers() {
  const [scorers, setScorers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { selectedSeason } = useSeason();

  useEffect(() => {
    const loadScorers = async () => {
      if (!selectedSeason?._id) return;
      
      setLoading(true);
      try {
        const data = await fetchTopScorers(selectedSeason._id);
        setScorers(data);
      } catch (error) {
        console.error('Error loading scorers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadScorers();
  }, [selectedSeason]);

  const initialScorers = scorers.slice(0, 3);
  const displayedScorers = showAll ? scorers : initialScorers;

  if (loading) {
    return (
      <section className="mb-8 sm:mb-10 md:mb-12 font-montserrat p-4 bg-white rounded-[14px] overflow-hidden backdrop-blur-sm">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#36053A]"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8 sm:mb-10 md:mb-12 font-montserrat p-4 bg-white rounded-[14px] overflow-hidden backdrop-blur-sm">
      <h2 className="text-lg font-bold text-[#36053A]/80 mb-4 sm:mb-5 md:mb-6 font-montserrat">
        Top Scorers
      </h2>
      <hr className="mb-2 text-[#36053A]/80" />
      <div className="">
        <div className="overflow-x-auto font-montserrat">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <TableHeader className="w-8 sm:w-10 md:w-12 text-start">Pos</TableHeader>
                <TableHeader>Player</TableHeader>
                <TableHeader>Club</TableHeader>
                <TableHeader className="text-start">Goals</TableHeader>
              </tr>
            </thead>
            <tbody className="divide-y font-bold divide-white/10">
              <AnimatePresence mode="popLayout">
                {displayedScorers.map((player) => (
                  <AnimatedScorerRow key={player.position} player={player} />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {scorers.length > 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-3 border-t flex justify-center border-white/10"
          >
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              className="w-fit text-[#36053A]/80 border hover:bg-white/20"
            >
              {showAll ? "Show Less" : "Show All"}
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
