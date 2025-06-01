export default {
  name: 'fixture',
  title: 'Fixture',
  type: 'document',
  fields: [
    {
      name: 'season',
      title: 'Season',
      type: 'reference',
      to: [{ type: 'season' }],
      validation: Rule => Rule.required(),
    },
    {
      name: 'homeTeam',
      title: 'Home Team',
      type: 'reference',
      to: [{ type: 'team' }],
    },
    {
      name: 'awayTeam',
      title: 'Away Team',
      type: 'reference',
      to: [{ type: 'team' }],
    },
    {
      name: 'homeScore',
      title: 'Home Score',
      type: 'number',
      validation: Rule => Rule.min(0),
    },
    {
      name: 'awayScore',
      title: 'Away Score',
      type: 'number',
      validation: Rule => Rule.min(0),
    },
    {
      name: 'matchDate',
      title: 'Match Date',
      type: 'datetime',
    },
    {
      name: 'round',
      title: 'Round',
      type: 'string',
    },
    {
      name: 'status',
      title: 'Match Status',
      type: 'string',
      options: {
        list: [
          { title: 'Scheduled', value: 'scheduled' },
          { title: 'Completed', value: 'completed' },
        ],
        layout: 'radio',
      },
      validation: Rule =>
        Rule.custom((status, context) => {
          const { homeScore, awayScore, homeGoalScorers, awayGoalScorers } = context.document;
          
          if (status === 'completed') {
            // First check: Both scores must be provided
            if (homeScore === undefined || awayScore === undefined) {
              return 'Cannot mark as completed unless both scores are provided.';
            }

            // Second check: If it's a 0-0 draw, allow it without goal scorers
            if (homeScore === 0 && awayScore === 0) {
              return true;
            }

            // Third check: For matches with goals, require goal scorers
            const hasGoals = homeScore > 0 || awayScore > 0;
            const hasScorers = (homeGoalScorers?.length || 0) > 0 || (awayGoalScorers?.length || 0) > 0;
            
            if (hasGoals && !hasScorers) {
              return 'Cannot mark as completed with goals unless goal scorers are recorded.';
            }
          }
          return true;
        }),
    },
    {
      name: 'homeGoalScorers',
      title: 'Home Goal Scorers',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'playerName',
              title: 'Player Name',
              type: 'string'
            },
            {
              name: 'goals',
              title: 'Number of Goals',
              type: 'number',
              validation: Rule => Rule.min(1)
            },
            {
              name: 'team',
              title: 'Team',
              type: 'reference',
              to: [{ type: 'team' }]
            }
          ]
        }
      ]
    },
    {
      name: 'awayGoalScorers',
      title: 'Away Goal Scorers',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'playerName',
              title: 'Player Name',
              type: 'string'
            },
            {
              name: 'goals',
              title: 'Number of Goals',
              type: 'number',
              validation: Rule => Rule.min(1)
            },
            {
              name: 'team',
              title: 'Team',
              type: 'reference',
              to: [{ type: 'team' }]
            }
          ]
        }
      ]
    },
  ],
  preview: {
    select: {
      title: 'round',
      subtitle: 'season.name',
      homeTeam: 'homeTeam.name',
      awayTeam: 'awayTeam.name',
    },
    prepare({ title, subtitle, homeTeam, awayTeam }) {
      return {
        title: `${homeTeam} vs ${awayTeam}`,
        subtitle: `${subtitle} - ${title}`,
      }
    },
  },
};