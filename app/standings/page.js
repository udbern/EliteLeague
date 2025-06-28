"use client";

import React, { useState } from "react";
import StandingsTable from "@/components/standings/StandingsTable";
import StandingsTableFull from "@/components/standings/StandingsTableFull";
import { useCompetition } from "@/components/CompetitionProvider";
import { useSeason } from "@/components/SeasonProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StandingsPage() {
  const [activeTab, setActiveTab] = useState("short");
  const { selectedCompetition } = useCompetition();
  const { selectedSeason } = useSeason();

  if (!selectedSeason) {
    return (
      <div className="container mx-auto px-4 py-15  flex justify-center font-semibold font-montserrat">
        <div className="bg-white rounded-[14px] w-full md:w-[50rem] p-4">
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 font-montserrat">
              Select a Season
            </h3>
            <p className="text-gray-500 font-montserrat">
              Please select a season to view standings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedCompetition) {
    return (
      <div className="container mx-auto  px-4 py-15 flex justify-center font-semibold font-montserrat">
        <div className="bg-white rounded-[14px] w-full md:w-[50rem] p-4">
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 font-montserrat">
              Select a Competition
            </h3>
            <p className="text-gray-500 font-montserrat">
              Please select a competition from the dropdown in the navigation to view its standings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4  py-10 flex justify-center font-semibold font-montserrat">
      <div className="w-full md:w-[50rem]">
        <Tabs defaultValue="short" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-white/80 backdrop-blur-sm p-1 rounded-lg">
            <TabsTrigger 
              value="short" 
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === "short" 
                  ? "custom-gradient-3 text-white" 
                  : "text-[#36053A] hover:bg-[#36053A]/10"
              }`}
            >
              Short
            </TabsTrigger>
            <TabsTrigger 
              value="full" 
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === "full" 
                  ? "custom-gradient-3 text-white" 
                  : "text-[#36053A] hover:bg-[#36053A]/10"
              }`}
            >
              Full
            </TabsTrigger>
            <TabsTrigger 
              value="form" 
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === "form" 
                  ? "custom-gradient-3 text-white" 
                  : "text-[#36053A] hover:bg-[#36053A]/10"
              }`}
            >
              Form
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="short">
            <div className="bg-white rounded-[14px] p-4">
              <StandingsTable showFull={true} view="short" />
            </div>
          </TabsContent>
          
          <TabsContent value="full">
            <div className="bg-white rounded-[14px] p-4">
              <StandingsTableFull />
            </div>
          </TabsContent>
          
          <TabsContent value="form">
            <div className="bg-white rounded-[14px] p-4">
              <StandingsTable showFull={true} view="form" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}