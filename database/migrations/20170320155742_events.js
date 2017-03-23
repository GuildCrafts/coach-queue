exports.up = knex => {
  return Promise.all([
    knex.raw( "create type event_name as enum( 'create', 'cancel', 'start', 'resolve', 'escalate' )" ),
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
}

exports.down = knex => {
  knex.schema.dropTable('events')
  knex.raw( 'drop type event_name' )
}
