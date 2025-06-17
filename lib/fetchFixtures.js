import client from "./sanityClient";

export async function fetchFixtures(seasonId, competitionId) {
  const query = `*[_type == "fixture" && season._ref == $seasonId && competition._ref == $competitionId] | order(date asc) {
    _id,
    date,
    status,
    round,
    homeScore,
    awayScore,
    venue,
    attendance,
    referee,
    homeTeamStats,
    awayTeamStats,
    matchEvents,
    "homeTeam": homeTeam->{name, "logo": logo.asset->url},
    "awayTeam": awayTeam->{name, "logo": logo.asset->url}
  }`;

  try {
    const result = await client.fetch(query, { seasonId, competitionId });
    return result;
  } catch (err) {
    console.error("Failed to fetch fixtures:", err);
    return [];
  }
}

export async function fetchFixtureById(id) {
  const query = `*[_type == "fixture" && _id == $id][0]{
    _id,
    date,
    status,
    round,
    homeScore,
    awayScore,
    venue,
    attendance,
    referee,
    homeTeamStats,
    awayTeamStats,
    matchEvents,
    "homeTeam": homeTeam->{name, "logo": logo.asset->url},
    "awayTeam": awayTeam->{name, "logo": logo.asset->url}
  }`;

  try {
    const result = await client.fetch(query, { id });
    return result;
  } catch (err) {
    console.error(`Failed to fetch fixture with ID ${id}:`, err);
    return null;
  }
}
