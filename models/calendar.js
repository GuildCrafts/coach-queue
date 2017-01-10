const extractCalendarIds = (gCalListResponse) => {
  return gCalListResponse.items.filter((item) => item.primary).map(i => i.id)
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

const extractEmailFromGoogleSession = (session) => {
  return session.passport.user._json.email
}

module.exports = {extractCalendarIds, makeCalendarEvent, extractEmailFromGoogleSession};
