const express = require('express')
const router = express.Router()
const parse = require('csv-parse/lib/sync')
const { addTeams } = require('../io/database/teams')
const { addLearners } = require('../io/database/learners')
const { addLearnerTeams } = require('../io/database/learner_teams')

router.post('/', (request, response) => {
  const data = request.files.teams.data.toString()
  const records = parse(data, {columns: true})
  const learners = records.map( record => {
    return {
      handle: record.handle,
      team: record.projectName,
      cycle: record.cycleNumber
    }
  })

  let teams = learners.map( learner =>
    ({ team: learner.team, cycle: learner.cycle })
  )
  teams = removeDuplicateTeams( teams )
  let handles = learners.map( learner =>
    ({ handle: learner.handle })
  )

  addTeams( teams )
    .then( addedTeams => {
      setLearnersTeamIds( addedTeams, learners )
      addLearners(handles).then( addedLearners => {
        setLearnersLearnerIds( addedLearners, learners )
        addLearnerTeams(learners.map( learner =>
          ({
            learner_id: learner.learner_id,
            team_id: learner.team_id
          })
        )).then( results => response.json(results) )
      })
    })
})

const setLearnersLearnerIds = ( addedLearners, learners ) => {
  addedLearners.forEach( addedLearner => {
    learners.forEach( (learner, index) => {
      if ( addedLearner.handle === learner.handle ) {
        learner.learner_id = addedLearner.id
      }
    })
  })
}

const setLearnersTeamIds = ( teams, learners ) => {
  teams.forEach( team => {
    learners.forEach( (learner, index) => {
      if ( team.team === learner.team ) {
        learner.team_id = team.id
      }
    })
  })
}

const removeDuplicateTeams = arrayOfObjects =>
  arrayOfObjects.reduce( (uniqueObjects, currentObject) => {
    if ( !uniqueObjects.find( uniqueObject =>
        uniqueObject.team === currentObject.team &&
        uniqueObject.cycle === currentObject.cycle
    )) {
      uniqueObjects.push(currentObject)
    }
    return uniqueObjects
  }, [])

module.exports = router
