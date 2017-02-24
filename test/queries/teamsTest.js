const { expect, app, chai } = require('../setup')
const {
  getTeamIdByHandle,
  addLearners,
  deleteLearners,
  associateLearnersWithTeams,
  deleteAllTeams,
  getAllTeamsByCycle,
  addTeams,
  getCycleByTeamId
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

describe('getCycleByTeamId()', () => {

  beforeEach( () => deleteAllTeams() )

  it( 'should return empty array if there is no matching teamId', () => {
    getCycleByTeamId(1).then( cycle => {
      expect(cycle).to.eql([])
    })
  })

  it( 'should return cycle matching teamId', () => {
    const demoTeams = [
      { team: 'noisy gloopflogs', cycle: 109 },
      { team: 'annoying flatbread', cycle: 109},
      { team: 'beautiful short-shorts', cycle: 108}
    ]
    return addTeams(demoTeams)
      .then( teams => teams[0].id )
      .then( id => getCycleByTeamId(id) )
      .then( cycle => {
        expect( +cycle[0].cycle ).to.equal(109)
      })
  })
})

describe('getAllTeamsByCycle()', () => {

  beforeEach( () => deleteAllTeams() )

  it( 'should return an empty array if no teams are in db', () => {
    return getAllTeamsByCycle(109).then( teams => {
      expect(teams.length).to.equal(0)
    })
  })

  it( 'should return an array of all teams', () => {
    const demoTeams = [
      { team: 'noisy gloopflogs', cycle: 109 },
      { team: 'annoying flatbread', cycle: 109},
      { team: 'beautiful short-shorts', cycle: 108}
    ]
    return addTeams(demoTeams)
      .then( addedTeams => getAllTeamsByCycle(109) )
      .then( teams => {
        expect(teams.length).to.equal(2)
        expect(teams[0].team).to.equal('noisy gloopflogs')
        expect(teams[1].team).to.equal('annoying flatbread')
      })
  })
})
