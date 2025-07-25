"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchTopScorers } from "../../lib/fetchScorers";
import { urlFor } from "../../lib/sanityClient";
import Image from "next/image";
import { useSeason } from "@/components/SeasonProvider";
import { useCompetition } from "@/components/CompetitionProvider";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import TeamLogo from "@/components/ui/TeamLogo";

import Load from "@/assets/logo.png"

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
        <TeamLogo
          logo={player.teamLogo}
          alt={player.team}
          size={24}
          className="mr-2"
        />
        <span className="font-bold text-[#36053A]/80 truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
          {player.player}
        </span>
      </div>
    </TableCell>
    <TableCell className="text-[#36053A]/80 truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
      {player.shortName}
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
  const { selectedCompetition } = useCompetition();

  useEffect(() => {
    const loadScorers = async () => {
      if (!selectedSeason?._id || !selectedCompetition?._id) return;

      setLoading(true);
      try {
        const data = await fetchTopScorers(selectedSeason._id, selectedCompetition._id);
        setScorers(data);
      } catch (error) {
        console.error("Error loading scorers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadScorers();
  }, [selectedSeason, selectedCompetition]);

  const initialScorers = scorers.slice(0, 3);
  const displayedScorers = showAll ? scorers : initialScorers;

  if (loading) {
    return (
      <section className="mb-8 sm:mb-10 md:mb-12 font-montserrat p-4 bg-white rounded-[14px] overflow-hidden backdrop-blur-sm">
        <div className="flex justify-center items-center py-8">
        <Image src={Load} alt="Loading" className="animate-pulse object-center object-contain" width={30} height={30} />
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
      <div className={`overflow-hidden font-montserrat ${showAll ? 'max-h-[450px] md:max-h-[550px] overflow-y-auto custom-scrollbar' : ''}`}>
          <table className="w-full">
            <thead className="bg-white/10 sticky top-0 z-10">
              <tr>
                <TableHeader className="w-8 sm:w-10 md:w-12 text-start bg-white">
                  Pos
                </TableHeader>
                <TableHeader className="bg-white">Player</TableHeader>
                <TableHeader className="bg-white">Club</TableHeader>
                <TableHeader className="text-start bg-white">Goals</TableHeader>
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
              className="w-fit text-[#36053A]/80 border cursor-pointer hover:bg-white/20 flex items-center gap-2"
            >
              <span>{showAll ? "Show Less" : "Show All"}</span>
              <motion.span
                animate={{ rotate: showAll ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.92 }}
                className="inline-block"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.span>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #36053A40;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #36053A60;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = customScrollbarStyles;
  document.head.appendChild(styleSheet);
}
