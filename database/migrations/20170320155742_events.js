const { CREATE, CANCEL, CLAIM, RESOLVE, ESCALATE } =
  require( '../../events/requests/constants')

exports.up = knex =>
  Promise.all([
    knex.raw( `create type event_name as
      enum( '${CREATE}', '${CLAIM}', '${CANCEL}', '${RESOLVE}', '${ESCALATE}' )` ),
    knex.raw( `
      create table events (
        id serial primary key,
        request_id int not null,
        data jsonb not null,
        name event_name,
        created_at timestamp default now(),
        updated_at timestamp default now()
      )
    `)
  ])

exports.down = knex => {
  knex.schema.dropTable('events')
  knex.raw( 'drop type event_name' )
}
