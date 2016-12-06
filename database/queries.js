const knex = require('./knex')

const firstRecord = records => records[0]

const createRecord = (table, attributes) =>
  knex
    .table(table)
    .insert(attributes)
    .returning('*')
    .then(firstRecord)

const createUser = attributes =>
  createRecord('users', attributes).then( user => user )

module.exports = {
  knex,
  createUser
}
