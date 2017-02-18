const express = require('express')
const router = express.Router()
const parse = require('csv-parse/lib/sync')
const db = require('../io/database/teams')

router.post('/', (request, response) => {
  const data = request.files.teams.data.toString()
  const learners = parseLearners(data)
  const teams = extractTeams(learners)
  const handles = extractHandles(learners)

  db.addTeams( teams )
    .then( addedTeams => setTeamIds(addedTeams, learners) )
    .then( learners => db.addLearners(handles) )
    .then( addedLearners => setLearnerIds(addedLearners, learners) )
    .then( extractLearnerAndTeamIds )
    .then( learnAndTeamIds => db.associateLearnersWithTeams(learnAndTeamIds) )
    .then( learnerTeams => response.json(learnerTeams) )
})

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

const extractTeams = learnersList =>
  removeDuplicateTeams(learnersList.map( learner =>
    ({ team: learner.team, cycle: learner.cycle })
  ))

const extractHandles = learnersList =>
  handles = learnersList.map( learner =>
    ({ handle: learner.handle })
  )

const extractLearnerAndTeamIds = learners =>
  learners.map( learner =>
    ({ learner_id: learner.learner_id, team_id: learner.team_id })
  )

const parseLearners = csvString => {
  const records = parse(csvString, {columns: true})
  return records.map( record => {
    return {
      handle: record.handle,
      team: record.projectName,
      cycle: record.cycleNumber
    }
  })
}

const setTeamIds = ( addedTeams, learners ) => {
  addedTeams.forEach( team => {
    learners.forEach( learner => {
      if ( team.team === learner.team ) {
        learner.team_id = team.id
      }
    })
  })

  return learners
}

const setLearnerIds = ( addedLearners, learners ) => {
  addedLearners.forEach( addedLearner => {
    learners.forEach( (learner, index) => {
      if ( addedLearner.handle === learner.handle ) {
        learner.learner_id = addedLearner.id
      }
    })
  })

  return learners
}

module.exports = router
