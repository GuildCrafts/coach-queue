exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('upload', table => {
      table.increments('id').primary()
      table.string('cycle')
      table.timestamp('uploaded_at').defaultTo(knex.fn.now())
    })
  ])
}
exports.down = knex =>
  knex.schema.dropTable('upload')
