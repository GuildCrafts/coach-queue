exports.up = knex =>
  knex.schema.table('appointments', table => table.boolean('is_canceled').defaultTo(false))

exports.down = knex =>
  knex.schema.table('appointments', table => table.dropColumn('is_canceled'))
