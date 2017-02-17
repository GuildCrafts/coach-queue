exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.createTable('users', table =>  {
      table.string('lg_id').primary()
      table.boolean('can_coach')
      table.boolean('active_calender')
      table.boolean('active_coach')
      table.string('google_token')
      table.timestamps(true, true)
    }),

    knex.schema.createTable('appointments', table => {
      table.increments('id').primary()
      table.string('coach_id')
      table.dateTime('date_time')
      table.integer('appointment_length')
      table.string('description')
      table.specificType('attendees', 'text[]')
      table.timestamps(true, true)
    })
  ])

exports.down = (knex, Promise) =>
  Promise.all([
    knex.schema.dropTable('users'),
    knex.schema.dropTable('appointments')
  ])
