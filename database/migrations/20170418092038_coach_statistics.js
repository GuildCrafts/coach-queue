
exports.up = knex =>
  knex.schema.createTable( 'coach_statistics', table => {
    table.integer( 'cycle' ).notNullable()
    table.string( 'coach_id' ).notNullable()
    table.integer( 'primary_claims' ).notNullable().defaultTo( 0 )
    table.integer( 'claimed_primary_claims' ).notNullable().defaultTo( 0 )
    table.integer( 'total_claims' ).notNullable().defaultTo( 0 )
  })

exports.down = knex =>
  knex.schema.dropTable( 'coach_statistics' )
