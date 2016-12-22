
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('appointments', table => {
      table.dropColumn('coach_id')
      table.dropColumn('attendees')
      table.string('coach_handle')
      table.specificType('mentee_handles', 'text[]')
    }),
    knex.schema.dropTable('users'),
    knex.schema.createTable('users', table =>  {
      table.increments()
      table.string('github_handle')
      table.boolean('can_coach')
      table.boolean('active_calender')
      table.boolean('active_coach')
      table.string('google_token')
      table.timestamps()
    })
  ])
}

exports.down = function(knex, Promise) {
    return Promise.all([
    knex.schema.table('appointments', table => {
      table.dropColumn('coach_handle')
      table.dropColumn('mentee_handles')
      table.string('coach_id')
      table.string('attendees')
    }),
    knex.schema.dropTable('users'),
    knex.schema.createTable('users', table =>  {
      table.string('lg_id').primary()
      table.boolean('can_coach')
      table.boolean('active_calender')
      table.boolean('active_coach')
      table.string('google_token')
      table.string('github_handle')
      table.timestamps()
    })
  ])
}
