
exports.up = function(knex, Promise) {
  return knex.schema.table( 'goals', table =>
    table.integer( 'level' ).notNullable().defaultTo( 0 )
  )
};

exports.down = function(knex, Promise) {
  return knex.schema.table( 'goals', table =>
    table.dropColumn( 'level' )
  )
};
