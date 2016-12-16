
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('appointments', function(table){
      table.dateTime('appointment_start')
      table.dateTime('appointment_end')
      table.dropColumn('date_time')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('appointments', function(table){
      table.dropColumn('appointment_start')
      table.dropColumn('appointment_end')
      table.dateTime('date_time')
    })
  ])
};
