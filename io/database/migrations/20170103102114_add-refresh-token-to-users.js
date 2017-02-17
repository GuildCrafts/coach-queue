exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', table => table.string('google_refresh_token'))
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', table => table.dropColumn('google_refresh_token'))
  ])
};
