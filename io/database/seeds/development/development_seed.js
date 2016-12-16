const {createUser} = require('../../users')
const {createAppointment} = require('../../appointments')
const {users, appointments} = require('../static_data')

exports.seed = (knex, Promise) => {
  const seedData = []
  users.forEach((user, index) =>
    seedData.push(createUser(users[index]))
  )
  seedData.push(createAppointment(appointments))
  return Promise.all(seedData)
}
