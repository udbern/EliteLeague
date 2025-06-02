import sanityClient from "./sanityClient";

export async function fetchTopScorers(seasonId) {
  const query = `
    *[_type == "fixture" && season._ref == $seasonId && status == "completed"] {
      homeGoalScorers[] {
        playerName,
        goals,
        team->{name, shortName, logo}
      },
      awayGoalScorers[] {
        playerName,
        goals,
        team->{name, shortName, logo}
      }
    }
  `;

  try {
    const fixtures = await sanityClient.fetch(query, { seasonId });

    const goalMap = new Map();

    fixtures.forEach(fixture => {
      const allScorers = [...(fixture.homeGoalScorers || []), ...(fixture.awayGoalScorers || [])];

      allScorers.forEach(({ playerName, goals, team }) => {
        if (!playerName || !goals) return;

        const key = `${playerName}-${team?.name}`;
        const existing = goalMap.get(key);

        if (existing) {
          existing.goals += goals;
        } else {
          goalMap.set(key, {
            player: playerName,
            team: team?.name || "Unknown",
            shortName: team?.shortName || team?.name || "Unknown",
            teamLogo: team?.logo,
            goals,
          });
        }
      });
    });

    const scorers = Array.from(goalMap.values())
      .sort((a, b) => b.goals - a.goals)
      .map((scorer, index) => ({
        ...scorer,
        position: index + 1,
      }));

    return scorers;
  } catch (error) {
    console.error("Failed to fetch top scorers:", error);
    return [];
  }
}
