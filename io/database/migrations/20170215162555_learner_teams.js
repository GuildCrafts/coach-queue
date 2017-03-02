exports.up = knex =>
  knex.schema.createTable('learner_teams', table => {
    table.integer('learner_id').notNull()
    table.integer('team_id').notNull()
  })

exports.down = knex =>
  knex.schema.dropTable('learner_teams')
