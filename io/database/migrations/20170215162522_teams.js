exports.up = knex =>
  knex.schema.createTable('teams', table => {
    table.increments('id').primary()
    table.string('team').unique()
    table.string('cycle')
  })

exports.down = knex =>
  knex.schema.dropTable('teams')
