// Migration script to be run in Sanity Studio
// This script helps set up teams for Season 2

// 1. First, get all teams that participated in Season 1
const season1Teams = await client.fetch(`
  *[_type == "fixture" && season._ref == "SEASON_1_ID"] {
    homeTeam->{_id, name, shortName, coach, logo},
    awayTeam->{_id, name, shortName, coach, logo}
  }
`);

// Extract unique teams
const uniqueTeams = new Map();
season1Teams.forEach(match => {
  if (match.homeTeam) {
    uniqueTeams.set(match.homeTeam._id, match.homeTeam);
  }
  if (match.awayTeam) {
    uniqueTeams.set(match.awayTeam._id, match.awayTeam);
  }
});

const teamsArray = Array.from(uniqueTeams.values());

// 2. Update each team to include Season 2 in their seasons array
for (const team of teamsArray) {
  const currentSeasons = team.seasons || [];
  const season2Ref = { _type: 'reference', _ref: 'SEASON_2_ID' };
  
  // Check if Season 2 is already in the seasons array
  const hasSeason2 = currentSeasons.some(s => s._ref === 'SEASON_2_ID');
  
  if (!hasSeason2) {
    const updatedSeasons = [...currentSeasons, season2Ref];
    
    await client
      .patch(team._id)
      .set({ seasons: updatedSeasons })
      .commit();
    
    console.log(`Added Season 2 to team: ${team.name}`);
  } else {
    console.log(`Team ${team.name} already has Season 2`);
  }
}

console.log('Migration completed!'); 