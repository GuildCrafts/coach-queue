exports.up = knex =>
  knex.schema.createTable('projects', table => {
    table.increments('id').primary()
    table.string('link').notNullable()
  })

exports.down = knex => knex.schema.dropTable('projects')
