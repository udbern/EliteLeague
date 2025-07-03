"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useCompetition } from "@/components/CompetitionProvider";
import { useSeason } from "@/components/SeasonProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

const TABS = [
  { name: "Overview", path: "/" },
  { name: "Standings", path: "/standings" },
  { name: "Fixtures", path: "/fixtures" },
];

const Tabs = () => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);
  const [competitionDropdownOpen, setCompetitionDropdownOpen] = useState(false);
  const { selectedCompetition, setSelectedCompetition, competitions, loading } = useCompetition();
  const { selectedSeason } = useSeason();

  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  // Debug logging
  useEffect(() => {
    console.log("🏷️ TABS - COMPETITIONS STATE:", {
      competitionsCount: competitions.length,
      competitions: competitions.map(c => ({ id: c._id, name: c.name, type: c.type })),
      selectedCompetition: selectedCompetition ? { id: selectedCompetition._id, name: selectedCompetition.name, type: selectedCompetition.type } : null,
      loading: loading,
      selectedSeason: selectedSeason?.name
    });
  }, [competitions, selectedCompetition, loading, selectedSeason]);

  const handleCompetitionChange = (competitionId) => {
    console.log("🔄 COMPETITION CHANGED TO:", competitionId);
    const competition = competitions.find(c => c._id === competitionId);
    if (competition) {
      console.log("✅ SETTING COMPETITION TO:", competition.name);
      setSelectedCompetition(competition);
    }
  };

  return (
    <div className="w-full  overflow-x-auto">

      <div className="max-w-5xl mx-auto px-4">
        <nav className="flex items-center space-x-1.5 md:space-x-4 font-montserrat py-1 scrollbar-hide">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.path;
            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`relative whitespace-nowrap px-1 py-2 text-sm font-bold transition-colors
                  ${
                    isActive
                      ? "text-white"
                      : "text-white/60 hover:text-white/80 "
                  }`}
              >
                {tab.name}
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                    layoutId="activeTab"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
          
          {/* Competition Selector */}
          {selectedSeason && (
            <div className="flex items-center">
              <Select
                value={selectedCompetition?._id || ""}
                onValueChange={handleCompetitionChange}
                disabled={loading || competitions.length === 0}
                open={competitionDropdownOpen}
                onOpenChange={setCompetitionDropdownOpen}
              >
                <SelectTrigger className="bg-transparent border-none outline-0 cursor-pointer text-white hover:text-white/80 p-1 h-auto font-bold text-sm font-montserrat focus:ring-none focus:ring-transparent shadow-none [&>svg]:hidden">
                  <div className="flex items-center space-x-1">
                    <span className="whitespace-nowrap">
                      {loading 
                        ? "Loading..." 
                        : competitions.length === 0
                        ? "No Competitions"
                        : selectedCompetition?.name || "Competition"
                      }
                    </span>
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform duration-200 ease-in-out ${competitionDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white font-montserrat mt-2 shadow-none border border-gray-200">
                  {competitions.map((competition) => (
                    <SelectItem 
                      key={competition._id} 
                      value={competition._id}
                      className="text-gray-800 hover:bg-gradient-to-r cursor-pointer from-[#453DE4]/80 via-[#A723EE]/100 to-[#96F6E6]/100 hover:text-white"
                    >
                      {competition.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Tabs;
