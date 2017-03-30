const express = require( 'express' )
const router = express.Router()

const {
  unresolvedRequests, getEvents, mapEventsToRequests, getTeams,
  mapTeamsToRequests, getPlayers, mapPlayersToRequests, getGoals,
  mapGoalsToRequests, mapEscalationTallyToRequests, mapAgeToRequests
} = require( './data' )

router.get( '/', ( request, response ) => {
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
    .then( requests => response.render( 'coach/index', { requests } ))
})

module.exports = router
