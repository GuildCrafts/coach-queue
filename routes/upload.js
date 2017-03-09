const express = require('express')
const router = express.Router()
const parse = require('csv-parse/lib/sync')
const db = require('../io/database/teams')

router.post('/', (request, response) => {
  const data = request.files.teams.data.toString()
  const learners = parseLearners(data)
  const teams = extractTeams(learners)
  const cycleHandles = extractUniqueHandles(learners) // array of strings

  db.addTeams( teams )
    .then( setTeamIds(learners) )
    .then( _ => db.getAllLearners() )
    .then( findNewLearners(cycleHandles) )
    .then( db.addLearners )
    .then( _ => db.getAllLearners() )
    .then( setLearnerIds(learners) )
    .then( extractLearnerAndTeamIds )
    .then( db.associateLearnersWithTeams )
    .then( db.addUploads(teams[0].cycle) )
    .then( learnerTeams => response.json(learnerTeams) )
})

router.get('/getUploadTime', (request, response) =>
  db.getUploadTimeByCycle().then(uploadedTime => response.send(uploadedTime)))

const setLearnerIds = learners => addedLearners => {
  addedLearners.forEach( addedLearner => {
    learners.forEach( (learner, index) => {
      if ( addedLearner.handle === learner.handle ) {
        learner.learner_id = addedLearner.id
      }
    })
  })

  return learners
}

const setTeamIds = learners => addedTeams => {
  addedTeams.forEach( team => {
    learners.forEach( learner => {
      if ( team.team === learner.team ) {
        learner.team_id = team.id
      }
    })
  })

  return learners
}

const removeDuplicateTeams = teams =>
  teams.reduce( (uniqueTeams, currentTeam) => {
    if ( !uniqueTeams.find( teamsAreTheSame(currentTeam) )) {
      uniqueTeams.push(currentTeam)
    }
    return uniqueTeams
  }, [])

const teamsAreTheSame = currentTeam => uniqueTeam =>
  uniqueTeam.team === currentTeam.team &&
  uniqueTeam.cycle === currentTeam.cycle

const extractTeams = learners =>
  removeDuplicateTeams(learners.map( learner =>
    ({ team: learner.team, cycle: learner.cycle })
  ))

const extractUniqueHandles = learners =>
  learners.reduce( (uniqueHandles, learner) => {
    if( !uniqueHandles.includes(learner.handle) ){
      uniqueHandles.push(learner.handle)
    }
    return uniqueHandles
  }, [] )

const findNewLearners = cycleHandles => allLearners => {
  const existingHandles = allLearners.map( learner => learner.handle )
  return cycleHandles.filter(
    cycleHandle => !existingHandles.includes( cycleHandle )
  )
}
  // cycleHandles.filter( cycleHandle => {
  //   let unique = true
  //   allLearners.forEach( learner => {
  //     if( learner.handle === cycleHandle){
  //       unique = false
  //     }
  //   })
  //   return unique
  // })


const extractLearnerAndTeamIds = learners =>
  learners.map( learner =>
    ({ learner_id: learner.learner_id, team_id: learner.team_id })
  )

const parseLearners = csvString =>
  parse(csvString, {columns: true}).map( record => {
    return {
      handle: record.handle,
      team: record.projectName,
      cycle: record.cycleNumber
    }
  })

module.exports = router
