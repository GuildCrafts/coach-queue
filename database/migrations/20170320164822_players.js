exports.up = knex =>
  knex.schema.createTable('players', table => {
    table.string('id').primary()
    table.string('handle').notNullable()
    table.boolean('is_coach').notNullable().defaultTo(false)
    table.boolean('on_duty').notNullable().defaultTo(false)
  })

exports.down = knex => knex.schema.dropTable('players')
