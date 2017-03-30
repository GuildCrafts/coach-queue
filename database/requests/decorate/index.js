const db = require( '../../index' )

const Event = require( '../../events' )
const Team = require( '../../teams' )
const Player = require( '../../players' )
const Goal = require( '../../goals' )

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

const decorate = requests =>
  getEvents( requests )
    .then( mapEventsToRequests )
    .then( getTeams )
    .then( mapTeamsToRequests )
    .then( getPlayers )
    .then( mapPlayersToRequests )
    .then( getGoals )
    .then( mapGoalsToRequests )
    .then( mapEscalationTallyToRequests )

module.exports = decorate
