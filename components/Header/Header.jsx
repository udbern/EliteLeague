"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { ChevronDown } from "lucide-react";
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
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
      <nav className="custom-gradient-4">
        {/* Top Bar */}
        <div className="flex justify-between items-center px-3 py-2  md:px-4 md:max-w-5xl md:mx-auto">
          {/* Logo Section */}
          <div className="flex items-center">
            <Logo className="h-10 mr-4" />
          </div>

          {/* Season Selector */}
          <div className="flex items-center font-montserrat">
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="text-white cursor-pointer font-montserrat overflow-hidden font-semibold border-gray-100 hover:bg-white/10 hover:text-white focus:ring-1 focus:ring-transparent"
                >
                  <span className="flex items-center gap-2">
                    {selectedSeason.name}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ease-in-out ${dropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </span>
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
                    className={`text-[#36053A] font-montserrat cursor-pointer font-semibold hover:bg-gradient-to-r  from-[#453DE4]/80 via-[#A723EE]/100 to-[#96F6E6]/100 hover:text-white flex items-center justify-between`}
                  >
                    <div className="flex flex-col">
                      <span>{season.name}</span>
                      <span className="text-xs ">
                        {season.startDate} - {season.endDate}
                      </span>
                    </div>
                    {season.isActive && (
                      <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
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
