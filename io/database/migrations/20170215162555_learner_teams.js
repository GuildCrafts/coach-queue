exports.up = knex =>
  knex.schema.createTable('learner_teams', table => {
    table.integer('learner_id')
    table.integer('team_id')
  })

exports.down = knex =>
  knex.schema.dropTable('learner_teams')
