exports.up = knex =>
  knex.schema.createTable('goals', table => {
    table.increments('id').primary()
    table.string('link').notNullable()
    table.string('title').notNullable()
  })

exports.down = knex => knex.schema.dropTable('goals')