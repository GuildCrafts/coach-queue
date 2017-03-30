const moment = require( 'moment' )
const db = require( '../../database/' )
const { Request, Event, Team, Player, Goal } = db

const unresolvedRequests = () => Request.unresolved()

const getEvents = requests =>
  Promise.all([
    requests,
    ...requests.map( request => Event.forRequest( request.id ))
  ])

const mapEventsToRequests = ([ requests, ...events ]) =>
  requests.map( (request, index) =>
    Object.assign( {}, request, { events: events[ index ] })
  )

const getTeams = requests =>
  Promise.all([
    requests,
    ...requests.map( request => Team.forRequest( request.id ))
  ])

const mapTeamsToRequests = ([ requests, ...teams ]) =>
  requests.map( (request, index) =>
    Object.assign( {}, request, { team: teams[ index ] })
  )

const getPlayers = requests =>
  Promise.all([
    requests,
    ...requests.map( request => Player.forTeam( request.team_id ))
  ])

const mapPlayersToRequests = ([ requests, ...players ]) =>
  requests.map( (request, index ) => Object.assign( {}, request, { players: players[ index ] }))

const getGoals = requests =>
  Promise.all([
    requests,
    ...requests.map( request => Goal.forTeam( request.team_id ))
  ])

const mapGoalsToRequests = ([ requests, ...goals ]) =>
  requests.map( (request, index ) => Object.assign( {}, request, { goal: goals[ index ]}))

const escalationTally = ({ events }) =>
  events.filter( event => event.name === 'escalate' ).length

const mapEscalationTallyToRequests = requests =>
  requests.map( request =>
    Object.assign( {}, request, { escalations: escalationTally( request ) })
  )

const mapAgeToRequests = requests =>
  requests.map( request =>
    Object.assign( {}, request, { age: moment( request.created_at ).fromNow() })
  )

const getRequests = () =>
  unresolvedRequests()
    .then( getEvents )
    .then( mapEventsToRequests )
    .then( getTeams )
    .then( mapTeamsToRequests )
    .then( getPlayers )
    .then( mapPlayersToRequests )
    .then( getGoals )
    .then( mapGoalsToRequests )
    .then( mapEscalationTallyToRequests )
    .then( mapAgeToRequests )

module.exports = { getRequests }
