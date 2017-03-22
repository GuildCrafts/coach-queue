exports.up = knex =>
  knex.schema.createTable('team_players', table => {
    table.integer('team_id').notNullable()
    table.integer('player_id').notNullable()
  })

exports.down = knex => knex.schema.dropTable('team_players')
