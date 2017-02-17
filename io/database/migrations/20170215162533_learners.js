
exports.up = knex =>
  knex.schema.createTable('learners', table => {
    table.increments('id').primary()
    table.string('handle').unique()
  })

exports.down = knex =>
  knex.schema.dropTable('learners')
