exports.up = knex =>
  knex.schema.createTable('teams', table => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.integer('project_id').notNullable()
  })

exports.down = knex => knex.schema.dropTable('teams')
