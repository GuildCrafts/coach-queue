const db = require( '../db' )
const Statistics = require( '../statistics' )

const GOAL_COUNT = `
SELECT *,
  ( SELECT count(*) FROM teams WHERE teams.goal_id=goals.id and teams.is_current) AS team_count,
  ( SELECT count(*) FROM team_players join teams on team_players.team_id=teams.id WHERE teams.goal_id=goals.id AND teams.is_current) AS player_count
FROM goals
LEFT OUTER JOIN goal_coaches ON goals.id=goal_coaches.goal_id
WHERE goal_coaches.cycle=$1
ORDER BY player_count DESC, goals.title ASC
`

const data = () =>
  Statistics.getCycle( 'current' )
    .then( cycle =>
      Promise.all([
        db.any( 'SELECT * FROM players ORDER BY lower(handle) ASC' ),
        db.any( 'SELECT * FROM players WHERE is_coach=true ORDER BY handle ASC' ),
        db.any( 'SELECT *, (SELECT COUNT(*) FROM team_players WHERE team_id = teams.id ) as player_count FROM teams WHERE is_current = true' ),
        db.any( GOAL_COUNT, cycle )
      ])
    )
    .then( ([ players, coaches, teams, goal_counts ]) => ({ players, coaches, teams, goal_counts }))

const setCoaches = coaches =>
  db.any( 'UPDATE players SET is_coach=false' )
    .then( _ => db.any( 'UPDATE players SET is_coach=true WHERE id IN ($1:csv)', [coaches]))
    .then( Statistics.currentCycle )
    .then( Statistics.reset )

const assignCoach = assignment =>
  db.any( 'UPDATE goal_coaches SET coach_id=${coach_id} WHERE goal_id=${goal_id} AND cycle=${cycle}', assignment )

module.exports = { data, setCoaches, assignCoach }
