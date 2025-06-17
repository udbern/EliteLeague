// Migration script for Sanity Studio
// Run this in the Vision tool in Sanity Studio

// Step 1: Create competitions for Season 2
const createCompetitions = async () => {
  // First, get Season 2
  const season2 = await client.fetch('*[_type == "season" && name == "Season 2"][0]');
  
  if (!season2) {
    console.log("Season 2 not found. Please create it first.");
    return;
  }

  // Create Premier League competition
  const premierLeague = await client.create({
    _type: 'competition',
    name: 'Premier League',
    type: 'league',
    seasons: [{ _type: 'reference', _ref: season2._id }],
    format: 'round-robin',
    isActive: true,
    description: 'Main league competition'
  });

  // Create FA Cup competition
  const faCup = await client.create({
    _type: 'competition',
    name: 'FA Cup',
    type: 'cup',
    seasons: [{ _type: 'reference', _ref: season2._id }],
    format: 'knockout',
    rounds: ['Round 1', 'Round 2', 'Quarter Finals', 'Semi Finals', 'Finals'],
    isActive: true,
    description: 'Cup competition with knockout format'
  });

  console.log('Created competitions:', { premierLeague: premierLeague._id, faCup: faCup._id });
  return { premierLeague, faCup };
};

// Step 2: Update existing fixtures to have competition (if they don't have one)
const updateFixtures = async () => {
  // Get all fixtures without competition
  const fixturesWithoutCompetition = await client.fetch(`
    *[_type == "fixture" && !defined(competition)]
  `);

  console.log(`Found ${fixturesWithoutCompetition.length} fixtures without competition`);

  // Get the default competition (Premier League)
  const defaultCompetition = await client.fetch(`
    *[_type == "competition" && name == "Premier League"][0]
  `);

  if (!defaultCompetition) {
    console.log("Default competition not found. Please create competitions first.");
    return;
  }

  // Update each fixture
  for (const fixture of fixturesWithoutCompetition) {
    await client
      .patch(fixture._id)
      .set({
        competition: { _type: 'reference', _ref: defaultCompetition._id }
      })
      .commit();
    
    console.log(`Updated fixture: ${fixture._id}`);
  }

  console.log('All fixtures updated with competition');
};

// Step 3: Add teams to competitions
const addTeamsToCompetitions = async () => {
  // Get all teams
  const allTeams = await client.fetch('*[_type == "team"]');
  
  // Get Season 2
  const season2 = await client.fetch('*[_type == "season" && name == "Season 2"][0]');
  
  if (!season2) {
    console.log("Season 2 not found");
    return;
  }

  // Add Season 2 to all teams' seasons array
  for (const team of allTeams) {
    const currentSeasons = team.seasons || [];
    const season2Ref = { _type: 'reference', _ref: season2._id };
    
    // Check if Season 2 is already in the seasons array
    const hasSeason2 = currentSeasons.some(s => s._ref === season2._id);
    
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
};

// Run the migration
const runMigration = async () => {
  console.log('Starting migration...');
  
  try {
    await createCompetitions();
    await updateFixtures();
    await addTeamsToCompetitions();
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
};

// Uncomment the line below to run the migration
// runMigration(); 