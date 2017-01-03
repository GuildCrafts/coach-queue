const extractCalendarIds = (gCalListResponse) => {
  return [gCalListResponse.items[0].id]
};

const makeCalendarEvent = (startTime, endTime, summary) => {
  return {
    'summary': 'Coaching session with A-HUMAN',
    'description': 'Go get \'em champ',
    'start': {
      'dateTime': startTime,
      'timeZone': 'America/Los_Angeles'
    },
    'end': {
      'dateTime': endTime,
      'timeZone': 'America/Los_Angeles'
    }
  }
};

module.exports = {extractCalendarIds, makeCalendarEvent};
