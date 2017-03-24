exports.up = knex =>
  knex.schema.createTable('goals', table => {
    table.integer('id').notNullable()
    table.string('link').notNullable()
    table.string('title').notNullable()
  })

exports.down = knex => knex.schema.dropTable('goals')