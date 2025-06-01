const processMatchResults = (matches, teams) => {
  const standings = teams.map(team => ({
    _id: team._id,
    name: team.name,
    shortName: team.shortName,
    logo: team.logo,
    matchesPlayed: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
    form: []
  }));

  matches.forEach(match => {
    if (match.status !== "completed") return; // Skip scheduled matches

    const homeTeam = standings.find(team => team._id === match.homeTeam._ref);
    const awayTeam = standings.find(team => team._id === match.awayTeam._ref);

    if (!homeTeam || !awayTeam) return;

    // Ensure scores are numbers (avoid NaN)
    const homeScore = match.homeScore ?? 0;
    const awayScore = match.awayScore ?? 0;

    homeTeam.matchesPlayed += 1;
    awayTeam.matchesPlayed += 1;

    homeTeam.goalsFor += homeScore;
    homeTeam.goalsAgainst += awayScore;
    awayTeam.goalsFor += awayScore;
    awayTeam.goalsAgainst += homeScore;

    homeTeam.goalDifference = homeTeam.goalsFor - homeTeam.goalsAgainst;
    awayTeam.goalDifference = awayTeam.goalsFor - awayTeam.goalsAgainst;

    if (homeScore > awayScore) {
      homeTeam.wins += 1;
      homeTeam.points += 3;
      homeTeam.form.unshift("W");
      awayTeam.losses += 1;
      awayTeam.form.unshift("L");
    } else if (homeScore < awayScore) {
      awayTeam.wins += 1;
      awayTeam.points += 3;
      awayTeam.form.unshift("W");
      homeTeam.losses += 1;
      homeTeam.form.unshift("L");
    } else {
      homeTeam.draws += 1;
      awayTeam.draws += 1;
      homeTeam.points += 1;
      awayTeam.points += 1;
      homeTeam.form.unshift("D");
      awayTeam.form.unshift("D");
    }

    homeTeam.form = homeTeam.form.slice(0, 10);
    awayTeam.form = awayTeam.form.slice(0, 10);
  });

  return standings.sort((a, b) =>
    b.points - a.points ||
    b.goalDifference - a.goalDifference ||
    b.goalsFor - a.goalsFor
  ).map((team, index) => ({
    ...team,
    position: index + 1,
    played: team.matchesPlayed,
    won: team.wins,
    drawn: team.draws,
    lost: team.losses,
  }));
};

export default processMatchResults;