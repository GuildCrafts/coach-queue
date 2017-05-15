
exports.up = function(knex, Promise) {
  return knex.schema.table( 'players', table => {
    table.integer( 'level' ).notNullable().defaultTo( 0 )
    table.integer( 'level_v2' ).notNullable().defaultTo( 0 )
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table( 'players', table => {
    table.dropColumn( 'level' )
    table.dropColumn( 'level_v2' )
  })
};
