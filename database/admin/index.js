const db = require( '../db' )

const data = () =>
  Promise.all([
    db.any( 'SELECT * FROM players ORDER BY handle ASC' ),
    db.any( 'SELECT *, (SELECT COUNT(*) FROM team_players WHERE team_id = teams.id ) as player_count FROM teams WHERE is_current = true' )
  ])
  .then( ([ players, teams ]) => ({ players, teams }))

const setCoaches = coaches =>
  db.any( 'UPDATE players SET is_coach=false')
    .then( _ => db.any( 'UPDATE players SET is_coach=true WHERE id IN ($1:csv)', [coaches]))

module.exports = { data, setCoaches }