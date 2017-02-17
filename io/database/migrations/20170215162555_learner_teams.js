
exports.up = knex =>
  knex.schema.createTable('learner-teams', table => {
    table.string('learner_id')
    table.string('team_id')
  })

exports.down = knex =>
  knex.schema.dropTable('learner-teams')
