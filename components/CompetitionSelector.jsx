"use client";
import React from "react";
import { useCompetition } from "./CompetitionProvider";
import Image from "next/image";
import { urlFor } from "@/lib/sanityClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CompetitionSelector = () => {
  const { competitions, selectedCompetition, setSelectedCompetition, loading } = useCompetition();

  const getCompetitionIcon = (type) => {
    switch (type) {
      case 'league':
        return '🏆';
      case 'cup':
        return '🥇';
      case 'championship':
        return '⭐';
      case 'friendly':
        return '🤝';
      default:
        return '⚽';
    }
  };

  const getImageSrc = (logo) => {
    if (logo && logo.asset?._ref) {
      return urlFor(logo).url();
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (competitions.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 font-montserrat">
        No competitions available for this season.
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold font-montserrat text-[#36053A]/80">
          Competition
        </h3>
        {selectedCompetition && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 font-montserrat">Active:</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        )}
      </div>
      
      <Select 
        value={selectedCompetition?._id || ""} 
        onValueChange={(value) => {
          const competition = competitions.find(c => c._id === value);
          setSelectedCompetition(competition);
        }}
      >
        <SelectTrigger className="w-full md:w-[300px] bg-white border-[#36053A]/20 focus:border-[#36053A] font-montserrat">
          <SelectValue placeholder="Select a competition">
            {selectedCompetition && (
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  {getImageSrc(selectedCompetition.logo) ? (
                    <Image
                      src={getImageSrc(selectedCompetition.logo)}
                      alt={selectedCompetition.name}
                      width={24}
                      height={24}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg">
                      {getCompetitionIcon(selectedCompetition.type)}
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-[#36053A]">
                    {selectedCompetition.name}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {selectedCompetition.type}
                  </div>
                </div>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        
        <SelectContent className="bg-white border-[#36053A]/20 font-montserrat max-h-[300px] overflow-y-auto">
          {competitions.map((competition) => {
            const logoUrl = getImageSrc(competition.logo);
            
            return (
              <SelectItem 
                key={competition._id} 
                value={competition._id}
                className="focus:bg-[#36053A]/10 focus:text-[#36053A] cursor-pointer"
              >
                <div className="flex items-center space-x-3 py-1">
                  <div className="w-6 h-6 flex items-center justify-center">
                    {logoUrl ? (
                      <Image
                        src={logoUrl}
                        alt={competition.name}
                        width={24}
                        height={24}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg">
                        {getCompetitionIcon(competition.type)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {competition.name}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {competition.type}
                    </div>
                  </div>
                  {competition.isActive && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CompetitionSelector; 