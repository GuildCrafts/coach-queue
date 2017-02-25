exports.up = knex =>
  Promise.all([
    knex.schema.table('teams', table => {
      table.dropColumn('cycle')
    }),
    knex.schema.table('teams', table => {
      table.integer('cycle')
    })
  ])

exports.down = knex =>
  Promise.all([
    knex.schema.table('teams', table => {
      table.dropColumn('cycle')
    }),
    knex.schema.table('teams', table => {
      table.string('cycle')
    })
  ])
