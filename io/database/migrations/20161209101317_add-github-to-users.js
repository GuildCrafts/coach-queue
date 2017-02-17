exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', table => table.string('github_handle'))
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', table => table.dropColumn('github_handle'))
  ])
};
