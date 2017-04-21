
exports.up = knex =>
  knex.schema.createTable( 'statistics', table => {
    table.increments( 'id' ).primary()
    table.integer( 'cycle' ).notNullable()
    table.integer( 'longest_wait' ).notNullable().defaultTo( 0 )
    table.integer( 'total_wait' ).notNullable().defaultTo( 0 )
    table.integer( 'total_claims' ).notNullable().defaultTo( 0 )
    table.integer( 'all_claimed_primary_claims' ).notNullable().defaultTo( 0 )
  })

exports.down = knex =>
  knex.schema.dropTable( 'statistics' )
