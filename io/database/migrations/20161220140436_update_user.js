
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', table => {
      table.dropColumn('active_calender')
      table.dropColumn('can_coach')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', table => {
      table.string('active_calendar')
      table.string('can_coach')
    })
  ])
};
