import sanityClient from "./sanityClient";

export async function fetchHeadToHead(team1Id, team2Id, seasonId, competitionId) {
  try {
    // Fetch all matches between these two teams in the current season and competition
    const query = `
      *[_type == "fixture" && 
        season._ref == $seasonId && 
        competition._ref == $competitionId &&
        ((homeTeam._ref == $team1Id && awayTeam._ref == $team2Id) || 
         (homeTeam._ref == $team2Id && awayTeam._ref == $team1Id)) &&
        status == "completed"
      ] | order(matchDate asc) {
        _id,
        matchDate,
        homeScore,
        awayScore,
        round,
        venue,
        "homeTeam": homeTeam->{_id, name, logo},
        "awayTeam": awayTeam->{name, logo}
      }
    `;

    const matches = await sanityClient.fetch(query, {
      team1Id,
      team2Id,
      seasonId,
      competitionId
    });

    // Calculate head-to-head statistics
    let team1Wins = 0;
    let team2Wins = 0;
    let draws = 0;
    let team1Goals = 0;
    let team2Goals = 0;

    const matchResults = matches.map(match => {
      const isTeam1Home = match.homeTeam._id === team1Id;
      const team1Score = isTeam1Home ? match.homeScore : match.awayScore;
      const team2Score = isTeam1Home ? match.awayScore : match.homeScore;
      
      team1Goals += team1Score;
      team2Goals += team2Score;

      let result;
      if (team1Score > team2Score) {
        team1Wins++;
        result = 'team1';
      } else if (team1Score < team2Score) {
        team2Wins++;
        result = 'team2';
      } else {
        draws++;
        result = 'draw';
      }

      return {
        ...match,
        team1Score,
        team2Score,
        result,
        isTeam1Home
      };
    });

    return {
      matches: matchResults,
      stats: {
        totalMatches: matches.length,
        team1Wins,
        team2Wins,
        draws,
        team1Goals,
        team2Goals,
        team1GoalDifference: team1Goals - team2Goals
      }
    };
  } catch (error) {
    console.error('Error fetching head-to-head data:', error);
    return {
      matches: [],
      stats: {
        totalMatches: 0,
        team1Wins: 0,
        team2Wins: 0,
        draws: 0,
        team1Goals: 0,
        team2Goals: 0,
        team1GoalDifference: 0
      }
    };
  }
} 