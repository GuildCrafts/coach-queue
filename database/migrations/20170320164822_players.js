exports.up = knex =>
  knex.schema.createTable('players', table => {
    table.increments('id').primary()
    table.string('handle').notNullable()
    table.boolean('is_coach').notNullable().defaultTo(false)
    table.boolean('on_duty').notNullable().defaultTo(true)
  })

exports.down = knex => knex.schema.dropTable('players')
