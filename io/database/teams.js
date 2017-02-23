const knex = require('./knex')
const { createRecord } = require('./utilities')

const addTeams = teams =>
  Promise.all( teams.map( team => createRecord('teams', team) ))

const associateLearnersWithTeams = teams =>
  Promise.all( teams.map( team => createRecord('learner_teams', team) ))

const addLearners = handles =>
  Promise.all( handles.map( handle => createRecord('learners', handle) ))

const deleteLearners = () =>
 knex.raw(`DELETE FROM learners;`)

const getTeamMemberHandles = handle =>
  knex.raw(
    `SELECT handle
     FROM learners
     INNER JOIN (SELECT lt.*
      FROM learner_teams lt
      INNER JOIN (SELECT *
        FROM learners
		    INNER JOIN learner_teams lt
		    ON learners.id = lt.learner_id::int
		    WHERE handle = '${handle}') foo
      ON lt.team_id = foo.team_id) boo
    ON boo.learner_id::int = learners.id;`
  )

const getTeamIdByHandle = handle =>
  knex.select('team_id')
    .from('learners')
    .join('learner_teams', 'learners.id', 'learner_teams.learner_id')
    .where('handle', handle)

module.exports = {
  addTeams,
  associateLearnersWithTeams,
  addLearners,
  getTeamMemberHandles,
  getTeamIdByHandle,
  deleteLearners
}
