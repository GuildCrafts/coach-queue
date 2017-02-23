exports.up = knex =>
  knex.schema.table('appointments', table => table.integer('team_id') )

exports.down = knex =>
  knex.schema.table('appointments', table => table.dropColumn('team_id') )
