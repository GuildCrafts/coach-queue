exports.up = knex =>
  knex.schema.createTable('projects', table => {
    table.increments('id').primary()
    table.string('link').notNullable()
    table.boolean('is_current').notNullable().defaultTo(false)
  })

exports.down = knex => knex.schema.dropTable('projects')
