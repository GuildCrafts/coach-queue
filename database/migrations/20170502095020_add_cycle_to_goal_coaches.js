
exports.up = function(knex, Promise) {
  return knex.schema.table( 'goal_coaches', table =>
    table.integer( 'cycle' ).notNullable().defaultTo( 0 )
  ).then( result => { console.log( result ); return result; })
};

exports.down = function(knex, Promise) {
  return knex.schema.table( 'goal_coaches', table =>
    table.dropColumn( 'cycle' )
  )
};
