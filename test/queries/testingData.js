const datetime = new Date(2017, 1, 27, 16, 5)

 const appointmentsData = [
  {
    coach_handle:"ImALeafyPlant",
    date_time: datetime,
    appointment_length: 45,
    description: "Something here now.",
    attendees: ["someone_123", "aNameIsCool", "peopleLikeLearning"]
  },
  {
    coach_handle:"GoSammyGo",
    date_time: datetime,
    appointment_length: 45,
    description: "Solve my bug coach.",
    attendees: ["someone_123", "reallycoolname"]
  },
  {
    coach_handle:"ImALeafyPlant",
    date_time: datetime,
    appointment_length: 45,
    description: "We want a walkthrough for setting up express.",
    attendees: ["somebody_hit", "aNameIsCool", "peopleLikeLearning"]
  }
]

const user = [{
    github_handle: "ImALeafyPlant",
    can_coach: true,
    active_calender: true,
    active_coach: false,
    google_token: "A_TOKEN",
  },
  {
    github_handle: "GoSammyGo",
    can_coach: false,
    active_calender: false,
    active_coach: false,
    google_token: "ANOTHER_TOKEN",
  }
]

module.exports = {appointmentsData, user}
