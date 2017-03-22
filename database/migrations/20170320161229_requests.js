exports.up = knex =>
  knex.schema.createTable('requests', table => {
    table.increments('id').primary()
    table.integer('team_id').notNullable()
    table.timestamps(true, true)
    table.timestamp('resolved_at')
  })

exports.down = knex => knex.schema.dropTable('requests')
