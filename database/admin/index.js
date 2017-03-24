const db = require( '../db' )

const GOAL_COUNT = `
select *,
  ( select count(*) from teams where teams.goal_id=goals.id and teams.is_current) as team_count,
  ( select count(*) from team_players join teams on team_players.team_id=teams.id where teams.goal_id=goals.id and teams.is_current) as player_count
from goals
`

const data = () =>
  Promise.all([
    db.any( 'SELECT * FROM players ORDER BY handle ASC' ),
    db.any( 'SELECT * FROM players WHERE is_coach=true ORDER BY handle ASC' ),
    db.any( 'SELECT *, (SELECT COUNT(*) FROM team_players WHERE team_id = teams.id ) as player_count FROM teams WHERE is_current = true' ),
    db.any( GOAL_COUNT )
  ])
  .then( ([ players, coaches, teams, goal_counts ]) => ({ players, coaches, teams, goal_counts }))

const setCoaches = coaches =>
  db.any( 'UPDATE players SET is_coach=false' )
    .then( _ => db.any( 'UPDATE players SET is_coach=true WHERE id IN ($1:csv)', [coaches]))

const assignCoach = assignment =>
  db.any( 'INSERT INTO goal_coaches ( goal_id, coach_id ) VALUES (${goal_id}, ${coach_id})', assignment )

module.exports = { data, setCoaches, assignCoach }
