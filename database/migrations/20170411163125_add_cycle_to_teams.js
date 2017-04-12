
exports.up = knex =>
  knex.schema.table('teams', table =>
    table.integer( 'cycle' ).notNullable().defaultTo(0)
  )

exports.down = knex =>
  knex.schema.table('teams', table =>
    table.dropColumn( 'cycle' )
  )
