exports.up = knex =>
  knex.schema.createTable('events', table => {
    table.increments('id').primary()
    table.integer('request_id').notNullable()
    table.jsonb('data').notNullable()
    table.enum('event_name', ['create', 'cancel', 'start', 'resolve', 'escalate']).notNullable()
    table.timestamps(true, true)
  })

exports.down = knex => knex.schema.dropTable('events')
