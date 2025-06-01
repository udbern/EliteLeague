import sanityClient from './sanityClient';

export async function updateStandingsForFixture(fixtureId) {
  // 1. Fetch fixture by ID
  const fixture = await sanityClient.fetch(
    `*[_type == "fixture" && _id == $fixtureId][0]{
      _id,
      homeTeam->{_id, name},
      awayTeam->{_id, name},
      homeScore,
      awayScore,
      status
    }`,
    { fixtureId }
  );

  if (!fixture || fixture.status !== 'completed') {
    // Fixture not found or not completed - do nothing or throw error
    return;
  }

  // 2. Calculate update data for both teams
  const updates = {};

  // Home team update
  updates[fixture.homeTeam._id] = {
    played: 1,
    wins: fixture.homeScore > fixture.awayScore ? 1 : 0,
    draws: fixture.homeScore === fixture.awayScore ? 1 : 0,
    losses: fixture.homeScore < fixture.awayScore ? 1 : 0,
    goalsFor: fixture.homeScore,
    goalsAgainst: fixture.awayScore,
    points:
      fixture.homeScore > fixture.awayScore
        ? 3
        : fixture.homeScore === fixture.awayScore
        ? 1
        : 0,
  };

  // Away team update
  updates[fixture.awayTeam._id] = {
    played: 1,
    wins: fixture.awayScore > fixture.homeScore ? 1 : 0,
    draws: fixture.awayScore === fixture.homeScore ? 1 : 0,
    losses: fixture.awayScore < fixture.homeScore ? 1 : 0,
    goalsFor: fixture.awayScore,
    goalsAgainst: fixture.homeScore,
    points:
      fixture.awayScore > fixture.homeScore
        ? 3
        : fixture.awayScore === fixture.homeScore
        ? 1
        : 0,
  };

  // 3. Fetch existing standings for these teams
  const standings = await sanityClient.fetch(
    `*[_type == "standing" && team._ref in $teamIds]`,
    { teamIds: Object.keys(updates) }
  );

  // 4. Build patch and create queries
  const patchQueries = [];

  for (const [teamId, update] of Object.entries(updates)) {
    const existing = standings.find((s) => s.team._ref === teamId);

    if (existing) {
      patchQueries.push(
        sanityClient
          .patch(existing._id)
          .set({
            played: (existing.played || 0) + update.played,
            wins: (existing.wins || 0) + update.wins,
            draws: (existing.draws || 0) + update.draws,
            losses: (existing.losses || 0) + update.losses,
            goalsFor: (existing.goalsFor || 0) + update.goalsFor,
            goalsAgainst: (existing.goalsAgainst || 0) + update.goalsAgainst,
            points: (existing.points || 0) + update.points,
            goalDifference:
              (existing.goalsFor || 0) +
              update.goalsFor -
              ((existing.goalsAgainst || 0) + update.goalsAgainst),
          })
          .commit()
      );
    } else {
      patchQueries.push(
        sanityClient.create({
          _type: 'standing',
          team: { _type: 'reference', _ref: teamId },
          played: update.played,
          wins: update.wins,
          draws: update.draws,
          losses: update.losses,
          goalsFor: update.goalsFor,
          goalsAgainst: update.goalsAgainst,
          points: update.points,
          goalDifference: update.goalsFor - update.goalsAgainst,
        })
      );
    }
  }

  // 5. Commit all patches/creates
  await Promise.all(patchQueries);
}