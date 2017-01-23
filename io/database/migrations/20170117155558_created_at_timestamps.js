
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('appointments', table => {
      table.dropColumn('created_at')
      table.dropColumn('updated_at')
      table.timestamp('created_at_timestamp').defaultTo(knex.fn.now())
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('appointments', table => {
      table.dropColumn('created_at_timestamp')
      table.timestamps(true, true)
    })
  ])
};
