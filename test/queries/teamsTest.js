const { expect } = require('../setup')
const {
  getTeamIdByHandle,
  addLearners,
  deleteLearners,
  associateLearnersWithTeams
} = require('../../io/database/teams')

describe('addLearners()', () => {

  beforeEach( () =>
    deleteLearners()
  )

  context('when adding learners to the learners table', () => {
    it('should return addedLearner handle and id', () => {
      const learner = [{ handle: 'nodatall' }]
      return addLearners(learner)
        .then( addedLearner => {
          expect(addedLearner[0].handle).to.equal('nodatall')
          expect(addedLearner[0].id).to.be.a('number')
        })
    })
  })

})

describe('associateLearnersWithTeams()', () => {

  context('when inserting new learner_teams', () => {
    it('should return added team_id and learner_id', () => {
      const learnerTeam = [{
        learner_id: 1,
        team_id: 1
      }]

      return associateLearnersWithTeams(learnerTeam).then( addedLearnerTeam => {
        expect(addedLearnerTeam[0].learner_id).to.equal(1)
        expect(addedLearnerTeam[0].team_id).to.equal(1)
      })
    })
  })
})

describe('getTeamIdByHandle()', () => {

  beforeEach( () =>
    deleteLearners()
  )

  context('when passed a valid handle', () => {
    const learner = [{ handle: 'nodatall' }]

    it('should return a team id', () => {
      return addLearners(learner)
        .then( addedLearner => {
          const learnerTeam = [{
            learner_id: addedLearner[0].id,
            team_id: 1
          }]
          return associateLearnersWithTeams(learnerTeam)
        })
        .then( _ => getTeamIdByHandle('nodatall') )
        .then( teamId => {
          expect(teamId[0].team_id).to.equal(1)
        })
    })
  })

})
