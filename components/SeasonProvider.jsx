"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import sanityClient from "@/lib/sanityClient";

// Create a context for season data
export const SeasonContext = createContext(null);

export const useSeason = () => {
  const context = useContext(SeasonContext);
  if (!context) {
    throw new Error('useSeason must be used within a SeasonProvider');
  }
  return context;
};

export const SeasonProvider = ({ children }) => {
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const fetchedSeasons = await sanityClient.fetch(
          `*[_type == "season"] | order(startDate desc) {
            _id,
            name,
            isActive,
            startDate,
            endDate
          }`
        );
        setSeasons(fetchedSeasons);
        
        // Try to get the season from localStorage first
        const storedSeason = localStorage.getItem('selectedSeason');
        if (storedSeason) {
          const parsedSeason = JSON.parse(storedSeason);
          // Verify the stored season still exists in fetched seasons
          const seasonExists = fetchedSeasons.some(s => s._id === parsedSeason._id);
          if (seasonExists) {
            setSelectedSeason(parsedSeason);
            return;
          }
        }
        
        // If no stored season or it doesn't exist anymore, set the active season
        const activeSeason = fetchedSeasons.find(s => s.isActive);
        if (activeSeason) {
          setSelectedSeason(activeSeason);
        } else if (fetchedSeasons.length > 0) {
          setSelectedSeason(fetchedSeasons[0]);
        }
      } catch (error) {
        console.error('Error fetching seasons:', error);
      }
    };

    fetchSeasons();
    setIsMounted(true);
  }, []);

  // Store selected season in localStorage and trigger a custom event
  useEffect(() => {
    if (selectedSeason) {
      localStorage.setItem('selectedSeason', JSON.stringify(selectedSeason));
      // Dispatch a custom event that other components can listen to
      window.dispatchEvent(new CustomEvent('seasonChanged', { 
        detail: { season: selectedSeason }
      }));
    }
  }, [selectedSeason]);

  if (!isMounted) {
    return null;
  }

  return (
    <SeasonContext.Provider value={{ selectedSeason, setSelectedSeason, seasons }}>
      {children}
    </SeasonContext.Provider>
  );
}; 