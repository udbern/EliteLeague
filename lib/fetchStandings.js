import sanityClient from "./sanityClient";
import processMatchResults from "./processMatchResults";

const fetchStandings = async (seasonId) => {
  try {
    // Fetch matches for the specific season
    const matches = await sanityClient.fetch(
      `*[_type == "fixture" && season._ref == $seasonId]`,
      { seasonId }
    );
    const teams = await sanityClient.fetch('*[_type == "team"]');
    return processMatchResults(matches, teams);
  } catch (error) {
    console.error('Error fetching standings:', error);
    return [];
  }
};

export default fetchStandings;