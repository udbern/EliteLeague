"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCompetition } from "@/components/CompetitionProvider";
import { useSeason } from "@/components/SeasonProvider";
import StandingsTableFull from "@/components/standings/StandingsTableFull";
import { MatchCard } from "@/components/MatchCard";
import CupStages from "@/components/CupStages";
import client from "@/lib/sanityClient";
import Image from "next/image";
import { urlFor } from "@/lib/sanityClient";
import Load from "@/assets/logo.png";
import { formatFixtureTime } from "@/lib/utils";
import "@/styles/scrollbar.css";

export default function CompetitionsPage() {
  const searchParams = useSearchParams();
  const competitionId = searchParams.get('comp');
  const { selectedCompetition, setSelectedCompetition, competitions, loading: competitionsLoading } = useCompetition();
  const { selectedSeason } = useSeason();
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("standings");

  useEffect(() => {
    if (competitionId) {
      const competition = competitions.find(c => c._id === competitionId);
      if (competition) {
        setSelectedCompetition(competition);
      }
    }
  }, [competitionId, competitions, setSelectedCompetition]);

  useEffect(() => {
    const fetchFixtures = async () => {
      if (!selectedCompetition?._id || !selectedSeason?._id) return;
      
      setLoading(true);
      try {
        const query = `
          *[_type == "fixture" && season._ref == $seasonId && competition._ref == $competitionId] | order(matchDate asc) {
            _id,
            matchDate,
            status,
            round,
            homeScore,
            awayScore,
            "homeTeam": homeTeam->{name, logo},
            "awayTeam": awayTeam->{name, logo}
          }
        `;
        
        const result = await client.fetch(query, { 
          seasonId: selectedSeason._id,
          competitionId: selectedCompetition._id 
        });
        
        setFixtures(result);
      } catch (error) {
        console.error("Error fetching fixtures:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFixtures();
  }, [selectedCompetition, selectedSeason]);

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

  const handleCompetitionChange = (e) => {
    const competition = competitions.find(c => c._id === e.target.value);
    setSelectedCompetition(competition);
  };

  if (!selectedSeason) {
    return (
      <div className="container mx-auto px-4 py-15 flex justify-center font-semibold font-montserrat">
        <div className="bg-white rounded-[14px] w-full md:w-[50rem] p-4">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2 font-montserrat">
              Select a Season
            </h3>
            <p className="text-gray-500 font-montserrat">
              Please select a season to view competitions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (competitionsLoading) {
    return (
      <div className="container mx-auto px-4 py-15 flex justify-center font-semibold font-montserrat">
        <div className="bg-white rounded-[14px] w-full md:w-[50rem] p-4">
          <div className="flex justify-center items-center py-20">
            <Image src={Load} alt="Loading" className="animate-pulse object-center object-contain" width={30} height={30} />
          </div>
        </div>
      </div>
    );
  }

  if (competitions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-15 flex justify-center font-semibold font-montserrat">
        <div className="bg-white rounded-[14px] w-full md:w-[50rem] p-4">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2 font-montserrat">
              No Competitions Available
            </h3>
            <p className="text-gray-500 font-montserrat">
              No competitions have been created for {selectedSeason.name} yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedCompetition) {
    return (
      <div className="container mx-auto px-4 py-15 flex justify-center font-semibold font-montserrat">
        <div className="bg-white rounded-[14px] w-full md:w-[50rem] p-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#36053A] font-montserrat mb-4">
              Competitions
            </h1>
            <p className="text-gray-600 font-montserrat mb-6">
              Select a competition to view its standings and fixtures.
            </p>
            
            {/* Competition Selector */}
            <div className="mb-6">
              <label htmlFor="competition-select" className="block text-sm font-medium text-gray-700 font-montserrat mb-2">
                Choose Competition
              </label>
              <select
                id="competition-select"
                value=""
                onChange={handleCompetitionChange}
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36053A] focus:border-transparent font-montserrat"
              >
                <option value="">Select a competition...</option>
                {competitions.map((competition) => (
                  <option key={competition._id} value={competition._id}>
                    {competition.name} ({competition.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Available Competitions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions.map((competition) => (
              <div
                key={competition._id}
                onClick={() => setSelectedCompetition(competition)}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border border-gray-200"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-[#36053A] to-[#622085] rounded-full">
                    {getImageSrc(competition.logo) ? (
                      <Image
                        src={getImageSrc(competition.logo)}
                        alt={competition.name}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xl">
                        {getCompetitionIcon(competition.type)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#36053A] font-montserrat">
                      {competition.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-montserrat capitalize">
                      {competition.type}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-montserrat">
                  {competition.description || `View ${competition.type} standings and fixtures.`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-15 flex justify-center font-semibold font-montserrat">
      <div className="bg-white rounded-[14px] w-full md:w-[50rem] p-4">
        {/* Competition Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-[#36053A] to-[#622085] rounded-full">
                {getImageSrc(selectedCompetition.logo) ? (
                  <Image
                    src={getImageSrc(selectedCompetition.logo)}
                    alt={selectedCompetition.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl">
                    {getCompetitionIcon(selectedCompetition.type)}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#36053A] font-montserrat">
                  {selectedCompetition.name}
                </h1>
                <p className="text-gray-600 font-montserrat capitalize">
                  {selectedCompetition.type} • {selectedSeason?.name}
                </p>
              </div>
            </div>
            
            {/* Competition Selector */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedCompetition._id}
                onChange={handleCompetitionChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36053A] focus:border-transparent font-montserrat"
              >
                {competitions.map((competition) => (
                  <option key={competition._id} value={competition._id}>
                    {competition.name}
                  </option>
                ))}
              </select>
              
              {selectedCompetition.isActive && (
                <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 text-sm font-semibold font-montserrat">Active</span>
                </div>
              )}
            </div>
          </div>
          
          {selectedCompetition.description && (
            <p className="text-gray-600 font-montserrat mb-4">
              {selectedCompetition.description}
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("standings")}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors font-montserrat ${
                activeTab === "standings"
                  ? "bg-white text-[#36053A] shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Standings
            </button>
            <button
              onClick={() => setActiveTab("fixtures")}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors font-montserrat ${
                activeTab === "fixtures"
                  ? "bg-white text-[#36053A] shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Fixtures
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "standings" && (
          <StandingsTableFull />
        )}

        {activeTab === "fixtures" && (
          <div>
            {selectedCompetition.type === 'cup' ? (
              <CupStages />
            ) : (
              <>
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Image src={Load} alt="Loading" className="animate-pulse object-center object-contain" width={30} height={30} />
                  </div>
                ) : fixtures.length > 0 ? (
                  <div className="space-y-3">
                    {fixtures.map((match) => (
                      <MatchCard key={match._id} match={{
                        id: match._id,
                        date: match.matchDate,
                        time: formatFixtureTime(match.matchDate),
                        homeTeam: match.homeTeam.name,
                        homeLogo: match.homeTeam.logo,
                        awayTeam: match.awayTeam.name,
                        awayLogo: match.awayTeam.logo,
                        homeScore: match.homeScore,
                        awayScore: match.awayScore,
                        status: match.status,
                      }} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 font-montserrat">No fixtures available for this competition.</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 