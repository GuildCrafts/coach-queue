const datetime = new Date(2017, 1, 27, 16, 5)
const anotherDate = new Date(2016, 1, 25, 16, 5)

 const appointmentsData = [
  {
    coach_handle:"ImALeafyPlant",
    appointment_start: datetime,
    appointment_end: datetime,
    appointment_length: 45,
    description: "Something here now.",
    mentee_handles: ["someone_123", "aNameIsCool", "peopleLikeLearning"]
  },
  {
    coach_handle:"GoSammyGo",
    appointment_start: datetime,
    appointment_end: datetime,
    appointment_length: 45,
    description: "Solve my bug coach.",
    mentee_handles: ["someone_123", "reallycoolname"]
  },
  {
    coach_handle:"ImALeafyPlant",
    appointment_start: datetime,
    appointment_end: datetime,
    appointment_length: 45,
    description: "We want a walkthrough for setting up express.",
    mentee_handles: ["somebody_hit", "aNameIsCool", "peopleLikeLearning"]
  },
  {
    coach_handle:"ImALeafyPlant",
    appointment_start: anotherDate,
    appointment_end: anotherDate,
    appointment_length: 45,
    description: "Something here now.",
    mentee_handles: ["someone_123", "aNameIsCool", "peopleLikeLearning"]
  },
  {
    coach_handle:"GoSammyGo",
    appointment_start: anotherDate,
    appointment_end: anotherDate,
    appointment_length: 45,
    description: "Solve my bug coach.",
    mentee_handles: ["someone_123", "reallycoolname"]
  },
  {
    coach_handle:"ImALeafyPlant",
    appointment_start: anotherDate,
    appointment_end: anotherDate,
    appointment_length: 45,
    description: "We want a walkthrough for setting up express.",
    mentee_handles: ["somebody_hit", "aNameIsCool", "peopleLikeLearning"]
  }
]

const user = [{
    github_handle: "ImALeafyPlant",
    active_coach: false,
    google_token: "A_TOKEN",
    email: "flowers@gmail.netorg",
    calendar_ids: ['flowers@gmail.netorg', 'flowers@lguild.net']
  },
  {
    github_handle: "GoSammyGo",
    active_coach: false,
    google_token: "ANOTHER_TOKEN",
    email: "Samsamsam@someemail.org",
    calendar_ids: ['Samsamsam@someemail.org']
  }
]

module.exports = {appointmentsData, user}
