const extractCalendarIds = (gCalListResponse) => {
  return [gCalListResponse.items[0].id]
};

const makeCalendarEvent = (startTime, endTime, menteeHandle1, menteeHandle2) => {
  return {
    'summary': `Coaching with ${menteeHandle1} & ${menteeHandle2}` ,
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
