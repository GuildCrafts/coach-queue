
exports.up = ( knex, Promise ) =>
  Promise.all([
    knex.schema.createTable( 'requests', table => {
      table.increments( 'id' ).primary()
      table.string( 'question' ).notNull()
      table.string( 'artifact_link' ).notNull()
      table.boolean( 'cancelled' )
      table.timestamps()
      table.timestamp( 'resolved_at' )
      table.timestamp( 'escalated_at' )
      table.timestamp( 'claimed_at' )
      table.string( 'claimed_by' )
      table.integer( 'team_id' ).notNull()
    }),
    knex.schema.createTable( 'request_learners', table => {
      table.integer( 'request_id' )
      table.integer( 'learner_id' )
    }),
    knex.schema.createTable( 'request_topics', table => {
      table.integer( 'request_id' )
      table.integer( 'topic_id' )
    }),
    knex.schema.createTable( 'topics', table => {
      table.increments( 'id' ).primary()
      table.string( 'topic' )
    })
  ])

exports.down = ( knex, Promise ) =>
  Promise.all([
    knex.schema.dropTable( 'requests' ),
    knex.schema.dropTable( 'request_learners' ),
    knex.schema.dropTable( 'request_topics' ),
    knex.schema.dropTable( 'topics' )
  ])
