export default {
  name: "standing",
  title: "Standings Snapshot",
  type: "document",
  fields: [
    {
      name: "season",
      title: "Season",
      type: "reference",
      to: [{ type: "season" }],
      description: "The season this standing belongs to",
    },
    {
      name: "round",
      title: "Round",
      type: "string",
      description: "The round number or identifier",
    },
    {
      name: "dateSaved",
      title: "Date Saved",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
    {
      name: "teams",
      title: "Teams Standings",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "team", title: "Team", type: "reference", to: [{ type: "team" }] },
            { name: "played", title: "Matches Played", type: "number" },
            { name: "wins", title: "Wins", type: "number" },
            { name: "draws", title: "Draws", type: "number" },
            { name: "losses", title: "Losses", type: "number" },
            { name: "goalsFor", title: "Goals For", type: "number" },
            { name: "goalsAgainst", title: "Goals Against", type: "number" },
            { name: "goalDifference", title: "Goal Difference", type: "number" },
            { name: "points", title: "Points", type: "number" },
          ],
        },
      ],
    },
  ],
};
