const startTime = new Date(2017, 1, 27, 16, 5)
const endTime = new Date(2017, 1, 28, 16, 5)
const createdAt = new Date(2016, 1, 28, 16, 5)
const users = [
  {
    github_handle: 'kitty_mitty',
    active_coach: true,
    google_token: 'API_TOKEN',
    email: 'email@email.com',
    calendar_ids: ['email@email.com']
  },
  {
    github_handle: 'hayward_bay',
    active_coach: false,
    google_token: "A_TOKEN",
    email: 'email@email.com',
    calendar_ids: ['email@email.com']
  },
  {
    github_handle: 'mickey_mouse',
    active_coach: false,
    google_token: "TOKEN",
    email: 'email@email.com',
    calendar_ids: ['email@email.com']
  },
  {
    github_handle: 'good_people',
    active_coach: false,
    google_token: "A_TOKEN",
    email: 'email@email.com',
    calendar_ids: ['email@email.com']
  },
  {
    github_handle: 'really_good_people',
    active_coach: false,
    google_token: "A_TOKEN",
    email: 'email@email.com',
    calendar_ids: ['email@email.com']
  }
]

const appointments = {
  appointment_length: 45,
  description: 'This is a description of appointment.',
  coach_handle: 'kitty_mitty',
  mentee_handles: ['hayward_bay', 'mickey_mouse'],
  appointment_start: startTime,
  appointment_end: endTime,
  created_at_timestamp: createdAt
}

module.exports = {users, appointments}
