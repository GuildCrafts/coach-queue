exports.up = knex =>
  knex.schema.table('appointments', table => table.string('event_id'))

exports.down = knex =>
  knex.schema.table('appointments', table => table.dropColumn('event_id'))
