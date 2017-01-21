const CANCELED_APPOINTMENT_PATH = '/calendar/cancel_appointment'
const deleteGoogleEventUrl = (calendarId, eventId) =>
  `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`

module.exports = {CANCELED_APPOINTMENT_PATH, deleteGoogleEventUrl}
