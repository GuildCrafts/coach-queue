exports.up = knex =>
  knex.schema.createTable('goal_coaches', table => {
    table.integer('goal_id').notNullable()
    table.string('coach_id').notNullable()
  })

exports.down = knex => knex.schema.dropTable('goal_coaches')
