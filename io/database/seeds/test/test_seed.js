const {createUser} = require('../../users')
const {createAppointment} = require('../../appointments')
const {users, appointments} = require('../static_data')

const creationList = users.map(user => createUser(user))
creationList.push(createAppointment(appointments))

exports.seed = (knex, Promise) => Promise.all(creationList)
