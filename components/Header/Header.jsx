"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "../ui/logo";
import Tabs from "../Tabs/Tabs";
import { useSeason } from "@/components/SeasonProvider";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { selectedSeason, setSelectedSeason, seasons } = useSeason();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSeasonChange = (newSeason) => {
    // Only reload if it's a different season
    if (newSeason._id !== selectedSeason._id) {
      // Set the new season in localStorage
      localStorage.setItem('selectedSeason', JSON.stringify(newSeason));
      // Reload the page to fetch fresh data for the new season
      window.location.reload();
    }
  };

  if (!selectedSeason) {
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow duration-200 ${
        isScrolled ? "shadow-lg" : ""
      }`}
    >
      <nav className="bg-gradient-to-br from-[#622085] via-[#A112BA] to-[#0f5c4f]">
        {/* Top Bar */}
        <div className="flex justify-between items-center px-3 py-6 md:py-3 md:px-4 md:max-w-5xl md:mx-auto">
          {/* Logo Section */}
          <div className="flex items-center">
            <Logo className="h-10 mr-4" />
          </div>

          {/* Season Selector */}
          <div className="flex items-center font-montserrat">
            <DropdownMenu >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="text-white font-montserrat overflow-hidden font-semibold border-gray-100 hover:bg-white/10 hover:text-white focus:ring-1 focus:ring-transparent "
                >
                  {selectedSeason.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white/95 border-none shadow-none">
                {[...seasons].sort((a, b) => {
                  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                  return months.indexOf(a.startDate) - months.indexOf(b.startDate);
                }).map((season) => (
                  <DropdownMenuItem
                    key={season._id}
                    onClick={() => handleSeasonChange(season)}
                    className={`text-[#36053A] font-montserrat font-semibold hover:bg-[#36053A]/70 hover:text-white flex items-center justify-between`}
                  >
                    <div className="flex flex-col">
                      <span>{season.name}</span>
                      <span className="text-xs ">
                        {season.startDate} - {season.endDate}
                      </span>
                    </div>
                    {season.isActive && (
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs />
      </nav>
    </header>
  );
};

export default Header;
