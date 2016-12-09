const datetime = new Date(2017, 1, 27, 16, 5)

 const appointmentsData = [
  {
    coach_id:"4321cd",
    date_time: datetime,
    appointment_length: 45,
    description: "Something here now.",
    attendees: ["someone_123", "aNameIsCool", "peopleLikeLearning"]
  },
  {
    coach_id:"1234ab",
    date_time: datetime,
    appointment_length: 45,
    description: "Solve my bug coach.",
    attendees: ["someone_123", "reallycoolname"]
  },
  {
    coach_id:"4321cd",
    date_time: datetime,
    appointment_length: 45,
    description: "We want a walkthrough for setting up express.",
    attendees: ["somebody_hit", "aNameIsCool", "peopleLikeLearning"]
  }
]

const user = [{
    lg_id: "1234ab",
    can_coach: true,
    active_calender: true,
    active_coach: false,
    google_token: "A_TOKEN",
    github_handle: "probably_a_human"
  },
  {
    lg_id: "nope",
    can_coach: false,
    active_calender: false,
    active_coach: false,
    google_token: "nope",
    github_handle: "nope-not-ever"
  }
]

module.exports = {appointmentsData, user}
