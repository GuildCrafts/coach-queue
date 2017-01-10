const {expect} = require('../setup');
const {extractCalendarIds} = require('../../models/calendar');

const mockGoogleCalendarResponse =
{ kind: 'calendar#calendarList',
  etag: '"p33gfh9lhr6rd20g"',
  nextSyncToken: 'COD4prHZttECEhdwdW5pdEBsZWFybmVyc2d1aWxkLm9yZw==',
  items:
   [ { kind: 'calendar#calendarListEntry',
       etag: '"1483997611007000"',
       id: 'learnersguild.org_2d3739303336343633373230@resource.calendar.google.com',
       summary: 'Oakland Conference Room',
       timeZone: 'America/Los_Angeles',
       selected: true,
       accessRole: 'reader',
       defaultReminders: [] },
     { kind: 'calendar#calendarListEntry',
       etag: '"1480697841395000"',
       id: 'foobar@learnersguild.org',
       summary: 'foobar@learnersguild.org',
       timeZone: 'America/Los_Angeles',
       selected: true,
       accessRole: 'owner',
       primary: true },
     { kind: 'calendar#calendarListEntry',
       etag: '"1480961634455000"',
       id: 'learnersguild.org_6v6oceh3v1rkg19v2ei2sqv67c@group.calendar.google.com',
       summary: 'Player Support',
       location: 'Oakland',
       timeZone: 'America/Los_Angeles',
       selected: true,
       accessRole: 'owner',
       defaultReminders: [] }] }

describe('extractCalendarIds', () => {
  it('should return the primary emails from the list of emails', () => {
    expect(extractCalendarIds(mockGoogleCalendarResponse)).to.eql(['foobar@learnersguild.org'])
  })
})
