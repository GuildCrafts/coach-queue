const datetime = new Date(2017, 1, 27, 16, 5)
const users = [
  {
    lg_id: '1234ab',
    github_handle: 'kitty_mitty',
    can_coach: true,
    active_calender: true,
    active_coach: true,
    google_token: 'API_TOKEN'
  },
  {
    lg_id: '4321bb',
    github_handle: 'hayward_bay',
    can_coach: false,
    active_calender: true,
    active_coach: false,
    google_token: "A_TOKEN"
  },
  {
    lg_id: '98bc78',
    github_handle: 'mickey_mouse',
    can_coach: false,
    active_calender: true,
    active_coach: false,
    google_token: "TOKEN"
  },
  {
    lg_id: '5574ab',
    github_handle: 'good_people',
    can_coach: false,
    active_calender: false,
    active_coach: false,
    google_token: "A_TOKEN"
  },
  {
    lg_id: '4300op',
    github_handle: 'really_good_people',
    can_coach: false,
    active_calender: false,
    active_coach: false,
    google_token: "A_TOKEN"
  }
]

const appointments = {
    coach_id: 'kitty_mitty',
    date_time: datetime,
    appointment_length: 45,
    description: 'This is a description of appointment.',
    attendees: ['hayward_bay', 'mickey_mouse']
  }

module.exports = {users, appointments}
