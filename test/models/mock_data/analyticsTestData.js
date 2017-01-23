const moment = require('moment-timezone')

const week1Appointments = [
  {
    id: 1,
    appointment_length: 30,
    description: 'help!!!',
    coach_handle: 'coachQ',
    mentee_handles: ['person', 'person2'],
    appointment_start: moment('Wed, 17 Jan 2017 17:00:00 GMT').toDate(),
    appointment_end: moment('Wed, 17 Jan 2017 17:30:00 GMT').toDate(),
    created_at_timestamp: moment('2017-01-17T08:40:00.000-08:00').toDate()
  },
  {
    id: 2,
    appointment_length: 30,
    description: 'help Now!!!',
    coach_handle: 'coachQ',
    mentee_handles: ['person', 'person2'],
    appointment_start: moment('Wed, 17 Jan 2017 18:00:00 GMT').toDate(),
    appointment_end: moment('Wed, 17 Jan 2017 18:30:00 GMT').toDate(),
    created_at_timestamp: moment('2017-01-17T08:41:00.000-08:00').toDate()
  },
  {
    id: 3,
    appointment_length: 30,
    description: 'Git Merge conflicts',
    coach_handle: 'secondCoach',
    mentee_handles: ['superman', 'batman'],
    appointment_start: moment('Wed, 17 Jan 2017 18:00:00 GMT').toDate(),
    appointment_end: moment('Wed, 17 Jan 2017 18:30:00 GMT').toDate(),
    created_at_timestamp: moment('2017-01-17T08:42:00.000-08:00').toDate()
  },
  {
    id: 4,
    appointment_length: 30,
    description: 'Just have lost hope',
    coach_handle: 'coachQ',
    mentee_handles: ['person', 'person2'],
    appointment_start: moment('Wed, 17 Jan 2017 19:00:00 GMT').toDate(),
    appointment_end: moment('Wed, 17 Jan 2017 19:30:00 GMT').toDate(),
    created_at_timestamp: moment('2017-01-17T08:43:00.000-08:00').toDate()
  },
  {
    id: 5,
    appointment_length: 30,
    description: 'stuck in drama triangle',
    coach_handle: 'secondCoach',
    mentee_handles: ['otherPerson', 'person'],
    appointment_start: moment('Wed, 17 Jan 2017 19:30:00 GMT').toDate(),
    appointment_end: moment('Wed, 17 Jan 2017 20:00:00 GMT').toDate(),
    created_at_timestamp: moment('2017-01-17T08:44:00.000-08:00').toDate()
  },
  {
    id: 6,
    appointment_length: 30,
    description: 'help with routes',
    coach_handle: 'secondCoach',
    mentee_handles: ['otherPerson', 'person2'],
    appointment_start: moment('Wed, 17 Jan 2017 21:00:00 GMT').toDate(),
    appointment_end: moment('Wed, 17 Jan 2017 21:30:00 GMT').toDate(),
    created_at_timestamp: moment('2017-01-17T08:45:00.000-08:00').toDate()
  },
  {
    id: 7,
    appointment_length: 30,
    description: 'react is not helping',
    coach_handle: 'lazyCoach',
    mentee_handles: ['menteeIntern', 'Apprentice'],
    appointment_start: moment('Wed, 17 Jan 2017 21:00:00 GMT').toDate(),
    appointment_end: moment('Wed, 17 Jan 2017 21:30:00 GMT').toDate(),
    created_at_timestamp: moment('2017-01-17T08:46:00.000-08:00').toDate()
  },
  {
    id: 8,
    appointment_length: 30,
    description: 'help with life',
    coach_handle: 'coachQ',
    mentee_handles: ['learner', 'student'],
    appointment_start: moment('Wed, 17 Jan 2017 21:30:00 GMT').toDate(),
    appointment_end: moment('Wed, 17 Jan 2017 22:00:00 GMT').toDate(),
    created_at_timestamp: moment('2017-01-17T08:46:30.000-08:00').toDate()
  },
  {
    id: 9,
    appointment_length: 30,
    description: 'database query responding with errors',
    coach_handle: 'secondCoach',
    mentee_handles: ['person', 'person2'],
    appointment_start: moment('Wed, 17 Jan 2017 22:00:00 GMT').toDate(),
    appointment_end: moment('Wed, 17 Jan 2017 22:30:00 GMT').toDate(),
    created_at_timestamp: moment('2017-01-17T08:48:00.000-08:00').toDate()
  },
  {
    id: 10,
    appointment_length: 30,
    description: 'No Idea about what is going on',
    coach_handle: 'coachQ',
    mentee_handles: ['archer', 'cartman'],
    appointment_start: moment('Wed, 17 Jan 2017 23:00:00 GMT').toDate(),
    appointment_end: moment('Wed, 17 Jan 2017 23:30:00 GMT').toDate(),
    created_at_timestamp: moment('2017-01-17T08:49:00.000-08:00').toDate()
  },
]

module.exports = {
  week1Appointments,
}
