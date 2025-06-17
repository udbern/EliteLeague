import MatchStats from "@/components/MatchStats";
import { fetchFixtureById } from "@/lib/fetchFixtures";
import { notFound } from "next/navigation";

export default async function MatchStatsPage({ params }) {
  const { matchId } = params;
  const match = await fetchFixtureById(matchId);

  if (!match) {
    notFound();
  }

  return <MatchStats match={match} />;
} 