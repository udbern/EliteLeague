"use client";

import React, { useState } from "react";
import StandingsTable from "@/components/standings/StandingsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StandingsPage() {
  const [activeTab, setActiveTab] = useState("short");

  return (
    <main className=" mt-6">
      <div className="max-w-5xl mx-auto px-4">
        
        
        <Tabs defaultValue="short" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-white/80 backdrop-blur-sm p-1 rounded-lg">
            <TabsTrigger 
              value="short" 
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === "short" 
                  ? "bg-[#36053A] text-white" 
                  : "text-[#36053A] hover:bg-[#36053A]/10"
              }`}
            >
              Short
            </TabsTrigger>
            <TabsTrigger 
              value="full" 
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === "full" 
                  ? "bg-[#36053A] text-white" 
                  : "text-[#36053A] hover:bg-[#36053A]/10"
              }`}
            >
              Full
            </TabsTrigger>
            <TabsTrigger 
              value="form" 
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === "form" 
                  ? "bg-[#36053A] text-white" 
                  : "text-[#36053A] hover:bg-[#36053A]/10"
              }`}
            >
              Form
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="short">
            <StandingsTable showFull={true} view="short" />
          </TabsContent>
          
          <TabsContent value="full">
            <StandingsTable showFull={true} view="full" />
          </TabsContent>
          
          <TabsContent value="form">
            <StandingsTable showFull={true} view="form" />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}