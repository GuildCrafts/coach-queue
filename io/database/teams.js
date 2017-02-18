const knex = require('./knex')
const { createRecord } = require('./utilities')

const addTeams = teams =>
  Promise.all( teams.map( team => createRecord('teams', team) ))

const associateLearnersWithTeams = teams =>
  Promise.all( teams.map( team => createRecord('learner-teams', team) ))

const addLearners = handles =>
  Promise.all( handles.map( handle => createRecord('learners', handle) ))

const getTeamMemberHandles = handle =>
  knex.raw(
    `SELECT handle
     FROM learners
     INNER JOIN (SELECT lt.*
      FROM "learner-teams" lt
      INNER JOIN (SELECT *
        FROM learners
		    INNER JOIN "learner-teams" lt
		    ON learners.id = lt.learner_id::int
		    WHERE handle = '${handle}') foo
      ON lt.team_id = foo.team_id) boo
    ON boo.learner_id::int = learners.id;`
  )

module.exports = { addTeams, associateLearnersWithTeams, addLearners, getTeamMemberHandles }
