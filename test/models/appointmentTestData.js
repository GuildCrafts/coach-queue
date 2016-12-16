const moment = require('moment')

const busyTimeData = [ 
  { start: '2016-12-14T18:30:00Z', end: '2016-12-14T19:30:00Z' },
  { start: '2016-12-14T23:00:00Z', end: '2016-12-15T00:00:00Z' },
]

const freeTimeData = [
  { start: moment.parseZone("2016-12-14T09:00:00.000-08:00"),
    end: moment.parseZone("2016-12-14T10:30:00.000-08:00") },
  { start: moment.parseZone("2016-12-14T11:30:00.000-08:00"),
    end: moment.parseZone("2016-12-14T15:00:00.000-08:00") },
  { start: moment.parseZone("2016-12-14T16:00:00.000-08:00"),
    end: moment.parseZone("2016-12-14T17:30:00.000-08:00") }
]

const freeTimeData2 = [
  { start: moment.parseZone("2016-12-14T09:00:00.000-08:00"),
    end: moment.parseZone("2016-12-14T09:15:00.000-08:00") },
  { start: moment.parseZone("2016-12-14T11:30:00.000-08:00"),
    end: moment.parseZone("2016-12-14T13:00.000-08:00") },
  { start: moment.parseZone("2016-12-14T16:00:00.000-08:00"),
    end: moment.parseZone("2016-12-14T17:30:00.000-08:00") }
]

module.exports = { 
  busyTimeData, 
  freeTimeData, 
  freeTimeData2
}
